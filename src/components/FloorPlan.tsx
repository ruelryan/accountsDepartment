import React from 'react';
import { Box } from '../types';
import { MapPin } from 'lucide-react';

interface FloorPlanProps {
  boxes: Box[];
  onBoxClick: (boxId: number) => void;
}

export function FloorPlan({ boxes, onBoxClick }: FloorPlanProps) {
  const getBoxStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'returned': return 'bg-gray-400';
      case 'needs_attention': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">Floor Plan</h3>
        </div>
        <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-500">Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <span className="text-gray-500">Assigned</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-red-500 rounded-full"></div>
            <span className="text-gray-500">Attention</span>
          </div>
        </div>
      </div>

      <div className="relative bg-gray-50 rounded border overflow-hidden">
        <img 
          src="/Floorplan.jpg" 
          alt="Convention Hall Floor Plan" 
          className="w-full h-auto"
        />
        
        <div className="absolute inset-0">
          {/* Box positions based on floor plan */}
          {[
            { id: 1, top: '36%', left: '37%' },
            { id: 2, top: '36%', left: '50%' },
            { id: 3, top: '36%', left: '63%' },
            { id: 4, top: '58%', left: '37%' },
            { id: 5, top: '62%', left: '50%' },
            { id: 6, top: '58%', left: '63%' },
            { id: 7, top: '84%', left: '37%' },
            { id: 8, top: '84%', left: '50%' },
            { id: 9, top: '84%', left: '63%' },
            { id: 10, top: '58%', left: '88%' }
          ].map(({ id, top, left }) => {
            const box = boxes.find(b => b.id === id);
            return (
              <button
                key={id}
                className={`absolute w-3 h-3 sm:w-4 sm:h-4 rounded-full border-2 border-white cursor-pointer transition-all hover:scale-125 shadow-sm ${getBoxStatusColor(box?.status || 'assigned')}`}
                style={{ top, left, transform: 'translate(-50%, -50%)' }}
                onClick={() => onBoxClick(id)}
                title={`Box #${id}`}
              >
                <div className="absolute -bottom-3 sm:-bottom-4 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow-sm">
                  {id}
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}