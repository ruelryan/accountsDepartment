import React, { useState } from 'react';
import { Volunteer, Shift } from '../types';
import { 
  Users, 
  Package, 
  Clock, 
  MapPin, 
  Plus, 
  X, 
  CheckCircle,
  AlertTriangle,
  User,
  Key
} from 'lucide-react';

interface ShiftAssignmentPanelProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onVolunteersUpdate: (volunteers: Volunteer[]) => void;
  onClose: () => void;
  hasSchedulingConflict: (volunteer: Volunteer, newRole: any) => { hasConflict: boolean; reason: string };
}

export function ShiftAssignmentPanel({ 
  volunteers, 
  shifts, 
  onVolunteersUpdate, 
  onClose,
  hasSchedulingConflict
}: ShiftAssignmentPanelProps) {
  const [selectedShift, setSelectedShift] = useState<number | null>(null);
  const [assignmentMode, setAssignmentMode] = useState<'box_watcher' | 'keyman'>('box_watcher');

  // Get shifts grouped by day
  const getShiftsByDay = () => {
    const shiftsByDay: Record<string, Shift[]> = {};
    shifts.forEach(shift => {
      if (!shiftsByDay[shift.day]) {
        shiftsByDay[shift.day] = [];
      }
      shiftsByDay[shift.day].push(shift);
    });
    return shiftsByDay;
  };

  // Get assignments for a specific shift
  const getShiftAssignments = (shiftId: number) => {
    const boxWatchers = volunteers.filter(v => 
      v.roles.some(role => role.type === 'box_watcher' && role.shift === shiftId)
    );
    const keymen = volunteers.filter(v => 
      v.roles.some(role => role.type === 'keyman' && role.shift === shiftId)
    );

    return { boxWatchers, keymen };
  };

  // Get available volunteers for assignment
  const getAvailableVolunteers = (shiftId: number, roleType: 'box_watcher' | 'keyman') => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return [];

    return volunteers.filter(v => {
      // Must have required privilege
      if (!v.privileges.includes(roleType)) return false;

      // Check gender restrictions for keymen
      if (roleType === 'keyman' && v.gender !== 'male') return false;

      // Must not already be assigned to this shift
      if (v.roles.some(role => role.shift === shiftId)) return false;

      // Check for scheduling conflicts
      const newRole = {
        type: roleType,
        shift: shiftId,
        day: shift.day
      };

      const conflictCheck = hasSchedulingConflict(v, newRole);
      return !conflictCheck.hasConflict;
    });
  };

  // Assign volunteer to box
  const handleAssignToBox = (volunteerId: string, shiftId: number, boxNumber: number) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    const shift = shifts.find(s => s.id === shiftId);
    if (!volunteer || !shift) return;

    const newRole = {
      type: 'box_watcher' as const,
      shift: shiftId,
      status: 'assigned' as const,
      day: shift.day,
      boxNumber: boxNumber,
      location: boxNumber >= 8 ? 'Entrance/Exit' : 'Box Assignment'
    };

    // Double-check for conflicts
    const conflictCheck = hasSchedulingConflict(volunteer, newRole);
    if (conflictCheck.hasConflict) {
      alert(`Cannot assign: ${conflictCheck.reason}`);
      return;
    }

    const updatedVolunteers = volunteers.map(v => 
      v.id === volunteerId 
        ? { ...v, roles: [...v.roles, newRole] }
        : v
    );

    onVolunteersUpdate(updatedVolunteers);
  };

  // Assign volunteer as keyman
  const handleAssignAsKeyman = (volunteerId: string, shiftId: number) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    const shift = shifts.find(s => s.id === shiftId);
    if (!volunteer || !shift) return;

    const newRole = {
      type: 'keyman' as const,
      shift: shiftId,
      status: 'assigned' as const,
      day: shift.day,
      location: 'Accounts Department'
    };

    // Double-check for conflicts
    const conflictCheck = hasSchedulingConflict(volunteer, newRole);
    if (conflictCheck.hasConflict) {
      alert(`Cannot assign: ${conflictCheck.reason}`);
      return;
    }

    const updatedVolunteers = volunteers.map(v => 
      v.id === volunteerId 
        ? { ...v, roles: [...v.roles, newRole] }
        : v
    );

    onVolunteersUpdate(updatedVolunteers);
  };

  // Remove assignment
  const handleRemoveAssignment = (volunteerId: string, shiftId: number) => {
    const updatedVolunteers = volunteers.map(v => 
      v.id === volunteerId 
        ? { 
            ...v, 
            roles: v.roles.filter(role => role.shift !== shiftId)
          }
        : v
    );

    onVolunteersUpdate(updatedVolunteers);
  };

  const shiftsByDay = getShiftsByDay();
  const days = ['Friday', 'Saturday', 'Sunday'];

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'Saturday': return 'bg-green-50 border-green-200 text-green-900';
      case 'Sunday': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  // Helper function to get shift number within day (1-4)
  const getShiftNumberInDay = (shiftId: number) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return shiftId;
    
    const dayShifts = shifts.filter(s => s.day === shift.day);
    const sortedDayShifts = dayShifts.sort((a, b) => a.id - b.id);
    const index = sortedDayShifts.findIndex(s => s.id === shiftId);
    return index + 1;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-7xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-teal-600 to-blue-600 text-white p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <h2 className="text-2xl font-bold">Shift Assignment Center</h2>
                <p className="text-teal-100">Assign publishers to shifts with conflict detection</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-white/20 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
        </div>

        <div className="flex h-[calc(90vh-120px)]">
          {/* Left Sidebar - Shift Selection */}
          <div className="w-80 border-r border-gray-200 bg-gray-50 overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 mb-4">Select Shift to Assign</h3>
              
              <div className="space-y-4">
                {days.map(day => (
                  <div key={day}>
                    <div className={`p-3 rounded-lg border ${getDayColor(day)} mb-2`}>
                      <h4 className="font-semibold">{day}</h4>
                    </div>
                    
                    <div className="space-y-2 ml-2">
                      {shiftsByDay[day]?.map(shift => {
                        const { boxWatchers, keymen } = getShiftAssignments(shift.id);
                        const isComplete = boxWatchers.length === 10 && keymen.length === 3;
                        const shiftNumInDay = getShiftNumberInDay(shift.id);
                        
                        return (
                          <button
                            key={shift.id}
                            onClick={() => setSelectedShift(shift.id)}
                            className={`w-full text-left p-3 rounded-lg border transition-all ${
                              selectedShift === shift.id
                                ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                                : isComplete
                                ? 'border-green-200 bg-green-50 hover:border-green-300'
                                : 'border-yellow-200 bg-yellow-50 hover:border-yellow-300'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">
                                Shift {shiftNumInDay}
                              </span>
                              {isComplete ? (
                                <CheckCircle className="w-4 h-4 text-green-600" />
                              ) : (
                                <AlertTriangle className="w-4 h-4 text-yellow-600" />
                              )}
                            </div>
                            
                            <div className="text-xs text-gray-600 space-y-1">
                              <div>{shift.startTime}</div>
                              <div className="flex justify-between">
                                <span>Box Watchers: {boxWatchers.length}/10</span>
                                <span>Keymen: {keymen.length}/3</span>
                              </div>
                            </div>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content - Assignment Interface */}
          <div className="flex-1 overflow-y-auto">
            {selectedShift ? (
              <ShiftAssignmentInterface
                shift={shifts.find(s => s.id === selectedShift)!}
                volunteers={volunteers}
                getShiftAssignments={getShiftAssignments}
                getAvailableVolunteers={getAvailableVolunteers}
                onAssignToBox={handleAssignToBox}
                onAssignAsKeyman={handleAssignAsKeyman}
                onRemoveAssignment={handleRemoveAssignment}
                assignmentMode={assignmentMode}
                setAssignmentMode={setAssignmentMode}
                getShiftNumberInDay={getShiftNumberInDay}
                hasSchedulingConflict={hasSchedulingConflict}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Clock className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-xl font-semibold text-gray-900 mb-2">Select a Shift</h3>
                  <p className="text-gray-600">Choose a shift from the left panel to start assigning volunteers</p>
                  <div className="mt-4 text-sm text-blue-600 bg-blue-50 p-3 rounded-lg">
                    <strong>Scheduling Rules:</strong> Max 2 assignments per day. Compatible shifts: 1↔3, 2↔4.
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// Shift Assignment Interface Component
interface ShiftAssignmentInterfaceProps {
  shift: Shift;
  volunteers: Volunteer[];
  getShiftAssignments: (shiftId: number) => { boxWatchers: Volunteer[]; keymen: Volunteer[] };
  getAvailableVolunteers: (shiftId: number, roleType: 'box_watcher' | 'keyman') => Volunteer[];
  onAssignToBox: (volunteerId: string, shiftId: number, boxNumber: number) => void;
  onAssignAsKeyman: (volunteerId: string, shiftId: number) => void;
  onRemoveAssignment: (volunteerId: string, shiftId: number) => void;
  assignmentMode: 'box_watcher' | 'keyman';
  setAssignmentMode: (mode: 'box_watcher' | 'keyman') => void;
  getShiftNumberInDay: (shiftId: number) => number;
  hasSchedulingConflict: (volunteer: Volunteer, newRole: any) => { hasConflict: boolean; reason: string };
}

function ShiftAssignmentInterface({
  shift,
  volunteers,
  getShiftAssignments,
  getAvailableVolunteers,
  onAssignToBox,
  onAssignAsKeyman,
  onRemoveAssignment,
  assignmentMode,
  setAssignmentMode,
  getShiftNumberInDay,
  hasSchedulingConflict
}: ShiftAssignmentInterfaceProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<string | null>(null);
  const { boxWatchers, keymen } = getShiftAssignments(shift.id);
  const availableBoxWatchers = getAvailableVolunteers(shift.id, 'box_watcher');
  const availableKeymen = getAvailableVolunteers(shift.id, 'keyman');
  const shiftNumInDay = getShiftNumberInDay(shift.id);

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Saturday': return 'bg-green-100 text-green-800 border-green-200';
      case 'Sunday': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const handleBoxClick = (boxNumber: number) => {
    if (!selectedVolunteer || assignmentMode !== 'box_watcher') return;
    
    onAssignToBox(selectedVolunteer, shift.id, boxNumber);
    setSelectedVolunteer(null);
  };

  const handleKeymanAssign = () => {
    if (!selectedVolunteer || assignmentMode !== 'keyman') return;
    
    onAssignAsKeyman(selectedVolunteer, shift.id);
    setSelectedVolunteer(null);
  };

  // Get conflict information for a volunteer
  const getVolunteerConflictInfo = (volunteer: Volunteer) => {
    const newRole = {
      type: assignmentMode,
      shift: shift.id,
      day: shift.day
    };
    
    return hasSchedulingConflict(volunteer, newRole);
  };

  return (
    <div className="p-6">
      {/* Shift Header */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-2xl font-bold text-gray-900">Shift {shiftNumInDay} - {shift.day}</h3>
            <p className="text-gray-600">{shift.startTime} - {shift.endTime}</p>
          </div>
          <span className={`px-4 py-2 rounded-full text-sm font-medium border ${getDayColor(shift.day)}`}>
            {shift.day}
          </span>
        </div>

        {/* Assignment Mode Toggle */}
        <div className="flex items-center space-x-4 mb-4">
          <span className="text-sm font-medium text-gray-700">Assignment Mode:</span>
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setAssignmentMode('box_watcher')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                assignmentMode === 'box_watcher'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Package className="w-4 h-4 inline mr-2" />
              Box Watchers
            </button>
            <button
              onClick={() => setAssignmentMode('keyman')}
              className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                assignmentMode === 'keyman'
                  ? 'bg-white text-teal-700 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <Key className="w-4 h-4 inline mr-2" />
              Keymen
            </button>
          </div>
        </div>

        {/* Progress Indicators */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-900">Box Watchers</span>
              <Package className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-2xl font-bold text-blue-900">{boxWatchers.length}/10</div>
            <div className="w-full bg-blue-200 rounded-full h-2 mt-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all"
                style={{ width: `${(boxWatchers.length / 10) * 100}%` }}
              ></div>
            </div>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-green-900">Keymen</span>
              <Key className="w-4 h-4 text-green-600" />
            </div>
            <div className="text-2xl font-bold text-green-900">{keymen.length}/3</div>
            <div className="w-full bg-green-200 rounded-full h-2 mt-2">
              <div 
                className="bg-green-600 h-2 rounded-full transition-all"
                style={{ width: `${(keymen.length / 3) * 100}%` }}
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Assignment Area */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            {assignmentMode === 'box_watcher' ? 'Box Assignments' : 'Keyman Assignments'}
          </h4>
          
          {assignmentMode === 'box_watcher' ? (
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: 10 }, (_, i) => {
                const boxNumber = i + 1;
                const assignedVolunteer = boxWatchers.find(v => 
                  v.roles.some(role => 
                    role.type === 'box_watcher' && 
                    role.shift === shift.id && 
                    role.boxNumber === boxNumber
                  )
                );

                return (
                  <button
                    key={boxNumber}
                    onClick={() => handleBoxClick(boxNumber)}
                    disabled={!!assignedVolunteer || !selectedVolunteer}
                    className={`aspect-square p-2 rounded-lg border-2 transition-all text-sm font-medium ${
                      assignedVolunteer
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : selectedVolunteer
                        ? 'bg-teal-100 border-teal-300 text-teal-800 hover:bg-teal-200 cursor-pointer'
                        : 'bg-gray-50 border-gray-200 text-gray-400 cursor-not-allowed'
                    }`}
                  >
                    <div className="text-xs mb-1">Box</div>
                    <div className="font-bold">{boxNumber}</div>
                    {assignedVolunteer && (
                      <div className="text-xs mt-1 truncate">
                        {assignedVolunteer.firstName[0]}{assignedVolunteer.lastName[0]}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="space-y-3">
              {Array.from({ length: 3 }, (_, i) => {
                const keymanNumber = i + 1;
                const assignedKeyman = keymen[i];

                return (
                  <div
                    key={keymanNumber}
                    className={`p-4 rounded-lg border-2 transition-all ${
                      assignedKeyman
                        ? 'bg-green-100 border-green-300'
                        : selectedVolunteer
                        ? 'bg-teal-100 border-teal-300'
                        : 'bg-gray-50 border-gray-200'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900">Keyman {keymanNumber}</div>
                        {assignedKeyman && (
                          <div className="text-sm text-gray-600">
                            {assignedKeyman.firstName} {assignedKeyman.lastName}
                          </div>
                        )}
                      </div>
                      
                      {assignedKeyman ? (
                        <button
                          onClick={() => onRemoveAssignment(assignedKeyman.id, shift.id)}
                          className="p-1 text-red-600 hover:bg-red-100 rounded"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      ) : selectedVolunteer ? (
                        <button
                          onClick={handleKeymanAssign}
                          className="px-3 py-1 bg-teal-600 text-white rounded text-sm hover:bg-teal-700"
                        >
                          Assign
                        </button>
                      ) : null}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Available Volunteers */}
        <div>
          <h4 className="font-semibold text-gray-900 mb-4">
            Available {assignmentMode === 'box_watcher' ? 'Box Watchers' : 'Keymen'}
            <span className="text-sm font-normal text-gray-600 ml-2">
              ({assignmentMode === 'box_watcher' ? availableBoxWatchers.length : availableKeymen.length})
            </span>
          </h4>
          
          <div className="space-y-2 max-h-96 overflow-y-auto">
            {(assignmentMode === 'box_watcher' ? availableBoxWatchers : availableKeymen).map(volunteer => {
              const conflictInfo = getVolunteerConflictInfo(volunteer);
              
              return (
                <button
                  key={volunteer.id}
                  onClick={() => setSelectedVolunteer(selectedVolunteer === volunteer.id ? null : volunteer.id)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedVolunteer === volunteer.id
                      ? 'border-teal-500 bg-teal-50 ring-2 ring-teal-200'
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                        <span className="text-white font-bold text-xs">
                          {volunteer.firstName[0]}{volunteer.lastName[0]}
                        </span>
                      </div>
                      <div>
                        <div className="font-medium text-gray-900">
                          {volunteer.firstName} {volunteer.lastName}
                        </div>
                        <div className="text-sm text-gray-600">
                          {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                          {/* Show current assignments for this day */}
                          {volunteer.roles.filter(r => r.day === shift.day).length > 0 && (
                            <span className="ml-2 text-xs text-blue-600">
                              ({volunteer.roles.filter(r => r.day === shift.day).length} assigned)
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {selectedVolunteer === volunteer.id && (
                      <CheckCircle className="w-5 h-5 text-teal-600" />
                    )}
                  </div>
                </button>
              );
            })}
            
            {(assignmentMode === 'box_watcher' ? availableBoxWatchers : availableKeymen).length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                <p>No available volunteers without conflicts</p>
                <p className="text-xs mt-1">Check scheduling rules and existing assignments</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Current Assignments Summary */}
      <div className="mt-8 pt-6 border-t border-gray-200">
        <h4 className="font-semibold text-gray-900 mb-4">Current Assignments Summary</h4>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Box Watchers Summary */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Box Watchers ({boxWatchers.length}/10)</h5>
            <div className="space-y-2">
              {boxWatchers.map(volunteer => {
                const role = volunteer.roles.find(r => r.type === 'box_watcher' && r.shift === shift.id);
                return (
                  <div key={volunteer.id} className="flex items-center justify-between p-2 bg-blue-50 rounded">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Box #{role?.boxNumber}</span>
                      <span className="text-sm text-gray-600">
                        {volunteer.firstName} {volunteer.lastName}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveAssignment(volunteer.id, shift.id)}
                      className="p-1 text-red-600 hover:bg-red-100 rounded"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Keymen Summary */}
          <div>
            <h5 className="text-sm font-medium text-gray-700 mb-3">Keymen ({keymen.length}/3)</h5>
            <div className="space-y-2">
              {keymen.map((volunteer, index) => (
                <div key={volunteer.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                  <div className="flex items-center space-x-2">
                    <span className="text-sm font-medium">Keyman {index + 1}</span>
                    <span className="text-sm text-gray-600">
                      {volunteer.firstName} {volunteer.lastName}
                    </span>
                  </div>
                  <button
                    onClick={() => onRemoveAssignment(volunteer.id, shift.id)}
                    className="p-1 text-red-600 hover:bg-red-100 rounded"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}