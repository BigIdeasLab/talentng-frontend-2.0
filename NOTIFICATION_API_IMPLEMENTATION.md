# Notification API Implementation Guide

This document describes the complete Notification API integration implemented in the talent.ng frontend.

## Overview

The frontend now fully integrates with the Talent.ng Backend Notification API. The implementation includes:

- Complete API client with all endpoints
- React hook for notification management
- Role-specific UI components (Talent, Employer, Mentor)
- Type-safe interfaces matching backend specification
- Error handling and loading states
- Real-time notification marking

## Architecture

### File Structure

```
lib/
├── api/
│   └── notifications/
│       ├── index.ts          # API client methods
│       └── types.ts          # Type re-exports
└── types/
    └── notification.ts       # Core type definitions

hooks/
└── useNotifications.ts       # React hook for notification management

components/
├── talent/notification/
│   ├── TalentNotifications.tsx
│   └── NotificationItem.tsx
├── employer/notification/
│   └── EmployerNotifications.tsx
├── mentor/notification/
│   └── MentorNotifications.tsx
└── layouts/modals/
    └── NotificationsModal.tsx
```

## Core Types

### Notification Type Definition

```typescript
interface Notification {
  id: string;
  userId: string;
  type: NotificationType; // admin_notice | job_alert | message | profile_update | application_update | system_alert
  payload: Record<string, any>;
  channels: NotificationChannel[]; // email | push | in_app | sms
  deliveryStatus: DeliveryStatus; // queued | sent | failed
  readAt: string | null;
  createdAt: string;
  updatedAt: string;
}
```

## API Methods

### Available Functions

All methods are located in `lib/api/notifications/index.ts`:

#### 1. Create Notification (Admin Only)

```typescript
createNotification(payload: CreateNotificationPayload): Promise<Notification>
```

#### 2. Get Notifications

```typescript
getNotifications(filters?: GetNotificationsFilters): Promise<Notification[]>

// Example usage:
// Get all unread notifications
await getNotifications({ read: false });

// Get specific type
await getNotifications({ type: 'job_alert' });

// Get failed deliveries (admin)
await getNotifications({ deliveryStatus: 'failed' });
```

#### 3. Get Notification by ID

```typescript
getNotificationById(notificationId: string): Promise<Notification>
```

#### 4. Update Notification

```typescript
updateNotification(notificationId: string, payload: UpdateNotificationPayload): Promise<Notification>
```

#### 5. Mark as Read

```typescript
markNotificationAsRead(notificationId: string): Promise<Notification>
markAllNotificationsAsRead(): Promise<void>
```

#### 6. Delete Notification (Admin Only)

```typescript
deleteNotification(notificationId: string): Promise<Notification>
```

#### 7. Helper Methods

```typescript
getUnreadNotificationsCount(): Promise<number>
getNotificationsByType(type: string): Promise<Notification[]>
getFailedNotifications(): Promise<Notification[]>
```

## React Hook: useNotifications

The `useNotifications` hook provides a complete interface for managing notifications in React components:

```typescript
const {
  notifications, // Current notifications array
  loading, // Loading state
  error, // Error message
  unreadCount, // Count of unread notifications
  fetchNotifications, // Fetch all notifications
  fetchUnreadNotifications, // Fetch only unread
  markAsRead, // Mark specific notification as read
  markAllAsRead, // Mark all as read
  isNotificationOpen, // Modal open state
  setIsNotificationOpen, // Toggle modal
} = useNotifications();
```

### Example Usage

```typescript
"use client";

import { useNotifications } from "@/hooks/useNotifications";

export function MyComponent() {
  const {
    notifications,
    loading,
    error,
    unreadCount,
    markAsRead,
    markAllAsRead
  } = useNotifications();

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <div>
      <h2>Notifications ({unreadCount} unread)</h2>
      <button onClick={markAllAsRead}>Mark All as Read</button>

      {notifications.map(notif => (
        <div
          key={notif.id}
          onClick={() => markAsRead(notif.id)}
        >
          <h3>{notif.payload.title}</h3>
          <p>{notif.payload.message}</p>
        </div>
      ))}
    </div>
  );
}
```

## UI Components

### NotificationsModal

The modal that displays notifications based on user role:

```typescript
<NotificationsModal isOpen={isOpen} onClose={onClose} />
```

Automatically renders:

- `TalentNotifications` for talent users
- `EmployerNotifications` for recruiter users
- `MentorNotifications` for mentor users

### Role-Specific Components

All three role-specific components (`TalentNotifications`, `EmployerNotifications`, `MentorNotifications`) now:

1. Use the `useNotifications` hook to fetch real data
2. Display loading state while fetching
3. Display error state if fetch fails
4. Show empty state when no notifications exist
5. Format notifications with relative timestamps using `date-fns`
6. Mark notifications as read on click
7. Show delivery status indicators

## Features

### 1. Real-Time Notification Updates

The hook fetches notifications on mount and can be manually refreshed:

```typescript
const { fetchNotifications } = useNotifications();

// Manually refresh
await fetchNotifications();
```

### 2. Unread Count

Automatically calculated from notifications:

```typescript
const { unreadCount } = useNotifications();
// Returns: number of notifications where readAt is null
```

### 3. Error Handling

All API calls are wrapped with try-catch and proper error messages:

```typescript
if (error) {
  console.log(error); // User-friendly error message
}
```

### 4. Filtering

Get notifications by various criteria:

```typescript
// Unread only
await getNotifications({ read: false });

// By type
await getNotifications({ type: "job_alert" });

// By delivery status
await getNotifications({ deliveryStatus: "sent" });

// Multiple filters
await getNotifications({
  userId: "user-id",
  read: false,
  type: "application_update",
});
```

## Integration Points

### 1. Notifications Header Badge

The notification badge should call:

```typescript
const { unreadCount } = useNotifications();
<Badge count={unreadCount} />
```

### 2. Notification Center Click

```typescript
const { setIsNotificationOpen } = useNotifications();

<button onClick={() => setIsNotificationOpen(true)}>
  Notifications
</button>
```

### 3. Mark Notification on Action

```typescript
const { markAsRead } = useNotifications();

const handleNotificationClick = (notificationId: string) => {
  // Do something with the notification

  // Mark as read
  await markAsRead(notificationId);
};
```

## Payload Structure

Notifications have flexible payloads. The API accepts any JSON object:

```typescript
// Example payload
{
  title: "Job Application Update",
  message: "Your application was reviewed",
  action_url: "/applications/123",
  company_name: "Acme Corp",
  job_title: "Senior Developer"
}
```

The components display `payload.title` and `payload.message`.

## Error Handling

### API Errors

All errors from the API client are captured:

```typescript
if (error) {
  // error is a user-friendly error message
  // Examples:
  // - "Failed to fetch notifications."
  // - "Failed to mark notification as read."
  // - "Session expired - please log in again"
  // - "Server error. Please try again later."
}
```

### Access Control Errors

- **401 Unauthorized**: User not authenticated (redirects to login)
- **403 Forbidden**: User doesn't have permission (error state shown)
- **404 Not Found**: Notification doesn't exist (error state shown)

## Best Practices

### 1. Debounce Mark-as-Read

For performance, consider debouncing rapid mark-as-read calls:

```typescript
import { useDebounce } from "@/hooks/useDebounce";

const debouncedMarkAsRead = useDebounce((id: string) => {
  markAsRead(id);
}, 300);
```

### 2. Polling for Updates

To implement polling for new notifications:

```typescript
useEffect(() => {
  const interval = setInterval(fetchNotifications, 30000); // Every 30 seconds
  return () => clearInterval(interval);
}, [fetchNotifications]);
```

### 3. Batch Operations

Mark multiple notifications as read efficiently:

```typescript
const handleMarkMultipleAsRead = async (ids: string[]) => {
  await Promise.all(ids.map((id) => markAsRead(id)));
};
```

## Testing

### Mock Data for Development

Replace real API calls with mock data in development:

```typescript
// In your development environment
const mockNotifications: Notification[] = [
  {
    id: "1",
    userId: "user-123",
    type: "job_alert",
    payload: {
      title: "New Job Match",
      message: "A new job matches your profile",
    },
    channels: ["email", "push"],
    deliveryStatus: "sent",
    readAt: null,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];
```

## Future Enhancements

### 1. WebSocket Support

Once the backend implements WebSocket support, replace polling with real-time updates.

### 2. Pagination

When large datasets are returned, implement pagination:

```typescript
// Future API signature
getNotifications(filters: GetNotificationsFilters & { page?: number; limit?: number })
```

### 3. Notification Preferences

Add user preferences for notification types and channels.

### 4. Notification Actions

Allow notifications to trigger specific actions:

```typescript
interface Notification {
  actions?: {
    label: string;
    onClick: (notificationId: string) => Promise<void>;
  }[];
}
```

## Troubleshooting

### Notifications Not Loading

1. Check if user is authenticated (verify JWT token)
2. Check browser console for API errors
3. Verify backend is running and API is accessible
4. Check if user has notifications

### Mark as Read Not Working

1. Verify `notificationId` is correct
2. Check if notification belongs to current user
3. Check error state for details

### Empty Notification List

1. Create test notifications on the backend
2. Verify `userId` is correct
3. Check delivery status and read filters

## API Reference

For detailed API documentation, see the Notification API Implementation Guide provided by the backend team.

### Base URL

```
/api/notifications
```

### Authentication

All requests require:

```
Authorization: Bearer <JWT_TOKEN>
```

### Status Codes

- **200**: Success (GET, PATCH, DELETE)
- **201**: Created (POST)
- **400**: Bad Request
- **401**: Unauthorized
- **403**: Forbidden
- **404**: Not Found
- **500**: Server Error

## Support

For issues or questions:

1. Check this documentation
2. Review the API specification
3. Check browser console for errors
4. Contact the backend team

---

**Last Updated**: January 2026
**Version**: 1.0.0
