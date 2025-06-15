import React from 'react';
import { Box } from '../types';
import { Package } from 'lucide-react';

interface BoxTrackerProps {
  boxes: Box[];
  activeShift: number | null;
  onBoxStatusChange: (boxId: number, newStatus: string) => void;
  selectedBoxId?: number | null;
}

export function BoxTracker({ boxes, activeShift, onBoxStatusChange, selectedBoxId }: BoxTrackerProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-50 border-green-200 text-green-800';
      case 'returned': return 'bg-gray-50 border-gray-200 text-gray-800';
      case 'needs_attention': return 'bg-red-50 border-red-200 text-red-800';
      default: return 'bg-yellow-50 border-yellow-200 text-yellow-800';
    }
  };

  const activeBoxes = boxes.filter(box => 
    !activeShift || box.currentShift === activeShift
  );

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Package className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">Boxes</h3>
        </div>
        <span className="text-xs sm:text-sm text-gray-500">{activeBoxes.length} active</span>
      </div>
      
      <div className="grid grid-cols-3 sm:grid-cols-5 md:grid-cols-5 gap-2">
        {activeBoxes.map(box => (
          <div
            key={box.id}
            className={`p-2 rounded border text-center transition-all ${
              selectedBoxId === box.id
                ? 'border-teal-300 bg-teal-50 ring-1 ring-teal-200'
                : getStatusColor(box.status)
            }`}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs sm:text-sm font-medium">#{box.id}</span>
              {box.isAtEntrance && (
                <span className="text-xs bg-blue-100 text-blue-700 px-1 rounded">E</span>
              )}
            </div>
            
            <select
              value={box.status}
              onChange={(e) => onBoxStatusChange(box.id, e.target.value)}
              className="w-full text-xs border-0 bg-transparent focus:outline-none font-medium"
            >
              <option value="assigned">Assigned</option>
              <option value="active">Active</option>
              <option value="returned">Returned</option>
              <option value="needs_attention">Attention</option>
            </select>
          </div>
        ))}
      </div>
    </div>
  );
}