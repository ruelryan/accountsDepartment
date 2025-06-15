import React, { useState, useCallback } from 'react';
import { Header } from './components/Header';
import { StatusOverview } from './components/StatusOverview';
import { ShiftTimeline } from './components/ShiftTimeline';
import { VolunteerSection } from './components/VolunteerSection';
import { BoxTracker } from './components/BoxTracker';
import { FloorPlan } from './components/FloorPlan';
import { QuickActions } from './components/QuickActions';
import { EnhancedVolunteerPortal } from './components/EnhancedVolunteerPortal';
import { AdminPanel } from './components/AdminPanel';
import { useDateTime } from './hooks/useDateTime';
import { volunteers as initialVolunteers, shifts, boxes as initialBoxes } from './data/initialData';
import { Volunteer, Box, Shift } from './types';

function App() {
  const { formattedTime } = useDateTime();
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [shiftsData, setShiftsData] = useState<Shift[]>(shifts);
  const [activeShift, setActiveShift] = useState<number | null>(1);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'portal' | 'admin'>('dashboard');

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

  const handleShiftChange = (shiftId: number) => {
    setActiveShift(shiftId);
  };

  const handleBoxClick = (boxId: number) => {
    setSelectedBoxId(boxId);
    const boxTrackerElement = document.getElementById('box-tracker');
    if (boxTrackerElement) {
      boxTrackerElement.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleEmergencyAlert = () => {
    alert('Emergency alert sent to all volunteers!');
  };

  const handleGenerateReport = () => {
    const report = {
      timestamp: new Date().toISOString(),
      activeShift,
      volunteerStatus: volunteers.map(v => ({
        name: `${v.firstName} ${v.lastName}`,
        gender: v.gender,
        roles: v.roles
      })),
      boxStatus: boxes.map(b => ({
        id: b.id,
        location: b.location,
        status: b.status
      }))
    };
    
    const blob = new Blob([JSON.stringify(report, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `convention-volunteer-report-${Date.now()}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleRefreshData = () => {
    window.location.reload();
  };

  const handleVolunteersUpdate = (updatedVolunteers: Volunteer[]) => {
    setVolunteers(updatedVolunteers);
  };

  const handleShiftsUpdate = (updatedShifts: Shift[]) => {
    setShiftsData(updatedShifts);
  };

  // Calculate stats
  const stats = {
    totalVolunteers: volunteers.length,
    activeVolunteers: volunteers.filter(v => v.roles.some(r => r.status === 'active' || r.status === 'checked_in')).length,
    totalBoxes: boxes.length,
    activeBoxes: boxes.filter(b => b.status === 'active').length,
    completedTasks: volunteers.filter(v => v.roles.some(r => r.status === 'completed')).length
  };

  if (currentView === 'portal') {
    return (
      <EnhancedVolunteerPortal 
        volunteers={volunteers}
        shifts={shiftsData}
        onBackToMain={() => setCurrentView('dashboard')}
      />
    );
  }

  if (currentView === 'admin') {
    return (
      <AdminPanel
        volunteers={volunteers}
        shifts={shiftsData}
        onVolunteersUpdate={handleVolunteersUpdate}
        onShiftsUpdate={handleShiftsUpdate}
        onBackToMain={() => setCurrentView('dashboard')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header 
        currentTime={formattedTime}
        activeShift={activeShift}
        totalVolunteers={volunteers.length}
      />
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Stats Bar */}
        <StatusOverview stats={stats} />
        
        {/* Navigation Pills */}
        <div className="flex justify-center mb-8">
          <div className="flex bg-white rounded-full p-1 shadow-sm border">
            <button
              onClick={() => setCurrentView('portal')}
              className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-teal-600 hover:bg-teal-50 rounded-full transition-all"
            >
              Volunteer Portal
            </button>
            <button
              onClick={() => setCurrentView('admin')}
              className="px-6 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-full transition-all"
            >
              Admin Control
            </button>
          </div>
        </div>
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Schedule */}
          <div className="col-span-12 lg:col-span-3">
            <ShiftTimeline 
              shifts={shiftsData}
              activeShift={activeShift}
              onShiftChange={handleShiftChange}
            />
          </div>
          
          {/* Center Content */}
          <div className="col-span-12 lg:col-span-6 space-y-6">
            {/* Floor Plan */}
            <FloorPlan 
              boxes={boxes}
              onBoxClick={handleBoxClick}
            />
            
            {/* Box Tracker */}
            <div id="box-tracker">
              <BoxTracker 
                boxes={boxes}
                activeShift={activeShift}
                onBoxStatusChange={handleBoxStatusChange}
                selectedBoxId={selectedBoxId}
              />
            </div>
          </div>
          
          {/* Right Sidebar - Actions */}
          <div className="col-span-12 lg:col-span-3">
            <QuickActions
              onEmergencyAlert={handleEmergencyAlert}
              onGenerateReport={handleGenerateReport}
              onRefreshData={handleRefreshData}
            />
          </div>
        </div>
        
        {/* Volunteer Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
          <VolunteerSection
            title="Box Watchers"
            volunteers={volunteers}
            roleType="box_watcher"
            activeShift={activeShift}
            onStatusChange={handleStatusChange}
          />
          
          <VolunteerSection
            title="Keymen"
            volunteers={volunteers}
            roleType="keyman"
            activeShift={activeShift}
            onStatusChange={handleStatusChange}
          />
          
          <VolunteerSection
            title="Money Counters"
            volunteers={volunteers}
            roleType="money_counter"
            activeShift={activeShift}
            onStatusChange={handleStatusChange}
          />
        </div>
      </main>
    </div>
  );
}

export default App;