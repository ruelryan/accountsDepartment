import React, { useState } from 'react';
import { MinimalistActionBar } from './MinimalistActionBar';
import { Volunteer, Shift, Box } from '../types';
import { 
  Users, 
  Calendar, 
  Package, 
  DollarSign, 
  Settings,
  ArrowLeft,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';

interface MinimalistDashboardProps {
  volunteers: Volunteer[];
  shifts: Shift[];
  boxes: Box[];
  onBack: () => void;
}

export function MinimalistDashboard({ 
  volunteers, 
  shifts, 
  boxes, 
  onBack 
}: MinimalistDashboardProps) {
  const [activeAction, setActiveAction] = useState<string>('volunteers');

  // Calculate stats
  const stats = {
    totalVolunteers: volunteers.length,
    activeVolunteers: volunteers.filter(v => v.roles.some(r => r.status === 'active')).length,
    totalShifts: shifts.length,
    activeShifts: shifts.filter(s => s.isActive).length,
    totalBoxes: boxes.length,
    activeBoxes: boxes.filter(b => b.status === 'active').length,
    moneyCounters: volunteers.filter(v => v.roles.some(r => r.type === 'money_counter')).length
  };

  const renderContent = () => {
    switch (activeAction) {
      case 'volunteers':
        return <VolunteersView volunteers={volunteers} stats={stats} />;
      case 'schedule':
        return <ScheduleView shifts={shifts} stats={stats} />;
      case 'boxes':
        return <BoxesView boxes={boxes} stats={stats} />;
      case 'money':
        return <MoneyView volunteers={volunteers} stats={stats} />;
      case 'settings':
        return <SettingsView />;
      default:
        return <VolunteersView volunteers={volunteers} stats={stats} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-100">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span className="font-medium">Back</span>
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Convention Management</h1>
            <div className="w-16"></div> {/* Spacer for centering */}
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <MinimalistActionBar
        onVolunteersClick={() => setActiveAction('volunteers')}
        onScheduleClick={() => setActiveAction('schedule')}
        onBoxesClick={() => setActiveAction('boxes')}
        onMoneyClick={() => setActiveAction('money')}
        onSettingsClick={() => setActiveAction('settings')}
        activeAction={activeAction}
      />

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {renderContent()}
      </div>
    </div>
  );
}

// Volunteers View Component
function VolunteersView({ volunteers, stats }: { volunteers: Volunteer[]; stats: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Volunteers</h2>
        <p className="text-gray-600">Manage volunteer assignments and status</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalVolunteers}</div>
          <div className="text-sm text-gray-600">Total</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-green-600 mb-1">{stats.activeVolunteers}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-4 space-y-3">
          {volunteers.slice(0, 5).map(volunteer => (
            <div key={volunteer.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-gray-600">
                    {volunteer.firstName[0]}{volunteer.lastName[0]}
                  </span>
                </div>
                <span className="text-sm text-gray-900">
                  {volunteer.firstName} {volunteer.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                {volunteer.roles.length > 0 ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-500">
                  {volunteer.roles.length} role{volunteer.roles.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Schedule View Component
function ScheduleView({ shifts, stats }: { shifts: Shift[]; stats: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Schedule</h2>
        <p className="text-gray-600">View and manage shift schedules</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalShifts}</div>
          <div className="text-sm text-gray-600">Total Shifts</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-blue-600 mb-1">{stats.activeShifts}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Upcoming Shifts</h3>
        </div>
        <div className="p-4 space-y-3">
          {shifts.slice(0, 5).map(shift => (
            <div key={shift.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">{shift.name}</div>
                <div className="text-sm text-gray-600">{shift.day} • {shift.startTime}</div>
              </div>
              <div className="flex items-center space-x-2">
                {shift.isActive ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Boxes View Component
function BoxesView({ boxes, stats }: { boxes: Box[]; stats: any }) {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Package className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Boxes</h2>
        <p className="text-gray-600">Monitor contribution box status</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.totalBoxes}</div>
          <div className="text-sm text-gray-600">Total Boxes</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-green-600 mb-1">{stats.activeBoxes}</div>
          <div className="text-sm text-gray-600">Active</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Box Status</h3>
        </div>
        <div className="p-4 space-y-3">
          {boxes.slice(0, 5).map(box => (
            <div key={box.id} className="flex items-center justify-between">
              <div>
                <div className="font-medium text-gray-900">Box #{box.id}</div>
                <div className="text-sm text-gray-600">{box.location}</div>
              </div>
              <div className="flex items-center space-x-2">
                {box.status === 'active' ? (
                  <CheckCircle className="w-4 h-4 text-green-500" />
                ) : box.status === 'needs_attention' ? (
                  <AlertTriangle className="w-4 h-4 text-red-500" />
                ) : (
                  <Clock className="w-4 h-4 text-gray-400" />
                )}
                <span className="text-xs text-gray-500 capitalize">
                  {box.status.replace('_', ' ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Money View Component
function MoneyView({ volunteers, stats }: { volunteers: Volunteer[]; stats: any }) {
  const moneyCounters = volunteers.filter(v => 
    v.roles.some(r => r.type === 'money_counter')
  );

  return (
    <div className="space-y-6">
      <div className="text-center">
        <DollarSign className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Money</h2>
        <p className="text-gray-600">Manage money counting sessions</p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-gray-900 mb-1">{stats.moneyCounters}</div>
          <div className="text-sm text-gray-600">Counters</div>
        </div>
        <div className="bg-white rounded-lg p-6 text-center border border-gray-100">
          <div className="text-3xl font-bold text-purple-600 mb-1">6</div>
          <div className="text-sm text-gray-600">Sessions</div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">Money Counters</h3>
        </div>
        <div className="p-4 space-y-3">
          {moneyCounters.slice(0, 5).map(volunteer => (
            <div key={volunteer.id} className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
                  <span className="text-xs font-medium text-purple-600">
                    {volunteer.firstName[0]}{volunteer.lastName[0]}
                  </span>
                </div>
                <span className="text-sm text-gray-900">
                  {volunteer.firstName} {volunteer.lastName}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <span className="text-xs text-gray-500">
                  {volunteer.gender === 'male' ? 'Brother' : 'Sister'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// Settings View Component
function SettingsView() {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Settings</h2>
        <p className="text-gray-600">Configure system preferences</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-100">
        <div className="p-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-900">System Settings</h3>
        </div>
        <div className="p-4 space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">Auto-sync data</span>
            <div className="w-10 h-6 bg-green-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">Email notifications</span>
            <div className="w-10 h-6 bg-gray-300 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 left-1"></div>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-900">Real-time updates</span>
            <div className="w-10 h-6 bg-green-500 rounded-full relative">
              <div className="w-4 h-4 bg-white rounded-full absolute top-1 right-1"></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}