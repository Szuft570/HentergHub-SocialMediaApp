import React, { useState } from 'react';
import { Camera, Edit2 } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';

const UserProfile: React.FC = () => {
  const { user, updateProfile } = useAuthStore();
  
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState(user?.username || '');
  const [status, setStatus] = useState(user?.status || 'online');
  const [isUpdating, setIsUpdating] = useState(false);
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsUpdating(true);
    
    try {
      await updateProfile({
        username,
        status: status as 'online' | 'away' | 'offline'
      });
      setIsEditing(false);
    } catch (err) {
      console.error('Failed to update profile', err);
    } finally {
      setIsUpdating(false);
    }
  };
  
  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Cover image */}
        <div className="h-40 bg-gradient-to-r from-blue-500 to-blue-600 relative">
          <div className="absolute bottom-0 left-0 right-0 px-6 pb-6 flex items-end">
            <div className="relative">
              <img 
                src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'} 
                alt="Profile"
                className="w-24 h-24 rounded-full border-4 border-white object-cover"
              />
              <button className="absolute bottom-0 right-0 p-1 bg-gray-800 bg-opacity-75 rounded-full text-white">
                <Camera size={16} />
              </button>
            </div>
            
            <div className="ml-4 flex-1">
              <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
              <p className="text-blue-100">{user?.email}</p>
            </div>
            
            {!isEditing && (
              <button 
                onClick={() => setIsEditing(true)}
                className="bg-white text-blue-600 px-4 py-2 rounded-md flex items-center text-sm font-medium hover:bg-blue-50"
              >
                <Edit2 size={16} className="mr-2" />
                Edit Profile
              </button>
            )}
          </div>
        </div>
        
        <div className="p-6 pt-12">
          {isEditing ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                  Username
                </label>
                <input
                  id="username"
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              
              <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                  Status
                </label>
                <select
                  id="status"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="online">Online</option>
                  <option value="away">Away</option>
                  <option value="offline">Offline</option>
                </select>
              </div>
              
              <div className="flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isUpdating}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
                >
                  {isUpdating ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Account Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Username</p>
                    <p className="font-medium">{user?.username}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Email</p>
                    <p className="font-medium">{user?.email}</p>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Status</p>
                    <div className="flex items-center mt-1">
                      <span className={`inline-block w-2 h-2 rounded-full mr-2 ${
                        user?.status === 'online' 
                          ? 'bg-green-500' 
                          : user?.status === 'away' 
                            ? 'bg-yellow-500' 
                            : 'bg-gray-400'
                      }`}></span>
                      <p className="font-medium capitalize">{user?.status}</p>
                    </div>
                  </div>
                  
                  <div className="bg-gray-50 p-4 rounded-md">
                    <p className="text-sm text-gray-500">Member Since</p>
                    <p className="font-medium">
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                    </p>
                  </div>
                </div>
              </div>
              
              <div>
                <h2 className="text-xl font-semibold text-gray-800 mb-4">Privacy Settings</h2>
                
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Show Last Seen</p>
                      <p className="text-sm text-gray-500">Let others see when you were last active</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="font-medium">Read Receipts</p>
                      <p className="text-sm text-gray-500">Let others know when you've read their messages</p>
                    </div>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                    </label>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserProfile;