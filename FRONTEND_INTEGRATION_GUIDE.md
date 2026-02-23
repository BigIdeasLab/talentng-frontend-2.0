# Frontend Integration Guide: API Changes

> Last Updated: 2026-02-23
> Version: 2.0 (API Standardization)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Role-Based Access Changes](#2-role-based-access-changes)
3. [Breaking Changes](#3-breaking-changes)
4. [New Endpoint Patterns](#4-new-endpoint-patterns)
5. [Role Switching](#5-role-switching)
6. [Migration Checklist](#6-migration-checklist)
7. [Code Examples](#7-code-examples)

---

## 1. Overview

This guide covers the API changes made as part of the API Standardization initiative. The main changes involve:

- **Role-based access control** - Endpoints now require specific active roles
- **Contextual RBAC** - Users must switch roles to access different resources
- **New endpoint patterns** - Standardized URL structure

---

## 2. Role-Based Access Changes

### How It Works Now

Each user has:

- **Roles** (array): All roles the user possesses, e.g., `['talent', 'recruiter']`
- **Active Role** (`act`): The current role context, e.g., `'talent'`

When making API requests, the **active role** determines what data you can access.

### Example

```javascript
// User has roles: ['talent', 'recruiter']
// Active role: 'talent'

// This works - accessing talent endpoint with talent active role
GET /talent/profile → 200 OK

// This fails - accessing recruiter endpoint with talent active role
GET /recruiter/applications → 403 Forbidden
// Error: "Access denied. Required role(s): recruiter. Your active role: talent"
```

### To Access Recruiter Data

The user must switch their active role first (see Section 5).

---

## 3. Breaking Changes

### 3.1 POST /opportunities - Now Requires Recruiter Role

**Before:** Any authenticated user could create opportunities
**After:** Only users with `recruiter` active role can create opportunities

```javascript
// Request (with talent active role)
POST /opportunities
→ 403 Forbidden

// Must switch to recruiter first, then:
POST /opportunities
→ 201 Created
```

### 3.2 Admin Endpoints - Stricter Access

Admin endpoints now require:

1. User must have 'admin' in their roles array
2. User's active role must be 'admin' (unless they're explicitly admin)

```javascript
// User has roles: ['talent', 'admin']
// Active role: 'talent'

GET /admin/users
→ 403 Forbidden

// Must switch to admin first:
POST /auth/switch-role { role: 'admin' }
→ Returns new token with activeRole: 'admin'

GET /admin/users
→ 200 OK
```

### 3.3 Gallery & Portfolio Endpoints - Talent Only

These endpoints now require talent active role:

- `GET /talent/gallery`
- `GET /talent/gallery/:id`
- `POST /talent/gallery`
- `POST /talent/portfolio`

### 3.4 Service Endpoints - Talent Only

These endpoints now require talent active role:

- `GET /talent/services`
- `POST /talent/services`
- `PATCH /talent/services/:id`
- `DELETE /talent/services/:id`

### 3.5 Mentor Endpoints - Mentor Only

These endpoints now require mentor active role:

- `GET /mentor/me` → `GET /mentor/profile` (future)
- `PATCH /mentor/me` → `PATCH /mentor/profile` (future)
- `GET /mentor/dashboard`
- `GET /mentor/availability`
- `PUT /mentor/availability`
- `DELETE /mentor/availability/:id`
- `GET /mentor/reviews`
- `PATCH /mentor/profile-image`

### 3.6 Recruiter Endpoints - Recruiter Only

These endpoints now require recruiter active role:

- `GET /recruiter/me` → `GET /recruiter/profile` (future)
- `PATCH /recruiter/me` → `PATCH /recruiter/profile` (future)
- `GET /recruiter/dashboard`
- `PATCH /recruiter/profile-image`

### 3.7 Summary of Role Requirements

All role-protected endpoints now require the matching active role:

| Endpoint Prefix       | Required Active Role   |
| --------------------- | ---------------------- |
| `/talent/*`           | `talent`               |
| `/recruiter/*`        | `recruiter`            |
| `/mentor/*`           | `mentor`               |
| `/admin/*`            | `admin`                |
| `/applications` (GET) | `recruiter` or `admin` |

**Note:** The GET `/applications` endpoint is for recruiters to view applicants. Talents should use `/talent/applications` (coming in Phase 1).

---

## 4. New Endpoint Patterns

### 4.1 Current Endpoints (Will Be Deprecated)

| Old Endpoint        | New Endpoint                      |
| ------------------- | --------------------------------- |
| GET /talent/me      | GET /talent/profile (future)      |
| PATCH /talent/me    | PATCH /talent/profile (future)    |
| GET /recruiter/me   | GET /recruiter/profile (future)   |
| PATCH /recruiter/me | PATCH /recruiter/profile (future) |
| GET /mentor/me      | GET /mentor/profile (future)      |
| PATCH /mentor/me    | PATCH /mentor/profile (future)    |

### 4.2 Upcoming Endpoints (Phase 1)

These endpoints will be added in Phase 1:

| New Endpoint                  | Method | Required Role | Purpose                |
| ----------------------------- | ------ | ------------- | ---------------------- |
| `/talent/applications`        | GET    | talent        | List my applications   |
| `/talent/sessions`            | GET    | talent        | My mentorship sessions |
| `/talent/opportunities`       | GET    | talent        | Browse opportunities   |
| `/recruiter/opportunities`    | GET    | recruiter     | My posted jobs         |
| `/recruiter/applications`     | GET    | recruiter     | Applicants to my jobs  |
| `/recruiter/invitations/sent` | GET    | recruiter     | Sent invitations       |
| `/recruiter/invitations/send` | POST   | recruiter     | Send invitations       |
| `/mentor/sessions`            | GET    | mentor        | My booking sessions    |
| `/admin/opportunities`        | GET    | admin         | All opportunities      |
| `/admin/applications`         | GET    | admin         | All applications       |

---

## 5. Role Switching

### 5.1 How to Switch Roles

```javascript
// Current token has activeRole: 'talent'
// User wants to access recruiter data

const response = await fetch('/auth/switch-role', {
  method: 'POST',
  headers: {
    Authorization: `Bearer ${currentToken}`,
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({ role: 'recruiter' }),
});

const { accessToken, activeRole } = await response.json();

// Store new token and use for subsequent requests
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('activeRole', activeRole);
```

### 5.2 Response Format

```javascript
{
  "accessToken": "eyJhbGc...",
  "activeRole": "recruiter"
}
```

### 5.3 Rules for Role Switching

1. User must have the role in their `roles` array
2. Switching roles invalidates the old token (new token issued)
3. The new token has the updated `act` claim

### 5.4 Frontend State Management

```javascript
// Store active role in state management (Redux, Context, etc.)
const authState = {
  user: { ... },
  roles: ['talent', 'recruiter'],  // All roles user has
  activeRole: 'talent',              // Current role context
  accessToken: 'eyJ...'
};

// When making API calls, use the token
// Backend will validate activeRole matches endpoint
```

---

## 6. Migration Checklist

### Frontend Changes Required

- [ ] Update API client to handle role switching
- [ ] Store `activeRole` in app state
- [ ] Add role switching UI (if user has multiple roles)
- [ ] Handle 403 errors by prompting role switch
- [ ] Update all API calls to use correct endpoints

### Error Handling

```javascript
// Handle role-based access errors
try {
  const response = await fetch('/api/recruiter/applications', {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 403) {
    const error = await response.json();
    if (error.message.includes('active role')) {
      // Prompt user to switch roles
      showRoleSwitchModal();
    }
  }
} catch (error) {
  console.error('API Error:', error);
}
```

---

## 7. Code Examples

### 7.1 API Service with Role Handling

```typescript
// api.service.ts
class ApiService {
  private accessToken: string;
  private activeRole: string;

  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await fetch(`/api${endpoint}`, {
      ...options,
      headers: {
        Authorization: `Bearer ${this.accessToken}`,
        'Content-Type': 'application/json',
        ...options.headers,
      },
    });

    if (response.status === 403) {
      const error = await response.json();
      if (error.message.includes('active role')) {
        throw new RoleAccessError(error.message);
      }
      throw new Error(error.message);
    }

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async switchRole(newRole: string): Promise<void> {
    const response = await this.request<{
      accessToken: string;
      activeRole: string;
    }>('/auth/switch-role', {
      method: 'POST',
      body: JSON.stringify({ role: newRole }),
    });

    this.accessToken = response.accessToken;
    this.activeRole = response.activeRole;

    // Persist to storage
    localStorage.setItem('accessToken', this.accessToken);
    localStorage.setItem('activeRole', this.activeRole);
  }
}

class RoleAccessError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'RoleAccessError';
  }
}
```

### 7.2 Talent Profile Fetch

```typescript
// Using new role-based access
async function getTalentProfile() {
  // Ensure user has talent active role
  const currentRole = localStorage.getItem('activeRole');

  if (currentRole !== 'talent') {
    // Switch to talent first
    await api.switchRole('talent');
  }

  return api.get<TalentProfile>('/talent/profile');
}
```

### 7.3 Recruiter Applications

```typescript
async function getRecruiterApplications() {
  const currentRole = localStorage.getItem('activeRole');

  if (currentRole !== 'recruiter') {
    await api.switchRole('recruiter');
  }

  return api.get<Application[]>('/recruiter/applications');
}
```

### 7.4 Role Switch Component (React Example)

```tsx
import { useState } from 'react';

function RoleSwitcher({ userRoles, currentRole, onSwitch }) {
  const availableRoles = userRoles.filter((r) => r !== currentRole);

  if (availableRoles.length === 0) {
    return null; // User has only one role
  }

  return (
    <div className="role-switcher">
      <span>Current role: {currentRole}</span>
      <select value={currentRole} onChange={(e) => onSwitch(e.target.value)}>
        {userRoles.map((role) => (
          <option key={role} value={role}>
            {role.charAt(0).toUpperCase() + role.slice(1)}
          </option>
        ))}
      </select>
    </div>
  );
}
```

---

## 8. Testing Checklist

- [ ] Verify talent-only users cannot access recruiter endpoints
- [ ] Verify recruiter-only users cannot access talent endpoints
- [ ] Verify role switching works correctly
- [ ] Verify new token has updated `activeRole`
- [ ] Verify old tokens are invalidated after role switch
- [ ] Verify admin role has full access
- [ ] Verify 403 errors are handled gracefully

---

## 9. Support

For questions or issues related to these changes:

- **API Issues**: Backend team
- **Integration Issues**: Platform team
- **Role Switching**: See Section 5 or contact auth team

---

**Document Version**: 2.0
**API Version**: v2 (Standardized)
**Deprecation Date**: TBD (90 days from announcement)
