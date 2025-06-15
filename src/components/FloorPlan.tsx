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
      case 'active': return 'bg-green-500 border-green-600';
      case 'returned': return 'bg-gray-400 border-gray-500';
      case 'needs_attention': return 'bg-red-500 border-red-600';
      default: return 'bg-yellow-500 border-yellow-600';
    }
  };

  const getBoxStatusDotColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'returned': return 'bg-gray-400';
      case 'needs_attention': return 'bg-red-500';
      default: return 'bg-yellow-500';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 space-y-2 sm:space-y-0">
        <div className="flex items-center">
          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">Convention Hall Floor Plan</h3>
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
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-gray-400 rounded-full"></div>
            <span className="text-gray-500">Returned</span>
          </div>
        </div>
      </div>

      {/* Custom Floor Plan Layout */}
      <div className="relative bg-gray-50 rounded-lg border-2 border-gray-300 p-4 sm:p-8" style={{ minHeight: '500px' }}>
        
        {/* Stage Area */}
        <div className="absolute left-4 top-8 bottom-8 w-24 sm:w-32 bg-blue-400 rounded-lg flex items-center justify-center shadow-lg">
          <div className="text-white font-bold text-xs sm:text-sm text-center transform -rotate-90">
            STAGE
          </div>
        </div>

        {/* Box Empty Storage */}
        <div className="absolute right-4 top-8 w-20 sm:w-24 h-12 sm:h-16 bg-orange-200 border border-orange-400 rounded flex items-center justify-center">
          <div className="text-xs font-bold text-orange-800 text-center leading-tight">
            BOX EMPTY<br />STORAGE
          </div>
        </div>

        {/* Counting Table */}
        <div className="absolute right-4 top-24 w-20 sm:w-24 h-12 sm:h-16 bg-orange-200 border border-orange-400 rounded flex items-center justify-center">
          <div className="text-xs font-bold text-orange-800 text-center leading-tight">
            COUNTING<br />TABLE
          </div>
        </div>

        {/* Box Positions - Row 1 (Top) */}
        <BoxPosition 
          boxId={1} 
          box={boxes.find(b => b.id === 1)} 
          position={{ left: '200px', top: '60px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
        />
        <BoxPosition 
          boxId={5} 
          box={boxes.find(b => b.id === 5)} 
          position={{ left: '320px', top: '60px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
        />
        <BoxPosition 
          boxId={8} 
          box={boxes.find(b => b.id === 8)} 
          position={{ left: '440px', top: '60px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
          isEntrance={true}
        />

        {/* Box Positions - Row 2 (Middle) */}
        <BoxPosition 
          boxId={2} 
          box={boxes.find(b => b.id === 2)} 
          position={{ left: '200px', top: '180px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
        />
        <BoxPosition 
          boxId={4} 
          box={boxes.find(b => b.id === 4)} 
          position={{ left: '280px', top: '180px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
        />
        <BoxPosition 
          boxId={7} 
          box={boxes.find(b => b.id === 7)} 
          position={{ left: '360px', top: '180px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
        />
        <BoxPosition 
          boxId={9} 
          box={boxes.find(b => b.id === 9)} 
          position={{ left: '440px', top: '180px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
          isEntrance={true}
        />

        {/* Box Positions - Row 3 (Bottom) */}
        <BoxPosition 
          boxId={3} 
          box={boxes.find(b => b.id === 3)} 
          position={{ left: '200px', top: '300px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
        />
        <BoxPosition 
          boxId={6} 
          box={boxes.find(b => b.id === 6)} 
          position={{ left: '320px', top: '300px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
        />
        <BoxPosition 
          boxId={10} 
          box={boxes.find(b => b.id === 10)} 
          position={{ left: '440px', top: '300px' }} 
          onBoxClick={onBoxClick}
          getBoxStatusColor={getBoxStatusColor}
          isEntrance={true}
        />

      </div>
    </div>
  );
}

interface BoxPositionProps {
  boxId: number;
  box?: Box;
  position: { left: string; top: string };
  onBoxClick: (boxId: number) => void;
  getBoxStatusColor: (status: string) => string;
  isEntrance?: boolean;
}

function BoxPosition({ boxId, box, position, onBoxClick, getBoxStatusColor, isEntrance }: BoxPositionProps) {
  return (
    <button
      className={`absolute w-12 h-12 sm:w-16 sm:h-16 rounded-full border-2 cursor-pointer transition-all hover:scale-110 shadow-lg flex items-center justify-center font-bold text-white ${
        getBoxStatusColor(box?.status || 'assigned')
      }`}
      style={{ 
        left: position.left, 
        top: position.top,
        transform: 'translate(-50%, -50%)'
      }}
      onClick={() => onBoxClick(boxId)}
      title={`Box #${boxId}${isEntrance ? ' (Entrance/Exit)' : ''}`}
    >
      <div className="text-center">
        <div className="text-sm sm:text-lg font-bold">{boxId}</div>
        {isEntrance && (
          <div className="text-xs leading-none">E</div>
        )}
      </div>
    </button>
  );
}