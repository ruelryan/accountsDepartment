import { Volunteer, Shift, Box } from '../types';

export const shifts: Shift[] = [
  // Friday - Shifts 1-4
  {
    id: 1,
    name: '1st Shift',
    startTime: '7:40 AM',
    endTime: 'Opening of morning session',
    description: 'Friday morning pre-session setup and initial box deployment',
    isActive: false,
    day: 'Friday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 2,
    name: '2nd Shift', 
    startTime: 'Closing song of morning session',
    endTime: 'Halfway through noon intermission',
    description: 'Friday morning session close to intermission midpoint',
    isActive: false,
    day: 'Friday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 3,
    name: '3rd Shift',
    startTime: 'Halfway through noon intermission', 
    endTime: 'Opening song of afternoon session',
    description: 'Friday intermission midpoint to afternoon start',
    isActive: false,
    day: 'Friday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 4,
    name: '4th Shift',
    startTime: 'Closing song of afternoon session',
    endTime: 'Until attendees have left',
    description: 'Friday final session through departure',
    isActive: false,
    day: 'Friday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  // Saturday - Shifts 1-4
  {
    id: 5,
    name: '1st Shift',
    startTime: '7:40 AM',
    endTime: 'Opening of morning session',
    description: 'Saturday morning pre-session setup and initial box deployment',
    isActive: false,
    day: 'Saturday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 6,
    name: '2nd Shift', 
    startTime: 'Closing song of morning session',
    endTime: 'Halfway through noon intermission',
    description: 'Saturday morning session close to intermission midpoint',
    isActive: false,
    day: 'Saturday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 7,
    name: '3rd Shift',
    startTime: 'Halfway through noon intermission', 
    endTime: 'Opening song of afternoon session',
    description: 'Saturday intermission midpoint to afternoon start',
    isActive: false,
    day: 'Saturday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 8,
    name: '4th Shift',
    startTime: 'Closing song of afternoon session',
    endTime: 'Until attendees have left',
    description: 'Saturday final session through departure',
    isActive: false,
    day: 'Saturday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  // Sunday - Shifts 1-4
  {
    id: 9,
    name: '1st Shift',
    startTime: '7:40 AM',
    endTime: 'Opening of morning session',
    description: 'Sunday morning pre-session setup and initial box deployment',
    isActive: false,
    day: 'Sunday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 10,
    name: '2nd Shift', 
    startTime: 'Closing song of morning session',
    endTime: 'Halfway through noon intermission',
    description: 'Sunday morning session close to intermission midpoint',
    isActive: false,
    day: 'Sunday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 11,
    name: '3rd Shift',
    startTime: 'Halfway through noon intermission', 
    endTime: 'Opening song of afternoon session',
    description: 'Sunday intermission midpoint to afternoon start',
    isActive: false,
    day: 'Sunday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  {
    id: 12,
    name: '4th Shift',
    startTime: 'Closing song of afternoon session',
    endTime: 'Until attendees have left',
    description: 'Sunday final session through departure',
    isActive: false,
    day: 'Sunday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  }
];

export const volunteers: Volunteer[] = [
  // Sisters - Box Watcher and Money Counter privileges
  { 
    id: '1', 
    firstName: 'Ainne', 
    lastName: 'Malaki', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '2', 
    firstName: 'Aldrenaline', 
    lastName: 'Gay', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '3', 
    firstName: 'Analyn', 
    lastName: 'Clemente', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '4', 
    firstName: 'Dahlia', 
    lastName: 'Villaruel', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '5', 
    firstName: 'Ella', 
    lastName: 'De Paz', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '6', 
    firstName: 'Hazel Anne', 
    lastName: 'Sacro', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '7', 
    firstName: 'Jeanly', 
    lastName: 'Roales', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '8', 
    firstName: 'Jaye Kayla', 
    lastName: 'Rosal', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '9', 
    firstName: 'Keziah', 
    lastName: 'Bersano', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '10', 
    firstName: 'Kristel Joy', 
    lastName: 'Pagalan', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '11', 
    firstName: 'Kyla Marie', 
    lastName: 'Pagaran', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '12', 
    firstName: 'Lady Jane', 
    lastName: 'Gay', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '13', 
    firstName: 'Lefril Ann', 
    lastName: 'Gay', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '14', 
    firstName: 'Lymarie', 
    lastName: 'Sermillas', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '15', 
    firstName: 'Nicole', 
    lastName: 'Altura', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '16', 
    firstName: 'Quenette', 
    lastName: 'De Paz', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '17', 
    firstName: 'Raisa', 
    lastName: 'Pimentel', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '18', 
    firstName: 'Relyn', 
    lastName: 'Carino', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '19', 
    firstName: 'Reshel', 
    lastName: 'Judico', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '20', 
    firstName: 'Rovelyn', 
    lastName: 'Pagaran', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '21', 
    firstName: 'Rozyville', 
    lastName: 'Miro', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '22', 
    firstName: 'Vanessa', 
    lastName: 'Salinas', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '23', 
    firstName: 'Eulane', 
    lastName: 'Mendoza', 
    gender: 'female',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },

  // Brothers - Box Watcher, Money Counter, and Keyman privileges
  { 
    id: '24', 
    firstName: 'Armel', 
    lastName: 'Roales', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '25', 
    firstName: 'Romeo', 
    lastName: 'Dasal Jr', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '26', 
    firstName: 'Eden Seb', 
    lastName: 'Engalan', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '27', 
    firstName: 'Jeddan', 
    lastName: 'Jusay', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '28', 
    firstName: 'Jundino', 
    lastName: 'Razon', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '29', 
    firstName: 'Kim', 
    lastName: 'Millan', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '30', 
    firstName: 'Louiel Jay', 
    lastName: 'Acampado', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '31', 
    firstName: 'Mark Anthony', 
    lastName: 'Clemente', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '32', 
    firstName: 'Roche Lou', 
    lastName: 'Talavera', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '33', 
    firstName: 'Roger', 
    lastName: 'Dasal', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  },
  { 
    id: '34', 
    firstName: 'Ruel Ryan', 
    lastName: 'Rosal', 
    gender: 'male',
    roles: [], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter', 'keyman']
  }
];

export const boxes: Box[] = [
  { id: 1, location: 'Main Hall', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 2, location: 'Main Hall', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 3, location: 'Main Hall', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 4, location: 'Main Hall', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 5, location: 'Main Hall', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 6, location: 'Main Hall', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 7, location: 'Main Hall', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 8, location: 'Entrance/Exit', isAtEntrance: true, status: 'assigned', currentShift: 1 },
  { id: 9, location: 'Entrance/Exit', isAtEntrance: true, status: 'assigned', currentShift: 1 },
  { id: 10, location: 'Entrance/Exit', isAtEntrance: true, status: 'assigned', currentShift: 1 }
];