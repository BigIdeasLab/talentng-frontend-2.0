# API Rate Limits Documentation

## 🚨 **Important for Frontend Team**

The backend has rate limiting on several endpoints to prevent abuse. When you hit these limits, you'll get a **429 Too Many Requests** error.

## ⚙️ **Rate Limiting Configuration**

### **Global Configuration** (Currently Disabled)

```typescript
// Configured but NOT active (commented out in production)
global: 100 requests per minute (not enforced)
```

### **Active Rate Limits** (Endpoint-Specific Only)

Rate limiting is **only active on specific endpoints** that explicitly use `@Throttle` decorator.

## 📋 **Rate Limited Endpoints**

### 🔐 **Authentication Endpoints** (`/api/auth/`)

#### **Standard Rate Limit: 5 requests per 60 seconds**

| Endpoint                     | Method | Rate Limit | Description                |
| ---------------------------- | ------ | ---------- | -------------------------- |
| `/auth/register`             | POST   | 5/min      | User registration          |
| `/auth/login`                | POST   | 5/min      | User login                 |
| `/auth/verify-email/send`    | POST   | 5/min      | Send verification email    |
| `/auth/verify-email/resend`  | POST   | 5/min      | Resend verification email  |
| `/auth/verify-email/confirm` | POST   | 5/min      | Confirm email verification |

#### **Strict Rate Limit: 3 requests per 60 seconds**

| Endpoint                | Method | Rate Limit | Description               |
| ----------------------- | ------ | ---------- | ------------------------- |
| `/auth/forgot-password` | POST   | 3/min      | Request password reset    |
| `/auth/reset-password`  | POST   | 3/min      | Reset password with token |

### � **Admin Endpoints** (`/api/admin/`)

#### **Standard Rate Limit: 5 requests per 60 seconds**

| Endpoint        | Method | Rate Limit | Description       |
| --------------- | ------ | ---------- | ----------------- |
| `/admin/create` | POST   | 5/min      | Create admin user |
| `/admin/login`  | POST   | 5/min      | Admin login       |

## ✅ **Non-Rate Limited Endpoints**

**All other API endpoints are NOT rate limited**, including:

- `/api/users/*` - User management
- `/api/opportunities/*` - Job opportunities
- `/api/applications/*` - Job applications
- `/api/notifications/*` - Notifications
- `/api/mentors/*` - Mentor services
- `/api/talent/*` - Talent profiles
- `/api/recruiter/*` - Recruiter services
- And all other endpoints not listed above

## 🔄 **Additional Login Protection**

Beyond rate limiting, the **login endpoint** has additional protection:

### **Failed Login Lockout**

- **5 failed login attempts** = **15-minute account lockout**
- Applies per email address
- Stored in Redis with keys like `login-lockout:user@example.com`

## 🚨 **Error Handling for Frontend**

### **429 Too Many Requests Response**

```json
{
  "statusCode": 429,
  "message": "ThrottlerException: Too Many Requests",
  "error": "Too Many Requests"
}
```

### **Account Lockout Response**

```json
{
  "statusCode": 401,
  "message": "Account temporarily locked due to too many failed login attempts. Please try again later.",
  "error": "Unauthorized"
}
```

## 💡 **Frontend Implementation Recommendations**

### 1. **Rate Limit Error Handling**

```javascript
// Example error handling
try {
  const response = await fetch("/api/auth/login", {
    method: "POST",
    body: JSON.stringify(credentials),
  });

  if (response.status === 429) {
    // Show user-friendly rate limit message
    showError("Too many attempts. Please wait a minute and try again.");

    // Disable submit button for 60 seconds
    disableSubmitButton(60);
    return;
  }

  // Handle other errors...
} catch (error) {
  // Handle network errors
}
```

### 2. **Rate Limit Prevention**

```javascript
// Debounce form submissions
const debouncedSubmit = debounce(handleSubmit, 1000);

// Disable button after submission
const handleSubmit = async () => {
  setIsSubmitting(true);
  try {
    await submitForm();
  } finally {
    // Re-enable after delay to prevent rapid submissions
    setTimeout(() => setIsSubmitting(false), 2000);
  }
};
```

### 3. **User-Friendly Messages**

```javascript
const getRateLimitMessage = (endpoint) => {
  const messages = {
    "/auth/login":
      "Too many login attempts. Please wait a minute before trying again.",
    "/auth/register": "Too many registration attempts. Please wait a minute.",
    "/auth/verify-email/send":
      "Verification email sent. Please wait before requesting another.",
    "/auth/forgot-password":
      "Password reset request sent. Please wait before trying again.",
  };

  return messages[endpoint] || "Too many requests. Please wait and try again.";
};
```

### 4. **Retry Logic with Backoff**

```javascript
const retryWithBackoff = async (apiCall, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (error.status === 429 && i < maxRetries - 1) {
        // Wait longer each retry: 1s, 2s, 4s
        const delay = Math.pow(2, i) * 1000;
        await new Promise((resolve) => setTimeout(resolve, delay));
        continue;
      }
      throw error;
    }
  }
};
```

## 🛠️ **Development & Testing**

### **Clear Rate Limits (Backend)**

If you're testing and hit rate limits, run this backend script:

```bash
npx ts-node scripts/clear-rate-limits.ts
```

### **Rate Limit Configuration**

Rate limits are configured in:

- `src/modules/throttler/throttler.module.ts` - Global configuration
- Individual controllers - Endpoint-specific limits

### **Redis Keys Used**

- `login-attempts:{email}` - Failed login counter
- `login-lockout:{email}` - Account lockout data
- `throttler:*` - General rate limiting keys

## 📊 **Rate Limit Headers** (Future Enhancement)

Consider adding these headers to help frontend handle rate limits:

```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1640995200
```

## 🚀 **Best Practices for Frontend**

1. **Show loading states** during API calls
2. **Disable buttons** after submission to prevent double-clicks
3. **Display clear error messages** for rate limit errors
4. **Implement retry logic** with exponential backoff
5. **Cache successful responses** when appropriate
6. **Use debouncing** for user input that triggers API calls
7. **Show countdown timers** when users need to wait

## 🔧 **Emergency Contact**

If rate limits are causing issues in production:

1. **Contact backend team** to adjust limits
2. **Check server logs** for unusual traffic patterns
3. **Consider implementing** client-side rate limiting
4. **Monitor error rates** in production

---

**Note**: Rate limits are essential for security and performance. Work with them, don't try to bypass them! 🛡️
