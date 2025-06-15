import React from 'react';
import { Shift } from '../types';
import { Clock, CheckCircle, Circle, Calendar } from 'lucide-react';

interface ShiftTimelineProps {
  shifts: Shift[];
  activeShift: number | null;
  onShiftChange: (shiftId: number) => void;
}

export function ShiftTimeline({ shifts, activeShift, onShiftChange }: ShiftTimelineProps) {
  // Group shifts by day
  const shiftsByDay = shifts.reduce((acc, shift) => {
    if (!acc[shift.day]) {
      acc[shift.day] = [];
    }
    acc[shift.day].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-50 border-blue-200';
      case 'Saturday': return 'bg-green-50 border-green-200';
      case 'Sunday': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  const getDayTextColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'text-blue-900';
      case 'Saturday': return 'text-green-900';
      case 'Sunday': return 'text-orange-900';
      default: return 'text-gray-900';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Clock className="w-5 h-5 mr-2 text-teal-600" />
        Convention Schedule
      </h3>
      
      <div className="space-y-6">
        {Object.entries(shiftsByDay).map(([day, dayShifts]) => (
          <div key={day} className={`p-4 rounded-lg border ${getDayColor(day)}`}>
            <div className="flex items-center mb-3">
              <Calendar className="w-4 h-4 mr-2 text-gray-600" />
              <h4 className={`font-semibold ${getDayTextColor(day)}`}>{day}</h4>
            </div>
            
            <div className="space-y-3">
              {dayShifts.map((shift, index) => (
                <div
                  key={shift.id}
                  className={`relative flex items-center p-3 rounded-lg border transition-all cursor-pointer ${
                    activeShift === shift.id
                      ? 'border-teal-500 bg-teal-50'
                      : 'border-gray-200 bg-white hover:border-gray-300'
                  }`}
                  onClick={() => onShiftChange(shift.id)}
                >
                  <div className="flex-shrink-0 mr-3">
                    {activeShift === shift.id ? (
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    ) : (
                      <Circle className="w-5 h-5 text-gray-400" />
                    )}
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-1">
                      <h5 className={`font-medium text-sm ${
                        activeShift === shift.id ? 'text-teal-900' : 'text-gray-900'
                      }`}>
                        {shift.name.replace(` - ${day}`, '')}
                      </h5>
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        activeShift === shift.id
                          ? 'bg-teal-200 text-teal-800'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {activeShift === shift.id ? 'Active' : 'Scheduled'}
                      </span>
                    </div>
                    
                    <p className={`text-xs mb-1 ${
                      activeShift === shift.id ? 'text-teal-700' : 'text-gray-600'
                    }`}>
                      {shift.startTime} - {shift.endTime}
                    </p>
                    
                    <p className={`text-xs ${
                      activeShift === shift.id ? 'text-teal-600' : 'text-gray-500'
                    }`}>
                      {shift.description.replace(`${day} `, '')}
                    </p>
                  </div>
                  
                  {index < dayShifts.length - 1 && (
                    <div className="absolute left-6 top-full w-0.5 h-3 bg-gray-300 -mt-1.5"></div>
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}