import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Volunteer, Shift, Box } from '../types';
import { volunteers as initialVolunteers, shifts as initialShifts, boxes as initialBoxes } from '../data/initialData';

export function useSupabaseData() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>(initialVolunteers);
  const [shifts, setShifts] = useState<Shift[]>(initialShifts);
  const [boxes, setBoxes] = useState<Box[]>(initialBoxes);
  const [isLoading, setIsLoading] = useState(true);
  const [isOnline, setIsOnline] = useState(true);
  const [lastSynced, setLastSynced] = useState<Date | null>(null);

  // Transform database row to app format
  const transformVolunteerFromDB = (row: any): Volunteer => ({
    id: row.id,
    firstName: row.first_name,
    lastName: row.last_name,
    gender: row.gender,
    roles: row.roles || [],
    isAvailable: row.is_available,
    contactInfo: row.contact_info,
    privileges: row.privileges || []
  });

  const transformShiftFromDB = (row: any): Shift => ({
    id: row.id,
    name: row.name,
    startTime: row.start_time,
    endTime: row.end_time,
    description: row.description,
    isActive: row.is_active,
    day: row.day,
    requiredBoxWatchers: row.required_box_watchers,
    requiredKeymen: row.required_keymen,
    assignedVolunteers: row.assigned_volunteers || []
  });

  const transformBoxFromDB = (row: any): Box => ({
    id: row.id,
    location: row.location,
    isAtEntrance: row.is_at_entrance,
    assignedWatcher: row.assigned_watcher,
    currentShift: row.current_shift,
    status: row.status
  });

  // Transform app format to database format
  const transformVolunteerToDB = (volunteer: Volunteer) => ({
    id: volunteer.id,
    first_name: volunteer.firstName,
    last_name: volunteer.lastName,
    gender: volunteer.gender,
    roles: volunteer.roles,
    is_available: volunteer.isAvailable,
    contact_info: volunteer.contactInfo || null,
    privileges: volunteer.privileges,
    updated_at: new Date().toISOString()
  });

  const transformShiftToDB = (shift: Shift) => ({
    id: shift.id,
    name: shift.name,
    start_time: shift.startTime,
    end_time: shift.endTime,
    description: shift.description,
    is_active: shift.isActive,
    day: shift.day,
    required_box_watchers: shift.requiredBoxWatchers,
    required_keymen: shift.requiredKeymen,
    assigned_volunteers: shift.assignedVolunteers,
    updated_at: new Date().toISOString()
  });

  const transformBoxToDB = (box: Box) => ({
    id: box.id,
    location: box.location,
    is_at_entrance: box.isAtEntrance,
    assigned_watcher: box.assignedWatcher || null,
    current_shift: box.currentShift || null,
    status: box.status,
    updated_at: new Date().toISOString()
  });

  // Initialize data from Supabase or use defaults
  const initializeData = useCallback(async () => {
    try {
      setIsLoading(true);
      setIsOnline(true);

      // Try to fetch data from Supabase
      const [volunteersResult, shiftsResult, boxesResult] = await Promise.all([
        supabase.from('volunteers').select('*'),
        supabase.from('shifts').select('*'),
        supabase.from('boxes').select('*')
      ]);

      // Check if tables exist and have data
      const hasVolunteers = volunteersResult.data && volunteersResult.data.length > 0;
      const hasShifts = shiftsResult.data && shiftsResult.data.length > 0;
      const hasBoxes = boxesResult.data && boxesResult.data.length > 0;

      if (hasVolunteers && hasShifts && hasBoxes) {
        // Use data from Supabase
        setVolunteers(volunteersResult.data.map(transformVolunteerFromDB));
        setShifts(shiftsResult.data.map(transformShiftFromDB));
        setBoxes(boxesResult.data.map(transformBoxFromDB));
        setLastSynced(new Date());
      } else {
        // Initialize with default data
        console.log('No data found in Supabase, initializing with defaults...');
        await initializeDefaultData();
      }
    } catch (error) {
      console.error('Error connecting to Supabase:', error);
      setIsOnline(false);
      // Fall back to localStorage or default data
      loadFromLocalStorage();
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Initialize Supabase with default data
  const initializeDefaultData = async () => {
    try {
      // Insert default data
      const [volunteersInsert, shiftsInsert, boxesInsert] = await Promise.all([
        supabase.from('volunteers').upsert(
          initialVolunteers.map(transformVolunteerToDB),
          { onConflict: 'id' }
        ),
        supabase.from('shifts').upsert(
          initialShifts.map(transformShiftToDB),
          { onConflict: 'id' }
        ),
        supabase.from('boxes').upsert(
          initialBoxes.map(transformBoxToDB),
          { onConflict: 'id' }
        )
      ]);

      if (volunteersInsert.error) throw volunteersInsert.error;
      if (shiftsInsert.error) throw shiftsInsert.error;
      if (boxesInsert.error) throw boxesInsert.error;

      setVolunteers(initialVolunteers);
      setShifts(initialShifts);
      setBoxes(initialBoxes);
      setLastSynced(new Date());
      
      console.log('Default data initialized in Supabase');
    } catch (error) {
      console.error('Error initializing default data:', error);
      throw error;
    }
  };

  // Load from localStorage as fallback
  const loadFromLocalStorage = () => {
    try {
      const savedData = localStorage.getItem('conventionAccountsData');
      if (savedData) {
        const parsedData = JSON.parse(savedData);
        if (parsedData.volunteers) setVolunteers(parsedData.volunteers);
        if (parsedData.boxes) setBoxes(parsedData.boxes);
        if (parsedData.shifts) setShifts(parsedData.shifts);
      }
    } catch (error) {
      console.error('Error loading from localStorage:', error);
    }
  };

  // Save volunteers to Supabase
  const saveVolunteers = async (updatedVolunteers: Volunteer[]) => {
    try {
      if (!isOnline) {
        // Save to localStorage as fallback
        const dataToSave = { volunteers: updatedVolunteers, shifts, boxes };
        localStorage.setItem('conventionAccountsData', JSON.stringify(dataToSave));
        setVolunteers(updatedVolunteers);
        return;
      }

      const { error } = await supabase
        .from('volunteers')
        .upsert(updatedVolunteers.map(transformVolunteerToDB), { onConflict: 'id' });

      if (error) throw error;

      setVolunteers(updatedVolunteers);
      setLastSynced(new Date());
    } catch (error) {
      console.error('Error saving volunteers:', error);
      throw error;
    }
  };

  // Save shifts to Supabase
  const saveShifts = async (updatedShifts: Shift[]) => {
    try {
      if (!isOnline) {
        const dataToSave = { volunteers, shifts: updatedShifts, boxes };
        localStorage.setItem('conventionAccountsData', JSON.stringify(dataToSave));
        setShifts(updatedShifts);
        return;
      }

      const { error } = await supabase
        .from('shifts')
        .upsert(updatedShifts.map(transformShiftToDB), { onConflict: 'id' });

      if (error) throw error;

      setShifts(updatedShifts);
      setLastSynced(new Date());
    } catch (error) {
      console.error('Error saving shifts:', error);
      throw error;
    }
  };

  // Save boxes to Supabase
  const saveBoxes = async (updatedBoxes: Box[]) => {
    try {
      if (!isOnline) {
        const dataToSave = { volunteers, shifts, boxes: updatedBoxes };
        localStorage.setItem('conventionAccountsData', JSON.stringify(dataToSave));
        setBoxes(updatedBoxes);
        return;
      }

      const { error } = await supabase
        .from('boxes')
        .upsert(updatedBoxes.map(transformBoxToDB), { onConflict: 'id' });

      if (error) throw error;

      setBoxes(updatedBoxes);
      setLastSynced(new Date());
    } catch (error) {
      console.error('Error saving boxes:', error);
      throw error;
    }
  };

  // Set up real-time subscriptions
  useEffect(() => {
    if (!isOnline) return;

    const volunteersSubscription = supabase
      .channel('volunteers-changes')
      .on('postgres_changes', 
        { event: '*', schema: 'public', table: 'volunteers' },
        (payload) => {
          console.log('Volunteers updated:', payload);
          // Refresh volunteers data
          supabase.from('volunteers').select('*').then(({ data }) => {
            if (data) {
              setVolunteers(data.map(transformVolunteerFromDB));
              setLastSynced(new Date());
            }
          });
        }
      )
      .subscribe();

    const shiftsSubscription = supabase
      .channel('shifts-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'shifts' },
        (payload) => {
          console.log('Shifts updated:', payload);
          supabase.from('shifts').select('*').then(({ data }) => {
            if (data) {
              setShifts(data.map(transformShiftFromDB));
              setLastSynced(new Date());
            }
          });
        }
      )
      .subscribe();

    const boxesSubscription = supabase
      .channel('boxes-changes')
      .on('postgres_changes',
        { event: '*', schema: 'public', table: 'boxes' },
        (payload) => {
          console.log('Boxes updated:', payload);
          supabase.from('boxes').select('*').then(({ data }) => {
            if (data) {
              setBoxes(data.map(transformBoxFromDB));
              setLastSynced(new Date());
            }
          });
        }
      )
      .subscribe();

    return () => {
      volunteersSubscription.unsubscribe();
      shiftsSubscription.unsubscribe();
      boxesSubscription.unsubscribe();
    };
  }, [isOnline]);

  // Initialize data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Test connection periodically
  useEffect(() => {
    const testConnection = async () => {
      try {
        const { error } = await supabase.from('volunteers').select('count').limit(1);
        setIsOnline(!error);
      } catch {
        setIsOnline(false);
      }
    };

    const interval = setInterval(testConnection, 30000); // Test every 30 seconds
    return () => clearInterval(interval);
  }, []);

  return {
    volunteers,
    shifts,
    boxes,
    isLoading,
    isOnline,
    lastSynced,
    saveVolunteers,
    saveShifts,
    saveBoxes,
    initializeDefaultData
  };
}