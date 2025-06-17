import React, { useState, useMemo } from 'react';
import { Volunteer, Shift } from '../types';
import { 
  Calendar, 
  Clock, 
  Package, 
  Key, 
  DollarSign, 
  Users, 
  Search, 
  User,
  MapPin,
  ChevronRight,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';

interface DailyScheduleSummaryProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onVolunteerSelect: (volunteer: Volunteer) => void;
  onSearchVolunteers: () => void;
}

export function DailyScheduleSummary({ 
  volunteers, 
  shifts, 
  onVolunteerSelect,
  onSearchVolunteers
}: DailyScheduleSummaryProps) {
  const [selectedDate, setSelectedDate] = useState<string>('Friday');
  const [showAllVolunteers, setShowAllVolunteers] = useState(false);

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

  // Get money counter volunteers for a specific day and session
  const getMoneyCounters = (day: string, time: 'lunch' | 'after_afternoon') => {
    return volunteers.filter(v => 
      v.roles.some(role => 
        role.type === 'money_counter' && 
        role.day === day && 
        role.time === time
      )
    );
  };

  // Get shifts for selected date
  const selectedDayShifts = useMemo(() => {
    return shifts.filter(s => s.day === selectedDate).sort((a, b) => a.id - b.id);
  }, [shifts, selectedDate]);

  // Get money counting sessions for selected date
  const moneyCountingSessions = useMemo(() => {
    return [
      {
        id: `${selectedDate.toLowerCase()}-lunch`,
        time: 'lunch' as const,
        timeLabel: 'Noon Session',
        displayTime: '12:00 PM - 1:00 PM',
        volunteers: getMoneyCounters(selectedDate, 'lunch')
      },
      {
        id: `${selectedDate.toLowerCase()}-afternoon`,
        time: 'after_afternoon' as const,
        timeLabel: 'Afternoon Session',
        displayTime: '4:00 PM - 5:00 PM',
        volunteers: getMoneyCounters(selectedDate, 'after_afternoon')
      }
    ];
  }, [selectedDate, volunteers]);

  // Get all volunteers for the selected day
  const allDayVolunteers = useMemo(() => {
    return volunteers.filter(v => 
      v.roles.some(role => role.day === selectedDate)
    );
  }, [volunteers, selectedDate]);

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-500 text-white';
      case 'Saturday': return 'bg-green-500 text-white';
      case 'Sunday': return 'bg-orange-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  const getDateString = (day: string) => {
    switch (day) {
      case 'Friday': return 'July 11, 2025';
      case 'Saturday': return 'July 12, 2025';
      case 'Sunday': return 'July 13, 2025';
      default: return '';
    }
  };

  const days = ['Friday', 'Saturday', 'Sunday'];

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Daily Schedule Overview</h1>
          <p className="text-lg text-gray-600 mb-6">Convention Accounts Department • July 11-13, 2025</p>
          
          {/* Date Picker */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <p className="text-gray-700 font-medium mb-4">Please select a date to view assignments:</p>
            <div className="flex justify-center space-x-3">
              {days.map(day => (
                <button
                  key={day}
                  onClick={() => setSelectedDate(day)}
                  className={`px-6 py-3 rounded-xl font-semibold transition-all duration-200 transform hover:scale-105 ${
                    selectedDate === day
                      ? getDayColor(day) + ' shadow-lg'
                      : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300 shadow-sm'
                  }`}
                >
                  <div className="text-center">
                    <div className="font-bold">{day}</div>
                    <div className="text-xs opacity-75">{getDateString(day)}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Schedule Summary */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 sm:p-8 mb-8">
          <div className="border-b border-gray-200 pb-4 mb-8">
            <h2 className="text-2xl font-bold text-gray-900 flex items-center">
              <span className={`w-4 h-4 rounded-full mr-3 ${getDayColor(selectedDate).replace('text-white', '')}`}></span>
              Schedule Summary - {selectedDate}
            </h2>
            <p className="text-gray-600 mt-1">{getDateString(selectedDate)}</p>
          </div>

          {/* Shifts */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              📋 <span className="ml-2">Shifts</span>
            </h3>
            
            <div className="space-y-6">
              {selectedDayShifts.map(shift => {
                const boxWatchers = getShiftVolunteers(shift.id, 'box_watcher');
                const keymen = getShiftVolunteers(shift.id, 'keyman');
                const shiftNumInDay = getShiftNumberInDay(shift.id);
                const isComplete = boxWatchers.length === 10 && keymen.length === 3;

                return (
                  <div key={shift.id} className="bg-gray-50 rounded-xl p-6 border border-gray-200">
                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                          Shift {shiftNumInDay}
                          <span className="ml-3 text-sm text-gray-600">
                            ({shift.startTime} - {shift.endTime})
                          </span>
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isComplete ? (
                          <div className="flex items-center text-green-600">
                            <CheckCircle className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">Complete</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600">
                            <AlertTriangle className="w-5 h-5 mr-1" />
                            <span className="text-sm font-medium">Incomplete</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Box Watchers */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900 flex items-center">
                            <Package className="w-4 h-4 mr-2 text-blue-600" />
                            Box Watchers
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            boxWatchers.length === 10 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {boxWatchers.length}/10
                          </span>
                        </div>
                        
                        {boxWatchers.length > 0 ? (
                          <div className="space-y-1">
                            {boxWatchers.slice(0, 5).map(volunteer => {
                              const role = volunteer.roles.find(r => r.type === 'box_watcher' && r.shift === shift.id);
                              return (
                                <button
                                  key={volunteer.id}
                                  onClick={() => onVolunteerSelect(volunteer)}
                                  className="w-full text-left p-2 hover:bg-blue-50 rounded-lg transition-colors group"
                                >
                                  <div className="flex items-center justify-between">
                                    <span className="text-sm text-gray-700 group-hover:text-blue-700">
                                      • {volunteer.firstName} {volunteer.lastName}
                                    </span>
                                    {role?.boxNumber && (
                                      <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                                        Box #{role.boxNumber}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                            {boxWatchers.length > 5 && (
                              <div className="text-sm text-gray-500 pl-2">
                                +{boxWatchers.length - 5} more volunteers
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic pl-2">No box watchers assigned</div>
                        )}
                      </div>

                      {/* Keymen */}
                      <div>
                        <div className="flex items-center justify-between mb-3">
                          <h5 className="font-medium text-gray-900 flex items-center">
                            <Key className="w-4 h-4 mr-2 text-green-600" />
                            Keymen
                          </h5>
                          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                            keymen.length === 3 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {keymen.length}/3
                          </span>
                        </div>
                        
                        {keymen.length > 0 ? (
                          <div className="space-y-1">
                            {keymen.map(volunteer => (
                              <button
                                key={volunteer.id}
                                onClick={() => onVolunteerSelect(volunteer)}
                                className="w-full text-left p-2 hover:bg-green-50 rounded-lg transition-colors group"
                              >
                                <span className="text-sm text-gray-700 group-hover:text-green-700">
                                  • {volunteer.firstName} {volunteer.lastName}
                                </span>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-sm text-gray-500 italic pl-2">No keymen assigned</div>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Money Counter Assignments */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6 flex items-center">
              💰 <span className="ml-2">Money Counter Assignments</span>
            </h3>
            
            <div className="space-y-6">
              {moneyCountingSessions.map(session => (
                <div key={session.id} className="bg-purple-50 rounded-xl p-6 border border-purple-200">
                  <div className="flex items-center justify-between mb-4">
                    <div>
                      <h4 className="text-lg font-semibold text-gray-900 flex items-center">
                        {session.timeLabel}
                        <span className="ml-3 text-sm text-gray-600">
                          ({session.displayTime})
                        </span>
                      </h4>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                      session.volunteers.length >= 4 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-yellow-100 text-yellow-800'
                    }`}>
                      {session.volunteers.length}/8 assigned
                    </span>
                  </div>

                  {session.volunteers.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                      {session.volunteers.slice(0, 8).map(volunteer => (
                        <button
                          key={volunteer.id}
                          onClick={() => onVolunteerSelect(volunteer)}
                          className="text-left p-3 bg-white rounded-lg border border-purple-200 hover:border-purple-300 hover:bg-purple-50 transition-colors group"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center">
                              <span className="text-white font-bold text-xs">
                                {volunteer.firstName[0]}{volunteer.lastName[0]}
                              </span>
                            </div>
                            <div>
                              <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700">
                                {volunteer.firstName} {volunteer.lastName}
                              </div>
                              <div className="text-xs text-gray-500">
                                {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                              </div>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No money counters assigned</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions:</h3>
            <div className="flex flex-col sm:flex-row gap-4">
              <button
                onClick={() => setShowAllVolunteers(!showAllVolunteers)}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Users className="w-5 h-5" />
                <span>View Complete Volunteer List</span>
                <ChevronRight className="w-4 h-4" />
              </button>
              
              <button
                onClick={onSearchVolunteers}
                className="flex items-center justify-center space-x-2 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
              >
                <Search className="w-5 h-5" />
                <span>Search Volunteer Names</span>
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Complete Volunteer List */}
          {showAllVolunteers && (
            <div className="mt-8 pt-6 border-t border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Complete Volunteer List - {selectedDate} ({allDayVolunteers.length} volunteers)
                </h3>
                <button
                  onClick={() => setShowAllVolunteers(false)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                {allDayVolunteers.map(volunteer => (
                  <button
                    key={volunteer.id}
                    onClick={() => onVolunteerSelect(volunteer)}
                    className="text-left p-3 bg-gray-50 rounded-lg border border-gray-200 hover:border-teal-300 hover:bg-teal-50 transition-all group"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-sm">
                          {volunteer.firstName[0]}{volunteer.lastName[0]}
                        </span>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-gray-900 group-hover:text-teal-700 truncate">
                          {volunteer.firstName} {volunteer.lastName}
                        </div>
                        <div className="text-xs text-gray-500">
                          {volunteer.roles.filter(r => r.day === selectedDate).length} assignment{volunteer.roles.filter(r => r.day === selectedDate).length !== 1 ? 's' : ''}
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Note */}
          <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center">
              <User className="w-4 h-4 mr-2" />
              <strong>Note:</strong> Click on any name to view detailed volunteer information
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}