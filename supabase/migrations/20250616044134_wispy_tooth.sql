/*
  # Initial Convention Accounts Schema

  1. New Tables
    - `volunteers`
      - `id` (text, primary key)
      - `first_name` (text)
      - `last_name` (text)
      - `gender` (text, check constraint)
      - `roles` (jsonb array)
      - `is_available` (boolean)
      - `contact_info` (text, nullable)
      - `privileges` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `shifts`
      - `id` (integer, primary key)
      - `name` (text)
      - `start_time` (text)
      - `end_time` (text)
      - `description` (text)
      - `is_active` (boolean)
      - `day` (text)
      - `required_box_watchers` (integer)
      - `required_keymen` (integer)
      - `assigned_volunteers` (text array)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

    - `boxes`
      - `id` (integer, primary key)
      - `location` (text)
      - `is_at_entrance` (boolean)
      - `assigned_watcher` (text, nullable)
      - `current_shift` (integer, nullable)
      - `status` (text, check constraint)
      - `created_at` (timestamptz)
      - `updated_at` (timestamptz)

  2. Security
    - Enable RLS on all tables
    - Add policies for public read/write access (for demo purposes)
*/

-- Create volunteers table
CREATE TABLE IF NOT EXISTS volunteers (
  id text PRIMARY KEY,
  first_name text NOT NULL,
  last_name text NOT NULL,
  gender text NOT NULL CHECK (gender IN ('male', 'female')),
  roles jsonb DEFAULT '[]'::jsonb,
  is_available boolean DEFAULT true,
  contact_info text,
  privileges text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create shifts table
CREATE TABLE IF NOT EXISTS shifts (
  id integer PRIMARY KEY,
  name text NOT NULL,
  start_time text NOT NULL,
  end_time text NOT NULL,
  description text NOT NULL,
  is_active boolean DEFAULT false,
  day text NOT NULL,
  required_box_watchers integer DEFAULT 10,
  required_keymen integer DEFAULT 3,
  assigned_volunteers text[] DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create boxes table
CREATE TABLE IF NOT EXISTS boxes (
  id integer PRIMARY KEY,
  location text NOT NULL,
  is_at_entrance boolean DEFAULT false,
  assigned_watcher text,
  current_shift integer,
  status text NOT NULL DEFAULT 'assigned' CHECK (status IN ('assigned', 'active', 'returned', 'needs_attention')),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE volunteers ENABLE ROW LEVEL SECURITY;
ALTER TABLE shifts ENABLE ROW LEVEL SECURITY;
ALTER TABLE boxes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (for demo purposes)
-- In production, you would want more restrictive policies

CREATE POLICY "Public read access for volunteers"
  ON volunteers
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public write access for volunteers"
  ON volunteers
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read access for shifts"
  ON shifts
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public write access for shifts"
  ON shifts
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Public read access for boxes"
  ON boxes
  FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Public write access for boxes"
  ON boxes
  FOR ALL
  TO public
  USING (true)
  WITH CHECK (true);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_volunteers_updated_at
  BEFORE UPDATE ON volunteers
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_shifts_updated_at
  BEFORE UPDATE ON shifts
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_boxes_updated_at
  BEFORE UPDATE ON boxes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();