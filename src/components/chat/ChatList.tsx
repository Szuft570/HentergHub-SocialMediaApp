import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import useMessageStore from '../../store/useMessageStore';
import useContactStore from '../../store/useContactStore';
import useAuthStore from '../../store/useAuthStore';

const ChatList: React.FC = () => {
  const { user } = useAuthStore();
  const { conversations, setActiveConversation } = useMessageStore();
  const { contacts } = useContactStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  // Sort conversations by recent activity
  const sortedConversations = [...conversations].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
  
  // Filter conversations by search term
  const filteredConversations = sortedConversations.filter(conv => {
    // For individual chats, find the contact
    if (conv.type === 'individual') {
      const otherParticipantId = conv.participants.find(id => id !== user?.id);
      const contact = contacts.find(c => c.userId === otherParticipantId);
      
      return contact && contact.username.toLowerCase().includes(searchTerm.toLowerCase());
    }
    
    // For group chats (not implemented in this demo)
    return false;
  });
  
  const handleChatClick = (conversationId: string) => {
    setActiveConversation(conversationId);
    navigate(`/chats/${conversationId}`);
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Chats</h1>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search chats"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredConversations.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredConversations.map(conversation => {
              // Find the other participant
              const otherParticipantId = conversation.participants.find(id => id !== user?.id);
              const contact = contacts.find(c => c.userId === otherParticipantId);
              
              if (!contact) return null;
              
              return (
                <li 
                  key={conversation.id}
                  onClick={() => handleChatClick(conversation.id)}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center">
                    <div className="relative flex-shrink-0">
                      <img 
                        src={contact.avatar} 
                        alt={contact.username} 
                        className="h-12 w-12 rounded-full object-cover"
                      />
                      <span className={`absolute bottom-0 right-0 block h-3 w-3 rounded-full ring-2 ring-white ${
                        contact.status === 'online' 
                          ? 'bg-green-500' 
                          : contact.status === 'away' 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-400'
                      }`}></span>
                    </div>
                    <div className="ml-4 flex-1">
                      <div className="flex items-center justify-between">
                        <p className="font-medium text-gray-900">{contact.username}</p>
                        {conversation.lastMessage?.timestamp && (
                          <p className="text-xs text-gray-500">
                            {formatDistanceToNow(new Date(conversation.lastMessage.timestamp), { 
                              addSuffix: true 
                            })}
                          </p>
                        )}
                      </div>
                      <div className="mt-1 flex items-center justify-between">
                        <p className="text-sm text-gray-600 line-clamp-1">
                          {conversation.lastMessage?.content || 'New conversation'}
                        </p>
                        {conversation.unreadCount > 0 && (
                          <span className="inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white bg-blue-600 rounded-full">
                            {conversation.unreadCount}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No conversations found</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={() => navigate('/contacts')}
          className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          <Plus size={18} className="mr-2" />
          New Chat
        </button>
      </div>
    </div>
  );
};

export default ChatList;