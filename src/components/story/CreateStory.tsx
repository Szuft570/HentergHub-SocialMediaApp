import React, { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Image, X } from 'lucide-react';
import useStoryStore from '../../store/useStoryStore';
import useAuthStore from '../../store/useAuthStore';

const CreateStory: React.FC = () => {
  const { user } = useAuthStore();
  const { addStory } = useStoryStore();
  const navigate = useNavigate();
  
  const [caption, setCaption] = useState('');
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // In a real app, you would upload the file to a server and get a URL
    // For this demo, we'll use a local object URL
    const localUrl = URL.createObjectURL(file);
    setPreviewUrl(localUrl);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!previewUrl) return;
    
    // In a real app, we would use the actual URL from the server
    // For this demo, we'll use a placeholder image
    const placeholderUrl = 'https://images.pexels.com/photos/1181673/pexels-photo-1181673.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1';
    
    addStory(placeholderUrl, 'image', caption);
    navigate('/stories');
  };
  
  return (
    <div className="h-full flex flex-col bg-white">
      <div className="p-4 border-b border-gray-200 flex items-center">
        <button 
          onClick={() => navigate('/stories')}
          className="p-2 text-gray-500 hover:text-gray-700"
        >
          <ArrowLeft size={20} />
        </button>
        <h1 className="text-xl font-bold text-gray-800 ml-2">Create Story</h1>
      </div>
      
      <div className="flex-1 p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="max-w-md mx-auto">
          {/* Preview */}
          {previewUrl ? (
            <div className="relative mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-[9/16] flex items-center justify-center">
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="max-h-full max-w-full object-contain"
              />
              <button 
                type="button"
                onClick={() => setPreviewUrl(null)}
                className="absolute top-2 right-2 p-1 bg-gray-800 bg-opacity-50 rounded-full text-white"
              >
                <X size={16} />
              </button>
            </div>
          ) : (
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="mb-4 bg-gray-100 rounded-lg overflow-hidden aspect-[9/16] flex flex-col items-center justify-center cursor-pointer border-2 border-dashed border-gray-300"
            >
              <Image size={48} className="text-gray-400" />
              <p className="mt-2 text-gray-500">Click to select an image</p>
            </div>
          )}
          
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileChange}
            accept="image/*"
            className="hidden"
          />
          
          <div className="mb-4">
            <label htmlFor="caption" className="block text-sm font-medium text-gray-700 mb-1">
              Caption (optional)
            </label>
            <textarea
              id="caption"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="Add a caption to your story..."
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              rows={3}
            ></textarea>
          </div>
          
          <button
            type="submit"
            disabled={!previewUrl}
            className="w-full py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50"
          >
            Share Story
          </button>
        </form>
      </div>
    </div>
  );
};

export default CreateStory;