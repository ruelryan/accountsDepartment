import React, { useState, useCallback } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { EnhancedVolunteerPortal } from './components/EnhancedVolunteerPortal';
import { useSupabaseData } from './hooks/useSupabaseData';
import { Volunteer, Box } from './types';
import { Database, Cloud, CloudOff, Loader2 } from 'lucide-react';

function App() {
  const {
    volunteers,
    shifts,
    boxes,
    isLoading,
    isOnline,
    lastSynced,
    saveVolunteers,
    saveShifts,
    saveBoxes
  } = useSupabaseData();

  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  const handleStatusChange = useCallback(async (volunteerId: string, newStatus: string) => {
    const updatedVolunteers = volunteers.map(volunteer => 
      volunteer.id === volunteerId 
        ? {
            ...volunteer,
            roles: volunteer.roles.map(role => ({
              ...role,
              status: newStatus as any
            }))
          }
        : volunteer
    );
    
    try {
      await saveVolunteers(updatedVolunteers);
    } catch (error) {
      console.error('Error updating volunteer status:', error);
      alert('Failed to save changes. Please try again.');
    }
  }, [volunteers, saveVolunteers]);

  const handleBoxStatusChange = useCallback(async (boxId: number, newStatus: string) => {
    const updatedBoxes = boxes.map(box => 
      box.id === boxId 
        ? { ...box, status: newStatus as any }
        : box
    );
    
    try {
      await saveBoxes(updatedBoxes);
    } catch (error) {
      console.error('Error updating box status:', error);
      alert('Failed to save changes. Please try again.');
    }
  }, [boxes, saveBoxes]);

  const handleVolunteersUpdate = async (updatedVolunteers: Volunteer[]) => {
    try {
      await saveVolunteers(updatedVolunteers);
    } catch (error) {
      console.error('Error updating volunteers:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleShiftsUpdate = async (updatedShifts: any[]) => {
    try {
      await saveShifts(updatedShifts);
    } catch (error) {
      console.error('Error updating shifts:', error);
      alert('Failed to save changes. Please try again.');
    }
  };

  const handleLogin = (username: string, password: string) => {
    if (username === 'admin' && password === 'accounts2025') {
      setIsAdminLoggedIn(true);
      setShowLogin(false);
      return true;
    }
    return false;
  };

  const handleLogout = () => {
    setIsAdminLoggedIn(false);
    setShowLogin(false);
  };

  // Show loading screen while initializing
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-xl">
            <Database className="w-8 h-8 text-white" />
          </div>
          <div className="flex items-center justify-center space-x-2 mb-4">
            <Loader2 className="w-6 h-6 text-teal-600 animate-spin" />
            <span className="text-lg font-semibold text-gray-900">Loading Convention Data...</span>
          </div>
          <p className="text-gray-600">Connecting to database and syncing assignments</p>
          <div className="mt-4 flex items-center justify-center space-x-2">
            {isOnline ? (
              <>
                <Cloud className="w-4 h-4 text-green-500" />
                <span className="text-sm text-green-600">Connected to Supabase</span>
              </>
            ) : (
              <>
                <CloudOff className="w-4 h-4 text-orange-500" />
                <span className="text-sm text-orange-600">Offline Mode</span>
              </>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Show login page if admin login is requested
  if (showLogin && !isAdminLoggedIn) {
    return (
      <LoginPage 
        onLogin={handleLogin}
        onCancel={() => setShowLogin(false)}
      />
    );
  }

  // Show admin dashboard if logged in
  if (isAdminLoggedIn) {
    return (
      <AdminDashboard
        volunteers={volunteers}
        shifts={shifts}
        boxes={boxes}
        onVolunteersUpdate={handleVolunteersUpdate}
        onShiftsUpdate={handleShiftsUpdate}
        onStatusChange={handleStatusChange}
        onBoxStatusChange={handleBoxStatusChange}
        onLogout={handleLogout}
        isOnline={isOnline}
        lastSynced={lastSynced}
      />
    );
  }

  // Default view: Volunteer Portal with admin login option
  return (
    <>
      <EnhancedVolunteerPortal 
        volunteers={volunteers}
        shifts={shifts}
        onAdminLogin={() => setShowLogin(true)}
      />
      
      {/* Connection Status Indicator */}
      <div className="fixed bottom-4 left-4 z-50">
        <div className={`flex items-center space-x-2 px-3 py-2 rounded-lg shadow-lg text-sm font-medium ${
          isOnline 
            ? 'bg-green-100 text-green-800 border border-green-200' 
            : 'bg-orange-100 text-orange-800 border border-orange-200'
        }`}>
          {isOnline ? (
            <>
              <Cloud className="w-4 h-4" />
              <span>Live</span>
            </>
          ) : (
            <>
              <CloudOff className="w-4 h-4" />
              <span>Offline</span>
            </>
          )}
          {lastSynced && isOnline && (
            <span className="text-xs opacity-75">
              • {lastSynced.toLocaleTimeString()}
            </span>
          )}
        </div>
      </div>
    </>
  );
}

export default App;