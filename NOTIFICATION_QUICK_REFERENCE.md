# Notification API - Quick Reference

## Basic Usage

### In a React Component

```typescript
"use client";

import { useNotifications } from "@/hooks/useNotifications";

export function MyComponent() {
  const {
    notifications,
    unreadCount,
    loading,
    error,
    markAsRead,
    markAllAsRead,
    fetchNotifications,
  } = useNotifications();

  return (
    <div>
      <p>Unread: {unreadCount}</p>
      <button onClick={markAllAsRead}>Clear All</button>
      
      {notifications.map(n => (
        <div key={n.id} onClick={() => markAsRead(n.id)}>
          {n.payload.title}
        </div>
      ))}
    </div>
  );
}
```

## API Methods (Direct)

```typescript
import {
  getNotifications,
  getNotificationById,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  updateNotification,
  deleteNotification,
  createNotification,
  getUnreadNotificationsCount,
  getNotificationsByType,
  getFailedNotifications,
} from "@/lib/api/notifications";

// Get all notifications
const notifications = await getNotifications();

// Get unread only
const unread = await getNotifications({ read: false });

// Get by type
const jobAlerts = await getNotifications({ type: 'job_alert' });

// Get single notification
const notification = await getNotificationById('notif-123');

// Mark as read
await markNotificationAsRead('notif-123');

// Mark all as read
await markAllNotificationsAsRead();

// Custom update
await updateNotification('notif-123', { 
  readAt: new Date().toISOString() 
});

// Delete (admin only)
await deleteNotification('notif-123');

// Create (admin only)
await createNotification({
  userId: 'user-id',
  type: 'job_alert',
  payload: JSON.stringify({
    title: 'New Job',
    message: 'Check this out'
  }),
  channels: ['email', 'push'],
});

// Get counts
const count = await getUnreadNotificationsCount();

// Get by type
const alerts = await getNotificationsByType('application_update');

// Get failed (admin only)
const failed = await getFailedNotifications();
```

## Filters

```typescript
// Get notifications with filters
await getNotifications({
  userId: 'user-123',      // Filter by user
  type: 'job_alert',       // Filter by type
  deliveryStatus: 'sent',  // Filter by status
  read: false,             // Filter by read status
});
```

## Notification Types

```typescript
type NotificationType = 
  | 'admin_notice'
  | 'job_alert'
  | 'message'
  | 'profile_update'
  | 'application_update'
  | 'system_alert';

type NotificationChannel = 'email' | 'push' | 'in_app' | 'sms';

type DeliveryStatus = 'queued' | 'sent' | 'failed';
```

## Error Handling

```typescript
try {
  await markNotificationAsRead('notif-123');
} catch (error) {
  console.error(error.message);
  // User-friendly error message
}
```

## Pagination (Future)

```typescript
// Once backend supports pagination:
await getNotifications({
  page: 1,
  limit: 20,
});
```

## Real-Time Updates (Future)

```typescript
// Once backend supports WebSocket:
import { useNotificationSocket } from "@/hooks/useNotificationSocket";

const notifications = useNotificationSocket();
```

## Common Patterns

### Refresh Notifications
```typescript
const { fetchNotifications } = useNotifications();
await fetchNotifications();
```

### Auto-refresh Every 30 Seconds
```typescript
const { fetchNotifications } = useNotifications();

useEffect(() => {
  const interval = setInterval(fetchNotifications, 30000);
  return () => clearInterval(interval);
}, [fetchNotifications]);
```

### Get Unread Count Only
```typescript
const { unreadCount } = useNotifications();
```

### Show Unread Badge
```typescript
const { unreadCount } = useNotifications();

return (
  <div>
    <button>
      Notifications
      {unreadCount > 0 && <span>{unreadCount}</span>}
    </button>
  </div>
);
```

### Handle Notification Click
```typescript
const { markAsRead } = useNotifications();

const handleClick = async (notificationId: string) => {
  // Do action
  
  // Then mark as read
  await markAsRead(notificationId);
};
```

### Debounced Mark as Read
```typescript
import { useDebounce } from "@/hooks/useDebounce";

const { markAsRead } = useNotifications();
const debouncedMark = useDebounce(markAsRead, 300);

// Use debouncedMark instead of markAsRead
```

## Files Changed

- `lib/types/notification.ts` - Updated types
- `lib/api/notifications/index.ts` - Full API implementation
- `lib/api/notifications/types.ts` - Type exports
- `hooks/useNotifications.ts` - React hook
- `components/talent/notification/TalentNotifications.tsx` - Real data
- `components/employer/notification/EmployerNotifications.tsx` - Real data
- `components/mentor/notification/MentorNotifications.tsx` - Real data

## Environment Variables

Ensure these are set in `.env.local`:

```env
NEXT_PUBLIC_TALENTNG_API_URL=http://localhost:3001
```

## Testing

### Mock Notifications
```typescript
const mockNotification: Notification = {
  id: '1',
  userId: 'user-123',
  type: 'job_alert',
  payload: { title: 'Test', message: 'Test message' },
  channels: ['email'],
  deliveryStatus: 'sent',
  readAt: null,
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
};
```

---

**Status**: ✅ Complete and Ready to Use
