import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import useAuthStore from '../../store/useAuthStore';

const MainLayout: React.FC = () => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Outlet />;
  }
  
  return (
    <div className="flex h-screen overflow-hidden bg-gray-100">
      <Sidebar />
      <main className="flex-1 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
};

export default MainLayout;