# Authentication API Documentation for Frontend Developers

**Backend Base URL**: `https://api.example.com/api/v1`

**Version**: 1.0  
**Last Updated**: November 26, 2025

---

## Table of Contents

1. [General Information](#general-information)
2. [Authentication Endpoints](#authentication-endpoints)
3. [Error Responses](#error-responses)
4. [Rate Limiting](#rate-limiting)
5. [Security Headers](#security-headers)
6. [Example Implementations](#example-implementations)

---

## General Information

### Headers Required

All requests must include:

```javascript
{
  "Content-Type": "application/json"
}
```

### Response Format

All successful responses follow this format:

```json
{
  "user": {
    "id": "string",
    "email": "string",
    "username": "string | null",
    "roles": ["string"],
    "status": "active | suspended | banned",
    "isVerified": "boolean",
    "verificationLevel": "basic | kyc | org",
    "emailVerifiedAt": "ISO8601 datetime | null",
    "lastLoginAt": "ISO8601 datetime | null",
    "createdAt": "ISO8601 datetime",
    "updatedAt": "ISO8601 datetime",
    "talentProfile": "object | null",
    "recruiterProfile": "object | null",
    "mentorProfile": "object | null"
  },
  "accessToken": "JWT token string",
  "refreshToken": "JWT token string (in httpOnly cookie)",
  "needsOnboarding": "boolean"
}
```

### Authentication

- **Access Token**: Use in `Authorization: Bearer <token>` header
- **Refresh Token**: Automatically stored in httpOnly cookie (secure, sameSite=strict)
- **Token TTL**: Access token expires in 15 minutes
- **Refresh TTL**: Refresh token expires in 7 days

---

## Authentication Endpoints

### 1. Register (Sign Up)

**Endpoint**: `POST /auth/register`

**Rate Limit**: 5 requests per minute

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Password Requirements**:
- Minimum 8 characters
- At least 1 uppercase letter (A-Z)
- At least 1 lowercase letter (a-z)
- At least 1 number (0-9)

**Valid Examples**: `Password123`, `MySecure456Pass`, `Test@9876`

**Response** (201 Created):

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "roles": [],
    "status": "active",
    "isVerified": false,
    "verificationLevel": "basic",
    "createdAt": "2025-11-26T10:30:00Z",
    "updatedAt": "2025-11-26T10:30:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "needsOnboarding": true
}
```

**What Happens After Registration**:
1. User account is created (not verified yet)
2. A 6-digit verification PIN is sent to email
3. User must verify email before full account activation
4. `refreshToken` cookie is set automatically

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 400 | "Email already exists" | Account with this email registered |
| 400 | "Password must be at least 8 characters..." | Weak password |
| 400 | "Content-Type must be application/json" | Wrong header |
| 429 | "Rate limit exceeded" | Too many requests |

---

### 2. Send Verification Email

**Endpoint**: `POST /auth/verify-email/send`

**Rate Limit**: 5 requests per minute

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):

```json
{
  // No body, just 200 status
}
```

**What Happens**:
1. System sends 6-digit PIN to email
2. PIN expires in 5 minutes
3. User can then call verify endpoint

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 400 | "User with this email does not exist" | Email not registered |
| 429 | "Rate limit exceeded" | Too many requests |

---

### 3. Confirm Email Verification

**Endpoint**: `POST /auth/verify-email/confirm`

**Rate Limit**: 5 requests per minute

**Request Body**:

```json
{
  "email": "user@example.com",
  "verificationCode": "123456"
}
```

**Response** (200 OK):

```json
{
  // No body, just 200 status
}
```

**What Happens**:
1. Verifies the 6-digit PIN
2. Marks email as verified
3. User can now use full account features

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 400 | "Invalid or expired verification code" | Wrong PIN or expired |
| 400 | "User not found" | Email doesn't exist |
| 429 | "Rate limit exceeded" | Too many requests |

---

### 4. Login

**Endpoint**: `POST /auth/login`

**Rate Limit**: 5 requests per minute

**Request Body**:

```json
{
  "email": "user@example.com",
  "password": "Password123"
}
```

**Response** (200 OK):

```json
{
  "user": {
    "id": "550e8400-e29b-41d4-a716-446655440000",
    "email": "user@example.com",
    "roles": ["TALENT"],
    "status": "active",
    "isVerified": true,
    "verificationLevel": "basic",
    "emailVerifiedAt": "2025-11-26T10:35:00Z",
    "lastLoginAt": "2025-11-26T10:45:00Z",
    "createdAt": "2025-11-26T10:30:00Z",
    "updatedAt": "2025-11-26T10:45:00Z"
  },
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "needsOnboarding": false
}
```

**What Happens**:
1. Validates email and password
2. Checks email is verified
3. Returns tokens
4. Sets refreshToken cookie

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 401 | "Invalid email or password" | Wrong credentials |
| 400 | "Email not verified. Please verify your email first" | Email not confirmed |
| 429 | "Too many failed login attempts. Account locked for 15 minutes" | Account lockout |
| 429 | "Rate limit exceeded" | Too many requests |

---

### 5. Forgot Password (Request Reset)

**Endpoint**: `POST /auth/forgot-password`

**Rate Limit**: 3 requests per minute (strict)

**Request Body**:

```json
{
  "email": "user@example.com"
}
```

**Response** (200 OK):

```json
{
  // No body, just 200 status
}
```

**What Happens**:
1. System generates reset token
2. Sends password reset email with token
3. Token expires in 24 hours

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 404 | "User not found" | Email doesn't exist |
| 429 | "Rate limit exceeded" | Too many requests |

---

### 6. Reset Password

**Endpoint**: `POST /auth/reset-password`

**Rate Limit**: 3 requests per minute (strict)

**Request Body**:

```json
{
  "resetToken": "token-from-email",
  "newPassword": "NewPassword123"
}
```

**Password Requirements**: Same as registration

**Response** (200 OK):

```json
{
  // No body, just 200 status
}
```

**What Happens**:
1. Validates reset token
2. Changes password
3. Invalidates all refresh tokens (forces re-login)

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 400 | "Invalid or expired reset token" | Token invalid/expired |
| 400 | "Password must be at least 8 characters..." | Weak password |
| 400 | "Cannot reuse previous passwords" | Password used before |
| 429 | "Rate limit exceeded" | Too many requests |

---

### 7. Change Password (Authenticated)

**Endpoint**: `POST /auth/change-password`

**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "currentPassword": "Password123",
  "newPassword": "NewPassword456"
}
```

**Response** (200 OK):

```json
{
  // No body, just 200 status
}
```

**What Happens**:
1. Validates current password
2. Changes to new password
3. Does NOT invalidate tokens

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 401 | "Unauthorized" | No token or invalid token |
| 400 | "Current password is incorrect" | Wrong current password |
| 400 | "Cannot reuse previous passwords" | Password used before |

---

### 8. Refresh Token

**Endpoint**: `POST /auth/refresh`

**Authentication**: Required (Bearer token + refreshToken cookie)

**Request Body**: None (uses cookie)

**Response** (200 OK):

```json
{
  "user": {
    // Updated user object
  },
  "accessToken": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

**What Happens**:
1. Validates refresh token
2. Issues new access token
3. Updates refresh token in cookie

**When to Call**:
- When access token expires (401 response)
- Proactively before expiration

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 401 | "Refresh token not found" | Cookie missing |
| 401 | "Unauthorized" | Token invalid/revoked |

---

### 9. Create Password (Social Login Users)

**Endpoint**: `POST /auth/create-password`

**Authentication**: Required (Bearer token)

**Request Body**:

```json
{
  "password": "Password123"
}
```

**Password Requirements**: Same as registration

**Response** (200 OK):

```json
{
  // No body, just 200 status
}
```

**When to Use**:
- User signed up via Google/OAuth
- User wants to set password for future login

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 401 | "Unauthorized" | No token |
| 400 | "User already has a password" | Password already set |

---

### 10. Logout

**Endpoint**: `POST /auth/logout`

**Authentication**: Required (Bearer token)

**Request Body**: None

**Response** (200 OK):

```json
{
  // No body, just 200 status
}
```

**What Happens**:
1. Revokes access token
2. Clears refresh token cookie
3. Removes session

**Common Errors**:

| Status | Error | Reason |
|--------|-------|--------|
| 401 | "Unauthorized" | No token |

---

### 11. Google OAuth (Sign In with Google)

**Endpoint**: `GET /auth/google`

**What to Do**:
1. Redirect user to this endpoint
2. User authenticates with Google
3. Backend handles callback

**Callback Redirect**:
```
https://frontend.com/onboarding?accessToken=<token>
// OR
https://frontend.com/dashboard?accessToken=<token>
```

---

---

## Error Responses

### Error Response Format

All error responses follow this format:

```json
{
  "statusCode": 400,
  "message": "Error message here",
  "error": "BadRequest" | "Unauthorized" | "NotFound" | "Conflict"
}
```

### Common HTTP Status Codes

| Code | Name | Meaning |
|------|------|---------|
| 400 | Bad Request | Invalid data/validation error |
| 401 | Unauthorized | Missing or invalid token |
| 404 | Not Found | Resource doesn't exist |
| 409 | Conflict | Resource already exists |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Server Error | Backend error |

### Common Error Messages

| Message | Cause | Solution |
|---------|-------|----------|
| "Content-Type must be application/json" | Wrong header | Add `Content-Type: application/json` |
| "Email already exists" | Email registered | Use different email |
| "Email not verified" | Email not confirmed | Verify email first |
| "Invalid email or password" | Wrong credentials | Check email/password |
| "Account locked for 15 minutes" | 5 failed attempts | Wait 15 minutes |
| "Rate limit exceeded" | Too many requests | Wait 1 minute |
| "Invalid or expired verification code" | Wrong/expired PIN | Request new PIN |
| "Invalid or expired reset token" | Wrong/expired token | Request new reset |
| "Cannot reuse previous passwords" | Same as old password | Use different password |

---

## Rate Limiting

### Rate Limit Tiers

#### Standard Auth Endpoints (5 requests/minute)
- `POST /auth/register`
- `POST /auth/login`
- `POST /auth/verify-email/send`
- `POST /auth/verify-email/confirm`

**Reset Time**: Rolling 60-second window

#### Strict Auth Endpoints (3 requests/minute)
- `POST /auth/forgot-password`
- `POST /auth/reset-password`

**Reset Time**: Rolling 60-second window

### Handling Rate Limits

When rate limited, you'll receive:

```json
{
  "statusCode": 429,
  "message": "Rate limit exceeded",
  "error": "ThrottlerException"
}
```

**Frontend Response**:
1. Show user error message
2. Disable button for 60 seconds
3. Display countdown timer
4. Retry after timeout

---

## Security Headers

### Cookies

**refreshToken Cookie**:
- `httpOnly: true` - Cannot be accessed by JavaScript
- `secure: true` - HTTPS only in production
- `sameSite: strict` - CSRF protection
- `path: /` - Available to all routes
- `maxAge: 7 days` - Expires in 7 days

### CORS

Configured to allow requests from:
- Frontend URL (via `CORS_ORIGIN` env variable)

### CSRF Protection

All state-changing endpoints require:
- Valid CSRF token (handled automatically)
- No malicious cross-site requests possible

---

## Example Implementations

### JavaScript/TypeScript (Fetch API)

#### Sign Up

```typescript
async function register(email: string, password: string) {
  try {
    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    // refreshToken is in httpOnly cookie automatically
    
    return data;
  } catch (error) {
    console.error('Registration failed:', error);
    throw error;
  }
}
```

#### Login

```typescript
async function login(email: string, password: string) {
  try {
    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    
    return data;
  } catch (error) {
    console.error('Login failed:', error);
    throw error;
  }
}
```

#### Verify Email

```typescript
async function verifyEmail(email: string, code: string) {
  try {
    const response = await fetch('/api/v1/auth/verify-email/confirm', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ email, verificationCode: code }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return { success: true };
  } catch (error) {
    console.error('Email verification failed:', error);
    throw error;
  }
}
```

#### Authenticated Request (with token)

```typescript
async function makeAuthenticatedRequest(url: string, method: string, body?: any) {
  const token = localStorage.getItem('accessToken');

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
      body: body ? JSON.stringify(body) : undefined,
    });

    if (response.status === 401) {
      // Token expired, try refresh
      await refreshToken();
      // Retry the request
      return makeAuthenticatedRequest(url, method, body);
    }

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message);
    }

    return await response.json();
  } catch (error) {
    console.error('Request failed:', error);
    throw error;
  }
}
```

#### Refresh Token

```typescript
async function refreshToken() {
  try {
    const response = await fetch('/api/v1/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Token refresh failed');
    }

    const data = await response.json();
    localStorage.setItem('accessToken', data.accessToken);
    
    return data;
  } catch (error) {
    console.error('Token refresh failed:', error);
    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  }
}
```

#### Logout

```typescript
async function logout() {
  const token = localStorage.getItem('accessToken');

  try {
    await fetch('/api/v1/auth/logout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      credentials: 'include',
    });

    localStorage.removeItem('accessToken');
    window.location.href = '/login';
  } catch (error) {
    console.error('Logout failed:', error);
  }
}
```

### React Example with Axios

```typescript
import axios from 'axios';

const api = axios.create({
  baseURL: '/api/v1',
  withCredentials: true, // Include cookies
});

// Add token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('accessToken');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Handle token expiration
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      try {
        const response = await api.post('/auth/refresh');
        localStorage.setItem('accessToken', response.data.accessToken);
        // Retry original request
        return api(error.config);
      } catch (refreshError) {
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Usage
async function login(email: string, password: string) {
  const response = await api.post('/auth/login', { email, password });
  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data;
}

async function register(email: string, password: string) {
  const response = await api.post('/auth/register', { email, password });
  localStorage.setItem('accessToken', response.data.accessToken);
  return response.data;
}

async function changePassword(currentPassword: string, newPassword: string) {
  return api.post('/auth/change-password', {
    currentPassword,
    newPassword,
  });
}

async function logout() {
  await api.post('/auth/logout');
  localStorage.removeItem('accessToken');
}
```

---

## Password Validation Rules

Always validate on frontend before sending:

```typescript
function validatePassword(password: string): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (password.length < 8) {
    errors.push('Password must be at least 8 characters');
  }
  if (!/[a-z]/.test(password)) {
    errors.push('Password must contain lowercase letter');
  }
  if (!/[A-Z]/.test(password)) {
    errors.push('Password must contain uppercase letter');
  }
  if (!/\d/.test(password)) {
    errors.push('Password must contain number');
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
```

---

## Troubleshooting

### "Content-Type must be application/json"
- Ensure all requests have `Content-Type: application/json` header

### "Unauthorized" on authenticated endpoints
- Check token is in `Authorization: Bearer <token>` header
- Verify token hasn't expired
- Refresh token if needed

### Refresh token cookie not sent
- Ensure requests include `credentials: 'include'`
- Check browser allows third-party cookies

### CORS error
- Contact backend team to add frontend URL to `CORS_ORIGIN`
- Check if you're on allowed domain

### Rate limit exceeded
- Wait 60 seconds before retrying
- Implement exponential backoff in production

---

## Security Best Practices

1. **Never expose tokens in logs**: Tokens contain user data
2. **Use HTTPS always**: Especially in production
3. **Store access token in memory**: Don't use localStorage for production apps
4. **Refresh tokens before expiry**: Don't wait for 401
5. **Clear tokens on logout**: Remove from storage
6. **Validate input**: Check password strength before submit
7. **Handle errors gracefully**: Show user-friendly messages
8. **Implement CSRF protection**: Use CSRF tokens where needed

---

## Support & Questions

For backend API issues, contact the backend team.  
For frontend integration help, refer to the example implementations above.

---

**Last Updated**: November 26, 2025  
**API Version**: 1.0  
**Status**: Production Ready
