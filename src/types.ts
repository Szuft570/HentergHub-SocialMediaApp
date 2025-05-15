export interface User {
  id: string;
  username: string;
  email: string;
  avatar: string;
  bio?: string;
  website?: string;
  location?: string;
  darkMode: boolean;
  status: 'online' | 'away' | 'offline';
  lastSeen: Date | null;
  createdAt: Date;
  isVerified: boolean;
  followers: number;
  following: number;
  settings: UserSettings;
}

export interface UserSettings {
  privacy: {
    profileVisibility: 'public' | 'private' | 'followers';
    storyVisibility: 'public' | 'followers' | 'close-friends';
    messagePrivacy: 'everyone' | 'followers' | 'nobody';
    showOnlineStatus: boolean;
    showReadReceipts: boolean;
  };
  notifications: {
    posts: boolean;
    stories: boolean;
    messages: boolean;
    calls: boolean;
    mentions: boolean;
  };
  content: {
    autoplayVideos: boolean;
    saveData: boolean;
    defaultPostVisibility: 'public' | 'followers' | 'private';
  };
}

export interface Post {
  id: string;
  userId: string;
  type: 'photo' | 'video' | 'reel' | 'article';
  content: string;
  mediaUrls: string[];
  caption: string;
  location?: string;
  tags: string[];
  mentions: string[];
  likes: number;
  comments: number;
  shares: number;
  visibility: 'public' | 'followers' | 'private';
  createdAt: Date;
  editedAt?: Date;
  aiTags?: string[];
  monetization?: {
    enabled: boolean;
    type: 'subscription' | 'pay-per-view' | 'tips';
    price?: number;
  };
}

export interface Story {
  id: string;
  userId: string;
  type: 'photo' | 'video';
  mediaUrl: string;
  caption?: string;
  location?: string;
  mentions: string[];
  filters: StoryFilter[];
  stickers: Sticker[];
  poll?: Poll;
  viewers: string[];
  createdAt: Date;
  expiresAt: Date;
}

export interface StoryFilter {
  id: string;
  type: string;
  settings: Record<string, any>;
}

export interface Sticker {
  id: string;
  type: 'emoji' | 'gif' | 'text' | 'mention' | 'location';
  content: string;
  position: { x: number; y: number };
  scale: number;
  rotation: number;
}

export interface Poll {
  question: string;
  options: PollOption[];
  expiresAt: Date;
}

export interface PollOption {
  id: string;
  text: string;
  votes: number;
  voters: string[];
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  type: 'text' | 'image' | 'video' | 'audio' | 'file' | 'location';
  mediaUrl?: string;
  replyTo?: string;
  reactions: MessageReaction[];
  createdAt: Date;
  editedAt?: Date;
  status: 'sent' | 'delivered' | 'read';
  translation?: {
    text: string;
    language: string;
  };
}

export interface MessageReaction {
  userId: string;
  emoji: string;
  createdAt: Date;
}

export interface Conversation {
  id: string;
  type: 'direct' | 'group' | 'channel';
  participants: string[];
  name?: string;
  avatar?: string;
  lastMessage?: Message;
  unreadCount: number;
  settings: {
    theme: string;
    notifications: boolean;
    encryption: boolean;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Channel {
  id: string;
  creatorId: string;
  name: string;
  description: string;
  avatar: string;
  subscribers: number;
  visibility: 'public' | 'private';
  settings: {
    messagePermissions: 'everyone' | 'admins' | 'verified';
    joinApproval: boolean;
    contentModeration: boolean;
  };
  createdAt: Date;
}

export interface Event {
  id: string;
  creatorId: string;
  title: string;
  description: string;
  type: 'online' | 'in-person' | 'hybrid';
  startDate: Date;
  endDate: Date;
  location?: string;
  coverImage?: string;
  capacity?: number;
  attendees: string[];
  interested: string[];
  visibility: 'public' | 'private' | 'invite-only';
  createdAt: Date;
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  content: string;
  likes: number;
  replies: number;
  createdAt: Date;
  editedAt?: Date;
}

export interface Notification {
  id: string;
  userId: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'message' | 'event';
  referenceId: string;
  content: string;
  read: boolean;
  createdAt: Date;
}