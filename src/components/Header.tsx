import React from 'react';
import { Clock, Users } from 'lucide-react';

interface HeaderProps {
  currentTime: string;
  activeShift: number | null;
  totalVolunteers: number;
}

export function Header({ currentTime, activeShift, totalVolunteers }: HeaderProps) {
  const getSessionInfo = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    
    if (dayOfWeek === 5) return 'Friday';
    if (dayOfWeek === 6) return 'Saturday';
    if (dayOfWeek === 0) return 'Sunday';
    return 'Convention';
  };

  return (
    <header className="bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
              <Users className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                Convention Accounts
              </h1>
              <div className="text-sm text-gray-500">
                {getSessionInfo()} Sessions
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <Clock className="w-4 h-4" />
              <span className="font-mono">{currentTime}</span>
            </div>
            
            {activeShift && (
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                <span className="text-sm font-medium text-green-700">
                  Shift {activeShift}
                </span>
              </div>
            )}
            
            <div className="text-sm text-gray-600">
              <span className="font-medium">{totalVolunteers}</span> volunteers
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}