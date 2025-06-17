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
  CheckCircle,
  Eye,
  X,
  Filter
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
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState<string>('All');
  const [showSearchResults, setShowSearchResults] = useState(false);

  // Helper function to get shift number within day (1-4)
  const getShiftNumberInDay = (shiftId: number) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return shiftId;
    
    const dayShifts = shifts.filter(s => s.day === shift.day);
    const sortedDayShifts = dayShifts.sort((a, b) => a.id - b.id);
    const index = sortedDayShifts.findIndex(s => s.id === shiftId);
    return index + 1;
  };

  // Get volunteers assigned to a specific shift and role, sorted by box number
  const getShiftVolunteers = (shiftId: number, roleType: 'box_watcher' | 'keyman') => {
    const shiftVolunteers = volunteers.filter(v => 
      v.roles.some(role => 
        role.type === roleType && 
        role.shift === shiftId
      )
    );

    // Sort box watchers by box number, keymen alphabetically
    if (roleType === 'box_watcher') {
      return shiftVolunteers.sort((a, b) => {
        const aRole = a.roles.find(r => r.type === 'box_watcher' && r.shift === shiftId);
        const bRole = b.roles.find(r => r.type === 'box_watcher' && r.shift === shiftId);
        const aBoxNum = aRole?.boxNumber || 999;
        const bBoxNum = bRole?.boxNumber || 999;
        return aBoxNum - bBoxNum;
      });
    } else {
      return shiftVolunteers.sort((a, b) => a.lastName.localeCompare(b.lastName));
    }
  };

  // Get money counter volunteers for a specific day and session
  const getMoneyCounters = (day: string, time: 'lunch' | 'after_afternoon') => {
    return volunteers.filter(v => 
      v.roles.some(role => 
        role.type === 'money_counter' && 
        role.day === day && 
        role.time === time
      )
    ).sort((a, b) => a.lastName.localeCompare(b.lastName));
  };

  // Search volunteers across all days
  const searchResults = useMemo(() => {
    if (!searchTerm.trim()) return [];
    
    const searchLower = searchTerm.toLowerCase();
    return volunteers.filter(volunteer => {
      const fullName = `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase();
      const firstName = volunteer.firstName.toLowerCase();
      const lastName = volunteer.lastName.toLowerCase();
      
      return fullName.includes(searchLower) || 
             firstName.includes(searchLower) || 
             lastName.includes(searchLower);
    }).slice(0, 8); // Limit to 8 results for clean display
  }, [volunteers, searchTerm]);

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

  // Get all volunteers for the selected day with filtering
  const allDayVolunteers = useMemo(() => {
    let dayVolunteers = volunteers.filter(v => 
      v.roles.some(role => role.day === selectedDate)
    );

    // Apply search filter
    if (searchTerm.trim()) {
      const searchLower = searchTerm.toLowerCase();
      dayVolunteers = dayVolunteers.filter(v => 
        `${v.firstName} ${v.lastName}`.toLowerCase().includes(searchLower)
      );
    }

    // Apply role filter
    if (filterRole !== 'All') {
      dayVolunteers = dayVolunteers.filter(v => 
        v.roles.some(role => role.type === filterRole && role.day === selectedDate)
      );
    }

    return dayVolunteers.sort((a, b) => a.lastName.localeCompare(b.lastName));
  }, [volunteers, selectedDate, searchTerm, filterRole]);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setShowSearchResults(value.trim().length > 0);
  };

  const handleSearchSelect = (volunteer: Volunteer) => {
    onVolunteerSelect(volunteer);
    setSearchTerm('');
    setShowSearchResults(false);
  };

  const clearSearch = () => {
    setSearchTerm('');
    setShowSearchResults(false);
  };

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
      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-teal-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-xl">
              <Calendar className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold text-gray-900 mb-3">Daily Schedule Overview</h1>
          <p className="text-lg text-gray-600 mb-6">Convention Accounts Department • July 11-13, 2025</p>
          
          {/* Volunteer Search - FIXED Z-INDEX */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8 relative">
            <div className="max-w-md mx-auto">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Find Your Assignment</h2>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-xl leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-teal-500 focus:border-teal-500 text-base"
                  placeholder="Search by your name..."
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
              
              {/* Search Results Dropdown - FIXED WITH HIGH Z-INDEX */}
              {showSearchResults && searchResults.length > 0 && (
                <div className="absolute z-[9999] mt-2 w-full max-w-md left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl max-h-80 overflow-y-auto">
                  <div className="p-2">
                    <div className="text-xs text-gray-500 px-3 py-2 font-medium">
                      Found {searchResults.length} volunteer{searchResults.length !== 1 ? 's' : ''}
                    </div>
                    {searchResults.map(volunteer => {
                      const primaryRole = volunteer.roles[0];
                      return (
                        <button
                          key={volunteer.id}
                          onClick={() => handleSearchSelect(volunteer)}
                          className="w-full text-left p-3 hover:bg-teal-50 rounded-lg transition-colors group"
                        >
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-sm">
                                {volunteer.firstName[0]}{volunteer.lastName[0]}
                              </span>
                            </div>
                            <div className="flex-1 min-w-0">
                              <div className="font-semibold text-gray-900 group-hover:text-teal-700 truncate">
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
                                {primaryRole && (
                                  <span className="text-xs text-gray-500">
                                    {primaryRole.type.replace('_', ' ')} • {primaryRole.day}
                                  </span>
                                )}
                              </div>
                            </div>
                            <ChevronRight className="w-4 h-4 text-gray-400 group-hover:text-teal-600" />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
              
              {/* No Results - FIXED WITH HIGH Z-INDEX */}
              {showSearchResults && searchResults.length === 0 && searchTerm.trim() && (
                <div className="absolute z-[9999] mt-2 w-full max-w-md left-1/2 transform -translate-x-1/2 bg-white border border-gray-200 rounded-xl shadow-2xl p-4">
                  <div className="text-center text-gray-500">
                    <Search className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No volunteers found matching "{searchTerm}"</p>
                    <p className="text-xs mt-1">Try checking the spelling or use a different name</p>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* Date Picker */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-white/20 p-6 mb-8">
            <p className="text-gray-700 font-medium mb-4">Please select a date to view assignments:</p>
            <div className="flex flex-col sm:flex-row justify-center gap-3">
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
                  <div key={shift.id} className="bg-gradient-to-r from-gray-50 to-white rounded-xl p-6 border border-gray-200 shadow-sm">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                      <div>
                        <h4 className="text-lg font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-2">
                          Shift {shiftNumInDay}
                          <span className="text-sm text-gray-600 bg-gray-100 px-3 py-1 rounded-full">
                            {shift.startTime} - {shift.endTime}
                          </span>
                        </h4>
                      </div>
                      <div className="flex items-center space-x-2">
                        {isComplete ? (
                          <div className="flex items-center text-green-600 bg-green-50 px-3 py-1 rounded-full">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Complete</span>
                          </div>
                        ) : (
                          <div className="flex items-center text-yellow-600 bg-yellow-50 px-3 py-1 rounded-full">
                            <AlertTriangle className="w-4 h-4 mr-1" />
                            <span className="text-sm font-medium">Incomplete</span>
                          </div>
                        )}
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Box Watchers */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-semibold text-gray-900 flex items-center">
                            <Package className="w-5 h-5 mr-2 text-blue-600" />
                            Box Watchers
                          </h5>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            boxWatchers.length === 10 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {boxWatchers.length}/10
                          </span>
                        </div>
                        
                        {boxWatchers.length > 0 ? (
                          <div className="grid grid-cols-1 gap-2">
                            {boxWatchers.map(volunteer => {
                              const role = volunteer.roles.find(r => r.type === 'box_watcher' && r.shift === shift.id);
                              return (
                                <button
                                  key={volunteer.id}
                                  onClick={() => onVolunteerSelect(volunteer)}
                                  className="text-left p-3 bg-blue-50 border border-blue-200 rounded-lg hover:bg-blue-100 hover:border-blue-300 transition-all group shadow-sm"
                                >
                                  <div className="flex items-center justify-between">
                                    <div className="flex items-center space-x-3 min-w-0 flex-1">
                                      <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center flex-shrink-0">
                                        <span className="text-white font-bold text-xs">
                                          {volunteer.firstName[0]}{volunteer.lastName[0]}
                                        </span>
                                      </div>
                                      <div className="min-w-0 flex-1">
                                        <div className="font-medium text-gray-900 group-hover:text-blue-700 text-sm truncate">
                                          {volunteer.firstName} {volunteer.lastName}
                                        </div>
                                        <div className="text-xs text-gray-500">
                                          {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                                        </div>
                                      </div>
                                    </div>
                                    {role?.boxNumber && (
                                      <span className="text-xs bg-blue-200 text-blue-800 px-2 py-1 rounded font-medium flex-shrink-0 ml-2">
                                        Box #{role.boxNumber}
                                      </span>
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-lg">
                            <Package className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <div className="text-sm text-gray-500 italic">No box watchers assigned</div>
                          </div>
                        )}
                      </div>

                      {/* Keymen */}
                      <div>
                        <div className="flex items-center justify-between mb-4">
                          <h5 className="font-semibold text-gray-900 flex items-center">
                            <Key className="w-5 h-5 mr-2 text-green-600" />
                            Keymen
                          </h5>
                          <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                            keymen.length === 3 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {keymen.length}/3
                          </span>
                        </div>
                        
                        {keymen.length > 0 ? (
                          <div className="space-y-2">
                            {keymen.map(volunteer => (
                              <button
                                key={volunteer.id}
                                onClick={() => onVolunteerSelect(volunteer)}
                                className="w-full text-left p-3 bg-green-50 border border-green-200 rounded-lg hover:bg-green-100 hover:border-green-300 transition-all group shadow-sm"
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="w-8 h-8 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center flex-shrink-0">
                                    <span className="text-white font-bold text-xs">
                                      {volunteer.firstName[0]}{volunteer.lastName[0]}
                                    </span>
                                  </div>
                                  <div className="min-w-0 flex-1">
                                    <div className="font-medium text-gray-900 group-hover:text-green-700 text-sm truncate">
                                      {volunteer.firstName} {volunteer.lastName}
                                    </div>
                                    <div className="text-xs text-gray-500">
                                      {volunteer.gender === 'male' ? 'Brother' : 'Sister'} • Keyman
                                    </div>
                                  </div>
                                </div>
                              </button>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-6 bg-gray-50 border border-gray-200 rounded-lg">
                            <Key className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                            <div className="text-sm text-gray-500 italic">No keymen assigned</div>
                          </div>
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
                <div key={session.id} className="bg-gradient-to-r from-purple-50 to-white rounded-xl p-6 border border-purple-200 shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
                    <div>
                      <h4 className="text-lg font-bold text-gray-900 flex flex-col sm:flex-row sm:items-center gap-2">
                        {session.timeLabel}
                        <span className="text-sm text-gray-600 bg-purple-100 px-3 py-1 rounded-full">
                          {session.displayTime}
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
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
                      {session.volunteers.map(volunteer => (
                        <button
                          key={volunteer.id}
                          onClick={() => onVolunteerSelect(volunteer)}
                          className="text-left p-3 bg-white border border-purple-200 rounded-lg hover:bg-purple-50 hover:border-purple-300 transition-all group shadow-sm"
                        >
                          <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center flex-shrink-0">
                              <span className="text-white font-bold text-xs">
                                {volunteer.firstName[0]}{volunteer.lastName[0]}
                              </span>
                            </div>
                            <div className="min-w-0 flex-1">
                              <div className="text-sm font-medium text-gray-900 group-hover:text-purple-700 truncate">
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
                    <div className="text-center py-8 bg-gray-50 border border-gray-200 rounded-lg">
                      <DollarSign className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm text-gray-500">No money counters assigned</p>
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
                <Eye className="w-5 h-5" />
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
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-semibold text-gray-900">
                  Complete Volunteer List - {selectedDate} ({allDayVolunteers.length} volunteers)
                </h3>
                <button
                  onClick={() => setShowAllVolunteers(false)}
                  className="p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Search and Filter Controls */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search volunteers by name..."
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                <div className="relative">
                  <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <select
                    value={filterRole}
                    onChange={(e) => setFilterRole(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  >
                    <option value="All">All Roles</option>
                    <option value="box_watcher">Box Watchers</option>
                    <option value="keyman">Keymen</option>
                    <option value="money_counter">Money Counters</option>
                  </select>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {allDayVolunteers.map(volunteer => {
                  const dayRoles = volunteer.roles.filter(r => r.day === selectedDate);
                  const primaryRole = dayRoles[0];
                  
                  return (
                    <button
                      key={volunteer.id}
                      onClick={() => onVolunteerSelect(volunteer)}
                      className="text-left p-4 bg-white border border-gray-200 rounded-xl hover:border-teal-300 hover:bg-teal-50 transition-all group shadow-sm hover:shadow-md"
                    >
                      <div className="flex items-center space-x-3 mb-3">
                        <div className="w-12 h-12 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center shadow-md flex-shrink-0">
                          <span className="text-white font-bold text-sm">
                            {volunteer.firstName[0]}{volunteer.lastName[0]}
                          </span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-gray-900 group-hover:text-teal-700 truncate">
                            {volunteer.firstName} {volunteer.lastName}
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                              volunteer.gender === 'male' 
                                ? 'bg-blue-100 text-blue-800' 
                                : 'bg-pink-100 text-pink-800'
                            }`}>
                              {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                            </span>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        {dayRoles.slice(0, 2).map((role, index) => (
                          <div key={index} className="flex items-center justify-between text-xs">
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
                                {role.shift ? `Shift ${getShiftNumberInDay(role.shift)}` : role.timeLabel}
                              </span>
                            )}
                          </div>
                        ))}
                        {dayRoles.length > 2 && (
                          <div className="text-xs text-gray-500 font-medium">
                            +{dayRoles.length - 2} more assignment{dayRoles.length - 2 !== 1 ? 's' : ''}
                          </div>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>

              {allDayVolunteers.length === 0 && (
                <div className="text-center py-12">
                  <Users className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No volunteers found</h3>
                  <p className="text-gray-600">
                    {searchTerm || filterRole !== 'All' 
                      ? 'Try adjusting your search or filter criteria.'
                      : `No volunteers assigned for ${selectedDate}.`
                    }
                  </p>
                </div>
              )}
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