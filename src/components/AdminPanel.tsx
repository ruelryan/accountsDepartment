import React, { useState, useCallback } from 'react';
import { Volunteer, Shift, ScheduleConflict, MoneyCountingSession } from '../types';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  AlertTriangle, 
  Save, 
  Calendar,
  UserCheck,
  Settings,
  Clock,
  MapPin,
  DollarSign,
  CheckCircle,
  X,
  UserPlus
} from 'lucide-react';

interface AdminPanelProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onVolunteersUpdate: (volunteers: Volunteer[]) => void;
  onShiftsUpdate: (shifts: Shift[]) => void;
  onBackToMain: () => void;
}

export function AdminPanel({ 
  volunteers, 
  shifts, 
  onVolunteersUpdate, 
  onShiftsUpdate, 
  onBackToMain 
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'volunteers' | 'scheduling' | 'conflicts'>('volunteers');
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [selectedAssignmentBox, setSelectedAssignmentBox] = useState<{
    type: 'shift' | 'money_counter';
    id: string | number;
    day: string;
    time?: string;
  } | null>(null);
  
  const [moneyCountingSessions, setMoneyCountingSessions] = useState<MoneyCountingSession[]>([
    {
      id: 'friday-lunch',
      day: 'Friday',
      time: 'lunch',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'friday-afternoon',
      day: 'Friday',
      time: 'after_afternoon',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'saturday-lunch',
      day: 'Saturday',
      time: 'lunch',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'saturday-afternoon',
      day: 'Saturday',
      time: 'after_afternoon',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'sunday-lunch',
      day: 'Sunday',
      time: 'lunch',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    },
    {
      id: 'sunday-afternoon',
      day: 'Sunday',
      time: 'after_afternoon',
      assignedVolunteers: [],
      requiredCount: 8,
      minimumBrothers: 2
    }
  ]);

  const checkScheduleConflicts = useCallback(() => {
    const newConflicts: ScheduleConflict[] = [];

    volunteers.forEach(volunteer => {
      // Check for time overlaps
      const volunteerShifts = volunteer.roles.filter(role => role.shift).map(role => role.shift!);
      const uniqueShifts = [...new Set(volunteerShifts)];
      
      if (volunteerShifts.length !== uniqueShifts.length) {
        newConflicts.push({
          volunteerId: volunteer.id,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          conflictType: 'time_overlap',
          message: 'Has overlapping shift assignments',
          shifts: volunteerShifts
        });
      }

      // Check gender restrictions for keymen
      if (volunteer.roles.some(role => role.type === 'keyman') && volunteer.gender !== 'male') {
        newConflicts.push({
          volunteerId: volunteer.id,
          volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
          conflictType: 'gender_restriction',
          message: 'Keyman role requires male volunteer',
          shifts: volunteer.roles.filter(role => role.type === 'keyman').map(role => role.shift || 0)
        });
      }

      // Check money counter conflicts with shifts
      const moneyCounterRoles = volunteer.roles.filter(role => role.type === 'money_counter');
      const shiftRoles = volunteer.roles.filter(role => role.shift);
      
      moneyCounterRoles.forEach(mcRole => {
        shiftRoles.forEach(shiftRole => {
          const shift = shifts.find(s => s.id === shiftRole.shift);
          if (shift && shift.day === mcRole.day) {
            // Check lunch time conflicts (shifts 2 and 3)
            if (mcRole.time === 'lunch' && (shiftRole.shift === 2 || shiftRole.shift === 3 || 
                shiftRole.shift === 6 || shiftRole.shift === 7 || 
                shiftRole.shift === 10 || shiftRole.shift === 11)) {
              newConflicts.push({
                volunteerId: volunteer.id,
                volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
                conflictType: 'time_overlap',
                message: `Money counter (lunch) conflicts with shift ${shiftRole.shift}`,
                shifts: [shiftRole.shift!]
              });
            }
            
            // Check after afternoon conflicts (shift 4)
            if (mcRole.time === 'after_afternoon' && (shiftRole.shift === 4 || 
                shiftRole.shift === 8 || shiftRole.shift === 12)) {
              newConflicts.push({
                volunteerId: volunteer.id,
                volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
                conflictType: 'time_overlap',
                message: `Money counter (after afternoon) conflicts with shift ${shiftRole.shift}`,
                shifts: [shiftRole.shift!]
              });
            }
          }
        });
      });
    });

    // Check if each shift has enough keymen
    shifts.forEach(shift => {
      const keymenCount = volunteers.filter(v => 
        v.roles.some(role => role.type === 'keyman' && role.shift === shift.id) &&
        v.gender === 'male'
      ).length;

      if (keymenCount < 3) {
        newConflicts.push({
          volunteerId: '',
          volunteerName: `Shift ${shift.id} - ${shift.name}`,
          conflictType: 'insufficient_keymen',
          message: `Only ${keymenCount}/3 keymen assigned`,
          shifts: [shift.id]
        });
      }
    });

    // Check money counting session requirements
    moneyCountingSessions.forEach(session => {
      const assignedCount = session.assignedVolunteers.length;
      const brothersCount = session.assignedVolunteers.filter(vId => {
        const volunteer = volunteers.find(v => v.id === vId);
        return volunteer?.gender === 'male';
      }).length;

      if (assignedCount < session.requiredCount) {
        newConflicts.push({
          volunteerId: '',
          volunteerName: `${session.day} ${session.time === 'lunch' ? 'Lunch' : 'After Afternoon'} Money Counting`,
          conflictType: 'insufficient_keymen',
          message: `Only ${assignedCount}/${session.requiredCount} volunteers assigned`,
          shifts: []
        });
      }

      if (brothersCount < session.minimumBrothers) {
        newConflicts.push({
          volunteerId: '',
          volunteerName: `${session.day} ${session.time === 'lunch' ? 'Lunch' : 'After Afternoon'} Money Counting`,
          conflictType: 'gender_restriction',
          message: `Only ${brothersCount}/${session.minimumBrothers} brothers assigned`,
          shifts: []
        });
      }
    });

    setConflicts(newConflicts);
  }, [volunteers, shifts, moneyCountingSessions]);

  const handleAddVolunteer = () => {
    const newVolunteer: Volunteer = {
      id: Date.now().toString(),
      firstName: '',
      lastName: '',
      gender: 'male',
      roles: [],
      isAvailable: true,
      privileges: []
    };
    setEditingVolunteer(newVolunteer);
  };

  const handleSaveVolunteer = (volunteer: Volunteer) => {
    if (volunteer.firstName && volunteer.lastName) {
      const updatedVolunteers = volunteers.find(v => v.id === volunteer.id)
        ? volunteers.map(v => v.id === volunteer.id ? volunteer : v)
        : [...volunteers, volunteer];
      
      onVolunteersUpdate(updatedVolunteers);
      setEditingVolunteer(null);
      checkScheduleConflicts();
    }
  };

  const handleDeleteVolunteer = (volunteerId: string) => {
    if (confirm('Are you sure you want to delete this volunteer?')) {
      onVolunteersUpdate(volunteers.filter(v => v.id !== volunteerId));
      checkScheduleConflicts();
    }
  };

  const handleDirectAssignment = (volunteerId: string, assignmentType: 'shift' | 'money_counter', details: any) => {
    const updatedVolunteers = volunteers.map(volunteer => {
      if (volunteer.id === volunteerId) {
        if (assignmentType === 'shift') {
          const { shiftId, roleType, boxNumber } = details;
          const shift = shifts.find(s => s.id === shiftId);
          const newRole: Role = {
            type: roleType,
            shift: shiftId,
            status: 'assigned',
            day: shift?.day,
            boxNumber: roleType === 'box_watcher' ? boxNumber : undefined,
            location: roleType === 'box_watcher' ? 
              (boxNumber && boxNumber >= 8 ? 'Entrance/Exit' : 'Box Assignment') : 
              'Accounts Department'
          };

          return {
            ...volunteer,
            roles: [...volunteer.roles, newRole]
          };
        } else if (assignmentType === 'money_counter') {
          const { sessionId } = details;
          const session = moneyCountingSessions.find(s => s.id === sessionId);
          if (!session) return volunteer;

          const newRole: Role = {
            type: 'money_counter',
            status: 'assigned',
            day: session.day,
            location: 'Counting Table',
            time: session.time
          };

          return {
            ...volunteer,
            roles: [...volunteer.roles, newRole]
          };
        }
      }
      return volunteer;
    });

    if (assignmentType === 'money_counter') {
      const { sessionId } = details;
      const updatedSessions = moneyCountingSessions.map(s => 
        s.id === sessionId 
          ? { ...s, assignedVolunteers: [...s.assignedVolunteers, volunteerId] }
          : s
      );
      setMoneyCountingSessions(updatedSessions);
    }

    onVolunteersUpdate(updatedVolunteers);
    checkScheduleConflicts();
  };

  const handleRemoveAssignment = (volunteerId: string, assignmentType: 'shift' | 'money_counter', details: any) => {
    const updatedVolunteers = volunteers.map(volunteer => {
      if (volunteer.id === volunteerId) {
        if (assignmentType === 'shift') {
          const { shiftId, roleType } = details;
          return {
            ...volunteer,
            roles: volunteer.roles.filter(role => 
              !(role.type === roleType && role.shift === shiftId)
            )
          };
        } else if (assignmentType === 'money_counter') {
          const { sessionId } = details;
          const session = moneyCountingSessions.find(s => s.id === sessionId);
          if (!session) return volunteer;

          return {
            ...volunteer,
            roles: volunteer.roles.filter(role => 
              !(role.type === 'money_counter' && role.day === session.day && role.time === session.time)
            )
          };
        }
      }
      return volunteer;
    });

    if (assignmentType === 'money_counter') {
      const { sessionId } = details;
      const updatedSessions = moneyCountingSessions.map(s => 
        s.id === sessionId 
          ? { ...s, assignedVolunteers: s.assignedVolunteers.filter(id => id !== volunteerId) }
          : s
      );
      setMoneyCountingSessions(updatedSessions);
    }

    onVolunteersUpdate(updatedVolunteers);
    checkScheduleConflicts();
  };

  React.useEffect(() => {
    checkScheduleConflicts();
  }, [checkScheduleConflicts]);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-6">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-lg flex items-center justify-center">
                <Settings className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
                <p className="text-gray-600">Manage volunteers, schedules, and assignments</p>
              </div>
            </div>
            <button
              onClick={onBackToMain}
              className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
            >
              Back to Dashboard
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 mb-6">
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'volunteers'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Volunteers ({volunteers.length})
            </button>
            <button
              onClick={() => setActiveTab('scheduling')}
              className={`px-6 py-3 font-medium text-sm ${
                activeTab === 'scheduling'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Direct Assignment
            </button>
            <button
              onClick={() => setActiveTab('conflicts')}
              className={`px-6 py-3 font-medium text-sm relative ${
                activeTab === 'conflicts'
                  ? 'border-b-2 border-teal-500 text-teal-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              <AlertTriangle className="w-4 h-4 inline mr-2" />
              Conflicts
              {conflicts.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {conflicts.length}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'volunteers' && (
          <VolunteerManagement
            volunteers={volunteers}
            editingVolunteer={editingVolunteer}
            onAddVolunteer={handleAddVolunteer}
            onEditVolunteer={setEditingVolunteer}
            onSaveVolunteer={handleSaveVolunteer}
            onDeleteVolunteer={handleDeleteVolunteer}
            onCancelEdit={() => setEditingVolunteer(null)}
          />
        )}

        {activeTab === 'scheduling' && (
          <DirectAssignmentInterface
            volunteers={volunteers}
            shifts={shifts}
            moneyCountingSessions={moneyCountingSessions}
            selectedAssignmentBox={selectedAssignmentBox}
            onSelectAssignmentBox={setSelectedAssignmentBox}
            onDirectAssignment={handleDirectAssignment}
            onRemoveAssignment={handleRemoveAssignment}
          />
        )}

        {activeTab === 'conflicts' && (
          <ConflictManagement conflicts={conflicts} volunteers={volunteers} />
        )}

        {/* Assignment Modal */}
        {selectedAssignmentBox && (
          <AssignmentModal
            assignmentBox={selectedAssignmentBox}
            volunteers={volunteers}
            shifts={shifts}
            moneyCountingSessions={moneyCountingSessions}
            onClose={() => setSelectedAssignmentBox(null)}
            onDirectAssignment={handleDirectAssignment}
            onRemoveAssignment={handleRemoveAssignment}
          />
        )}
      </div>
    </div>
  );
}

// Direct Assignment Interface Component
function DirectAssignmentInterface({
  volunteers,
  shifts,
  moneyCountingSessions,
  selectedAssignmentBox,
  onSelectAssignmentBox,
  onDirectAssignment,
  onRemoveAssignment
}: {
  volunteers: Volunteer[];
  shifts: Shift[];
  moneyCountingSessions: MoneyCountingSession[];
  selectedAssignmentBox: any;
  onSelectAssignmentBox: (box: any) => void;
  onDirectAssignment: (volunteerId: string, type: string, details: any) => void;
  onRemoveAssignment: (volunteerId: string, type: string, details: any) => void;
}) {
  const getShiftAssignments = (shiftId: number) => {
    const boxWatchers = volunteers.filter(v => 
      v.roles.some(role => role.type === 'box_watcher' && role.shift === shiftId)
    );
    const keymen = volunteers.filter(v => 
      v.roles.some(role => role.type === 'keyman' && role.shift === shiftId)
    );

    return { boxWatchers, keymen };
  };

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

  const getMoneySessionsByDay = () => {
    const sessionsByDay: Record<string, MoneyCountingSession[]> = {};
    moneyCountingSessions.forEach(session => {
      if (!sessionsByDay[session.day]) {
        sessionsByDay[session.day] = [];
      }
      sessionsByDay[session.day].push(session);
    });
    return sessionsByDay;
  };

  const shiftsByDay = getShiftsByDay();
  const sessionsByDay = getMoneySessionsByDay();
  const days = ['Friday', 'Saturday', 'Sunday'];

  return (
    <div className="space-y-6">
      {/* Direct Assignment Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Click on any box to directly assign volunteers
        </h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {days.map(day => (
            <div key={day} className="space-y-4">
              <div className={`p-4 rounded-lg border ${
                day === 'Friday' ? 'bg-blue-50 border-blue-200' :
                day === 'Saturday' ? 'bg-green-50 border-green-200' :
                'bg-orange-50 border-orange-200'
              }`}>
                <h4 className={`font-semibold text-lg ${
                  day === 'Friday' ? 'text-blue-900' :
                  day === 'Saturday' ? 'text-green-900' :
                  'text-orange-900'
                }`}>{day}</h4>
              </div>

              {/* Shifts for this day */}
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 text-sm">Shifts</h5>
                {shiftsByDay[day]?.map(shift => {
                  const { boxWatchers, keymen } = getShiftAssignments(shift.id);
                  const isComplete = boxWatchers.length === 10 && keymen.length === 3;
                  
                  return (
                    <div
                      key={shift.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        isComplete
                          ? 'border-green-200 bg-green-50 hover:bg-green-100'
                          : 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                      }`}
                      onClick={() => onSelectAssignmentBox({
                        type: 'shift',
                        id: shift.id,
                        day: shift.day
                      })}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h6 className="font-medium text-gray-900 text-sm">Shift {shift.id}</h6>
                        <div className="flex items-center space-x-1">
                          <UserPlus className="w-4 h-4 text-gray-500" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            Click to Assign
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Box Watchers:</span>
                          <span className={boxWatchers.length === 10 ? 'text-green-600' : 'text-yellow-600'}>
                            {boxWatchers.length}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Keymen:</span>
                          <span className={keymen.length === 3 ? 'text-green-600' : 'text-yellow-600'}>
                            {keymen.length}/3
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Money Counting Sessions for this day */}
              <div className="space-y-2">
                <h5 className="font-medium text-gray-700 text-sm">Money Counting</h5>
                {sessionsByDay[day]?.map(session => {
                  const assignedCount = session.assignedVolunteers.length;
                  const brothersCount = session.assignedVolunteers.filter(vId => {
                    const volunteer = volunteers.find(v => v.id === vId);
                    return volunteer?.gender === 'male';
                  }).length;
                  const isComplete = assignedCount >= session.requiredCount && brothersCount >= session.minimumBrothers;
                  
                  return (
                    <div
                      key={session.id}
                      className={`p-3 rounded-lg border cursor-pointer transition-all hover:shadow-md ${
                        isComplete
                          ? 'border-purple-200 bg-purple-50 hover:bg-purple-100'
                          : 'border-yellow-200 bg-yellow-50 hover:bg-yellow-100'
                      }`}
                      onClick={() => onSelectAssignmentBox({
                        type: 'money_counter',
                        id: session.id,
                        day: session.day,
                        time: session.time
                      })}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h6 className="font-medium text-gray-900 text-sm">
                          {session.time === 'lunch' ? 'Lunch Time' : 'After Afternoon'}
                        </h6>
                        <div className="flex items-center space-x-1">
                          <DollarSign className="w-4 h-4 text-purple-600" />
                          <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                            isComplete ? 'bg-purple-100 text-purple-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            Click to Assign
                          </span>
                        </div>
                      </div>
                      
                      <div className="space-y-1 text-xs">
                        <div className="flex justify-between">
                          <span>Volunteers:</span>
                          <span className={assignedCount >= session.requiredCount ? 'text-green-600' : 'text-yellow-600'}>
                            {assignedCount}/{session.requiredCount}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Brothers:</span>
                          <span className={brothersCount >= session.minimumBrothers ? 'text-green-600' : 'text-yellow-600'}>
                            {brothersCount}/{session.minimumBrothers}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Assignment Modal Component
function AssignmentModal({
  assignmentBox,
  volunteers,
  shifts,
  moneyCountingSessions,
  onClose,
  onDirectAssignment,
  onRemoveAssignment
}: {
  assignmentBox: any;
  volunteers: Volunteer[];
  shifts: Shift[];
  moneyCountingSessions: MoneyCountingSession[];
  onClose: () => void;
  onDirectAssignment: (volunteerId: string, type: string, details: any) => void;
  onRemoveAssignment: (volunteerId: string, type: string, details: any) => void;
}) {
  if (assignmentBox.type === 'shift') {
    return (
      <ShiftAssignmentModal
        shiftId={assignmentBox.id}
        volunteers={volunteers}
        shifts={shifts}
        onClose={onClose}
        onDirectAssignment={onDirectAssignment}
        onRemoveAssignment={onRemoveAssignment}
      />
    );
  } else {
    return (
      <MoneyCounterAssignmentModal
        sessionId={assignmentBox.id}
        volunteers={volunteers}
        moneyCountingSessions={moneyCountingSessions}
        onClose={onClose}
        onDirectAssignment={onDirectAssignment}
        onRemoveAssignment={onRemoveAssignment}
      />
    );
  }
}

// Shift Assignment Modal
function ShiftAssignmentModal({
  shiftId,
  volunteers,
  shifts,
  onClose,
  onDirectAssignment,
  onRemoveAssignment
}: {
  shiftId: number;
  volunteers: Volunteer[];
  shifts: Shift[];
  onClose: () => void;
  onDirectAssignment: (volunteerId: string, type: string, details: any) => void;
  onRemoveAssignment: (volunteerId: string, type: string, details: any) => void;
}) {
  const shift = shifts.find(s => s.id === shiftId);
  if (!shift) return null;

  const assignedBoxWatchers = volunteers.filter(v => 
    v.roles.some(role => role.type === 'box_watcher' && role.shift === shiftId)
  );
  
  const assignedKeymen = volunteers.filter(v => 
    v.roles.some(role => role.type === 'keyman' && role.shift === shiftId)
  );

  const availableForBoxWatcher = volunteers.filter(v => 
    v.privileges.includes('box_watcher') && 
    !v.roles.some(role => role.shift === shiftId)
  );

  const availableForKeyman = volunteers.filter(v => 
    v.privileges.includes('keyman') && 
    v.gender === 'male' &&
    !v.roles.some(role => role.shift === shiftId)
  );

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Volunteers to {shift.name}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Box Watchers Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Box Watchers ({assignedBoxWatchers.length}/10)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Assignments */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Current Assignments</h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {Array.from({ length: 10 }, (_, i) => {
                    const boxNumber = i + 1;
                    const assignedVolunteer = assignedBoxWatchers.find(v => 
                      v.roles.some(role => 
                        role.type === 'box_watcher' && 
                        role.shift === shiftId && 
                        role.boxNumber === boxNumber
                      )
                    );

                    return (
                      <div key={boxNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Box {boxNumber}:</span>
                        {assignedVolunteer ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              {assignedVolunteer.firstName} {assignedVolunteer.lastName}
                            </span>
                            <button
                              onClick={() => onRemoveAssignment(assignedVolunteer.id, 'shift', {
                                shiftId,
                                roleType: 'box_watcher'
                              })}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onDirectAssignment(e.target.value, 'shift', {
                                  shiftId,
                                  roleType: 'box_watcher',
                                  boxNumber
                                });
                                e.target.value = '';
                              }
                            }}
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="">Select Volunteer</option>
                            {availableForBoxWatcher.map(volunteer => (
                              <option key={volunteer.id} value={volunteer.id}>
                                {volunteer.firstName} {volunteer.lastName}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Volunteers */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Available Volunteers ({availableForBoxWatcher.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableForBoxWatcher.map(volunteer => (
                    <div key={volunteer.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                      <span className="text-sm">
                        {volunteer.firstName} {volunteer.lastName}
                        <span className={`ml-2 px-1 py-0.5 rounded text-xs ${
                          volunteer.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                        }`}>
                          {volunteer.gender === 'male' ? 'Bro' : 'Sis'}
                        </span>
                      </span>
                      <select
                        onChange={(e) => {
                          const boxNumber = parseInt(e.target.value);
                          if (boxNumber) {
                            onDirectAssignment(volunteer.id, 'shift', {
                              shiftId,
                              roleType: 'box_watcher',
                              boxNumber
                            });
                          }
                        }}
                        className="text-xs px-2 py-1 border border-gray-300 rounded"
                      >
                        <option value="">Assign to Box</option>
                        {Array.from({ length: 10 }, (_, i) => i + 1).map(boxNum => {
                          const isOccupied = assignedBoxWatchers.some(v => 
                            v.roles.some(role => 
                              role.type === 'box_watcher' && 
                              role.shift === shiftId && 
                              role.boxNumber === boxNum
                            )
                          );
                          return !isOccupied ? (
                            <option key={boxNum} value={boxNum}>Box {boxNum}</option>
                          ) : null;
                        })}
                      </select>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Keymen Section */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Keymen ({assignedKeymen.length}/3)
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Current Assignments */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">Current Assignments</h4>
                <div className="space-y-2">
                  {Array.from({ length: 3 }, (_, i) => {
                    const keymanNumber = i + 1;
                    const assignedKeyman = assignedKeymen[i];

                    return (
                      <div key={keymanNumber} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span className="font-medium">Keyman {keymanNumber}:</span>
                        {assignedKeyman ? (
                          <div className="flex items-center space-x-2">
                            <span className="text-sm">
                              {assignedKeyman.firstName} {assignedKeyman.lastName}
                            </span>
                            <button
                              onClick={() => onRemoveAssignment(assignedKeyman.id, 'shift', {
                                shiftId,
                                roleType: 'keyman'
                              })}
                              className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                            >
                              Remove
                            </button>
                          </div>
                        ) : (
                          <select
                            onChange={(e) => {
                              if (e.target.value) {
                                onDirectAssignment(e.target.value, 'shift', {
                                  shiftId,
                                  roleType: 'keyman'
                                });
                                e.target.value = '';
                              }
                            }}
                            className="text-sm px-2 py-1 border border-gray-300 rounded"
                          >
                            <option value="">Select Keyman</option>
                            {availableForKeyman.map(volunteer => (
                              <option key={volunteer.id} value={volunteer.id}>
                                {volunteer.firstName} {volunteer.lastName}
                              </option>
                            ))}
                          </select>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Available Keymen */}
              <div>
                <h4 className="font-medium text-gray-700 mb-3">
                  Available Keymen ({availableForKeyman.length})
                </h4>
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {availableForKeyman.map(volunteer => (
                    <div key={volunteer.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                      <span className="text-sm">
                        {volunteer.firstName} {volunteer.lastName}
                        <span className="ml-2 px-1 py-0.5 bg-blue-100 text-blue-700 rounded text-xs">
                          Bro
                        </span>
                      </span>
                      <button
                        onClick={() => onDirectAssignment(volunteer.id, 'shift', {
                          shiftId,
                          roleType: 'keyman'
                        })}
                        className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700"
                        disabled={assignedKeymen.length >= 3}
                      >
                        Assign as Keyman
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Money Counter Assignment Modal
function MoneyCounterAssignmentModal({
  sessionId,
  volunteers,
  moneyCountingSessions,
  onClose,
  onDirectAssignment,
  onRemoveAssignment
}: {
  sessionId: string;
  volunteers: Volunteer[];
  moneyCountingSessions: MoneyCountingSession[];
  onClose: () => void;
  onDirectAssignment: (volunteerId: string, type: string, details: any) => void;
  onRemoveAssignment: (volunteerId: string, type: string, details: any) => void;
}) {
  const session = moneyCountingSessions.find(s => s.id === sessionId);
  if (!session) return null;

  const assignedVolunteers = volunteers.filter(v => 
    session.assignedVolunteers.includes(v.id)
  );

  const availableVolunteers = volunteers.filter(v => 
    v.privileges.includes('money_counter') && 
    !session.assignedVolunteers.includes(v.id)
  );

  const brothersCount = assignedVolunteers.filter(v => v.gender === 'male').length;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">
              Assign Money Counters - {session.day} {session.time === 'lunch' ? 'Lunch' : 'After Afternoon'}
            </h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Requirements Status */}
          <div className="p-4 bg-purple-50 rounded-lg">
            <h3 className="font-medium text-purple-900 mb-2">Requirements Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center justify-between">
                <span>Total Volunteers:</span>
                <span className={`font-medium ${
                  assignedVolunteers.length >= session.requiredCount ? 'text-green-600' : 'text-red-600'
                }`}>
                  {assignedVolunteers.length}/{session.requiredCount}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span>Brothers Required:</span>
                <span className={`font-medium ${
                  brothersCount >= session.minimumBrothers ? 'text-green-600' : 'text-red-600'
                }`}>
                  {brothersCount}/{session.minimumBrothers}
                </span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Current Assignments */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Current Assignments ({assignedVolunteers.length})
              </h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {assignedVolunteers.map(volunteer => (
                  <div key={volunteer.id} className="flex items-center justify-between p-3 bg-purple-50 border border-purple-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">
                        {volunteer.firstName} {volunteer.lastName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        volunteer.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {volunteer.gender === 'male' ? 'Bro' : 'Sis'}
                      </span>
                    </div>
                    <button
                      onClick={() => onRemoveAssignment(volunteer.id, 'money_counter', { sessionId })}
                      className="text-xs px-2 py-1 bg-red-600 text-white rounded hover:bg-red-700"
                    >
                      Remove
                    </button>
                  </div>
                ))}
                
                {assignedVolunteers.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No volunteers assigned yet
                  </div>
                )}
              </div>
            </div>

            {/* Available Volunteers */}
            <div>
              <h3 className="font-medium text-gray-900 mb-3">
                Available Volunteers ({availableVolunteers.length})
              </h3>
              
              <div className="space-y-2 max-h-60 overflow-y-auto">
                {availableVolunteers.map(volunteer => (
                  <div key={volunteer.id} className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <span className="text-sm font-medium">
                        {volunteer.firstName} {volunteer.lastName}
                      </span>
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        volunteer.gender === 'male' ? 'bg-blue-100 text-blue-700' : 'bg-pink-100 text-pink-700'
                      }`}>
                        {volunteer.gender === 'male' ? 'Bro' : 'Sis'}
                      </span>
                    </div>
                    <button
                      onClick={() => onDirectAssignment(volunteer.id, 'money_counter', { sessionId })}
                      className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
                      disabled={assignedVolunteers.length >= session.requiredCount}
                    >
                      Assign
                    </button>
                  </div>
                ))}
                
                {availableVolunteers.length === 0 && (
                  <div className="text-center py-4 text-gray-500 text-sm">
                    No available volunteers
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// Volunteer Management Component (unchanged)
function VolunteerManagement({
  volunteers,
  editingVolunteer,
  onAddVolunteer,
  onEditVolunteer,
  onSaveVolunteer,
  onDeleteVolunteer,
  onCancelEdit
}: {
  volunteers: Volunteer[];
  editingVolunteer: Volunteer | null;
  onAddVolunteer: () => void;
  onEditVolunteer: (volunteer: Volunteer) => void;
  onSaveVolunteer: (volunteer: Volunteer) => void;
  onDeleteVolunteer: (id: string) => void;
  onCancelEdit: () => void;
}) {
  const [formData, setFormData] = useState<Volunteer | null>(null);

  React.useEffect(() => {
    setFormData(editingVolunteer);
  }, [editingVolunteer]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData) {
      onSaveVolunteer(formData);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add/Edit Form */}
      {editingVolunteer && formData && (
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            {editingVolunteer.id ? 'Edit Volunteer' : 'Add New Volunteer'}
          </h3>
          
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gender *
              </label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500"
              >
                <option value="male">Brother</option>
                <option value="female">Sister</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Allowed Privileges
              </label>
              <div className="space-y-2">
                {(['box_watcher', 'money_counter', 'keyman'] as const).map(privilege => (
                  <label key={privilege} className="flex items-center">
                    <input
                      type="checkbox"
                      checked={formData.privileges.includes(privilege)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setFormData({
                            ...formData,
                            privileges: [...formData.privileges, privilege]
                          });
                        } else {
                          setFormData({
                            ...formData,
                            privileges: formData.privileges.filter(p => p !== privilege)
                          });
                        }
                      }}
                      disabled={privilege === 'keyman' && formData.gender !== 'male'}
                      className="mr-2"
                    />
                    <span className={`capitalize ${privilege === 'keyman' && formData.gender !== 'male' ? 'text-gray-400' : ''}`}>
                      {privilege.replace('_', ' ')}
                      {privilege === 'keyman' && formData.gender !== 'male' && ' (Brothers only)'}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                <Save className="w-4 h-4 inline mr-2" />
                Save Volunteer
              </button>
              <button
                type="button"
                onClick={onCancelEdit}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Volunteers List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Volunteers ({volunteers.length})
          </h3>
          <button
            onClick={onAddVolunteer}
            className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
          >
            <Plus className="w-4 h-4 inline mr-2" />
            Add Volunteer
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-700">Name</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Gender</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Privileges</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Assignments</th>
                <th className="text-left py-3 px-4 font-medium text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {volunteers.map(volunteer => (
                <tr key={volunteer.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="py-3 px-4">
                    <div className="font-medium text-gray-900">
                      {volunteer.firstName} {volunteer.lastName}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      volunteer.gender === 'male' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex flex-wrap gap-1">
                      {volunteer.privileges.map(privilege => (
                        <span
                          key={privilege}
                          className="px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs capitalize"
                        >
                          {privilege.replace('_', ' ')}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="text-sm text-gray-600">
                      {volunteer.roles.length} assignment{volunteer.roles.length !== 1 ? 's' : ''}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => onEditVolunteer(volunteer)}
                        className="p-1 text-blue-600 hover:bg-blue-100 rounded"
                      >
                        <Edit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => onDeleteVolunteer(volunteer.id)}
                        className="p-1 text-red-600 hover:bg-red-100 rounded"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

// Conflict Management Component (unchanged)
function ConflictManagement({
  conflicts,
  volunteers
}: {
  conflicts: ScheduleConflict[];
  volunteers: Volunteer[];
}) {
  const getConflictIcon = (type: string) => {
    switch (type) {
      case 'time_overlap':
        return <Clock className="w-5 h-5 text-red-500" />;
      case 'gender_restriction':
        return <UserCheck className="w-5 h-5 text-orange-500" />;
      case 'insufficient_keymen':
        return <Users className="w-5 h-5 text-yellow-500" />;
      default:
        return <AlertTriangle className="w-5 h-5 text-red-500" />;
    }
  };

  const getConflictColor = (type: string) => {
    switch (type) {
      case 'time_overlap':
        return 'bg-red-50 border-red-200';
      case 'gender_restriction':
        return 'bg-orange-50 border-orange-200';
      case 'insufficient_keymen':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-red-50 border-red-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        Schedule Conflicts ({conflicts.length})
      </h3>

      {conflicts.length === 0 ? (
        <div className="text-center py-8">
          <CheckCircle className="w-12 h-12 text-green-500 mx-auto mb-3" />
          <p className="text-gray-600">No scheduling conflicts detected!</p>
        </div>
      ) : (
        <div className="space-y-3">
          {conflicts.map((conflict, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${getConflictColor(conflict.conflictType)}`}
            >
              <div className="flex items-start space-x-3">
                {getConflictIcon(conflict.conflictType)}
                <div className="flex-1">
                  <h4 className="font-medium text-gray-900">
                    {conflict.volunteerName}
                  </h4>
                  <p className="text-sm text-gray-600 mt-1">
                    {conflict.message}
                  </p>
                  {conflict.shifts.length > 0 && (
                    <div className="mt-2">
                      <span className="text-xs text-gray-500">
                        Affected shifts: {conflict.shifts.join(', ')}
                      </span>
                    </div>
                  )}
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
                  conflict.conflictType === 'time_overlap' ? 'bg-red-100 text-red-800' :
                  conflict.conflictType === 'gender_restriction' ? 'bg-orange-100 text-orange-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {conflict.conflictType.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}