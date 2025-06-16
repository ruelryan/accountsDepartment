# Convention Accounts Department Management System

A comprehensive volunteer management system for convention accounts departments, built with React, TypeScript, and Supabase.

## Features

### 🔐 Real-time Data Synchronization
- **Supabase Integration**: All changes sync in real-time across all users
- **Offline Support**: Works offline with automatic sync when connection is restored
- **Live Updates**: See changes made by other admins instantly

### 👥 Volunteer Management
- Complete volunteer database with roles and privileges
- Gender-based role restrictions (keymen must be brothers)
- Conflict detection for scheduling overlaps
- Bulk assignment tools

### 📅 Shift Scheduling
- 12 shifts across 3 days (Friday-Sunday)
- Visual shift timeline and assignment interface
- Box watcher assignments (10 per shift)
- Keyman assignments (3 per shift)
- Money counting session management

### 📊 Real-time Dashboard
- Live status overview with statistics
- Interactive floor plan with box locations
- Box tracking with status updates
- Emergency alert system

### 📱 Responsive Design
- Mobile-friendly interface
- Touch-optimized controls
- Progressive web app capabilities

## Technology Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Backend**: Supabase (PostgreSQL + Real-time)
- **Icons**: Lucide React
- **Build Tool**: Vite

## Setup Instructions

### 1. Supabase Setup

1. Create a new project at [supabase.com](https://supabase.com)
2. Go to Settings > API to get your project URL and anon key
3. Copy `.env.example` to `.env` and add your Supabase credentials:

```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### 2. Database Setup

1. In your Supabase dashboard, go to SQL Editor
2. Copy and run the migration file: `supabase/migrations/001_initial_schema.sql`
3. This will create all necessary tables and security policies

### 3. Local Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev
```

### 4. Admin Access

- **Username**: `admin`
- **Password**: `accounts2025`

## Key Features Explained

### Real-time Synchronization
The system uses Supabase's real-time features to ensure all users see the same data:
- Changes made by one admin are instantly visible to all other users
- Connection status indicator shows online/offline state
- Automatic conflict resolution and data consistency

### Volunteer Portal
Public-facing interface where volunteers can:
- Search for their assignments by name
- View detailed shift information and instructions
- See convention floor plan with their box locations
- Access role-specific guidelines and procedures

### Admin Dashboard
Comprehensive management interface with:
- Live statistics and status overview
- Shift timeline with assignment tracking
- Interactive floor plan for box management
- Quick actions for alerts and reporting

### Assignment System
Intelligent assignment tools that:
- Prevent scheduling conflicts automatically
- Enforce gender restrictions for specific roles
- Track money counting session requirements
- Provide visual feedback for incomplete assignments

## Data Structure

### Volunteers
- Personal information (name, gender)
- Role assignments with shift details
- Privilege levels (box_watcher, keyman, money_counter)
- Status tracking (assigned, checked_in, active, completed)

### Shifts
- 4 shifts per day across 3 days
- Time ranges and descriptions
- Required volunteer counts
- Assignment tracking

### Boxes
- 10 contribution boxes (7 main hall, 3 entrance/exit)
- Location tracking
- Status management
- Shift assignments

## Security

- Row Level Security (RLS) enabled on all tables
- Public access policies for demo purposes
- In production, implement proper authentication and authorization
- Real-time subscriptions with automatic cleanup

## Deployment

The application can be deployed to any static hosting service:

```bash
# Build for production
npm run build

# Deploy dist/ folder to your hosting service
```

Recommended platforms:
- Netlify
- Vercel
- GitHub Pages

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is licensed under the MIT License.