# Token Refresh Implementation - Frontend

## Overview
This document describes how the frontend implements automatic token refresh to handle expired access tokens without requiring user re-authentication.

## Implementation Location
- **File**: `lib/api/index.ts`
- **Client Type**: Client-side API client (uses localStorage for token storage)

## Token Refresh Flow

### 1. 401 Detection
When any API call receives a `401 Unauthorized` response:
- The client automatically intercepts the response
- Checks if a token refresh is already in progress
- If yes: queues the request to retry after refresh completes
- If no: initiates token refresh process

### 2. Token Refresh Request

**Endpoint**: `POST /auth/refresh`

**Request Format**:
```javascript
{
  method: "POST",
  headers: {
    "Content-Type": "application/json"
  },
  credentials: "include",
  body: JSON.stringify({ 
    refreshToken: "<refresh_token_from_localStorage>" 
  })
}
```

**Key Points**:
- Refresh token is sent in the **request body** (not Authorization header)
- `credentials: "include"` is set to allow cookies if needed
- Refresh token is retrieved from `localStorage.getItem("refreshToken")`

### 3. Expected Response Format

**Success Response** (200 OK):
```json
{
  "accessToken": "new_access_token_here",
  "refreshToken": "new_refresh_token_here",
  "userId": "user_id_here"
}
```

**Failure Response** (401 or other error):
- Any non-200 response is treated as refresh failure
- User is redirected to login page

### 4. Token Storage After Refresh

When refresh succeeds, the frontend stores:

```javascript
// Store new tokens
localStorage.setItem("accessToken", data.accessToken);
localStorage.setItem("refreshToken", data.refreshToken);
localStorage.setItem("userId", data.userId);

// Preserve active role (CRITICAL for role consistency)
const currentActiveRole = localStorage.getItem("activeRole");
if (currentActiveRole) {
  localStorage.setItem("activeRole", currentActiveRole);
  document.cookie = `activeRole=${currentActiveRole}; path=/; max-age=31536000; SameSite=Lax`;
}
```

### 5. Request Retry
After successful token refresh:
- Original failed request is automatically retried with new access token
- All queued requests (if any) are also retried
- User experiences seamless continuation without seeing errors

### 6. Refresh Failure Handling

If refresh fails (no refresh token, expired refresh token, or backend error):

```javascript
// Clear all auth state
localStorage.removeItem("accessToken");
localStorage.removeItem("refreshToken");
localStorage.removeItem("userId");
localStorage.removeItem("activeRole");
localStorage.removeItem("userRoles");

// Clear cookies
document.cookie = "activeRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

// Redirect to login
window.location.href = "/login";
```

## Request Queuing Mechanism

To prevent multiple simultaneous refresh attempts:

```javascript
let isRefreshing = false;
let refreshPromise: Promise<Response> | null = null;
const failedQueue: Array<{
  resolve: () => void;
  reject: (error: Error) => void;
}> = [];
```

**How it works**:
1. First 401 sets `isRefreshing = true` and creates `refreshPromise`
2. Subsequent 401s during refresh add their retry logic to `failedQueue`
3. When refresh completes, all queued requests are processed via `processQueue()`
4. Each queued request retries with the new access token

## Critical Implementation Details

### Active Role Preservation
**Problem**: After token refresh, users were being redirected to a different role.

**Solution**: Explicitly preserve `activeRole` from localStorage after storing new tokens:
```javascript
const currentActiveRole = localStorage.getItem("activeRole");
if (currentActiveRole) {
  localStorage.setItem("activeRole", currentActiveRole);
  document.cookie = `activeRole=${currentActiveRole}; path=/; max-age=31536000; SameSite=Lax`;
}
```

This ensures the user stays on the same role (talent/recruiter/mentor) after token refresh.

### Complete State Cleanup
When refresh fails, ALL auth-related state must be cleared:
- Tokens (access, refresh)
- User ID
- Active role (localStorage + cookie)
- User roles list

This prevents stale state from causing issues on next login.

## Backend Requirements

For this implementation to work correctly, the backend must:

1. **Accept refresh token in request body**:
   - Endpoint: `POST /auth/refresh`
   - Body: `{ "refreshToken": "..." }`
   - NOT in Authorization header

2. **Return new tokens in response**:
   ```json
   {
     "accessToken": "new_token",
     "refreshToken": "new_refresh_token",
     "userId": "user_id"
   }
   ```

3. **Maintain active role in new access token**:
   - The new access token JWT should contain the same `act` (active role) claim as the old token
   - This ensures role consistency across token refreshes

4. **Handle expired refresh tokens**:
   - Return 401 if refresh token is expired or invalid
   - Frontend will redirect user to login

## Testing Scenarios

### Scenario 1: Token Expires During API Call
1. User makes API call with expired access token
2. Backend returns 401
3. Frontend automatically refreshes token
4. Original API call is retried with new token
5. User sees no error, request completes successfully

### Scenario 2: Multiple Simultaneous Requests with Expired Token
1. Multiple API calls happen at once with expired token
2. All receive 401 responses
3. Only ONE refresh request is made
4. Other requests are queued
5. After refresh, all queued requests retry with new token
6. All requests complete successfully

### Scenario 3: Refresh Token Expired
1. User makes API call with expired access token
2. Backend returns 401
3. Frontend attempts refresh with expired refresh token
4. Backend returns 401 for refresh request
5. Frontend clears all auth state
6. User is redirected to login page

### Scenario 4: Role Preservation
1. User is on recruiter role
2. Access token expires
3. Token refresh happens automatically
4. User remains on recruiter role (not switched to talent/mentor)
5. `activeRole` in localStorage and cookie remains "recruiter"

## Code Location Reference

**Main Implementation**: `lib/api/index.ts` (lines 77-170)
- 401 detection and handling
- Token refresh logic
- Request queuing
- Active role preservation
- State cleanup on failure

**Token Storage Utilities**: `lib/auth.ts`
- `storeTokens()` - Store tokens in localStorage
- `getAccessToken()` - Retrieve access token
- `getRefreshToken()` - Retrieve refresh token
- `clearTokens()` - Clear all tokens

## Notes for Backend Team

1. **Refresh Token Format**: We're sending `{ refreshToken: "..." }` in the request body, not as a Bearer token in the Authorization header.

2. **Active Role Claim**: Please ensure the new access token JWT contains the same `act` claim as the previous token to maintain role consistency.

3. **Response Format**: We expect `{ accessToken, refreshToken, userId }` in the success response.

4. **Error Handling**: Any non-200 response from `/auth/refresh` will trigger a logout and redirect to login.

5. **Credentials**: We're sending `credentials: "include"` in case you need to set/read cookies during refresh.

## Questions for Backend

1. Does the `/auth/refresh` endpoint expect the refresh token in the request body as `{ refreshToken: "..." }`?
2. Does the response include both `accessToken` and `refreshToken`?
3. Does the new access token JWT maintain the same `act` (active role) claim?
4. What HTTP status code is returned when the refresh token is expired or invalid?
5. Are there any rate limits on the refresh endpoint we should be aware of?


---

## Resolution - Backend Fix Applied

### Issue Identified
The backend was returning `user` object instead of `userId` string, causing a mismatch with frontend expectations.

**Backend Response (Before Fix)**:
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "...",
  "refreshToken": "...",
  "user": {
    "id": "user-id-here",
    "email": "...",
    "username": "...",
    "roles": [...]
  }
}
```

**Frontend Expected**:
```json
{
  "accessToken": "...",
  "refreshToken": "...",
  "userId": "user-id-here"
}
```

### Fix Applied
Backend now returns both `userId` (for localStorage) and `user` (for additional context):

**Backend Response (After Fix)**:
```json
{
  "message": "Token refreshed successfully",
  "accessToken": "...",
  "refreshToken": "...",
  "userId": "user-id-here",  // ✅ Added
  "user": {
    "id": "user-id-here",
    "email": "...",
    "username": "...",
    "roles": [...]
  }
}
```

### Impact
This fix resolves the issue where users would "temporarily don't have access until page reload". The frontend can now properly store the userId after token refresh, maintaining the authenticated session seamlessly.

**File Modified**: `auth.controller.ts` (backend)
- Added `userId: user.id` to the refresh endpoint response

### Status
✅ **RESOLVED** - Frontend and backend token refresh implementations are now aligned.
