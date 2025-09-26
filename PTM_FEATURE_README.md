# Parent-Teacher Meeting (PTM) Feature

This document describes the Parent-Teacher Meeting functionality added to the School Platform.

## Overview

The PTM feature allows teachers to schedule meetings with parents and parents to view and confirm these meetings. The system includes:

- **Teacher Dashboard**: Schedule PTM, view scheduled meetings, update meeting status
- **Parent Dashboard**: View scheduled meetings, confirm meetings, see meeting details
- **Backend APIs**: Complete CRUD operations for PTM management

## Database Schema

The PTM feature uses a PostgreSQL table with the following structure:

```sql
CREATE TABLE ptms (
  id SERIAL PRIMARY KEY,
  teacher_id INTEGER NOT NULL REFERENCES Users(id),
  parent_id INTEGER NOT NULL REFERENCES Users(id),
  student_id INTEGER NOT NULL REFERENCES Students(id),
  meeting_date DATE NOT NULL,
  meeting_time TIME NOT NULL,
  duration INTEGER DEFAULT 30,
  reason TEXT NOT NULL,
  agenda TEXT,
  status ENUM('scheduled', 'confirmed', 'completed', 'cancelled') DEFAULT 'scheduled',
  location VARCHAR(255),
  notes TEXT,
  created_by INTEGER NOT NULL,
  createdAt TIMESTAMP,
  updatedAt TIMESTAMP
);
```

## API Endpoints

### Teacher Endpoints

- `POST /teacher/ptm` - Schedule a new PTM
- `GET /teacher/ptms` - Get all PTMs for the teacher (with optional status filter)
- `PUT /teacher/ptm/:ptmId/status` - Update PTM status
- `GET /teacher/students-for-ptm` - Get all students with parent information

### Parent Endpoints

- `GET /parent/ptms` - Get all PTMs for the parent (with optional status filter)
- `PUT /parent/ptm/:ptmId/confirm` - Confirm a PTM
- `GET /parent/ptm/:ptmId` - Get specific PTM details

## Setup Instructions

### 1. Database Setup

The PTM table will be automatically created when you start the server. If you need to create it manually:

```bash
cd backend
npm run create-ptm-table
```

### 2. Seed Test Data

To create test users (teachers, parents, students) for testing the PTM feature:

```bash
cd backend
npm run seed-ptm-data
```

This will create:
- 2 Teacher accounts
- 3 Parent accounts
- 3 Student accounts (linked to parents)

### 3. Test Accounts

After running the seed script, you can use these accounts:

**Teachers:**
- Email: `teacher1@school.com`, Password: `teacher123` (John Smith)
- Email: `teacher2@school.com`, Password: `teacher123` (Jane Doe)

**Parents:**
- Email: `parent1@example.com`, Password: `parent123` (Michael Johnson - Alice's parent)
- Email: `parent2@example.com`, Password: `parent123` (Sarah Wilson - Bob's parent)
- Email: `parent3@example.com`, Password: `parent123` (David Brown - Charlie's parent)

## How to Use

### For Teachers

1. **Login** as a teacher using the credentials above
2. **Navigate** to the "Parent-Teacher Meetings" tab in the Teacher Dashboard
3. **Schedule a Meeting**:
   - Select a student from the dropdown (this automatically selects the parent)
   - Choose date and time
   - Set duration (default 30 minutes)
   - Enter reason for the meeting (required)
   - Optionally add agenda and location
   - Click "Schedule Meeting"
4. **Manage Meetings**:
   - View all scheduled meetings
   - Cancel meetings that are in "scheduled" status
   - Mark meetings as "completed" when they are in "confirmed" status

### For Parents

1. **Login** as a parent using the credentials above
2. **Navigate** to the "Parent-Teacher Meetings" tab in the Parent Dashboard
3. **View Meetings**:
   - See all meetings scheduled by teachers
   - View detailed information including date, time, teacher details, reason, agenda, etc.
4. **Confirm Meetings**:
   - Click "Confirm" button on meetings in "scheduled" status
   - Once confirmed, meetings cannot be cancelled by parents

## Meeting Status Flow

1. **Scheduled** - Initial status when teacher creates the meeting
2. **Confirmed** - Parent has confirmed attendance
3. **Completed** - Meeting has taken place (teacher updates this)
4. **Cancelled** - Meeting was cancelled (teacher can do this before confirmation)

## Features

### Teacher Features
- Schedule meetings with specific parents for specific students
- View all their scheduled meetings
- Filter meetings by status
- Update meeting status (cancel, mark complete)
- Add notes to meetings
- Prevent double-booking (system checks for conflicts)

### Parent Features
- View all meetings scheduled by teachers
- Confirm attendance for meetings
- See detailed meeting information
- View meeting history
- Modern, user-friendly interface with color-coded status indicators

### System Features
- **Data Validation**: Ensures all required fields are provided
- **Relationship Validation**: Verifies parent-student relationships
- **Conflict Detection**: Prevents teachers from scheduling overlapping meetings
- **Status Management**: Proper state transitions for meeting lifecycle
- **Responsive Design**: Clean, modern UI with proper visual feedback

## Technical Implementation

### Backend
- **Models**: PostgreSQL models with proper relationships
- **Controllers**: Separate controller methods for teacher and parent operations
- **Routes**: RESTful API design with proper authentication
- **Validation**: Input validation and business logic validation
- **Security**: Role-based access control

### Frontend
- **Component Structure**: Tab-based interface in existing dashboards
- **State Management**: React hooks for local state management
- **API Integration**: Async API calls with proper error handling
- **UI/UX**: Modern, responsive design with visual status indicators
- **Real-time Updates**: Proper state updates after API operations

## Future Enhancements

Potential improvements that could be added:

1. **Notifications**: Email/SMS notifications for meeting reminders
2. **Calendar Integration**: Export to Google Calendar, Outlook
3. **Video Conferencing**: Integration with Zoom/Teams for remote meetings
4. **Meeting Notes**: Collaborative note-taking during meetings
5. **Recurring Meetings**: Support for recurring meeting schedules
6. **Mobile App**: Dedicated mobile application
7. **Analytics**: Reports on meeting frequency, attendance rates
8. **Multi-language**: Support for multiple languages
