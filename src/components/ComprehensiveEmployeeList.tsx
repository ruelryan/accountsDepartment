import React, { useState, useMemo } from 'react';
import { Volunteer, Shift } from '../types';
import { 
  Users, 
  Package, 
  Key, 
  DollarSign, 
  Clock, 
  MapPin, 
  Calendar,
  User,
  Phone,
  ChevronDown,
  ChevronRight,
  Filter,
  Download,
  Printer
} from 'lucide-react';

interface ComprehensiveEmployeeListProps {
  volunteers: Volunteer[];
  shifts: Shift[];
}

interface FormattedEmployee {
  id: string;
  firstName: string;
  lastName: string;
  fullName: string;
  gender: 'male' | 'female';
  jobTitle: string;
  shift?: number;
  shiftName?: string;
  shiftTime?: string;
  day?: string;
  location?: string;
  boxNumber?: number;
  contactInfo?: string;
  status: string;
  roleType: 'box_watcher' | 'keyman' | 'money_counter';
}

export function ComprehensiveEmployeeList({ volunteers, shifts }: ComprehensiveEmployeeListProps) {
  const [selectedDay, setSelectedDay] = useState<string>('All');
  const [selectedRole, setSelectedRole] = useState<string>('All');
  const [expandedShifts, setExpandedShifts] = useState<Record<string, boolean>>({});
  const [sortBy, setSortBy] = useState<'lastName' | 'firstName' | 'jobTitle'>('lastName');

  // Helper function to get shift number within day (1-4)
  const getShiftNumberInDay = (shiftId: number) => {
    const shift = shifts.find(s => s.id === shiftId);
    if (!shift) return shiftId;
    
    const dayShifts = shifts.filter(s => s.day === shift.day);
    const sortedDayShifts = dayShifts.sort((a, b) => a.id - b.id);
    const index = sortedDayShifts.findIndex(s => s.id === shiftId);
    return index + 1;
  };

  // Format employee data with proper capitalization and job titles
  const formattedEmployees = useMemo(() => {
    const employees: FormattedEmployee[] = [];

    volunteers.forEach(volunteer => {
      volunteer.roles.forEach(role => {
        const shift = role.shift ? shifts.find(s => s.id === role.shift) : null;
        const shiftNumInDay = role.shift ? getShiftNumberInDay(role.shift) : undefined;

        // Determine job title based on role type
        let jobTitle = '';
        switch (role.type) {
          case 'box_watcher':
            jobTitle = 'Contribution Box Watcher';
            break;
          case 'keyman':
            jobTitle = 'Accounts Department Keyman';
            break;
          case 'money_counter':
            jobTitle = role.timeLabel ? `Money Counter (${role.timeLabel})` : 'Money Counter';
            break;
        }

        employees.push({
          id: `${volunteer.id}-${role.type}-${role.shift || role.time}`,
          firstName: volunteer.firstName,
          lastName: volunteer.lastName,
          fullName: `${volunteer.lastName}, ${volunteer.firstName}`,
          gender: volunteer.gender,
          jobTitle,
          shift: role.shift,
          shiftName: shift ? `Shift ${shiftNumInDay}` : undefined,
          shiftTime: shift ? `${shift.startTime} - ${shift.endTime}` : undefined,
          day: role.day,
          location: role.location,
          boxNumber: role.boxNumber,
          contactInfo: volunteer.contactInfo,
          status: role.status,
          roleType: role.type
        });
      });
    });

    return employees;
  }, [volunteers, shifts]);

  // Filter and sort employees
  const filteredAndSortedEmployees = useMemo(() => {
    let filtered = formattedEmployees;

    // Filter by day
    if (selectedDay !== 'All') {
      filtered = filtered.filter(emp => emp.day === selectedDay);
    }

    // Filter by role
    if (selectedRole !== 'All') {
      filtered = filtered.filter(emp => emp.roleType === selectedRole);
    }

    // Sort alphabetically by selected criteria
    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'lastName':
          return a.lastName.localeCompare(b.lastName);
        case 'firstName':
          return a.firstName.localeCompare(b.firstName);
        case 'jobTitle':
          return a.jobTitle.localeCompare(b.jobTitle);
        default:
          return a.lastName.localeCompare(b.lastName);
      }
    });

    return filtered;
  }, [formattedEmployees, selectedDay, selectedRole, sortBy]);

  // Group employees by shift for better organization
  const employeesByShift = useMemo(() => {
    const grouped: Record<string, FormattedEmployee[]> = {};

    filteredAndSortedEmployees.forEach(employee => {
      let key = '';
      
      if (employee.roleType === 'money_counter') {
        key = `${employee.day} - Money Counting`;
      } else if (employee.shift && employee.day) {
        key = `${employee.day} - ${employee.shiftName}`;
      } else {
        key = 'Unassigned';
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }
      grouped[key].push(employee);
    });

    return grouped;
  }, [filteredAndSortedEmployees]);

  const toggleShiftExpansion = (shiftKey: string) => {
    setExpandedShifts(prev => ({
      ...prev,
      [shiftKey]: !prev[shiftKey]
    }));
  };

  const getDayColor = (day?: string) => {
    switch (day) {
      case 'Friday': return 'bg-blue-50 border-blue-200 text-blue-900';
      case 'Saturday': return 'bg-green-50 border-green-200 text-green-900';
      case 'Sunday': return 'bg-orange-50 border-orange-200 text-orange-900';
      default: return 'bg-gray-50 border-gray-200 text-gray-900';
    }
  };

  const getRoleIcon = (roleType: string) => {
    switch (roleType) {
      case 'box_watcher': return Package;
      case 'keyman': return Key;
      case 'money_counter': return DollarSign;
      default: return User;
    }
  };

  const getRoleColor = (roleType: string) => {
    switch (roleType) {
      case 'box_watcher': return 'text-blue-600';
      case 'keyman': return 'text-green-600';
      case 'money_counter': return 'text-purple-600';
      default: return 'text-gray-600';
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExport = () => {
    const csvContent = [
      ['Last Name', 'First Name', 'Job Title', 'Day', 'Shift', 'Time', 'Location', 'Box Number', 'Contact', 'Status'].join(','),
      ...filteredAndSortedEmployees.map(emp => [
        emp.lastName,
        emp.firstName,
        emp.jobTitle,
        emp.day || '',
        emp.shiftName || '',
        emp.shiftTime || '',
        emp.location || '',
        emp.boxNumber || '',
        emp.contactInfo || '',
        emp.status
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employee-schedule-${selectedDay}-${Date.now()}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const days = ['All', 'Friday', 'Saturday', 'Sunday'];
  const roles = ['All', 'box_watcher', 'keyman', 'money_counter'];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center">
              <Users className="w-6 h-6 mr-3 text-teal-600" />
              Comprehensive Employee Schedule
            </h1>
            <p className="text-gray-600 mt-1">
              Complete list of all scheduled personnel with job titles and contact information
            </p>
          </div>
          
          <div className="flex items-center space-x-3">
            <button
              onClick={handlePrint}
              className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 font-medium transition-colors"
            >
              <Printer className="w-4 h-4" />
              <span>Print</span>
            </button>
            <button
              onClick={handleExport}
              className="flex items-center space-x-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 font-medium transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Export CSV</span>
            </button>
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Day</label>
            <select
              value={selectedDay}
              onChange={(e) => setSelectedDay(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {days.map(day => (
                <option key={day} value={day}>{day}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Filter by Role</label>
            <select
              value={selectedRole}
              onChange={(e) => setSelectedRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              {roles.map(role => (
                <option key={role} value={role}>
                  {role === 'All' ? 'All Roles' : 
                   role === 'box_watcher' ? 'Box Watchers' :
                   role === 'keyman' ? 'Keymen' :
                   'Money Counters'}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Sort by</label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500"
            >
              <option value="lastName">Last Name</option>
              <option value="firstName">First Name</option>
              <option value="jobTitle">Job Title</option>
            </select>
          </div>

          <div className="flex items-end">
            <div className="text-sm text-gray-600">
              <div className="font-medium">Total Employees:</div>
              <div className="text-lg font-bold text-teal-600">{filteredAndSortedEmployees.length}</div>
            </div>
          </div>
        </div>
      </div>

      {/* Employee List by Shift */}
      <div className="space-y-4">
        {Object.entries(employeesByShift).map(([shiftKey, employees]) => {
          const isExpanded = expandedShifts[shiftKey] !== false; // Default to expanded
          const [day, shiftInfo] = shiftKey.split(' - ');
          
          return (
            <div key={shiftKey} className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden">
              {/* Shift Header */}
              <div className={`p-4 ${getDayColor(day)} border-b border-gray-200`}>
                <button
                  onClick={() => toggleShiftExpansion(shiftKey)}
                  className="w-full flex items-center justify-between hover:bg-black/5 rounded-lg p-2 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <Calendar className="w-5 h-5" />
                    <div className="text-left">
                      <h3 className="text-lg font-bold">{shiftKey}</h3>
                      <p className="text-sm opacity-75">{employees.length} employee{employees.length !== 1 ? 's' : ''}</p>
                    </div>
                  </div>
                  {isExpanded ? (
                    <ChevronDown className="w-5 h-5" />
                  ) : (
                    <ChevronRight className="w-5 h-5" />
                  )}
                </button>
              </div>

              {/* Employee List */}
              {isExpanded && (
                <div className="p-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-gray-200">
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Employee Name</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Job Title</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Schedule</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Assignment</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Contact</th>
                          <th className="text-left py-3 px-4 font-semibold text-gray-900">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map((employee, index) => {
                          const RoleIcon = getRoleIcon(employee.roleType);
                          
                          return (
                            <tr key={employee.id} className={`border-b border-gray-100 hover:bg-gray-50 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}`}>
                              {/* Employee Name */}
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-3">
                                  <div className="w-10 h-10 bg-gradient-to-br from-teal-400 to-blue-500 rounded-full flex items-center justify-center">
                                    <span className="text-white font-bold text-sm">
                                      {employee.firstName[0]}{employee.lastName[0]}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-semibold text-gray-900">
                                      {employee.lastName}, {employee.firstName}
                                    </div>
                                    <div className={`text-xs px-2 py-1 rounded-full font-medium ${
                                      employee.gender === 'male' 
                                        ? 'bg-blue-100 text-blue-800' 
                                        : 'bg-pink-100 text-pink-800'
                                    }`}>
                                      {employee.gender === 'male' ? 'Brother' : 'Sister'}
                                    </div>
                                  </div>
                                </div>
                              </td>

                              {/* Job Title */}
                              <td className="py-4 px-4">
                                <div className="flex items-center space-x-2">
                                  <RoleIcon className={`w-4 h-4 ${getRoleColor(employee.roleType)}`} />
                                  <span className="font-medium text-gray-900">{employee.jobTitle}</span>
                                </div>
                              </td>

                              {/* Schedule */}
                              <td className="py-4 px-4">
                                <div className="text-sm">
                                  {employee.day && (
                                    <div className="font-medium text-gray-900">{employee.day}</div>
                                  )}
                                  {employee.shiftName && (
                                    <div className="text-gray-600">{employee.shiftName}</div>
                                  )}
                                  {employee.shiftTime && (
                                    <div className="text-gray-500 flex items-center">
                                      <Clock className="w-3 h-3 mr-1" />
                                      {employee.shiftTime}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Assignment */}
                              <td className="py-4 px-4">
                                <div className="text-sm">
                                  {employee.location && (
                                    <div className="flex items-center text-gray-600 mb-1">
                                      <MapPin className="w-3 h-3 mr-1" />
                                      {employee.location}
                                    </div>
                                  )}
                                  {employee.boxNumber && (
                                    <div className="inline-flex items-center px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium">
                                      <Package className="w-3 h-3 mr-1" />
                                      Box #{employee.boxNumber}
                                    </div>
                                  )}
                                </div>
                              </td>

                              {/* Contact */}
                              <td className="py-4 px-4">
                                {employee.contactInfo ? (
                                  <div className="flex items-center text-sm text-gray-600">
                                    <Phone className="w-3 h-3 mr-1" />
                                    {employee.contactInfo}
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm italic">Not provided</span>
                                )}
                              </td>

                              {/* Status */}
                              <td className="py-4 px-4">
                                <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium capitalize ${
                                  employee.status === 'active' ? 'bg-green-100 text-green-800' :
                                  employee.status === 'checked_in' ? 'bg-blue-100 text-blue-800' :
                                  employee.status === 'completed' ? 'bg-gray-100 text-gray-800' :
                                  'bg-yellow-100 text-yellow-800'
                                }`}>
                                  {employee.status.replace('_', ' ')}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>

                  {employees.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      <Users className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                      <p>No employees assigned to this shift</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Summary Statistics */}
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Summary Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg">
            <div className="text-2xl font-bold text-blue-600">
              {filteredAndSortedEmployees.filter(e => e.roleType === 'box_watcher').length}
            </div>
            <div className="text-sm text-blue-700">Box Watchers</div>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg">
            <div className="text-2xl font-bold text-green-600">
              {filteredAndSortedEmployees.filter(e => e.roleType === 'keyman').length}
            </div>
            <div className="text-sm text-green-700">Keymen</div>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg">
            <div className="text-2xl font-bold text-purple-600">
              {filteredAndSortedEmployees.filter(e => e.roleType === 'money_counter').length}
            </div>
            <div className="text-sm text-purple-700">Money Counters</div>
          </div>
          <div className="text-center p-4 bg-teal-50 rounded-lg">
            <div className="text-2xl font-bold text-teal-600">
              {filteredAndSortedEmployees.length}
            </div>
            <div className="text-sm text-teal-700">Total Assignments</div>
          </div>
        </div>
      </div>
    </div>
  );
}