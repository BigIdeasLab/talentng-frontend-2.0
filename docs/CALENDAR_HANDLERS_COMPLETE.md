# Calendar Page Session Handlers - Complete

## Date: 2026-03-05

## Overview

Successfully connected all TalentSessionCard action handlers to the Calendar page, enabling full session management functionality for talent users.

**Important**: The calendar endpoint now includes `pending_completion` status, which means mentees can see sessions that need their confirmation. This ensures mentees don't miss sessions requiring action.

### Session Statuses Shown in Calendar:

- `pending` - Waiting for mentor to confirm
- `confirmed` - Confirmed, waiting to start
- `rescheduled` - Rescheduled, waiting to start
- `in_progress` - Currently happening (Join Now!)
- `pending_completion` - Ended, needs mentee confirmation (Confirm Completion!)

---

## Changes Made

### 1. ✅ Added Session Management Imports

#### File: `app/(business)/calendar/page.tsx`

```typescript
import {
  cancelSession,
  rescheduleSession,
  confirmSessionCompletion,
  createSessionReview,
} from "@/lib/api/mentorship";
import { ConfirmationModal } from "@/components/ui/confirmation-modal";
import { RescheduleModal } from "@/components/ui/reschedule-modal";
import { ReviewModal } from "@/components/ui/review-modal";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
```

### 2. ✅ Added State Management

```typescript
// Session action states
const [selectedSessionId, setSelectedSessionId] = useState<string | null>(null);
const [selectedMentorId, setSelectedMentorId] = useState<string>("");
const [cancelModalOpen, setCancelModalOpen] = useState(false);
const [rescheduleModalOpen, setRescheduleModalOpen] = useState(false);
const [confirmCompletionModalOpen, setConfirmCompletionModalOpen] =
  useState(false);
const [reviewModalOpen, setReviewModalOpen] = useState(false);
const [isActionLoading, setIsActionLoading] = useState(false);
```

### 3. ✅ Implemented Handler Functions

#### Cancel Session Handler

```typescript
const handleCancelSession = (sessionId: string) => {
  setSelectedSessionId(sessionId);
  setCancelModalOpen(true);
};

const confirmCancelSession = async () => {
  // Calls cancelSession API
  // Shows toast notification
  // Refreshes data
};
```

#### Reschedule Session Handler

```typescript
const handleRescheduleSession = (sessionId: string) => {
  const session = items.find((item) => item.id === sessionId);
  setSelectedSessionId(sessionId);
  setSelectedMentorId(session?.mentorId || "");
  setRescheduleModalOpen(true);
};

const confirmRescheduleSession = async (
  date: string,
  startTime: string,
  endTime: string,
) => {
  // Calls rescheduleSession API with newStartTime and newEndTime
  // Shows toast notification
  // Refreshes data
};
```

#### Confirm Completion Handler

```typescript
const handleConfirmCompletion = (sessionId: string) => {
  setSelectedSessionId(sessionId);
  setConfirmCompletionModalOpen(true);
};

const confirmSessionCompletionAction = async () => {
  // Calls confirmSessionCompletion API
  // Shows toast notification
  // Refreshes data
};
```

#### Leave Review Handler

```typescript
const handleLeaveReview = (sessionId: string) => {
  setSelectedSessionId(sessionId);
  setReviewModalOpen(true);
};

const confirmLeaveReview = async (rating: number, comment: string) => {
  // Calls createSessionReview API
  // Shows toast notification
  // Refreshes data
};
```

### 4. ✅ Connected Handlers to TalentSessionCard

```typescript
<TalentSessionCard
  key={`sess-${item.session.id}`}
  session={item.session}
  onCancel={handleCancelSession}
  onReschedule={handleRescheduleSession}
  onConfirmCompletion={handleConfirmCompletion}
  onLeaveReview={handleLeaveReview}
/>
```

### 5. ✅ Added Modal Components

#### Cancel Modal

```typescript
<ConfirmationModal
  isOpen={cancelModalOpen}
  onClose={() => setCancelModalOpen(false)}
  onConfirm={confirmCancelSession}
  title="Cancel Session"
  description="Are you sure you want to cancel this session? This action cannot be undone."
  confirmText="Yes, Cancel"
  type="danger"
  isLoading={isActionLoading}
  confirmColor={ROLE_COLORS.talent.dark}
/>
```

#### Reschedule Modal

```typescript
<RescheduleModal
  isOpen={rescheduleModalOpen}
  onClose={() => setRescheduleModalOpen(false)}
  isLoading={isActionLoading}
  onConfirm={confirmRescheduleSession}
  mentorId={selectedMentorId}
  accentColor={ROLE_COLORS.talent.dark}
/>
```

#### Confirm Completion Modal

```typescript
<ConfirmationModal
  isOpen={confirmCompletionModalOpen}
  onClose={() => setConfirmCompletionModalOpen(false)}
  onConfirm={confirmSessionCompletionAction}
  title="Confirm Session Completion"
  description="Please confirm that this session was completed successfully."
  confirmText="Confirm"
  type="success"
  isLoading={isActionLoading}
  confirmColor={ROLE_COLORS.talent.dark}
/>
```

#### Review Modal

```typescript
<ReviewModal
  isOpen={reviewModalOpen}
  onClose={() => setReviewModalOpen(false)}
  onConfirm={confirmLeaveReview}
  isLoading={isActionLoading}
  accentColor={ROLE_COLORS.talent.dark}
/>
```

### 6. ✅ Created ReviewModal Component

#### File: `components/ui/review-modal.tsx`

**Features:**

- Star rating selector (1-5 stars)
- Hover effect on stars
- Optional comment textarea
- Validation (requires rating before submit)
- Loading state during submission
- Customizable accent color
- Consistent styling with other modals

**Props:**

```typescript
interface ReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (rating: number, comment: string) => void;
  isLoading?: boolean;
  accentColor?: string;
}
```

---

## API Functions Used

All API functions from `lib/api/mentorship/index.ts`:

### Talent Session Actions:

- ✅ `cancelSession(sessionId, data?)` - Cancel session
- ✅ `rescheduleSession(sessionId, data)` - Reschedule session
  - Uses `newStartTime` and `newEndTime` fields
- ✅ `confirmSessionCompletion(sessionId)` - Confirm session completion
- ✅ `createSessionReview(sessionId, data)` - Leave review
  - Requires `rating` (number) and `comment` (string)

---

## Status-Based Actions (Per SESSION_FLOW_GUIDE.md)

| Status                      | Available Actions              | Why It's in Calendar                                           |
| --------------------------- | ------------------------------ | -------------------------------------------------------------- |
| `pending`                   | Cancel                         | Waiting for mentor confirmation                                |
| `confirmed` / `rescheduled` | Reschedule + Cancel            | Upcoming session                                               |
| `in_progress`               | None (status text only)        | Currently happening - Join Now!                                |
| `pending_completion`        | Confirm Completion             | **Needs mentee action** - Session ended, awaiting confirmation |
| `completed`                 | Leave Review (if not reviewed) | Past session - can leave feedback                              |
| `cancelled`                 | None                           | Cancelled session (for reference)                              |
| `disputed`                  | None                           | Disputed session (for reference)                               |

**Key Point**: The `pending_completion` status is crucial - it ensures mentees see sessions that need their confirmation action. Without this, mentees might miss confirming completed sessions.

---

## User Experience Flow

### Cancel Session:

1. User clicks "Cancel" button on session card
2. Confirmation modal appears
3. User confirms cancellation
4. API call to cancel session
5. Toast notification shows success
6. Session list refreshes automatically

### Reschedule Session:

1. User clicks "Reschedule" button on session card
2. Reschedule modal appears with mentor's available slots
3. User selects new date and time
4. User confirms reschedule
5. API call to reschedule session
6. Toast notification shows success
7. Session list refreshes automatically

### Confirm Completion:

1. User clicks "Confirm Completion" button on session card
2. Confirmation modal appears
3. User confirms completion
4. API call to confirm completion
5. Toast notification shows success
6. Session list refreshes automatically
7. Session status changes to "completed"

### Leave Review:

1. User clicks "Leave Review" button on completed session card
2. Review modal appears
3. User selects star rating (1-5)
4. User optionally adds comment
5. User submits review
6. API call to create review
7. Toast notification shows success
8. Session list refreshes automatically
9. Button changes to "Review submitted"

---

## Error Handling

All handlers include try-catch blocks with:

- Loading states during API calls
- Error toast notifications on failure
- Proper cleanup of modal states
- Data refresh on success

---

## Files Modified

1. ✅ `app/(business)/calendar/page.tsx` - Added handlers and modals
2. ✅ `components/ui/review-modal.tsx` - Created new component

---

## Testing Checklist

### ✅ Implementation Complete

- [x] Cancel session handler connected
- [x] Reschedule session handler connected
- [x] Confirm completion handler connected
- [x] Leave review handler connected
- [x] All modals added
- [x] ReviewModal component created
- [x] No TypeScript errors
- [x] Proper API parameter names used

### 🔄 User Testing Required

- [ ] Test cancel session flow
- [ ] Test reschedule session flow
- [ ] Test confirm completion flow
- [ ] Test leave review flow
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test toast notifications
- [ ] Test data refresh after actions
- [ ] Test on mobile

---

## Compliance with SESSION_FLOW_GUIDE.md

### ✅ Fully Compliant

All session actions are now available on the Calendar page according to the session flow guide:

1. ✅ Talent can cancel pending sessions
2. ✅ Talent can reschedule/cancel confirmed sessions
3. ✅ Talent can confirm completion of pending_completion sessions
4. ✅ Talent can leave reviews for completed sessions
5. ✅ All status-based UI rendering matches guide specifications
6. ✅ Proper API calls with correct parameters
7. ✅ Error handling and user feedback

---

## Summary

The Calendar page now has full session management functionality for talent users:

1. ✅ All TalentSessionCard action handlers connected
2. ✅ Four modals implemented (Cancel, Reschedule, Confirm Completion, Review)
3. ✅ ReviewModal component created with star rating and comment
4. ✅ All API calls properly integrated
5. ✅ Error handling and loading states
6. ✅ Toast notifications for user feedback
7. ✅ Automatic data refresh after actions
8. ✅ No TypeScript errors
9. ✅ Compliant with SESSION_FLOW_GUIDE.md

Talent users can now manage their mentorship sessions directly from the Calendar page!
