# Talent Calendar API - Frontend Implementation Guide

## ⚠️ BREAKING CHANGE - Endpoint Renamed

**Date:** 2026-03-05

### Endpoint Change:
- **OLD**: `/api/v1/talent/upcoming` ❌ DEPRECATED
- **NEW**: `/api/v1/talent/calendar` ✅ USE THIS

- **OLD**: `/api/v1/talent/upcoming/count` ❌ DEPRECATED  
- **NEW**: `/api/v1/talent/calendar/count` ✅ USE THIS

### Backward Compatibility:
The old `/upcoming` endpoints still work but are marked as deprecated. Please migrate to `/calendar` as soon as possible.

---

## ⚠️ RECENT UPDATES (Latest Changes)

### Update 1: Endpoint Renamed to Calendar ⭐ NEW
**Date:** 2026-03-05  
**Change:** Endpoint renamed from `/upcoming` to `/calendar` to better reflect that it includes ongoing events.

**Migration Required:**
```typescript
// OLD (deprecated)
GET /api/v1/talent/upcoming
GET /api/v1/talent/upcoming/count

// NEW (use this)
GET /api/v1/talent/calendar
GET /api/v1/talent/calendar/count
```

### Update 2: Ongoing Sessions Now Included ⭐ NEW
**Date:** 2026-03-05  
**Change:** The upcoming endpoint now includes **ongoing sessions** (`in_progress` status).

**What this means:**
- Previously: Only sessions with status `pending` or `confirmed` were shown
- Now: Sessions with status `pending`, `confirmed`, `rescheduled`, AND `in_progress` appear
- **Critical**: Talents can now see and join sessions that are currently happening
- Impact: If a session starts while the talent is viewing the calendar, it will remain visible so they can join

**Session Statuses Included:**
- `pending` - Waiting for mentor confirmation
- `confirmed` - Confirmed sessions
- `rescheduled` - Rescheduled sessions
- `in_progress` - **NEW** - Currently happening sessions (show "Join Now" button!)
- `pending_completion` - **NEW** - Session ended, waiting for mentee to confirm completion (show "Confirm Completion" button!)

**Frontend Action Required:**
1. Handle `in_progress` status in your UI
2. Show prominent "Join Now" button for `in_progress` sessions
3. Consider renaming "Upcoming" to "Calendar" or "Schedule" in UI
4. The count endpoint is also updated to include these statuses

### Update 2: Rescheduled Interviews Now Included
**Date:** Current  
**Change:** The upcoming endpoint now includes interviews with status `rescheduled` in addition to `scheduled`.

**What this means:**
- Previously: Only interviews with status `scheduled` were shown
- Now: Both `scheduled` and `rescheduled` interviews appear in upcoming events
- Impact: Talents will see all their active upcoming interviews, including those that were rescheduled

### Update 3: Meeting Links for Sessions
**Date:** Current  
**Changes:**
1. **Booking Creation**: When a mentorship session is booked, it now automatically includes the mentor's default meeting link
2. **Response Format**: Sessions now return `meetingLink` field instead of `location` for consistency with interviews

**What this means:**
- Both interviews and sessions now have a `meetingLink` field
- The meeting link is automatically populated from the mentor's profile when booking is created
- Frontend can use the same field name for both event types

**Updated Session Object:**
```typescript
{
  id: string;
  type: 'session';
  mentorName: string;
  topic: string;
  scheduledAt: string; // ISO 8601 date
  endTime: string; // ISO 8601 date
  meetingLink?: string; // ✨ NEW - replaces 'location'
  note?: string;
  mentorId: string;
  mentorImage?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}
```

**Migration Guide:**
```typescript
// OLD CODE (before update)
function SessionCard({ session }: { session: Session }) {
  return (
    <div>
      {session.location && (
        <a href={session.location}>Join Meeting</a>
      )}
    </div>
  );
}

// NEW CODE (after update)
function SessionCard({ session }: { session: Session }) {
  return (
    <div>
      {session.meetingLink && (
        <a href={session.meetingLink}>Join Meeting</a>
      )}
    </div>
  );
}
```

---

## Endpoint
```
GET /api/v1/talent/upcoming
```

**Authentication Required:** Yes (Bearer Token)  
**Role Required:** Talent

---

## Overview
This endpoint allows talents to fetch their upcoming interviews and mentorship sessions. It supports search, filtering, and pagination - **following the same pattern as other endpoints** (opportunities, applications, talents, mentors).

---

## Query Parameters

### 1. Search Parameter

#### `q` (string, optional)
Search across multiple fields:
- **Interviews**: Job title, company name
- **Sessions**: Mentor name, session topic

**Example:**
```javascript
// Search for "Frontend"
GET /api/v1/talent/upcoming?q=Frontend

// Search for mentor name
GET /api/v1/talent/upcoming?q=John
```

---

### 2. Filter Parameters

#### `dateRange` (enum, optional)
Filter events by time window from now.

**Valid values:**
- `today` - Events happening today
- `week` - Events in the next 7 days
- `month` - Events in the next 30 days

**Example:**
```javascript
// Get this week's events
GET /api/v1/talent/upcoming?dateRange=week

// Get today's events
GET /api/v1/talent/upcoming?dateRange=today
```

#### `type` (enum, optional)
Filter by event type.

**Valid values:**
- `interview` - Only show interviews
- `session` - Only show mentorship sessions

**Example:**
```javascript
// Only interviews
GET /api/v1/talent/upcoming?type=interview

// Only mentorship sessions
GET /api/v1/talent/upcoming?type=session
```

---

### 3. Pagination Parameters

#### `limit` (number, optional, default: 20)
Number of results per page.

**Example:**
```javascript
GET /api/v1/talent/upcoming?limit=50
```

#### `offset` (number, optional, default: 0)
Number of results to skip (for pagination).

**Example:**
```javascript
// Page 1 (first 20 results)
GET /api/v1/talent/upcoming?limit=20&offset=0

// Page 2 (next 20 results)
GET /api/v1/talent/upcoming?limit=20&offset=20
```

---

## Response Format

```typescript
{
  data: Array<Interview | Session>,
  pagination: {
    total: number,
    limit: number,
    offset: number,
    currentPage: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

### Interview Object
```typescript
{
  id: string;
  type: 'interview';
  company: string;
  position: string;
  scheduledAt: string; // ISO 8601 date
  meetingLink?: string;
  message?: string;
  opportunityId: string;
  logo?: string;
}
```

### Session Object
```typescript
{
  id: string;
  type: 'session';
  mentorName: string;
  topic: string;
  scheduledAt: string; // ISO 8601 date
  endTime: string; // ISO 8601 date
  meetingLink?: string; // Meeting link from mentor's profile
  note?: string;
  mentorId: string;
  mentorImage?: string;
  status: 'confirmed' | 'pending' | 'cancelled' | 'completed';
}
```

---

## Frontend Implementation Examples

### 1. Basic Fetch (React/TypeScript)

```typescript
import { useState, useEffect } from 'react';

interface Interview {
  id: string;
  type: 'interview';
  company: string;
  position: string;
  scheduledAt: string;
  meetingLink?: string;
  logo?: string;
}

interface Session {
  id: string;
  type: 'session';
  mentorName: string;
  topic: string;
  scheduledAt: string;
  endTime: string;
  mentorImage?: string;
  status: string;
}

type UpcomingEvent = Interview | Session;

interface UpcomingResponse {
  data: UpcomingEvent[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

function useUpcomingEvents() {
  const [events, setEvents] = useState<UpcomingEvent[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchEvents = async (params: {
    q?: string;
    dateRange?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();
      
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== '') {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(
        `/api/v1/talent/upcoming?${queryParams.toString()}`,
        {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) throw new Error('Failed to fetch events');

      const data: UpcomingResponse = await response.json();
      setEvents(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error('Error fetching events:', error);
    } finally {
      setLoading(false);
    }
  };

  return { events, pagination, loading, fetchEvents };
}
```

---

### 2. Search Implementation

```typescript
function UpcomingEventsSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchEvents } = useUpcomingEvents();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchEvents({ q: searchTerm, offset: 0 });
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by job title, company, or mentor..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

---

### 3. Filters Implementation

```typescript
function UpcomingEventsFilters() {
  const [filters, setFilters] = useState({
    dateRange: '',
    type: '',
  });
  const { fetchEvents } = useUpcomingEvents();

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchEvents({ ...newFilters, offset: 0 });
  };

  return (
    <div className="filters">
      {/* Date Range Filter */}
      <select
        value={filters.dateRange}
        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
      >
        <option value="">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      {/* Type Filter */}
      <select
        value={filters.type}
        onChange={(e) => handleFilterChange('type', e.target.value)}
      >
        <option value="">All Events</option>
        <option value="interview">Interviews Only</option>
        <option value="session">Sessions Only</option>
      </select>
    </div>
  );
}
```

---

### 4. Event List Component

```typescript
function UpcomingEventsList() {
  const { events, loading } = useUpcomingEvents();

  if (loading) return <div>Loading...</div>;

  return (
    <div className="events-list">
      {events.map((event) => (
        <div key={event.id} className="event-card">
          {event.type === 'interview' ? (
            <InterviewCard interview={event} />
          ) : (
            <SessionCard session={event} />
          )}
        </div>
      ))}
    </div>
  );
}

function InterviewCard({ interview }: { interview: Interview }) {
  return (
    <div className="interview-card">
      {interview.logo && <img src={interview.logo} alt={interview.company} />}
      <div>
        <h3>{interview.position}</h3>
        <p>{interview.company}</p>
        <p>📅 {new Date(interview.scheduledAt).toLocaleString()}</p>
        {interview.meetingLink && (
          <a href={interview.meetingLink} target="_blank" rel="noopener">
            Join Meeting
          </a>
        )}
      </div>
    </div>
  );
}

function SessionCard({ session }: { session: Session }) {
  return (
    <div className="session-card">
      {session.mentorImage && (
        <img src={session.mentorImage} alt={session.mentorName} />
      )}
      <div>
        <h3>{session.topic}</h3>
        <p>with {session.mentorName}</p>
        <p>📅 {new Date(session.scheduledAt).toLocaleString()}</p>
        <p>Status: {session.status}</p>
        {session.meetingLink && (
          <a href={session.meetingLink} target="_blank" rel="noopener">
            Join Meeting
          </a>
        )}
      </div>
    </div>
  );
}
```

---

### 5. Complete Component Example

```typescript
function UpcomingEventsPage() {
  const { events, pagination, loading, fetchEvents } = useUpcomingEvents();
  const [filters, setFilters] = useState({
    q: '',
    dateRange: '',
    type: '',
    limit: 20,
    offset: 0,
  });

  useEffect(() => {
    fetchEvents(filters);
  }, []);

  const handleFilterChange = (updates: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...updates, offset: 0 };
    setFilters(newFilters);
    fetchEvents(newFilters);
  };

  const handlePageChange = (newOffset: number) => {
    const newFilters = { ...filters, offset: newOffset };
    setFilters(newFilters);
    fetchEvents(newFilters);
  };

  return (
    <div className="upcoming-events-page">
      <h1>Upcoming Events</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search events..."
        value={filters.q}
        onChange={(e) => handleFilterChange({ q: e.target.value })}
      />

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange({ dateRange: e.target.value })}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={filters.type}
          onChange={(e) => handleFilterChange({ type: e.target.value })}
        >
          <option value="">All Events</option>
          <option value="interview">Interviews</option>
          <option value="session">Sessions</option>
        </select>
      </div>

      {/* Events List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="events-list">
          {events.map((event) => (
            <div key={event.id} className="event-card">
              {event.type === 'interview' ? (
                <div>
                  <h3>{event.position}</h3>
                  <p>{event.company}</p>
                  <p>{new Date(event.scheduledAt).toLocaleString()}</p>
                </div>
              ) : (
                <div>
                  <h3>{event.topic}</h3>
                  <p>with {event.mentorName}</p>
                  <p>{new Date(event.scheduledAt).toLocaleString()}</p>
                  {event.meetingLink && (
                    <a href={event.meetingLink}>Join Meeting</a>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(filters.offset - filters.limit)}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(filters.offset + filters.limit)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Common Use Cases

### 1. Get all upcoming events
```
GET /api/v1/talent/upcoming
```

### 2. Get this week's interviews
```
GET /api/v1/talent/upcoming?type=interview&dateRange=week
```

### 3. Search for specific company
```
GET /api/v1/talent/upcoming?q=Google
```

### 4. Get today's mentorship sessions
```
GET /api/v1/talent/upcoming?type=session&dateRange=today
```

### 5. Combine filters
```
GET /api/v1/talent/upcoming?q=Frontend&type=interview&dateRange=week&limit=50
```

---

## Consistency with Other Endpoints

This endpoint follows the **same pattern** as:
- `/api/v1/talent/opportunities` - Browse opportunities
- `/api/v1/recruiter/applications` - View applications
- `/api/v1/talents` - Browse talents
- `/api/v1/mentors` - Browse mentors

**Shared patterns:**
- ✅ Uses `q` for search
- ✅ Uses `limit` and `offset` for pagination
- ✅ Returns `{ data, pagination }` format
- ✅ Default limit: 20
- ✅ Default offset: 0
- ✅ Complete API documentation

---

## Notes

1. **Authentication**: Requires valid Bearer token
2. **Role**: Only accessible to users with 'talent' role
3. **Event Types**: Returns both interviews and mentorship sessions
4. **Sorting**: Events are sorted by scheduled time (earliest first)
5. **Date Filtering**: All date ranges are calculated from current time
6. **Search**: Case-insensitive search across relevant fields

---

## Error Responses

### 401 Unauthorized
```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden
```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## Summary

The talent upcoming events endpoint now provides:
- ✅ Consistent `q` search parameter
- ✅ Flexible filtering (dateRange, type)
- ✅ Standard pagination (limit, offset)
- ✅ Unified response format with pagination metadata
- ✅ Complete API documentation
- ✅ Support for both interviews and mentorship sessions

Frontend developers can use the **same components and patterns** as other endpoints!
