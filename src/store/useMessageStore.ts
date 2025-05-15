import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { v4 as uuidv4 } from 'uuid';
import { Message, Conversation } from '../types';
import useAuthStore from './useAuthStore';

interface MessageState {
  messages: Record<string, Message[]>;
  conversations: Conversation[];
  activeConversationId: string | null;
  sendMessage: (content: string, receiverId: string, type?: Message['type'], mediaUrl?: string) => Message;
  markAsRead: (messageIds: string[]) => void;
  deleteMessage: (messageId: string, conversationId: string) => void;
  editMessage: (messageId: string, conversationId: string, newContent: string) => void;
  setActiveConversation: (conversationId: string) => void;
  getConversation: (participantId: string) => Conversation;
  getOrCreateConversation: (participantId: string) => Conversation;
}

const useMessageStore = create<MessageState>()(
  persist(
    (set, get) => ({
      messages: {},
      conversations: [],
      activeConversationId: null,
      
      sendMessage: (content, receiverId, type = 'text', mediaUrl) => {
        const user = useAuthStore.getState().user;
        if (!user) {
          throw new Error('User not authenticated');
        }
        
        const newMessage: Message = {
          id: uuidv4(),
          senderId: user.id,
          receiverId,
          groupId: null,
          content,
          type,
          mediaUrl,
          timestamp: new Date(),
          status: 'sent',
          isEdited: false
        };
        
        // Get or create conversation
        const conversation = get().getOrCreateConversation(receiverId);
        
        // Update messages
        set(state => {
          const conversationMessages = state.messages[conversation.id] || [];
          
          // Update the conversation with last message
          const updatedConversations = state.conversations.map(conv => 
            conv.id === conversation.id 
              ? { 
                  ...conv, 
                  lastMessage: newMessage,
                  updatedAt: new Date()
                }
              : conv
          );
          
          return {
            messages: {
              ...state.messages,
              [conversation.id]: [...conversationMessages, newMessage]
            },
            conversations: updatedConversations
          };
        });
        
        return newMessage;
      },
      
      markAsRead: (messageIds) => {
        set(state => {
          const updatedMessages = { ...state.messages };
          
          Object.keys(updatedMessages).forEach(convId => {
            updatedMessages[convId] = updatedMessages[convId].map(msg => 
              messageIds.includes(msg.id) 
                ? { ...msg, status: 'read' as const } 
                : msg
            );
          });
          
          // Update unread count for conversations
          const updatedConversations = state.conversations.map(conv => {
            const unreadCount = (updatedMessages[conv.id] || [])
              .filter(msg => msg.receiverId === useAuthStore.getState().user?.id && msg.status !== 'read')
              .length;
            
            return {
              ...conv,
              unreadCount
            };
          });
          
          return { 
            messages: updatedMessages,
            conversations: updatedConversations
          };
        });
      },
      
      deleteMessage: (messageId, conversationId) => {
        set(state => {
          const conversationMessages = state.messages[conversationId] || [];
          const updatedMessages = conversationMessages.filter(msg => msg.id !== messageId);
          
          // Get last message
          const lastMessage = updatedMessages.length > 0 
            ? updatedMessages[updatedMessages.length - 1] 
            : undefined;
          
          // Update conversation
          const updatedConversations = state.conversations.map(conv => 
            conv.id === conversationId 
              ? { 
                  ...conv, 
                  lastMessage
                }
              : conv
          );
          
          return {
            messages: {
              ...state.messages,
              [conversationId]: updatedMessages
            },
            conversations: updatedConversations
          };
        });
      },
      
      editMessage: (messageId, conversationId, newContent) => {
        set(state => {
          const conversationMessages = state.messages[conversationId] || [];
          
          const updatedMessages = conversationMessages.map(msg => 
            msg.id === messageId 
              ? { 
                  ...msg, 
                  content: newContent, 
                  isEdited: true,
                  editedAt: new Date()
                }
              : msg
          );
          
          // Update conversation if it was the last message
          const updatedConversations = state.conversations.map(conv => {
            if (conv.id === conversationId && conv.lastMessage?.id === messageId) {
              return {
                ...conv,
                lastMessage: {
                  ...conv.lastMessage,
                  content: newContent,
                  isEdited: true,
                  editedAt: new Date()
                }
              };
            }
            return conv;
          });
          
          return {
            messages: {
              ...state.messages,
              [conversationId]: updatedMessages
            },
            conversations: updatedConversations
          };
        });
      },
      
      setActiveConversation: (conversationId) => {
        set({ activeConversationId: conversationId });
        
        // Mark all messages in this conversation as read
        const conversation = get().conversations.find(c => c.id === conversationId);
        const messages = get().messages[conversationId] || [];
        
        if (conversation) {
          const currentUserId = useAuthStore.getState().user?.id;
          
          // Get unread message IDs
          const unreadMessageIds = messages
            .filter(msg => msg.receiverId === currentUserId && msg.status !== 'read')
            .map(msg => msg.id);
          
          if (unreadMessageIds.length > 0) {
            get().markAsRead(unreadMessageIds);
          }
        }
      },
      
      getConversation: (participantId) => {
        const currentUserId = useAuthStore.getState().user?.id;
        if (!currentUserId) {
          throw new Error('User not authenticated');
        }
        
        return get().conversations.find(conv => 
          conv.type === 'individual' && 
          conv.participants.includes(currentUserId) && 
          conv.participants.includes(participantId)
        ) as Conversation;
      },
      
      getOrCreateConversation: (participantId) => {
        const currentUserId = useAuthStore.getState().user?.id;
        if (!currentUserId) {
          throw new Error('User not authenticated');
        }
        
        // Try to find existing conversation
        const existingConversation = get().getConversation(participantId);
        
        if (existingConversation) {
          return existingConversation;
        }
        
        // Create new conversation
        const newConversation: Conversation = {
          id: uuidv4(),
          type: 'individual',
          participants: [currentUserId, participantId],
          unreadCount: 0,
          updatedAt: new Date()
        };
        
        set(state => ({
          conversations: [...state.conversations, newConversation],
          messages: {
            ...state.messages,
            [newConversation.id]: []
          }
        }));
        
        return newConversation;
      }
    }),
    {
      name: 'messaging-data-storage',
    }
  )
);

export default useMessageStore;