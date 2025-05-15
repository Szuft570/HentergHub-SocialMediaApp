/*
  # Initial Schema Setup for HenterHub

  1. Tables
    - profiles: User profiles and settings
    - posts: User posts and media content
    - stories: Temporary story content
    - conversations: Chat conversations
    - messages: Chat messages
    - channels: Broadcast channels
    - events: User events
    - comments: Post comments
    - notifications: User notifications

  2. Security
    - Enable RLS on all tables
    - Add policies for data access
    - Set up proper relationships and constraints
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  avatar text,
  bio text,
  website text,
  location text,
  dark_mode boolean DEFAULT false,
  status text DEFAULT 'offline',
  last_seen timestamptz,
  created_at timestamptz DEFAULT now(),
  is_verified boolean DEFAULT false,
  followers uuid[] DEFAULT '{}'::uuid[],
  following uuid[] DEFAULT '{}'::uuid[],
  settings jsonb DEFAULT '{
    "privacy": {
      "profileVisibility": "public",
      "storyVisibility": "followers",
      "messagePrivacy": "everyone",
      "showOnlineStatus": true,
      "showReadReceipts": true
    },
    "notifications": {
      "posts": true,
      "stories": true,
      "messages": true,
      "calls": true,
      "mentions": true
    },
    "content": {
      "autoplayVideos": true,
      "saveData": false,
      "defaultPostVisibility": "public"
    }
  }'::jsonb
);

-- Create posts table
CREATE TABLE IF NOT EXISTS posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  content text,
  media_urls text[],
  caption text,
  location text,
  tags text[],
  mentions text[],
  likes integer DEFAULT 0,
  comments integer DEFAULT 0,
  shares integer DEFAULT 0,
  visibility text DEFAULT 'public',
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz,
  ai_tags text[],
  monetization jsonb
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  media_url text NOT NULL,
  caption text,
  location text,
  mentions text[],
  filters jsonb,
  stickers jsonb,
  poll jsonb,
  viewers uuid[],
  created_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL
);

-- Create conversations table
CREATE TABLE IF NOT EXISTS conversations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  type text NOT NULL,
  participants uuid[] NOT NULL,
  name text,
  avatar text,
  settings jsonb DEFAULT '{
    "theme": "default",
    "notifications": true,
    "encryption": true
  }'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create messages table
CREATE TABLE IF NOT EXISTS messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id uuid REFERENCES conversations(id) ON DELETE CASCADE,
  sender_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text,
  type text NOT NULL,
  media_url text,
  reply_to uuid REFERENCES messages(id),
  reactions jsonb DEFAULT '[]'::jsonb,
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz,
  status text DEFAULT 'sent',
  translation jsonb
);

-- Create channels table
CREATE TABLE IF NOT EXISTS channels (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text,
  avatar text,
  subscribers integer DEFAULT 0,
  visibility text DEFAULT 'public',
  settings jsonb DEFAULT '{
    "messagePermissions": "everyone",
    "joinApproval": false,
    "contentModeration": true
  }'::jsonb,
  created_at timestamptz DEFAULT now()
);

-- Create events table
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  creator_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  title text NOT NULL,
  description text,
  type text NOT NULL,
  start_date timestamptz NOT NULL,
  end_date timestamptz NOT NULL,
  location text,
  cover_image text,
  capacity integer,
  attendees uuid[],
  interested uuid[],
  visibility text DEFAULT 'public',
  created_at timestamptz DEFAULT now()
);

-- Create comments table
CREATE TABLE IF NOT EXISTS comments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id uuid REFERENCES posts(id) ON DELETE CASCADE,
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  content text NOT NULL,
  likes integer DEFAULT 0,
  replies integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  edited_at timestamptz
);

-- Create notifications table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  type text NOT NULL,
  reference_id uuid NOT NULL,
  content text NOT NULL,
  read boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE posts ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE channels ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone"
  ON profiles FOR SELECT
  USING (
    (settings->>'privacy.profileVisibility')::text = 'public'
    OR id = auth.uid()
    OR auth.uid() = ANY(followers)
  );

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (id = auth.uid());

-- Create policies for posts
CREATE POLICY "Posts are viewable by everyone"
  ON posts FOR SELECT
  USING (
    visibility = 'public'
    OR user_id = auth.uid()
    OR user_id = ANY(
      SELECT unnest(following)
      FROM profiles
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create posts"
  ON posts FOR INSERT
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own posts"
  ON posts FOR UPDATE
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own posts"
  ON posts FOR DELETE
  USING (user_id = auth.uid());

-- Create policies for stories
CREATE POLICY "Stories are viewable by followers"
  ON stories FOR SELECT
  USING (
    user_id = auth.uid()
    OR user_id = ANY(
      SELECT unnest(following)
      FROM profiles
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Users can create stories"
  ON stories FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Create policies for conversations
CREATE POLICY "Users can see their conversations"
  ON conversations FOR SELECT
  USING (auth.uid() = ANY(participants));

CREATE POLICY "Users can create conversations"
  ON conversations FOR INSERT
  WITH CHECK (auth.uid() = ANY(participants));

-- Create policies for messages
CREATE POLICY "Users can see messages in their conversations"
  ON messages FOR SELECT
  USING (
    sender_id = auth.uid()
    OR EXISTS (
      SELECT 1 FROM conversations
      WHERE id = messages.conversation_id
      AND auth.uid() = ANY(participants)
    )
  );

CREATE POLICY "Users can send messages"
  ON messages FOR INSERT
  WITH CHECK (sender_id = auth.uid());

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);
CREATE INDEX IF NOT EXISTS idx_profiles_followers ON profiles USING GIN(followers);
CREATE INDEX IF NOT EXISTS idx_profiles_following ON profiles USING GIN(following);
CREATE INDEX IF NOT EXISTS idx_posts_user_id ON posts(user_id);
CREATE INDEX IF NOT EXISTS idx_posts_created_at ON posts(created_at);
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_stories_expires_at ON stories(expires_at);
CREATE INDEX IF NOT EXISTS idx_conversations_participants ON conversations USING GIN(participants);
CREATE INDEX IF NOT EXISTS idx_messages_conversation_id ON messages(conversation_id);
CREATE INDEX IF NOT EXISTS idx_messages_created_at ON messages(created_at);
CREATE INDEX IF NOT EXISTS idx_notifications_user_id ON notifications(user_id);
CREATE INDEX IF NOT EXISTS idx_notifications_created_at ON notifications(created_at);