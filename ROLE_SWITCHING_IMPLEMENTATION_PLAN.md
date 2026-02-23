# Role Switching Implementation Plan

> Generated: Feb 23, 2026  
> Status: Ready for implementation  
> Based on: `FRONTEND_ROLE_SWITCHING_GUIDE.md` + codebase audit

---

## What You're Doing

You're building **TalentNG** — a multi-sided talent marketplace (Next.js 15 + TypeScript) with 3 roles: **Talent**, **Recruiter**, **Mentor**. The backend has shipped **contextual RBAC** where the JWT now contains an `act` claim (active role) that the backend enforces. You need the frontend to integrate the `POST /auth/switch-role` endpoint so users can seamlessly switch between their roles.

---

## Current State (What's Already Done)

| Component | Status | Notes |
|---|---|---|
| `switchRole` API function (`lib/api/auth-service.ts`) | ✅ Done | Calls `POST /auth/switch-role`, stores new token |
| `ProfileProvider` context (`profile-provider.tsx`) | ✅ Done | Has `switchRole` method, stores `activeRole` |
| `ProfileSwitcher` UI (`components/layouts/ProfileSwitcher.tsx`) | ⚠️ Broken | Calls `setActiveRole()` (UI-only) — **does NOT call the switch-role API** |
| `RoleSwitchModal` (`components/ui/RoleSwitchModal.tsx`) | ✅ Done | Handles 403 role mismatch prompts |
| `GlobalErrorHandler` (`components/GlobalErrorHandler.tsx`) | ✅ Done | Intercepts query/mutation errors for role mismatch |
| `useProfileData` hook | ⚠️ Partial | Reads `decoded.activeRole` from JWT, but guide says the field is `act` |
| API interceptor (`lib/api/index.ts`) | ❌ Missing | No 403 role-mismatch handling in the API client |
| Middleware (`middleware.ts`) | ❌ Wrong | Uses `roles` array for access checks, ignores `act` claim |
| Redirect after switch | ❌ Missing | No navigation to role-appropriate dashboard after switching |

---

## Issues Found (7 Critical)

### Issue 1: ProfileSwitcher doesn't call the API
**File:** `components/layouts/ProfileSwitcher.tsx` line 182-185  
**Problem:** `handleSwitchRole` calls `setActiveRole(role)` which only updates React state. The old JWT still has the old `act` claim — all subsequent API calls to the new role's endpoints will get 403.  
**Fix:** Call `switchRole(role)` from `ProfileProvider` (which calls the API) instead of `setActiveRole(role)`.

### Issue 2: JWT field name mismatch (`activeRole` vs `act`)
**File:** `hooks/useProfileData.ts` line 58  
**Problem:** Code reads `decoded.activeRole` but the backend guide says the JWT contains `act`.  
**Fix:** Read `decoded.act` (and fallback to `decoded.activeRole` for backwards compatibility).

### Issue 3: No redirect after role switch
**File:** `components/layouts/ProfileSwitcher.tsx`  
**Problem:** After switching roles, user stays on the current page which may not be accessible to the new role.  
**Fix:** After `switchRole()` completes, redirect to the appropriate dashboard (`/dashboard`, `/employer`, `/mentor`).

### Issue 4: API client doesn't handle 403 role-mismatch
**File:** `lib/api/index.ts`  
**Problem:** The API client handles 401 (token expired) but not 403 with role-mismatch info. When a request hits a wrong-role endpoint, it just throws a generic error.  
**Fix:** Intercept 403 responses, parse the error message for "active role" text, and enrich the thrown error with `isRoleMismatch`, `requiredRole`, and `actualRole` metadata.

### Issue 5: Middleware uses `roles` not `act` for route access
**File:** `middleware.ts` lines 53-68, `lib/auth/role-routes.ts`  
**Problem:** `extractRolesFromToken()` reads the `roles` array and `canAccessRoute()` checks if user has ANY matching role — but with contextual RBAC, the backend only allows the `act` role. This means the middleware lets users through to pages their `act` role doesn't have access to, then they get 403 on every API call.  
**Fix:** Extract and use the `act` claim for route guarding instead of the full `roles` array.

### Issue 6: ProfileSwitcher only fetches active role's profile
**File:** `hooks/useProfileData.ts` lines 104-110  
**Problem:** Only the current active role's profile is fetched. This means the ProfileSwitcher dropdown can't show names/avatars for other roles — `switchableRoles` is filtered by `profiles[role] !== null` which excludes unfetched roles.  
**Fix:** Fetch profiles for ALL user roles (not just the active one) so the switcher can display them.

### Issue 7: `act` claim not decoded after login
**File:** `lib/api/auth-service.ts` (login/register functions)  
**Problem:** After login, the response is stored but the `act` claim isn't decoded to set the initial active role. The active role is determined by profile availability instead of the JWT.  
**Fix:** After `handleAuthResponse()`, decode the JWT to extract `act` and store it as `activeRole`.

---

## Implementation Plan (6 Phases)

### Phase 1: Fix JWT Field Name (`act` claim)
**Files to change:**
- `hooks/useProfileData.ts`
- `lib/auth.ts`

**Tasks:**
1. Add a helper `getActiveRoleFromToken(token: string): string | null` to `lib/auth.ts` that decodes the JWT and reads the `act` field (with `activeRole` fallback).
2. Update `useProfileData.ts` line 58 to use `decoded.act || decoded.activeRole` instead of just `decoded.activeRole`.

**Verification:** Log in and confirm `act` is correctly read from the JWT.

---

### Phase 2: Fix ProfileSwitcher to Call the API
**Files to change:**
- `components/layouts/ProfileSwitcher.tsx`

**Tasks:**
1. Change `handleSwitchRole` to call `switchRole(role)` (the async API version from `useProfile()`) instead of `setActiveRole(role)`.
2. Add loading state while the switch-role API call is in-flight.
3. Add error handling with a toast notification if the switch fails.
4. After successful switch, redirect to the role-appropriate dashboard:
   - `talent` → `/dashboard`
   - `recruiter` → `/employer`
   - `mentor` → `/mentor`

**Verification:** Open the ProfileSwitcher, switch roles, confirm network request goes to `POST /auth/switch-role`, confirm new token is stored, confirm redirect happens.

---

### Phase 3: Add 403 Role-Mismatch Handling to API Client
**Files to change:**
- `lib/api/index.ts`

**Tasks:**
1. After the existing 401 handling block, add a 403 handler:
   - Parse the response body for `message` containing "active role"
   - Extract the required role from the message (regex: `Required role\(s\): (\w+)`)
   - Extract the actual role (regex: `Your active role: (\w+)`)
   - Enrich the thrown error with `isRoleMismatch: true`, `requiredRole`, `actualRole`
2. The `GlobalErrorHandler` already listens for `isRoleMismatch` errors — this wires everything together.

**Verification:** Manually trigger a 403 by accessing a recruiter endpoint while active as talent. Confirm `RoleSwitchModal` appears.

---

### Phase 4: Fix Middleware to Use `act` Claim
**Files to change:**
- `middleware.ts`

**Tasks:**
1. Update `extractRolesFromToken()` to also extract the `act` claim.
2. In the route protection logic, use `act` (active role) for `canAccessRoute()` instead of the full `roles` array.
3. If `act` doesn't match the route, redirect to the dashboard for the user's `act` role (using `getRedirectForRole([act])`).

**Verification:** Log in as a multi-role user, confirm you can only access routes matching your active role, confirm redirecting to correct dashboard when hitting wrong route.

---

### Phase 5: Fetch All Role Profiles for Switcher Display
**Files to change:**
- `hooks/useProfileData.ts`

**Tasks:**
1. Instead of only fetching the active role's profile, fetch ALL profiles for roles in `userRoles`.
2. Keep the current active-role-first pattern but fetch others in the background so the switcher dropdown can display names and avatars for all roles.

```typescript
// Fetch all profiles in parallel
const [talentProfile, recruiterProfile, mentorProfile] = await Promise.all([
  userRoles.includes("talent") ? getServerCurrentProfile().catch(() => null) : null,
  userRoles.includes("recruiter") ? getServerCurrentRecruiterProfile().catch(() => null) : null,
  userRoles.includes("mentor") ? getServerCurrentMentorProfile().catch(() => null) : null,
]);
```

**Verification:** Log in as a multi-role user, open ProfileSwitcher, confirm all roles show names/avatars (not just the active one).

---

### Phase 6: Store `act` After Login
**Files to change:**
- `lib/api/auth-service.ts`

**Tasks:**
1. In `handleAuthResponse()`, after storing tokens, decode the JWT to extract `act` and persist to localStorage + cookie:
   ```typescript
   const decoded = decodeToken(response.accessToken);
   if (decoded?.act) {
     localStorage.setItem("activeRole", decoded.act);
     document.cookie = `activeRole=${decoded.act}; path=/; max-age=31536000; SameSite=Lax`;
   }
   ```
2. Apply the same to `verifyEmailConfirm()` and `resetPassword()` since those also return new tokens.

**Verification:** Register/login a new user, confirm `activeRole` is set in localStorage and cookies immediately after login.

---

## Execution Order & Dependencies

```
Phase 1 (JWT field) ──────┐
                           ├──→ Phase 2 (ProfileSwitcher fix)
Phase 6 (Login decode) ───┘         │
                                    ├──→ Phase 5 (Fetch all profiles)
Phase 3 (API 403 handling) ─────────┘
                                    
Phase 4 (Middleware fix) ──→ Independent, can be done anytime
```

**Recommended order:** 1 → 6 → 2 → 3 → 5 → 4

---

## Testing Checklist

After all phases:

- [ ] Login with a single-role user → no switcher shown, correct dashboard
- [ ] Login with a multi-role user → switcher shown, correct active role from JWT `act`
- [ ] Switch role via ProfileSwitcher → API call fires, new token stored, redirect to correct dashboard
- [ ] Access a wrong-role page directly via URL → middleware redirects to correct dashboard
- [ ] Make an API call to wrong-role endpoint → `RoleSwitchModal` appears
- [ ] Switch role from `RoleSwitchModal` → new token stored, page reloads
- [ ] Refresh the page after switching → active role preserved (cookie + localStorage + JWT)
- [ ] Token refresh → `act` claim preserved (backend handles this)
- [ ] ProfileSwitcher shows names/avatars for all roles (not just active)
- [ ] Logout and login again → active role correctly set from JWT `act`

---

## Files Summary

| File | Changes |
|---|---|
| `lib/auth.ts` | Add `getActiveRoleFromToken()` helper |
| `lib/api/auth-service.ts` | Decode `act` in `handleAuthResponse()` |
| `lib/api/index.ts` | Add 403 role-mismatch interception |
| `hooks/useProfileData.ts` | Fix JWT field to `act`, fetch all profiles |
| `components/layouts/ProfileSwitcher.tsx` | Call `switchRole` API + redirect |
| `middleware.ts` | Use `act` claim for route access |

No new files needed. All changes are modifications to existing code.
