import React, { useState, useCallback, useEffect } from 'react';
import { Volunteer, Shift, MoneyCountingSession } from '../types';
import { ShiftAssignmentPanel } from './ShiftAssignmentPanel';
import { 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Save, 
  X, 
  ArrowLeft, 
  Calendar,
  Package,
  Key,
  DollarSign,
  AlertTriangle,
  CheckCircle,
  Clock,
  Database,
  RefreshCw,
  Search,
  Filter
} from 'lucide-react';

interface AdminPanelProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  onVolunteersUpdate: (volunteers: Volunteer[]) => void;
  onShiftsUpdate: (shifts: Shift[]) => void;
  onBackToMain: () => void;
  isOnline: boolean;
  lastSynced: Date | null;
}

export function AdminPanel({ 
  volunteers, 
  shifts, 
  onVolunteersUpdate, 
  onShiftsUpdate, 
  onBackToMain,
  isOnline,
  lastSynced
}: AdminPanelProps) {
  const [activeTab, setActiveTab] = useState<'volunteers' | 'assignments' | 'money_counting'>('volunteers');
  const [showAssignmentPanel, setShowAssignmentPanel] = useState(false);
  const [editingVolunteer, setEditingVolunteer] = useState<Volunteer | null>(null);
  const [showAddVolunteer, setShowAddVolunteer] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterGender, setFilterGender] = useState<'all' | 'male' | 'female'>('all');
  const [isLoading, setIsLoading] = useState(false);
  const [lastAction, setLastAction] = useState<string>('');

  // Money counting sessions
  const [moneyCountingSessions] = useState<MoneyCountingSession[]>([
    {
      id: 'friday-lunch',
      day: 'Friday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 4,
      minimumBrothers: 2
    },
    {
      id: 'friday-afternoon',
      day: 'Friday', 
      time: 'after_afternoon',
      timeLabel: 'After Afternoon Session',
      assignedVolunteers: [],
      requiredCount: 4,
      minimumBrothers: 2
    },
    {
      id: 'saturday-lunch',
      day: 'Saturday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 4,
      minimumBrothers: 2
    },
    {
      id: 'saturday-afternoon',
      day: 'Saturday',
      time: 'after_afternoon', 
      timeLabel: 'After Afternoon Session',
      assignedVolunteers: [],
      requiredCount: 4,
      minimumBrothers: 2
    },
    {
      id: 'sunday-lunch',
      day: 'Sunday',
      time: 'lunch',
      timeLabel: 'Lunch Break',
      assignedVolunteers: [],
      requiredCount: 4,
      minimumBrothers: 2
    },
    {
      id: 'sunday-afternoon',
      day: 'Sunday',
      time: 'after_afternoon',
      timeLabel: 'After Afternoon Session', 
      assignedVolunteers: [],
      requiredCount: 4,
      minimumBrothers: 2
    }
  ]);

  // Log action for debugging
  const logAction = useCallback((action: string, data?: any) => {
    const timestamp = new Date().toISOString();
    const logEntry = `[${timestamp}] ${action}`;
    console.log(logEntry, data);
    setLastAction(`${action} at ${new Date().toLocaleTimeString()}`);
  }, []);

  // Scheduling conflict detection
  const hasSchedulingConflict = useCallback((volunteer: Volunteer, newRole: any) => {
    // Check if volunteer already has assignments on the same day
    const existingRolesOnDay = volunteer.roles.filter(role => role.day === newRole.day);
    
    if (existingRolesOnDay.length >= 2) {
      return {
        hasConflict: true,
        reason: `Already has 2 assignments on ${newRole.day} (maximum allowed)`
      };
    }

    // Check for compatible shift combinations (1↔3, 2↔4)
    if (existingRolesOnDay.length === 1) {
      const existingShift = existingRolesOnDay[0].shift;
      const newShift = newRole.shift;
      
      if (existingShift && newShift) {
        const isCompatible = 
          (existingShift === 1 && newShift === 3) ||
          (existingShift === 3 && newShift === 1) ||
          (existingShift === 2 && newShift === 4) ||
          (existingShift === 4 && newShift === 2) ||
          // Same logic for other days (shifts 5-8, 9-12)
          (existingShift === 5 && newShift === 7) ||
          (existingShift === 7 && newShift === 5) ||
          (existingShift === 6 && newShift === 8) ||
          (existingShift === 8 && newShift === 6) ||
          (existingShift === 9 && newShift === 11) ||
          (existingShift === 11 && newShift === 9) ||
          (existingShift === 10 && newShift === 12) ||
          (existingShift === 12 && newShift === 10);

        if (!isCompatible) {
          return {
            hasConflict: true,
            reason: `Incompatible shift combination. Compatible pairs: 1↔3, 2↔4`
          };
        }
      }
    }

    // Check gender restrictions for keymen
    if (newRole.type === 'keyman' && volunteer.gender !== 'male') {
      return {
        hasConflict: true,
        reason: 'Keyman role requires a brother (male volunteer)'
      };
    }

    return { hasConflict: false, reason: '' };
  }, []);

  // Filter volunteers based on search and gender
  const filteredVolunteers = volunteers.filter(volunteer => {
    const matchesSearch = searchTerm === '' || 
      `${volunteer.firstName} ${volunteer.lastName}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesGender = filterGender === 'all' || volunteer.gender === filterGender;
    return matchesSearch && matchesGender;
  });

  // Handle volunteer deletion with proper persistence
  const handleDeleteVolunteer = async (volunteerId: string) => {
    const volunteer = volunteers.find(v => v.id === volunteerId);
    if (!volunteer) return;

    const confirmDelete = window.confirm(
      `Are you sure you want to delete ${volunteer.firstName} ${volunteer.lastName}? This action cannot be undone.`
    );

    if (!confirmDelete) return;

    try {
      setIsLoading(true);
      logAction('DELETING_VOLUNTEER', { volunteerId, volunteerName: `${volunteer.firstName} ${volunteer.lastName}` });

      // Remove volunteer from the list
      const updatedVolunteers = volunteers.filter(v => v.id !== volunteerId);
      
      // Update the database through the parent component
      await onVolunteersUpdate(updatedVolunteers);
      
      logAction('VOLUNTEER_DELETED_SUCCESS', { volunteerId, remainingCount: updatedVolunteers.length });
      
      // Clear any editing state
      if (editingVolunteer?.id === volunteerId) {
        setEditingVolunteer(null);
      }

    } catch (error) {
      console.error('Error deleting volunteer:', error);
      logAction('VOLUNTEER_DELETE_ERROR', { volunteerId, error: error.message });
      alert('Failed to delete volunteer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle volunteer edit with proper persistence
  const handleSaveVolunteer = async (updatedVolunteer: Volunteer) => {
    try {
      setIsLoading(true);
      logAction('SAVING_VOLUNTEER', { volunteerId: updatedVolunteer.id, volunteerName: `${updatedVolunteer.firstName} ${updatedVolunteer.lastName}` });

      const updatedVolunteers = volunteers.map(v => 
        v.id === updatedVolunteer.id ? updatedVolunteer : v
      );

      // Update the database through the parent component
      await onVolunteersUpdate(updatedVolunteers);
      
      logAction('VOLUNTEER_SAVED_SUCCESS', { volunteerId: updatedVolunteer.id });
      setEditingVolunteer(null);

    } catch (error) {
      console.error('Error saving volunteer:', error);
      logAction('VOLUNTEER_SAVE_ERROR', { volunteerId: updatedVolunteer.id, error: error.message });
      alert('Failed to save volunteer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle adding new volunteer
  const handleAddVolunteer = async (newVolunteer: Omit<Volunteer, 'id'>) => {
    try {
      setIsLoading(true);
      const volunteerId = `volunteer_${Date.now()}`;
      logAction('ADDING_VOLUNTEER', { volunteerId, volunteerName: `${newVolunteer.firstName} ${newVolunteer.lastName}` });

      const volunteerWithId: Volunteer = {
        ...newVolunteer,
        id: volunteerId
      };

      const updatedVolunteers = [...volunteers, volunteerWithId];
      
      // Update the database through the parent component
      await onVolunteersUpdate(updatedVolunteers);
      
      logAction('VOLUNTEER_ADDED_SUCCESS', { volunteerId, totalCount: updatedVolunteers.length });
      setShowAddVolunteer(false);

    } catch (error) {
      console.error('Error adding volunteer:', error);
      logAction('VOLUNTEER_ADD_ERROR', { error: error.message });
      alert('Failed to add volunteer. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle money counting assignment
  const handleMoneyCountingAssignment = async (sessionId: string, volunteerId: string, action: 'add' | 'remove') => {
    try {
      setIsLoading(true);
      const volunteer = volunteers.find(v => v.id === volunteerId);
      const session = moneyCountingSessions.find(s => s.id === sessionId);
      
      if (!volunteer || !session) return;

      logAction('MONEY_COUNTING_ASSIGNMENT', { 
        sessionId, 
        volunteerId, 
        action, 
        volunteerName: `${volunteer.firstName} ${volunteer.lastName}`,
        sessionLabel: `${session.day} ${session.timeLabel}`
      });

      const updatedVolunteers = volunteers.map(v => {
        if (v.id === volunteerId) {
          let updatedRoles = [...v.roles];
          
          if (action === 'add') {
            // Remove any existing money counting role for this session
            updatedRoles = updatedRoles.filter(role => 
              !(role.type === 'money_counter' && role.day === session.day && role.time === session.time)
            );
            
            // Add new money counting role
            updatedRoles.push({
              type: 'money_counter',
              status: 'assigned',
              day: session.day,
              time: session.time,
              timeLabel: session.timeLabel,
              location: 'Counting Table'
            });
          } else {
            // Remove money counting role for this session
            updatedRoles = updatedRoles.filter(role => 
              !(role.type === 'money_counter' && role.day === session.day && role.time === session.time)
            );
          }
          
          return { ...v, roles: updatedRoles };
        }
        return v;
      });

      // Update the database through the parent component
      await onVolunteersUpdate(updatedVolunteers);
      
      logAction('MONEY_COUNTING_ASSIGNMENT_SUCCESS', { sessionId, volunteerId, action });

    } catch (error) {
      console.error('Error updating money counting assignment:', error);
      logAction('MONEY_COUNTING_ASSIGNMENT_ERROR', { sessionId, volunteerId, action, error: error.message });
      alert('Failed to update assignment. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Get volunteers assigned to money counting session
  const getSessionVolunteers = (session: MoneyCountingSession) => {
    return volunteers.filter(v => 
      v.roles.some(role => 
        role.type === 'money_counter' && 
        role.day === session.day && 
        role.time === session.time
      )
    );
  };

  // Get available volunteers for money counting
  const getAvailableMoneyCounters = (session: MoneyCountingSession) => {
    return volunteers.filter(v => {
      // Must have money_counter privilege
      if (!v.privileges.includes('money_counter')) return false;
      
      // Must not already be assigned to this session
      const alreadyAssigned = v.roles.some(role => 
        role.type === 'money_counter' && 
        role.day === session.day && 
        role.time === session.time
      );
      
      return !alreadyAssigned;
    });
  };

  // Debug information
  useEffect(() => {
    logAction('ADMIN_PANEL_MOUNTED', { 
      volunteerCount: volunteers.length,
      isOnline,
      lastSynced: lastSynced?.toISOString()
    });
  }, []);

  useEffect(() => {
    logAction('VOLUNTEERS_DATA_CHANGED', { 
      count: volunteers.length,
      volunteers: volunteers.map(v => ({ id: v.id, name: `${v.firstName} ${v.lastName}`, rolesCount: v.roles.length }))
    });
  }, [volunteers]);

  if (showAssignmentPanel) {
    return (
      <ShiftAssignmentPanel
        volunteers={volunteers}
        shifts={shifts}
        onVolunteersUpdate={onVolunteersUpdate}
        onClose={() => setShowAssignmentPanel(false)}
        hasSchedulingConflict={hasSchedulingConflict}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button
                onClick={onBackToMain}
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Dashboard</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <h1 className="text-2xl font-bold text-gray-900">Admin Control Panel</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Connection Status */}
              <div className={`flex items-center space-x-2 px-3 py-1 rounded-full text-sm ${
                isOnline 
                  ? 'bg-green-100 text-green-800' 
                  : 'bg-red-100 text-red-800'
              }`}>
                <Database className="w-4 h-4" />
                <span>{isOnline ? 'Connected' : 'Offline'}</span>
              </div>
              
              {/* Last Action */}
              {lastAction && (
                <div className="text-xs text-gray-500">
                  Last: {lastAction}
                </div>
              )}
              
              {/* Loading Indicator */}
              {isLoading && (
                <div className="flex items-center space-x-2 text-blue-600">
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Processing...</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <nav className="flex space-x-8">
            <button
              onClick={() => setActiveTab('volunteers')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'volunteers'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Users className="w-4 h-4 inline mr-2" />
              Volunteer Management
            </button>
            <button
              onClick={() => setActiveTab('assignments')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'assignments'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Calendar className="w-4 h-4 inline mr-2" />
              Shift Assignments
            </button>
            <button
              onClick={() => setActiveTab('money_counting')}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === 'money_counting'
                  ? 'border-teal-500 text-teal-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DollarSign className="w-4 h-4 inline mr-2" />
              Money Counting
            </button>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        {/* Volunteer Management Tab */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            {/* Controls */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
              <div className="flex items-center space-x-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="text"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    placeholder="Search volunteers..."
                    className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                  />
                </div>
                
                <select
                  value={filterGender}
                  onChange={(e) => setFilterGender(e.target.value as any)}
                  className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
                >
                  <option value="all">All Genders</option>
                  <option value="male">Brothers</option>
                  <option value="female">Sisters</option>
                </select>
              </div>
              
              <button
                onClick={() => setShowAddVolunteer(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Plus className="w-4 h-4" />
                <span>Add Volunteer</span>
              </button>
            </div>

            {/* Volunteers List */}
            <div className="bg-white rounded-lg shadow border border-gray-200">
              <div className="px-6 py-4 border-b border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900">
                  Volunteers ({filteredVolunteers.length})
                </h3>
              </div>
              
              <div className="divide-y divide-gray-200">
                {filteredVolunteers.map(volunteer => (
                  <VolunteerRow
                    key={volunteer.id}
                    volunteer={volunteer}
                    isEditing={editingVolunteer?.id === volunteer.id}
                    onEdit={() => setEditingVolunteer(volunteer)}
                    onSave={handleSaveVolunteer}
                    onCancel={() => setEditingVolunteer(null)}
                    onDelete={() => handleDeleteVolunteer(volunteer.id)}
                    isLoading={isLoading}
                  />
                ))}
                
                {filteredVolunteers.length === 0 && (
                  <div className="px-6 py-12 text-center">
                    <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">No volunteers found</h3>
                    <p className="text-gray-600">
                      {searchTerm || filterGender !== 'all' 
                        ? 'Try adjusting your search or filter criteria.'
                        : 'Get started by adding your first volunteer.'
                      }
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Shift Assignments Tab */}
        {activeTab === 'assignments' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Shift Assignment Management</h2>
              <button
                onClick={() => setShowAssignmentPanel(true)}
                className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors"
              >
                <Calendar className="w-4 h-4" />
                <span>Open Assignment Center</span>
              </button>
            </div>
            
            <AssignmentOverview volunteers={volunteers} shifts={shifts} />
          </div>
        )}

        {/* Money Counting Tab */}
        {activeTab === 'money_counting' && (
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-gray-900">Money Counting Sessions</h2>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {moneyCountingSessions.map(session => (
                <MoneyCountingSessionCard
                  key={session.id}
                  session={session}
                  assignedVolunteers={getSessionVolunteers(session)}
                  availableVolunteers={getAvailableMoneyCounters(session)}
                  onAssign={(volunteerId) => handleMoneyCountingAssignment(session.id, volunteerId, 'add')}
                  onRemove={(volunteerId) => handleMoneyCountingAssignment(session.id, volunteerId, 'remove')}
                  isLoading={isLoading}
                />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Add Volunteer Modal */}
      {showAddVolunteer && (
        <AddVolunteerModal
          onSave={handleAddVolunteer}
          onCancel={() => setShowAddVolunteer(false)}
          isLoading={isLoading}
        />
      )}
    </div>
  );
}

// Volunteer Row Component
interface VolunteerRowProps {
  volunteer: Volunteer;
  isEditing: boolean;
  onEdit: () => void;
  onSave: (volunteer: Volunteer) => void;
  onCancel: () => void;
  onDelete: () => void;
  isLoading: boolean;
}

function VolunteerRow({ volunteer, isEditing, onEdit, onSave, onCancel, onDelete, isLoading }: VolunteerRowProps) {
  const [editData, setEditData] = useState(volunteer);

  useEffect(() => {
    setEditData(volunteer);
  }, [volunteer]);

  const handleSave = () => {
    onSave(editData);
  };

  if (isEditing) {
    return (
      <div className="px-6 py-4 bg-blue-50">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={editData.firstName}
              onChange={(e) => setEditData({ ...editData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={editData.lastName}
              onChange={(e) => setEditData({ ...editData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={editData.gender}
              onChange={(e) => setEditData({ ...editData, gender: e.target.value as 'male' | 'female' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="male">Brother</option>
              <option value="female">Sister</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Privileges</label>
            <div className="space-y-1">
              {['box_watcher', 'keyman', 'money_counter'].map(privilege => (
                <label key={privilege} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={editData.privileges.includes(privilege as any)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setEditData({
                          ...editData,
                          privileges: [...editData.privileges, privilege as any]
                        });
                      } else {
                        setEditData({
                          ...editData,
                          privileges: editData.privileges.filter(p => p !== privilege)
                        });
                      }
                    }}
                    className="mr-2"
                    disabled={privilege === 'keyman' && editData.gender === 'female'}
                  />
                  <span className="text-sm capitalize">{privilege.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2 mt-4">
          <button
            onClick={handleSave}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            <span>Save</span>
          </button>
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex items-center space-x-1 px-3 py-1 bg-gray-600 text-white rounded hover:bg-gray-700 disabled:opacity-50"
          >
            <X className="w-4 h-4" />
            <span>Cancel</span>
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-4 hover:bg-gray-50">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold text-sm">
              {volunteer.firstName[0]}{volunteer.lastName[0]}
            </span>
          </div>
          
          <div>
            <h4 className="font-semibold text-gray-900">
              {volunteer.firstName} {volunteer.lastName}
            </h4>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                volunteer.gender === 'male' 
                  ? 'bg-blue-100 text-blue-800' 
                  : 'bg-pink-100 text-pink-800'
              }`}>
                {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
              </span>
              <span>•</span>
              <span>{volunteer.roles.length} assignment{volunteer.roles.length !== 1 ? 's' : ''}</span>
              <span>•</span>
              <span>{volunteer.privileges.length} privilege{volunteer.privileges.length !== 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onEdit}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded disabled:opacity-50"
          >
            <Edit className="w-4 h-4" />
          </button>
          <button
            onClick={onDelete}
            disabled={isLoading}
            className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded disabled:opacity-50"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Add Volunteer Modal Component
interface AddVolunteerModalProps {
  onSave: (volunteer: Omit<Volunteer, 'id'>) => void;
  onCancel: () => void;
  isLoading: boolean;
}

function AddVolunteerModal({ onSave, onCancel, isLoading }: AddVolunteerModalProps) {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    gender: 'male' as 'male' | 'female',
    privileges: ['box_watcher'] as ('keyman' | 'box_watcher' | 'money_counter')[],
    roles: [],
    isAvailable: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.firstName.trim() && formData.lastName.trim()) {
      onSave(formData);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Add New Volunteer</h3>
        </div>
        
        <form onSubmit={handleSubmit} className="px-6 py-4 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">First Name</label>
            <input
              type="text"
              value={formData.firstName}
              onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Last Name</label>
            <input
              type="text"
              value={formData.lastName}
              onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
            <select
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'male' | 'female' })}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="male">Brother</option>
              <option value="female">Sister</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Privileges</label>
            <div className="space-y-2">
              {['box_watcher', 'keyman', 'money_counter'].map(privilege => (
                <label key={privilege} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.privileges.includes(privilege as any)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData({
                          ...formData,
                          privileges: [...formData.privileges, privilege as any]
                        });
                      } else {
                        setFormData({
                          ...formData,
                          privileges: formData.privileges.filter(p => p !== privilege)
                        });
                      }
                    }}
                    className="mr-2"
                    disabled={privilege === 'keyman' && formData.gender === 'female'}
                  />
                  <span className="text-sm capitalize">{privilege.replace('_', ' ')}</span>
                </label>
              ))}
            </div>
          </div>
        </form>
        
        <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-end space-x-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading || !formData.firstName.trim() || !formData.lastName.trim()}
            className="px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700 disabled:opacity-50"
          >
            {isLoading ? 'Adding...' : 'Add Volunteer'}
          </button>
        </div>
      </div>
    </div>
  );
}

// Assignment Overview Component
function AssignmentOverview({ volunteers, shifts }: { volunteers: Volunteer[]; shifts: Shift[] }) {
  const getAssignmentStats = () => {
    const stats = {
      totalAssignments: 0,
      boxWatchers: 0,
      keymen: 0,
      moneyCounters: 0,
      byDay: {} as Record<string, number>
    };

    volunteers.forEach(volunteer => {
      volunteer.roles.forEach(role => {
        stats.totalAssignments++;
        
        if (role.type === 'box_watcher') stats.boxWatchers++;
        if (role.type === 'keyman') stats.keymen++;
        if (role.type === 'money_counter') stats.moneyCounters++;
        
        if (role.day) {
          stats.byDay[role.day] = (stats.byDay[role.day] || 0) + 1;
        }
      });
    });

    return stats;
  };

  const stats = getAssignmentStats();

  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Users className="w-8 h-8 text-teal-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Assignments</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.totalAssignments}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Package className="w-8 h-8 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Box Watchers</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.boxWatchers}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Key className="w-8 h-8 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Keymen</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.keymen}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg border border-gray-200">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <DollarSign className="w-8 h-8 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Money Counters</p>
              <p className="text-2xl font-semibold text-gray-900">{stats.moneyCounters}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Assignments by Day */}
      <div className="bg-white rounded-lg border border-gray-200">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Assignments by Day</h3>
        </div>
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {['Friday', 'Saturday', 'Sunday'].map(day => (
              <div key={day} className="text-center p-4 bg-gray-50 rounded-lg">
                <h4 className="font-semibold text-gray-900">{day}</h4>
                <p className="text-2xl font-bold text-teal-600">{stats.byDay[day] || 0}</p>
                <p className="text-sm text-gray-600">assignments</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// Money Counting Session Card Component
interface MoneyCountingSessionCardProps {
  session: MoneyCountingSession;
  assignedVolunteers: Volunteer[];
  availableVolunteers: Volunteer[];
  onAssign: (volunteerId: string) => void;
  onRemove: (volunteerId: string) => void;
  isLoading: boolean;
}

function MoneyCountingSessionCard({ 
  session, 
  assignedVolunteers, 
  availableVolunteers, 
  onAssign, 
  onRemove,
  isLoading 
}: MoneyCountingSessionCardProps) {
  const brothersAssigned = assignedVolunteers.filter(v => v.gender === 'male').length;
  const isComplete = assignedVolunteers.length >= session.requiredCount && brothersAssigned >= session.minimumBrothers;

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900">
            {session.day} - {session.timeLabel}
          </h3>
          <p className="text-sm text-gray-600">
            {assignedVolunteers.length}/{session.requiredCount} assigned • {brothersAssigned}/{session.minimumBrothers} brothers
          </p>
        </div>
        {isComplete ? (
          <CheckCircle className="w-6 h-6 text-green-500" />
        ) : (
          <AlertTriangle className="w-6 h-6 text-yellow-500" />
        )}
      </div>

      {/* Assigned Volunteers */}
      <div className="mb-4">
        <h4 className="text-sm font-medium text-gray-700 mb-2">Assigned Volunteers</h4>
        {assignedVolunteers.length > 0 ? (
          <div className="space-y-2">
            {assignedVolunteers.map(volunteer => (
              <div key={volunteer.id} className="flex items-center justify-between p-2 bg-green-50 rounded">
                <div className="flex items-center space-x-2">
                  <span className="text-sm font-medium">
                    {volunteer.firstName} {volunteer.lastName}
                  </span>
                  <span className={`px-2 py-0.5 rounded-full text-xs ${
                    volunteer.gender === 'male' 
                      ? 'bg-blue-100 text-blue-800' 
                      : 'bg-pink-100 text-pink-800'
                  }`}>
                    {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                  </span>
                </div>
                <button
                  onClick={() => onRemove(volunteer.id)}
                  disabled={isLoading}
                  className="p-1 text-red-600 hover:bg-red-100 rounded disabled:opacity-50"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-sm text-gray-500 italic">No volunteers assigned</p>
        )}
      </div>

      {/* Available Volunteers */}
      {assignedVolunteers.length < session.requiredCount && (
        <div>
          <h4 className="text-sm font-medium text-gray-700 mb-2">Available Volunteers</h4>
          {availableVolunteers.length > 0 ? (
            <div className="space-y-1 max-h-32 overflow-y-auto">
              {availableVolunteers.map(volunteer => (
                <button
                  key={volunteer.id}
                  onClick={() => onAssign(volunteer.id)}
                  disabled={isLoading}
                  className="w-full flex items-center justify-between p-2 text-left hover:bg-gray-50 rounded disabled:opacity-50"
                >
                  <div className="flex items-center space-x-2">
                    <span className="text-sm">
                      {volunteer.firstName} {volunteer.lastName}
                    </span>
                    <span className={`px-2 py-0.5 rounded-full text-xs ${
                      volunteer.gender === 'male' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-pink-100 text-pink-800'
                    }`}>
                      {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                    </span>
                  </div>
                  <Plus className="w-4 h-4 text-teal-600" />
                </button>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 italic">No available volunteers</p>
          )}
        </div>
      )}
    </div>
  );
}