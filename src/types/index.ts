export interface Volunteer {
  id: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  roles: Role[];
  isAvailable: boolean;
  contactInfo?: string;
  privileges: ('keyman' | 'box_watcher' | 'money_counter')[];
}

export interface Role {
  type: 'keyman' | 'money_counter' | 'box_watcher';
  shift?: number;
  location?: string;
  boxNumber?: number;
  status: 'assigned' | 'checked_in' | 'active' | 'completed';
  day?: string;
  time?: 'lunch' | 'after_afternoon';
}

export interface Shift {
  id: number;
  name: string;
  startTime: string;
  endTime: string;
  description: string;
  isActive: boolean;
  day: string;
  requiredBoxWatchers: number;
  requiredKeymen: number;
  assignedVolunteers: string[];
}

export interface Box {
  id: number;
  location: string;
  isAtEntrance: boolean;
  assignedWatcher?: string;
  currentShift?: number;
  status: 'assigned' | 'active' | 'returned' | 'needs_attention';
}

export interface ShiftAssignment {
  volunteerId: string;
  role: Role;
  shift: Shift;
  checkInTime?: Date;
  checkOutTime?: Date;
  notes?: string;
}

export interface ScheduleConflict {
  volunteerId: string;
  volunteerName: string;
  conflictType: 'time_overlap' | 'role_restriction' | 'gender_restriction' | 'insufficient_keymen';
  message: string;
  shifts: number[];
}

export interface MoneyCountingSession {
  id: string;
  day: string;
  time: 'lunch' | 'after_afternoon';
  assignedVolunteers: string[];
  requiredCount: number;
  minimumBrothers: number;
}