# Mentorship API Specification

> **Purpose**: Detailed API requirements for the mentorship feature. This document outlines what the frontend expects from the backend.

---

## Table of Contents

1. [Flow Overview](#flow-overview)
2. [Data Models](#data-models)
3. [API Endpoints](#api-endpoints)
4. [Request/Response Examples](#requestresponse-examples)
5. [Business Logic Requirements](#business-logic-requirements)
6. [Status Transitions](#status-transitions)

---

## Flow Overview

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                           MENTORSHIP FLOW                                    │
├─────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  MENTOR SETUP                                                                │
│  ────────────                                                                │
│  1. Mentor sets weekly availability (days + time slots)                      │
│  2. Mentor sets session duration (30/45/60/90/120 mins)                      │
│  3. Mentor sets buffer time between sessions (0/15/30/45 mins)               │
│  4. Mentor sets default meeting location (Google Meet, Zoom, etc.)           │
│                                                                              │
│  MENTEE BOOKING                                                              │
│  ──────────────                                                              │
│  1. Mentee browses mentors on /mentorship                                    │
│  2. Mentee views mentor profile on /mentorship/[id]                          │
│  3. Mentee selects available date + time slot                                │
│  4. Mentee clicks "Book Session" → Modal opens                               │
│  5. Mentee selects topic (from mentor's expertise)                           │
│  6. Mentee writes message/goals                                              │
│  7. Mentee submits → Creates MentorshipRequest with status "pending"         │
│                                                                              │
│  MENTOR REVIEW                                                               │
│  ─────────────                                                               │
│  1. Mentor sees request on /applications                                     │
│  2. Mentor can Accept → Creates Session with status "upcoming"               │
│  3. Mentor can Reject → Request status becomes "rejected"                    │
│                                                                              │
│  SESSION MANAGEMENT                                                          │
│  ──────────────────                                                          │
│  1. Mentor manages sessions on /sessions                                     │
│  2. Mentee views sessions on /mentorship (My Session tab)                    │
│  3. Both can cancel upcoming sessions                                        │
│  4. Mentor marks session as complete after it happens                        │
│                                                                              │
└─────────────────────────────────────────────────────────────────────────────┘
```

---

## Data Models

### 1. MentorAvailability

Stores the mentor's weekly recurring availability pattern.

```typescript
interface MentorAvailability {
  mentorId: string;
  sessionDuration: number; // Minutes: 30 | 45 | 60 | 90 | 120
  bufferTime: number; // Minutes: 0 | 15 | 30 | 45
  timezone: string; // "WAT" | "GMT" | "EST" | etc.
  defaultLocation: string; // "Google Meet" | "Zoom" | custom URL
  slots: AvailabilitySlot[];
}

interface AvailabilitySlot {
  dayOfWeek: number; // 0 = Monday, 6 = Sunday
  startTime: string; // "09:00" (24hr format)
  endTime: string; // "10:00" (24hr format)
}
```

**Notes:**

- Slots are weekly recurring (not date-specific)
- Backend generates actual available dates when mentee requests slots
- Exclude already-booked slots when generating available dates

---

### 2. MentorshipRequest

Created when a mentee books a session (pending mentor approval).

```typescript
interface MentorshipRequest {
  id: string;

  // Who is requesting
  menteeId: string;
  mentee: {
    id: string;
    name: string;
    avatar?: string;
    title: string;
    company: string;
  };

  // Who they're requesting
  mentorId: string;

  // Session details
  topic: string; // Selected from mentor's expertise
  message: string; // Mentee's goals/what they want to discuss
  scheduledDate: string; // "Mon Feb 5, 2024" or ISO date
  scheduledTime: string; // "2:00 PM" or "14:00"
  duration: string; // "60 mins" (from mentor's settings)
  location: string; // "Google Meet" (from mentor's default)

  // Metadata
  requestedAt: string; // ISO datetime when request was submitted
  status: "pending" | "accepted" | "rejected";

  // Optional
  rejectedAt?: string; // ISO datetime if rejected
  rejectionReason?: string; // Why mentor rejected
}
```

---

### 3. Session

Created when mentor accepts a MentorshipRequest.

```typescript
interface Session {
  id: string;

  // Original request reference
  requestId: string;

  // Participants
  mentorId: string;
  mentor: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
  };

  menteeId: string;
  mentee: {
    id: string;
    name: string;
    avatar?: string;
    title?: string;
    company?: string;
  };

  // Session details
  topic: string;
  message?: string;
  date: string; // "Thu Dec 1, 2:00 PM"
  duration: string; // "60 mins"
  location: string; // "Google Meet"
  meetingLink?: string; // Actual meeting URL

  // Status
  status: "upcoming" | "completed" | "cancelled";

  // Metadata
  createdAt: string; // When session was created (request accepted)
  completedAt?: string; // When marked complete
  cancelledAt?: string; // When cancelled
  cancelledBy?: "mentor" | "mentee";
  cancelReason?: string;
}
```

---

### 4. Mentor Profile (Mentorship-related fields)

Additional fields needed on MentorProfile for mentorship.

```typescript
interface MentorProfile {
  // ... existing fields ...

  // Mentorship-specific
  expertise: string[]; // ["Data Analysis", "Machine Learning", "Python"]
  pricePerSession: number; // In USD or local currency
  sessionDuration: number; // Default session length in minutes
  defaultLocation: string; // Default meeting platform
  sessionsCompleted: number; // Total completed sessions (for display)

  // Availability (can be separate or embedded)
  availability?: MentorAvailability;
}
```

---

## API Endpoints

### Availability APIs (Mentor)

| Method | Endpoint                                 | Description                                        |
| ------ | ---------------------------------------- | -------------------------------------------------- |
| `GET`  | `/api/mentor/availability`               | Get current mentor's availability settings         |
| `PUT`  | `/api/mentor/availability`               | Save/update availability settings                  |
| `GET`  | `/api/mentors/:mentorId/available-slots` | Get available slots for booking (Mentee uses this) |

---

### Mentorship Request APIs

| Method | Endpoint                              | Description                      | Actor  |
| ------ | ------------------------------------- | -------------------------------- | ------ |
| `POST` | `/api/mentorship/request`             | Create booking request           | Mentee |
| `GET`  | `/api/mentor/requests`                | Get all requests for mentor      | Mentor |
| `GET`  | `/api/mentor/requests?status=pending` | Filter by status                 | Mentor |
| `POST` | `/api/mentor/requests/:id/accept`     | Accept request (creates Session) | Mentor |
| `POST` | `/api/mentor/requests/:id/reject`     | Reject request                   | Mentor |

---

### Session APIs

| Method | Endpoint                               | Description           | Actor  |
| ------ | -------------------------------------- | --------------------- | ------ |
| `GET`  | `/api/mentor/sessions`                 | Get mentor's sessions | Mentor |
| `GET`  | `/api/mentor/sessions?status=upcoming` | Filter by status      | Mentor |
| `GET`  | `/api/mentee/sessions`                 | Get mentee's sessions | Mentee |
| `GET`  | `/api/mentee/sessions?status=pending`  | Filter by status      | Mentee |
| `POST` | `/api/sessions/:id/complete`           | Mark as complete      | Mentor |
| `POST` | `/api/sessions/:id/cancel`             | Cancel session        | Both   |
| `PUT`  | `/api/sessions/:id/reschedule`         | Change date/time      | Mentor |

---

## Request/Response Examples

### 1. Save Availability

**Request:** `PUT /api/mentor/availability`

```json
{
  "sessionDuration": 60,
  "bufferTime": 15,
  "timezone": "WAT",
  "defaultLocation": "Google Meet",
  "slots": [
    { "dayOfWeek": 0, "startTime": "09:00", "endTime": "10:00" },
    { "dayOfWeek": 0, "startTime": "10:00", "endTime": "11:00" },
    { "dayOfWeek": 0, "startTime": "14:00", "endTime": "15:00" },
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "10:00" },
    { "dayOfWeek": 2, "startTime": "14:00", "endTime": "15:00" }
  ]
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "mentorId": "mentor-123",
    "sessionDuration": 60,
    "bufferTime": 15,
    "timezone": "WAT",
    "defaultLocation": "Google Meet",
    "slots": [...]
  }
}
```

---

### 2. Get Available Slots (for Mentee)

**Request:** `GET /api/mentors/mentor-123/available-slots?startDate=2024-02-01&endDate=2024-02-14`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "mentorId": "mentor-123",
    "sessionDuration": 60,
    "defaultLocation": "Google Meet",
    "availableSlots": [
      {
        "date": "2024-02-05",
        "displayDate": "Mon Feb 5",
        "dayOfWeek": 0,
        "times": [
          { "time": "09:00", "displayTime": "9:00 AM", "available": true },
          { "time": "10:00", "displayTime": "10:00 AM", "available": true },
          { "time": "14:00", "displayTime": "2:00 PM", "available": false }
        ]
      },
      {
        "date": "2024-02-06",
        "displayDate": "Tue Feb 6",
        "dayOfWeek": 1,
        "times": [
          { "time": "09:00", "displayTime": "9:00 AM", "available": true }
        ]
      }
    ]
  }
}
```

**Notes:**

- `available: false` means slot is already booked
- Only return dates within the requested range
- Exclude past dates/times
- Apply buffer time logic when determining availability

---

### 3. Create Booking Request (Mentee)

**Request:** `POST /api/mentorship/request`

```json
{
  "mentorId": "mentor-123",
  "topic": "Data Analysis",
  "message": "I want to learn more about data visualization and how to present insights effectively to stakeholders.",
  "scheduledDate": "2024-02-05",
  "scheduledTime": "14:00",
  "location": "Google Meet"
}
```

**Response:** `201 Created`

```json
{
  "success": true,
  "data": {
    "id": "request-456",
    "mentorId": "mentor-123",
    "menteeId": "mentee-789",
    "topic": "Data Analysis",
    "message": "I want to learn more about...",
    "scheduledDate": "Mon Feb 5, 2024",
    "scheduledTime": "2:00 PM",
    "duration": "60 mins",
    "location": "Google Meet",
    "status": "pending",
    "requestedAt": "2024-02-03T10:30:00Z"
  }
}
```

**Notes:**

- Backend should validate the slot is still available
- Backend adds `duration` from mentor's settings
- Backend formats date/time for display

---

### 4. Get Mentor's Requests

**Request:** `GET /api/mentor/requests`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "request-456",
      "mentee": {
        "id": "mentee-789",
        "name": "Adaeze Okonkwo",
        "avatar": "https://...",
        "title": "Junior Developer",
        "company": "TechStart Lagos"
      },
      "topic": "Data Analysis",
      "message": "I want to learn more about...",
      "scheduledDate": "Mon Feb 5, 2024",
      "scheduledTime": "2:00 PM",
      "duration": "60 mins",
      "location": "Google Meet",
      "status": "pending",
      "requestedAt": "2024-02-03T10:30:00Z"
    }
  ],
  "meta": {
    "total": 1,
    "pending": 1,
    "accepted": 0,
    "rejected": 0
  }
}
```

---

### 5. Accept Request

**Request:** `POST /api/mentor/requests/request-456/accept`

```json
{
  "meetingLink": "https://meet.google.com/abc-defg-hij"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "request": {
      "id": "request-456",
      "status": "accepted"
    },
    "session": {
      "id": "session-101",
      "mentorId": "mentor-123",
      "menteeId": "mentee-789",
      "topic": "Data Analysis",
      "date": "Mon Feb 5, 2:00 PM",
      "duration": "60 mins",
      "location": "Google Meet",
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "status": "upcoming"
    }
  }
}
```

**Notes:**

- Creates a new Session record
- Updates MentorshipRequest status to "accepted"
- Send notification to mentee

---

### 6. Get Mentee's Sessions

**Request:** `GET /api/mentee/sessions`

**Response:** `200 OK`

```json
{
  "success": true,
  "data": [
    {
      "id": "session-101",
      "mentor": {
        "id": "mentor-123",
        "name": "Johnson Mark",
        "avatar": "https://...",
        "title": "UI/UX Designer At Google"
      },
      "topic": "Data Analysis",
      "message": "I want to learn more about...",
      "date": "Mon Feb 5, 2:00 PM",
      "duration": "60 mins",
      "location": "Google Meet",
      "meetingLink": "https://meet.google.com/abc-defg-hij",
      "status": "upcoming"
    },
    {
      "id": "request-789",
      "mentor": {
        "id": "mentor-456",
        "name": "Lee Sarah",
        "avatar": "https://...",
        "title": "Frontend Developer At Amazon"
      },
      "topic": "Frontend Development",
      "message": "Looking to improve my React skills...",
      "date": "Wed Feb 7, 10:00 AM",
      "duration": "45 mins",
      "location": "Zoom",
      "status": "pending"
    }
  ],
  "meta": {
    "total": 2,
    "pending": 1,
    "upcoming": 1,
    "completed": 0,
    "cancelled": 0
  }
}
```

**Notes:**

- Returns both pending requests AND confirmed sessions
- Frontend uses status to differentiate display
- "pending" = waiting for mentor to accept
- "upcoming" = confirmed, waiting to happen

---

### 7. Cancel Session

**Request:** `POST /api/sessions/session-101/cancel`

```json
{
  "reason": "Schedule conflict - need to reschedule"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "session-101",
    "status": "cancelled",
    "cancelledAt": "2024-02-04T15:00:00Z",
    "cancelledBy": "mentee",
    "cancelReason": "Schedule conflict - need to reschedule"
  }
}
```

---

### 8. Reschedule Session (Mentor only)

**Request:** `PUT /api/sessions/session-101/reschedule`

```json
{
  "date": "2024-02-10",
  "time": "14:00"
}
```

**Response:** `200 OK`

```json
{
  "success": true,
  "data": {
    "id": "session-101",
    "date": "Mon Feb 10, 2:00 PM",
    "status": "upcoming"
  }
}
```

---

## Business Logic Requirements

### 1. Slot Availability Validation

When mentee books a slot:

1. Check the slot exists in mentor's weekly availability
2. Check the specific date/time is not already booked
3. Check the time hasn't passed
4. Consider buffer time (don't allow booking too close to existing session)

```
Example:
- Mentor has 60-min sessions with 15-min buffer
- Session booked at 2:00 PM ends at 3:00 PM
- Next available slot is 3:15 PM (not 3:00 PM)
```

### 2. Auto-Session Creation

When mentor accepts a request:

1. Create Session record with all data from MentorshipRequest
2. Update MentorshipRequest.status to "accepted"
3. Mark the time slot as booked (prevent double-booking)
4. Send notification to mentee

### 3. Session Status Flow

```
MentorshipRequest:
  pending → accepted (creates Session)
  pending → rejected

Session:
  upcoming → completed (by mentor)
  upcoming → cancelled (by mentor or mentee)
```

### 4. Notifications to Send

| Event                         | Notify |
| ----------------------------- | ------ |
| New request submitted         | Mentor |
| Request accepted              | Mentee |
| Request rejected              | Mentee |
| Session cancelled             | Both   |
| Session rescheduled           | Mentee |
| Session reminder (24h before) | Both   |

---

## Status Transitions

### MentorshipRequest Status

```
┌─────────┐
│ pending │
└────┬────┘
     │
     ├──── Mentor accepts ────► accepted (+ creates Session)
     │
     └──── Mentor rejects ────► rejected
```

### Session Status

```
┌──────────┐
│ upcoming │
└────┬─────┘
     │
     ├──── Mentor completes ────► completed
     │
     └──── Anyone cancels ──────► cancelled
```

---

## Frontend Pages Summary

| Page          | URL                 | Actor  | Purpose                       |
| ------------- | ------------------- | ------ | ----------------------------- |
| Availability  | `/availability`     | Mentor | Set weekly time slots         |
| Applications  | `/applications`     | Mentor | Review/accept/reject requests |
| Sessions      | `/sessions`         | Mentor | Manage confirmed sessions     |
| Mentorship    | `/mentorship`       | Mentee | Browse mentors                |
| Mentor Detail | `/mentorship/[id]`  | Mentee | View & book mentor            |
| My Sessions   | `/mentorship` (tab) | Mentee | View their sessions           |

---

## Questions for Backend

1. **Booking window**: How far in advance can mentees book? (e.g., max 2 weeks)
2. **Cancellation policy**: Minimum notice required to cancel? (e.g., 24 hours)
3. **Meeting links**: Auto-generate via Google Calendar API or manual entry?
4. **Timezone handling**: Store in UTC, convert on display?
5. **Payment integration**: When is payment captured? On booking or after session?

---

_Document created: February 2024_
_Frontend Team - TalentNG_
