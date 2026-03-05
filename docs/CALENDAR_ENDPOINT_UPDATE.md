# Calendar Endpoint Update - Frontend Action Required

## Summary

The talent calendar endpoint has been updated to properly show all active sessions that require user attention, not just future events.

---

## What Changed

### 1. Endpoint Renamed ✅ DONE

- **OLD**: `/api/v1/talent/upcoming` ❌ DEPRECATED
- **NEW**: `/api/v1/talent/calendar` ✅ USE THIS
- **OLD**: `/api/v1/talent/upcoming/count` ❌ DEPRECATED
- **NEW**: `/api/v1/talent/calendar/count` ✅ USE THIS

**Backward Compatibility**: Old endpoints still work but are deprecated.

### 2. Ongoing Sessions Now Included ✅ DONE

The calendar now shows sessions that require immediate action:

**Session Statuses Included:**

- `pending` - Waiting for mentor confirmation
- `confirmed` - Confirmed future sessions
- `rescheduled` - Rescheduled future sessions
- `in_progress` - **NEW** - Currently happening (show "Join Now" button!)
- `pending_completion` - **NEW** - Ended, waiting for confirmation (show "Confirm Completion" button!)

### 3. Smart Date Filtering ✅ DONE

- **Ongoing sessions** (`in_progress`, `pending_completion`): Always shown regardless of date filters
- **Future sessions** (`pending`, `confirmed`, `rescheduled`): Filtered by date range if specified
- **Why**: Ensures talents never miss sessions requiring immediate action

### 4. Count Endpoint Behavior ✅ DONE

- **Count endpoint** only counts CURRENT and FUTURE events
- Includes: `in_progress` sessions and future sessions
- Excludes: `pending_completion` sessions (past events)
- **Why**: Count represents "upcoming" events, not past events requiring action
- **Note**: Calendar may show more items than the count indicates

---

## Frontend Changes Required

### 1. Update API Endpoints

```typescript
// OLD (deprecated)
const response = await fetch("/api/v1/talent/upcoming");
const countResponse = await fetch("/api/v1/talent/upcoming/count");

// NEW (use this)
const response = await fetch("/api/v1/talent/calendar");
const countResponse = await fetch("/api/v1/talent/calendar/count");
```

### 2. Handle New Session Statuses

#### `in_progress` Status

```typescript
function SessionCard({ session }: { session: Session }) {
  if (session.status === 'in_progress') {
    return (
      <div className="session-card in-progress">
        <Badge variant="success">In Progress</Badge>
        <h3>{session.topic}</h3>
        <p>with {session.mentorName}</p>
        {session.meetingLink && (
          <Button variant="primary" size="large">
            Join Now
          </Button>
        )}
      </div>
    );
  }
  // ... other statuses
}
```

#### `pending_completion` Status

```typescript
function SessionCard({ session }: { session: Session }) {
  if (session.status === 'pending_completion') {
    return (
      <div className="session-card pending-completion">
        <Badge variant="warning">Awaiting Confirmation</Badge>
        <h3>{session.topic}</h3>
        <p>with {session.mentorName}</p>
        <p>Session ended. Please confirm completion.</p>
        <Button
          variant="primary"
          onClick={() => confirmCompletion(session.id)}
        >
          Confirm Completion
        </Button>
        <p className="text-muted">
          Auto-completes in {getTimeRemaining(session.endTime, 24)} hours
        </p>
      </div>
    );
  }
  // ... other statuses
}
```

### 3. Update UI Labels

Consider renaming "Upcoming" to "Calendar" or "Schedule" in your UI to better reflect that it includes ongoing events.

```typescript
// Before
<Tab>Upcoming Events</Tab>

// After
<Tab>Calendar</Tab>
// or
<Tab>My Schedule</Tab>
```

### 4. Session Status Badge Colors

```typescript
const getStatusBadge = (status: string) => {
  switch (status) {
    case 'in_progress':
      return <Badge variant="success">In Progress</Badge>;
    case 'pending_completion':
      return <Badge variant="warning">Awaiting Confirmation</Badge>;
    case 'confirmed':
      return <Badge variant="info">Confirmed</Badge>;
    case 'pending':
      return <Badge variant="secondary">Pending</Badge>;
    case 'rescheduled':
      return <Badge variant="info">Rescheduled</Badge>;
    case 'completed':
      return <Badge variant="success">Completed</Badge>;
    case 'cancelled':
      return <Badge variant="danger">Cancelled</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
```

---

## Testing Checklist

### Scenario 1: Ongoing Session

1. Start a mentorship session (status changes to `in_progress`)
2. Check calendar endpoint - session should appear
3. Verify "Join Now" button is visible
4. Apply date filter (e.g., "today") - session should still appear

### Scenario 2: Pending Completion

1. Wait for session to end (status changes to `pending_completion`)
2. Check calendar endpoint - session should appear
3. Verify "Confirm Completion" button is visible
4. Apply date filter - session should still appear
5. Confirm completion - session should disappear from calendar

### Scenario 3: Date Filtering

1. Create sessions with different dates
2. Apply "today" filter - only today's future sessions + ongoing/pending_completion should appear
3. Apply "week" filter - this week's future sessions + ongoing/pending_completion should appear
4. No filter - all active sessions should appear

### Scenario 4: Count Endpoint

1. Check count matches the number of CURRENT and FUTURE items
2. Verify count includes `in_progress` sessions
3. Verify count EXCLUDES `pending_completion` sessions
4. Note: Calendar may show more items than count (due to `pending_completion` sessions)
5. Verify count updates when sessions change status

---

## API Response Examples

### Calendar Response with Mixed Statuses

```json
{
  "data": [
    {
      "id": "session-1",
      "type": "session",
      "mentorName": "John Doe",
      "topic": "Career Guidance",
      "scheduledAt": "2026-03-05T14:00:00.000Z",
      "endTime": "2026-03-05T15:00:00.000Z",
      "meetingLink": "https://meet.example.com/abc123",
      "status": "in_progress",
      "mentorId": "mentor-123",
      "mentorImage": "https://example.com/john.jpg"
    },
    {
      "id": "session-2",
      "type": "session",
      "mentorName": "Jane Smith",
      "topic": "Technical Interview Prep",
      "scheduledAt": "2026-03-05T10:00:00.000Z",
      "endTime": "2026-03-05T11:00:00.000Z",
      "meetingLink": "https://meet.example.com/xyz789",
      "status": "pending_completion",
      "mentorId": "mentor-456",
      "mentorImage": "https://example.com/jane.jpg"
    },
    {
      "id": "session-3",
      "type": "session",
      "mentorName": "Bob Johnson",
      "topic": "Resume Review",
      "scheduledAt": "2026-03-06T16:00:00.000Z",
      "endTime": "2026-03-06T17:00:00.000Z",
      "meetingLink": "https://meet.example.com/def456",
      "status": "confirmed",
      "mentorId": "mentor-789",
      "mentorImage": "https://example.com/bob.jpg"
    },
    {
      "id": "interview-1",
      "type": "interview",
      "company": "Tech Corp",
      "position": "Frontend Developer",
      "scheduledAt": "2026-03-07T10:00:00.000Z",
      "meetingLink": "https://zoom.us/j/123456789",
      "opportunityId": "opp-123",
      "logo": "https://example.com/techcorp.png"
    }
  ],
  "pagination": {
    "total": 4,
    "limit": 20,
    "offset": 0,
    "currentPage": 1,
    "totalPages": 1,
    "hasNextPage": false,
    "hasPreviousPage": false
  }
}
```

### Count Response

```json
{
  "count": 3
}
```

**Note**: The count (3) is less than the total calendar items (4) because it excludes the `pending_completion` session. The count only includes current and future events:

- 1 `in_progress` session
- 1 `confirmed` session
- 1 scheduled interview

The `pending_completion` session appears in the calendar but not in the count.

---

## Where Reviews Are Stored

Session reviews are stored in the `MentorReview` table:

- One-to-one relationship with `Booking` via `bookingId`
- Fields: `rating`, `comment`, `mentorId`, `menteeId`
- Created when mentee submits review after session completion
- Endpoint: `POST /api/v1/sessions/:id/review`

---

## Related Documentation

- **Full API Guide**: `docs/TALENT_UPCOMING_API_GUIDE.md`
- **Session Flow**: `docs/SESSION_FLOW_GUIDE.md`
- **Mentor Endpoints**: `docs/MENTOR_ENDPOINTS_SUMMARY.md`

---

## Questions?

If you have questions about these changes, refer to:

1. `docs/TALENT_UPCOMING_API_GUIDE.md` - Complete API documentation
2. `docs/SESSION_FLOW_GUIDE.md` - Session status flow and transitions
3. Backend team for implementation details
