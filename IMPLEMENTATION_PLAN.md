# Frontend API Standardization — Implementation Plan

> Generated: 2026-02-23
> Based on: FRONTEND_INTEGRATION_GUIDE.md v2.0

---

## Table of Contents

1. [Current State Analysis](#1-current-state-analysis)
2. [Structural Issues & Cleanup](#2-structural-issues--cleanup)
3. [Phase 1 — Cleanup & Consolidation](#3-phase-1--cleanup--consolidation)
4. [Phase 2 — API Endpoint Migrations](#4-phase-2--api-endpoint-migrations)
5. [Phase 3 — Role Switching & Auth](#5-phase-3--role-switching--auth)
6. [Phase 4 — Hook Restructuring](#6-phase-4--hook-restructuring)
7. [Phase 5 — Component Updates](#7-phase-5--component-updates)
8. [Phase 6 — Error Handling & 403 Role Mismatch UI](#8-phase-6--error-handling--403-role-mismatch-ui)
9. [File Change Summary](#9-file-change-summary)
10. [Verification Plan](#10-verification-plan)

---

## 1. Current State Analysis

### API Layer (`lib/api/`)
The API layer is **fragmented** across multiple locations:

| Location | Purpose | Problem |
|:---|:---|:---|
| `lib/api/applications.ts` | Applications CRUD (274 lines) | **Duplicates** `lib/api/applications/index.ts` |
| `lib/api/applications/index.ts` | Applications CRUD (253 lines) | **Duplicates** `lib/api/applications.ts` |
| `lib/api/opportunities/index.ts` | Opportunities CRUD | Uses generic `/opportunities` paths (deprecated) |
| `lib/api/talent/index.ts` | Talent profile + services (506 lines) | Uses `/talent/me` (deprecated → `/talent/profile`) |
| `lib/api/talent/server.ts` | Same functions, "server" label | Uses `/talent/me` (deprecated) |
| `lib/api/recruiter/index.ts` | Recruiter profile | Uses `/recruiter/me` (deprecated → `/recruiter/profile`) |
| `lib/api/recruiter/server.ts` | Same functions, "server" label | Uses `/recruiter/me` (deprecated) |
| `lib/api/mentor/index.ts` | Mentor profile + bookings | Uses `/mentor/me` (deprecated → `/mentor/profile`) |
| `lib/api/mentor/server.ts` | Same functions, "server" label | Uses `/mentor/me` (deprecated) |
| `lib/api/talent-service.ts` | Re-groups talent functions into objects | **Unnecessary wrapper** |
| `lib/api/user-service.ts` | Re-groups user functions into objects | **Unnecessary wrapper** |
| `lib/api/profile-service.ts` | Role-based profile router | Fine, small file |
| `lib/api/auth-service.ts` | Auth functions | **Missing `switchRole()`** |

### Service Layer (`lib/services/`) — **DELETE ENTIRELY**
All 3 files are pure re-exports with zero logic:

| File | What it does |
|:---|:---|
| `applications-service.ts` | Re-exports from `lib/api/applications` |
| `opportunities-service.ts` | Re-exports from `lib/api/opportunities` |
| `talent-api-service.ts` | Re-exports from `lib/api/talent-service` |

### Hooks (`hooks/`) — Fragmented & Duplicated

| Hook | Problem |
|:---|:---|
| `useApplications.ts` | Manual useState/useCallback (old pattern). Used by 7 components. |
| `useApplicationsQuery.ts` | React Query version, imports from `lib/services`. Also exports `useApplications()` compat. |
| `useAllApplications.ts` | Direct apiClient call with manual state. Unused by any component. |
| `useOpportunities.ts` | React Query version. Also exports a `useOpportunitiesManager()` compat function. |
| `useOpportunitiesManager.ts` | Manual useState/useCallback (old pattern). Used by 10+ components. |

**Key Problem:** Both opportunities hooks are "God Hooks" that don't distinguish talent vs recruiter roles.

---

## 2. Structural Issues & Cleanup

### Issues to Fix
1. **Duplicate applications API files**: `lib/api/applications.ts` vs `lib/api/applications/index.ts` — keep folder version, delete loose file.
2. **`lib/services/` folder**: Pure re-exports — delete entirely, update 3 imports.
3. **Wrapper services**: `talent-service.ts` and `user-service.ts` provide wrapped objects (`talentProfileApi`, `userApi`) that add no value. Consumers should import directly from domain folders.
4. **Old-pattern hooks**: `useApplications.ts`, `useAllApplications.ts`, `useOpportunitiesManager.ts` use manual `useState`/`useCallback` instead of React Query.

### Proposed Final Structure

```
lib/api/
├── index.ts                    # apiClient + barrel exports
├── auth-service.ts             # Auth functions + NEW switchRole()
├── profile-service.ts          # Role-based profile router (update /me → /profile)
├── applications/
│   ├── index.ts                # Shared application actions (PATCH status, interviews, etc.)
│   └── types.ts                # Application types
├── opportunities/
│   ├── index.ts                # Shared opportunity actions (GET by id, PATCH, DELETE)
│   └── types.ts                # Opportunity types
├── talent/
│   ├── index.ts                # Talent profile, services, gallery, recommendations
│   ├── server.ts               # Server-callable variants
│   ├── types.ts
│   └── dashboard-types.ts
├── recruiter/
│   ├── index.ts                # Recruiter profile + dashboard
│   ├── server.ts               # Server-callable variants  
│   └── types.ts
├── mentor/
│   ├── index.ts                # Mentor profile, availability, bookings
│   ├── server.ts               # Server-callable variants
│   └── types.ts
├── mentors/                    # Public mentor directory
├── mentorship/                 # Mentorship sessions
├── notifications/              # Notification API
├── learning-resources/         # Learning resources
├── users/                      # User account API
│   ├── index.ts
│   └── server.ts
└── types/                      # Shared API types

hooks/
├── index.ts                    # Barrel exports (updated)
├── useAuth.ts                  # Auth hook (no changes)
├── useProfile.ts               # Profile context hook (no changes)
├── useProfileData.ts           # Profile data fetching (update /me → /profile)
├── useRequireRole.ts           # Role guard hook (no changes)
├── useTalentApi.ts             # Talent-specific React Query hooks
├── useUserApi.ts               # User hooks
├── useTalentOpportunities.ts   # NEW: Talent opportunity hooks (browse, save)
├── useRecruiterOpportunities.ts# NEW: Recruiter opportunity hooks (CRUD, manage)
├── useTalentApplications.ts    # NEW: Talent application hooks (submit, view mine)
├── useRecruiterApplications.ts # NEW: Recruiter application hooks (view applicants, status)
├── useNotifications.ts
├── useNotificationSocket.ts
├── useTokenRefresh.ts
├── useModal.ts
├── useToast.ts
├── useDebounce.ts
├── useIsMobile.tsx
├── useMentorDashboard.ts
├── useRecruiterDashboard.ts
├── useTalentDashboard.ts
└── (DELETED: useApplications.ts, useAllApplications.ts, useApplicationsQuery.ts,
     useOpportunities.ts, useOpportunitiesManager.ts)
```

**Files to DELETE:**
- `lib/services/` (entire folder)
- `lib/api/applications.ts` (duplicate of `/applications/index.ts`)
- `lib/api/talent-service.ts` (unnecessary wrapper)
- `lib/api/user-service.ts` (unnecessary wrapper)
- `hooks/useApplications.ts` (replaced by role-specific hooks)
- `hooks/useAllApplications.ts` (unused, replaced)
- `hooks/useApplicationsQuery.ts` (replaced by role-specific hooks)
- `hooks/useOpportunities.ts` (replaced by role-specific hooks)
- `hooks/useOpportunitiesManager.ts` (replaced by role-specific hooks)

---

## 3. Phase 1 — Cleanup & Consolidation

### Step 1.1: Delete `lib/services/` folder
These files are pure re-exports. Delete them and update the 3 importers:

| Importer | Old Import | New Import |
|:---|:---|:---|
| `hooks/useOpportunities.ts` | `@/lib/services/opportunities-service` | `@/lib/api/opportunities` |
| `hooks/useApplicationsQuery.ts` | `@/lib/services/applications-service` | `@/lib/api/applications` |
| `hooks/useTalentApi.ts` | `@/lib/services/talent-api-service` | `@/lib/api/talent-service` |

### Step 1.2: Delete `lib/api/applications.ts` (loose duplicate)
The `lib/api/applications/index.ts` folder version is the canonical source. Delete the loose file.

Update `lib/api/index.ts` barrel:
```diff
-export * from "./applications";   // This resolves to BOTH the folder AND the file (ambiguous)
+// Applications are now only in ./applications/index.ts (already exported via folder)
```
> Note: The barrel already has `export * from "./applications"` which resolves to the folder. The loose file creates ambiguity.

### Step 1.3: Delete wrapper services
- Delete `lib/api/talent-service.ts` 
- Delete `lib/api/user-service.ts`
- Update importers to use direct imports:

| Importer | Old Import | New Import |
|:---|:---|:---|
| `hooks/useAuth.ts` | `@/lib/api/user-service` → `userProfileApi.getCurrentUser` | `@/lib/api/users` → `getCurrentUser` |
| `hooks/useTalentApi.ts` | `@/lib/services/talent-api-service` → `talentProfileApi.xxx` | `@/lib/api/talent` → `xxx` directly |

---

## 4. Phase 2 — API Endpoint Migrations

### Step 2.1: Profile endpoints (`/me` → `/profile`)

| File | Old Endpoint | New Endpoint |
|:---|:---|:---|
| `lib/api/talent/index.ts` | `GET /talent/me` | `GET /talent/profile` |
| `lib/api/talent/index.ts` | `PATCH /talent/me` | `PATCH /talent/profile` |
| `lib/api/talent/server.ts` | `GET /talent/me` | `GET /talent/profile` |
| `lib/api/talent/server.ts` | `PATCH /talent/me` | `PATCH /talent/profile` |
| `lib/api/recruiter/index.ts` | `GET /recruiter/me` | `GET /recruiter/profile` |
| `lib/api/recruiter/index.ts` | `PATCH /recruiter/me` | `PATCH /recruiter/profile` |
| `lib/api/recruiter/server.ts` | `GET /recruiter/me` | `GET /recruiter/profile` |
| `lib/api/recruiter/server.ts` | `PATCH /recruiter/me` | `PATCH /recruiter/profile` |
| `lib/api/mentor/index.ts` | `GET /mentor/me` | `GET /mentor/profile` |
| `lib/api/mentor/index.ts` | `PATCH /mentor/me` | `PATCH /mentor/profile` |
| `lib/api/mentor/server.ts` | `GET /mentor/me` | `GET /mentor/profile` |
| `lib/api/mentor/server.ts` | `PATCH /mentor/me` | `PATCH /mentor/profile` |
| `lib/api/profile-service.ts` | Calls functions that use `/me` | No direct change needed (calls updated functions) |

### Step 2.2: Opportunity endpoints (role-based)

| File | Old Endpoint | New Endpoint |
|:---|:---|:---|
| `lib/api/opportunities/index.ts` | `POST /opportunities` (create) | `POST /recruiter/opportunities` |
| `lib/api/opportunities/index.ts` | `GET /opportunities/saved` | `GET /talent/opportunities/saved` |
| `lib/api/opportunities/index.ts` | `GET /opportunities` (browse) | Keep generic for now, OR split into talent/recruiter functions |

**Decision:** The `GET /opportunities` endpoint for browsing active opportunities now maps to:
- Talent context → `GET /talent/opportunities` (browse active jobs)
- Recruiter context → `GET /recruiter/opportunities` (list my posted jobs)
- Admin context → `GET /admin/opportunities` (list all)

We will create **separate API functions**:
```typescript
// In lib/api/opportunities/index.ts
export const getTalentOpportunities = (params) => apiClient('/talent/opportunities', ...);
export const getRecruiterOpportunities = (params) => apiClient('/recruiter/opportunities', ...);
export const getAdminOpportunities = (params) => apiClient('/admin/opportunities', ...);
```

Keep `getOpportunityById`, `updateOpportunity`, `deleteOpportunity` etc. as shared generic endpoints (they use `/opportunities/:id` which still works).

### Step 2.3: Application endpoints (role-based)

| File | Old Endpoint | New Endpoint |
|:---|:---|:---|
| `lib/api/applications/index.ts` | `GET /applications` | Split into `GET /talent/applications` and `GET /recruiter/applications` |
| `lib/api/applications/index.ts` | `POST /applications/invitations/send` | `POST /recruiter/invitations/send` |

**New API functions:**
```typescript
export const getTalentApplications = () => apiClient('/talent/applications');
export const getRecruiterApplications = (params) => apiClient('/recruiter/applications', ...);
```

### Step 2.4: Public directory endpoints

| Old Pattern | New Pattern |
|:---|:---|
| `GET /talent` (list profiles) | `GET /talents` |
| `GET /talent/:userId` (view profile) | `GET /talents/:userId` |
| `GET /recruiter/:id` (view profile) | `GET /recruiters/:id` |
| `GET /mentor` (list mentors) | `GET /mentors` |
| `GET /mentor/:id` (view mentor) | `GET /mentors/:id` |

Files affected:
- `lib/api/talent/index.ts` → `listTalentProfiles()`, `getTalentProfileByUserId()`
- `lib/api/recruiter/index.ts` → `getRecruiterProfileByUserId()`, `listRecruiterProfiles()`
- `lib/api/mentor/index.ts` → `getAllMentors()`, `getMentorProfileById()`
- `lib/api/mentors/index.ts` (if it exists for public)

---

## 5. Phase 3 — Role Switching & Auth

### Step 3.1: Add `switchRole()` to `lib/api/auth-service.ts`

```typescript
export interface SwitchRoleResponse {
  accessToken: string;
  activeRole: string;
}

export const switchRole = async (role: string): Promise<SwitchRoleResponse> => {
  const response = await apiClient<SwitchRoleResponse>('/auth/switch-role', {
    method: 'POST',
    body: { role },
  });

  // Store new token and active role
  if (response.accessToken) {
    storeTokens({
      accessToken: response.accessToken,
      refreshToken: getRefreshToken() || '',
      userId: '', // preserved from existing
    });
  }

  if (typeof window !== 'undefined') {
    localStorage.setItem('activeRole', response.activeRole);
  }

  return response;
};
```

### Step 3.2: Add `switchRole` to profile context
Update `useProfile` / ProfileProvider to expose a `switchRole()` method that:
1. Calls `authService.switchRole(role)`
2. Updates the context's `activeRole`
3. Refreshes the relevant profile data
4. Returns the new token

### Step 3.3: Update `useProfileData.ts`
Replace `/talent/me`, `/recruiter/me`, `/mentor/me` calls with the updated API functions (which will now use `/profile`).

---

## 6. Phase 4 — Hook Restructuring

### Step 4.1: Create `hooks/useTalentOpportunities.ts`
```typescript
// React Query hooks for talent opportunity interactions
export function useTalentOpportunitiesQuery(params?) {
  // queryKey: ['opportunities', 'talent', params]
  // queryFn: () => getTalentOpportunities(params)
  // enabled: currentRole === 'talent'
}

export function useSavedOpportunitiesQuery(limit, offset) {
  // queryKey: ['opportunities', 'talent', 'saved', { limit, offset }]
  // queryFn: () => getSavedOpportunities(limit, offset)
}

export function useSaveOpportunity() { ... }
export function useUnsaveOpportunity() { ... }
```

### Step 4.2: Create `hooks/useRecruiterOpportunities.ts`
```typescript
export function useRecruiterOpportunitiesQuery(params?) {
  // queryKey: ['opportunities', 'recruiter', params]
  // queryFn: () => getRecruiterOpportunities(params)
  // enabled: currentRole === 'recruiter'
}

export function useCreateOpportunity() { ... }
export function useUpdateOpportunity() { ... }
export function useDeleteOpportunity() { ... }
export function usePostOpportunity() { ... }
export function useReopenOpportunity() { ... }
```

### Step 4.3: Create `hooks/useTalentApplications.ts`
```typescript
export function useTalentApplicationsQuery() {
  // queryKey: ['applications', 'talent']
  // queryFn: () => getTalentApplications()
}

export function useSubmitApplication() { ... }
```

### Step 4.4: Create `hooks/useRecruiterApplications.ts`
```typescript
export function useRecruiterApplicationsQuery(opportunityId?) {
  // queryKey: ['applications', 'recruiter', opportunityId]
  // queryFn: () => getRecruiterApplications({ opportunityId })
}

export function useUpdateApplicationStatus() { ... }
export function useScheduleInterview() { ... }
export function useSendInvitations() { ... }
```

### Step 4.5: Delete old hooks
- `hooks/useApplications.ts`
- `hooks/useAllApplications.ts`
- `hooks/useApplicationsQuery.ts`
- `hooks/useOpportunities.ts`
- `hooks/useOpportunitiesManager.ts`

### Step 4.6: Update `hooks/index.ts` barrel
Remove old exports, add new ones.

---

## 7. Phase 5 — Component Updates

### Talent Components (import from talent hooks)

| Component | Old Hook | New Hook |
|:---|:---|:---|
| `components/talent/profile/TalentProfile.tsx` | `useOpportunitiesManager` → `getSaved()` | `useSavedOpportunitiesQuery()` |
| `components/talent/profile/components/OpportunitiesGrid.tsx` | `useOpportunitiesManager` → `save/unsave` | `useSaveOpportunity()` / `useUnsaveOpportunity()` |
| `components/talent/opportunities/opportunity-card.tsx` | `useOpportunitiesManager` → `save/unsave` | `useSaveOpportunity()` / `useUnsaveOpportunity()` |
| `components/talent/opportunities/OpportunityDetails.tsx` | `useOpportunitiesManager` → `save/unsave` | `useSaveOpportunity()` / `useUnsaveOpportunity()` |
| `components/talent/opportunities/application-modal.tsx` | `useApplications` → `submit` | `useSubmitApplication()` |

### Employer/Recruiter Components (import from recruiter hooks)

| Component | Old Hook | New Hook |
|:---|:---|:---|
| `components/employer/profile/tabs/OpportunitiesTab.tsx` | `useOpportunitiesManager` → `getAll` | `useRecruiterOpportunitiesQuery()` |
| `components/employer/opportunities/EditOpportunityForm.tsx` | `useOpportunitiesManager` → `getById, update, post` | `useUpdateOpportunity()`, `usePostOpportunity()` |
| `components/employer/opportunities/EmployerOpportunities.tsx` | `useOpportunitiesManager` → `getAll` | `useRecruiterOpportunitiesQuery()` |
| `components/employer/opportunities/PostOpportunityForm.tsx` | `useOpportunitiesManager` → `create, getAll` | `useCreateOpportunity()` |
| `components/employer/opportunities/OpportunityPreview.tsx` | `useOpportunitiesManager` → `create, update` | `useCreateOpportunity()`, `useUpdateOpportunity()` |
| `components/employer/opportunities/OpportunityCard.tsx` | `useOpportunitiesManager` → `updateStatus, delete, reopen` | `useUpdateOpportunity()`, `useDeleteOpportunity()`, `useReopenOpportunity()` |
| `components/employer/opportunities/ApplicantsView.tsx` | `useApplications` → `getAll, updateStatus` | `useRecruiterApplicationsQuery()`, `useUpdateApplicationStatus()` |
| `components/employer/profile/tabs/PastHiresTab.tsx` | `useApplications` → `getAll` | `useRecruiterApplicationsQuery()` |
| `app/(business)/applicants/page.tsx` | `useApplications` | `useRecruiterApplicationsQuery()` |
| `app/(business)/applicants/[id]/page.tsx` | `useApplications` | `useRecruiterApplicationsQuery()` |
| `app/(business)/applicants/hired-talents/page.tsx` | `useApplications` | `useRecruiterApplicationsQuery()` |
| `app/(business)/opportunities/[id]/applicants/page.tsx` | `useApplications` | `useRecruiterApplicationsQuery()` |

---

## 8. Phase 6 — Error Handling & 403 Role Mismatch UI

### Step 6.1: Update `lib/api/index.ts` (apiClient)
Add detection for role mismatch 403 errors:

```typescript
if (response.status === 403) {
  const errorData = await response.json();
  if (errorData.message?.includes('active role')) {
    const error = new Error(errorData.message);
    (error as any).status = 403;
    (error as any).isRoleMismatch = true;
    (error as any).requiredRole = errorData.requiredRole; // if backend provides
    throw error;
  }
}
```

### Step 6.2: Create Role Switch Prompt Component
Create `components/ui/RoleSwitchModal.tsx` — a dialog that:
1. Explains the user needs to switch roles
2. Shows which role is required
3. Has a "Switch to {role}" button that calls `switchRole()`
4. Automatically retries the failed operation after switching

### Step 6.3: Hook-level error handling
Each role-specific hook should handle the `isRoleMismatch` error in its `onError` callback.

---

## 9. File Change Summary

### Files to CREATE (6)
| File | Purpose |
|:---|:---|
| `hooks/useTalentOpportunities.ts` | Talent opportunity hooks |
| `hooks/useRecruiterOpportunities.ts` | Recruiter opportunity hooks |
| `hooks/useTalentApplications.ts` | Talent application hooks |
| `hooks/useRecruiterApplications.ts` | Recruiter application hooks |
| `components/ui/RoleSwitchModal.tsx` | Role mismatch prompt UI |
| (this file) | Implementation plan |

### Files to MODIFY (18)
| File | Change |
|:---|:---|
| `lib/api/index.ts` | Remove loose application re-export, add 403 role mismatch handling |
| `lib/api/auth-service.ts` | Add `switchRole()` function |
| `lib/api/profile-service.ts` | Updated function calls (no path changes needed since it calls updated functions) |
| `lib/api/talent/index.ts` | `/talent/me` → `/talent/profile`, public endpoints → `/talents` |
| `lib/api/talent/server.ts` | `/talent/me` → `/talent/profile` |
| `lib/api/recruiter/index.ts` | `/recruiter/me` → `/recruiter/profile`, public → `/recruiters` |
| `lib/api/recruiter/server.ts` | `/recruiter/me` → `/recruiter/profile` |
| `lib/api/mentor/index.ts` | `/mentor/me` → `/mentor/profile`, public → `/mentors` |
| `lib/api/mentor/server.ts` | `/mentor/me` → `/mentor/profile` |
| `lib/api/opportunities/index.ts` | Add role-specific functions, update `createOpportunity` → `/recruiter/opportunities`, update `getSavedOpportunities` → `/talent/opportunities/saved` |
| `lib/api/applications/index.ts` | Add role-specific functions, update invitations → `/recruiter/invitations/*` |
| `hooks/index.ts` | Update barrel exports |
| `hooks/useAuth.ts` | Update import path (remove user-service wrapper) |
| `hooks/useProfileData.ts` | Updated functions will use new paths automatically |
| `hooks/useTalentApi.ts` | Update import path (remove services wrapper) |
| + 7 talent components | Update hook imports |
| + 10 employer components | Update hook imports |

### Files to DELETE (10)
| File | Reason |
|:---|:---|
| `lib/services/applications-service.ts` | Pure re-export |
| `lib/services/opportunities-service.ts` | Pure re-export |
| `lib/services/talent-api-service.ts` | Pure re-export |
| `lib/api/applications.ts` | Duplicate of `applications/index.ts` |
| `lib/api/talent-service.ts` | Unnecessary wrapper |
| `lib/api/user-service.ts` | Unnecessary wrapper |
| `hooks/useApplications.ts` | Replaced by role-specific hooks |
| `hooks/useAllApplications.ts` | Unused, replaced |
| `hooks/useApplicationsQuery.ts` | Replaced by role-specific hooks |
| `hooks/useOpportunitiesManager.ts` | Replaced by role-specific hooks |

> **Note:** `hooks/useOpportunities.ts` will also be deleted (it's the React Query version of the God Hook, also replaced).

---

## 10. Verification Plan

### After Each Phase
```bash
# TypeScript compilation check
npx tsc --noEmit

# Run existing tests
npm run test
```

### After All Phases
1. Log in as a **Talent** → verify `/talent/profile` is fetched, opportunities load via `/talent/opportunities`
2. Log in as a **Recruiter** → verify `/recruiter/profile` is fetched, posted jobs load via `/recruiter/opportunities`
3. As a dual-role user → switch role via UI, verify token changes and data refreshes
4. Attempt recruiter action as talent → verify 403 triggers role switch prompt
5. Visit public profile pages (unauthenticated) → verify `/talents/:id` and `/mentors/:id` work
6. Verify no regressions in save/unsave, application submission, interview scheduling

---

## Execution Order

| Order | Phase | Estimated Files Changed |
|:---|:---|:---|
| 1 | Phase 1: Cleanup & Consolidation | ~10 files |
| 2 | Phase 2: API Endpoint Migrations | ~10 files |
| 3 | Phase 3: Role Switching & Auth | ~3 files |
| 4 | Phase 4: Hook Restructuring | ~10 files |
| 5 | Phase 5: Component Updates | ~17 components |
| 6 | Phase 6: Error Handling & Role Switch UI | ~3 files |

**Total: ~53 file operations (create + modify + delete)**
