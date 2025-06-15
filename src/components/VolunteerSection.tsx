import React from 'react';
import { Volunteer } from '../types';
import { Users, CheckCircle, Clock, AlertTriangle } from 'lucide-react';

interface VolunteerSectionProps {
  title: string;
  volunteers: Volunteer[];
  roleType: 'keyman' | 'money_counter' | 'box_watcher';
  activeShift: number | null;
  onStatusChange: (volunteerId: string, newStatus: string) => void;
}

export function VolunteerSection({ title, volunteers, roleType, activeShift, onStatusChange }: VolunteerSectionProps) {
  const filteredVolunteers = volunteers.filter(volunteer => 
    volunteer.roles.some(role => role.type === roleType)
  );

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'checked_in': return <CheckCircle className="w-3 h-3 text-green-500" />;
      case 'active': return <Clock className="w-3 h-3 text-blue-500" />;
      case 'completed': return <CheckCircle className="w-3 h-3 text-gray-400" />;
      default: return <AlertTriangle className="w-3 h-3 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in': return 'bg-green-50 border-green-200';
      case 'active': return 'bg-blue-50 border-blue-200';
      case 'completed': return 'bg-gray-50 border-gray-200';
      default: return 'bg-yellow-50 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-lg border border-gray-100 p-3 sm:p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <Users className="w-4 h-4 text-gray-400 mr-2" />
          <h3 className="font-medium text-gray-900 text-sm sm:text-base">{title}</h3>
        </div>
        <span className="text-xs sm:text-sm text-gray-500">{filteredVolunteers.length}</span>
      </div>
      
      <div className="space-y-2">
        {filteredVolunteers.map(volunteer => {
          const currentRole = volunteer.roles.find(role => role.type === roleType);
          if (!currentRole) return null;

          const shouldShow = roleType === 'money_counter' || 
                           !currentRole.shift || 
                           currentRole.shift === activeShift || 
                           activeShift === null;

          if (!shouldShow) return null;

          return (
            <div
              key={volunteer.id}
              className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-2 sm:p-3 rounded border transition-all space-y-2 sm:space-y-0 ${getStatusColor(currentRole.status)}`}
            >
              <div className="flex items-center space-x-2">
                {getStatusIcon(currentRole.status)}
                <div className="min-w-0 flex-1">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {volunteer.firstName} {volunteer.lastName}
                  </div>
                  {(currentRole.location || currentRole.boxNumber) && (
                    <div className="text-xs text-gray-500 truncate">
                      {currentRole.boxNumber && `Box #${currentRole.boxNumber}`}
                      {currentRole.location && currentRole.boxNumber && ' • '}
                      {currentRole.location && !currentRole.boxNumber && currentRole.location}
                    </div>
                  )}
                </div>
              </div>
              
              <select
                value={currentRole.status}
                onChange={(e) => onStatusChange(volunteer.id, e.target.value)}
                className="text-xs border-0 bg-transparent focus:outline-none font-medium w-full sm:w-auto"
              >
                <option value="assigned">Assigned</option>
                <option value="checked_in">Checked In</option>
                <option value="active">Active</option>
                <option value="completed">Completed</option>
              </select>
            </div>
          );
        })}
      </div>
    </div>
  );
}