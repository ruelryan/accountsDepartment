import React from 'react';
import { Box } from '../types';
import { Package, MapPin, AlertCircle, CheckCircle } from 'lucide-react';

interface BoxTrackerProps {
  boxes: Box[];
  activeShift: number | null;
  onBoxStatusChange: (boxId: number, newStatus: string) => void;
  selectedBoxId?: number | null;
}

export function BoxTracker({ boxes, activeShift, onBoxStatusChange, selectedBoxId }: BoxTrackerProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'returned':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      case 'needs_attention':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Package className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'returned':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'needs_attention':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const activeBoxes = boxes.filter(box => 
    !activeShift || box.currentShift === activeShift
  );

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Package className="w-5 h-5 mr-2 text-teal-600" />
        Contribution Boxes
        <span className="ml-2 text-sm font-normal text-gray-600">
          ({activeBoxes.length})
        </span>
      </h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {activeBoxes.map(box => (
          <div
            key={box.id}
            className={`p-3 rounded-lg border transition-all ${
              selectedBoxId === box.id
                ? 'border-teal-400 bg-teal-100 ring-2 ring-teal-200'
                : box.status === 'active' 
                ? 'border-teal-200 bg-teal-50' 
                : 'border-gray-200 bg-gray-50'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center space-x-2">
                {getStatusIcon(box.status)}
                <span className="font-medium text-gray-900">Box #{box.id}</span>
                {box.isAtEntrance && (
                  <span className="text-xs bg-blue-100 text-blue-800 px-2 py-0.5 rounded-full">
                    Entrance
                  </span>
                )}
                {selectedBoxId === box.id && (
                  <span className="text-xs bg-teal-100 text-teal-800 px-2 py-0.5 rounded-full animate-pulse">
                    Selected
                  </span>
                )}
              </div>
              
              <select
                value={box.status}
                onChange={(e) => onBoxStatusChange(box.id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 ${getStatusColor(box.status)}`}
              >
                <option value="assigned">Assigned</option>
                <option value="active">Active</option>
                <option value="returned">Returned</option>
                <option value="needs_attention">Needs Attention</option>
              </select>
            </div>
            
            <div className="flex items-center text-xs text-gray-600">
              <MapPin className="w-3 h-3 mr-1" />
              <span>{box.location}</span>
              {box.currentShift && (
                <span className="ml-2">• Shift {box.currentShift}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}