import React from 'react';
import { Clock, Users, Menu } from 'lucide-react';

interface HeaderProps {
  currentTime: string;
  activeShift: number | null;
  totalVolunteers: number;
}

export function Header({ currentTime, activeShift, totalVolunteers }: HeaderProps) {
  const getSessionInfo = () => {
    const conventionDates = 'July 11-13, 2025';
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    // For demo purposes, we'll show the day based on current day
    if (dayOfWeek === 5) return `Friday - ${conventionDates}`;
    if (dayOfWeek === 6) return `Saturday - ${conventionDates}`;
    if (dayOfWeek === 0) return `Sunday - ${conventionDates}`;
    return `Convention - ${conventionDates}`;
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center py-3 sm:py-4">
          <div className="flex items-center space-x-3 sm:space-x-4 min-w-0 flex-1">
            <div className="w-6 h-6 sm:w-8 sm:h-8 bg-teal-500 rounded-lg flex items-center justify-center flex-shrink-0">
              <Users className="w-3 h-3 sm:w-5 sm:h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-xl font-semibold text-gray-900 truncate">
                Convention Accounts
              </h1>
              <div className="text-xs sm:text-sm text-gray-500 truncate">
                {getSessionInfo()}
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-3 sm:space-x-6 flex-shrink-0">
            <div className="hidden sm:flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{currentTime}</span>
            </div>
            
            {activeShift && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-xs sm:text-sm font-medium text-green-700">
                  Shift {activeShift}
                </span>
              </div>
            )}
            
            <div className="text-xs sm:text-sm text-gray-600">
              <span className="font-medium">{totalVolunteers}</span>
              <span className="hidden sm:inline"> volunteers</span>
            </div>
          </div>
        </div>
        
        {/* Mobile time display */}
        <div className="sm:hidden pb-3 border-t border-gray-100 pt-2">
          <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
            <Clock className="w-4 h-4" />
            <span className="font-mono">{currentTime}</span>
          </div>
        </div>
      </div>
    </header>
  );
}