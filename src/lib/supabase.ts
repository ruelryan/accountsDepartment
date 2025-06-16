import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables. Please check your .env file.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Database types
export interface Database {
  public: {
    Tables: {
      volunteers: {
        Row: {
          id: string;
          first_name: string;
          last_name: string;
          gender: 'male' | 'female';
          roles: any[];
          is_available: boolean;
          contact_info: string | null;
          privileges: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          first_name: string;
          last_name: string;
          gender: 'male' | 'female';
          roles?: any[];
          is_available?: boolean;
          contact_info?: string | null;
          privileges?: string[];
        };
        Update: {
          id?: string;
          first_name?: string;
          last_name?: string;
          gender?: 'male' | 'female';
          roles?: any[];
          is_available?: boolean;
          contact_info?: string | null;
          privileges?: string[];
          updated_at?: string;
        };
      };
      shifts: {
        Row: {
          id: number;
          name: string;
          start_time: string;
          end_time: string;
          description: string;
          is_active: boolean;
          day: string;
          required_box_watchers: number;
          required_keymen: number;
          assigned_volunteers: string[];
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          name: string;
          start_time: string;
          end_time: string;
          description: string;
          is_active?: boolean;
          day: string;
          required_box_watchers?: number;
          required_keymen?: number;
          assigned_volunteers?: string[];
        };
        Update: {
          id?: number;
          name?: string;
          start_time?: string;
          end_time?: string;
          description?: string;
          is_active?: boolean;
          day?: string;
          required_box_watchers?: number;
          required_keymen?: number;
          assigned_volunteers?: string[];
          updated_at?: string;
        };
      };
      boxes: {
        Row: {
          id: number;
          location: string;
          is_at_entrance: boolean;
          assigned_watcher: string | null;
          current_shift: number | null;
          status: 'assigned' | 'active' | 'returned' | 'needs_attention';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: number;
          location: string;
          is_at_entrance?: boolean;
          assigned_watcher?: string | null;
          current_shift?: number | null;
          status?: 'assigned' | 'active' | 'returned' | 'needs_attention';
        };
        Update: {
          id?: number;
          location?: string;
          is_at_entrance?: boolean;
          assigned_watcher?: string | null;
          current_shift?: number | null;
          status?: 'assigned' | 'active' | 'returned' | 'needs_attention';
          updated_at?: string;
        };
      };
    };
  };
}