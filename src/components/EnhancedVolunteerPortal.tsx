import React, { useState } from 'react';
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
  X
} from 'lucide-react';
import { FloorPlan } from './FloorPlan';
import { boxes } from '../data/initialData';

interface EnhancedVolunteerPortalProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onAdminLogin?: () => void;
}

export function EnhancedVolunteerPortal({ volunteers, shifts, onAdminLogin }: EnhancedVolunteerPortalProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const handleVolunteerSelect = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  if (selectedVolunteer) {
    return (
      <VolunteerDashboard 
        volunteer={selectedVolunteer} 
        shifts={shifts}
        onBack={() => setSelectedVolunteer(null)} 
        onAdminLogin={onAdminLogin}
      />
    );
  }

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

      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center mb-4 sm:mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <User className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-2 sm:mb-3">Welcome, Volunteers!</h2>
          <p className="text-base sm:text-lg text-gray-600 mb-2">Find your assignment for the July 11-13, 2025 convention</p>
          <p className="text-sm text-gray-500">Select your name below to view your detailed assignment information</p>
        </div>

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-8">
          <div className="flex items-center justify-between mb-6 sm:mb-8">
            <h3 className="text-xl sm:text-2xl font-semibold text-gray-900">Find Your Assignment</h3>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span className="hidden sm:inline">{volunteers.length} volunteers registered</span>
              <span className="sm:hidden">{volunteers.length}</span>
            </div>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
            {volunteers.map(volunteer => {
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

  const getInstructions = (roleType: string) => {
    const baseInstructions = [
      "Arrive 10 minutes before your shift begins for proper handover",
      "Bring proper identification and be ready to show it when requested",
      "Follow all security protocols strictly and without exception",
      "Report any issues or concerns immediately to supervision"
    ];

    const roleSpecificInstructions = {
      box_watcher: [
        ...baseInstructions,
        "Never leave your assigned box unattended under any circumstances",
        "Only allow authorized Accounts Department personnel to handle your box",
        "Pay close attention to prevent anyone from walking off with the box",
        "Be neat, clean, and modest in dress and grooming",
        "Do not allow anyone to take anything out of your box during your shift",
        "Wait for known accounting personnel (keymen) with proper identification during shift changes",
        "Return your box to the designated location at the end of your shift"
      ],
      keyman: [
        ...baseInstructions,
        "Assist with box collection and secure transport to counting area",
        "Verify volunteer identities during shift changes using proper identification",
        "Ensure proper documentation of all box transfers and handovers",
        "Coordinate with Accounts Department for any issues or concerns",
        "Maintain security protocols at all times during transport",
        "Work as a team with other keymen for maximum security"
      ],
      money_counter: [
        ...baseInstructions,
        "Work only at designated counting tables in the secure area",
        "Follow all security protocols for handling contributions",
        "Maintain accurate records of all counted amounts",
        "Report any discrepancies immediately to supervision",
        "Work in teams for accuracy and security - never count alone",
        "Keep all counting activities confidential and secure"
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
          <AssignmentOverview volunteer={volunteer} shifts={shifts} getDayColor={getDayColor} getInstructions={getInstructions} />
        )}

        {activeTab === 'schedule' && (
          <FullScheduleView shiftsByDay={shiftsByDay} getDayColor={getDayColor} />
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
  getInstructions 
}: { 
  volunteer: Volunteer; 
  shifts: Shift[]; 
  getDayColor: (day?: string) => string;
  getInstructions: (roleType: string) => string[];
}) {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Assignment Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
        {volunteer.roles.map((role, index) => {
          const shift = shifts.find(s => s.id === role.shift);
          const instructions = getInstructions(role.type);
          
          return (
            <div key={index} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 capitalize">
                  {role.type.replace('_', ' ')}
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
                      <div className="font-semibold text-blue-700 text-sm sm:text-base">{shift.name}</div>
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
                      <h4 className="font-semibold text-teal-900 text-sm sm:text-base">{shift.name}</h4>
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

                {/* Key Instructions */}
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
          const instructions = getInstructions(role.type);
          
          return (
            <div key={index} className="mb-6 last:mb-0">
              <h4 className="font-medium text-gray-900 mb-3 capitalize text-sm sm:text-base">
                {role.type.replace('_', ' ')} Instructions
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {instructions.map((instruction, i) => (
                  <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-gray-700">{instruction}</span>
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
  getDayColor 
}: { 
  shiftsByDay: Record<string, Array<{ role: any; shift: Shift }>>; 
  getDayColor: (day?: string) => string;
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
                {shiftsByDay[day] ? shiftsByDay[day].map((item, index) => (
                  <div key={index} className="p-4 bg-white border border-gray-200 rounded-lg shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 space-y-2 sm:space-y-0">
                      <h5 className="font-medium text-gray-900 capitalize text-sm sm:text-base">
                        {item.role.type.replace('_', ' ')}
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
                      <div>{item.shift.startTime} - {item.shift.endTime}</div>
                      {item.role.location && <div>📍 {item.role.location}</div>}
                      {item.role.boxNumber && <div>📦 Box #{item.role.boxNumber}</div>}
                    </div>
                  </div>
                )) : (
                  <div className="p-4 text-center text-gray-500 bg-gray-50 rounded-lg">
                    No assignments for {day}
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Convention Schedule Overview */}
      <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-4 sm:p-6">
        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 flex items-center">
          <Calendar className="w-5 h-5 mr-2 text-teal-600" />
          Convention Schedule Overview - July 11-13, 2025
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {days.map(day => (
            <div key={day} className={`p-4 rounded-lg border ${getDayColor(day)}`}>
              <h4 className="font-semibold mb-2">{day}</h4>
              <p className="text-xs opacity-75 mb-2">
                {day === 'Friday' ? 'July 11, 2025' : 
                 day === 'Saturday' ? 'July 12, 2025' : 
                 'July 13, 2025'}
              </p>
              <div className="text-sm space-y-1">
                <div>Morning Session</div>
                <div>Noon Intermission</div>
                <div>Afternoon Session</div>
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