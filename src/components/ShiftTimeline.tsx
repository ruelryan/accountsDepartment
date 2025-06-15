import React from 'react';
import { Shift } from '../types';
import { Clock, Circle, CheckCircle } from 'lucide-react';

interface ShiftTimelineProps {
  shifts: Shift[];
  activeShift: number | null;
  onShiftChange: (shiftId: number) => void;
}

export function ShiftTimeline({ shifts, activeShift, onShiftChange }: ShiftTimelineProps) {
  const shiftsByDay = shifts.reduce((acc, shift) => {
    if (!acc[shift.day]) {
      acc[shift.day] = [];
    }
    acc[shift.day].push(shift);
    return acc;
  }, {} as Record<string, Shift[]>);

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'border-l-blue-400';
      case 'Saturday': return 'border-l-green-400';
      case 'Sunday': return 'border-l-orange-400';
      default: return 'border-l-gray-400';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
      <div className="flex items-center mb-4">
        <Clock className="w-4 h-4 text-gray-400 mr-2" />
        <h3 className="font-medium text-gray-900 text-sm sm:text-base">Schedule</h3>
      </div>
      
      <div className="space-y-4">
        {Object.entries(shiftsByDay).map(([day, dayShifts]) => (
          <div key={day}>
            <div className="text-xs font-medium text-gray-500 mb-2 uppercase tracking-wide">
              {day}
            </div>
            
            <div className="space-y-1">
              {dayShifts.map((shift) => (
                <button
                  key={shift.id}
                  onClick={() => onShiftChange(shift.id)}
                  className={`w-full text-left p-2 rounded border-l-2 transition-all ${
                    activeShift === shift.id
                      ? `${getDayColor(day)} bg-gray-50`
                      : 'border-l-gray-200 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {activeShift === shift.id ? (
                        <CheckCircle className="w-3 h-3 text-teal-500" />
                      ) : (
                        <Circle className="w-3 h-3 text-gray-300" />
                      )}
                      <span className="text-sm font-medium text-gray-900">
                        Shift {shift.id}
                      </span>
                    </div>
                    {activeShift === shift.id && (
                      <div className="w-2 h-2 bg-teal-400 rounded-full"></div>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 ml-5 truncate">
                    {shift.startTime}
                  </div>
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}