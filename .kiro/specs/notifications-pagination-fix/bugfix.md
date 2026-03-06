# Bugfix Requirements Document

## Introduction

The useNotifications hook crashes with a runtime TypeError when attempting to calculate the unread notifications count. The error "notifications.filter is not a function" occurs because the API has been updated to return paginated responses in the format `{data: T[], pagination: {...}}`, but the client-side code still expects a direct array of `Notification[]`. This mismatch causes the notifications variable to be an object instead of an array, leading to the failure when calling array methods like `.filter()`.

This bug affects:

- `hooks/useNotifications.ts` (line 116 - unreadCount calculation)
- `lib/api/notifications/index.ts` (getNotifications function)
- `lib/api/notifications/server.ts` (getServerNotifications function)

## Bug Analysis

### Current Behavior (Defect)

1.1 WHEN the API returns a paginated response `{data: Notification[], pagination: {...}}` THEN the client-side code treats the entire response object as the notifications array

1.2 WHEN useNotifications hook attempts to calculate unreadCount using `notifications.filter()` THEN the application crashes with TypeError "notifications.filter is not a function"

1.3 WHEN getNotifications() is called in lib/api/notifications/index.ts THEN it returns the paginated response object instead of extracting the data array

1.4 WHEN getServerNotifications() is called in lib/api/notifications/server.ts THEN it returns the paginated response object instead of extracting the data array

1.5 WHEN markAllNotificationsAsRead() iterates over notifications THEN it fails because notifications is an object, not an array

### Expected Behavior (Correct)

2.1 WHEN the API returns a paginated response `{data: Notification[], pagination: {...}}` THEN the client-side code SHALL extract and return only the data array

2.2 WHEN useNotifications hook attempts to calculate unreadCount using `notifications.filter()` THEN the application SHALL successfully filter the array without crashing

2.3 WHEN getNotifications() is called in lib/api/notifications/index.ts THEN it SHALL extract and return the data array from the paginated response

2.4 WHEN getServerNotifications() is called in lib/api/notifications/server.ts THEN it SHALL extract and return the data array from the paginated response

2.5 WHEN markAllNotificationsAsRead() iterates over notifications THEN it SHALL successfully iterate over the array and mark each notification as read

### Unchanged Behavior (Regression Prevention)

3.1 WHEN fetchNotifications() is called THEN the system SHALL CONTINUE TO fetch all notifications for the current user with optional recipientRole filtering

3.2 WHEN fetchUnreadNotifications() is called THEN the system SHALL CONTINUE TO fetch only unread notifications

3.3 WHEN markAsRead() is called with a notification ID THEN the system SHALL CONTINUE TO mark that specific notification as read and update the local state

3.4 WHEN markAllAsRead() is called THEN the system SHALL CONTINUE TO mark all notifications as read for the current user

3.5 WHEN getNotifications() is called with filters (userId, type, deliveryStatus, read, recipientRole) THEN the system SHALL CONTINUE TO apply those filters correctly

3.6 WHEN getUnreadNotificationsCount() is called THEN the system SHALL CONTINUE TO return the correct count of unread notifications

3.7 WHEN notifications state is updated THEN the system SHALL CONTINUE TO trigger re-renders in components using the hook

3.8 WHEN error handling occurs during API calls THEN the system SHALL CONTINUE TO set appropriate error messages and log errors to console
