import React, { useState } from 'react';
import { Volunteer, Shift, MoneyCountingSession } from '../types';
import { 
  Calendar, 
  Users, 
  Key, 
  DollarSign, 
  ChevronDown, 
  ChevronRight,
  Clock,
  MapPin,
  User,
  Package
} from 'lucide-react';

interface WeeklyScheduleViewProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onVolunteersUpdate: (volunteers: Volunteer[]) => void;
  isOnline: boolean;
  lastSynced: Date | null;
}

export function WeeklyScheduleView({ 
  volunteers, 
  shifts, 
  onVolunteersUpdate,
  isOnline,
  lastSynced 
}: WeeklyScheduleViewProps) {
  const [expandedDays, setExpandedDays] = useState<Record<string, boolean>>({});
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({});

  // Money counting sessions with updated minimum of 2 brothers
  const moneyCountingSessions: MoneyCountingSession[] = [
    {
      id: 'friday-lunch',
      day: 'Friday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'friday-afternoon',
      day: 'Friday', 
      time: 'after_afternoon',
      timeLabel: 'After Afternoon Session',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'saturday-lunch',
      day: 'Saturday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'saturday-afternoon',
      day: 'Saturday',
      time: 'after_afternoon', 
      timeLabel: 'After Afternoon Session',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'sunday-lunch',
      day: 'Sunday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'sunday-afternoon',
      day: 'Sunday',
      time: 'after_afternoon',
      timeLabel: 'After Afternoon Session', 
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
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

  // Get key personnel for a day (shift leaders = keymen)
  const getDayKeyPersonnel = (day: string) => {
    const dayShifts = shifts.filter(s => s.day === day);
    const keymen = volunteers.filter(v => 
      v.roles.some(role => 
        role.type === 'keyman' && 
        dayShifts.some(shift => shift.id === role.shift)
      )
    );
    return keymen.slice(0, 3); // Show top 3 key personnel
  };

  // Get money counter team for a day
  const getDayMoneyCounters = (day: string) => {
    const daySessions = moneyCountingSessions.filter(s => s.day === day);
    const moneyCounters = volunteers.filter(v => 
      v.roles.some(role => 
        role.type === 'money_counter' && 
        role.day === day
      )
    );
    return moneyCounters.slice(0, 4); // Show top 4 money counters
  };

  // Get all volunteers for a specific shift
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

  const toggleDayExpansion = (day: string) => {
    setExpandedDays(prev => ({
      ...prev,
      [day]: !prev[day]
    }));
  };

  const toggleSectionExpansion = (sectionId: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [sectionId]: !prev[sectionId]
    }));
  };

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'Saturday': return 'bg-green-50 border-green-200 text-green-900';
      case 'Sunday': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getDayAccentColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'border-l-blue-500';
      case 'Saturday': return 'border-l-green-500';
      case 'Sunday': return 'border-l-orange-500';
      default: return 'border-l-gray-500';
    }
  };

  const days = ['Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Calendar className="w-6 h-6 mr-3 text-teal-600" />
              Weekly Schedule Overview
            </h1>
            <p className="text-gray-600 mt-1">July 11-13, 2025 Convention • Key Personnel & Teams</p>
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
      </div>

      {/* Weekly Schedule */}
      <div className="space-y-4">
        {days.map(day => {
          const keyPersonnel = getDayKeyPersonnel(day);
          const moneyCounters = getDayMoneyCounters(day);
          const dayShifts = shifts.filter(s => s.day === day).sort((a, b) => a.id - b.id);
          const daySessions = moneyCountingSessions.filter(s => s.day === day);
          const isExpanded = expandedDays[day];

          return (
            <div key={day} className={`bg-white rounded-xl shadow-lg border-l-4 ${getDayAccentColor(day)} border border-gray-200 overflow-hidden`}>
              {/* Day Header */}
              <div className={`p-6 ${getDayColor(day)}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold">{day}</h2>
                    <p className="text-sm opacity-75 mt-1">
                      {day === 'Friday' ? 'July 11, 2025' : 
                       day === 'Saturday' ? 'July 12, 2025' : 
                       'July 13, 2025'}
                    </p>
                  </div>
                  <button
                    onClick={() => toggleDayExpansion(day)}
                    className="flex items-center space-x-2 px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
                  >
                    <span className="text-sm font-medium">
                      {isExpanded ? 'Hide Details' : 'View Details'}
                    </span>
                    {isExpanded ? (
                      <ChevronDown className="w-4 h-4" />
                    ) : (
                      <ChevronRight className="w-4 h-4" />
                    )}
                  </button>
                </div>
              </div>

              {/* Key Personnel Summary */}
              <div className="p-6 border-b border-gray-200">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Shift Leaders */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <Key className="w-5 h-5 mr-2 text-green-600" />
                      Shift Leaders
                    </h3>
                    {keyPersonnel.length > 0 ? (
                      <div className="space-y-2">
                        {keyPersonnel.map(volunteer => (
                          <div key={volunteer.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {volunteer.firstName[0]}{volunteer.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {volunteer.firstName} {volunteer.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {volunteer.gender === 'male' ? 'Brother' : 'Sister'} • Keyman
                              </div>
                            </div>
                          </div>
                        ))}
                        {keyPersonnel.length < getDayKeyPersonnel(day).length && (
                          <button
                            onClick={() => toggleDayExpansion(day)}
                            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                          >
                            +{volunteers.filter(v => v.roles.some(r => r.type === 'keyman' && shifts.some(s => s.day === day && s.id === r.shift))).length - keyPersonnel.length} more
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <Key className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No shift leaders assigned</p>
                      </div>
                    )}
                  </div>

                  {/* Money Counter Team */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 flex items-center">
                      <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                      Money Counter Team
                    </h3>
                    {moneyCounters.length > 0 ? (
                      <div className="space-y-2">
                        {moneyCounters.map(volunteer => (
                          <div key={volunteer.id} className="flex items-center space-x-3 p-2 bg-gray-50 rounded-lg">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {volunteer.firstName[0]}{volunteer.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="font-medium text-gray-900 text-sm">
                                {volunteer.firstName} {volunteer.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {volunteer.gender === 'male' ? 'Brother' : 'Sister'} • Money Counter
                              </div>
                            </div>
                          </div>
                        ))}
                        {moneyCounters.length < getDayMoneyCounters(day).length && (
                          <button
                            onClick={() => toggleDayExpansion(day)}
                            className="text-sm text-teal-600 hover:text-teal-700 font-medium"
                          >
                            +{volunteers.filter(v => v.roles.some(r => r.type === 'money_counter' && r.day === day)).length - moneyCounters.length} more
                          </button>
                        )}
                      </div>
                    ) : (
                      <div className="text-center py-4 text-gray-500">
                        <DollarSign className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                        <p className="text-sm">No money counters assigned</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && (
                <div className="p-6 bg-gray-50">
                  <div className="space-y-6">
                    {/* Detailed Shift Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Users className="w-5 h-5 mr-2 text-blue-600" />
                        Shift Details
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {dayShifts.map(shift => {
                          const boxWatchers = getShiftVolunteers(shift.id, 'box_watcher');
                          const keymen = getShiftVolunteers(shift.id, 'keyman');
                          const shiftNumInDay = getShiftNumberInDay(shift.id);
                          const sectionId = `${day}-shift-${shift.id}`;
                          const isSectionExpanded = expandedSections[sectionId];

                          return (
                            <div key={shift.id} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h5 className="font-semibold text-gray-900">
                                    Shift {shiftNumInDay}
                                  </h5>
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <Clock className="w-3 h-3 mr-1" />
                                    {shift.startTime} - {shift.endTime}
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleSectionExpansion(sectionId)}
                                  className="text-teal-600 hover:text-teal-700"
                                >
                                  {isSectionExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="text-center p-2 bg-blue-50 rounded">
                                  <div className="text-lg font-bold text-blue-600">{boxWatchers.length}/10</div>
                                  <div className="text-xs text-blue-700">Box Watchers</div>
                                </div>
                                <div className="text-center p-2 bg-green-50 rounded">
                                  <div className="text-lg font-bold text-green-600">{keymen.length}/3</div>
                                  <div className="text-xs text-green-700">Keymen</div>
                                </div>
                              </div>

                              {isSectionExpanded && (
                                <div className="space-y-3 pt-3 border-t border-gray-200">
                                  <div>
                                    <h6 className="text-sm font-medium text-gray-700 mb-2">Box Watchers</h6>
                                    {boxWatchers.length > 0 ? (
                                      <div className="space-y-1">
                                        {boxWatchers.map(volunteer => {
                                          const role = volunteer.roles.find(r => r.type === 'box_watcher' && r.shift === shift.id);
                                          return (
                                            <div key={volunteer.id} className="flex items-center justify-between text-sm p-2 bg-blue-50 rounded">
                                              <span>{volunteer.firstName} {volunteer.lastName}</span>
                                              {role?.boxNumber && (
                                                <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded">
                                                  Box #{role.boxNumber}
                                                </span>
                                              )}
                                            </div>
                                          );
                                        })}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 italic">No box watchers assigned</p>
                                    )}
                                  </div>

                                  <div>
                                    <h6 className="text-sm font-medium text-gray-700 mb-2">Keymen</h6>
                                    {keymen.length > 0 ? (
                                      <div className="space-y-1">
                                        {keymen.map(volunteer => (
                                          <div key={volunteer.id} className="flex items-center justify-between text-sm p-2 bg-green-50 rounded">
                                            <span>{volunteer.firstName} {volunteer.lastName}</span>
                                            <span className="text-xs bg-green-200 text-green-800 px-2 py-1 rounded">
                                              Keyman
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 italic">No keymen assigned</p>
                                    )}
                                  </div>
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>

                    {/* Detailed Money Counting Information */}
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
                        Money Counting Sessions
                      </h4>
                      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                        {daySessions.map(session => {
                          const assignedVolunteers = getSessionVolunteers(session);
                          const brothers = assignedVolunteers.filter(v => v.gender === 'male');
                          const sectionId = `${day}-money-${session.id}`;
                          const isSectionExpanded = expandedSections[sectionId];

                          return (
                            <div key={session.id} className="bg-white rounded-lg border border-gray-200 p-4">
                              <div className="flex items-center justify-between mb-3">
                                <div>
                                  <h5 className="font-semibold text-gray-900">
                                    {session.timeLabel}
                                  </h5>
                                  <div className="text-sm text-gray-600 flex items-center">
                                    <MapPin className="w-3 h-3 mr-1" />
                                    Counting Table Area
                                  </div>
                                </div>
                                <button
                                  onClick={() => toggleSectionExpansion(sectionId)}
                                  className="text-teal-600 hover:text-teal-700"
                                >
                                  {isSectionExpanded ? (
                                    <ChevronDown className="w-4 h-4" />
                                  ) : (
                                    <ChevronRight className="w-4 h-4" />
                                  )}
                                </button>
                              </div>

                              <div className="grid grid-cols-2 gap-4 mb-3">
                                <div className="text-center p-2 bg-purple-50 rounded">
                                  <div className="text-lg font-bold text-purple-600">{assignedVolunteers.length}/8</div>
                                  <div className="text-xs text-purple-700">Total Assigned</div>
                                </div>
                                <div className="text-center p-2 bg-blue-50 rounded">
                                  <div className="text-lg font-bold text-blue-600">{brothers.length}/2</div>
                                  <div className="text-xs text-blue-700">Brothers (Min)</div>
                                </div>
                              </div>

                              {isSectionExpanded && (
                                <div className="space-y-3 pt-3 border-t border-gray-200">
                                  <div>
                                    <h6 className="text-sm font-medium text-gray-700 mb-2">Assigned Volunteers</h6>
                                    {assignedVolunteers.length > 0 ? (
                                      <div className="space-y-1">
                                        {assignedVolunteers.map(volunteer => (
                                          <div key={volunteer.id} className="flex items-center justify-between text-sm p-2 bg-purple-50 rounded">
                                            <span>{volunteer.firstName} {volunteer.lastName}</span>
                                            <span className={`text-xs px-2 py-1 rounded ${
                                              volunteer.gender === 'male' 
                                                ? 'bg-blue-200 text-blue-800' 
                                                : 'bg-pink-200 text-pink-800'
                                            }`}>
                                              {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                                            </span>
                                          </div>
                                        ))}
                                      </div>
                                    ) : (
                                      <p className="text-sm text-gray-500 italic">No volunteers assigned</p>
                                    )}
                                  </div>

                                  {assignedVolunteers.length < session.requiredCount && (
                                    <div className="p-3 bg-yellow-50 border border-yellow-200 rounded">
                                      <div className="text-sm text-yellow-800">
                                        <strong>Open Slots:</strong> {session.requiredCount - assignedVolunteers.length} volunteers needed
                                      </div>
                                      {brothers.length < session.minimumBrothers && (
                                        <div className="text-sm text-red-700 mt-1">
                                          <strong>Critical:</strong> {session.minimumBrothers - brothers.length} more brothers required
                                        </div>
                                      )}
                                    </div>
                                  )}
                                </div>
                              )}
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}