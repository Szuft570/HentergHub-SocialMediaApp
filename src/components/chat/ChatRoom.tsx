import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, MoreVertical, Phone, Video, Send, Smile, Image, Paperclip } from 'lucide-react';
import { format } from 'date-fns';
import EmojiPicker from 'emoji-picker-react';
import useMessageStore from '../../store/useMessageStore';
import useAuthStore from '../../store/useAuthStore';
import useContactStore from '../../store/useContactStore';
import { Message } from '../../types';

const ChatRoom: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  const { user } = useAuthStore();
  const { messages, sendMessage, setActiveConversation } = useMessageStore();
  const { contacts } = useContactStore();
  const navigate = useNavigate();
  
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const conversationMessages = conversationId ? messages[conversationId] || [] : [];
  
  // Find the conversation participants
  const { conversations } = useMessageStore();
  const conversation = conversations.find(c => c.id === conversationId);
  
  // For individual chat, find the other participant
  const otherParticipantId = conversation?.participants.find(id => id !== user?.id);
  const contact = contacts.find(c => c.userId === otherParticipantId);
  
  // Scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversationMessages]);
  
  // Set active conversation
  useEffect(() => {
    if (conversationId) {
      setActiveConversation(conversationId);
    }
  }, [conversationId, setActiveConversation]);
  
  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!newMessage.trim() || !conversationId || !otherParticipantId) return;
    
    sendMessage(newMessage, otherParticipantId);
    setNewMessage('');
  };
  
  const handleEmojiClick = (emojiData: any) => {
    setNewMessage(prev => prev + emojiData.emoji);
    setShowEmojiPicker(false);
  };
  
  const handleImageUpload = () => {
    fileInputRef.current?.click();
  };
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !conversationId || !otherParticipantId) return;
    
    // In a real app, you would upload the file to a server and get a URL
    // For this demo, we'll simulate by using a placeholder image
    const placeholderUrl = 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    
    sendMessage('[Image]', otherParticipantId, 'image', placeholderUrl);
    
    // Reset the input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };
  
  const renderMessage = (message: Message) => {
    const isSender = message.senderId === user?.id;
    const timeString = format(new Date(message.timestamp), 'h:mm a');
    
    return (
      <div
        key={message.id}
        className={`mb-4 ${isSender ? 'text-right' : 'text-left'}`}
      >
        <div
          className={`inline-block max-w-md px-4 py-2 rounded-lg ${
            isSender
              ? 'bg-blue-600 text-white rounded-br-none'
              : 'bg-gray-200 text-gray-800 rounded-bl-none'
          }`}
        >
          {message.type === 'text' && <p>{message.content}</p>}
          
          {message.type === 'image' && message.mediaUrl && (
            <div className="mb-1">
              <img
                src={message.mediaUrl}
                alt="Shared"
                className="rounded max-w-full h-auto"
              />
            </div>
          )}
          
          <span className={`text-xs block mt-1 ${isSender ? 'text-blue-100' : 'text-gray-500'}`}>
            {timeString}
            {message.status === 'read' && isSender && (
              <span className="ml-1">✓✓</span>
            )}
            {message.status === 'delivered' && isSender && (
              <span className="ml-1">✓</span>
            )}
          </span>
        </div>
      </div>
    );
  };
  
  if (!contact || !conversation) {
    return (
      <div className="h-full flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select a conversation to start chatting</p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-200 flex items-center">
        <button 
          onClick={() => navigate('/chats')}
          className="md:hidden p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        
        <div className="flex items-center">
          <div className="relative">
            <img 
              src={contact.avatar} 
              alt={contact.username} 
              className="h-10 w-10 rounded-full object-cover"
            />
            <span className={`absolute bottom-0 right-0 block h-2.5 w-2.5 rounded-full ring-2 ring-white ${
              contact.status === 'online' 
                ? 'bg-green-500' 
                : contact.status === 'away' 
                  ? 'bg-yellow-500' 
                  : 'bg-gray-400'
            }`}></span>
          </div>
          
          <div className="ml-3">
            <p className="font-medium text-gray-900">{contact.username}</p>
            <p className="text-xs text-gray-500">
              {contact.status === 'online' 
                ? 'Online' 
                : contact.status === 'away' 
                  ? 'Away' 
                  : 'Offline'}
            </p>
          </div>
        </div>
        
        <div className="ml-auto flex">
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Phone size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <Video size={20} />
          </button>
          <button className="p-2 text-gray-500 hover:text-gray-700">
            <MoreVertical size={20} />
          </button>
        </div>
      </div>
      
      {/* Messages */}
      <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
        {conversationMessages.length > 0 ? (
          conversationMessages.map(renderMessage)
        ) : (
          <div className="h-full flex items-center justify-center">
            <p className="text-gray-500">No messages yet. Say hello!</p>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      {/* Message input */}
      <div className="p-4 border-t border-gray-200">
        <form onSubmit={handleSendMessage} className="flex items-center">
          <div className="flex-1 flex items-center bg-gray-100 rounded-full px-4 py-2">
            <button 
              type="button" 
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="text-gray-500 hover:text-gray-700"
            >
              <Smile size={20} />
            </button>
            
            {showEmojiPicker && (
              <div className="absolute bottom-20">
                <EmojiPicker onEmojiClick={handleEmojiClick} />
              </div>
            )}
            
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type a message"
              className="flex-1 ml-2 bg-transparent border-none focus:outline-none focus:ring-0"
            />
            
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              accept="image/*"
              className="hidden"
            />
            
            <button 
              type="button" 
              onClick={handleImageUpload}
              className="ml-1 text-gray-500 hover:text-gray-700"
            >
              <Image size={20} />
            </button>
            
            <button type="button" className="ml-1 text-gray-500 hover:text-gray-700">
              <Paperclip size={20} />
            </button>
          </div>
          
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="ml-2 p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatRoom;