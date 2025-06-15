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
  Package
} from 'lucide-react';
import { ShiftAssignmentPanel } from './ShiftAssignmentPanel';

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
  const [activeTab, setActiveTab] = useState<'volunteers' | 'scheduling' | 'conflicts' | 'shifts'>('volunteers');
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [conflicts, setConflicts] = useState<ScheduleConflict[]>([]);
  const [showShiftAssignment, setShowShiftAssignment] = useState(false);
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

  const handleAssignToMoneyCounter = (volunteerId: string, sessionId: string) => {
    const session = moneyCountingSessions.find(s => s.id === sessionId);
    if (!session) return;

    // Update volunteer roles
    const updatedVolunteers = volunteers.map(volunteer => {
      if (volunteer.id === volunteerId) {
        const newRole = {
          type: 'money_counter' as const,
          status: 'assigned' as const,
          day: session.day,
          location: 'Counting Table',
          time: session.time
        };

        return {
          ...volunteer,
          roles: [...volunteer.roles, newRole]
        };
      }
      return volunteer;
    });

    // Update money counting session
    const updatedSessions = moneyCountingSessions.map(s => 
      s.id === sessionId 
        ? { ...s, assignedVolunteers: [...s.assignedVolunteers, volunteerId] }
        : s
    );

    onVolunteersUpdate(updatedVolunteers);
    setMoneyCountingSessions(updatedSessions);
    checkScheduleConflicts();
  };

  const handleRemoveFromMoneyCounter = (volunteerId: string, sessionId: string) => {
    // Update volunteer roles
    const updatedVolunteers = volunteers.map(volunteer => {
      if (volunteer.id === volunteerId) {
        return {
          ...volunteer,
          roles: volunteer.roles.filter(role => 
            !(role.type === 'money_counter' && role.day === moneyCountingSessions.find(s => s.id === sessionId)?.day && 
              role.time === moneyCountingSessions.find(s => s.id === sessionId)?.time)
          )
        };
      }
      return volunteer;
    });

    // Update money counting session
    const updatedSessions = moneyCountingSessions.map(s => 
      s.id === sessionId 
        ? { ...s, assignedVolunteers: s.assignedVolunteers.filter(id => id !== volunteerId) }
        : s
    );

    onVolunteersUpdate(updatedVolunteers);
    setMoneyCountingSessions(updatedSessions);
    checkScheduleConflicts();
  };

  React.useEffect(() => {
    checkScheduleConflicts();
  }, [checkScheduleConflicts]);

  return (
    <>
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
                onClick={() => setActiveTab('shifts')}
                className={`px-6 py-3 font-medium text-sm ${
                  activeTab === 'shifts'
                    ? 'border-b-2 border-teal-500 text-teal-600'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <Package className="w-4 h-4 inline mr-2" />
                Shift Assignments
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
                Money Counting
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

          {activeTab === 'shifts' && (
            <ShiftManagement
              volunteers={volunteers}
              shifts={shifts}
              onShowShiftAssignment={() => setShowShiftAssignment(true)}
            />
          )}

          {activeTab === 'scheduling' && (
            <SchedulingManagement
              volunteers={volunteers}
              shifts={shifts}
              moneyCountingSessions={moneyCountingSessions}
              onAssignToMoneyCounter={handleAssignToMoneyCounter}
              onRemoveFromMoneyCounter={handleRemoveFromMoneyCounter}
              onUpdateMoneyCountingSessions={setMoneyCountingSessions}
            />
          )}

          {activeTab === 'conflicts' && (
            <ConflictManagement conflicts={conflicts} volunteers={volunteers} />
          )}
        </div>
      </div>

      {/* Shift Assignment Panel */}
      {showShiftAssignment && (
        <ShiftAssignmentPanel
          volunteers={volunteers}
          shifts={shifts}
          onVolunteersUpdate={onVolunteersUpdate}
          onClose={() => setShowShiftAssignment(false)}
        />
      )}
    </>
  );
}

// Shift Management Component
function ShiftManagement({
  volunteers,
  shifts,
  onShowShiftAssignment
}: {
  volunteers: Volunteer[];
  shifts: Shift[];
  onShowShiftAssignment: () => void;
}) {
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

  const getShiftAssignments = (shiftId: number) => {
    const boxWatchers = volunteers.filter(v => 
      v.roles.some(role => role.type === 'box_watcher' && role.shift === shiftId)
    );
    const keymen = volunteers.filter(v => 
      v.roles.some(role => role.type === 'keyman' && role.shift === shiftId)
    );

    return { boxWatchers, keymen };
  };

  const shiftsByDay = getShiftsByDay();
  const days = ['Friday', 'Saturday', 'Sunday'];

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-50 border-blue-200';
      case 'Saturday': return 'bg-green-50 border-green-200';
      case 'Sunday': return 'bg-orange-50 border-orange-200';
      default: return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Quick Assignment Button */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Shift Assignment Center</h3>
            <p className="text-gray-600">Assign publishers to shifts and boxes quickly and efficiently</p>
          </div>
          <button
            onClick={onShowShiftAssignment}
            className="px-6 py-3 bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700 text-white rounded-lg font-medium transition-all duration-200 transform hover:scale-105 shadow-lg"
          >
            <Package className="w-5 h-5 inline mr-2" />
            Open Assignment Center
          </button>
        </div>
      </div>

      {/* Shift Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-6">Shift Assignment Overview</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {days.map(day => (
            <div key={day} className="space-y-4">
              <div className={`p-4 rounded-lg border ${getDayColor(day)}`}>
                <h4 className={`font-semibold text-lg ${
                  day === 'Friday' ? 'text-blue-900' :
                  day === 'Saturday' ? 'text-green-900' :
                  'text-orange-900'
                }`}>{day}</h4>
              </div>

              <div className="space-y-3">
                {shiftsByDay[day]?.map(shift => {
                  const { boxWatchers, keymen } = getShiftAssignments(shift.id);
                  const isComplete = boxWatchers.length === 10 && keymen.length === 3;
                  
                  return (
                    <div
                      key={shift.id}
                      className={`p-4 rounded-lg border transition-all ${
                        isComplete
                          ? 'border-green-200 bg-green-50'
                          : 'border-yellow-200 bg-yellow-50'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-3">
                        <h5 className="font-medium text-gray-900">Shift {shift.id}</h5>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          isComplete ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {isComplete ? 'Complete' : 'Incomplete'}
                        </span>
                      </div>
                      
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Box Watchers:</span>
                          <span className={boxWatchers.length === 10 ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                            {boxWatchers.length}/10
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span>Keymen:</span>
                          <span className={keymen.length === 3 ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>
                            {keymen.length}/3
                          </span>
                        </div>
                        <div className="text-xs text-gray-500 mt-2">
                          {shift.startTime} - {shift.endTime}
                        </div>
                      </div>

                      {/* Progress bars */}
                      <div className="mt-3 space-y-2">
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Box Watchers</span>
                            <span>{boxWatchers.length}/10</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                boxWatchers.length === 10 ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${(boxWatchers.length / 10) * 100}%` }}
                            ></div>
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex justify-between text-xs text-gray-600 mb-1">
                            <span>Keymen</span>
                            <span>{keymen.length}/3</span>
                          </div>
                          <div className="w-full bg-gray-200 rounded-full h-2">
                            <div 
                              className={`h-2 rounded-full transition-all ${
                                keymen.length === 3 ? 'bg-green-500' : 'bg-yellow-500'
                              }`}
                              style={{ width: `${(keymen.length / 3) * 100}%` }}
                            ></div>
                          </div>
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

// Volunteer Management Component (existing - no changes)
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

// Scheduling Management Component (existing - no changes)
function SchedulingManagement({
  volunteers,
  shifts,
  moneyCountingSessions,
  onAssignToMoneyCounter,
  onRemoveFromMoneyCounter,
  onUpdateMoneyCountingSessions
}: {
  volunteers: Volunteer[];
  shifts: Shift[];
  moneyCountingSessions: MoneyCountingSession[];
  onAssignToMoneyCounter: (volunteerId: string, sessionId: string) => void;
  onRemoveFromMoneyCounter: (volunteerId: string, sessionId: string) => void;
  onUpdateMoneyCountingSessions: (sessions: MoneyCountingSession[]) => void;
}) {
  const [selectedMoneySession, setSelectedMoneySession] = useState<string | null>(null);

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

  const sessionsByDay = getMoneySessionsByDay();
  const days = ['Friday', 'Saturday', 'Sunday'];

  const getDayColor = (day: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'Saturday': return 'bg-green-100 text-green-800 border-green-200';
      case 'Sunday': return 'bg-orange-100 text-orange-800 border-orange-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <div className="space-y-6">
      {/* Money Counting Overview */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Money Counting Sessions</h3>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {days.map(day => (
            <div key={day} className="space-y-4">
              <div className={`p-4 rounded-lg border ${getDayColor(day)}`}>
                <h4 className="font-semibold text-lg">{day}</h4>
              </div>

              <div className="space-y-3">
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
                      className={`p-3 rounded-lg border cursor-pointer transition-all ${
                        isComplete
                          ? 'border-green-200 bg-green-50'
                          : 'border-yellow-200 bg-yellow-50'
                      } ${selectedMoneySession === session.id ? 'ring-2 ring-purple-500' : ''}`}
                      onClick={() => setSelectedMoneySession(session.id)}
                    >
                      <div className="flex items-center justify-between mb-1">
                        <h6 className="font-medium text-gray-900 text-sm">
                          {session.time === 'lunch' ? 'Lunch Time' : 'After Afternoon'}
                        </h6>
                        <DollarSign className="w-4 h-4 text-purple-600" />
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

      {/* Money Counting Detail View */}
      {selectedMoneySession && (
        <MoneyCountingDetailView
          session={moneyCountingSessions.find(s => s.id === selectedMoneySession)!}
          volunteers={volunteers}
          onAssignToMoneyCounter={onAssignToMoneyCounter}
          onRemoveFromMoneyCounter={onRemoveFromMoneyCounter}
        />
      )}
    </div>
  );
}

// Money Counting Detail View Component (existing - no changes)
function MoneyCountingDetailView({
  session,
  volunteers,
  onAssignToMoneyCounter,
  onRemoveFromMoneyCounter
}: {
  session: MoneyCountingSession;
  volunteers: Volunteer[];
  onAssignToMoneyCounter: (volunteerId: string, sessionId: string) => void;
  onRemoveFromMoneyCounter: (volunteerId: string, sessionId: string) => void;
}) {
  const assignedVolunteers = volunteers.filter(v => 
    session.assignedVolunteers.includes(v.id)
  );

  const getAvailableVolunteers = () => {
    return volunteers.filter(v => {
      // Must have money_counter privilege
      if (!v.privileges.includes('money_counter')) return false;
      
      // Must not already be assigned to this session
      if (session.assignedVolunteers.includes(v.id)) return false;
      
      // Check for shift conflicts
      const hasConflictingShift = v.roles.some(role => {
        if (!role.shift || role.day !== session.day) return false;
        
        // Lunch time conflicts (shifts 2 and 3)
        if (session.time === 'lunch') {
          const conflictingShifts = session.day === 'Friday' ? [2, 3] :
                                   session.day === 'Saturday' ? [6, 7] :
                                   [10, 11];
          return conflictingShifts.includes(role.shift);
        }
        
        // After afternoon conflicts (shift 4)
        if (session.time === 'after_afternoon') {
          const conflictingShift = session.day === 'Friday' ? 4 :
                                  session.day === 'Saturday' ? 8 :
                                  12;
          return role.shift === conflictingShift;
        }
        
        return false;
      });
      
      return !hasConflictingShift;
    });
  };

  const availableVolunteers = getAvailableVolunteers();
  const brothersCount = assignedVolunteers.filter(v => v.gender === 'male').length;
  const sistersCount = assignedVolunteers.filter(v => v.gender === 'female').length;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <DollarSign className="w-5 h-5 mr-2 text-purple-600" />
        {session.day} - {session.time === 'lunch' ? 'Lunch Time' : 'After Afternoon Session'} Money Counting
      </h3>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Current Assignments */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-medium text-gray-900">Current Assignments</h4>
            <div className="text-sm text-gray-600">
              {assignedVolunteers.length}/{session.requiredCount} volunteers
              ({brothersCount}/{session.minimumBrothers} brothers required)
            </div>
          </div>
          
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
                  onClick={() => onRemoveFromMoneyCounter(volunteer.id, session.id)}
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
          <h4 className="font-medium text-gray-900 mb-3">
            Available Volunteers ({availableVolunteers.length})
          </h4>
          
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
                  onClick={() => onAssignToMoneyCounter(volunteer.id, session.id)}
                  className="text-xs px-2 py-1 bg-purple-600 text-white rounded hover:bg-purple-700"
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

      {/* Requirements Status */}
      <div className="mt-4 p-4 bg-gray-50 rounded-lg">
        <h5 className="font-medium text-gray-900 mb-2">Requirements Status</h5>
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center justify-between">
            <span>Total Volunteers:</span>
            <span className={`font-medium ${
              assignedVolunteers.length >= session.requiredCount ? 'text-green-600' : 'text-red-600'
            }`}>
              {assignedVolunteers.length}/{session.requiredCount}
              {assignedVolunteers.length >= session.requiredCount && <CheckCircle className="w-4 h-4 inline ml-1" />}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span>Brothers Required:</span>
            <span className={`font-medium ${
              brothersCount >= session.minimumBrothers ? 'text-green-600' : 'text-red-600'
            }`}>
              {brothersCount}/{session.minimumBrothers}
              {brothersCount >= session.minimumBrothers && <CheckCircle className="w-4 h-4 inline ml-1" />}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

// Conflict Management Component (existing - no changes)
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