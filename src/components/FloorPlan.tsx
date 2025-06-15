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
      case 'active': return 'bg-green-500 border-green-600 shadow-green-200';
      case 'returned': return 'bg-gray-400 border-gray-500 shadow-gray-200';
      case 'needs_attention': return 'bg-red-500 border-red-600 shadow-red-200';
      default: return 'bg-yellow-500 border-yellow-600 shadow-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm">
      <div className="flex items-center mb-6">
        <MapPin className="w-5 h-5 text-teal-600 mr-2" />
        <h3 className="font-semibold text-gray-900 text-base sm:text-lg">Convention Hall Floor Plan</h3>
      </div>

      {/* Scrollable Floor Plan Container */}
      <div className="overflow-x-auto overflow-y-hidden">
        <div className="relative bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl border border-gray-200" style={{ width: '800px', height: '500px', minWidth: '800px' }}>
          
          {/* Stage Area */}
          <div className="absolute left-6 top-12 bottom-12 w-28 bg-gradient-to-b from-blue-500 to-blue-600 rounded-lg flex items-center justify-center shadow-lg border border-blue-400">
            <div className="text-white font-bold text-sm text-center transform -rotate-90 tracking-wider">
              STAGE
            </div>
          </div>

          {/* Accounts Department Area */}
          <div className="absolute right-6 top-12 w-32 space-y-3">
            <div className="w-full h-16 bg-gradient-to-r from-orange-200 to-orange-300 border-2 border-orange-400 rounded-lg flex items-center justify-center shadow-md">
              <div className="text-xs font-bold text-orange-900 text-center leading-tight">
                BOX STORAGE
              </div>
            </div>
            <div className="w-full h-16 bg-gradient-to-r from-purple-200 to-purple-300 border-2 border-purple-400 rounded-lg flex items-center justify-center shadow-md">
              <div className="text-xs font-bold text-purple-900 text-center leading-tight">
                COUNTING<br />TABLE
              </div>
            </div>
          </div>

          {/* Main Seating Area Outline */}
          <div className="absolute left-40 right-44 top-16 bottom-16 border-2 border-dashed border-gray-300 rounded-lg bg-white/30">
            <div className="absolute top-2 left-2 text-xs text-gray-500 font-medium">Main Seating Area</div>
          </div>

          {/* Box Grid Layout */}
          <div className="absolute left-48 right-52 top-24 bottom-24">
            {/* Row 1 - Top */}
            <div className="absolute top-0 left-0 right-0 flex justify-between items-center">
              <BoxPosition 
                boxId={1} 
                box={boxes.find(b => b.id === 1)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
              />
              <BoxPosition 
                boxId={5} 
                box={boxes.find(b => b.id === 5)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
              />
              <BoxPosition 
                boxId={8} 
                box={boxes.find(b => b.id === 8)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
                isEntrance={true}
              />
            </div>

            {/* Row 2 - Middle */}
            <div className="absolute top-1/2 left-0 right-0 flex justify-between items-center transform -translate-y-1/2">
              <BoxPosition 
                boxId={2} 
                box={boxes.find(b => b.id === 2)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
              />
              <BoxPosition 
                boxId={4} 
                box={boxes.find(b => b.id === 4)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
              />
              <BoxPosition 
                boxId={7} 
                box={boxes.find(b => b.id === 7)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
              />
              <BoxPosition 
                boxId={9} 
                box={boxes.find(b => b.id === 9)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
                isEntrance={true}
              />
            </div>

            {/* Row 3 - Bottom */}
            <div className="absolute bottom-0 left-0 right-0 flex justify-between items-center">
              <BoxPosition 
                boxId={3} 
                box={boxes.find(b => b.id === 3)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
              />
              <BoxPosition 
                boxId={6} 
                box={boxes.find(b => b.id === 6)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
              />
              <BoxPosition 
                boxId={10} 
                box={boxes.find(b => b.id === 10)} 
                onBoxClick={onBoxClick}
                getBoxStatusColor={getBoxStatusColor}
                isEntrance={true}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Mobile Scroll Hint */}
      <div className="mt-2 text-xs text-gray-500 text-center sm:hidden">
        ← Scroll horizontally to view full floor plan →
      </div>

      {/* Box Assignment Summary */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200">
        <h4 className="text-sm font-semibold text-gray-900 mb-2">Box Assignment Summary</h4>
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
          <div className="text-center">
            <div className="font-medium text-gray-700">Main Hall</div>
            <div className="text-gray-600">Boxes 1-7</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Entrance/Exit</div>
            <div className="text-gray-600">Boxes 8-10</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Total Boxes</div>
            <div className="text-gray-600">{boxes.length}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Active</div>
            <div className="text-green-600 font-semibold">{boxes.filter(b => b.status === 'active').length}</div>
          </div>
          <div className="text-center">
            <div className="font-medium text-gray-700">Assigned</div>
            <div className="text-yellow-600 font-semibold">{boxes.filter(b => b.status === 'assigned').length}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

interface BoxPositionProps {
  boxId: number;
  box?: Box;
  onBoxClick: (boxId: number) => void;
  getBoxStatusColor: (status: string) => string;
  isEntrance?: boolean;
}

function BoxPosition({ boxId, box, onBoxClick, getBoxStatusColor, isEntrance }: BoxPositionProps) {
  return (
    <button
      className={`w-16 h-16 rounded-full border-3 cursor-pointer transition-all duration-200 hover:scale-110 hover:shadow-lg flex flex-col items-center justify-center font-bold text-white ${
        getBoxStatusColor(box?.status || 'assigned')
      } shadow-lg`}
      onClick={() => onBoxClick(boxId)}
      title={`Box #${boxId}${isEntrance ? ' (Entrance/Exit)' : ''} - ${box?.status || 'assigned'}`}
    >
      <div className="text-xl font-bold leading-none">{boxId}</div>
      {isEntrance && (
        <div className="text-xs font-semibold leading-none mt-0.5 opacity-90">E</div>
      )}
    </button>
  );
}