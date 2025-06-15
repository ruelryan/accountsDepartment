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
      case 'checked_in':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'active':
        return <Clock className="w-4 h-4 text-blue-500" />;
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-gray-500" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-yellow-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'checked_in':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'completed':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <Users className="w-5 h-5 mr-2 text-teal-600" />
        {title}
        <span className="ml-2 text-sm font-normal text-gray-600">
          ({filteredVolunteers.length})
        </span>
      </h3>
      
      <div className="space-y-3">
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
              className={`flex items-center justify-between p-3 rounded-lg border transition-all ${
                currentRole.status === 'active' 
                  ? 'border-teal-200 bg-teal-50' 
                  : 'border-gray-200 bg-gray-50'
              }`}
            >
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  {getStatusIcon(currentRole.status)}
                </div>
                <div>
                  <p className="font-medium text-gray-900">
                    {volunteer.firstName} {volunteer.lastName}
                  </p>
                  <div className="flex items-center space-x-2 text-xs text-gray-600">
                    {currentRole.shift && (
                      <span>Shift {currentRole.shift}</span>
                    )}
                    {currentRole.location && (
                      <span>• {currentRole.location}</span>
                    )}
                    {currentRole.boxNumber && (
                      <span>• Box #{currentRole.boxNumber}</span>
                    )}
                  </div>
                </div>
              </div>
              
              <select
                value={currentRole.status}
                onChange={(e) => onStatusChange(volunteer.id, e.target.value)}
                className={`text-xs px-2 py-1 rounded-full border font-medium focus:outline-none focus:ring-2 focus:ring-teal-500 ${getStatusColor(currentRole.status)}`}
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