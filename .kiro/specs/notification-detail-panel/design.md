# Design Document: Notification Detail Panel

## Overview

This design document specifies the technical implementation for enhancing the existing notification modal with a detail panel feature. The enhancement transforms the current single-panel notification list into a two-panel experience where users can view full notification details alongside the notification list.

### Current State

The application currently implements a notification system with:

- A modal component (`NotificationsModal`) positioned at `left-[250px]` with fixed width `350px`
- Role-specific notification components (TalentNotifications, MentorNotifications, EmployerNotifications)
- Support for notification types (success, warning, error, info), actions, images, and metadata
- A backdrop overlay that closes the modal when clicked
- Integration with `useNotifications` hook for data fetching and state management

### Enhancement Goals

The detail panel enhancement will:

- Add a side panel that displays full notification details when a notification is clicked
- Maintain the notification list visibility while viewing details
- Support responsive behavior for mobile and desktop viewports
- Preserve existing notification functionality (mark as read, actions, navigation)
- Ensure accessibility compliance with keyboard navigation and screen reader support

## Architecture

### Component Structure

```
NotificationsModal (existing, modified)
├── Backdrop (existing, modified behavior)
├── NotificationPanel (new wrapper for existing list)
│   ├── Header (existing)
│   └── NotificationList (existing role-specific component)
└── NotificationDetailPanel (new)
    ├── Header with close button
    ├── Content area
    │   ├── Type indicator
    │   ├── Title
    │   ├── Image/Icon display
    │   ├── Full message
    │   ├── Timestamp
    │   ├── Metadata display
    │   └── Action button
    └── Close button
```

### State Management Approach

The notification detail panel will use React's built-in state management with the following state structure:

```typescript
interface NotificationPanelState {
  selectedNotificationId: string | null;
  isDetailPanelOpen: boolean;
}
```

State will be managed at the `NotificationsModal` level and passed down to child components via props. This approach:

- Keeps state close to where it's used
- Avoids unnecessary global state complexity
- Maintains consistency with the existing codebase patterns
- Enables easy synchronization between the list and detail panel

### Data Flow

```
User clicks notification
  ↓
NotificationList calls onNotificationSelect(id)
  ↓
NotificationsModal updates selectedNotificationId state
  ↓
NotificationsModal passes selectedNotification to DetailPanel
  ↓
DetailPanel renders notification details
  ↓
User performs action (close, navigate, etc.)
  ↓
NotificationsModal updates state accordingly
```

## Components and Interfaces

### NotificationsModal (Modified)

**Purpose**: Orchestrate the two-panel layout and manage shared state

**Props**:

```typescript
interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNotificationRead?: () => void;
}
```

**State**:

```typescript
interface NotificationsModalState {
  selectedNotificationId: string | null;
}
```

**Key Responsibilities**:

- Manage selected notification state
- Render both notification list and detail panel
- Handle backdrop click behavior (close both panels)
- Coordinate responsive layout changes
- Pass callbacks to child components

**Layout Strategy**:

- Desktop (≥768px): Two-panel side-by-side layout
  - Notification list: `left-[250px]`, width `350px`
  - Detail panel: Adjacent to list, extends to right edge
- Mobile (<768px): Single panel at a time
  - Detail panel overlays and hides notification list
  - Full viewport width

### NotificationDetailPanel (New)

**Purpose**: Display comprehensive notification details

**Props**:

```typescript
interface NotificationDetailPanelProps {
  notification: Notification | null;
  isOpen: boolean;
  onClose: () => void;
  onActionClick?: (action: NotificationAction) => void;
  isMobile: boolean;
}
```

**Key Responsibilities**:

- Render notification details with proper formatting
- Display images with fallback handling
- Render action buttons with click handlers
- Handle close button interaction
- Apply type-specific styling (colors, icons)
- Manage keyboard focus when opened
- Announce content to screen readers

**Styling Approach**:

- Match existing notification panel styling (colors, typography, spacing)
- Use Tailwind CSS utility classes consistent with codebase
- Apply smooth transitions for open/close animations
- Implement scrollable content area for long notifications

### Role-Specific Notification Components (Modified)

**Components**: TalentNotifications, MentorNotifications, EmployerNotifications

**New Props**:

```typescript
interface NotificationComponentProps {
  onActionClick?: () => void;
  onNotificationRead?: () => void;
  onNotificationSelect?: (notificationId: string) => void; // NEW
  selectedNotificationId?: string | null; // NEW
}
```

**Modifications**:

- Add click handler to notification items that calls `onNotificationSelect`
- Apply visual selection indicator when `selectedNotificationId` matches item
- Prevent action button clicks from triggering selection
- Maintain existing mark-as-read behavior

## Data Models

### Notification (Existing)

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType;
  payload: Record<string, any> | InAppNotificationPayload;
  channels: NotificationChannel[];
  deliveryStatus: DeliveryStatus;
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

### InAppNotificationPayload (Existing)

```typescript
interface InAppNotificationPayload {
  title: string;
  message: string;
  type: InAppPayloadType; // "info" | "success" | "warning" | "error"
  icon?: string;
  image?: string;
  action?: NotificationAction;
  metadata?: NotificationMetadata;
}
```

### NotificationAction (Existing)

```typescript
interface NotificationAction {
  label: string;
  route?: string;
  id: string;
  actionType?: string;
}
```

### NotificationMetadata (Existing)

```typescript
interface NotificationMetadata {
  relatedId: string;
  relatedType: RelatedType;
}
```

### DetailPanelDisplayData (New)

```typescript
interface DetailPanelDisplayData {
  id: string;
  title: string;
  message: string;
  timestamp: string;
  type: InAppPayloadType;
  displayElement: {
    type: "image" | "emoji";
    value: string;
  };
  action?: NotificationAction;
  metadata?: NotificationMetadata;
  isUnread: boolean;
}
```

## Layout and Positioning Strategy

### Desktop Layout (≥768px)

**Notification List Panel**:

- Position: `fixed`, `left-[250px]`, `top-0`, `bottom-0`
- Width: `350px`
- Z-index: `50`
- Background: `#FFFFFF`
- Shadow: `shadow-lg`

**Detail Panel**:

- Position: `fixed`, `left-[600px]` (250px sidebar + 350px list)
- Width: `calc(100vw - 600px)` or max-width `500px`
- Height: `100vh`
- Z-index: `50`
- Background: `#FFFFFF`
- Shadow: `shadow-xl`
- Border-left: `border-l border-gray-200`

**Backdrop**:

- Position: `fixed`, `inset-0`
- Z-index: `40`
- Background: `rgba(0, 0, 0, 0.5)`
- Covers entire viewport behind both panels

### Mobile Layout (<768px)

**Notification List Panel** (when detail closed):

- Position: `fixed`, `inset-0`
- Width: `100vw`
- Z-index: `50`

**Detail Panel** (when open):

- Position: `fixed`, `inset-0`
- Width: `100vw`
- Z-index: `51` (above notification list)
- Hides notification list from view

**Backdrop**:

- Position: `fixed`, `inset-0`
- Z-index: `40`

### Responsive Breakpoints

- Mobile: `< 768px` (Tailwind's `md` breakpoint)
- Desktop: `≥ 768px`

Use Tailwind's responsive utilities:

```tsx
className =
  "fixed inset-0 md:left-[600px] md:right-0 md:w-auto md:max-w-[500px]";
```

## Responsive Design Implementation

### Mobile Behavior

1. **Detail Panel Opens**:
   - Detail panel slides in from right with animation
   - Notification list hidden (z-index stacking)
   - Back button or close button returns to list
   - Backdrop remains visible

2. **Navigation**:
   - User can close detail panel to return to list
   - Clicking backdrop closes both panels
   - Action buttons navigate and close all panels

3. **Touch Interactions**:
   - Tap notification to open detail
   - Swipe gesture support (optional enhancement)
   - Touch-friendly button sizes (min 44x44px)

### Desktop Behavior

1. **Detail Panel Opens**:
   - Detail panel appears adjacent to notification list
   - Both panels visible simultaneously
   - Smooth slide-in animation from right

2. **Navigation**:
   - Click different notification to update detail panel
   - Close button dismisses detail panel only
   - Backdrop click closes both panels
   - Notification list remains interactive

3. **Interaction Patterns**:
   - Hover states on notification items
   - Selected notification highlighted in list
   - Keyboard navigation between panels

### Responsive Utilities

Use custom hook for viewport detection:

```typescript
const isMobile = useIsMobile(); // Existing hook in codebase
```

Apply conditional rendering and styling:

```tsx
{
  isMobile ? <MobileDetailPanel /> : <DesktopDetailPanel />;
}
```

## Integration with Existing Notification Panel Component

### Modification Strategy

1. **NotificationsModal.tsx**:
   - Add state for `selectedNotificationId`
   - Add handler `handleNotificationSelect`
   - Pass new props to role-specific components
   - Render `NotificationDetailPanel` conditionally
   - Update backdrop click handler to close detail panel

2. **Role-Specific Components** (TalentNotifications, MentorNotifications, EmployerNotifications):
   - Add `onNotificationSelect` prop
   - Add `selectedNotificationId` prop
   - Update notification item click handler
   - Add selection styling to selected item
   - Prevent action button clicks from triggering selection

3. **Styling Updates**:
   - Add selection indicator styles (background color, border)
   - Ensure consistent type colors between list and detail
   - Add transition animations for smooth UX

### Backward Compatibility

- All existing functionality preserved
- No breaking changes to props or behavior
- Detail panel is additive enhancement
- Existing tests remain valid

### Code Reuse

- Reuse existing type color logic (`getTypeColors`)
- Reuse existing image validation (`isValidImageUrl`)
- Reuse existing display element logic (`getDisplayElement`)
- Reuse existing formatting utilities (`formatDistanceToNow`)

## Event Handling

### Notification Selection

**Trigger**: User clicks notification item in list

**Handler**: `handleNotificationSelect`

**Behavior**:

1. Mark notification as read (existing behavior)
2. Set `selectedNotificationId` state
3. Open detail panel
4. Call `onNotificationRead` callback
5. Move focus to detail panel (accessibility)

**Implementation**:

```typescript
const handleNotificationSelect = async (notificationId: string) => {
  await markAsRead(notificationId);
  setSelectedNotificationId(notificationId);
  onNotificationRead?.();
};
```

### Detail Panel Close

**Trigger**: User clicks close button in detail panel

**Handler**: `handleDetailPanelClose`

**Behavior**:

1. Clear `selectedNotificationId` state
2. Close detail panel
3. Return focus to previously selected notification item (accessibility)
4. Notification list remains open

**Implementation**:

```typescript
const handleDetailPanelClose = () => {
  setSelectedNotificationId(null);
  // Focus management handled by DetailPanel component
};
```

### Action Button Click

**Trigger**: User clicks action button in detail panel

**Handler**: `handleActionClick`

**Behavior**:

1. Execute action (navigation, etc.)
2. Close both detail panel and notification modal
3. Call `onActionClick` callback

**Implementation**:

```typescript
const handleActionClick = (action: NotificationAction) => {
  if (action.route) {
    router.push(action.route);
  }
  setSelectedNotificationId(null);
  onClose(); // Close entire modal
};
```

### Backdrop Click

**Trigger**: User clicks backdrop outside panels

**Handler**: `handleBackdropClick`

**Behavior**:

1. Close detail panel if open
2. Close notification modal
3. Clear selected notification state

**Implementation**:

```typescript
const handleBackdropClick = () => {
  setSelectedNotificationId(null);
  onClose();
};
```

### Notification List Click (while detail open)

**Trigger**: User clicks within notification list area

**Handler**: Prevent backdrop close behavior

**Behavior**:

1. Event propagation stopped
2. Detail panel remains open
3. User can select different notification

**Implementation**:

```tsx
<div onClick={(e) => e.stopPropagation()}>
  {/* Notification list content */}
</div>
```

### Keyboard Events

**Escape Key**:

- If detail panel open: Close detail panel only
- If detail panel closed: Close notification modal

**Tab Key**:

- Navigate between focusable elements
- Trap focus within modal when open

**Enter/Space on Notification Item**:

- Same behavior as click (open detail panel)

## Accessibility Implementation Details

### Keyboard Navigation

**Focus Management**:

1. When notification modal opens: Focus moves to modal container
2. When detail panel opens: Focus moves to detail panel close button
3. When detail panel closes: Focus returns to selected notification item
4. Tab key cycles through focusable elements within active panel
5. Escape key closes detail panel, then modal

**Focus Trap**:

- Implement focus trap within modal when open
- Prevent focus from moving to elements behind backdrop
- Use `aria-modal="true"` attribute

**Implementation**:

```typescript
useEffect(() => {
  if (isDetailPanelOpen && detailPanelRef.current) {
    const closeButton = detailPanelRef.current.querySelector("button");
    closeButton?.focus();
  }
}, [isDetailPanelOpen]);
```

### ARIA Attributes

**NotificationsModal**:

```tsx
<div role="dialog" aria-modal="true" aria-labelledby="notifications-title">
  <h2 id="notifications-title">Notifications</h2>
</div>
```

**NotificationDetailPanel**:

```tsx
<div
  role="complementary"
  aria-labelledby="detail-panel-title"
  aria-live="polite"
>
  <h3 id="detail-panel-title">{notification.title}</h3>
</div>
```

**Notification Items**:

```tsx
<div
  role="button"
  tabIndex={0}
  aria-pressed={isSelected}
  aria-label={`${title}. ${message}. ${timestamp}`}
  onKeyDown={handleKeyDown}
>
```

**Close Buttons**:

```tsx
<button aria-label="Close detail panel" onClick={onClose}>
  <X aria-hidden="true" />
</button>
```

### Screen Reader Announcements

**Detail Panel Opens**:

```tsx
<div aria-live="polite" className="sr-only">
  {isOpen && `Viewing details for ${notification.title}`}
</div>
```

**Notification Marked as Read**:

```tsx
<div aria-live="polite" className="sr-only">
  {wasMarkedRead && "Notification marked as read"}
</div>
```

**Action Executed**:

```tsx
<div aria-live="assertive" className="sr-only">
  {actionExecuted && `Navigating to ${action.label}`}
</div>
```

### Visual Focus Indicators

- All interactive elements have visible focus rings
- Use Tailwind's `focus:ring-2 focus:ring-blue-500 focus:outline-none`
- Ensure sufficient color contrast (WCAG AA minimum)
- Focus indicators not hidden by overflow or z-index

### Color Contrast

- Text on backgrounds meets WCAG AA standards (4.5:1 for normal text)
- Type indicator colors maintain sufficient contrast
- Selected state has clear visual distinction beyond color alone

### Alternative Text

- Images have descriptive alt text
- Icons have `aria-label` or `aria-hidden="true"` with visible text
- Action buttons have clear, descriptive labels

## Error Handling

### Notification Not Found

**Scenario**: Selected notification is deleted or removed while detail panel is open

**Handling**:

1. Detect notification removal in useEffect
2. Automatically close detail panel
3. Clear selected notification state
4. Show toast notification (optional): "Notification no longer available"

**Implementation**:

```typescript
useEffect(() => {
  if (
    selectedNotificationId &&
    !notifications.find((n) => n.id === selectedNotificationId)
  ) {
    setSelectedNotificationId(null);
  }
}, [notifications, selectedNotificationId]);
```

### Image Load Failure

**Scenario**: Notification image URL fails to load

**Handling**:

1. Use `onError` handler on `<img>` element
2. Fall back to emoji/icon display
3. Log error for debugging (non-blocking)

**Implementation**:

```tsx
<img
  src={imageUrl}
  alt={title}
  onError={(e) => {
    e.currentTarget.style.display = "none";
    setDisplayFallback(true);
  }}
/>;
{
  displayFallback && <div className="emoji-fallback">📌</div>;
}
```

### Network Errors (Mark as Read)

**Scenario**: API call to mark notification as read fails

**Handling**:

1. Catch error in markAsRead function
2. Show error toast: "Failed to mark notification as read"
3. Allow user to retry
4. Detail panel remains functional
5. Optimistic UI update with rollback on error

**Implementation**:

```typescript
const handleMarkAsRead = async (id: string) => {
  const previousState = notifications;
  // Optimistic update
  updateNotificationLocally(id, { readAt: new Date().toISOString() });

  try {
    await markAsRead(id);
  } catch (error) {
    // Rollback
    setNotifications(previousState);
    toast.error("Failed to mark notification as read");
  }
};
```

### Invalid Notification Data

**Scenario**: Notification payload is malformed or missing required fields

**Handling**:

1. Validate payload structure before rendering
2. Provide default values for missing fields
3. Log validation errors
4. Display generic notification if critical fields missing

**Implementation**:

```typescript
const validateNotification = (notification: Notification): boolean => {
  const payload = notification.payload as InAppNotificationPayload;
  return !!(payload?.title && payload?.message);
};

const getDisplayData = (notification: Notification): DetailPanelDisplayData => {
  const payload = notification.payload as InAppNotificationPayload;
  return {
    title: payload?.title || "Notification",
    message: payload?.message || "No message available",
    // ... other fields with defaults
  };
};
```

### Responsive Layout Issues

**Scenario**: Viewport resize while detail panel is open

**Handling**:

1. Listen to window resize events
2. Recalculate layout on breakpoint changes
3. Smoothly transition between mobile and desktop layouts
4. Maintain detail panel open state across transitions

**Implementation**:

```typescript
useEffect(() => {
  const handleResize = () => {
    setIsMobile(window.innerWidth < 768);
  };

  window.addEventListener("resize", handleResize);
  return () => window.removeEventListener("resize", handleResize);
}, []);
```

### Action Execution Failure

**Scenario**: Navigation or action execution fails

**Handling**:

1. Wrap action execution in try-catch
2. Show error toast with specific message
3. Keep detail panel open for user to retry
4. Log error for debugging

**Implementation**:

```typescript
const handleActionClick = async (action: NotificationAction) => {
  try {
    if (action.route) {
      await router.push(action.route);
      onClose();
    }
  } catch (error) {
    toast.error(`Failed to navigate: ${error.message}`);
    console.error("Action execution failed:", error);
  }
};
```

## Testing Strategy

The testing strategy employs both unit tests and property-based tests to ensure comprehensive coverage. Unit tests verify specific examples and edge cases, while property-based tests validate universal properties across randomized inputs.

### Unit Testing

**Framework**: Vitest with React Testing Library

**Test Files**:

- `NotificationDetailPanel.test.tsx`
- `NotificationsModal.test.tsx`
- `NotificationIntegration.test.tsx`

**Unit Test Coverage**:

1. **Component Rendering**:
   - Detail panel renders with correct notification data
   - Type-specific styling applied correctly
   - Images and icons display properly
   - Action buttons render when present
   - Metadata displays in structured format

2. **User Interactions**:
   - Clicking notification opens detail panel
   - Close button dismisses detail panel
   - Action button executes correct action
   - Backdrop click closes both panels
   - Clicking within list doesn't close panels

3. **State Management**:
   - Selected notification state updates correctly
   - Detail panel opens/closes based on state
   - Selection indicator appears on correct item
   - State clears when notification deleted

4. **Responsive Behavior**:
   - Mobile layout renders correctly
   - Desktop layout renders correctly
   - Layout updates on viewport resize
   - Touch interactions work on mobile

5. **Accessibility**:
   - Focus moves to detail panel when opened
   - Focus returns to list item when closed
   - Keyboard navigation works correctly
   - ARIA attributes present and correct
   - Screen reader announcements triggered

6. **Error Handling**:
   - Image load failure shows fallback
   - Missing notification closes detail panel
   - Invalid data displays defaults
   - Network errors show error messages

**Example Unit Tests**:

```typescript
describe('NotificationDetailPanel', () => {
  it('renders notification details correctly', () => {
    const notification = createMockNotification();
    render(<NotificationDetailPanel notification={notification} isOpen={true} />);

    expect(screen.getByText(notification.payload.title)).toBeInTheDocument();
    expect(screen.getByText(notification.payload.message)).toBeInTheDocument();
  });

  it('calls onClose when close button clicked', () => {
    const onClose = vi.fn();
    render(<NotificationDetailPanel notification={mockNotification} isOpen={true} onClose={onClose} />);

    fireEvent.click(screen.getByLabelText('Close detail panel'));
    expect(onClose).toHaveBeenCalledOnce();
  });

  it('displays action button when action present', () => {
    const notification = createMockNotification({
      action: { label: 'View Details', route: '/details', id: '1' }
    });
    render(<NotificationDetailPanel notification={notification} isOpen={true} />);

    expect(screen.getByText('View Details')).toBeInTheDocument();
  });
});
```

### Property-Based Testing

**Framework**: fast-check (already in dependencies)

**Configuration**: Minimum 100 iterations per property test

**Test Tags**: Each property test must include a comment referencing the design property:

```typescript
// Feature: notification-detail-panel, Property 1: Selection state consistency
```

**Property Test Coverage**:

Property-based tests will be implemented during the implementation phase based on the correctness properties defined in the next section.

### Integration Testing

**Scope**: Test interaction between notification list and detail panel

**Key Integration Tests**:

1. Selecting notification in list opens detail panel with correct data
2. Marking notification as read updates both list and detail panel
3. Deleting notification while viewing closes detail panel
4. Switching between notifications updates detail panel content
5. Responsive layout changes maintain correct state

### Manual Testing Checklist

**Desktop Testing**:

- [ ] Two-panel layout displays correctly
- [ ] Clicking notifications opens detail panel
- [ ] Both panels remain visible and interactive
- [ ] Backdrop click closes both panels
- [ ] Close button closes detail panel only
- [ ] Action buttons navigate correctly
- [ ] Keyboard navigation works smoothly
- [ ] Focus management is correct

**Mobile Testing**:

- [ ] Detail panel overlays notification list
- [ ] Back/close returns to notification list
- [ ] Touch interactions are responsive
- [ ] Swipe gestures work (if implemented)
- [ ] Layout adapts on orientation change

**Accessibility Testing**:

- [ ] Screen reader announces content correctly
- [ ] Keyboard-only navigation is complete
- [ ] Focus indicators are visible
- [ ] Color contrast meets WCAG AA
- [ ] ARIA attributes are correct

**Cross-Browser Testing**:

- [ ] Chrome/Edge (Chromium)
- [ ] Firefox
- [ ] Safari (macOS and iOS)
- [ ] Mobile browsers (Chrome, Safari)

## Correctness Properties

A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.

### Property 1: Notification Click Marks as Read

For any notification in the notification list, when a user clicks that notification, the system should mark it as read (update readAt timestamp).

**Validates: Requirements 1.1**

### Property 2: Notification Click Opens Detail Panel

For any notification in the notification list, when a user clicks that notification, the detail panel should open and display that notification's details.

**Validates: Requirements 1.2**

### Property 3: Notification Panel Remains Visible

For any notification selection that opens the detail panel, the notification panel should remain visible and accessible (not hidden or disabled).

**Validates: Requirements 1.3**

### Property 4: Detail Panel Height Matches Notification Panel

For any viewport height, when the detail panel is open, its height should match the notification panel height.

**Validates: Requirements 2.3**

### Property 5: Backdrop Remains Visible

For any state where the detail panel is open, the backdrop should remain visible behind both panels (z-index ordering maintained).

**Validates: Requirements 1.5, 2.4**

### Property 6: Title Display Completeness

For any notification, when displayed in the detail panel, the notification title should be rendered without modification or truncation.

**Validates: Requirements 3.1**

### Property 7: Message Display Completeness

For any notification with a message of any length, when displayed in the detail panel, the complete message should be rendered without truncation.

**Validates: Requirements 3.2**

### Property 8: Timestamp Formatting

For any notification with a timestamp, when displayed in the detail panel, the timestamp should be formatted in a human-readable relative format (e.g., "2 hours ago").

**Validates: Requirements 3.3**

### Property 9: Type Indicator Display

For any notification with a type (success, warning, error, info), when displayed in the detail panel, the appropriate type-specific colors and icons should be applied.

**Validates: Requirements 3.4**

### Property 10: Conditional Image Display

For any notification that includes an image or icon in its payload, when displayed in the detail panel, the image should be rendered at an appropriate size.

**Validates: Requirements 3.5**

### Property 11: Conditional Action Button Display

For any notification that includes action button data in its payload, when displayed in the detail panel, the action button should be rendered.

**Validates: Requirements 3.6**

### Property 12: Conditional Metadata Display

For any notification that includes metadata with related content in its payload, when displayed in the detail panel, the related information should be displayed in a structured format.

**Validates: Requirements 3.7**

### Property 13: Close Button Presence and Function

For any detail panel instance, it should include a close button that, when clicked, dismisses the detail panel.

**Validates: Requirements 4.1**

### Property 14: Close Button Preserves Notification Panel

For any detail panel instance, when the close button is clicked, the detail panel should close and the notification panel should remain open.

**Validates: Requirements 4.2**

### Property 15: Notification Switching Updates Detail Panel

For any two notifications A and B, when viewing notification A in the detail panel and then clicking notification B, the detail panel should update to display notification B's details.

**Validates: Requirements 4.3**

### Property 16: Backdrop Click Closes Both Panels

For any state where the notification panel and detail panel are open, when the user clicks the backdrop outside both panels, both panels should close.

**Validates: Requirements 4.4**

### Property 17: Notification Panel Click Preserves Detail Panel

For any state where the detail panel is open, when the user clicks within the notification panel area, the detail panel should remain open.

**Validates: Requirements 4.5**

### Property 18: Action Button Execution

For any notification with an action button, when the user clicks the action button in the detail panel, the system should execute the associated action.

**Validates: Requirements 5.2**

### Property 19: Action Navigation Closes Panels

For any notification with an action that includes a navigation route, when the user clicks the action button, the system should close both panels and navigate to the target route.

**Validates: Requirements 5.3**

### Property 20: Action Callback Invocation

For any notification with an action button, when the user clicks the action button and an onActionClick callback is provided, the system should invoke the callback.

**Validates: Requirements 5.4**

### Property 21: Action Label Fidelity

For any notification with an action button, the action button label displayed in the detail panel should exactly match the label specified in the notification payload.

**Validates: Requirements 5.5**

### Property 22: Content Overflow Scrollability

For any notification with content that exceeds the available detail panel height, the detail panel should be scrollable to access all content.

**Validates: Requirements 6.4**

### Property 23: Selection Indicator Display

For any notification that is selected, the corresponding notification item in the list should display a visual indicator (distinct background color or border) showing it is selected.

**Validates: Requirements 7.1, 7.2**

### Property 24: Selection Indicator Removal

For any state where the detail panel is closed, no notification items should display selection indicators.

**Validates: Requirements 7.3**

### Property 25: Styling Consistency

For any detail panel instance, it should use the same color variables, typography classes, and spacing values as the notification panel.

**Validates: Requirements 7.4**

### Property 26: Type Color Consistency

For any notification with a type (success, warning, error, info), the colors applied in the detail panel should match the colors applied in the notification list for that type.

**Validates: Requirements 7.5**

### Property 27: Keyboard Navigation Support

For any detail panel instance, all interactive elements should be accessible via keyboard using standard navigation keys (Tab, Enter, Space, Escape).

**Validates: Requirements 8.1**

### Property 28: Focus Movement on Open

For any notification selection that opens the detail panel, keyboard focus should move to an element within the detail panel (specifically the close button).

**Validates: Requirements 8.2**

### Property 29: Screen Reader Announcement

For any notification selection that opens the detail panel, the detail panel content should be announced to screen readers (via aria-live region or focus management).

**Validates: Requirements 8.4**

### Property 30: Focus Restoration on Close

For any detail panel closure via keyboard, keyboard focus should return to the previously selected notification item in the list.

**Validates: Requirements 8.5**

### Property 31: Non-Blocking Rendering

For any detail panel render operation, the notification panel should remain interactive and responsive to user input.

**Validates: Requirements 9.4**

### Property 32: Cascading Close Behavior

For any state where both the notification panel and detail panel are open, when the notification panel is closed, the detail panel should also close.

**Validates: Requirements 10.1**

### Property 33: Deleted Notification Handling

For any notification being viewed in the detail panel, if that notification is deleted or removed from the list, the detail panel should close automatically.

**Validates: Requirements 10.2**

### Property 34: Selection State Persistence

For any selected notification, the system should maintain the selected notification state until either a new notification is selected or the detail panel is explicitly closed.

**Validates: Requirements 10.3**

### Property 35: Refresh Resilience

For any notification being viewed in the detail panel, when the notification list is refreshed, if that notification still exists in the refreshed list, the detail panel should continue displaying it.

**Validates: Requirements 10.4**

### Property 36: Reactive Content Updates

For any notification being viewed in the detail panel, when that notification's data is updated in the background, the detail panel should reflect the updated content.

**Validates: Requirements 10.5**
