import React from 'react';
import UserProfile from '../components/profile/UserProfile';

const ProfilePage: React.FC = () => {
  return (
    <div className="h-full overflow-y-auto py-4">
      <UserProfile />
    </div>
  );
};

export default ProfilePage;