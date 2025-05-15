import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import useStoryStore from '../../store/useStoryStore';
import useContactStore from '../../store/useContactStore';
import useAuthStore from '../../store/useAuthStore';
import { Story } from '../../types';

const StoryViewer: React.FC = () => {
  const { userId } = useParams<{ userId: string }>();
  const { user } = useAuthStore();
  const { getUserStories, viewStory } = useStoryStore();
  const { contacts } = useContactStore();
  const navigate = useNavigate();
  
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  
  const stories = userId ? getUserStories(userId) : [];
  const currentStory = stories[currentIndex];
  
  const contact = userId && userId !== user?.id 
    ? contacts.find(c => c.userId === userId) 
    : null;
  
  const isOwnStory = userId === user?.id;
  
  // Handle story viewing
  useEffect(() => {
    if (!currentStory) return;
    
    // Mark story as viewed
    viewStory(currentStory.id);
    
    // Progress bar
    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          handleNext();
          return 0;
        }
        return prev + 1;
      });
    }, 50); // 5 seconds total per story
    
    return () => clearInterval(interval);
  }, [currentStory, currentIndex]);
  
  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  };
  
  const handleNext = () => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      navigate('/stories');
    }
  };
  
  if (!currentStory) {
    return (
      <div className="h-full flex items-center justify-center bg-black">
        <p className="text-white">No stories available</p>
      </div>
    );
  }
  
  return (
    <div className="h-full flex flex-col bg-black relative">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 p-4 z-10 flex space-x-1">
        {stories.map((_, index) => (
          <div key={index} className="flex-1 h-1 bg-gray-600 rounded-full overflow-hidden">
            {index === currentIndex ? (
              <div 
                className="h-full bg-white"
                style={{ width: `${progress}%` }}
              ></div>
            ) : index < currentIndex ? (
              <div className="h-full bg-white w-full"></div>
            ) : null}
          </div>
        ))}
      </div>
      
      {/* Story header */}
      <div className="absolute top-0 left-0 right-0 pt-8 px-4 z-10 flex items-center">
        <div className="flex items-center">
          <img 
            src={isOwnStory ? user?.avatar : contact?.avatar} 
            alt="Profile" 
            className="h-10 w-10 rounded-full object-cover"
          />
          <div className="ml-3">
            <p className="font-medium text-white">
              {isOwnStory ? 'Your Story' : contact?.username}
            </p>
            <p className="text-xs text-gray-300">
              {format(new Date(currentStory.timestamp), 'h:mm a')}
            </p>
          </div>
        </div>
        
        <button 
          onClick={() => navigate('/stories')}
          className="ml-auto p-2 text-white"
        >
          <X size={24} />
        </button>
      </div>
      
      {/* Story content */}
      <div className="flex-1 flex items-center justify-center">
        {currentStory.mediaType === 'image' && (
          <img 
            src={currentStory.mediaUrl} 
            alt="Story" 
            className="max-h-full max-w-full object-contain"
          />
        )}
        
        {currentStory.mediaType === 'video' && (
          <video 
            src={currentStory.mediaUrl} 
            className="max-h-full max-w-full object-contain"
            autoPlay 
            loop 
            muted
          ></video>
        )}
      </div>
      
      {/* Story caption */}
      {currentStory.caption && (
        <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
          <p className="text-white text-center">{currentStory.caption}</p>
        </div>
      )}
      
      {/* Navigation buttons */}
      <button 
        onClick={handlePrevious}
        disabled={currentIndex === 0}
        className="absolute left-0 top-1/2 transform -translate-y-1/2 p-4 text-white opacity-50 hover:opacity-100 disabled:opacity-0"
      >
        <ChevronLeft size={32} />
      </button>
      
      <button 
        onClick={handleNext}
        disabled={currentIndex === stories.length - 1}
        className="absolute right-0 top-1/2 transform -translate-y-1/2 p-4 text-white opacity-50 hover:opacity-100 disabled:opacity-0"
      >
        <ChevronRight size={32} />
      </button>
    </div>
  );
};

export default StoryViewer;