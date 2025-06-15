import React, { useState } from 'react';
import { Volunteer } from '../types';
import { User, Clock, MapPin, Package, CheckCircle, AlertTriangle, FileText, Calendar } from 'lucide-react';

interface VolunteerPortalProps {
  volunteers: Volunteer[];
  onBackToMain: () => void;
}

export function VolunteerPortal({ volunteers, onBackToMain }: VolunteerPortalProps) {
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);

  const handleVolunteerSelect = (volunteer: Volunteer) => {
    setSelectedVolunteer(volunteer);
  };

  if (selectedVolunteer) {
    return <VolunteerDashboard volunteer={selectedVolunteer} onBack={() => setSelectedVolunteer(null)} onBackToMain={onBackToMain} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-teal-500 to-blue-600 rounded-lg flex items-center justify-center">
              <User className="w-7 h-7 text-white" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Volunteer Portal</h1>
          <p className="text-gray-600">Select your name to view your assignment details</p>
          <button
            onClick={onBackToMain}
            className="mt-4 text-teal-600 hover:text-teal-700 font-medium"
          >
            ← Back to Main Dashboard
          </button>
        </div>

        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-6">Find Your Assignment</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {volunteers.map(volunteer => (
              <button
                key={volunteer.id}
                onClick={() => handleVolunteerSelect(volunteer)}
                className="p-4 text-left border border-gray-200 rounded-lg hover:border-teal-300 hover:bg-teal-50 transition-all group"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                    <span className="text-white font-semibold text-sm">
                      {volunteer.firstName[0]}{volunteer.lastName[0]}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 group-hover:text-teal-700">
                      {volunteer.firstName} {volunteer.lastName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {volunteer.roles.map(role => role.type.replace('_', ' ')).join(', ')}
                    </p>
                    {volunteer.roles[0]?.day && (
                      <p className="text-xs text-teal-600 font-medium">
                        {volunteer.roles[0].day}
                      </p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

interface VolunteerDashboardProps {
  volunteer: Volunteer;
  onBack: () => void;
  onBackToMain: () => void;
}

function VolunteerDashboard({ volunteer, onBack, onBackToMain }: VolunteerDashboardProps) {
  const role = volunteer.roles[0]; // Assuming one primary role per volunteer
  
  const getShiftTimeline = (shiftNumber?: number, day?: string) => {
    const allShifts = [
      // Friday
      { id: 1, name: '1st Shift - Friday', start: '7:40 AM', end: 'Opening of morning session', day: 'Friday' },
      { id: 2, name: '2nd Shift - Friday', start: 'Closing song of morning session', end: 'Halfway through noon intermission', day: 'Friday' },
      { id: 3, name: '3rd Shift - Friday', start: 'Halfway through noon intermission', end: 'Opening song of afternoon session', day: 'Friday' },
      { id: 4, name: '4th Shift - Friday', start: 'Closing song of afternoon session', end: 'Until attendees have left', day: 'Friday' },
      // Saturday
      { id: 5, name: '1st Shift - Saturday', start: '7:40 AM', end: 'Opening of morning session', day: 'Saturday' },
      { id: 6, name: '2nd Shift - Saturday', start: 'Closing song of morning session', end: 'Halfway through noon intermission', day: 'Saturday' },
      { id: 7, name: '3rd Shift - Saturday', start: 'Halfway through noon intermission', end: 'Opening song of afternoon session', day: 'Saturday' },
      { id: 8, name: '4th Shift - Saturday', start: 'Closing song of afternoon session', end: 'Until attendees have left', day: 'Saturday' },
      // Sunday
      { id: 9, name: '1st Shift - Sunday', start: '7:40 AM', end: 'Opening of morning session', day: 'Sunday' },
      { id: 10, name: '2nd Shift - Sunday', start: 'Closing song of morning session', end: 'Halfway through noon intermission', day: 'Sunday' },
      { id: 11, name: '3rd Shift - Sunday', start: 'Halfway through noon intermission', end: 'Opening song of afternoon session', day: 'Sunday' },
      { id: 12, name: '4th Shift - Sunday', start: 'Closing song of afternoon session', end: 'Until attendees have left', day: 'Sunday' }
    ];
    
    return allShifts.find(s => s.id === shiftNumber);
  };

  const getInstructions = (roleType: string, day?: string) => {
    const baseInstructions = [
      "Never leave your assigned box unattended",
      "Only allow authorized Accounts Department personnel to handle your box",
      "Pay close attention to prevent anyone from walking off with the box",
      "Return your box to the designated location at the end of your shift"
    ];

    const roleSpecificInstructions = {
      box_watcher: [
        ...baseInstructions,
        "Be neat, clean, and modest in dress and grooming",
        "Do not allow anyone to take anything out of your box during your shift",
        "Wait for known accounting personnel (keymen) with proper identification during shift changes",
        "Arrive 10 minutes before your shift begins for proper handover"
      ],
      keyman: [
        "Assist with box collection and secure transport",
        "Verify volunteer identities during shift changes",
        "Ensure proper documentation of all box transfers",
        "Coordinate with Accounts Department for any issues",
        "Maintain security protocols at all times"
      ],
      money_counter: [
        "Work only at designated counting tables",
        "Follow all security protocols for handling contributions",
        "Maintain accurate records of all counted amounts",
        "Report any discrepancies immediately to supervision",
        "Work in teams for accuracy and security"
      ]
    };

    return roleSpecificInstructions[roleType as keyof typeof roleSpecificInstructions] || baseInstructions;
  };

  const getDayColor = (day?: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-100 text-blue-800';
      case 'Saturday': return 'bg-green-100 text-green-800';
      case 'Sunday': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const shift = getShiftTimeline(role.shift, role.day);
  const instructions = getInstructions(role.type, role.day);

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 to-blue-50">
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-xl">
                  {volunteer.firstName[0]}{volunteer.lastName[0]}
                </span>
              </div>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {volunteer.firstName} {volunteer.lastName}
                </h1>
                <div className="flex items-center space-x-2">
                  <p className="text-teal-600 font-medium capitalize">
                    {role.type.replace('_', ' ')}
                  </p>
                  {role.day && (
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDayColor(role.day)}`}>
                      {role.day}
                    </span>
                  )}
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={onBack}
                className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium"
              >
                ← Back to Portal
              </button>
              <button
                onClick={onBackToMain}
                className="px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium"
              >
                Main Dashboard
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Assignment Details */}
          <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
              <Package className="w-5 h-5 mr-2 text-teal-600" />
              Your Assignment
            </h2>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 bg-teal-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Role</span>
                <span className="font-semibold text-teal-700 capitalize">
                  {role.type.replace('_', ' ')}
                </span>
              </div>
              
              {role.day && (
                <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Day</span>
                  <span className="font-semibold text-purple-700">
                    {role.day}
                  </span>
                </div>
              )}
              
              {role.shift && (
                <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Shift</span>
                  <span className="font-semibold text-blue-700">
                    {shift?.name || `Shift ${role.shift}`}
                  </span>
                </div>
              )}
              
              {role.location && (
                <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Location</span>
                  <span className="font-semibold text-green-700">
                    {role.location}
                  </span>
                </div>
              )}
              
              {role.boxNumber && (
                <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                  <span className="text-sm font-medium text-gray-700">Box Number</span>
                  <span className="font-semibold text-yellow-700">
                    Box #{role.boxNumber}
                  </span>
                </div>
              )}
              
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-700">Status</span>
                <span className={`font-semibold capitalize px-2 py-1 rounded-full text-xs ${
                  role.status === 'active' ? 'bg-green-100 text-green-800' :
                  role.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                  role.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                  'bg-yellow-100 text-yellow-800'
                }`}>
                  {role.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          </div>

          {/* Timeline */}
          {shift && (
            <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                <Clock className="w-5 h-5 mr-2 text-teal-600" />
                Your Schedule
              </h2>
              
              <div className="space-y-4">
                <div className="p-4 bg-gradient-to-r from-teal-50 to-blue-50 rounded-lg border border-teal-200">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-teal-900">{shift.name}</h3>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDayColor(shift.day)}`}>
                      {shift.day}
                    </span>
                  </div>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">Start:</span>
                      <span>{shift.start}</span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <span className="font-medium mr-2">End:</span>
                      <span>{shift.end}</span>
                    </div>
                  </div>
                </div>
                
                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-center mb-2">
                    <AlertTriangle className="w-4 h-4 text-yellow-600 mr-2" />
                    <span className="font-medium text-yellow-800">Important Reminders</span>
                  </div>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Arrive 10 minutes before your shift starts</li>
                    <li>• Bring proper identification</li>
                    <li>• Wait for authorized personnel during handovers</li>
                    <li>• Follow all security protocols strictly</li>
                  </ul>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="w-5 h-5 mr-2 text-teal-600" />
            Instructions & Guidelines
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {instructions.map((instruction, index) => (
              <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                <CheckCircle className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
                <span className="text-sm text-gray-700">{instruction}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Convention Schedule Overview */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="w-5 h-5 mr-2 text-teal-600" />
            Convention Schedule Overview
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
              <h3 className="font-semibold text-blue-900 mb-2">Friday</h3>
              <div className="text-sm text-blue-700 space-y-1">
                <div>Morning Session</div>
                <div>Noon Intermission</div>
                <div>Afternoon Session</div>
              </div>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg border border-green-200">
              <h3 className="font-semibold text-green-900 mb-2">Saturday</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>Morning Session</div>
                <div>Noon Intermission</div>
                <div>Afternoon Session</div>
              </div>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg border border-orange-200">
              <h3 className="font-semibold text-orange-900 mb-2">Sunday</h3>
              <div className="text-sm text-orange-700 space-y-1">
                <div>Morning Session</div>
                <div>Noon Intermission</div>
                <div>Afternoon Session</div>
              </div>
            </div>
          </div>
        </div>

        {/* Floor Plan */}
        <div className="mt-6 bg-white rounded-xl shadow-lg border border-gray-200 p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
            <MapPin className="w-5 h-5 mr-2 text-teal-600" />
            Convention Hall Floor Plan
          </h2>
          
          <div className="bg-gray-50 rounded-lg p-4">
            <img 
              src="/Floorplan.jpg" 
              alt="Convention Hall Floor Plan" 
              className="w-full h-auto rounded-lg shadow-sm"
            />
            <p className="text-xs text-gray-500 mt-2 text-center">
              Reference floor plan showing contribution box locations and venue layout
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}