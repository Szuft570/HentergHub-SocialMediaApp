import React from 'react';
import { Bell, Lock, Moon, Zap, HelpCircle } from 'lucide-react';

const SettingsPage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto bg-white">
      <div className="p-4 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-800">Settings</h1>
      </div>
      
      <div className="max-w-2xl mx-auto p-4">
        <div className="space-y-6">
          {/* Notifications */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Bell size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold ml-2">Notifications</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Message Notifications</p>
                  <p className="text-sm text-gray-500">Get notified when you receive messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Story Notifications</p>
                  <p className="text-sm text-gray-500">Get notified about new stories from contacts</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Sound</p>
                  <p className="text-sm text-gray-500">Play sounds for incoming messages</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Privacy */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Lock size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold ml-2">Privacy</h2>
            </div>
            
            <div className="p-4 space-y-4">
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
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Last Seen</p>
                  <p className="text-sm text-gray-500">Show when you were last active</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Appearance */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Moon size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold ml-2">Appearance</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Dark Mode</p>
                  <p className="text-sm text-gray-500">Use dark theme</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
              
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Chat Wallpaper</p>
                  <p className="text-sm text-gray-500">Change your chat background</p>
                </div>
                <button className="px-3 py-1 bg-gray-100 text-gray-800 rounded-md text-sm hover:bg-gray-200">
                  Change
                </button>
              </div>
            </div>
          </div>
          
          {/* Data Usage */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <Zap size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold ml-2">Data Usage</h2>
            </div>
            
            <div className="p-4 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium">Auto-download Media</p>
                  <p className="text-sm text-gray-500">Automatically download photos and videos</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" value="" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>
            </div>
          </div>
          
          {/* Help */}
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
            <div className="p-4 border-b border-gray-200 flex items-center">
              <HelpCircle size={20} className="text-blue-600" />
              <h2 className="text-lg font-semibold ml-2">Help</h2>
            </div>
            
            <div className="p-4 space-y-2">
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md">
                <p className="font-medium">FAQ</p>
              </button>
              
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md">
                <p className="font-medium">Contact Support</p>
              </button>
              
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md">
                <p className="font-medium">Privacy Policy</p>
              </button>
              
              <button className="w-full text-left px-3 py-2 hover:bg-gray-50 rounded-md">
                <p className="font-medium">Terms of Service</p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;