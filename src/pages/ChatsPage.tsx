import React from 'react';
import { Outlet, useParams } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatRoom from '../components/chat/ChatRoom';

const ChatsPage: React.FC = () => {
  const { conversationId } = useParams<{ conversationId: string }>();
  
  return (
    <div className="h-full flex">
      <div className={`${conversationId ? 'hidden md:block' : 'block'} md:w-1/3 border-r border-gray-200 h-full`}>
        <ChatList />
      </div>
      
      <div className={`${conversationId ? 'block' : 'hidden'} md:block flex-1 h-full`}>
        {conversationId ? <ChatRoom /> : (
          <div className="h-full flex items-center justify-center bg-gray-50">
            <p className="text-gray-500">Select a conversation to start chatting</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatsPage;