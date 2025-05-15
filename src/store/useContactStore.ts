import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Contact } from '../types';

interface ContactState {
  contacts: Contact[];
  addContact: (contact: Omit<Contact, 'unreadCount'>) => void;
  removeContact: (userId: string) => void;
  updateContactStatus: (userId: string, status: Contact['status']) => void;
  incrementUnreadCount: (userId: string) => void;
  resetUnreadCount: (userId: string) => void;
  updateLastMessage: (userId: string, content: string) => void;
}

const useContactStore = create<ContactState>()(
  persist(
    (set) => ({
      contacts: [
        {
          userId: '2',
          username: 'janedoe',
          avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          status: 'online',
          unreadCount: 0,
          lastMessage: {
            content: 'Hey, how are you?',
            timestamp: new Date(Date.now() - 3600000)
          }
        },
        {
          userId: '3',
          username: 'mikebrown',
          avatar: 'https://images.pexels.com/photos/614810/pexels-photo-614810.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          status: 'offline',
          unreadCount: 2,
          lastMessage: {
            content: 'Can we meet tomorrow?',
            timestamp: new Date(Date.now() - 86400000)
          }
        },
        {
          userId: '4',
          username: 'sarahparker',
          avatar: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1',
          status: 'away',
          unreadCount: 0,
          lastMessage: {
            content: 'The project looks great!',
            timestamp: new Date(Date.now() - 172800000)
          }
        }
      ],
      
      addContact: (contact) => set(state => ({
        contacts: [...state.contacts, { ...contact, unreadCount: 0 }]
      })),
      
      removeContact: (userId) => set(state => ({
        contacts: state.contacts.filter(contact => contact.userId !== userId)
      })),
      
      updateContactStatus: (userId, status) => set(state => ({
        contacts: state.contacts.map(contact =>
          contact.userId === userId ? { ...contact, status } : contact
        )
      })),
      
      incrementUnreadCount: (userId) => set(state => ({
        contacts: state.contacts.map(contact =>
          contact.userId === userId 
            ? { ...contact, unreadCount: contact.unreadCount + 1 } 
            : contact
        )
      })),
      
      resetUnreadCount: (userId) => set(state => ({
        contacts: state.contacts.map(contact =>
          contact.userId === userId ? { ...contact, unreadCount: 0 } : contact
        )
      })),
      
      updateLastMessage: (userId, content) => set(state => ({
        contacts: state.contacts.map(contact =>
          contact.userId === userId 
            ? { 
                ...contact, 
                lastMessage: {
                  content,
                  timestamp: new Date()
                }
              } 
            : contact
        )
      }))
    }),
    {
      name: 'messaging-contacts-storage',
    }
  )
);

export default useContactStore;