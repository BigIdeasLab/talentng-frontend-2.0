# Device-Aware Session Management - Frontend Implementation Guide

## Overview
Backend now supports multi-device sessions with the ability to log out from specific devices or all devices simultaneously. This prevents accidental token revocation on other devices.

## Key Changes

### 1. **Database Migration**
Added device tracking to refresh tokens:
- `deviceId` (optional) - Unique device identifier
- `deviceName` (optional) - Human-readable device name (e.g., "Chrome on Windows")
- `lastActivityAt` - Track last activity for each session

### 2. **Fixed Token Refresh Bug**
**Critical Fix:** The `/auth/refresh` endpoint previously required `JwtAuthGuard`, which checked the blacklist BEFORE allowing refresh. This prevented blacklisted tokens from being refreshed.

**Now:** `/auth/refresh` skips the blacklist check and directly validates the refresh token, allowing token rotation even if the access token is blacklisted.

### 3. **Device-Specific Logout**
Logout now supports two modes:
- **Single Device Logout** (default): Only revokes tokens for the current device
- **Logout All Devices**: Revokes tokens across all active sessions

---

## API Endpoints

### Login (Modified)
**POST `/auth/login`**

**Request:**
```json
{
  "email": "user@example.com",
  "password": "SecureP@ss123",
  "deviceId": "uuid-or-fingerprint-123",
  "deviceName": "Chrome on Windows 11"
}
```

**Response:**
```json
{
  "user": { ... },
  "refreshToken": "..."
}
```

**Notes:**
- `deviceId` & `deviceName` are optional (for backward compatibility)
- Backend generates "Unknown Device" if not provided
- Tokens are set as HTTP-only cookies automatically

---

### Refresh Token (Fixed & Enhanced)
**POST `/auth/refresh`**

**Request:**
```json
{
  "deviceId": "uuid-or-fingerprint-123"  // Optional - defaults to any valid token
}
```

**Response:**
```json
{
  "user": { ... },
  "refreshToken": "..."
}
```

**Key Fixes:**
- ✅ No longer requires valid access token (skips blacklist check)
- ✅ Extracts userId from expired/blacklisted access token only to validate signature
- ✅ Allows refresh even when token is blacklisted
- ✅ Automatically handles device tracking

**Frontend Implementation:**
```typescript
async function refreshAccessToken(deviceId?: string) {
  try {
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ deviceId }),
      credentials: 'include', // Include cookies
    });

    if (!response.ok) {
      throw new Error('Refresh failed');
    }

    return await response.json();
  } catch (error) {
    console.error('Token refresh failed:', error);
    // Redirect to login
    window.location.href = '/login';
  }
}
```

---

### Logout (Single Device - Default)
**POST `/auth/logout`**

**Request:**
```json
{
  "deviceId": "uuid-or-fingerprint-123"  // Optional - current device if not provided
}
```

**Response:**
```json
{}
```

**Behavior:**
- Revokes ONLY tokens for the specified device
- Other devices remain logged in
- Clears cookies on the current device

**Frontend:**
```typescript
async function logout(deviceId?: string) {
  const response = await fetch('/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId }),
    credentials: 'include',
  });

  if (response.ok) {
    window.location.href = '/login';
  }
}
```

---

### Logout All Devices (New)
**POST `/auth/logout-all-devices`**

**Request:**
Empty body (uses current session token)

**Response:**
```json
{
  "message": "Successfully logged out from all devices"
}
```

**Behavior:**
- Revokes tokens across ALL devices/sessions
- User must log in again on all devices
- Use case: User suspects account compromise or wants security refresh

**Frontend:**
```typescript
async function logoutAllDevices() {
  const response = await fetch('/auth/logout-all-devices', {
    method: 'POST',
    credentials: 'include',
  });

  if (response.ok) {
    // Redirect to login - user needs to re-authenticate
    window.location.href = '/login';
  }
}
```

---

### Get Active Sessions (New)
**GET `/auth/sessions`**

**Request:**
No body (uses Authorization)

**Response:**
```json
[
  {
    "deviceId": "uuid-123",
    "deviceName": "Chrome on Windows 11",
    "createdAt": "2025-12-11T14:30:00Z",
    "lastActivityAt": "2025-12-11T15:45:00Z",
    "isCurrentSession": false
  },
  {
    "deviceId": "uuid-456",
    "deviceName": "Safari on iPhone",
    "createdAt": "2025-12-11T09:00:00Z",
    "lastActivityAt": "2025-12-11T15:30:00Z",
    "isCurrentSession": false
  }
]
```

**Frontend:**
```typescript
async function getActiveSessions() {
  const response = await fetch('/auth/sessions', {
    method: 'GET',
    credentials: 'include',
  });

  if (response.ok) {
    const sessions = await response.json();
    // Display to user in settings/security page
    console.log('Active sessions:', sessions);
  }
}
```

---

## Frontend Implementation Checklist

### 1. Generate Device Identifier
Create a unique, persistent device ID on first login:

```typescript
function getOrCreateDeviceId(): string {
  let deviceId = localStorage.getItem('deviceId');
  
  if (!deviceId) {
    // Generate a new device ID (UUID v4)
    deviceId = crypto.randomUUID();
    localStorage.setItem('deviceId', deviceId);
  }
  
  return deviceId;
}

function getDeviceName(): string {
  const userAgent = navigator.userAgent;
  
  // Simple parsing - enhance as needed
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edge')) return 'Edge';
  
  return 'Unknown Browser';
}
```

### 2. Update Login Flow
```typescript
async function login(email: string, password: string) {
  const deviceId = getOrCreateDeviceId();
  const deviceName = getDeviceName();

  const response = await fetch('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      email,
      password,
      deviceId,      // ← NEW
      deviceName,    // ← NEW
    }),
    credentials: 'include',
  });

  if (response.ok) {
    // Login successful
    redirectToDashboard();
  }
}
```

### 3. Update 401 Refresh Strategy
```typescript
// In your API client (e.g., Axios interceptor)
client.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        // Attempt refresh (works even if token is blacklisted)
        const deviceId = localStorage.getItem('deviceId');
        
        const refreshResponse = await fetch('/auth/refresh', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ deviceId }),
          credentials: 'include',
        });

        if (refreshResponse.ok) {
          // Tokens refreshed, retry original request
          return client(error.config);
        }
      } catch {
        // Refresh failed, redirect to login
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);
```

### 4. Update Logout
```typescript
// Single device logout (keep other devices logged in)
async function logout() {
  const deviceId = localStorage.getItem('deviceId');
  
  await fetch('/auth/logout', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ deviceId }),
    credentials: 'include',
  });

  // Clear local storage
  localStorage.removeItem('deviceId');
  
  // Redirect
  window.location.href = '/login';
}

// OR: Logout all devices
async function logoutAllDevices() {
  await fetch('/auth/logout-all-devices', {
    method: 'POST',
    credentials: 'include',
  });

  localStorage.removeItem('deviceId');
  window.location.href = '/login';
}
```

### 5. Display Active Sessions
```typescript
async function loadActiveSessions() {
  const response = await fetch('/auth/sessions', {
    method: 'GET',
    credentials: 'include',
  });

  const sessions = await response.json();
  
  const currentDeviceId = localStorage.getItem('deviceId');
  
  // Enhance response with isCurrentSession flag
  const sessionsWithFlag = sessions.map(session => ({
    ...session,
    isCurrentSession: session.deviceId === currentDeviceId,
  }));

  // Render in UI
  displaySessionsList(sessionsWithFlag);
}
```

---

## Benefits of This Implementation

✅ **Multiple Device Support** - Stay logged in on phone + desktop simultaneously
✅ **Secure Logout** - Choose to logout single device or all devices
✅ **Token Refresh Fixed** - Blacklisted tokens can now be refreshed
✅ **Activity Tracking** - Know which devices are active and when
✅ **Backward Compatible** - Old clients still work without deviceId
✅ **User Control** - Users can see and manage all active sessions

---

## Testing Checklist

- [ ] Login on Device A with deviceId/deviceName
- [ ] Login on Device B with different deviceId
- [ ] Logout on Device A → Device B still works
- [ ] Logout on Device B → Device A still works
- [ ] Call `/auth/refresh` with valid refresh token
- [ ] Call `/auth/refresh` after token becomes blacklisted (should still work)
- [ ] Call `/auth/logout-all-devices` on any device → both devices logged out
- [ ] Call `/auth/sessions` → shows both active sessions
- [ ] Simulate token blacklist → `/auth/refresh` should recover

---

## Migration Notes

**For Existing Users:**
- Existing refresh tokens will have `deviceId: null` and `deviceName: "Unknown Device"`
- They will continue to work (backward compatible)
- On next login, new tokens will have device info
- Old tokens will gradually expire (7 days default)

**No Data Loss:** Database migration is additive only - no existing data is modified.
