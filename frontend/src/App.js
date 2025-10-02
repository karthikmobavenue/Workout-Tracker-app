import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';
import '@/App.css';

// Components
import UserOnboarding from './components/UserOnboarding';
import Dashboard from './components/Dashboard';
import WorkoutView from './components/WorkoutView';
import CalendarView from './components/CalendarView';
import ProgressView from './components/ProgressView';
import Navigation from './components/Navigation';
import { Toaster } from './components/ui/sonner';

const BACKEND_URL = process.env.REACT_APP_BACKEND_URL;
const API = `${BACKEND_URL}/api`;

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [currentView, setCurrentView] = useState('dashboard');

  useEffect(() => {
    // Check if user exists in localStorage
    const savedUser = localStorage.getItem('ppl_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const handleUserCreated = (userData) => {
    setUser(userData);
    localStorage.setItem('ppl_user', JSON.stringify(userData));
  };

  const startProgram = async () => {
    try {
      await axios.post(`${API}/users/${user.id}/start-program`);
      const updatedUser = { ...user, program_started: true };
      setUser(updatedUser);
      localStorage.setItem('ppl_user', JSON.stringify(updatedUser));
    } catch (error) {
      console.error('Error starting program:', error);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-black text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <UserOnboarding onUserCreated={handleUserCreated} />;
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'workout':
        return <WorkoutView user={user} />;
      case 'calendar':
        return <CalendarView user={user} />;
      case 'progress':
        return <ProgressView user={user} />;
      default:
        return <Dashboard user={user} onStartProgram={startProgram} />;
    }
  };

  return (
    <div className="App min-h-screen bg-white text-black">
      <Navigation 
        currentView={currentView} 
        setCurrentView={setCurrentView}
        user={user}
      />
      <main className="pb-16">
        {renderCurrentView()}
      </main>
    </div>
  );
}

export default App;