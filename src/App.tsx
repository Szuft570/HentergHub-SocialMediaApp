import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import MainLayout from './components/layout/MainLayout';
import LoginForm from './components/auth/LoginForm';
import RegisterForm from './components/auth/RegisterForm';
import ChatsPage from './pages/ChatsPage';
import ContactsPage from './pages/ContactsPage';
import StoriesPage from './pages/StoriesPage';
import ProfilePage from './pages/ProfilePage';
import SettingsPage from './pages/SettingsPage';
import CreateStory from './components/story/CreateStory';
import StoryViewer from './components/story/StoryViewer';
import useAuthStore from './store/useAuthStore';

// Auth route wrapper
const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return <>{children}</>;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<MainLayout />}>
          {/* Auth routes */}
          <Route index element={<Navigate to="/login" />} />
          <Route path="login" element={<LoginForm />} />
          <Route path="register" element={<RegisterForm />} />
          
          {/* Protected routes */}
          <Route 
            path="chats" 
            element={
              <PrivateRoute>
                <ChatsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="chats/:conversationId" 
            element={
              <PrivateRoute>
                <ChatsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="contacts" 
            element={
              <PrivateRoute>
                <ContactsPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="stories" 
            element={
              <PrivateRoute>
                <StoriesPage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="stories/create" 
            element={
              <PrivateRoute>
                <CreateStory />
              </PrivateRoute>
            } 
          />
          <Route 
            path="stories/:userId" 
            element={
              <PrivateRoute>
                <StoryViewer />
              </PrivateRoute>
            } 
          />
          <Route 
            path="profile" 
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            } 
          />
          <Route 
            path="settings" 
            element={
              <PrivateRoute>
                <SettingsPage />
              </PrivateRoute>
            } 
          />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;