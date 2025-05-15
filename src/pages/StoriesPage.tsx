import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus } from 'lucide-react';
import useStoryStore from '../store/useStoryStore';
import useContactStore from '../store/useContactStore';
import useAuthStore from '../store/useAuthStore';

const StoriesPage: React.FC = () => {
  const { user } = useAuthStore();
  const { getActiveStories, getUserStories } = useStoryStore();
  const { contacts } = useContactStore();
  const navigate = useNavigate();
  
  const activeStories = getActiveStories();
  const userIds = Object.keys(activeStories);
  const myStories = user ? getUserStories(user.id) : [];
  
  const handleStoryClick = (userId: string) => {
    navigate(`/stories/${userId}`);
  };
  
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Stories</h1>
      </div>
      
      <div className="p-4">
        {/* My Story section */}
        <div className="mb-8">
          <h2 className="text-md font-semibold text-gray-700 mb-3">Your Story</h2>
          
          {myStories.length > 0 ? (
            <div className="flex items-center">
              <div 
                onClick={() => handleStoryClick(user!.id)}
                className="relative cursor-pointer"
              >
                <div className="w-20 h-20 rounded-full border-2 border-blue-500 p-1">
                  <img 
                    src={user?.avatar} 
                    alt="My Story" 
                    className="w-full h-full rounded-full object-cover"
                  />
                </div>
                <span className="absolute bottom-0 right-0 block h-4 w-4 rounded-full bg-blue-500 ring-2 ring-white"></span>
              </div>
              
              <div className="ml-4">
                <p className="font-medium">Your Story</p>
                <p className="text-sm text-gray-500">{myStories.length} updates</p>
              </div>
              
              <button 
                onClick={() => navigate('/stories/create')}
                className="ml-auto p-2 text-blue-600 hover:bg-blue-50 rounded-full"
              >
                <Plus size={20} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => navigate('/stories/create')}
              className="flex items-center p-3 bg-gray-50 rounded-lg cursor-pointer hover:bg-gray-100"
            >
              <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center border-2 border-dashed border-gray-300">
                <Plus size={24} className="text-gray-500" />
              </div>
              <div className="ml-4">
                <p className="font-medium">Add to Your Story</p>
                <p className="text-sm text-gray-500">Share a photo or write something</p>
              </div>
            </div>
          )}
        </div>
        
        {/* All Stories */}
        {userIds.filter(id => id !== user?.id).length > 0 && (
          <div>
            <h2 className="text-md font-semibold text-gray-700 mb-3">Recent Updates</h2>
            
            <div className="space-y-4">
              {userIds
                .filter(id => id !== user?.id)
                .map(userId => {
                  const contact = contacts.find(c => c.userId === userId);
                  if (!contact) return null;
                  
                  const userStories = activeStories[userId];
                  
                  return (
                    <div 
                      key={userId}
                      onClick={() => handleStoryClick(userId)}
                      className="flex items-center p-3 rounded-lg cursor-pointer hover:bg-gray-50"
                    >
                      <div className="w-16 h-16 rounded-full border-2 border-green-500 p-1">
                        <img 
                          src={contact.avatar} 
                          alt={contact.username} 
                          className="w-full h-full rounded-full object-cover"
                        />
                      </div>
                      <div className="ml-4">
                        <p className="font-medium">{contact.username}</p>
                        <p className="text-sm text-gray-500">
                          {userStories.length > 1
                            ? `${userStories.length} updates`
                            : '1 update'}
                        </p>
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StoriesPage;