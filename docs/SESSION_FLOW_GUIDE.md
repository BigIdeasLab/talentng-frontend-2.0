# Mentor-Mentee Session Flow Guide

## Overview
Complete guide to the mentor-mentee session lifecycle, including status transitions, user actions, and frontend implementation guidelines.

---

## Session Status Flow

```
pending → confirmed → in_progress → pending_completion → completed
                ↓
            cancelled
                ↓
            disputed (from pending_completion)
```

---

## Detailed Status Breakdown

### 1. **PENDING** (Initial State)
**When:** Mentee books a session with a mentor

**Who Can Act:**
- **Mentor**: Can confirm or cancel
- **Mentee**: Can cancel

**Available Actions:**
- Mentor: `POST /api/v1/sessions/:id/confirm` - Confirm the booking
- Mentor: `POST /api/v1/sessions/:id/cancel` - Cancel the booking
- Mentee: `POST /api/v1/sessions/:id/cancel` - Cancel the booking

**Frontend UI:**
- **Mentor View**: Show "Confirm" and "Cancel" buttons
- **Mentee View**: Show "Cancel" button, display "Waiting for mentor confirmation"

**Notifications:**
- Mentor receives notification about new booking request
- Mentee receives confirmation when mentor confirms

---

### 2. **CONFIRMED** (Booking Accepted)
**When:** Mentor confirms the pending booking

**Who Can Act:**
- **Mentor**: Can reschedule or cancel
- **Mentee**: Can reschedule or cancel

**Available Actions:**
- Both: `POST /api/v1/sessions/:id/reschedule` - Reschedule the session
- Both: `POST /api/v1/sessions/:id/cancel` - Cancel the booking

**Frontend UI:**
- **Both Views**: Show "Reschedule" and "Cancel" buttons
- Display session details: date, time, topic, meeting link
- Show countdown to session start

**Auto-Transition:**
- **When**: Current time reaches `startTime`
- **Changes to**: `in_progress`
- **Trigger**: Cron job (runs every 5 minutes)

---

### 3. **RESCHEDULED** (Session Rescheduled)
**When:** Either party reschedules the session

**Behavior:** Same as `confirmed` status

**Available Actions:**
- Both: Can reschedule again
- Both: Can cancel

**Frontend UI:**
- Same as confirmed
- Show "Rescheduled" badge/indicator

**Auto-Transition:**
- **When**: Current time reaches new `startTime`
- **Changes to**: `in_progress`
- **Trigger**: Cron job (runs every 5 minutes)

---

### 4. **IN_PROGRESS** (Session Happening Now)
**When:** Current time is between `startTime` and `endTime`

**Who Can Act:**
- **Mentor**: Can complete (only after endTime)
- **Mentee**: Cannot complete

**Available Actions:**
- None during the session
- Mentor: `POST /api/v1/sessions/:id/complete` - Only works AFTER `endTime`

**Frontend UI:**
- **Both Views**: 
  - Show "Session in Progress" status
  - Display meeting link prominently (Join Meeting button)
  - Show session timer/countdown
  - Disable reschedule and cancel buttons
  - Show "Complete Session" button for mentor (disabled until endTime passes)

**Auto-Transition:**
- **When**: Current time is 15 minutes after `endTime`
- **Changes to**: `pending_completion`
- **Trigger**: Cron job (runs every 5 minutes)

**Notifications:**
- Both parties receive "Session Started" notification when status changes to in_progress

---

### 5. **PENDING_COMPLETION** (Waiting for Confirmation)
**When:** 
- Session endTime + 15 min buffer has passed (auto), OR
- Mentor manually marks as complete (after endTime)

**Who Can Act:**
- **Mentor**: Can dispute if mentee doesn't confirm
- **Mentee**: Must confirm completion

**Available Actions:**
- Mentee: `POST /api/v1/sessions/:id/confirm-completion` - Confirm session was completed
- Mentor: `POST /api/v1/sessions/:id/dispute` - Dispute if mentee doesn't confirm

**Frontend UI:**
- **Mentor View**: 
  - Show "Waiting for mentee confirmation" message
  - Show "Dispute" button (if mentee doesn't confirm within reasonable time)
  - Disable all other actions
  
- **Mentee View**:
  - Show prominent "Confirm Completion" button
  - Display message: "Please confirm this session was completed"
  - Show session summary

**Notifications:**
- Mentee receives notification to confirm completion
- Mentor receives notification when mentee confirms

---

### 6. **COMPLETED** (Session Finished)
**When:** Mentee confirms completion

**Who Can Act:**
- **Mentee**: Can leave a review (one-time only)

**Available Actions:**
- Mentee: `POST /api/v1/sessions/:id/review` - Leave a review for the mentor

**Frontend UI:**
- **Both Views**: 
  - Show "Completed" status with checkmark
  - Display session summary
  - All action buttons disabled
  
- **Mentee View**: 
  - Show "Leave a Review" button (if not already reviewed)
  - After review: Show "Review Submitted" message

**Notifications:**
- Mentor receives notification when session is completed
- Mentor receives notification when mentee leaves a review

---

### 7. **CANCELLED** (Session Cancelled)
**When:** Either party cancels before session starts

**Who Can Act:**
- None (terminal state)

**Available Actions:**
- None

**Frontend UI:**
- **Both Views**: 
  - Show "Cancelled" status
  - Display cancellation reason (if provided)
  - All action buttons disabled
  - Show who cancelled and when

**Notifications:**
- Other party receives cancellation notification

---

### 8. **DISPUTED** (Completion Disputed)
**When:** Mentor disputes completion if mentee doesn't confirm

**Who Can Act:**
- Admin/Support (manual resolution)

**Available Actions:**
- None for users (requires admin intervention)

**Frontend UI:**
- **Both Views**: 
  - Show "Disputed" status
  - Display message: "This session is under review"
  - Show contact support button
  - All action buttons disabled

---

## Complete Session Lifecycle Example

### Scenario: Successful Session

1. **Mentee books session** → Status: `pending`
   - Mentor receives notification
   - Mentor sees "Confirm" and "Cancel" buttons

2. **Mentor confirms** → Status: `confirmed`
   - Mentee receives confirmation notification
   - Both see "Reschedule" and "Cancel" buttons
   - Both see session details and countdown

3. **Session time arrives** → Status: `in_progress` (auto)
   - Both receive "Session Started" notification
   - Both see "Join Meeting" button
   - Reschedule/Cancel buttons disabled

4. **Session ends + 15 min** → Status: `pending_completion` (auto)
   - Mentee receives "Confirm Completion" notification
   - Mentee sees "Confirm Completion" button
   - Mentor sees "Waiting for confirmation" message

5. **Mentee confirms** → Status: `completed`
   - Mentor receives completion notification
   - Mentee sees "Leave a Review" button
   - Both see completed status

6. **Mentee leaves review** (optional)
   - Mentor receives review notification
   - Review appears on mentor's profile

---

## Frontend Implementation Guidelines

### Status-Based UI Rendering

```typescript
function getSessionActions(session, userRole) {
  const now = new Date();
  const isBeforeEnd = now < new Date(session.endTime);
  const isAfterEnd = now >= new Date(session.endTime);
  
  switch(session.status) {
    case 'pending':
      if (userRole === 'mentor') {
        return ['confirm', 'cancel'];
      } else {
        return ['cancel'];
      }
      
    case 'confirmed':
    case 'rescheduled':
      return ['reschedule', 'cancel'];
      
    case 'in_progress':
      if (userRole === 'mentor' && isAfterEnd) {
        return ['complete'];
      }
      return []; // No actions during session
      
    case 'pending_completion':
      if (userRole === 'mentee') {
        return ['confirm_completion'];
      } else if (userRole === 'mentor') {
        return ['dispute']; // Only after reasonable wait time
      }
      return [];
      
    case 'completed':
      if (userRole === 'mentee' && !session.review) {
        return ['leave_review'];
      }
      return [];
      
    case 'cancelled':
    case 'disputed':
      return []; // No actions available
      
    default:
      return [];
  }
}
```

### Button Visibility Matrix

| Status | Mentor Actions | Mentee Actions |
|--------|---------------|----------------|
| `pending` | Confirm, Cancel | Cancel |
| `confirmed` | Reschedule, Cancel | Reschedule, Cancel |
| `rescheduled` | Reschedule, Cancel | Reschedule, Cancel |
| `in_progress` | Complete (after endTime) | None |
| `pending_completion` | Dispute | Confirm Completion |
| `completed` | None | Leave Review (if not reviewed) |
| `cancelled` | None | None |
| `disputed` | None | None |

### Real-Time Updates

**Use SSE (Server-Sent Events) for real-time status updates:**

```typescript
// Subscribe to session updates
const eventSource = new EventSource('/api/v1/notifications/stream');

eventSource.addEventListener('booking_status_update', (event) => {
  const data = JSON.parse(event.data);
  // Update session status in UI
  updateSessionStatus(data.sessionId, data.newStatus);
});
```

### Polling Strategy (Fallback)

If SSE is not available, poll for updates:

```typescript
// Poll every 30 seconds for sessions in progress
if (session.status === 'in_progress' || session.status === 'confirmed') {
  setInterval(() => {
    fetchSessionStatus(session.id);
  }, 30000);
}
```

---

## API Endpoints Summary

### Session Management
- `GET /api/v1/mentor/sessions` - Get mentor's sessions
- `GET /api/v1/sessions` - Get mentee's sessions
- `POST /api/v1/sessions/:id/confirm` - Confirm booking (mentor only)
- `POST /api/v1/sessions/:id/cancel` - Cancel booking (both)
- `POST /api/v1/sessions/:id/reschedule` - Reschedule booking (both)
- `POST /api/v1/sessions/:id/complete` - Complete session (mentor only, after endTime)
- `POST /api/v1/sessions/:id/confirm-completion` - Confirm completion (mentee only)
- `POST /api/v1/sessions/:id/dispute` - Dispute completion (mentor only)
- `POST /api/v1/sessions/:id/review` - Leave review (mentee only, after completed)

---

## Error Handling

### Common Errors

1. **"Cannot complete a session before it ends"**
   - Mentor tried to complete before endTime
   - Solution: Disable complete button until endTime passes

2. **"Only confirmed, rescheduled, or in-progress bookings can be completed"**
   - Trying to complete a cancelled/disputed session
   - Solution: Hide complete button for these statuses

3. **"Only the mentor can complete this booking"**
   - Mentee tried to complete
   - Solution: Never show complete button to mentee

4. **"Can only review completed sessions"**
   - Trying to review before completion
   - Solution: Only show review button when status is 'completed'

---

## Best Practices

### 1. Status Polling
- Poll every 30 seconds for active sessions (`confirmed`, `in_progress`)
- Stop polling for terminal states (`completed`, `cancelled`, `disputed`)

### 2. Time-Based UI Updates
- Update UI every minute to show accurate countdowns
- Enable/disable buttons based on current time vs endTime

### 3. Notifications
- Subscribe to SSE for real-time notifications
- Show toast/banner when status changes
- Update session list immediately on notification

### 4. User Feedback
- Show loading states during API calls
- Display success/error messages clearly
- Confirm destructive actions (cancel, dispute)

### 5. Meeting Links
- Only show meeting link for `confirmed`, `rescheduled`, and `in_progress` statuses
- Make link prominent during `in_progress`
- Open in new tab/window

---

## Summary

The session flow is designed to ensure both parties confirm and complete sessions properly:

1. **Mentor must confirm** bookings
2. **System auto-starts** sessions at scheduled time
3. **System auto-ends** sessions 15 min after endTime
4. **Mentee must confirm** completion
5. **Mentor can dispute** if mentee doesn't confirm
6. **Mentee can review** after completion

This creates accountability and ensures fair completion tracking for both parties.
