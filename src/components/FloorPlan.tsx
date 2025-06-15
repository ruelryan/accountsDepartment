import React from 'react';
import { Box } from '../types';
import { MapPin, Package, AlertCircle, CheckCircle } from 'lucide-react';

interface FloorPlanProps {
  boxes: Box[];
  onBoxClick: (boxId: number) => void;
}

export function FloorPlan({ boxes, onBoxClick }: FloorPlanProps) {
  const getBoxStatusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-green-500 border-green-600';
      case 'returned':
        return 'bg-gray-500 border-gray-600';
      case 'needs_attention':
        return 'bg-red-500 border-red-600';
      default:
        return 'bg-yellow-500 border-yellow-600';
    }
  };

  const getBoxIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="w-3 h-3 text-white" />;
      case 'needs_attention':
        return <AlertCircle className="w-3 h-3 text-white" />;
      default:
        return <Package className="w-3 h-3 text-white" />;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900 flex items-center">
          <MapPin className="w-5 h-5 mr-2 text-teal-600" />
          Convention Hall Floor Plan
        </h3>
        <div className="flex items-center space-x-4 text-xs">
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-green-500 rounded-full"></div>
            <span>Active</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
            <span>Assigned</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-red-500 rounded-full"></div>
            <span>Attention</span>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-3 h-3 bg-gray-500 rounded-full"></div>
            <span>Returned</span>
          </div>
        </div>
      </div>

      {/* Floor Plan Image Container */}
      <div className="relative bg-gray-50 rounded-lg border-2 border-gray-200 overflow-hidden">
        <img 
          src="/Floorplan.jpg" 
          alt="Convention Hall Floor Plan" 
          className="w-full h-auto"
        />
        
        {/* Contribution Box Overlays - positioned based on the actual floor plan */}
        <div className="absolute inset-0">
          {/* Box 1 - Convention Dept Front Left */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 1)?.status || 'assigned')}`}
            style={{ top: '36%', left: '37%' }}
            onClick={() => onBoxClick(1)}
            title="Box #1"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 1)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              1
            </div>
          </div>

          {/* Box 2 - Convention Dept Front Center */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 2)?.status || 'assigned')}`}
            style={{ top: '36%', left: '50%' }}
            onClick={() => onBoxClick(2)}
            title="Box #2"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 2)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              2
            </div>
          </div>

          {/* Box 3 - Convention Dept Front Right */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 3)?.status || 'assigned')}`}
            style={{ top: '36%', left: '63%' }}
            onClick={() => onBoxClick(3)}
            title="Box #3"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 3)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              3
            </div>
          </div>

          {/* Box 4 - Floor Seats Left */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 4)?.status || 'assigned')}`}
            style={{ top: '58%', left: '37%' }}
            onClick={() => onBoxClick(4)}
            title="Box #4"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 4)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              4
            </div>
          </div>

          {/* Box 5 - Floor Seats Center */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 5)?.status || 'assigned')}`}
            style={{ top: '62%', left: '50%' }}
            onClick={() => onBoxClick(5)}
            title="Box #5"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 5)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              5
            </div>
          </div>

          {/* Box 6 - Floor Seats Right */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 6)?.status || 'assigned')}`}
            style={{ top: '58%', left: '63%' }}
            onClick={() => onBoxClick(6)}
            title="Box #6"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 6)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              6
            </div>
          </div>

          {/* Box 7 - Convention Dept Back Left */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 7)?.status || 'assigned')}`}
            style={{ top: '84%', left: '37%' }}
            onClick={() => onBoxClick(7)}
            title="Box #7"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 7)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              7
            </div>
          </div>

          {/* Box 8 - Entrance/Exit */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 8)?.status || 'assigned')}`}
            style={{ top: '84%', left: '50%' }}
            onClick={() => onBoxClick(8)}
            title="Box #8 - Entrance/Exit"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 8)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              8
            </div>
          </div>

          {/* Box 9 - Entrance/Exit */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 9)?.status || 'assigned')}`}
            style={{ top: '84%', left: '63%' }}
            onClick={() => onBoxClick(9)}
            title="Box #9 - Entrance/Exit"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 9)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              9
            </div>
          </div>

          {/* Box 10 - Entrance/Exit */}
          <div
            className={`absolute w-6 h-6 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg ${getBoxStatusColor(boxes.find(b => b.id === 10)?.status || 'assigned')}`}
            style={{ top: '58%', left: '88%' }}
            onClick={() => onBoxClick(10)}
            title="Box #10 - Entrance/Exit"
          >
            <div className="flex items-center justify-center h-full">
              {getBoxIcon(boxes.find(b => b.id === 10)?.status || 'assigned')}
            </div>
            <div className="absolute -bottom-5 left-1/2 transform -translate-x-1/2 text-xs font-bold text-gray-700 bg-white px-1 rounded shadow">
              10
            </div>
          </div>
        </div>
      </div>

      {/* Box Details Panel */}
      <div className="mt-4 grid grid-cols-2 md:grid-cols-5 gap-2">
        {boxes.slice(0, 10).map(box => (
          <div
            key={box.id}
            className={`p-2 rounded border text-xs cursor-pointer transition-all hover:shadow-md ${
              box.status === 'active' 
                ? 'bg-green-50 border-green-200' 
                : box.status === 'needs_attention'
                ? 'bg-red-50 border-red-200'
                : box.status === 'returned'
                ? 'bg-gray-50 border-gray-200'
                : 'bg-yellow-50 border-yellow-200'
            }`}
            onClick={() => onBoxClick(box.id)}
          >
            <div className="flex items-center justify-between mb-1">
              <span className="font-semibold">Box #{box.id}</span>
              {getBoxIcon(box.status)}
            </div>
            <div className="text-gray-600">{box.location}</div>
            <div className="text-gray-500 capitalize">{box.status.replace('_', ' ')}</div>
            {box.isAtEntrance && (
              <div className="text-blue-600 font-medium">Entrance</div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}