import React from 'react';
import { Calendar, Clock, Users } from 'lucide-react';

interface HeaderProps {
  currentTime: string;
  activeShift: number | null;
  totalVolunteers: number;
}

export function Header({ currentTime, activeShift, totalVolunteers }: HeaderProps) {
  const getSessionInfo = () => {
    const today = new Date();
    const dayOfWeek = today.getDay(); // 0 = Sunday, 5 = Friday, 6 = Saturday
    
    if (dayOfWeek === 5) return 'Friday Sessions';
    if (dayOfWeek === 6) return 'Saturday Sessions';
    if (dayOfWeek === 0) return 'Sunday Sessions';
    return 'Convention Sessions';
  };

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-2xl font-bold text-gray-900">
                Convention Accounts Department
              </h1>
            </div>
            <div className="hidden md:flex items-center space-x-2 text-sm text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{getSessionInfo()}</span>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm">
              <Clock className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">{currentTime}</span>
            </div>
            
            {activeShift && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-sm font-medium text-green-700">
                  Shift {activeShift} Active
                </span>
              </div>
            )}
            
            <div className="flex items-center space-x-2 text-sm">
              <Users className="w-4 h-4 text-gray-500" />
              <span className="font-medium text-gray-900">{totalVolunteers} Volunteers</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}