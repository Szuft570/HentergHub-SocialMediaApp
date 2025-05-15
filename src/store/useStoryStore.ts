import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Story } from '../types';
import useAuthStore from './useAuthStore';

interface StoryState {
  stories: Story[];
  addStory: (mediaUrl: string, mediaType: 'image' | 'video', caption?: string) => Story;
  viewStory: (storyId: string) => void;
  getVisibleStories: () => Story[];
  getUserStories: (userId: string) => Story[];
  getActiveStories: () => Record<string, Story[]>;
}

// Stories expire after 24 hours
const EXPIRY_TIME = 24 * 60 * 60 * 1000;

const useStoryStore = create<StoryState>()(
  persist(
    (set, get) => ({
      stories: [
        {
          id: '1',
          userId: '2',
          mediaUrl: 'https://images.pexels.com/photos/2253275/pexels-photo-2253275.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          mediaType: 'image',
          caption: 'Beautiful sunset today!',
          timestamp: new Date(Date.now() - 3600000),
          expiresAt: new Date(Date.now() - 3600000 + EXPIRY_TIME),
          viewers: []
        },
        {
          id: '2',
          userId: '3',
          mediaUrl: 'https://images.pexels.com/photos/1181672/pexels-photo-1181672.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          mediaType: 'image',
          caption: 'Working on a new project',
          timestamp: new Date(Date.now() - 7200000),
          expiresAt: new Date(Date.now() - 7200000 + EXPIRY_TIME),
          viewers: []
        }
      ],
      
      addStory: (mediaUrl, mediaType, caption) => {
        const user = useAuthStore.getState().user;
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const now = new Date();
        const expiryDate = new Date(now.getTime() + EXPIRY_TIME);
        
        const newStory: Story = {
          id: uuidv4(),
          userId: user.id,
          mediaUrl,
          mediaType,
          caption,
          timestamp: now,
          expiresAt: expiryDate,
          viewers: []
        };
        
        set(state => ({
          stories: [...state.stories, newStory]
        }));
        
        return newStory;
      },
      
      viewStory: (storyId) => {
        const user = useAuthStore.getState().user;
        if (!user) {
          return;
        }
        
        set(state => ({
          stories: state.stories.map(story => 
            story.id === storyId && !story.viewers.includes(user.id)
              ? { ...story, viewers: [...story.viewers, user.id] }
              : story
          )
        }));
      },
      
      getVisibleStories: () => {
        const now = new Date();
        return get().stories.filter(story => story.expiresAt > now);
      },
      
      getUserStories: (userId) => {
        const stories = get().getVisibleStories();
        return stories.filter(story => story.userId === userId);
      },
      
      getActiveStories: () => {
        const visibleStories = get().getVisibleStories();
        
        return visibleStories.reduce((acc, story) => {
          if (!acc[story.userId]) {
            acc[story.userId] = [];
          }
          acc[story.userId].push(story);
          return acc;
        }, {} as Record<string, Story[]>);
      }
    }),
    {
      name: 'messaging-stories-storage',
    }
  )
);

export default useStoryStore;