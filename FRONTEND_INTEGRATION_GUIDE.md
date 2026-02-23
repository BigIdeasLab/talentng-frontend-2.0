# Frontend Integration Guide: API Changes

> Last Updated: 2026-02-23
> Version: 2.0 (API Standardization)

---

## Table of Contents

1. [Overview](#1-overview)
2. [Role-Based Access Changes](#2-role-based-access-changes)
3. [Breaking Changes & Deprecations](#3-breaking-changes--deprecations)
4. [New Endpoint Patterns & Migrations](#4-new-endpoint-patterns--migrations)
5. [Public Directory Endpoints](#5-public-directory-endpoints)
6. [Role Switching](#6-role-switching)
7. [Migration Checklist](#7-migration-checklist)
8. [Code Examples](#8-code-examples)

---

## 1. Overview

This guide covers the API changes made as part of the API Standardization initiative. The main changes involve:

- **Role-based access control** - Endpoints now require specific active roles (`user.act`).
- **Contextual RBAC** - Users must switch roles to access different resources.
- **Role-Prefixed endpoint patterns** - Standardized URL structure (`/{role}/{resource}`).
- **Public Directory aliases** - Using plural resources (`/talents`, `/recruiters`) for public unauthorized access.

> **Note on Versioning:** We are NOT introducing a global `/v2` prefix. The standardization uses explicit endpoint renames with Sunset/Deprecation notices on the old routes.

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

To access recruiter data, the user must switch their active role first (see Section 6).

---

## 3. Breaking Changes & Deprecations

### 3.1 Deprecated Endpoints

The following old generic endpoints have been marked as deprecated in OpenAPI/Swagger and should be replaced with their Role-Prefixed equivalents. They will be fully removed 90 days after announcement.

| Old Endpoint                          | Replace With                       | Reason                                                    |
| :------------------------------------ | :--------------------------------- | :-------------------------------------------------------- |
| `POST /opportunities`                 | `POST /recruiter/opportunities`    | Creation should be explicitly tied to the Recruiter role. |
| `GET /opportunities/saved`            | `GET /talent/opportunities/saved`  | Viewing saved jobs is a Talent-specific action.           |
| `POST /applications/invitations/send` | `POST /recruiter/invitations/send` | Sending invites is a Recruiter action.                    |
| `GET /applications/invitations/sent`  | `GET /recruiter/invitations/sent`  | Viewing sent invites is a Recruiter action.               |

### 3.2 Strict Scope-Based Filtering

Shared resource endpoints like `GET /applications/:id` and `PATCH /applications/:id` now require strict ownership checks:

- A `talent` can only interact with applications they submitted.
- A `recruiter` can only interact with applications attached to opportunities they posted.
- Accessing an entity you don't own returns `403 Forbidden`.

### 3.3 Admin Endpoints - Stricter Access

Admin endpoints now require:

1. User must have 'admin' in their roles array
2. User's active role must be 'admin' (unless they are explicitly bypassing with special tools)

---

## 4. New Endpoint Patterns & Migrations

We have implemented the `{role}/{resource}` pattern across the board. Below are the mappings of old paths to new paths.

### 4.1 Backward-Compatible Aliases (Profile)

You can begin migrating these immediately. The old `/me` paths will remain working for 90 days.

| Old Endpoint    | New Endpoint         | Method     |
| :-------------- | :------------------- | :--------- |
| `/talent/me`    | `/talent/profile`    | GET, PATCH |
| `/recruiter/me` | `/recruiter/profile` | GET, PATCH |
| `/mentor/me`    | `/mentor/profile`    | GET, PATCH |

### 4.2 New Role-Prefixed Endpoints (Phase 1 Implementations)

These endpoints explicitly tie resources to the active role of the caller.

#### Talent Endpoints (Requires `talent` active role)

| New Endpoint                  | Method | Purpose                                                       |
| :---------------------------- | :----- | :------------------------------------------------------------ |
| `/talent/applications`        | GET    | List applications submitted by the talent.                    |
| `/talent/opportunities`       | GET    | Browse all active opportunities.                              |
| `/talent/opportunities/saved` | GET    | List opportunities saved by the talent.                       |
| `/talent/sessions`            | GET    | List the talent's mentorship sessions (where role is mentee). |

#### Recruiter Endpoints (Requires `recruiter` active role)

| New Endpoint                  | Method | Purpose                                                     |
| :---------------------------- | :----- | :---------------------------------------------------------- |
| `/recruiter/opportunities`    | GET    | List opportunities posted by the recruiter.                 |
| `/recruiter/applications`     | GET    | List applications for the recruiter's posted opportunities. |
| `/recruiter/invitations/sent` | GET    | List invitations sent by the recruiter.                     |
| `/recruiter/invitations/send` | POST   | Send invitations to talents.                                |

#### Mentor Endpoints (Requires `mentor` active role)

| New Endpoint       | Method | Purpose                                                   |
| :----------------- | :----- | :-------------------------------------------------------- |
| `/mentor/sessions` | GET    | List the mentor's booked sessions (where role is mentor). |

#### Admin Endpoints (Requires `admin` active role)

| New Endpoint           | Method | Purpose                                            |
| :--------------------- | :----- | :------------------------------------------------- |
| `/admin/opportunities` | GET    | List all opportunities (unrestricted system-wide). |
| `/admin/applications`  | GET    | List all applications (unrestricted system-wide).  |

---

## 5. Public Directory Endpoints

Public access endpoints (those that don't require Authentication) have been standardized to use **plural nouns**. Use these for SEO pages and unauthenticated browsing.

| Endpoint           | Method | Auth Required | Purpose                                                       |
| :----------------- | :----- | :------------ | :------------------------------------------------------------ |
| `/talents`         | GET    | No            | Browse public talent profiles (previously nested or missing). |
| `/talents/:userId` | GET    | No            | View a specific public talent profile.                        |
| `/recruiters/:id`  | GET    | No            | View a specific public recruiter profile.                     |
| `/mentors`         | GET    | No            | Browse public mentor profiles.                                |
| `/mentors/:id`     | GET    | No            | View a specific public mentor profile.                        |

> Note: Accessing private user scopes unauthenticated will return `404 Not Found` (to prevent information leakage) rather than `401 Unauthorized`.

---

## 6. Role Switching

### 6.1 How to Switch Roles

```javascript
// Current token has activeRole: 'talent'
// User wants to access recruiter data

const response = await fetch("/auth/switch-role", {
  method: "POST",
  headers: {
    Authorization: `Bearer ${currentToken}`,
    "Content-Type": "application/json",
  },
  body: JSON.stringify({ role: "recruiter" }),
});

const { accessToken, activeRole } = await response.json();

// Store new token and use for subsequent requests
localStorage.setItem("accessToken", accessToken);
localStorage.setItem("activeRole", activeRole);
```

### 6.2 Frontend State Management

```javascript
// Store active role in state management (Redux, Context, etc.)
const authState = {
  user: { ... },
  roles: ['talent', 'recruiter'],  // All roles user has
  activeRole: 'talent',              // Current role context
  accessToken: 'eyJ...'
};
```

---

## 7. Migration Checklist

### Frontend Changes Required

- [ ] Inspect Swagger docs for endpoints marked `deprecated: true`.
- [ ] Find and replace all `GET /xxx/me` endpoints to `GET /xxx/profile` (for talent, recruiter, mentor).
- [ ] Migrate usage of `POST /opportunities` to `POST /recruiter/opportunities` (requires UI to switch to Recruiter role first).
- [ ] Migrate usage of generic `GET /applications` to either `/talent/applications` or `/recruiter/applications` depending on user context.
- [ ] Replace `GET /opportunities/saved` with `GET /talent/opportunities/saved`.
- [ ] Update public SEO links/routes to use `/talents` and `/recruiters/:id`.
- [ ] Ensure 403 Forbidden errors triggered by "active role mismatch" prompt a role switch UI instead of a generic failure.

### Error Handling

```javascript
// Handle role-based access errors
try {
  const response = await fetch("/api/recruiter/applications", {
    headers: { Authorization: `Bearer ${token}` },
  });

  if (response.status === 403) {
    const error = await response.json();
    if (error.message.includes("active role")) {
      // Prompt user to switch roles
      showRoleSwitchModal();
    }
  }
} catch (error) {
  console.error("API Error:", error);
}
```

---

## 8. Code Examples

### 8.1 Fetching Talent Data with New Pattern

```typescript
// Using new role-based access
async function getTalentProfile() {
  // Ensure user has talent active role
  const currentRole = localStorage.getItem("activeRole");

  if (currentRole !== "talent") {
    // Switch to talent first
    await api.switchRole("talent");
  }

  // Use the new Alias
  return api.get<TalentProfile>("/talent/profile");
}
```

### 8.2 Recruiter Specific Actions

```typescript
async function inviteTalentToJob(opportunityId: string, talentIds: string[]) {
  const currentRole = localStorage.getItem("activeRole");

  if (currentRole !== "recruiter") {
    await api.switchRole("recruiter");
  }

  // Use the new Role-Prefixed invitation endpoint
  return api.post("/recruiter/invitations/send", {
    opportunityId,
    talentIds,
  });
}
```

### 8.3 React Query Architecture Recommendations

Because the API endpoints are now conceptually and securely split by role (e.g., `/talent/opportunities` vs `/recruiter/opportunities`), **we strongly recommend splitting your frontend hooks as well.**

Instead of a single "God Hook" (`useOpportunities`) that has to manage conditional enabling, varying role checks, and different response typings, create specific hooks for each role context:

**✅ Recommended: Role-Specific Hooks**

```typescript
// 🧑‍💻 For the Talent App / Context
export function useTalentOpportunities(filters) {
  return useQuery({
    queryKey: ["opportunities", "talent", filters],
    queryFn: () => api.get("/talent/opportunities", { params: filters }),
    // Only fetch if the user is currently acting as a talent
    enabled: currentRole === "talent",
  });
}

// 🏢 For the Recruiter App / Context
export function useRecruiterOpportunities(filters) {
  return useQuery({
    queryKey: ["opportunities", "recruiter", filters],
    queryFn: () => api.get("/recruiter/opportunities", { params: filters }),
    // Only fetch if the user is currently acting as a recruiter
    enabled: currentRole === "recruiter",
  });
}
```

**Why this is better:**

1. **Separation of Concerns:** The Talent view of an opportunity is fundamentally different from a Recruiter's view (Recruiters see applicant counts, Talents see application status). Splitting the hooks allows you to tightly strictly type the expected responses (`TalentOpportunityDto` vs `RecruiterOpportunityDto`).
2. **Simplified Invalidation:** When a recruiter posts a new job, you only invalidate the `['opportunities', 'recruiter']` cache.
3. **Cleaner Components:** Your UI components (e.g., `RecruiterJobDashboard`) can directly call `useRecruiterOpportunities()` without passing down role conditions.

---

**Document Version**: 2.0
**API Version**: v2 (Standardized)
**Deprecation Date**: TBD (90 days from announcement)
