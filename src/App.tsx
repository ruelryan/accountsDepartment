import React, { useState, useCallback, useEffect } from 'react';
import { LoginPage } from './components/LoginPage';
import { AdminDashboard } from './components/AdminDashboard';
import { EnhancedVolunteerPortal } from './components/EnhancedVolunteerPortal';
import { volunteers as initialVolunteers, shifts, boxes as initialBoxes } from './data/initialData';
import { Volunteer, Box, Shift } from './types';

function App() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [shiftsData, setShiftsData] = useState<Shift[]>(shifts);
  const [isAdminLoggedIn, setIsAdminLoggedIn] = useState(false);
  const [showLogin, setShowLogin] = useState(false);

  // Load saved data on app start
  useEffect(() => {
    const savedData = localStorage.getItem('conventionAccountsData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        if (parsedData.volunteers) setVolunteers(parsedData.volunteers);
        if (parsedData.boxes) setBoxes(parsedData.boxes);
        if (parsedData.shifts) setShiftsData(parsedData.shifts);
      } catch (error) {
        console.error('Error loading saved data:', error);
      }
    }
  }, []);

  const handleStatusChange = useCallback((volunteerId: string, newStatus: string) => {
    setVolunteers(prev => prev.map(volunteer => 
      volunteer.id === volunteerId 
        ? {
            ...volunteer,
            roles: volunteer.roles.map(role => ({
              ...role,
              status: newStatus as any
            }))
          }
        : volunteer
    ));
  }, []);

  const handleBoxStatusChange = useCallback((boxId: number, newStatus: string) => {
    setBoxes(prev => prev.map(box => 
      box.id === boxId 
        ? { ...box, status: newStatus as any }
        : box
    ));
  }, []);

  const handleVolunteersUpdate = (updatedVolunteers: Volunteer[]) => {
    setVolunteers(updatedVolunteers);
  };

  const handleShiftsUpdate = (updatedShifts: Shift[]) => {
    setShiftsData(updatedShifts);
  };

  const handleLogin = (username: string, password: string) => {
    // Simple authentication - in production, this would be more secure
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
        shifts={shiftsData}
        boxes={boxes}
        onVolunteersUpdate={handleVolunteersUpdate}
        onShiftsUpdate={handleShiftsUpdate}
        onStatusChange={handleStatusChange}
        onBoxStatusChange={handleBoxStatusChange}
        onLogout={handleLogout}
      />
    );
  }

  // Default view: Volunteer Portal with admin login option
  return (
    <EnhancedVolunteerPortal 
      volunteers={volunteers}
      shifts={shiftsData}
      onAdminLogin={() => setShowLogin(true)}
    />
  );
}

export default App;