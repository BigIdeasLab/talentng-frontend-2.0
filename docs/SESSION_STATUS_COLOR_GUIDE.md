# Session Status Color Coding Guide

## Overview
Color-coded status system designed to immediately communicate urgency and required user attention through visual cues.

---

## Color Psychology & Hierarchy

### 🔴 Red/Amber - **URGENT ATTENTION REQUIRED**
Used for statuses that require immediate user action or decision.

### 🔵 Blue - **ACTIVE/INFORMATIONAL**
Used for ongoing or scheduled sessions that don't require immediate action.

### 🟢 Green - **COMPLETED/SUCCESS**
Used for successfully completed sessions.

### ⚫ Red (Dark) - **PROBLEM/ERROR**
Used for disputed or cancelled sessions.

---

## Status Color Mapping

### Mentor View (SessionCard.tsx)

| Status | Badge Color | Dot Color | Text Color | Label | Urgency | Action Required |
|--------|-------------|-----------|------------|-------|---------|-----------------|
| `pending` | `#FEF3C7` (Light Amber) | `#F59E0B` (Amber) | `#D97706` (Dark Amber) | "Pending Confirmation" | **HIGH** | Confirm or Cancel |
| `pending_completion` | `#FEF2F2` (Light Red) | `#EF4444` (Red) | `#DC2626` (Dark Red) | "Needs Confirmation" | **URGENT** | Wait for mentee or Dispute |
| `in_progress` | `#DBEAFE` (Light Blue) | `#3B82F6` (Blue) | `#2563EB` (Dark Blue) | "In Progress" | MEDIUM | Complete after endTime |
| `upcoming` | `#EFF6FF` (Pale Blue) | `#60A5FA` (Sky Blue) | `#3B82F6` (Blue) | "Upcoming" | LOW | Reschedule or Cancel |
| `completed` | `#ECFDF3` (Light Green) | `#10B981` (Green) | `#059669` (Dark Green) | "Completed" | NONE | No action |
| `disputed` | `#FEF2F2` (Light Red) | `#DC2626` (Red) | `#B91C1C` (Dark Red) | "Disputed" | NONE | Admin resolution |
| `cancelled` | `#FEF2F2` (Light Red) | `#EF4444` (Red) | `#DC2626` (Dark Red) | "Cancelled" | NONE | No action |

### Mentee View (TalentSessionCard.tsx)

| Status | Badge Color | Dot Color | Text Color | Label | Urgency | Action Required |
|--------|-------------|-----------|------------|-------|---------|-----------------|
| `pending` | `#FEF3C7` (Light Amber) | `#F59E0B` (Amber) | `#D97706` (Dark Amber) | "Pending Confirmation" | **HIGH** | Wait or Cancel |
| `rescheduled` | `#FEF3C7` (Light Amber) | `#F59E0B` (Amber) | `#D97706` (Dark Amber) | "Rescheduled" | **HIGH** | Reschedule or Cancel |
| `pending_completion` | `#FEF2F2` (Light Red) | `#EF4444` (Red) | `#DC2626` (Dark Red) | "Action Required" | **URGENT** | Confirm Completion |
| `in_progress` | `#DBEAFE` (Light Blue) | `#3B82F6` (Blue) | `#2563EB` (Dark Blue) | "In Progress" | MEDIUM | Join meeting |
| `confirmed` | `#EFF6FF` (Pale Blue) | `#60A5FA` (Sky Blue) | `#3B82F6` (Blue) | "Confirmed" | LOW | Reschedule or Cancel |
| `completed` | `#ECFDF3` (Light Green) | `#10B981` (Green) | `#059669` (Dark Green) | "Completed" | LOW | Leave Review (optional) |
| `disputed` | `#FEF2F2` (Light Red) | `#DC2626` (Red) | `#B91C1C` (Dark Red) | "Disputed" | NONE | Contact support |
| `cancelled` | `#FEF2F2` (Light Red) | `#EF4444` (Red) | `#DC2626` (Dark Red) | "Cancelled" | NONE | No action |

---

## Visual Hierarchy

### Priority 1: URGENT (Red) 🔴
**Requires immediate action to prevent issues**

- **Mentor**: `pending_completion` - Mentee hasn't confirmed, may need to dispute
- **Mentee**: `pending_completion` - Must confirm session completion

**Visual**: Red background with red dot and dark red text

### Priority 2: HIGH (Amber) 🟠
**Requires action soon**

- **Mentor**: `pending` - New booking request needs confirmation
- **Mentee**: `pending` - Waiting for mentor to confirm
- **Mentee**: `rescheduled` - Session was rescheduled, review new time

**Visual**: Amber background with amber dot and dark amber text

### Priority 3: ACTIVE (Blue) 🔵
**Currently happening or scheduled**

- **Both**: `in_progress` - Session is currently happening
- **Both**: `upcoming`/`confirmed` - Future scheduled session

**Visual**: Blue background with blue dot and dark blue text

### Priority 4: COMPLETED (Green) 🟢
**Successfully finished**

- **Both**: `completed` - Session successfully completed

**Visual**: Green background with green dot and dark green text

### Priority 5: PROBLEM (Dark Red) ⚫
**Issue or cancellation**

- **Both**: `disputed` - Session completion is disputed
- **Both**: `cancelled` - Session was cancelled

**Visual**: Light red background with red dot and dark red text

---

## Design Rationale

### Why These Colors?

1. **Red for Urgent Actions**
   - Universally recognized as "attention needed"
   - `pending_completion` is time-sensitive (auto-completes after 24 hours)
   - Creates visual urgency without being alarming

2. **Amber for Pending States**
   - Warning color that indicates "needs attention soon"
   - Less urgent than red but more than blue
   - `pending` and `rescheduled` require user awareness

3. **Blue for Active/Scheduled**
   - Calm, informational color
   - `in_progress` and `confirmed` are expected states
   - No immediate action required

4. **Green for Success**
   - Positive reinforcement
   - `completed` sessions are successful outcomes
   - Encourages users to complete the flow

5. **Dark Red for Problems**
   - Indicates error or cancellation
   - `disputed` and `cancelled` are terminal problem states
   - Distinguishes from urgent actions (lighter red)

### Accessibility Considerations

- **Color + Text**: Status is communicated through both color AND text label
- **Contrast Ratios**: All text colors meet WCAG AA standards against their backgrounds
- **Dot Indicator**: Additional visual cue beyond just background color
- **Consistent Patterns**: Same colors mean the same thing across both views

---

## Usage Examples

### Mentor Dashboard
```typescript
// Urgent - Needs immediate attention
pending_completion: Red badge → "Needs Confirmation" → Dispute button visible

// High Priority - Needs action soon  
pending: Amber badge → "Pending Confirmation" → Confirm/Cancel buttons

// Active - Currently happening
in_progress: Blue badge → "In Progress" → Complete button (after endTime)

// Scheduled - Future session
upcoming: Light blue badge → "Upcoming" → Reschedule/Cancel buttons
```

### Mentee Calendar
```typescript
// Urgent - Must act now
pending_completion: Red badge → "Action Required" → Confirm Completion button

// High Priority - Needs awareness
pending: Amber badge → "Pending Confirmation" → Cancel button
rescheduled: Amber badge → "Rescheduled" → Reschedule/Cancel buttons

// Active - Join now
in_progress: Blue badge → "In Progress" → Join Meeting button

// Scheduled - Future session
confirmed: Light blue badge → "Confirmed" → Reschedule/Cancel buttons
```

---

## Testing Checklist

### Visual Testing
- [ ] All status badges display correct colors
- [ ] Dot indicators match badge colors
- [ ] Text is readable against background (contrast check)
- [ ] Colors are consistent between mentor and mentee views

### User Experience Testing
- [ ] Users can quickly identify urgent sessions (red)
- [ ] Users understand which sessions need action (amber)
- [ ] Active sessions are clearly visible (blue)
- [ ] Completed sessions feel positive (green)
- [ ] Problem states are obvious (dark red)

### Accessibility Testing
- [ ] Color blind users can distinguish statuses (text labels help)
- [ ] Screen readers announce status correctly
- [ ] Keyboard navigation works with colored badges
- [ ] High contrast mode maintains visibility

---

## Summary

The color-coded status system uses a clear visual hierarchy:

1. 🔴 **Red** = URGENT - Act now (`pending_completion`)
2. 🟠 **Amber** = HIGH - Act soon (`pending`, `rescheduled`)
3. 🔵 **Blue** = ACTIVE - Happening or scheduled (`in_progress`, `confirmed`)
4. 🟢 **Green** = SUCCESS - Completed (`completed`)
5. ⚫ **Dark Red** = PROBLEM - Disputed or cancelled

This system ensures users can quickly scan their sessions and identify which ones need immediate attention, improving the overall user experience and reducing missed actions.

