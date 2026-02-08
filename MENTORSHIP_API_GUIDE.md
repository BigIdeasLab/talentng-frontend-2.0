# Mentorship API Guide

> **For Frontend Developers** - Complete guide to integrating the mentorship feature.

---

## Table of Contents

1. [Overview](#overview)
2. [Authentication](#authentication)
3. [The Complete Flow](#the-complete-flow)
4. [API Reference](#api-reference)
   - [Discovery (Public)](#1-discovery-public---mentors)
   - [Mentor Dashboard (Auth)](#2-mentor-dashboard-auth---mentor)
   - [Requests (Auth)](#3-requests-auth---requests)
   - [Sessions (Auth)](#4-sessions-auth---sessions)
5. [Status Definitions](#status-definitions)
6. [Error Handling](#error-handling)
7. [Example Flows](#example-flows)

---

## Overview

The mentorship API is organized into 4 controllers:

| Controller | Auth Required | Purpose |
|------------|---------------|---------|
| `/mentors` | ❌ No | Public mentor discovery |
| `/mentor` | ✅ Yes | Authenticated mentor's own data |
| `/requests` | ✅ Yes | Mentorship request management |
| `/sessions` | ✅ Yes | Confirmed session management |

**Base URL:** `https://api.talentng.com/api` (or your environment URL)

---

## Authentication

All authenticated endpoints require a JWT token in the `Authorization` header:

```
Authorization: Bearer <your-jwt-token>
```

---

## The Complete Flow

```
┌──────────────────────────────────────────────────────────────────────────────┐
│                           MENTORSHIP FLOW                                    │
├──────────────────────────────────────────────────────────────────────────────┤
│                                                                              │
│  1. SETUP (Mentor)                                                           │
│     └─► PUT /mentor/availability                                             │
│         Set weekly availability + session duration + buffer time              │
│                                                                              │
│  2. DISCOVERY (Mentee)                                                       │
│     ├─► GET /mentors                    List all mentors                     │
│     ├─► GET /mentors/search?q=...       Search mentors                       │
│     ├─► GET /mentors/:id                View mentor profile                  │
│     ├─► GET /mentors/:id/reviews        Read reviews                         │
│     └─► GET /mentors/:id/availability   See available times                  │
│                                                                              │
│  3. REQUEST (Mentee → Mentor)                                                │
│     ├─► POST /requests                  Mentee sends request                 │
│     │   (status: "pending")                                                  │
│     │                                                                        │
│     ├─► POST /requests/:id/accept       Mentor accepts                       │
│     │   (status: "accepted" → Booking created with "confirmed" status)       │
│     │                                                                        │
│     └─► POST /requests/:id/reject       Mentor rejects                       │
│         (status: "rejected")                                                 │
│                                                                              │
│  4. SESSION LIFECYCLE (After Request Accepted)                               │
│     ├─► GET /sessions                   List all sessions                    │
│     ├─► POST /sessions/:id/confirm      Mentor confirms session              │
│     │   (status: "confirmed")                                                │
│     │                                                                        │
│     ├─► PUT /sessions/:id/reschedule    Mentor reschedules                   │
│     ├─► POST /sessions/:id/cancel       Either party cancels                 │
│     │   (status: "cancelled")                                                │
│     │                                                                        │
│     │   ── AUTO (cron every 5 min) ──                                        │
│     ├─► startTime reached              → status: "in_progress"               │
│     ├─► endTime + 15 min passed        → status: "pending_completion"        │
│     │                                                                        │
│     │   ── OR MANUAL ──                                                      │
│     ├─► POST /sessions/:id/complete     Mentor marks complete (after end)    │
│     │   (status: "pending_completion")                                       │
│     │                                                                        │
│  5. COMPLETION CONFIRMATION (Mentee)                                         │
│     ├─► POST /sessions/:id/confirm-completion   Mentee confirms              │
│     │   (status: "completed" — stats counted, review enabled)                │
│     │                                                                        │
│     └─► POST /sessions/:id/dispute              Mentee disputes              │
│         (status: "disputed" — mentor no-show)                                │
│                                                                              │
│  6. REVIEW (After Mentee Confirms Completion)                                │
│     └─► POST /sessions/:id/review       Mentee leaves review                 │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## API Reference

### 1. Discovery (Public) - `/mentors`

These endpoints are **public** and do not require authentication.

---

#### GET /mentors

List all available mentors.

**Response:**
```json
[
  {
    "id": "mentor-profile-123",
    "userId": "user-456",
    "fullName": "John Doe",
    "profileImageUrl": "https://...",
    "headline": "Senior Software Engineer",
    "bio": "10+ years in software development...",
    "expertise": ["Mentoring", "Career guidance", "Mock interviews"],
    "sessionDuration": 60,
    "rating": 4.8,
    "totalReviews": 24,
    "totalSessions": 45
  }
]
```

---

#### GET /mentors/search?q={query}

Search mentors by name, expertise, or bio.

**Query Parameters:**
| Param | Type | Description |
|-------|------|-------------|
| `q` | string | Search query |

**Example:** `GET /mentors/search?q=design`

---

#### GET /mentors/:id

Get a specific mentor's public profile.

**Response:**
```json
{
  "id": "mentor-profile-123",
  "userId": "user-456",
  "fullName": "John Doe",
  "profileImageUrl": "https://...",
  "headline": "Senior Software Engineer",
  "bio": "10+ years in software development...",
  "expertise": ["Mentoring", "Career guidance", "Mock interviews"],
  "location": "Lagos, Nigeria",
  "sessionDuration": 60,
  "bufferTime": 15,
  "timezone": "WAT",
  "defaultMeetingLink": "https://meet.google.com/abc-def-ghi",
  "sessionRate": 5000,
  "sessionCurrency": "NGN",
  "rating": 4.8,
  "totalReviews": 24,
  "totalSessions": 45
}
```

---

#### GET /mentors/:id/reviews

Get reviews for a mentor.

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `page` | number | 1 | Page number |
| `limit` | number | 10 | Items per page (max 50) |

**Response:**
```json
{
  "data": [
    {
      "id": "review-123",
      "rating": 5,
      "comment": "Excellent mentor! Very helpful.",
      "mentee": {
        "id": "user-789",
        "name": "Jane Smith",
        "avatar": "https://..."
      },
      "createdAt": "2024-02-01T10:00:00Z"
    }
  ],
  "meta": {
    "total": 24,
    "page": 1,
    "limit": 10,
    "totalPages": 3
  }
}
```

---

#### GET /mentors/:id/availability

Get available booking times for a mentor. **This is what mentees use to pick a time slot.**

**Query Parameters:**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `startDate` | string | today | Start date (YYYY-MM-DD) |
| `endDate` | string | +14 days | End date (YYYY-MM-DD) |

**Example:** `GET /mentors/123/availability?startDate=2026-02-08&endDate=2026-02-22`

**Response:**
```json
{
  "mentorId": "mentor-profile-123",
  "sessionDuration": 60,
  "bufferTime": 15,
  "timezone": "WAT",
  "slots": [
    {
      "date": "2026-02-09",
      "dayOfWeek": 0,
      "startTime": "09:00",
      "endTime": "10:00",
      "duration": 60
    },
    {
      "date": "2026-02-09",
      "dayOfWeek": 0,
      "startTime": "10:00",
      "endTime": "11:00",
      "duration": 60
    },
    {
      "date": "2026-02-10",
      "dayOfWeek": 1,
      "startTime": "14:00",
      "endTime": "15:00",
      "duration": 60
    }
  ]
}
```

**Note:** This returns computed available times based on:
- Mentor's weekly availability pattern
- Excluding already booked times (pending, confirmed, rescheduled, in_progress)
- Excluding past times (slots where startTime has already passed)
- All date/time computation is done in UTC

---

### 2. Mentor Dashboard (Auth) - `/mentor`

These endpoints are for the **authenticated mentor's own data**.

---

#### GET /mentor/me

Get the current user's mentor profile.

**Response:**
```json
{
  "profile": {
    "id": "mentor-profile-123",
    "userId": "user-456",
    "fullName": "John Doe",
    "headline": "Senior Software Engineer",
    "bio": "10+ years in software development...",
    "expertise": ["Mentoring", "Career guidance"],
    "location": "Lagos, Nigeria",
    "profileImageUrl": "https://...",
    "links": { "linkedin": "https://linkedin.com/in/johndoe" },
    "sessionDuration": 60,
    "bufferTime": 15,
    "timezone": "WAT",
    "defaultMeetingLink": "https://meet.google.com/abc",
    "sessionRate": 5000,
    "sessionCurrency": "NGN",
    "visibility": "public"
  },
  "isProfileCreated": true,
  "profileCompleteness": 85,
  "message": "Complete your profile to get started"
}
```

If profile doesn't exist:
```json
{
  "profile": null,
  "isProfileCreated": false,
  "profileCompleteness": 0,
  "message": "Complete your profile to get started"
}
```

> **Note:** `message` is only present when `profileCompleteness < 100`.

---

#### PATCH /mentor/me

Update your mentor profile.

**Request Body (all fields optional):**
```json
{
  "fullName": "John Doe",
  "headline": "Senior Software Engineer",
  "bio": "Updated bio...",
  "expertise": ["Mentoring", "Career guidance", "Mock interviews"],
  "profileImageUrl": "https://example.com/photo.jpg",
  "links": { "linkedin": "https://linkedin.com/in/johndoe" },
  "location": "Lagos, Nigeria",
  "sessionRate": 5000,
  "sessionCurrency": "NGN",
  "visibility": "public"
}
```

| Field | Type | Description |
|-------|------|-------------|
| `fullName` | string | Full name |
| `headline` | string | Profile headline |
| `bio` | string | Mentor biography |
| `expertise` | string[] | Areas of expertise |
| `profileImageUrl` | string (URL) | URL to profile image |
| `links` | object | Social media / website links |
| `location` | string | Location |
| `sessionRate` | number | Amount charged per session (min: 0) |
| `sessionCurrency` | Currency | Currency enum (e.g., `"NGN"`, `"USD"`) |
| `visibility` | Visibility | `"public"` or `"private"` |

---

#### PATCH /mentor/profile-image

Upload a new profile image. Uses `multipart/form-data`.

**Request:**
```
Content-Type: multipart/form-data
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `file` | binary | Yes | The image file to upload |

**Response:** Returns the updated mentor profile.

---

#### GET /mentor/availability

Get your availability settings.

**Response:**
```json
{
  "sessionDuration": 60,
  "bufferTime": 15,
  "timezone": "WAT",
  "defaultMeetingLink": "https://meet.google.com/abc",
  "slots": [
    { "id": "slot-1", "dayOfWeek": 0, "startTime": "09:00", "endTime": "10:00" },
    { "id": "slot-2", "dayOfWeek": 0, "startTime": "10:00", "endTime": "11:00" },
    { "id": "slot-3", "dayOfWeek": 1, "startTime": "14:00", "endTime": "15:00" }
  ]
}
```

---

#### PUT /mentor/availability

Set your availability (replaces existing).

**Request Body:**
```json
{
  "sessionDuration": 60,
  "bufferTime": 15,
  "timezone": "WAT",
  "defaultMeetingLink": "https://meet.google.com/abc-def-ghi",
  "slots": [
    { "dayOfWeek": 0, "startTime": "09:00", "endTime": "10:00" },
    { "dayOfWeek": 0, "startTime": "10:00", "endTime": "11:00" },
    { "dayOfWeek": 0, "startTime": "14:00", "endTime": "15:00" },
    { "dayOfWeek": 1, "startTime": "09:00", "endTime": "10:00" }
  ]
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `slots` | array | Yes | Weekly recurring availability slots |
| `slots[].dayOfWeek` | number | Yes | 0 = Monday, 1 = Tuesday, ..., 6 = Sunday |
| `slots[].startTime` | string | Yes | HH:mm 24hr format |
| `slots[].endTime` | string | Yes | HH:mm 24hr format |
| `sessionDuration` | number | No | 30, 60, 90, or 120 minutes |
| `bufferTime` | number | No | 0, 15, 30, or 45 minutes between sessions |
| `timezone` | string | No | e.g., `"WAT"` |
| `defaultMeetingLink` | string | No | Default meeting URL |

**Note on `slots`:**
- These are **weekly recurring patterns**, not specific dates
- The backend will generate actual bookable dates from these patterns

---

#### DELETE /mentor/availability/:id

Delete a specific availability pattern.

**Response:**
```json
{
  "message": "Availability pattern deleted"
}
```

---

#### GET /mentor/dashboard

Get dashboard statistics.

**Response:**
```json
{
  "totalMentees": 12,
  "totalEarnings": 250000,
  "totalSessions": 45,
  "pendingBookings": 3,
  "upcomingBookings": 5,
  "avgRating": 4.8,
  "totalReviews": 24
}
```

| Field | Type | Description |
|-------|------|-------------|
| `totalMentees` | number | Unique mentees count |
| `totalEarnings` | number | Earnings from completed sessions |
| `totalSessions` | number | Completed sessions count |
| `pendingBookings` | number | Pending booking requests |
| `upcomingBookings` | number | Upcoming confirmed sessions |
| `avgRating` | number \| null | Average review rating |
| `totalReviews` | number | Total reviews received |

---

#### GET /mentor/reviews?role={role}

Get reviews (received as mentor or given as mentee).

**Query Parameters:**
| Param | Type | Required | Values |
|-------|------|----------|--------|
| `role` | string | Yes | `mentor` or `mentee` |

**Example:** `GET /mentor/reviews?role=mentor`

---

### 3. Requests (Auth) - `/requests`

Manage mentorship requests. Both mentors and mentees use this.

---

#### POST /requests

**Mentee creates a request** to book a session with a mentor.

**Request Body:**
```json
{
  "mentorId": "mentor-profile-123",
  "topic": "Career advice in tech",
  "message": "I'd like to discuss transitioning from frontend to full-stack development.",
  "scheduledDate": "2026-02-10",
  "scheduledTime": "09:00",
  "duration": 60,
  "location": "Google Meet"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `mentorId` | string | Yes | The mentor's **profile ID** (not user ID) |
| `topic` | string | Yes | Main topic for the session |
| `message` | string | No | Additional context/goals |
| `scheduledDate` | string | Yes | Date in YYYY-MM-DD format |
| `scheduledTime` | string | Yes | Time in HH:mm 24hr format (e.g., `"14:00"`) |
| `duration` | number | No | Session duration in minutes (15-180, defaults to mentor's setting) |
| `location` | string | No | Meeting location (defaults to mentor's link) |

---

#### GET /requests

Get your requests (as mentor or mentee).

**Query Parameters:**
| Param | Type | Values | Description |
|-------|------|--------|-------------|
| `role` | string | `sent` / `received` | Filter by role |
| `status` | string | `pending` / `accepted` / `rejected` / `cancelled` | Filter by status |

**Examples:**
- Mentee viewing sent requests: `GET /requests?role=sent`
- Mentor viewing pending requests: `GET /requests?role=received&status=pending`

---

#### GET /requests/my-requests/:mentorId

Get your active requests for a specific mentor. **Use this to block already-booked slots in the booking UI.**

**Example:** `GET /requests/my-requests/mentor-profile-123`

---

#### GET /requests/pending-count

Get count of pending requests (for notification badge).

**Response:**
```
3
```

> **Note:** Returns a plain number, not a JSON object.

---

#### GET /requests/:id

Get details of a specific request.

---

#### POST /requests/:id/accept

**Mentor accepts** a request. This creates a booking with `confirmed` status.

---

#### POST /requests/:id/reject

**Mentor rejects** a request.

**Request Body (optional):**
```json
{
  "reason": "I'm not taking new mentees at this time."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | No | Reason for rejection |

---

#### PATCH /requests/:id

**Update a request** (generic status update).

---

#### PATCH /requests/:id/cancel

**Mentee cancels** their own pending request.

---

### 4. Sessions (Auth) - `/sessions`

Manage confirmed sessions. Both mentors and mentees use this.

---

#### GET /sessions

Get your sessions.

**Query Parameters:**
| Param | Type | Values | Description |
|-------|------|--------|-------------|
| `role` | string | `mentor` / `mentee` | Filter by role |
| `status` | string | `pending` / `confirmed` / `rescheduled` / `in_progress` / `pending_completion` / `completed` / `disputed` / `cancelled` | Filter by status |
| `upcoming` | boolean | `true` / `false` | Show only upcoming sessions (startTime >= now) |
| `past` | boolean | `true` / `false` | Show only past sessions (startTime < now) |

**Examples:**
- Mentor viewing upcoming: `GET /sessions?role=mentor&upcoming=true`
- Mentee viewing all: `GET /sessions?role=mentee`
- Past sessions: `GET /sessions?past=true`
- In-progress sessions: `GET /sessions?status=in_progress`
- Pending mentee confirmation: `GET /sessions?role=mentee&status=pending_completion`

---

#### GET /sessions/:id

Get details of a specific session.

---

#### POST /sessions/:id/confirm

**Mentor confirms** a pending session.

---

#### POST /sessions/:id/complete

**Mentor marks** a session as complete. **Can only be called after the session's `endTime` has passed.** Sets status to `pending_completion` — the mentee must then confirm.

---

#### POST /sessions/:id/confirm-completion

**Mentee confirms** the session was actually completed. This is when stats are counted (totalSessions, totalEarnings, totalMentees) and the review becomes available.

---

#### POST /sessions/:id/dispute

**Mentee disputes** the session completion (e.g. mentor no-show). Stats are NOT counted.

---

#### POST /sessions/:id/cancel

**Either party** cancels a session.

**Request Body (optional):**
```json
{
  "reason": "I have a conflict and need to cancel."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `reason` | string | No | Cancellation reason (max 500 chars) |

---

#### PUT /sessions/:id/reschedule

**Mentor reschedules** to a new time.

**Request Body:**
```json
{
  "newStartTime": "2026-02-12T14:00:00.000Z",
  "newEndTime": "2026-02-12T15:00:00.000Z"
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `newStartTime` | ISO datetime | Yes | New start time for the booking |
| `newEndTime` | ISO datetime | Yes | New end time for the booking |

---

#### POST /sessions/:id/review

**Mentee leaves a review** after session is completed (mentee must have confirmed completion first).

**Request Body:**
```json
{
  "rating": 5,
  "comment": "Excellent session! John provided great insights."
}
```

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `rating` | number | Yes | 1-5 stars |
| `comment` | string | No | Review text (max 1000 chars) |

---

## Status Definitions

### Request Status

| Status | Description | Who Can Do | Next Actions |
|--------|-------------|------------|--------------|
| `pending` | Awaiting mentor response | Mentee created | Mentor: accept/reject, Mentee: cancel |
| `accepted` | Mentor accepted → Session created | Mentor | None (moves to session) |
| `rejected` | Mentor declined | Mentor | None |
| `cancelled` | Mentee cancelled | Mentee | None |

### Session (Booking) Status

| Status | Description | How It Happens | Next Actions |
|--------|-------------|----------------|--------------|
| `pending` | Awaiting confirmation | Manual creation | Mentor: confirm, cancel |
| `confirmed` | Confirmed and scheduled | Auto (from accept) or Mentor | Mentor: reschedule, cancel. Auto → `in_progress` |
| `rescheduled` | Rescheduled to a new time | Mentor | Mentor: cancel. Auto → `in_progress` |
| `in_progress` | Session is happening now | Auto (cron: when `startTime` reached) | Auto → `pending_completion` |
| `pending_completion` | Waiting for mentee to confirm | Auto (cron: `endTime` + 15min) or Mentor clicks Complete | Mentee: confirm-completion, dispute |
| `completed` | Session confirmed by both parties | Mentee confirms completion | Mentee: review |
| `disputed` | Mentee disputes completion (e.g. no-show) | Mentee | Admin review |
| `cancelled` | Session was cancelled | Either party | None |

> **Note:** When a mentor accepts a request, the booking is created with `confirmed` status directly. The `pending` status is not used in the standard accept flow.

> **Important:** The "Complete" button (`POST /sessions/:id/complete`) can only be used **after the session's end time has passed**. Calling it before returns `400: "Cannot complete a session before it ends"`.

> **Auto Status Updates:** A cron job runs every 5 minutes and automatically transitions:
> - `confirmed`/`rescheduled` → `in_progress` (when `startTime ≤ now < endTime`)
> - `in_progress` → `pending_completion` (when `endTime + 15 minutes ≤ now`)

---

## Error Handling

All errors return a consistent format:

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request"
}
```

### Common Error Codes

| Code | Meaning |
|------|---------|
| 400 | Bad Request - Invalid input |
| 401 | Unauthorized - Missing or invalid token |
| 403 | Forbidden - Not allowed to perform action |
| 404 | Not Found - Resource doesn't exist |
| 409 | Conflict - Duplicate or invalid state transition |

### Specific Errors

| Scenario | Code | Message |
|----------|------|---------|
| Booking already booked slot | 409 | "Time slot is no longer available" |
| Duplicate request to same mentor | 409 | "You already have a pending request" |
| Accept non-pending request | 409 | "Only pending requests can be accepted" |
| Complete non-eligible session | 400 | "Only confirmed, rescheduled, or in-progress bookings can be completed" |
| Complete before session ends | 400 | "Cannot complete a session before it ends" |
| Confirm completion when not pending | 400 | "Only sessions pending completion can be confirmed" |
| Non-mentee trying to confirm completion | 403 | "Only the mentee can confirm session completion" |
| Dispute when not pending completion | 400 | "Only sessions pending completion can be disputed" |
| Non-mentee trying to dispute | 403 | "Only the mentee can dispute a session" |
| Review non-completed session | 400 | "Can only review completed sessions" |
| Duplicate review | 409 | "You have already reviewed this session" |
| Non-mentor trying to confirm | 403 | "Only the mentor can confirm this session" |

---

## Example Flows

### Flow 1: Mentee Books a Session

```javascript
// 1. Browse mentors
const mentors = await fetch('/api/mentors').then(r => r.json());

// 2. View mentor profile
const mentor = await fetch('/api/mentors/mentor-123').then(r => r.json());

// 3. Check available times (always send startDate as today)
const availability = await fetch(
  '/api/mentors/mentor-123/availability?startDate=2026-02-08&endDate=2026-02-22'
).then(r => r.json());

// 4. Check if you already have an active request for this mentor
const myRequests = await fetch('/api/requests/my-requests/mentor-123', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json());

// 5. Send request with selected time
const request = await fetch('/api/requests', {
  method: 'POST',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    mentorId: 'mentor-123',
    topic: 'Career advice',
    message: 'I want to discuss...',
    scheduledDate: '2026-02-10',
    scheduledTime: '09:00'
  })
}).then(r => r.json());

// 6. Wait for mentor to accept...
// 7. View confirmed session
const sessions = await fetch('/api/sessions?role=mentee&upcoming=true', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json());
```

### Flow 2: Mentor Manages Requests & Sessions

```javascript
// 1. Check pending requests count (for badge)
const count = await fetch('/api/requests/pending-count', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json()); // returns a plain number

// 2. View pending requests
const requests = await fetch('/api/requests?role=received&status=pending', {
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json());

// 3. Accept a request (booking is created with "confirmed" status)
const { booking } = await fetch('/api/requests/request-456/accept', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>' }
}).then(r => r.json());

// 4. Session automatically becomes "in_progress" when startTime is reached
//    Session automatically becomes "pending_completion" after endTime + 15 min
//    OR mentor can manually mark complete after the session ends:
await fetch(`/api/sessions/${booking.id}/complete`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <token>' }
});
// → status is now "pending_completion" (NOT "completed")

// 5. Mentee must confirm the session actually happened:
await fetch(`/api/sessions/${booking.id}/confirm-completion`, {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <mentee-token>' }
});
// → status is now "completed", stats are counted, review is enabled
```

### Flow 3: Mentor Sets Up Availability

```javascript
// Set weekly availability
await fetch('/api/mentor/availability', {
  method: 'PUT',
  headers: {
    'Authorization': 'Bearer <token>',
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({
    sessionDuration: 60,
    bufferTime: 15,
    timezone: 'WAT',
    defaultMeetingLink: 'https://meet.google.com/abc-def-ghi',
    slots: [
      // Monday 9 AM - 12 PM (3 slots)
      { dayOfWeek: 0, startTime: '09:00', endTime: '10:00' },
      { dayOfWeek: 0, startTime: '10:00', endTime: '11:00' },
      { dayOfWeek: 0, startTime: '11:00', endTime: '12:00' },
      // Tuesday 2 PM - 4 PM (2 slots)
      { dayOfWeek: 1, startTime: '14:00', endTime: '15:00' },
      { dayOfWeek: 1, startTime: '15:00', endTime: '16:00' }
    ]
  })
});
```

### Flow 4: Mentee Disputes a Session (Mentor No-Show)

```javascript
// If the mentor didn't show up, the mentee can dispute instead of confirming:
await fetch('/api/sessions/session-789/dispute', {
  method: 'POST',
  headers: { 'Authorization': 'Bearer <mentee-token>' }
});
// → status is now "disputed", stats are NOT counted
```

---

## Quick Reference

| Action | Method | Endpoint | Auth |
|--------|--------|----------|------|
| List mentors | GET | `/mentors` | ❌ |
| Search mentors | GET | `/mentors/search?q=...` | ❌ |
| Get mentor profile | GET | `/mentors/:id` | ❌ |
| Get mentor reviews | GET | `/mentors/:id/reviews` | ❌ |
| Get available times | GET | `/mentors/:id/availability` | ❌ |
| Get my mentor profile | GET | `/mentor/me` | ✅ |
| Update my profile | PATCH | `/mentor/me` | ✅ |
| Upload profile image | PATCH | `/mentor/profile-image` | ✅ |
| Get my availability | GET | `/mentor/availability` | ✅ |
| Set my availability | PUT | `/mentor/availability` | ✅ |
| Delete availability | DELETE | `/mentor/availability/:id` | ✅ |
| Get dashboard stats | GET | `/mentor/dashboard` | ✅ |
| Get my reviews | GET | `/mentor/reviews?role=...` | ✅ |
| Create request | POST | `/requests` | ✅ |
| List requests | GET | `/requests` | ✅ |
| My requests for mentor | GET | `/requests/my-requests/:mentorId` | ✅ |
| Get pending count | GET | `/requests/pending-count` | ✅ |
| Get request | GET | `/requests/:id` | ✅ |
| Accept request | POST | `/requests/:id/accept` | ✅ (Mentor) |
| Reject request | POST | `/requests/:id/reject` | ✅ (Mentor) |
| Update request | PATCH | `/requests/:id` | ✅ |
| Cancel request | PATCH | `/requests/:id/cancel` | ✅ (Mentee) |
| List sessions | GET | `/sessions` | ✅ |
| Get session | GET | `/sessions/:id` | ✅ |
| Confirm session | POST | `/sessions/:id/confirm` | ✅ (Mentor) |
| Complete session | POST | `/sessions/:id/complete` | ✅ (Mentor, after endTime) |
| Confirm completion | POST | `/sessions/:id/confirm-completion` | ✅ (Mentee) |
| Dispute session | POST | `/sessions/:id/dispute` | ✅ (Mentee) |
| Cancel session | POST | `/sessions/:id/cancel` | ✅ (Either) |
| Reschedule session | PUT | `/sessions/:id/reschedule` | ✅ (Mentor) |
| Leave review | POST | `/sessions/:id/review` | ✅ (Mentee) |

---

*Document created: February 2024*
*Last updated: February 2026*
*API Version: 2.0*
