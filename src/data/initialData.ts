import { Volunteer, Shift, Box } from '../types';

export const shifts: Shift[] = [
  // Friday
  {
    id: 1,
    name: '1st Shift - Friday',
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
    name: '2nd Shift - Friday', 
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
    name: '3rd Shift - Friday',
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
    name: '4th Shift - Friday',
    startTime: 'Closing song of afternoon session',
    endTime: 'Until attendees have left',
    description: 'Friday final session through departure',
    isActive: false,
    day: 'Friday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  // Saturday
  {
    id: 5,
    name: '1st Shift - Saturday',
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
    name: '2nd Shift - Saturday', 
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
    name: '3rd Shift - Saturday',
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
    name: '4th Shift - Saturday',
    startTime: 'Closing song of afternoon session',
    endTime: 'Until attendees have left',
    description: 'Saturday final session through departure',
    isActive: false,
    day: 'Saturday',
    requiredBoxWatchers: 10,
    requiredKeymen: 3,
    assignedVolunteers: []
  },
  // Sunday
  {
    id: 9,
    name: '1st Shift - Sunday',
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
    name: '2nd Shift - Sunday', 
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
    name: '3rd Shift - Sunday',
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
    name: '4th Shift - Sunday',
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
  // Friday Afternoon Box Watchers - Shift 3
  { 
    id: '1', 
    firstName: 'Bersano', 
    lastName: 'Keziah', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 1, location: 'Box Assignment', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '2', 
    firstName: 'Malaki', 
    lastName: 'Coney Rea', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 2, location: 'Box Assignment', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '3', 
    firstName: 'Razon', 
    lastName: 'Gina', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 3, location: 'Box Assignment', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '4', 
    firstName: 'Salinas', 
    lastName: 'Vanessa', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 4, location: 'Box Assignment', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '5', 
    firstName: 'Agulto', 
    lastName: 'Aliah', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 5, location: 'Box Assignment', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '6', 
    firstName: 'Pariñas', 
    lastName: 'Nicole', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 6, location: 'Box Assignment', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '7', 
    firstName: 'Clemente', 
    lastName: 'Analyn', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 7, location: 'Box Assignment', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '8', 
    firstName: 'Ombina', 
    lastName: 'Jealyn', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 8, location: 'Entrance/Exit', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '9', 
    firstName: 'Agulto', 
    lastName: 'Toby Bryan', 
    gender: 'male',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 9, location: 'Entrance/Exit', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'keyman', 'money_counter']
  },
  { 
    id: '10', 
    firstName: 'Talavera', 
    lastName: 'Roche Lou', 
    gender: 'female',
    roles: [{ type: 'box_watcher', shift: 3, status: 'assigned', boxNumber: 10, location: 'Entrance/Exit', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },

  // Keymen - Friday
  { 
    id: '51', 
    firstName: 'Acampado', 
    lastName: 'Louiel Jay', 
    gender: 'male',
    roles: [{ type: 'keyman', shift: 3, status: 'assigned', location: 'Accounts Department', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['keyman', 'money_counter']
  },
  { 
    id: '52', 
    firstName: 'Basadre', 
    lastName: 'Christian', 
    gender: 'male',
    roles: [{ type: 'keyman', shift: 3, status: 'assigned', location: 'Accounts Department', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['keyman', 'money_counter']
  },
  { 
    id: '53', 
    firstName: 'Clemente', 
    lastName: 'Mark Anthony', 
    gender: 'male',
    roles: [{ type: 'keyman', shift: 3, status: 'assigned', location: 'Accounts Department', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['keyman', 'money_counter']
  },

  // Money Counters - Friday After Shift 4
  { 
    id: '69', 
    firstName: 'Abena', 
    lastName: 'Gladish', 
    gender: 'female',
    roles: [{ type: 'money_counter', status: 'assigned', location: 'Counting Table', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '70', 
    firstName: 'Abarri', 
    lastName: 'Jeralyn', 
    gender: 'female',
    roles: [{ type: 'money_counter', status: 'assigned', location: 'Counting Table', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['box_watcher', 'money_counter']
  },
  { 
    id: '71', 
    firstName: 'Dasal', 
    lastName: 'Roger', 
    gender: 'male',
    roles: [{ type: 'money_counter', status: 'assigned', location: 'Counting Table', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['keyman', 'money_counter']
  },
  { 
    id: '72', 
    firstName: 'Madura', 
    lastName: 'Cyrus', 
    gender: 'male',
    roles: [{ type: 'money_counter', status: 'assigned', location: 'Counting Table', day: 'Friday' }], 
    isAvailable: true,
    privileges: ['keyman', 'money_counter']
  }
];

export const boxes: Box[] = [
  { id: 1, location: 'Box Assignment', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 2, location: 'Box Assignment', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 3, location: 'Box Assignment', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 4, location: 'Box Assignment', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 5, location: 'Box Assignment', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 6, location: 'Box Assignment', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 7, location: 'Box Assignment', isAtEntrance: false, status: 'assigned', currentShift: 1 },
  { id: 8, location: 'Entrance/Exit', isAtEntrance: true, status: 'assigned', currentShift: 1 },
  { id: 9, location: 'Entrance/Exit', isAtEntrance: true, status: 'assigned', currentShift: 1 },
  { id: 10, location: 'Entrance/Exit', isAtEntrance: true, status: 'assigned', currentShift: 1 }
];