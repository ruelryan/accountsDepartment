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
import { LogOut, Settings, Menu, X, Save, CheckCircle } from 'lucide-react';

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
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const handleShiftChange = (shiftId: number) => {
    setActiveShift(shiftId);
    setMobileMenuOpen(false);
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

  // Enhanced handlers that track changes
  const handleStatusChangeWithTracking = (volunteerId: string, newStatus: string) => {
    onStatusChange(volunteerId, newStatus);
    setHasUnsavedChanges(true);
  };

  const handleBoxStatusChangeWithTracking = (boxId: number, newStatus: string) => {
    onBoxStatusChange(boxId, newStatus);
    setHasUnsavedChanges(true);
  };

  const handleVolunteersUpdateWithTracking = (updatedVolunteers: Volunteer[]) => {
    onVolunteersUpdate(updatedVolunteers);
    setHasUnsavedChanges(true);
  };

  const handleShiftsUpdateWithTracking = (updatedShifts: Shift[]) => {
    onShiftsUpdate(updatedShifts);
    setHasUnsavedChanges(true);
  };

  // Save changes function
  const handleSaveChanges = async () => {
    setIsSaving(true);
    
    try {
      // Simulate saving to backend/localStorage
      const dataToSave = {
        volunteers,
        shifts,
        boxes,
        timestamp: new Date().toISOString()
      };
      
      // Save to localStorage as backup
      localStorage.setItem('conventionAccountsData', JSON.stringify(dataToSave));
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setHasUnsavedChanges(false);
      setLastSaved(new Date());
      
      // Show success message
      const successMessage = document.createElement('div');
      successMessage.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2';
      successMessage.innerHTML = `
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>Changes saved successfully!</span>
      `;
      document.body.appendChild(successMessage);
      
      setTimeout(() => {
        document.body.removeChild(successMessage);
      }, 3000);
      
    } catch (error) {
      console.error('Error saving changes:', error);
      alert('Error saving changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
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
        onVolunteersUpdate={handleVolunteersUpdateWithTracking}
        onShiftsUpdate={handleShiftsUpdateWithTracking}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="font-medium text-sm sm:text-base">Admin Dashboard</span>
              {hasUnsavedChanges && (
                <span className="px-2 py-1 bg-yellow-500 text-yellow-900 rounded-full text-xs font-medium">
                  Unsaved Changes
                </span>
              )}
              {lastSaved && !hasUnsavedChanges && (
                <span className="text-xs text-white/70">
                  Last saved: {lastSaved.toLocaleTimeString()}
                </span>
              )}
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              {/* Save Button */}
              <button
                onClick={handleSaveChanges}
                disabled={!hasUnsavedChanges || isSaving}
                className={`flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 rounded-lg font-medium transition-all text-sm ${
                  hasUnsavedChanges && !isSaving
                    ? 'bg-green-600 hover:bg-green-700 text-white shadow-lg'
                    : 'bg-white/20 text-white/50 cursor-not-allowed'
                }`}
              >
                {isSaving ? (
                  <>
                    <div className="w-3 h-3 sm:w-4 sm:h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    <span className="hidden sm:inline">Saving...</span>
                  </>
                ) : hasUnsavedChanges ? (
                  <>
                    <Save className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Save Changes</span>
                    <span className="sm:hidden">Save</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-3 h-3 sm:w-4 sm:h-4" />
                    <span className="hidden sm:inline">Saved</span>
                  </>
                )}
              </button>

              <button
                onClick={() => setCurrentView('admin')}
                className="px-3 py-2 sm:px-4 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors text-sm"
              >
                <span className="hidden sm:inline">Manage System</span>
                <span className="sm:hidden">Manage</span>
              </button>
              <button
                onClick={onLogout}
                className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-white/20 hover:bg-white/30 rounded-lg font-medium transition-colors text-sm"
              >
                <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-4 sm:py-8">
        {/* Top Stats Bar */}
        <StatusOverview stats={stats} />
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden mb-4">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="w-full flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
          >
            <span className="font-medium text-gray-900">Schedule & Actions</span>
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden mb-6 space-y-4">
            <ShiftTimeline 
              shifts={shifts}
              activeShift={activeShift}
              onShiftChange={handleShiftChange}
            />
            <QuickActions
              onEmergencyAlert={handleEmergencyAlert}
              onGenerateReport={handleGenerateReport}
              onRefreshData={handleRefreshData}
            />
          </div>
        )}
        
        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6">
          {/* Left Sidebar - Schedule (Hidden on mobile when menu is closed) */}
          <div className="hidden lg:block lg:col-span-3">
            <ShiftTimeline 
              shifts={shifts}
              activeShift={activeShift}
              onShiftChange={handleShiftChange}
            />
          </div>
          
          {/* Center Content */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6">
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
                onBoxStatusChange={handleBoxStatusChangeWithTracking}
                selectedBoxId={selectedBoxId}
              />
            </div>
          </div>
          
          {/* Right Sidebar - Actions (Hidden on mobile when menu is closed) */}
          <div className="hidden lg:block lg:col-span-3">
            <QuickActions
              onEmergencyAlert={handleEmergencyAlert}
              onGenerateReport={handleGenerateReport}
              onRefreshData={handleRefreshData}
            />
          </div>
        </div>
        
        {/* Volunteer Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6 mt-6 sm:mt-8">
          <VolunteerSection
            title="Box Watchers"
            volunteers={volunteers}
            roleType="box_watcher"
            activeShift={activeShift}
            onStatusChange={handleStatusChangeWithTracking}
          />
          
          <VolunteerSection
            title="Keymen"
            volunteers={volunteers}
            roleType="keyman"
            activeShift={activeShift}
            onStatusChange={handleStatusChangeWithTracking}
          />
          
          <VolunteerSection
            title="Money Counters"
            volunteers={volunteers}
            roleType="money_counter"
            activeShift={activeShift}
            onStatusChange={handleStatusChangeWithTracking}
          />
        </div>
      </main>

      {/* Unsaved Changes Warning */}
      {hasUnsavedChanges && (
        <div className="fixed bottom-4 left-4 right-4 sm:left-auto sm:right-4 sm:w-96 bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-lg z-40">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Save className="w-4 h-4 text-yellow-600" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-yellow-800">You have unsaved changes</p>
              <p className="text-xs text-yellow-600">Don't forget to save your assignment updates</p>
            </div>
            <button
              onClick={handleSaveChanges}
              disabled={isSaving}
              className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 text-white rounded text-sm font-medium transition-colors disabled:opacity-50"
            >
              {isSaving ? 'Saving...' : 'Save Now'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}