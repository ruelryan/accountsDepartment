import React, { useState, useMemo } from 'react';
import { Volunteer, Shift, MoneyCountingSession } from '../types';
import { 
  Users, 
  Package, 
  Key, 
  DollarSign, 
  Clock, 
  MapPin, 
  AlertTriangle, 
  CheckCircle,
  Phone,
  Calendar,
  User,
  X,
  Plus
} from 'lucide-react';

interface VolunteerManagementViewProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onVolunteersUpdate: (volunteers: Volunteer[]) => void;
  isOnline: boolean;
  lastSynced: Date | null;
}

export function VolunteerManagementView({ 
  volunteers, 
  shifts, 
  onVolunteersUpdate,
  isOnline,
  lastSynced 
}: VolunteerManagementViewProps) {
  const [activeTab, setActiveTab] = useState<'shifts' | 'money_counting'>('shifts');
  const [selectedDay, setSelectedDay] = useState<string>('Friday');

  // Money counting sessions with updated maximum of 8
  const moneyCountingSessions: MoneyCountingSession[] = [
    {
      id: 'friday-lunch',
      day: 'Friday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 4
    },
    {
      id: 'friday-afternoon',
      day: 'Friday', 
      time: 'after_afternoon',
      timeLabel: 'After Afternoon Session',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 4
    },
    {
      id: 'saturday-lunch',
      day: 'Saturday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 4
    },
    {
      id: 'saturday-afternoon',
      day: 'Saturday',
      time: 'after_afternoon', 
      timeLabel: 'After Afternoon Session',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 4
    },
    {
      id: 'sunday-lunch',
      day: 'Sunday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 4
    },
    {
      id: 'sunday-afternoon',
      day: 'Sunday',
      time: 'after_afternoon',
      timeLabel: 'After Afternoon Session', 
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 4
    }
  ];

  // Helper function to get shift number within day (1-4)
  const getShiftNumberInDay = (shiftId: number) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return shiftId;
    
    const dayShifts = shifts.filter(s => s.day === shift.day);
    const sortedDayShifts = dayShifts.sort((a, b) => a.id - b.id);
    const index = sortedDayShifts.findIndex(s => s.id === shiftId);
    return index + 1;
  };

  // Get volunteers assigned to a specific shift and role
  const getShiftVolunteers = (shiftId: number, roleType: 'box_watcher' | 'keyman') => {
    return volunteers.filter(v => 
      v.roles.some(role => 
        role.type === roleType && 
        role.shift === shiftId
      )
    );
  };

  // Get volunteers assigned to money counting session
  const getSessionVolunteers = (session: MoneyCountingSession) => {
    return volunteers.filter(v => 
      v.roles.some(role => 
        role.type === 'money_counter' && 
        role.day === session.day && 
        role.time === session.time
      )
    );
  };

  // Get shifts for selected day
  const getDayShifts = () => {
    return shifts.filter(s => s.day === selectedDay).sort((a, b) => a.id - b.id);
  };

  // Get money counting sessions for selected day
  const getDayMoneySessions = () => {
    return moneyCountingSessions.filter(s => s.day === selectedDay);
  };

  // Check for scheduling conflicts
  const getSchedulingConflicts = () => {
    const conflicts: Array<{
      type: 'understaffed' | 'overstaffed' | 'gender_imbalance';
      message: string;
      severity: 'high' | 'medium' | 'low';
      shiftId?: number;
      sessionId?: string;
    }> = [];

    // Check shift staffing
    shifts.forEach(shift => {
      const boxWatchers = getShiftVolunteers(shift.id, 'box_watcher');
      const keymen = getShiftVolunteers(shift.id, 'keyman');

      if (boxWatchers.length < shift.requiredBoxWatchers) {
        conflicts.push({
          type: 'understaffed',
          message: `Shift ${getShiftNumberInDay(shift.id)} (${shift.day}) needs ${shift.requiredBoxWatchers - boxWatchers.length} more box watchers`,
          severity: 'high',
          shiftId: shift.id
        });
      }

      if (keymen.length < shift.requiredKeymen) {
        conflicts.push({
          type: 'understaffed',
          message: `Shift ${getShiftNumberInDay(shift.id)} (${shift.day}) needs ${shift.requiredKeymen - keymen.length} more keymen`,
          severity: 'high',
          shiftId: shift.id
        });
      }
    });

    // Check money counting sessions
    moneyCountingSessions.forEach(session => {
      const assignedVolunteers = getSessionVolunteers(session);
      const brothers = assignedVolunteers.filter(v => v.gender === 'male');

      if (assignedVolunteers.length < session.requiredCount) {
        conflicts.push({
          type: 'understaffed',
          message: `${session.day} ${session.timeLabel} needs ${session.requiredCount - assignedVolunteers.length} more money counters`,
          severity: 'medium',
          sessionId: session.id
        });
      }

      if (brothers.length < session.minimumBrothers) {
        conflicts.push({
          type: 'gender_imbalance',
          message: `${session.day} ${session.timeLabel} needs ${session.minimumBrothers - brothers.length} more brothers`,
          severity: 'high',
          sessionId: session.id
        });
      }
    });

    return conflicts;
  };

  const conflicts = getSchedulingConflicts();
  const days = ['Friday', 'Saturday', 'Sunday'];

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'Saturday': return 'bg-green-50 border-green-200 text-green-900';
      case 'Sunday': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Volunteer Management Overview</h1>
            <p className="text-gray-600">Complete assignment details and scheduling overview</p>
          </div>
          <div className="flex items-center space-x-4">
            <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
              isOnline 
                ? 'bg-green-100 text-green-800' 
                : 'bg-red-100 text-red-800'
            }`}>
              <div className={`w-2 h-2 rounded-full ${isOnline ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span>{isOnline ? 'Live' : 'Offline'}</span>
            </div>
            {lastSynced && (
              <span className="text-xs text-gray-500">
                Last sync: {lastSynced.toLocaleTimeString()}
              </span>
            )}
          </div>
        </div>

        {/* Conflicts Alert */}
        {conflicts.length > 0 && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
            <div className="flex items-center mb-2">
              <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
              <h3 className="font-semibold text-red-900">Scheduling Issues ({conflicts.length})</h3>
            </div>
            <div className="space-y-1">
              {conflicts.slice(0, 3).map((conflict, index) => (
                <div key={index} className="text-sm text-red-700">
                  • {conflict.message}
                </div>
              ))}
              {conflicts.length > 3 && (
                <div className="text-sm text-red-600 font-medium">
                  +{conflicts.length - 3} more issues
                </div>
              )}
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center space-x-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('shifts')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'shifts'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Shift Personnel
            </button>
            <button
              onClick={() => setActiveTab('money_counting')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                activeTab === 'money_counting'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Money Counting
            </button>
          </div>

          <div className="flex space-x-2">
            {days.map(day => (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-3 py-2 rounded-lg text-sm font-medium border transition-all ${
                  selectedDay === day
                    ? getDayColor(day)
                    : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                }`}
              >
                {day}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      {activeTab === 'shifts' && (
        <ShiftPersonnelView 
          shifts={getDayShifts()}
          volunteers={volunteers}
          getShiftVolunteers={getShiftVolunteers}
          getShiftNumberInDay={getShiftNumberInDay}
          selectedDay={selectedDay}
        />
      )}

      {activeTab === 'money_counting' && (
        <MoneyCountingView 
          sessions={getDayMoneySessions()}
          volunteers={volunteers}
          getSessionVolunteers={getSessionVolunteers}
          selectedDay={selectedDay}
        />
      )}
    </div>
  );
}

// Shift Personnel View Component
interface ShiftPersonnelViewProps {
  shifts: Shift[];
  volunteers: Volunteer[];
  getShiftVolunteers: (shiftId: number, roleType: 'box_watcher' | 'keyman') => Volunteer[];
  getShiftNumberInDay: (shiftId: number) => number;
  selectedDay: string;
}

function ShiftPersonnelView({ 
  shifts, 
  volunteers, 
  getShiftVolunteers, 
  getShiftNumberInDay,
  selectedDay 
}: ShiftPersonnelViewProps) {
  return (
    <div className="space-y-6">
      {shifts.map(shift => {
        const boxWatchers = getShiftVolunteers(shift.id, 'box_watcher');
        const keymen = getShiftVolunteers(shift.id, 'keyman');
        const shiftNumInDay = getShiftNumberInDay(shift.id);

        return (
          <div key={shift.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  Shift {shiftNumInDay} - {selectedDay}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center">
                    <Clock className="w-4 h-4 mr-1" />
                    {shift.startTime} - {shift.endTime}
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Convention Hall
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{boxWatchers.length}/10</div>
                  <div className="text-xs text-gray-500">Box Watchers</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">{keymen.length}/3</div>
                  <div className="text-xs text-gray-500">Keymen</div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Box Watchers */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Package className="w-5 h-5 mr-2 text-blue-600" />
                    Box Watchers ({boxWatchers.length}/10)
                  </h3>
                  {boxWatchers.length < 10 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {10 - boxWatchers.length} needed
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {boxWatchers.map(volunteer => {
                    const role = volunteer.roles.find(r => r.type === 'box_watcher' && r.shift === shift.id);
                    return (
                      <VolunteerCard 
                        key={volunteer.id}
                        volunteer={volunteer}
                        role={role}
                        roleIcon={Package}
                        roleColor="blue"
                      />
                    );
                  })}
                  
                  {boxWatchers.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Package className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No box watchers assigned</p>
                    </div>
                  )}
                </div>
              </div>

              {/* Keymen */}
              <div>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900 flex items-center">
                    <Key className="w-5 h-5 mr-2 text-green-600" />
                    Keymen ({keymen.length}/3)
                  </h3>
                  {keymen.length < 3 && (
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {3 - keymen.length} needed
                    </span>
                  )}
                </div>
                
                <div className="space-y-3">
                  {keymen.map(volunteer => {
                    const role = volunteer.roles.find(r => r.type === 'keyman' && r.shift === shift.id);
                    return (
                      <VolunteerCard 
                        key={volunteer.id}
                        volunteer={volunteer}
                        role={role}
                        roleIcon={Key}
                        roleColor="green"
                      />
                    );
                  })}
                  
                  {keymen.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Key className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No keymen assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Money Counting View Component
interface MoneyCountingViewProps {
  sessions: MoneyCountingSession[];
  volunteers: Volunteer[];
  getSessionVolunteers: (session: MoneyCountingSession) => Volunteer[];
  selectedDay: string;
}

function MoneyCountingView({ 
  sessions, 
  volunteers, 
  getSessionVolunteers,
  selectedDay 
}: MoneyCountingViewProps) {
  return (
    <div className="space-y-6">
      {sessions.map(session => {
        const assignedVolunteers = getSessionVolunteers(session);
        const brothers = assignedVolunteers.filter(v => v.gender === 'male');
        const sisters = assignedVolunteers.filter(v => v.gender === 'female');

        return (
          <div key={session.id} className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-xl font-bold text-gray-900">
                  {selectedDay} - {session.timeLabel}
                </h2>
                <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    Money Counting Session
                  </div>
                  <div className="flex items-center">
                    <MapPin className="w-4 h-4 mr-1" />
                    Counting Table Area
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">{assignedVolunteers.length}/8</div>
                  <div className="text-xs text-gray-500">Total Assigned</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">{brothers.length}/4</div>
                  <div className="text-xs text-gray-500">Brothers (Min)</div>
                </div>
              </div>
            </div>

            {/* Status Indicators */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className={`p-4 rounded-lg border ${
                assignedVolunteers.length >= session.requiredCount 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Total Volunteers</span>
                  {assignedVolunteers.length >= session.requiredCount ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-yellow-600" />
                  )}
                </div>
                <div className="text-lg font-bold text-gray-900 mt-1">
                  {assignedVolunteers.length} / {session.requiredCount}
                </div>
                {assignedVolunteers.length < session.requiredCount && (
                  <div className="text-xs text-yellow-700 mt-1">
                    {session.requiredCount - assignedVolunteers.length} more needed
                  </div>
                )}
              </div>

              <div className={`p-4 rounded-lg border ${
                brothers.length >= session.minimumBrothers 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-red-50 border-red-200'
              }`}>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Brothers</span>
                  {brothers.length >= session.minimumBrothers ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-red-600" />
                  )}
                </div>
                <div className="text-lg font-bold text-gray-900 mt-1">
                  {brothers.length} / {session.minimumBrothers} min
                </div>
                {brothers.length < session.minimumBrothers && (
                  <div className="text-xs text-red-700 mt-1">
                    {session.minimumBrothers - brothers.length} more brothers required
                  </div>
                )}
              </div>

              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700">Sisters</span>
                  <User className="w-4 h-4 text-blue-600" />
                </div>
                <div className="text-lg font-bold text-gray-900 mt-1">
                  {sisters.length}
                </div>
                <div className="text-xs text-blue-700 mt-1">
                  No minimum required
                </div>
              </div>
            </div>

            {/* Assigned Volunteers */}
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                Assigned Money Counters ({assignedVolunteers.length}/8)
              </h3>
              
              {assignedVolunteers.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {assignedVolunteers.map(volunteer => {
                    const role = volunteer.roles.find(r => 
                      r.type === 'money_counter' && 
                      r.day === session.day && 
                      r.time === session.time
                    );
                    return (
                      <VolunteerCard 
                        key={volunteer.id}
                        volunteer={volunteer}
                        role={role}
                        roleIcon={DollarSign}
                        roleColor="purple"
                      />
                    );
                  })}
                </div>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No money counters assigned</p>
                  <p className="text-sm mt-1">Need {session.requiredCount} volunteers total</p>
                </div>
              )}

              {/* Open Slots */}
              {assignedVolunteers.length < session.requiredCount && (
                <div className="mt-4 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium text-gray-700">Open Volunteer Slots</span>
                    <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full text-xs font-medium">
                      {session.requiredCount - assignedVolunteers.length} available
                    </span>
                  </div>
                  <div className="grid grid-cols-4 gap-2 mt-3">
                    {Array.from({ length: session.requiredCount - assignedVolunteers.length }, (_, i) => (
                      <div key={i} className="p-3 border-2 border-dashed border-gray-300 rounded-lg text-center">
                        <Plus className="w-6 h-6 text-gray-400 mx-auto mb-1" />
                        <div className="text-xs text-gray-500">Open Slot</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

// Volunteer Card Component
interface VolunteerCardProps {
  volunteer: Volunteer;
  role: any;
  roleIcon: React.ComponentType<any>;
  roleColor: string;
}

function VolunteerCard({ volunteer, role, roleIcon: RoleIcon, roleColor }: VolunteerCardProps) {
  const getColorClasses = (color: string) => {
    switch (color) {
      case 'blue': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'green': return 'bg-green-50 border-green-200 text-green-900';
      case 'purple': return 'bg-purple-50 border-purple-200 text-purple-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getIconColor = (color: string) => {
    switch (color) {
      case 'blue': return 'text-blue-600';
      case 'green': return 'text-green-600';
      case 'purple': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <div className={`p-4 rounded-lg border ${getColorClasses(roleColor)}`}>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {volunteer.firstName[0]}{volunteer.lastName[0]}
            </span>
          </div>
          <div>
            <div className="font-semibold text-gray-900">
              {volunteer.firstName} {volunteer.lastName}
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                volunteer.gender === 'male' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-pink-100 text-pink-800'
              }`}>
                {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
              </span>
              {role?.status && (
                <span className={`px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                  role.status === 'active' ? 'bg-green-100 text-green-800' :
                  role.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                  role.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {role.status.replace('_', ' ')}
                </span>
              )}
            </div>
          </div>
        </div>
        <RoleIcon className={`w-5 h-5 ${getIconColor(roleColor)}`} />
      </div>
      
      <div className="space-y-1 text-sm text-gray-600">
        {role?.location && (
          <div className="flex items-center">
            <MapPin className="w-3 h-3 mr-1" />
            {role.location}
          </div>
        )}
        {role?.boxNumber && (
          <div className="flex items-center">
            <Package className="w-3 h-3 mr-1" />
            Box #{role.boxNumber}
          </div>
        )}
        {volunteer.contactInfo && (
          <div className="flex items-center">
            <Phone className="w-3 h-3 mr-1" />
            {volunteer.contactInfo}
          </div>
        )}
      </div>
    </div>
  );
}