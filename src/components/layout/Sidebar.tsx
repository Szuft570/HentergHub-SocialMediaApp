import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { MessageSquare, Users, History, UserCircle, LogOut, Settings } from 'lucide-react';
import useAuthStore from '../../store/useAuthStore';
import StoryCircles from '../story/StoryCircles';

const Sidebar: React.FC = () => {
  const { user, logout } = useAuthStore();
  const [expanded, setExpanded] = useState(true);
  
  return (
    <div 
      className={`${
        expanded ? 'w-64' : 'w-20'
      } h-full bg-white border-r border-gray-200 flex flex-col transition-width duration-300 ease-in-out`}
    >
      <div className="p-4 border-b border-gray-200 flex items-center justify-between">
        <h1 className={`font-bold text-lg text-blue-600 ${expanded ? 'block' : 'hidden'}`}>
          MessageHub
        </h1>
        <button 
          onClick={() => setExpanded(!expanded)}
          className="p-1 rounded-md hover:bg-gray-100"
        >
          {expanded ? (
            <span>◀</span>
          ) : (
            <span>▶</span>
          )}
        </button>
      </div>
      
      {/* User profile */}
      <div className="p-4 border-b border-gray-200 flex items-center">
        <img 
          src={user?.avatar || 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg'} 
          alt="Profile"
          className="w-10 h-10 rounded-full object-cover"
        />
        {expanded && (
          <div className="ml-3">
            <p className="font-semibold text-gray-800">{user?.username}</p>
            <p className="text-xs text-gray-500">
              <span className="inline-block w-2 h-2 rounded-full bg-green-500 mr-1"></span>
              Online
            </p>
          </div>
        )}
      </div>
      
      {/* Story circles */}
      {expanded && (
        <div className="p-4 border-b border-gray-200">
          <StoryCircles />
        </div>
      )}
      
      {/* Navigation */}
      <nav className="flex-1 p-2 overflow-y-auto">
        <ul className="space-y-1">
          <li>
            <NavLink 
              to="/chats" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-md ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <MessageSquare size={20} />
              {expanded && <span className="ml-3">Chats</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/contacts" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-md ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Users size={20} />
              {expanded && <span className="ml-3">Contacts</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/stories" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-md ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <History size={20} />
              {expanded && <span className="ml-3">Stories</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/profile" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-md ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <UserCircle size={20} />
              {expanded && <span className="ml-3">Profile</span>}
            </NavLink>
          </li>
          <li>
            <NavLink 
              to="/settings" 
              className={({ isActive }) => 
                `flex items-center p-3 rounded-md ${
                  isActive ? 'bg-blue-50 text-blue-600' : 'text-gray-700 hover:bg-gray-100'
                }`
              }
            >
              <Settings size={20} />
              {expanded && <span className="ml-3">Settings</span>}
            </NavLink>
          </li>
        </ul>
      </nav>
      
      {/* Logout */}
      <div className="p-4 border-t border-gray-200">
        <button 
          onClick={logout}
          className="flex items-center w-full p-3 rounded-md text-red-500 hover:bg-red-50"
        >
          <LogOut size={20} />
          {expanded && <span className="ml-3">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default Sidebar;