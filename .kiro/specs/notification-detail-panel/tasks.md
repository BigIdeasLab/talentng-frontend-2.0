# Implementation Plan: Notification Detail Panel

## Overview

This implementation plan transforms the existing single-panel notification modal into a two-panel experience where users can view full notification details alongside the notification list. The implementation uses TypeScript with React and follows the existing codebase patterns, including Tailwind CSS for styling and the useNotifications hook for data management.

## Tasks

- [x] 1. Create NotificationDetailPanel component
  - [x] 1.1 Create NotificationDetailPanel.tsx component file
    - Create new component in components directory with TypeScript interfaces
    - Implement props interface: notification, isOpen, onClose, onActionClick, isMobile
    - Set up component structure with header, content area, and close button
    - _Requirements: 1.2, 3.1, 3.2, 3.3, 3.4, 4.1_
  
  - [ ]* 1.2 Write property test for NotificationDetailPanel rendering
    - **Property 6: Title Display Completeness**
    - **Property 7: Message Display Completeness**
    - **Property 8: Timestamp Formatting**
    - **Validates: Requirements 3.1, 3.2, 3.3**
  
  - [x] 1.3 Implement detail panel content display logic
    - Display notification title, message, timestamp, and type indicator
    - Implement conditional rendering for images/icons with fallback handling
    - Implement conditional rendering for action buttons
    - Implement conditional rendering for metadata display
    - Apply type-specific styling (colors, icons) using existing getTypeColors logic
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7_
  
  - [ ]* 1.4 Write property test for conditional content display
    - **Property 10: Conditional Image Display**
    - **Property 11: Conditional Action Button Display**
    - **Property 12: Conditional Metadata Display**
    - **Validates: Requirements 3.5, 3.6, 3.7**
  
  - [x] 1.5 Implement detail panel styling and layout
    - Apply Tailwind CSS classes for positioning (fixed, left, width, height)
    - Implement desktop layout (adjacent to notification list, max-width 500px)
    - Implement mobile layout (full viewport width, z-index above list)
    - Add scrollable content area for overflow handling
    - Apply consistent styling with notification panel (colors, typography, spacing)
    - Add smooth transitions for open/close animations
    - _Requirements: 2.1, 2.2, 2.3, 2.5, 6.1, 6.2, 6.3, 6.4, 7.4, 7.5_
  
  - [ ]* 1.6 Write property test for styling consistency
    - **Property 25: Styling Consistency**
    - **Property 26: Type Color Consistency**
    - **Validates: Requirements 7.4, 7.5**

- [x] 2. Modify NotificationsModal for two-panel layout
  - [x] 2.1 Add state management for selected notification
    - Add selectedNotificationId state (string | null)
    - Implement handleNotificationSelect handler
    - Implement handleDetailPanelClose handler
    - Implement handleActionClick handler with navigation and panel closure
    - _Requirements: 1.1, 1.2, 4.1, 4.2, 4.3, 5.2, 5.3, 10.3_
  
  - [ ]* 2.2 Write property test for state management
    - **Property 2: Notification Click Opens Detail Panel**
    - **Property 13: Close Button Presence and Function**
    - **Property 14: Close Button Preserves Notification Panel**
    - **Property 15: Notification Switching Updates Detail Panel**
    - **Property 34: Selection State Persistence**
    - **Validates: Requirements 1.2, 4.1, 4.2, 4.3, 10.3**
  
  - [x] 2.3 Integrate NotificationDetailPanel into NotificationsModal
    - Import and render NotificationDetailPanel component
    - Pass selectedNotification data to detail panel
    - Pass event handlers (onClose, onActionClick) to detail panel
    - Pass isMobile prop from useIsMobile hook
    - Implement conditional rendering based on selectedNotificationId
    - _Requirements: 1.2, 1.3, 4.2_
  
  - [x] 2.4 Update backdrop click behavior
    - Modify backdrop onClick to close both panels
    - Add stopPropagation to notification list container to prevent backdrop close
    - Ensure detail panel closure when notification modal closes
    - _Requirements: 4.4, 4.5, 10.1_
  
  - [ ]* 2.5 Write property test for backdrop and panel interactions
    - **Property 3: Notification Panel Remains Visible**
    - **Property 16: Backdrop Click Closes Both Panels**
    - **Property 17: Notification Panel Click Preserves Detail Panel**
    - **Property 32: Cascading Close Behavior**
    - **Validates: Requirements 1.3, 4.4, 4.5, 10.1**

- [x] 3. Update role-specific notification components for selection support
  - [x] 3.1 Modify TalentNotifications component
    - Add onNotificationSelect prop to component interface
    - Add selectedNotificationId prop to component interface
    - Update notification item click handler to call onNotificationSelect
    - Add selection indicator styling (background color, border) when item is selected
    - Prevent action button clicks from triggering selection (stopPropagation)
    - Maintain existing mark-as-read behavior
    - _Requirements: 1.1, 1.2, 7.1, 7.2, 7.3_
  
  - [x] 3.2 Modify MentorNotifications component
    - Apply same modifications as TalentNotifications
    - Add onNotificationSelect and selectedNotificationId props
    - Update click handlers and selection styling
    - _Requirements: 1.1, 1.2, 7.1, 7.2, 7.3_
  
  - [x] 3.3 Modify EmployerNotifications component
    - Apply same modifications as TalentNotifications
    - Add onNotificationSelect and selectedNotificationId props
    - Update click handlers and selection styling
    - _Requirements: 1.1, 1.2, 7.1, 7.2, 7.3_
  
  - [ ]* 3.4 Write property test for selection indicators
    - **Property 23: Selection Indicator Display**
    - **Property 24: Selection Indicator Removal**
    - **Validates: Requirements 7.1, 7.2, 7.3**
  
  - [ ]* 3.5 Write property test for mark as read behavior
    - **Property 1: Notification Click Marks as Read**
    - **Validates: Requirements 1.1**

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement responsive behavior
  - [x] 5.1 Add responsive layout classes to NotificationDetailPanel
    - Use Tailwind responsive utilities (md: breakpoint at 768px)
    - Mobile: full viewport width (inset-0), z-index 51
    - Desktop: adjacent positioning (left-[600px]), max-width 500px, z-index 50
    - Ensure smooth transitions between layouts on viewport resize
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [x] 5.2 Implement viewport resize handling
    - Use existing useIsMobile hook for responsive detection
    - Pass isMobile prop to NotificationDetailPanel
    - Ensure detail panel state persists across layout transitions
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 5.3 Write unit tests for responsive behavior
    - Test mobile layout rendering (full width, hides notification list)
    - Test desktop layout rendering (adjacent panels, both visible)
    - Test viewport resize transitions
    - _Requirements: 6.1, 6.2, 6.3_

- [x] 6. Implement accessibility features
  - [x] 6.1 Add keyboard navigation support
    - Implement focus management: move focus to detail panel close button on open
    - Implement focus restoration: return focus to selected notification item on close
    - Add keyboard event handlers (Escape to close, Tab for navigation)
    - Ensure all interactive elements are keyboard accessible
    - _Requirements: 8.1, 8.2, 8.5_
  
  - [ ]* 6.2 Write property test for focus management
    - **Property 28: Focus Movement on Open**
    - **Property 30: Focus Restoration on Close**
    - **Validates: Requirements 8.2, 8.5**
  
  - [x] 6.3 Add ARIA attributes and screen reader support
    - Add role="complementary" to detail panel
    - Add aria-labelledby for detail panel title
    - Add aria-live="polite" for content announcements
    - Add aria-label to close button
    - Add aria-pressed to notification items for selection state
    - Add sr-only announcements for state changes
    - _Requirements: 8.3, 8.4_
  
  - [ ]* 6.4 Write property test for screen reader announcements
    - **Property 29: Screen Reader Announcement**
    - **Validates: Requirements 8.4**
  
  - [x] 6.5 Ensure color contrast and visual focus indicators
    - Apply focus:ring-2 focus:ring-blue-500 to all interactive elements
    - Verify type indicator colors meet WCAG AA contrast standards
    - Ensure selection indicators have sufficient contrast
    - Add visible focus indicators that are not hidden by overflow
    - _Requirements: 8.1_

- [x] 7. Implement error handling
  - [x] 7.1 Handle notification deletion while viewing
    - Add useEffect to detect when selected notification is removed from list
    - Automatically close detail panel when notification no longer exists
    - Clear selectedNotificationId state
    - _Requirements: 10.2_
  
  - [ ]* 7.2 Write property test for deleted notification handling
    - **Property 33: Deleted Notification Handling**
    - **Validates: Requirements 10.2**
  
  - [x] 7.3 Handle image load failures
    - Add onError handler to img elements
    - Implement fallback to emoji/icon display on image load failure
    - Hide broken image and show fallback element
    - _Requirements: 3.5_
  
  - [x] 7.4 Handle notification list refresh
    - Ensure detail panel continues displaying selected notification if it still exists
    - Update detail panel content if notification data changes
    - _Requirements: 10.4, 10.5_
  
  - [ ]* 7.5 Write property test for refresh resilience
    - **Property 35: Refresh Resilience**
    - **Property 36: Reactive Content Updates**
    - **Validates: Requirements 10.4, 10.5**
  
  - [x] 7.6 Handle action execution failures
    - Wrap action execution in try-catch block
    - Show error toast on navigation or action failure
    - Keep detail panel open for user to retry
    - Log errors for debugging
    - _Requirements: 5.2, 5.3_

- [x] 8. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Write integration tests
  - [ ]* 9.1 Write integration test for notification selection flow
    - Test clicking notification in list opens detail panel with correct data
    - Test marking notification as read updates both list and detail panel
    - Test switching between notifications updates detail panel content
    - _Requirements: 1.1, 1.2, 4.3_
  
  - [ ]* 9.2 Write integration test for action button flow
    - **Property 18: Action Button Execution**
    - **Property 19: Action Navigation Closes Panels**
    - **Property 20: Action Callback Invocation**
    - **Property 21: Action Label Fidelity**
    - **Validates: Requirements 5.1, 5.2, 5.3, 5.4, 5.5**
  
  - [ ]* 9.3 Write integration test for responsive layout transitions
    - Test layout changes on viewport resize
    - Test state persistence across layout transitions
    - Test mobile and desktop interaction patterns
    - _Requirements: 6.1, 6.2, 6.3_
  
  - [ ]* 9.4 Write integration test for backdrop and panel interactions
    - **Property 4: Detail Panel Height Matches Notification Panel**
    - **Property 5: Backdrop Remains Visible**
    - **Validates: Requirements 2.3, 2.4, 1.5**

- [x] 10. Final checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties from the design document
- Unit tests validate specific examples and edge cases
- The implementation uses TypeScript with React, Tailwind CSS, and existing codebase patterns
- All 36 correctness properties from the design document are covered by property-based tests
- Focus on maintaining backward compatibility with existing notification functionality
