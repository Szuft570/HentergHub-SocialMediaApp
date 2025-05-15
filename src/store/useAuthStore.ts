import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { createClient } from '@supabase/supabase-js';
import { User } from '../types';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<User>) => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updatePassword: (password: string) => Promise<void>;
  deleteAccount: () => Promise<void>;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,

      login: async (email: string, password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signInWithPassword({
            email,
            password,
          });

          if (error) throw error;

          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          set({
            user: profile,
            isAuthenticated: true,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      register: async (email: string, password: string, username: string) => {
        set({ isLoading: true, error: null });
        try {
          const { data, error } = await supabase.auth.signUp({
            email,
            password,
          });

          if (error) throw error;

          if (data.user) {
            const profile = {
              id: data.user.id,
              username,
              email,
              avatar: `https://api.dicebear.com/7.x/avatars/svg?seed=${username}`,
              darkMode: false,
              status: 'online',
              lastSeen: new Date(),
              createdAt: new Date(),
              isVerified: false,
              followers: 0,
              following: 0,
              settings: {
                privacy: {
                  profileVisibility: 'public',
                  storyVisibility: 'followers',
                  messagePrivacy: 'everyone',
                  showOnlineStatus: true,
                  showReadReceipts: true,
                },
                notifications: {
                  posts: true,
                  stories: true,
                  messages: true,
                  calls: true,
                  mentions: true,
                },
                content: {
                  autoplayVideos: true,
                  saveData: false,
                  defaultPostVisibility: 'public',
                },
              },
            };

            const { error: profileError } = await supabase
              .from('profiles')
              .insert([profile]);

            if (profileError) throw profileError;

            set({
              user: profile as User,
              isAuthenticated: true,
              isLoading: false,
            });
          }
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      logout: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.signOut();
          if (error) throw error;

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      updateProfile: async (data: Partial<User>) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('profiles')
            .update(data)
            .eq('id', get().user?.id);

          if (error) throw error;

          set(state => ({
            user: state.user ? { ...state.user, ...data } : null,
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      resetPassword: async (email: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.resetPasswordForEmail(email);
          if (error) throw error;
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      updatePassword: async (password: string) => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase.auth.updateUser({
            password,
          });
          if (error) throw error;
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },

      deleteAccount: async () => {
        set({ isLoading: true, error: null });
        try {
          const { error } = await supabase
            .from('profiles')
            .delete()
            .eq('id', get().user?.id);

          if (error) throw error;

          await supabase.auth.admin.deleteUser(get().user?.id as string);

          set({
            user: null,
            isAuthenticated: false,
            isLoading: false,
          });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'An error occurred',
            isLoading: false,
          });
        }
      },
    }),
    {
      name: 'auth-storage',
    }
  )
);

export default useAuthStore;