import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, UserPlus } from 'lucide-react';
import useContactStore from '../../store/useContactStore';
import useMessageStore from '../../store/useMessageStore';

const ContactsList: React.FC = () => {
  const { contacts } = useContactStore();
  const { getOrCreateConversation, setActiveConversation } = useMessageStore();
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  
  const filteredContacts = contacts.filter(contact =>
    contact.username.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const handleContactClick = (userId: string) => {
    const conversation = getOrCreateConversation(userId);
    setActiveConversation(conversation.id);
    navigate(`/chats/${conversation.id}`);
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Contacts</h1>
      </div>
      
      <div className="p-4 border-b border-gray-200">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={16} className="text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search contacts"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
          />
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto">
        {filteredContacts.length > 0 ? (
          <ul className="divide-y divide-gray-200">
            {filteredContacts.map(contact => (
              <li 
                key={contact.userId}
                onClick={() => handleContactClick(contact.userId)}
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
                  <div className="ml-4">
                    <p className="font-medium text-gray-900">{contact.username}</p>
                    <p className="text-sm text-gray-500">
                      {contact.status === 'online' 
                        ? 'Online' 
                        : contact.status === 'away' 
                          ? 'Away' 
                          : 'Offline'}
                    </p>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        ) : (
          <div className="py-8 text-center">
            <p className="text-gray-500">No contacts found</p>
          </div>
        )}
      </div>
      
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500">
          <UserPlus size={18} className="mr-2" />
          Add New Contact
        </button>
      </div>
    </div>
  );
};

export default ContactsList;