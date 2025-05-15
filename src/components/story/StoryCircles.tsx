import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import useStoryStore from '../../store/useStoryStore';
import useContactStore from '../../store/useContactStore';
import useAuthStore from '../../store/useAuthStore';

const StoryCircles: React.FC = () => {
  const { user } = useAuthStore();
  const { getActiveStories } = useStoryStore();
  const { contacts } = useContactStore();
  const navigate = useNavigate();
  
  const activeStories = getActiveStories();
  const userIds = Object.keys(activeStories);
  
  const handleStoryClick = (userId: string) => {
    navigate(`/stories/${userId}`);
  };
  
  return (
    <div>
      <h3 className="text-sm font-medium text-gray-500 mb-3">Stories</h3>
      <div className="flex space-x-4 overflow-x-auto pb-2">
        {/* Add story button */}
        <div 
          onClick={() => navigate('/stories/create')}
          className="flex flex-col items-center cursor-pointer"
        >
          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
            <Plus size={20} className="text-gray-500" />
          </div>
          <span className="text-xs text-gray-600 mt-1">Add</span>
        </div>
        
        {/* User stories */}
        {user && userIds.includes(user.id) && (
          <div 
            onClick={() => handleStoryClick(user.id)}
            className="flex flex-col items-center cursor-pointer"
          >
            <div className="relative">
              <div className="w-16 h-16 rounded-full border-2 border-blue-500 p-1">
                <img 
                  src={user.avatar} 
                  alt="My Story" 
                  className="w-full h-full rounded-full object-cover"
                />
              </div>
              <span className="absolute bottom-0 right-0 block h-3 w-3 rounded-full bg-blue-500 ring-2 ring-white"></span>
            </div>
            <span className="text-xs text-gray-600 mt-1">Your Story</span>
          </div>
        )}
        
        {/* Contact stories */}
        {userIds
          .filter(id => id !== user?.id)
          .map(userId => {
            const contact = contacts.find(c => c.userId === userId);
            if (!contact) return null;
            
            return (
              <div 
                key={userId}
                onClick={() => handleStoryClick(userId)}
                className="flex flex-col items-center cursor-pointer"
              >
                <div className="w-16 h-16 rounded-full border-2 border-green-500 p-1">
                  <img 
                    src={contact.avatar} 
                    alt={contact.username} 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="text-xs text-gray-600 mt-1">{contact.username}</span>
              </div>
            );
          })}
      </div>
    </div>
  );
};

export default StoryCircles;