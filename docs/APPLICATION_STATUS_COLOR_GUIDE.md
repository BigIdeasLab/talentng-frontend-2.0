# Application Workflow Status Color Coding Guide

## Overview

Comprehensive color-coded status system for the entire application workflow (Opportunities, Applications, and Interviews) designed to immediately communicate urgency and required user attention through visual cues.

---

## Color Psychology & Hierarchy

### 🔴 Red - **URGENT/REJECTED/CANCELLED**

Used for rejected applications, cancelled interviews, and critical states.

### 🟠 Amber/Orange - **NEEDS ATTENTION**

Used for rescheduled interviews and states requiring awareness.

### 🔵 Blue - **IN PROGRESS/ACTIVE**

Used for invited applications, scheduled interviews, and active opportunities.

### 🟢 Green - **SUCCESS/COMPLETED**

Used for hired applications, completed interviews, and successful outcomes.

### ⚫ Gray - **NEUTRAL/PENDING**

Used for applied applications, draft opportunities, and neutral states.

### 🟣 Purple - **SHORTLISTED/UNDER REVIEW**

Used for shortlisted applications indicating review stage.

---

## Status Color Mapping

### 1. Opportunity Status (OpportunityCard.tsx)

| Status   | Badge Color             | Dot Color         | Text Color             | Label    | User Action         |
| -------- | ----------------------- | ----------------- | ---------------------- | -------- | ------------------- |
| `draft`  | `#F5F5F5` (Light Gray)  | `#606060` (Gray)  | `#606060` (Gray)       | "Draft"  | Edit or Post        |
| `active` | `#ECFDF5` (Light Green) | `#047857` (Green) | `#047857` (Dark Green) | "Active" | Manage Applications |
| `closed` | `#FEF2F2` (Light Red)   | `#DC2626` (Red)   | `#DC2626` (Dark Red)   | "Closed" | Reopen if needed    |

**Visual Hierarchy:**

- **Draft** (Gray) = Not yet published, needs action
- **Active** (Green) = Live and accepting applications
- **Closed** (Red) = No longer accepting applications

---

### 2. Application Status (JobApplicationCard.tsx - Talent View)

| Status        | Badge Color              | Text Color         | Label         | Urgency  | Meaning                              |
| ------------- | ------------------------ | ------------------ | ------------- | -------- | ------------------------------------ |
| `applied`     | `#F5F5F5` (Light Gray)   | `#606060` (Gray)   | "Applied"     | LOW      | Waiting for recruiter review         |
| `invited`     | `#DBEAFE` (Light Blue)   | `#2563EB` (Blue)   | "Invited"     | **HIGH** | Recruiter interested - Action needed |
| `shortlisted` | `#F3E8FF` (Light Purple) | `#7C3AED` (Purple) | "Shortlisted" | MEDIUM   | Under review for interview           |
| `hired`       | `#ECFDF3` (Light Green)  | `#10B981` (Green)  | "Hired"       | NONE     | Success!                             |
| `rejected`    | `#FEF2F2` (Light Red)    | `#DC2626` (Red)    | "Rejected"    | NONE     | Application declined                 |

**Visual Hierarchy:**

- **Invited** (Blue) = HIGH priority - Recruiter wants to talk
- **Shortlisted** (Purple) = MEDIUM - Being considered
- **Applied** (Gray) = LOW - Waiting
- **Hired** (Green) = SUCCESS
- **Rejected** (Red) = CLOSED

---

### 3. Application Status (Recruiter View - Applicants Page)

| Status        | Badge Color              | Dot Color          | Text Color             | Label             | Recruiter Action     |
| ------------- | ------------------------ | ------------------ | ---------------------- | ----------------- | -------------------- |
| `applied`     | `#FEF3C7` (Light Amber)  | `#F59E0B` (Amber)  | `#D97706` (Dark Amber) | "New Application" | **Review needed**    |
| `invited`     | `#DBEAFE` (Light Blue)   | `#2563EB` (Blue)   | `#2563EB` (Blue)       | "Invited"         | Waiting for response |
| `shortlisted` | `#F3E8FF` (Light Purple) | `#7C3AED` (Purple) | `#7C3AED` (Purple)     | "Shortlisted"     | Schedule interview   |
| `hired`       | `#ECFDF3` (Light Green)  | `#10B981` (Green)  | `#059669` (Dark Green) | "Hired"           | Completed            |
| `rejected`    | `#FEF2F2` (Light Red)    | `#EF4444` (Red)    | `#DC2626` (Dark Red)   | "Rejected"        | Archived             |

**Visual Hierarchy:**

- **Applied** (Amber) = **URGENT** - New applications need review
- **Shortlisted** (Purple) = HIGH - Ready for interview
- **Invited** (Blue) = MEDIUM - Waiting for talent response
- **Hired** (Green) = SUCCESS
- **Rejected** (Red) = CLOSED

---

### 4. Interview Status (Both Talent & Recruiter Views)

| Status        | Badge Color             | Dot Color         | Text Color             | Label         | Urgency  | Action Required       |
| ------------- | ----------------------- | ----------------- | ---------------------- | ------------- | -------- | --------------------- |
| `scheduled`   | `#EFF6FF` (Pale Blue)   | `#2563EB` (Blue)  | `#2563EB` (Blue)       | "Scheduled"   | MEDIUM   | Prepare for interview |
| `rescheduled` | `#FEF3C7` (Light Amber) | `#F59E0B` (Amber) | `#D97706` (Dark Amber) | "Rescheduled" | **HIGH** | Note new time         |
| `completed`   | `#ECFDF3` (Light Green) | `#10B981` (Green) | `#059669` (Dark Green) | "Completed"   | NONE     | Await decision        |
| `cancelled`   | `#FEF2F2` (Light Red)   | `#EF4444` (Red)   | `#DC2626` (Dark Red)   | "Cancelled"   | NONE     | Interview cancelled   |

**Visual Hierarchy:**

- **Rescheduled** (Amber) = **HIGH** - Time changed, needs attention
- **Scheduled** (Blue) = MEDIUM - Upcoming interview
- **Completed** (Green) = SUCCESS - Interview done
- **Cancelled** (Red) = CLOSED - No longer happening

---

## Design Rationale

### Why These Colors?

1. **Red for Rejection/Cancellation**
   - Universally recognized as "stopped" or "negative"
   - `rejected` and `cancelled` are terminal negative states
   - Clear visual indication of unsuccessful outcome

2. **Amber for New/Rescheduled**
   - Warning color that indicates "needs attention"
   - `applied` (recruiter view) requires immediate review
   - `rescheduled` requires awareness of time change
   - More urgent than blue but less severe than red

3. **Blue for Invited/Scheduled**
   - Positive, active color
   - `invited` is a positive signal from recruiter
   - `scheduled` is an expected, planned state
   - Indicates forward progress

4. **Green for Success**
   - Positive reinforcement
   - `hired` and `completed` are successful outcomes
   - `active` opportunities are successfully published
   - Encourages positive user experience

5. **Purple for Shortlisted**
   - Distinct from other states
   - Indicates special consideration
   - Between "applied" and "hired" in the workflow
   - Shows progress toward success

6. **Gray for Neutral/Pending**
   - Neutral, waiting state
   - `applied` (talent view) is passive waiting
   - `draft` is not yet active
   - No immediate action required

---

## Workflow-Based Color Progression

### Talent Application Journey

```
Applied (Gray) → Invited (Blue) → Shortlisted (Purple) → Hired (Green)
                                                        ↘ Rejected (Red)
```

### Recruiter Review Journey

```
New Application (Amber) → Invited (Blue) → Shortlisted (Purple) → Hired (Green)
                                                                 ↘ Rejected (Red)
```

### Interview Journey

```
Scheduled (Blue) → Rescheduled (Amber) → Completed (Green)
                                       ↘ Cancelled (Red)
```

### Opportunity Lifecycle

```
Draft (Gray) → Active (Green) → Closed (Red) → Reopen → Active (Green)
```

---

## Role-Specific Color Emphasis

### Talent View

- **Blue (Invited)** = Most important - Recruiter wants to talk!
- **Purple (Shortlisted)** = Good news - Under consideration
- **Gray (Applied)** = Neutral - Just waiting
- **Green (Hired)** = Success!
- **Red (Rejected)** = Move on

### Recruiter View

- **Amber (Applied)** = Most urgent - New applications to review
- **Purple (Shortlisted)** = High priority - Schedule interviews
- **Blue (Invited)** = Medium - Waiting for talent
- **Green (Hired)** = Success!
- **Red (Rejected)** = Archived

---

## Accessibility Considerations

- **Color + Text**: Status is communicated through both color AND text label
- **Contrast Ratios**: All text colors meet WCAG AA standards against their backgrounds
- **Dot Indicator**: Additional visual cue beyond just background color (where applicable)
- **Consistent Patterns**: Same colors mean the same thing across all views
- **Icon Support**: Consider adding icons for additional clarity (✓ for hired, ✗ for rejected, etc.)

---

## Implementation Guidelines

### Component Structure

```typescript
const STATUS_CONFIG: Record<
  string,
  { bg: string; dot?: string; text: string; label: string }
> = {
  status_name: {
    bg: "#HEX", // Background color
    dot: "#HEX", // Dot indicator color (optional)
    text: "#HEX", // Text color
    label: "Label", // Display text
  },
};
```

### Badge Rendering

```tsx
<div
  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md"
  style={{ backgroundColor: status.bg }}
>
  {status.dot && (
    <div
      className="w-1.5 h-1.5 rounded-full"
      style={{ backgroundColor: status.dot }}
    />
  )}
  <span
    className="text-[11px] font-normal font-inter-tight"
    style={{ color: status.text }}
  >
    {status.label}
  </span>
</div>
```

---

## Testing Checklist

### Visual Testing

- [ ] All status badges display correct colors
- [ ] Dot indicators match badge colors (where applicable)
- [ ] Text is readable against background (contrast check)
- [ ] Colors are consistent across talent and recruiter views

### User Experience Testing

- [ ] Users can quickly identify urgent items (amber/red)
- [ ] Users understand which items need action
- [ ] Positive states feel encouraging (green)
- [ ] Negative states are clear but not alarming (red)
- [ ] Neutral states don't demand attention (gray)

### Accessibility Testing

- [ ] Color blind users can distinguish statuses (text labels help)
- [ ] Screen readers announce status correctly
- [ ] Keyboard navigation works with colored badges
- [ ] High contrast mode maintains visibility

---

## Summary

The color-coded status system uses a clear visual hierarchy across the entire application workflow:

1. 🔴 **Red** = REJECTED/CANCELLED - Terminal negative states
2. 🟠 **Amber** = NEEDS ATTENTION - New applications (recruiter), rescheduled interviews
3. 🔵 **Blue** = ACTIVE/INVITED - Positive progress, scheduled events
4. 🟢 **Green** = SUCCESS - Hired, completed, active opportunities
5. 🟣 **Purple** = SHORTLISTED - Under review, special consideration
6. ⚫ **Gray** = NEUTRAL - Applied (talent), draft opportunities

This system ensures users can quickly scan their applications, opportunities, and interviews to identify which items need immediate attention, improving the overall user experience and reducing missed actions.

---

## Related Documentation

- **Session Status Colors**: `docs/SESSION_STATUS_COLOR_GUIDE.md`
- **Session Flow**: `docs/SESSION_FLOW_GUIDE.md`
- **Application API**: `docs/TALENT_APPLICATIONS_API_GUIDE.md`
- **Recruiter API**: `docs/RECRUITER_APPLICATIONS_API_GUIDE.md`
