# Mentor Flow - Frontend Specification

> **Purpose**: This document outlines the complete mentor-side flow for the mentorship feature, including all data structures, API requirements, and UI interactions.

---

## Table of Contents

1. [Flow Overview](#flow-overview)
2. [Pages & Features](#pages--features)
3. [Data Structures](#data-structures)
4. [API Endpoints Required](#api-endpoints-required)
5. [Flow Diagrams](#flow-diagrams)
6. [Mock Data Examples](#mock-data-examples)

---

## Flow Overview

The mentorship feature follows a 5-stage flow:

| Stage | Actor | Action | Page |
|-------|-------|--------|------|
| 1. Setup | Mentor | Sets availability slots, duration, buffer time | `/availability` |
| 2. Discovery | Mentee | Searches/filters mentors | (Mentee side) |
| 3. Connection | Mentee → Mentor | Mentee picks slot & sends request → Mentor accepts/rejects | `/applications` |
| 4. Booking | Mentor | Views, reschedules, cancels sessions | `/sessions` |
| 5. Session | Mentor | Marks session complete | `/sessions` |
| 6. Review | Mentee | Leaves review (updates mentor stats) | (Mentee side) |

---

## Pages & Features

### 1. Availability Page (`/availability`)

**Purpose**: Mentor sets their weekly availability for mentorship sessions.

**Features**:
- Weekly calendar grid (Mon-Sun)
- Click to toggle time slots (9 AM - 5 PM, 1-hour blocks)
- Session duration setting (30, 60, 90, 120 mins)
- Buffer time between sessions (0, 15, 30, 45 mins)
- Timezone selection
- Quick actions: "Clear All", "Weekdays 9-5", "Mornings Only"

**Data Saved**:
```typescript
interface AvailabilitySettings {
  mentorId: string;
  sessionDuration: number;      // in minutes: 30 | 60 | 90 | 120
  bufferTime: number;           // in minutes: 0 | 15 | 30 | 45
  timezone: string;             // e.g., "WAT", "GMT", "EST"
  slots: AvailabilitySlot[];
}

interface AvailabilitySlot {
  dayOfWeek: number;            // 0 = Monday, 6 = Sunday
  startTime: string;            // "09:00" (24hr format)
  endTime: string;              // "10:00" (24hr format)
}
```

**Example Payload (Save Availability)**:
```json
{
  "mentorId": "mentor-123",
  "sessionDuration": 60,
  "bufferTime": 15,
  "timezone": "WAT",
  "slots": [
    { "dayOfWeek": 0, "startTime": "09:00", "endTime": "10:00" },
    { "dayOfWeek": 0, "startTime": "10:00", "endTime": "11:00" },
    { "dayOfWeek": 0, "startTime": "14:00", "endTime": "15:00" },
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "10:00" },
    { "dayOfWeek": 1, "startTime": "10:00", "endTime": "11:00" }
  ]
}
```

---

### 2. Applications Page (`/applications`)

**Purpose**: Mentor views and responds to incoming mentorship requests.

**Features**:
- List of mentorship requests with mentee info
- Filter by status: All, Pending, Accepted, Rejected
- Accept button → Opens confirmation modal → Creates session
- Decline button → Opens confirmation modal → Rejects request
- Pending count indicator

**Request Card Displays**:
- Mentee avatar (initials), name, title, company
- Topic of interest
- Message from mentee
- Scheduled date & time (slot they picked)
- Session duration
- Meeting location
- Status badge

---

### 3. Sessions Page (`/sessions`)

**Purpose**: Mentor manages confirmed/completed/cancelled sessions.

**Features**:
- Tabs: All, Upcoming, Completed, Cancelled (with counts)
- Search by mentee name or topic
- Session cards with full details
- Actions for upcoming sessions:
  - **Complete** → Confirmation modal → Marks as completed
  - **Reschedule** → Date/time picker modal → Updates session
  - **Cancel** → Confirmation modal → Marks as cancelled

**Session Card Displays**:
- Mentee avatar, name, title, company
- Topic
- Message/notes
- Date & time
- Duration
- Location
- Status badge

---

## Data Structures

### MentorshipRequest (Applications Page)

```typescript
interface MentorshipRequest {
  id: string;
  
  // Mentee Information
  mentee: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    company: string;
  };
  
  // Session Details (from slot mentee selected)
  topic: string;              // Primary topic for mentorship
  message: string;            // Mentee's message/goals
  scheduledDate: string;      // "Mon Feb 5, 2024" - the slot date
  scheduledTime: string;      // "2:00 PM" - the slot time
  duration: string;           // "60 mins" - from mentor's settings
  location: string;           // "Google Meet", "Zoom", etc.
  
  // Meta
  requestedAt: string;        // ISO date when request was submitted
  status: "pending" | "accepted" | "rejected";
}
```

### Session (Sessions Page)

```typescript
interface Session {
  id: string;
  
  // Mentee Information
  mentee: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    company?: string;
  };
  
  // Session Details
  topic: string;
  message?: string;
  date: string;               // "Thu Dec 1, 2:00 PM"
  duration: string;           // "60 mins"
  location: string;           // "Google Meet"
  
  // Status
  status: "upcoming" | "completed" | "cancelled";
  
  // Optional fields
  completedAt?: string;       // ISO date when marked complete
  cancelledAt?: string;       // ISO date when cancelled
  cancelReason?: string;      // Reason for cancellation
}
```

### AvailabilitySlot (Availability Page)

```typescript
interface AvailabilitySlot {
  dayOfWeek: number;          // 0-6 (Mon-Sun)
  startTime: string;          // "09:00"
  endTime: string;            // "10:00"
}

interface AvailabilitySettings {
  mentorId: string;
  sessionDuration: number;    // minutes
  bufferTime: number;         // minutes
  timezone: string;
  slots: AvailabilitySlot[];
}
```

---

## API Endpoints Required

### Availability

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/mentor/availability` | Get mentor's availability settings | - | `AvailabilitySettings` |
| `PUT` | `/api/mentor/availability` | Save/update availability | `AvailabilitySettings` | `AvailabilitySettings` |
| `GET` | `/api/mentor/:id/slots?date=YYYY-MM-DD` | Get available slots for a date (for mentees) | - | `TimeSlot[]` |

### Mentorship Requests

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/mentor/requests` | Get all mentorship requests | - | `MentorshipRequest[]` |
| `GET` | `/api/mentor/requests?status=pending` | Filter by status | - | `MentorshipRequest[]` |
| `POST` | `/api/mentor/requests/:id/accept` | Accept a request (creates session) | - | `Session` |
| `POST` | `/api/mentor/requests/:id/reject` | Reject a request | `{ reason?: string }` | `MentorshipRequest` |

### Sessions

| Method | Endpoint | Description | Request Body | Response |
|--------|----------|-------------|--------------|----------|
| `GET` | `/api/mentor/sessions` | Get all sessions | - | `Session[]` |
| `GET` | `/api/mentor/sessions?status=upcoming` | Filter by status | - | `Session[]` |
| `POST` | `/api/mentor/sessions/:id/complete` | Mark session complete | - | `Session` |
| `POST` | `/api/mentor/sessions/:id/cancel` | Cancel session | `{ reason?: string }` | `Session` |
| `PUT` | `/api/mentor/sessions/:id/reschedule` | Reschedule session | `{ date: string, time: string }` | `Session` |

---

## Flow Diagrams

### Complete Mentorship Flow

```
┌─────────────────────────────────────────────────────────────────┐
│                        MENTOR SETUP                              │
├─────────────────────────────────────────────────────────────────┤
│  1. Mentor sets availability (/availability)                     │
│     - Selects days/times they're available                       │
│     - Sets session duration (60 mins)                            │
│     - Sets buffer time (15 mins)                                 │
│     - Saves to backend                                           │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MENTEE DISCOVERY                            │
├─────────────────────────────────────────────────────────────────┤
│  2. Mentee searches for mentors                                  │
│  3. Mentee views mentor profile                                  │
│  4. Mentee sees mentor's available slots                         │
│  5. Mentee picks a specific slot (e.g., Mon Feb 5, 2:00 PM)     │
│  6. Mentee fills in topic + message                              │
│  7. Mentee submits request                                       │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                    MENTOR APPLICATIONS                           │
├─────────────────────────────────────────────────────────────────┤
│  8. Request appears in mentor's /applications                    │
│  9. Mentor sees:                                                 │
│     - Mentee: "Adaeze Okonkwo, Junior Developer at TechStart"   │
│     - Topic: "Backend Development"                               │
│     - Message: "I want to learn Node.js..."                      │
│     - Scheduled: Mon Feb 5, 2024, 2:00 PM                        │
│     - Duration: 60 mins                                          │
│     - Location: Google Meet                                      │
│  10. Mentor clicks "Accept" or "Decline"                         │
└─────────────────────────────────────────────────────────────────┘
                              │
              ┌───────────────┴───────────────┐
              ▼                               ▼
        [ACCEPTED]                      [DECLINED]
              │                               │
              ▼                               ▼
┌─────────────────────────┐     ┌─────────────────────────┐
│  Session created in     │     │  Request marked as      │
│  /sessions with status  │     │  "rejected"             │
│  "upcoming"             │     │  Mentee notified        │
└─────────────────────────┘     └─────────────────────────┘
              │
              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      MENTOR SESSIONS                             │
├─────────────────────────────────────────────────────────────────┤
│  11. Session appears in /sessions (Upcoming tab)                 │
│  12. Mentor can:                                                 │
│      - Reschedule → Pick new date/time                           │
│      - Cancel → Mark as cancelled                                │
│      - Complete → Mark as done (after session)                   │
└─────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      POST-SESSION                                │
├─────────────────────────────────────────────────────────────────┤
│  13. Mentor marks session as "Complete"                          │
│  14. Mentee receives prompt to leave review                      │
│  15. Review updates mentor's rating/stats                        │
└─────────────────────────────────────────────────────────────────┘
```

### Request → Session Data Flow

```
MentorshipRequest (when accepted)
─────────────────────────────────
        │
        │  Maps to
        ▼
┌─────────────────────────────────────────────────────────────────┐
│  MentorshipRequest          →          Session                   │
├─────────────────────────────────────────────────────────────────┤
│  id                         →          id (new)                  │
│  mentee.id                  →          mentee.id                 │
│  mentee.name                →          mentee.name               │
│  mentee.avatar              →          mentee.avatar             │
│  mentee.title               →          mentee.title              │
│  mentee.company             →          mentee.company            │
│  topic                      →          topic                     │
│  message                    →          message                   │
│  scheduledDate + Time       →          date                      │
│  duration                   →          duration                  │
│  location                   →          location                  │
│  status: "accepted"         →          status: "upcoming"        │
└─────────────────────────────────────────────────────────────────┘
```

---

## Mock Data Examples

### Mentorship Request (Pending)

```json
{
  "id": "req-001",
  "mentee": {
    "id": "mentee-123",
    "name": "Adaeze Okonkwo",
    "avatar": null,
    "title": "Junior Developer",
    "company": "TechStart Lagos"
  },
  "topic": "Backend Development",
  "message": "Hi! I'm looking for guidance on transitioning from frontend to fullstack development. I've been working with React for 2 years and want to learn Node.js and system design.",
  "scheduledDate": "Mon Feb 5, 2024",
  "scheduledTime": "2:00 PM",
  "duration": "60 mins",
  "location": "Google Meet",
  "requestedAt": "2024-02-03T10:30:00Z",
  "status": "pending"
}
```

### Session (Upcoming)

```json
{
  "id": "session-001",
  "mentee": {
    "id": "mentee-123",
    "name": "Adaeze Okonkwo",
    "avatar": null,
    "title": "Junior Developer",
    "company": "TechStart Lagos"
  },
  "topic": "Backend Development",
  "message": "Hi! I'm looking for guidance on transitioning from frontend to fullstack development. I've been working with React for 2 years and want to learn Node.js and system design.",
  "date": "Mon Feb 5, 2024, 2:00 PM",
  "duration": "60 mins",
  "location": "Google Meet",
  "status": "upcoming"
}
```

### Session (Completed)

```json
{
  "id": "session-002",
  "mentee": {
    "id": "mentee-456",
    "name": "Ngozi Abubakar",
    "avatar": null,
    "title": "CS Student",
    "company": "University of Lagos"
  },
  "topic": "Interview Prep",
  "message": "I'm a final year student preparing for tech interviews.",
  "date": "Mon Nov 28, 2024, 4:45 PM",
  "duration": "60 mins",
  "location": "Google Meet",
  "status": "completed",
  "completedAt": "2024-11-28T17:50:00Z"
}
```

### Availability Settings

```json
{
  "mentorId": "mentor-001",
  "sessionDuration": 60,
  "bufferTime": 15,
  "timezone": "WAT",
  "slots": [
    { "dayOfWeek": 0, "startTime": "09:00", "endTime": "10:00" },
    { "dayOfWeek": 0, "startTime": "10:00", "endTime": "11:00" },
    { "dayOfWeek": 0, "startTime": "11:00", "endTime": "12:00" },
    { "dayOfWeek": 0, "startTime": "14:00", "endTime": "15:00" },
    { "dayOfWeek": 0, "startTime": "15:00", "endTime": "16:00" },
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "10:00" },
    { "dayOfWeek": 1, "startTime": "10:00", "endTime": "11:00" },
    { "dayOfWeek": 2, "startTime": "14:00", "endTime": "15:00" },
    { "dayOfWeek": 2, "startTime": "15:00", "endTime": "16:00" },
    { "dayOfWeek": 2, "startTime": "16:00", "endTime": "17:00" }
  ]
}
```

---

## UI Components Created

| Component | Path | Purpose |
|-----------|------|---------|
| Availability Page | `app/(business)/availability/page.tsx` | Weekly availability calendar |
| Applications Page | `app/(business)/applications/page.tsx` | Mentorship request management |
| Sessions Page | `app/(business)/sessions/page.tsx` | Session management |
| SessionCard | `components/mentor/sessions/SessionCard.tsx` | Session display card |
| ConfirmationModal | `components/ui/confirmation-modal.tsx` | Reusable confirm dialog |
| RescheduleModal | `components/ui/reschedule-modal.tsx` | Date/time picker for rescheduling |

---

## Status Definitions

### MentorshipRequest Status

| Status | Description | Next Actions |
|--------|-------------|--------------|
| `pending` | Awaiting mentor response | Accept, Decline |
| `accepted` | Mentor accepted → Session created | - |
| `rejected` | Mentor declined request | - |

### Session Status

| Status | Description | Next Actions |
|--------|-------------|--------------|
| `upcoming` | Scheduled, not yet held | Complete, Cancel, Reschedule |
| `completed` | Session was held | - |
| `cancelled` | Session was cancelled | - |

---

## Notes for Backend

1. **Slot Validation**: When mentee books a slot, validate it's still available (not double-booked)

2. **Timezone Handling**: Store all times in UTC, convert to mentor's timezone for display

3. **Notifications**: Send notifications when:
   - New request received (to mentor)
   - Request accepted/rejected (to mentee)
   - Session rescheduled (to both)
   - Session cancelled (to both)
   - Session reminder (24 hours before)

4. **Session Creation**: When request is accepted, automatically create a session with all the request data

5. **Availability Slots**: Should be generated based on mentor's weekly schedule, excluding:
   - Already booked slots
   - Past times
   - Times within buffer period of existing bookings

---

## Questions for Backend

1. Should we support recurring availability (same every week) or date-specific availability?
2. How far in advance can mentees book? (e.g., max 2 weeks out)
3. Can mentors set different session durations per session type?
4. Do we need a "pending confirmation" state for reschedules?
5. Should cancelled sessions be soft-deleted or kept for records?

---

## Backend Questions - Frontend Answers

### 1. Two-System Clarification

**Q:** MentorshipRequest vs Booking - which do you need?

**A: Option B - MentorshipRequest → auto-creates Booking when accepted**

Our flow:
```
Mentee picks specific slot → Sends MentorshipRequest (with slot info) → 
Mentor accepts → Session/Booking auto-created with "upcoming" status
```

We don't need a separate "connection" step. The request IS the booking request, just pending mentor approval.

---

### 2. Availability Format

**Q:** Weekly recurring or date-specific availability?

**A: Weekly recurring**

Frontend sends:
```json
{ "dayOfWeek": 0, "startTime": "09:00", "endTime": "10:00" }
```

Backend should:
1. Store as weekly pattern
2. Generate available date-specific slots when mentee views (e.g., next 2 weeks)
3. Exclude already-booked slots from generated list

Example: If mentor sets Monday 9-10 AM, backend generates:
- Mon Feb 3, 9:00 AM
- Mon Feb 10, 9:00 AM
- Mon Feb 17, 9:00 AM
- (excluding any already booked)

---

### 3. Session Duration / Buffer

**Q:** Where should these be stored?

**A: Option A - Global mentor settings (on MentorProfile)**

These apply to ALL of the mentor's sessions:
```json
{
  "sessionDuration": 60,    // All sessions are 60 mins
  "bufferTime": 15,         // 15 min gap between sessions
  "timezone": "WAT"
}
```

Not per-slot or per-booking. Keeps it simple.

---

### 4. Meeting Location

**Q:** How should location work?

**A: Option A + C hybrid**

- Mentor sets **default** meeting link in profile settings
- Mentee can **override** when booking (we show this in the request form)
- If mentee doesn't specify, use mentor's default

Request shows:
```json
{
  "location": "Google Meet"  // Mentee's preference or mentor's default
}
```

No auto-generation needed for MVP.

---

### 5. Booking Status Flow

**Q:** Should booking be pending or confirmed immediately?

**A: Option A - Pending until mentor confirms**

Flow:
```
Mentee books slot → status: "pending" (appears in /applications)
Mentor accepts   → status: "confirmed" / "upcoming" (moves to /sessions)
Mentor rejects   → status: "rejected" (stays in /applications as rejected)
```

This gives mentors control and prevents unwanted bookings.

---

### 6. API Path Preference

**Q:** Should we match your exact API paths?

**A: Frontend will adapt**

Use whatever paths make sense for your architecture. We'll update our API calls to match. Just document the final endpoints.

---

## Summary of Answers

| Question | Answer |
|----------|--------|
| Flow type | B - Request → auto-creates Booking on accept |
| Availability | Weekly recurring (backend generates dates) |
| Duration/Buffer | Global mentor settings |
| Location | Mentor default + mentee can override |
| Status flow | Pending until mentor confirms |
| API paths | Frontend will adapt |

---

## Suggested API Contract

Based on answers above:

### Availability
```
GET    /api/mentor/availability          → Get mentor's weekly pattern
PUT    /api/mentor/availability          → Save weekly pattern + settings
GET    /api/mentors/:id/available-slots  → Get available date slots (for mentee booking UI)
         ?startDate=2024-02-01
         &endDate=2024-02-14
```

### Requests/Bookings
```
POST   /api/mentorship/request           → Mentee creates request (with slot)
GET    /api/mentor/requests              → Mentor gets their requests
POST   /api/mentor/requests/:id/accept   → Accept → creates booking
POST   /api/mentor/requests/:id/reject   → Reject request
```

### Sessions (Confirmed Bookings)
```
GET    /api/mentor/sessions              → Get confirmed sessions
POST   /api/mentor/sessions/:id/complete → Mark as complete
POST   /api/mentor/sessions/:id/cancel   → Cancel session
PUT    /api/mentor/sessions/:id/reschedule → Change date/time
```

---

*Document created: February 2024*
*Updated with Backend Q&A: February 2024*
*Frontend Team - TalentNG*
