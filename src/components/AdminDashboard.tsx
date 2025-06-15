import React, { useState, useCallback } from 'react';
import { Header } from './Header';
import { StatusOverview } from './StatusOverview';
import { ShiftTimeline } from './ShiftTimeline';
import { VolunteerSection } from './VolunteerSection';
import { BoxTracker } from './BoxTracker';
import { FloorPlan } from './FloorPlan';
import { QuickActions } from './QuickActions';
import { AdminPanel } from './AdminPanel';
import { useDateTime } from '../hooks/useDateTime';
import { Volunteer, Box, Shift } from '../types';
import { LogOut, Settings } from 'lucide-react';

interface AdminDashboardProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  boxes: Box[];
  onVolunteersUpdate: (volunteers: Volunteer[]) => void;
  onShiftsUpdate: (shifts: Shift[]) => void;
  onStatusChange: (volunteerId: string, newStatus: string) => void;
  onBoxStatusChange: (boxId: number, newStatus: string) => void;
  onLogout: () => void;
}

export function AdminDashboard({
  volunteers,
  shifts,
  boxes,
  onVolunteersUpdate,
  onShiftsUpdate,
  onStatusChange,
  onBoxStatusChange,
  onLogout
}: AdminDashboardProps) {
  const { formattedTime } = useDateTime();
  const [activeShift, setActiveShift] = useState<number | null>(1);
  const [selectedBoxId, setSelectedBoxId] = useState<number | null>(null);
  const [currentView, setCurrentView] = useState<'dashboard' | 'admin'>('dashboard');

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

  // Calculate stats
  const stats = {
    totalVolunteers: volunteers.length,
    activeVolunteers: volunteers.filter(v => v.roles.some(r => r.status === 'active' || r.status === 'checked_in')).length,
    totalBoxes: boxes.length,
    activeBoxes: boxes.filter(b => b.status === 'active').length,
    completedTasks: volunteers.filter(v => v.roles.some(r => r.status === 'completed')).length
  };

  if (currentView === 'admin') {
    return (
      <AdminPanel
        volunteers={volunteers}
        shifts={shifts}
        onVolunteersUpdate={onVolunteersUpdate}
        onShiftsUpdate={onShiftsUpdate}
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
      
      {/* Admin Header Bar */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-5 h-5" />
              <span className="font-medium">Admin Dashboard</span>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setCurrentView('admin')}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
              >
                Manage System
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* Top Stats Bar */}
        <StatusOverview stats={stats} />
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-6">
          {/* Left Sidebar - Schedule */}
          <div className="col-span-12 lg:col-span-3">
            <ShiftTimeline 
              shifts={shifts}
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
                onBoxStatusChange={onBoxStatusChange}
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
            onStatusChange={onStatusChange}
          />
          
          <VolunteerSection
            title="Keymen"
            volunteers={volunteers}
            roleType="keyman"
            activeShift={activeShift}
            onStatusChange={onStatusChange}
          />
          
          <VolunteerSection
            title="Money Counters"
            volunteers={volunteers}
            roleType="money_counter"
            activeShift={activeShift}
            onStatusChange={onStatusChange}
          />
        </div>
      </main>
    </div>
  );
}