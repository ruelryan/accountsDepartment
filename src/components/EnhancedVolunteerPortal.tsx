import React, { useState, useMemo } from 'react';
import { Volunteer, Shift } from '../types';
import { 
  User, 
  Clock, 
  MapPin, 
  Package, 
  CheckCircle, 
  AlertTriangle, 
  FileText, 
  Calendar,
  Users,
  Settings,
  Shield,
  ArrowLeft,
  Menu,
  X,
  Search
} from 'lucide-react';
import { FloorPlan } from './FloorPlan';
import { boxes } from '../data/initialData';

interface EnhancedVolunteerPortalProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onAdminLogin?: () => void;
  selectedVolunteer?: Volunteer | null;
  onBack?: () => void;
}

export function EnhancedVolunteerPortal({ 
  volunteers, 
  shifts, 
  onAdminLogin,
  selectedVolunteer,
  onBack
}: EnhancedVolunteerPortalProps) {
  const [internalSelectedVolunteer, setInternalSelectedVolunteer] = useState<Volunteer | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Use prop selectedVolunteer if provided, otherwise use internal state
  const currentSelectedVolunteer = selectedVolunteer || internalSelectedVolunteer;

  // Filter volunteers based on search term
  const filteredVolunteers = useMemo(() => {
    if (!searchTerm.trim()) {
      return volunteers;
    }
    
    const searchLower = searchTerm.toLowerCase().trim();
    return volunteers.filter(volunteer => {
      const fullName = `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase();
      const firstName = volunteer.firstName.toLowerCase();
      const lastName = volunteer.lastName.toLowerCase();
      
      return fullName.includes(searchLower) || 
             firstName.includes(searchLower) || 
             lastName.includes(searchLower);
    });
  }, [volunteers, searchTerm]);

  const handleVolunteerSelect = (volunteer: Volunteer) => {
    if (selectedVolunteer) {
      // If selectedVolunteer prop is provided, we're in controlled mode
      // Don't change selection internally
      return;
    }
    setInternalSelectedVolunteer(volunteer);
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      setInternalSelectedVolunteer(null);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
  };

  if (currentSelectedVolunteer) {
    return (
      <VolunteerDashboard 
        volunteer={currentSelectedVolunteer} 
        shifts={shifts}
        onBack={handleBack}
        onAdminLogin={onAdminLogin}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header with Admin Login and Back Button */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              {onBack && (
                <button
                  onClick={onBack}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors mr-4"
                >
                  <ArrowLeft className="w-5 h-5" />
                  <span className="hidden sm:inline">Back to Schedule</span>
                </button>
              )}
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Convention Accounts</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">July 11-13, 2025 • Volunteer Portal</p>
              </div>
            </div>
            
            {onAdminLogin && (
              <button
                onClick={onAdminLogin}
                className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Admin Login</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Welcome, Volunteers!</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-2">Find your assignment for the July 11-13, 2025 convention</p>
          <p className="text-sm text-gray-500">Search for your name or select from the list below</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 sm:mb-8 space-y-4 sm:space-y-0">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Find Your Assignment</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">
                {filteredVolunteers.length} of {volunteers.length} volunteers
                {searchTerm && filteredVolunteers.length !== volunteers.length && ' found'}
              </span>
              <span className="sm:hidden">
                {filteredVolunteers.length}/{volunteers.length}
              </span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="mb-6">
            <div className="relative max-w-md mx-auto">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-sm sm:text-base"
                placeholder="Search by first name or last name..."
              />
              {searchTerm && (
                <button
                  onClick={clearSearch}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
            
            {searchTerm && (
              <div className="text-center mt-2">
                <span className="text-sm text-gray-600">
                  {filteredVolunteers.length === 0 
                    ? `No volunteers found matching "${searchTerm}"`
                    : `Found ${filteredVolunteers.length} volunteer${filteredVolunteers.length !== 1 ? 's' : ''} matching "${searchTerm}"`
                  }
                </span>
                {filteredVolunteers.length === 0 && (
                  <button
                    onClick={clearSearch}
                    className="ml-2 text-teal-600 hover:text-teal-700 font-medium text-sm"
                  >
                    Clear search
                  </button>
                )}
              </div>
            )}
          </div>
          
          {/* Volunteers Grid */}
          {filteredVolunteers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
              {filteredVolunteers.map(volunteer => {
                const hasMultipleRoles = volunteer.roles.length > 1;
                const primaryRole = volunteer.roles[0];
                
                return (
                  <button
                    key={volunteer.id}
                    onClick={() => handleVolunteerSelect(volunteer)}
                    className="p-4 sm:p-5 text-left border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all group hover:shadow-lg transform hover:scale-[1.02] bg-white/60 backdrop-blur-sm"
                  >
                    <div className="flex items-center space-x-3 mb-3 sm:mb-4">
                      <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                        <span className="text-white font-bold text-xs sm:text-sm">
                          {volunteer.firstName[0]}{volunteer.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-semibold text-gray-900 group-hover:text-teal-700 truncate text-sm sm:text-base">
                          {volunteer.firstName} {volunteer.lastName}
                        </p>
                        <div className="flex flex-wrap items-center gap-1 sm:gap-2 mt-1">
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            volunteer.gender === 'male' 
                              ? 'bg-blue-100 text-blue-700' 
                              : 'bg-pink-100 text-pink-700'
                          }`}>
                            {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                          </span>
                          {hasMultipleRoles && (
                            <span className="px-2 py-0.5 bg-purple-100 text-purple-700 rounded-full text-xs font-medium">
                              Multiple
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      {volunteer.roles.slice(0, 2).map((role, index) => (
                        <div key={index} className="flex items-center justify-between text-xs sm:text-sm">
                          <span className="text-gray-600 capitalize font-medium truncate">
                            {role.type.replace('_', ' ')}
                            {role.timeLabel && ` (${role.timeLabel})`}
                          </span>
                          {role.day && (
                            <span className={`px-2 py-0.5 rounded text-xs font-medium flex-shrink-0 ml-2 ${
                              role.day === 'Friday' ? 'bg-blue-100 text-blue-700' :
                              role.day === 'Saturday' ? 'bg-green-100 text-green-700' :
                              'bg-orange-100 text-orange-700'
                            }`}>
                              {role.day}
                            </span>
                          )}
                        </div>
                      ))}
                      {volunteer.roles.length > 2 && (
                        <div className="text-xs text-gray-500 font-medium">
                          +{volunteer.roles.length - 2} more
                        </div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          ) : searchTerm ? (
            <div className="text-center py-12">
              <Search className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">No volunteers found</h3>
              <p className="text-gray-600 mb-4">Try searching with a different name or check the spelling.</p>
              <button
                onClick={clearSearch}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                Show All Volunteers
              </button>
            </div>
          ) : null}
        </div>

        {/* Quick Info Section */}
        <div className="mt-6 sm:mt-8 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Calendar className="w-4 h-4 sm:w-5 sm:h-5 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Convention Dates</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">July 11-13, 2025 (Friday-Sunday) with multiple shifts throughout each day.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Package className="w-4 h-4 sm:w-5 sm:h-5 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Your Role</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Each volunteer has specific assignments including box watching, key duties, or money counting.</p>
          </div>

          <div className="bg-white/60 backdrop-blur-sm rounded-xl p-4 sm:p-6 border border-white/20">
            <div className="flex items-center space-x-3 mb-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <AlertTriangle className="w-4 h-4 sm:w-5 sm:h-5 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-900 text-sm sm:text-base">Important</h4>
            </div>
            <p className="text-xs sm:text-sm text-gray-600">Arrive 10 minutes early for your shift and bring proper identification.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

interface VolunteerDashboardProps {
  volunteer: Volunteer;
  shifts: Shift[];
  onBack: () => void;
  onAdminLogin?: () => void;
}

function VolunteerDashboard({ volunteer, shifts, onBack, onAdminLogin }: VolunteerDashboardProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'schedule' | 'floorplan'>('overview');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Helper function to get shift number within day (1-4)
  const getShiftNumberInDay = (shiftId: number) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return shiftId;
    
    const dayShifts = shifts.filter(s => s.day === shift.day);
    const sortedDayShifts = dayShifts.sort((a, b) => a.id - b.id);
    const index = sortedDayShifts.findIndex(s => s.id === shiftId);
    return index + 1;
  };

  const getVolunteerShifts = () => {
    return volunteer.roles.map(role => {
      const shift = shifts.find(s => s.id === role.shift);
      return { role, shift };
    }).filter(item => item.shift);
  };

  const getShiftsByDay = () => {
    const volunteerShifts = getVolunteerShifts();
    const shiftsByDay: Record<string, Array<{ role: any; shift: Shift }>> = {};
    
    volunteerShifts.forEach(item => {
      if (item.shift) {
        if (!shiftsByDay[item.shift.day]) {
          shiftsByDay[item.shift.day] = [];
        }
        shiftsByDay[item.shift.day].push(item);
      }
    });
    
    return shiftsByDay;
  };

  const getInstructions = (roleType: string, shiftNumber?: number) => {
    const baseInstructions = [
      "Arrive 10 minutes before your shift begins for proper handover",
      "Bring proper identification and be ready to show it when requested",
      "Follow all security protocols strictly and without exception",
      "Report any issues or concerns immediately to supervision"
    ];

    const roleSpecificInstructions = {
      box_watcher: [
        // General Box Watcher Instructions
        "Be neat, clean, and modest in dress and grooming at all times",
        "Never leave your assigned box unattended under any circumstances",
        "Only allow authorized Accounts Department personnel to handle your box",
        "Pay close attention to prevent anyone from walking off with the box",
        "Do not allow anyone to take anything out of your box during your shift",
        "Wait for known accounting personnel (keymen) with proper identification during shift changes",
        "Box number can be seen at the bottom of the box",
        "If the next box watcher has not yet arrived, keyman must assign replacement from accounts department until the assigned person arrives",
        
        // Shift-specific instructions
        ...(shiftNumber === 1 ? [
          "🔹 1st Shift Instructions:",
          "• Go to 'Box Storage' and get your contribution box based on your assigned box number",
          "• Go to your designated location and place the box (ask keymen for assistance if needed)",
          "• At the start of morning session during opening song, bring the box to 'Box Storage' area to be emptied",
          "• If assigned to entrance/exit area, return to box location and wait until 2nd shift arrives",
          "• Otherwise, this marks the end of your shift"
        ] : []),
        
        ...(shiftNumber === 2 ? [
          "🔹 2nd Shift Instructions:",
          "• If assigned to entrance/exit location, go directly to designated location",
          "• Otherwise, go to 'Box Storage' and get your contribution box based on assigned number",
          "• Go to your location and place the box (ask keymen for assistance if needed)",
          "• Wait for 3rd shift to arrive midway through noon intermission (around 12:55pm)",
          "• That marks the end of your shift"
        ] : []),
        
        ...(shiftNumber === 3 ? [
          "🔹 3rd Shift Instructions:",
          "• Go to your assigned location (ask keyman for help if needed)",
          "• At the start of afternoon session during opening song, bring box to 'Box Storage' area to be emptied",
          "• If assigned to entrance/exit area, return to box location and wait until 4th shift arrives",
          "• Otherwise, this marks the end of your shift"
        ] : []),
        
        ...(shiftNumber === 4 ? [
          "🔹 4th Shift Instructions:",
          "• If assigned to entrance/exit location, go directly to designated location",
          "• Otherwise, go to 'Box Storage' and get your contribution box based on assigned number",
          "• Go to your location and place the box (ask keymen for assistance if needed)",
          "• Wait until most attendees in your area have left before ending shift"
        ] : [])
      ],
      
      keyman: [
        ...baseInstructions,
        "🔹 Keyman Responsibilities:",
        "• Guide box watchers to their respective locations",
        "• Monitor contribution boxes - ensure no unauthorized boxes are placed in the area",
        "• At the end of each shift, verify that no contribution boxes are missing",
        "• Empty contribution boxes with at least 2 brothers present",
        "• Verify volunteer identities during shift changes using proper identification",
        "• Ensure proper documentation of all box transfers and handovers",
        "• Coordinate with Accounts Department for any issues or concerns",
        "• Maintain security protocols at all times during transport",
        "• Work as a team with other keymen for maximum security"
      ],
      
      money_counter: [
        ...baseInstructions,
        "🔹 Money Counting Requirements:",
        "• At least 2 brothers must be present at the counting table at all times",
        "• Ensure 'Receipt (CO-40)' form is available before counting begins",
        "• Receipt number must be written beforehand by the accounts overseer",
        "• Make verification upon counting - double-check all amounts",
        "• After counting and filling up the 'Receipt (CO-40)' form, promptly give copy to Convention Committee Office",
        "• Give the other copy to the Accounts Department",
        "• No one is permitted to take money off any counting table until it has been counted, verified, and recorded",
        "• No bags, purses, or similar personal items are permitted around or under counting tables",
        "• An overseer must be assigned for each table to ensure all instructions are followed",
        "• Work only at designated counting tables in the secure area",
        "• Follow all security protocols for handling contributions",
        "• Maintain accurate records of all counted amounts",
        "• Report any discrepancies immediately to supervision",
        "• Keep all counting activities confidential and secure"
      ]
    };

    return roleSpecificInstructions[roleType as keyof typeof roleSpecificInstructions] || baseInstructions;
  };

  const getDayColor = (day?: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Saturday': return 'bg-green-100 text-green-800 border-green-200';
      case 'Sunday': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const shiftsByDay = getShiftsByDay();

  const tabs = [
    { id: 'overview', label: 'Overview', icon: Package },
    { id: 'schedule', label: 'Schedule', icon: Calendar },
    { id: 'floorplan', label: 'Floor Plan', icon: MapPin }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      {/* Header with Admin Login */}
      <div className="bg-white/80 backdrop-blur-sm border-b border-white/20 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-teal-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg flex-shrink-0">
                <Users className="w-4 h-4 sm:w-6 sm:h-6 text-white" />
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-lg sm:text-xl font-bold text-gray-900 truncate">Convention Accounts</h1>
                <p className="text-xs sm:text-sm text-gray-600 truncate">July 11-13, 2025 • Volunteer Portal</p>
              </div>
            </div>
            
            {onAdminLogin && (
              <button
                onClick={onAdminLogin}
                className="flex items-center space-x-1 sm:space-x-2 px-3 py-2 sm:px-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-sm"
              >
                <Shield className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Admin Login</span>
                <span className="sm:hidden">Admin</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6 mb-4 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
            <div className="flex items-center space-x-3 sm:space-x-4">
              <div className="w-12 h-12 sm:w-16 sm:h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-lg flex-shrink-0">
                <span className="text-white font-bold text-lg sm:text-xl">
                  {volunteer.firstName[0]}{volunteer.lastName[0]}
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <h1 className="text-xl sm:text-3xl font-bold text-gray-900 truncate">
                  {volunteer.firstName} {volunteer.lastName}
                </h1>
                <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2">
                  <span className={`px-2 sm:px-3 py-1 rounded-full text-xs sm:text-sm font-medium ${
                    volunteer.gender === 'male' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-pink-100 text-pink-800'
                  }`}>
                    {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-teal-100 text-teal-800 rounded-full text-xs sm:text-sm font-medium">
                    {volunteer.roles.length} Assignment{volunteer.roles.length !== 1 ? 's' : ''}
                  </span>
                  <span className="px-2 sm:px-3 py-1 bg-purple-100 text-purple-800 rounded-full text-xs sm:text-sm font-medium">
                    July 11-13, 2025
                  </span>
                </div>
              </div>
            </div>
            <button
              onClick={onBack}
              className="flex items-center space-x-2 px-4 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg text-sm sm:text-base"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Portal</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 mb-4 sm:mb-6">
          {/* Mobile Tab Menu */}
          <div className="sm:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="w-full flex items-center justify-between p-4 border-b border-gray-200"
            >
              <div className="flex items-center space-x-2">
                {(() => {
                  const activeTabData = tabs.find(tab => tab.id === activeTab);
                  const IconComponent = activeTabData?.icon;
                  return IconComponent ? <IconComponent className="w-4 h-4" /> : null;
                })()}
                <span className="font-medium">{tabs.find(tab => tab.id === activeTab)?.label}</span>
              </div>
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
            
            {mobileMenuOpen && (
              <div className="border-b border-gray-200">
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id as any);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center space-x-2 px-4 py-3 text-left transition-all ${
                      activeTab === tab.id
                        ? 'bg-teal-50 text-teal-600 border-r-2 border-teal-500'
                        : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <tab.icon className="w-4 h-4" />
                    <span className="font-medium text-sm">{tab.label}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Desktop Tabs */}
          <div className="hidden sm:flex border-b border-gray-200">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`px-6 py-4 font-medium text-sm transition-all ${
                  activeTab === tab.id
                    ? 'border-b-2 border-teal-500 text-teal-600 bg-teal-50'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="w-4 h-4 inline mr-2" />
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <AssignmentOverview 
            volunteer={volunteer} 
            shifts={shifts} 
            getDayColor={getDayColor} 
            getInstructions={getInstructions}
            getShiftNumberInDay={getShiftNumberInDay}
          />
        )}

        {activeTab === 'schedule' && (
          <FullScheduleView 
            shiftsByDay={shiftsByDay} 
            getDayColor={getDayColor}
            getShiftNumberInDay={getShiftNumberInDay}
          />
        )}

        {activeTab === 'floorplan' && (
          <FloorPlanView volunteer={volunteer} />
        )}
      </div>
    </div>
  );
}

// Assignment Overview Component
function AssignmentOverview({ 
  volunteer, 
  shifts, 
  getDayColor, 
  getInstructions,
  getShiftNumberInDay
}: { 
  volunteer: Volunteer; 
  shifts: Shift[]; 
  getDayColor: (day?: string) => string;
  getInstructions: (roleType: string, shiftNumber?: number) => string[];
  getShiftNumberInDay: (shiftId: number) => number;
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Assignment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {volunteer.roles.map((role, index) => {
          const shift = shifts.find(s => s.id === role.shift);
          const shiftNumInDay = role.shift ? getShiftNumberInDay(role.shift) : undefined;
          const instructions = getInstructions(role.type, shiftNumInDay);
          
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize">
                  {role.type.replace('_', ' ')}
                  {role.timeLabel && ` (${role.timeLabel})`}
                </h3>
                {role.day && (
                  <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getDayColor(role.day)} self-start sm:self-auto`}>
                    {role.day}
                  </span>
                )}
              </div>
              
              <div className="space-y-4">
                {/* Assignment Details */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                  {role.shift && shift && (
                    <div className="p-3 bg-blue-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">Shift</div>
                      <div className="font-semibold text-blue-700 text-sm sm:text-base">
                        Shift {shiftNumInDay} - {role.day}
                      </div>
                    </div>
                  )}
                  
                  {role.location && (
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">Location</div>
                      <div className="font-semibold text-green-700 text-sm sm:text-base">{role.location}</div>
                    </div>
                  )}
                  
                  {role.boxNumber && (
                    <div className="p-3 bg-yellow-50 rounded-lg">
                      <div className="text-sm font-medium text-gray-700">Box Number</div>
                      <div className="font-semibold text-yellow-700 text-sm sm:text-base">Box #{role.boxNumber}</div>
                    </div>
                  )}
                  
                  <div className="p-3 bg-gray-50 rounded-lg">
                    <div className="text-sm font-medium text-gray-700">Status</div>
                    <div className={`font-semibold capitalize text-sm sm:text-base ${
                      role.status === 'active' ? 'text-green-700' :
                      role.status === 'checked_in' ? 'text-blue-700' :
                      role.status === 'completed' ? 'text-gray-700' :
                      'text-yellow-700'
                    }`}>
                      {role.status.replace('_', ' ')}
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                {shift && (
                  <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-semibold text-teal-900 text-sm sm:text-base">
                        Shift {shiftNumInDay} - {shift.day}
                      </h4>
                      <Clock className="w-4 h-4 text-teal-600" />
                    </div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center text-gray-700">
                        <span className="font-medium mr-2">Start:</span>
                        <span>{shift.startTime}</span>
                      </div>
                      <div className="flex items-center text-gray-700">
                        <span className="font-medium mr-2">End:</span>
                        <span>{shift.endTime}</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Key Instructions Preview */}
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800 text-sm sm:text-base">Key Instructions</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    {instructions.slice(0, 3).map((instruction, i) => (
                      <li key={i}>• {instruction}</li>
                    ))}
                  </ul>
                  <p className="text-xs text-yellow-600 mt-2 font-medium">
                    See complete instructions below ↓
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Complete Instructions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <FileText className="w-5 h-5 mr-2 text-teal-600" />
          Complete Instructions & Guidelines
        </h3>
        
        {volunteer.roles.map((role, index) => {
          const shiftNumInDay = role.shift ? getShiftNumberInDay(role.shift) : undefined;
          const instructions = getInstructions(role.type, shiftNumInDay);
          
          return (
            <div key={index} className="mb-6 last:mb-0">
              <h4 className="font-medium text-gray-900 mb-3 capitalize text-sm sm:text-base">
                {role.type.replace('_', ' ')} Instructions
                {role.shift && ` - Shift ${shiftNumInDay}`}
                {role.timeLabel && ` (${role.timeLabel})`}
              </h4>
              <div className="space-y-1">
                {instructions.map((instruction, i) => (
                  <div key={i} className="flex items-start space-x-3 p-2 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700 leading-snug">{instruction}</span>
                  </div>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// Full Schedule View Component
function FullScheduleView({ 
  shiftsByDay, 
  getDayColor,
  getShiftNumberInDay
}: { 
  shiftsByDay: Record<string, Array<{ role: any; shift: Shift }>>; 
  getDayColor: (day?: string) => string;
  getShiftNumberInDay: (shiftId: number) => number;
}) {
  const days = ['Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">Your Complete Convention Schedule</h3>
        <p className="text-sm text-gray-600 mb-4 sm:mb-6">July 11-13, 2025 Convention Schedule</p>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
          {days.map(day => (
            <div key={day} className="space-y-4">
              <div className={`p-4 rounded-lg border ${getDayColor(day)}`}>
                <h4 className="font-semibold text-lg">{day}</h4>
                <p className="text-sm opacity-75">
                  {day === 'Friday' ? 'July 11, 2025' : 
                   day === 'Saturday' ? 'July 12, 2025' : 
                   'July 13, 2025'}
                </p>
              </div>
              
              <div className="space-y-3">
                {shiftsByDay[day] ? shiftsByDay[day].map((item, index) => {
                  const shiftNumInDay = item.shift ? getShiftNumberInDay(item.shift.id) : null;
                  
                  return (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                        <h5 className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                          {item.role.type.replace('_', ' ')}
                          {item.role.timeLabel && ` (${item.role.timeLabel})`}
                          {shiftNumInDay && ` - Shift ${shiftNumInDay}`}
                        </h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium self-start sm:self-auto ${
                          item.role.status === 'active' ? 'bg-green-100 text-green-800' :
                          item.role.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                          item.role.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                          'bg-yellow-100 text-yellow-800'
                        }`}>
                          {item.role.status.replace('_', ' ')}
                        </span>
                      </div>
                      
                      <div className="text-sm text-gray-600 space-y-1">
                        {item.shift && <div>{item.shift.startTime} - {item.shift.endTime}</div>}
                        {item.role.location && <div>📍 {item.role.location}</div>}
                        {item.role.boxNumber && <div>📦 Box #{item.role.boxNumber}</div>}
                      </div>
                    </div>
                  );
                }) : (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    No assignments for {day}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Floor Plan View Component
function FloorPlanView({ volunteer }: { volunteer: Volunteer }) {
  const handleBoxClick = (boxId: number) => {
    // Handle box click if needed
  };

  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">Your Box Assignments - July 11-13, 2025</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
          {volunteer.roles.filter(role => role.boxNumber).map((role, index) => (
            <div key={index} className="p-4 bg-teal-50 border border-teal-200 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-medium text-teal-900 text-sm sm:text-base">Box #{role.boxNumber}</h4>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  role.day === 'Friday' ? 'bg-blue-100 text-blue-800' :
                  role.day === 'Saturday' ? 'bg-green-100 text-green-800' :
                  'bg-orange-100 text-orange-800'
                }`}>
                  {role.day}
                </span>
              </div>
              <div className="text-sm text-teal-700">
                <div>📍 {role.location}</div>
                <div>🕐 Shift {role.shift}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <FloorPlan boxes={boxes} onBoxClick={handleBoxClick} />
    </div>
  );
}