# TalentNG Frontend — Code Audit

**Date:** 2026-04-07
**Codebase:** Next.js 16 + React 18 + TypeScript + Tailwind CSS + Shadcn/UI + TanStack React Query
**Scope:** Full frontend codebase audit — readability, organisation, conventions, consistency, and maintainability.

---

## Table of Contents

1. [Executive Summary](#1-executive-summary)
2. [Project Structure — What's Good](#2-project-structure--whats-good)
3. [Naming Conventions — Inconsistencies](#3-naming-conventions--inconsistencies)
4. [Type Safety Issues](#4-type-safety-issues)
5. [Code Duplication](#5-code-duplication)
6. [File Organisation Problems](#6-file-organisation-problems)
7. [API Layer Audit](#7-api-layer-audit)
8. [Hooks Audit](#8-hooks-audit)
9. [Component Architecture Audit](#9-component-architecture-audit)
10. [Console Logs & Debug Code](#10-console-logs--debug-code)
11. [CSS/Styling Audit](#11-cssstyling-audit)
12. [Testing Audit](#12-testing-audit)
13. [Documentation Audit](#13-documentation-audit)
14. [Configuration & Package Audit](#14-configuration--package-audit)
15. [Security Observations](#15-security-observations)
16. [Performance Patterns — What's Good](#16-performance-patterns--whats-good)
17. [Actionable Recommendations Summary](#17-actionable-recommendations-summary)

---

## 1. Executive Summary

The codebase has a **solid architectural foundation** — well-structured routing with Next.js route groups, a centralised API client with token refresh, organised React Query hooks, a barrel-export pattern for hooks and types, and a good role-based design (talent / recruiter / mentor). However, there are **consistency gaps** that would slow down a new developer picking this up.

### Severity Legend

| Emoji | Meaning                                          |
| ----- | ------------------------------------------------ |
| 🔴    | High — fix soon, affects readability/reliability |
| 🟡    | Medium — should be addressed for consistency     |
| 🟢    | Low — nice to have, cosmetic                     |

---

## 2. Project Structure — What's Good ✅

These conventions are already solid and should be **kept and enforced**:

| Convention                               | Example                                                            | Verdict            |
| ---------------------------------------- | ------------------------------------------------------------------ | ------------------ |
| Route groups for auth vs business        | `app/(auth)/`, `app/(business)/`                                   | ✅ Great           |
| Centralised API client with auto-refresh | `lib/api/index.ts`                                                 | ✅ Great           |
| API layer split by domain                | `lib/api/talent/`, `lib/api/recruiter/`, `lib/api/mentor/`         | ✅ Great           |
| Barrel exports for hooks                 | `hooks/index.ts` with JSDoc comments                               | ✅ Excellent       |
| Barrel exports for types                 | `lib/types/index.ts` with section separators                       | ✅ Excellent       |
| Shadcn/UI component library              | `components/ui/`                                                   | ✅ Standard        |
| Separate server client                   | `lib/api/server-client.ts`                                         | ✅ Good separation |
| Component colocation by role             | `components/talent/`, `components/employer/`, `components/mentor/` | ✅ Good            |
| ProfileProvider for role context         | `app/(business)/profile-provider.tsx`                              | ✅ Good pattern    |
| React Query for server state             | Consistent across all data hooks                                   | ✅ Great           |
| `@/*` path alias                         | Consistent usage throughout                                        | ✅ Good            |

---

## 3. Naming Conventions — Inconsistencies

### 🔴 3.1 File Naming — Mixed Casing

The codebase uses **three different conventions** for component file names:

| Convention     | Files Using It | Examples                                                             |
| -------------- | -------------- | -------------------------------------------------------------------- |
| **PascalCase** | ~60%           | `GlobalErrorHandler.tsx`, `ProfileSwitcher.tsx`, `LoadingScreen.tsx` |
| **kebab-case** | ~25%           | `application-modal.tsx`, `opportunity-card.tsx`, `search-input.tsx`  |
| **camelCase**  | ~15%           | `profileMapper.ts`, `token-refresh.ts`                               |

**What a new dev sees:** Confusion about which convention to follow.

**Recommendation:** Standardise on one:

- **PascalCase** for React component files (`.tsx`) → already the majority
- **kebab-case** for non-component utility files (`.ts`) → `profile-mapper.ts`, `token-refresh.ts`
- This matches the Next.js community convention

### 🔴 3.2 Folder Naming — Mixed Casing

| Convention     | Folders | Examples                                                           |
| -------------- | ------- | ------------------------------------------------------------------ |
| **PascalCase** | 1       | `components/DiscoverTalent/`                                       |
| **kebab-case** | Most    | `components/profile-email/`, `lib/mock-data/`, `lib/page-utils/`   |
| **lowercase**  | Some    | `components/talent/`, `components/employer/`, `components/mentor/` |

**Recommendation:** Use **kebab-case** for all folders (except `components/ui/` which is shadcn convention). `DiscoverTalent/` → `discover-talent/`.

### 🟡 3.3 Hook File Extensions — Mixed `.ts` vs `.tsx`

Hooks that don't return JSX should use `.ts`, not `.tsx`:

| File                       | Has JSX? | Should Be                 |
| -------------------------- | -------- | ------------------------- |
| `useIsMobile.tsx`          | ❌ No    | `useIsMobile.ts`          |
| `useIsTablet.tsx`          | ❌ No    | `useIsTablet.ts`          |
| `useOrientation.tsx`       | ❌ No    | `useOrientation.ts`       |
| `useOrientationState.tsx`  | ❌ No    | `useOrientationState.ts`  |
| `useMobileInputScroll.tsx` | ❌ No    | `useMobileInputScroll.ts` |
| `useBreakpoint.tsx`        | ❌ No    | `useBreakpoint.ts`        |
| `useSwipeGesture.tsx`      | ❌ No    | `useSwipeGesture.ts`      |
| `useTextScaling.tsx`       | ❌ No    | `useTextScaling.ts`       |

### 🟡 3.4 Component Export Style — Mixed

Some components use `export default`, others use named exports:

```tsx
// Pattern A (some pages, not-found.tsx):
const NotFound = () => { ... };
export default NotFound;

// Pattern B (most components):
export function Button({ ... }) { ... }

// Pattern C (layout.tsx):
export default function RootLayout({ ... }) { ... }
```

**Recommendation:** Use `export default function` for Next.js pages/layouts (required by Next.js), and **named exports** for everything else. Be consistent.

### 🟡 3.5 API Function Style — Mixed Arrow vs Declaration

```ts
// lib/api/talent/index.ts — function declarations:
export async function getCurrentProfile(): Promise<TalentProfile> { ... }

// lib/api/opportunities/index.ts — arrow functions:
export const getOpportunities = async (params?: GetOpportunitiesParams): Promise<...> => { ... }
```

Both files are API service layers doing the same job but use different styles.

**Recommendation:** Pick one. Function declarations are slightly preferred (hoisting, stack traces). The talent API already uses them — standardise.

---

## 4. Type Safety Issues

### 🔴 4.1 Excessive `any` Usage

The codebase has `@typescript-eslint/no-explicit-any` turned **off**. While this was pragmatic, there are high-impact places where `any` hides real bugs:

| Location                                                                               | Issue                                   |
| -------------------------------------------------------------------------------------- | --------------------------------------- |
| `lib/api/index.ts` — `(error as any).status`, `(error as any).isRateLimit`             | Error object is cast to `any` ~10 times |
| `lib/profileMapper.ts` — `mapAPIToUI(apiData: ... \| any)`                             | Accepts literally anything              |
| `lib/api/auth-service.ts` — `getActiveSessions(): Promise<any[]>`                      | Return type is untyped                  |
| `app/(business)/profile-provider.tsx` — `stats: Record<string, DashboardStats \| any>` | Defeats the purpose of the generic      |
| `lib/utils.ts` — `decodeJwt` returns `any`                                             | Should return a typed payload           |
| `components/Providers.tsx` — `localStoragePersister: any`                              | Can be typed                            |

**Recommendation:** Create a typed `ApiError` class instead of casting `Error` to `any`:

```ts
// lib/api/errors.ts
export class ApiError extends Error {
  status: number;
  data?: unknown;
  isRateLimit?: boolean;
  isRoleMismatch?: boolean;
  retryAfter?: number;
  actualRole?: string;
  requiredRole?: string;

  constructor(message: string, status: number, data?: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}
```

### 🔴 4.2 Duplicate Type Definitions

There are **two separate type locations** for the same domain concepts:

| Domain       | `lib/types/`                                                | `lib/api/*/types.ts`             | Conflict?                       |
| ------------ | ----------------------------------------------------------- | -------------------------------- | ------------------------------- |
| Opportunity  | `lib/types/opportunity.ts` AND `lib/types/opportunities.ts` | `lib/api/opportunities/types.ts` | ⚠️ YES — 3 files for one domain |
| Application  | `lib/types/application.ts`                                  | `lib/api/types/application.ts`   | ⚠️ YES — 2 files                |
| Talent       | `lib/types/talent.ts` + `lib/types/profile.ts`              | `lib/api/talent/types.ts`        | ⚠️ YES                          |
| Mentor       | `lib/types/mentor.ts`                                       | `lib/api/mentor/types.ts`        | ⚠️ YES                          |
| Notification | `lib/types/notification.ts`                                 | `lib/api/types/notification.ts`  | ⚠️ YES                          |

There's also `lib/api/types/` which is a **third** location for types.

**Recommendation:** Single source of truth:

- **API response/request types** → `lib/api/<domain>/types.ts` (these are the "real" shapes)
- **UI-specific types** → `lib/types/` (only for types the API layer doesn't need)
- Delete `lib/api/types/` folder — merge into domain folders
- `lib/types/opportunity.ts` and `lib/types/opportunities.ts` should be merged

---

## 5. Code Duplication

### 🔴 5.1 JWT Decode — Implemented Twice

The exact same JWT decoding logic exists in **two files**:

```
lib/auth.ts     → decodeToken()
lib/utils.ts    → decodeJwt()
```

Both have identical base64 decoding logic. `decodeJwt` also checks expiry (which `decodeToken` + `isTokenExpired` do separately).

**Recommendation:** Delete `decodeJwt` from `lib/utils.ts`. Use `decodeToken` + `isTokenExpired` from `lib/auth.ts` everywhere.

### 🟡 5.2 Cookie Utilities — Scattered

Cookie operations are in `lib/utils.ts` (`getCookie`, `setCookie`, `deleteCookie`) but also done inline in:

- `lib/api/index.ts` (direct `document.cookie` manipulation)
- `components/GlobalErrorHandler.tsx` (direct `document.cookie`)
- `app/(business)/profile-provider.tsx` (direct `document.cookie`)

**Recommendation:** Always use the utilities from `lib/utils.ts`. Or move them to `lib/auth.ts` since they're only used for auth cookies.

### 🟡 5.3 Auth Cleanup — Repeated 3 Times

This exact pattern appears **3 times** in `lib/api/index.ts`:

```ts
localStorage.removeItem("activeRole");
localStorage.removeItem("userRoles");
document.cookie = "activeRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
window.location.href = "/login";
```

**Recommendation:** Extract to a `forceLogout()` function in `lib/auth.ts`.

### 🟡 5.4 Query Params Building — Repeated Pattern

Three functions in `lib/api/opportunities/index.ts` build query strings identically:

```ts
const query = new URLSearchParams();
if (params) {
  for (const key in params) {
    const value = params[key as keyof GetOpportunitiesParams];
    if (value !== undefined && value !== null) {
      query.append(key, String(value));
    }
  }
}
```

**Recommendation:** Extract a `buildQueryString(params)` utility.

---

## 6. File Organisation Problems

### 🔴 6.1 Loose Files in `lib/` Root

Several files in `lib/` should be in subdirectories:

| File                   | Should Move To                                                                                                                                                    |
| ---------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `lib/auth.ts`          | `lib/auth/tokens.ts` (alongside `lib/auth/role-routes.ts`)                                                                                                        |
| `lib/auth.test.ts`     | `lib/auth/tokens.test.ts`                                                                                                                                         |
| `lib/profileMapper.ts` | `lib/mappers/profile.ts` (alongside `lib/mappers/application.ts`)                                                                                                 |
| `lib/token-refresh.ts` | `lib/auth/token-refresh.ts`                                                                                                                                       |
| `lib/device.ts`        | `lib/auth/device.ts` or `lib/utils/device.ts`                                                                                                                     |
| `lib/utils.ts`         | Keep (it's the shadcn utility) but move `decodeJwt`, `getCookie`, `setCookie`, `deleteCookie`, `formatDateForDisplay`, `formatDuration` to appropriate subfolders |
| `lib/utils.spec.ts`    | `lib/utils/utils.spec.ts` or colocate                                                                                                                             |
| `lib/test-utils.tsx`   | Already in the right place                                                                                                                                        |

### 🔴 6.2 `lib/utils.ts` Is a Dumping Ground

This file currently contains **6 unrelated functions**:

1. `cn()` — Tailwind class merging (shadcn standard)
2. `decodeJwt()` — JWT decoding (duplicate of `lib/auth.ts`)
3. `getCookie()` — Cookie reading
4. `setCookie()` — Cookie writing
5. `deleteCookie()` — Cookie deletion
6. `formatDateForDisplay()` — Date formatting
7. `formatDuration()` — ISO duration formatting

**Recommendation:** Keep only `cn()` in `lib/utils.ts` (shadcn convention). Move everything else:

- JWT → delete (duplicate)
- Cookie utils → `lib/auth/cookies.ts`
- Date formatters → `lib/utils/date.ts`

### 🟡 6.3 Stale/Orphan Files

| File/Folder                     | Issue                                            |
| ------------------------------- | ------------------------------------------------ |
| `temp_talent_opp.txt`           | Temp file in project root                        |
| `API_TEST_RESULTS.json`         | Test results committed to repo                   |
| `admin-frontend`                | Empty or stale file in project root              |
| `-p/`                           | Mystery directory in project root                |
| `lib/mock-data/`                | 4 mock data files — are they used in production? |
| `components/ui/error-state.md`  | Markdown doc inside component folder             |
| `components/ui/search-input.md` | Markdown doc inside component folder             |
| `app/(business)/debug/`         | Debug route — should not ship to production      |
| `components/settings/`          | Contains only 1 test file — misplaced?           |

### 🟡 6.4 Example Files Mixed with Production Code

There are `*.example.tsx` files scattered inside component folders:

```
components/ui/HideOnMobile.example.tsx
components/ui/ShowOnMobile.example.tsx
components/ui/ResponsiveGrid.example.tsx
components/ui/MobileTableCard.example.tsx
components/ui/SwipeableModal.example.tsx
components/ui/VirtualScrollList.example.tsx
components/ui/TouchFriendlyTooltip.example.tsx
components/ui/ResponsiveTable.example.tsx
components/ui/ResponsiveFormField.example.tsx
components/navigation/MobileDrawer.example.tsx
components/navigation/MobileNavigation.example.tsx
components/navigation/HamburgerMenuButton.example.tsx
components/mentor/sessions/SessionCard.example.tsx
components/employer/opportunities/OpportunitiesTable.example.tsx
```

**Recommendation:** Move all `*.example.tsx` to a `docs/examples/` or `stories/` directory — or use Storybook. They add noise when browsing production components.

### 🟡 6.5 Test Files Not Consistently Colocated

Tests are in **three different locations**:

1. Colocated next to source: `components/ui/button.test.tsx`, `hooks/useBreakpoint.test.tsx` ✅
2. Separate `tests/` folder: `tests/visual-regression/` ✅ (makes sense for visual tests)
3. In `lib/`: `lib/auth.test.ts`, `lib/utils.spec.ts` — note `.test.ts` vs `.spec.ts` inconsistency

**Recommendation:** Standardise on `.test.ts(x)` (already the majority). Rename `lib/utils.spec.ts` → `lib/utils.test.ts`.

---

## 7. API Layer Audit

### ✅ What's Good

- Centralised `apiClient` with automatic token refresh and retry queue
- Consistent pattern: domain folder → `index.ts` (functions) + `types.ts` (types)
- JSDoc comments on every API function with HTTP method and endpoint
- Server-side client separated from client-side client

### 🔴 7.1 `lib/api/auth-service.ts` vs `lib/api/auth/`

There are **two** auth API locations:

- `lib/api/auth-service.ts` (actual auth functions — login, register, etc.)
- `lib/api/auth/index.ts` + `lib/api/auth/types.ts` (what's in here?)

**Recommendation:** Merge `auth-service.ts` into `lib/api/auth/index.ts` for consistency with other domains.

### 🟡 7.2 Inconsistent Re-exports in `lib/api/index.ts`

The barrel file uses `export *` for some modules and selective exports for others:

```ts
// Wildcard (simple):
export * from "./opportunities";
export * from "./talent";

// Selective (to avoid conflicts):
export { browseTalents, getTalentProfile as getPublicTalentProfile, ... } from "./public/talents";
```

This is fine for avoiding conflicts, but the mix of patterns makes it hard to know what's available.

### 🟡 7.3 Duplicate `type` Export Blocks in `lib/api/talent/index.ts`

There are **two** `export type { ... }` blocks at lines 484-500 and 594-610. The second re-exports dashboard types. These should be consolidated or the file split.

### 🟡 7.4 Base URL Inconsistency

```ts
// lib/api/index.ts:
const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL || "http://localhost:3001";

// lib/api/server-client.ts:
const baseUrl =
  process.env.NEXT_PUBLIC_TALENTNG_API_URL ||
  (process.env.NODE_ENV === "production"
    ? "https://api.talentng.com"
    : "http://localhost:3001/api/v1"); // Note: includes /api/v1 here but not above
```

The fallback URLs are inconsistent — one includes `/api/v1`, the other doesn't.

---

## 8. Hooks Audit

### ✅ What's Good

- Excellent barrel file (`hooks/index.ts`) with JSDoc for every export
- Clear separation: auth hooks, API hooks, UI hooks, utility hooks
- Consistent use of React Query for data fetching
- Proper cache invalidation patterns in mutation hooks

### 🔴 8.1 `hooks/useAuth.ts` — Always-True Guard

```ts
const hasToken = true; // Always attempt to fetch, cookies will determine auth
```

The comment explains the intent but `hasToken` is misleading — it's always `true` and used as `enabled: hasToken`. This should just be `enabled: true` or removed.

### 🟡 8.2 `useProfile` Imports Provider Context Directly

```ts
// hooks/useProfile.ts
import { ProfileContext } from "@/app/(business)/profile-provider";
```

A hook in `hooks/` reaches into `app/(business)/` for a context. The context should be in `lib/` or the hook should be colocated with the provider.

### 🟡 8.3 Some Hooks Not in Barrel File

These hooks exist but are **not exported** from `hooks/index.ts`:

- `useAvailabilityPrefetch`
- `useBusinessVerification`
- `useMobileInputScroll`
- `useBreakpoint`
- `useIsTablet`
- `useIsTouchDevice`
- `useOrientation`
- `useOrientationState`
- `useSwipeGesture`
- `useTabletKeyboardNavigation`
- `useTextScaling`
- `useRequireRole`
- `useUnsavedChangesWarning`

Either add them to the barrel or document why they're excluded.

---

## 9. Component Architecture Audit

### ✅ What's Good

- Clean role-based sidebar system (TalentSidebar, RecruiterSidebar, MentorSidebar)
- Shared UI components in `components/ui/`
- Good use of compound layouts (`layout.tsx` → `layout-client.tsx` → `profile-provider.tsx`)
- Skeleton loading components for each major view
- Error boundary components per route group
- Lazy loading setup in `components/lazy/`

### 🔴 9.1 `app/page.tsx` — 1160-Line Landing Page

The landing page is a **single 1160-line file** with:

- 6 inline SVG icon components
- Hardcoded data arrays (talents, FAQs, footer links, etc.)
- All sections inlined

**Recommendation:** Break into:

- `components/landing/HeroSection.tsx`
- `components/landing/PainPointsSection.tsx`
- `components/landing/RolesSection.tsx`
- `components/landing/HowItWorksSection.tsx`
- `components/landing/DiscoverSection.tsx`
- `components/landing/FAQSection.tsx`
- `components/landing/CTASection.tsx`
- `components/landing/Footer.tsx`
- `components/landing/icons.tsx` (SVG icons)
- `lib/data/landing.ts` (static data)

### 🟡 9.2 Naming: "employer" vs "recruiter"

The codebase uses **both** terms interchangeably:

| Location                                              | Term Used                           |
| ----------------------------------------------------- | ----------------------------------- |
| `components/employer/`                                | "employer"                          |
| `components/employer/settings/EmployerSettings.tsx`   | "employer"                          |
| `components/employer/dashboard/EmployerDashboard.tsx` | "employer"                          |
| `components/employer/profile/EmployerEditProfile.tsx` | "employer"                          |
| `lib/api/recruiter/`                                  | "recruiter"                         |
| `hooks/useRecruiterDashboard.ts`                      | "recruiter"                         |
| `hooks/useRecruiterApplications.ts`                   | "recruiter"                         |
| Role system                                           | `activeRole === "recruiter"`        |
| Routes                                                | `/recruiter/`, `/employer/` (mixed) |

**This is the single biggest confusion point for a new developer.** The backend uses "recruiter", the role system uses "recruiter", but many frontend components say "employer".

**Recommendation:** Pick one term. Since the backend/API/role system already use "recruiter", rename `components/employer/` → `components/recruiter/` and all `Employer*` component names.

### 🟡 9.3 `not-found.tsx` — Placeholder Text

```tsx
<p className="text-xl text-gray-600 mb-4">NOT IMPLEMENTED YET</p>
<Link href="/profile">GO TO PROFILE PAGE</Link>
```

This is developer-facing text that users could see. Should be a proper 404 page.

---

## 10. Console Logs & Debug Code

### 🔴 10.1 ~70+ Console Statements in Production Components

Found **console.log/error/warn** in production component code. Some are appropriate (`console.error` for caught errors), but many are debug logs:

**Debug logs that should be removed:**

| File                                                    | Statement                                         |
| ------------------------------------------------------- | ------------------------------------------------- |
| `components/employer/dashboard/EmployerDashboard.tsx`   | `console.log("Recruiter Dashboard Data:", data)`  |
| `components/employer/dashboard/WeeklyOverviewChart.tsx` | `console.log("WeeklyOverviewChart - data:", ...)` |
| `components/employer/upcoming/RecruiterUpcoming.tsx`    | `console.log("Interviews API Response:", ...)`    |
| `components/employer/opportunities/ApplicantsTable.tsx` | `console.log("View profile:", applicant.id)`      |
| `components/layouts/modals/NotificationsModal.tsx`      | `console.log("Dismissing notification:", ...)`    |
| `components/performance/PerformanceMonitor.tsx`         | 7× `console.log(...)`                             |
| `components/performance/MobilePerformanceProvider.tsx`  | 5× `console.log(...)`                             |

**Recommendation:**

- Remove all `console.log` from production code
- Keep `console.error` for genuine error catching
- Consider a logging utility: `lib/utils/logger.ts` that is a no-op in production

### 🟡 10.2 Commented-Out SSE/WebSocket Code

In `app/(business)/layout-client.tsx`, lines 69-105, the entire `useNotificationSocket` call is commented out with:

```ts
// Temporarily disabled - uncomment when notifications API is available
```

**Recommendation:** Remove if not needed soon, or track in a task/issue. Long-lived commented code creates confusion.

---

## 11. CSS/Styling Audit

### ✅ What's Good

- Tailwind CSS with shadcn/UI design system
- CSS variables for theming (HSL color system)
- Brand colors properly defined
- Responsive spacing utilities
- Good mobile-first approach

### 🟡 11.1 Duplicate Scrollbar Utilities

In `tailwind.config.ts`, both `.scrollbar-hidden` and `.scrollbar-hide` are defined with **identical** CSS:

```ts
".scrollbar-hidden": { ... },
".scrollbar-hide": { ... },  // Same thing
```

**Recommendation:** Keep one, remove the other. Search and replace in the codebase.

### 🟡 11.2 Hardcoded Colors in Components

Despite having a design system, many components use hardcoded hex colors:

```tsx
// app/page.tsx:
className = "bg-[#181B25]";
className = "text-[#525866]";
className = "bg-[#5C30FF]";
className = "border-[#E1E4EA]";

// layout-client.tsx:
className = "border-[#E1E4EA]";
```

The gray scale `#525866`, `#E1E4EA` are close to but **not exactly** the grays defined in `tailwind.config.ts` (gray-500 is `#667085`, gray-300 is `#D0D5DD`).

**Recommendation:** Use design tokens: `text-gray-500` instead of `text-[#525866]`. If the brand needs different values, add them to the config.

### 🟡 11.3 Fonts Loaded via CSS @import (Render-Blocking)

```css
@import url("https://fonts.googleapis.com/css2?family=Geist:...");
@import url("https://fonts.googleapis.com/css2?family=Inter:...");
@import url("https://fonts.googleapis.com/css2?family=Inter+Tight:...");
```

CSS `@import` for fonts is render-blocking.

**Recommendation:** Use `next/font` (Next.js built-in font optimization) or `<link rel="preload">` in the layout.

---

## 12. Testing Audit

### ✅ What's Good

- Vitest + Testing Library setup
- Playwright for visual regression
- Property-based testing with `fast-check` (`.pbt.test.ts` files)
- API contract testing script

### 🟡 12.1 Low Test Coverage for Business Logic

Critical paths with **no tests**:

- `lib/api/index.ts` (the core API client — token refresh, error handling)
- `lib/profileMapper.ts` (complex data transformation)
- `hooks/useAuth.ts` (auth flow)
- `hooks/useProfile.ts`
- `middleware.ts` (auth middleware)
- All dashboard hooks

### 🟡 12.2 Mixed Test File Extensions

```
lib/utils.spec.ts    ← uses .spec
lib/auth.test.ts     ← uses .test
```

**Recommendation:** Standardise on `.test.ts(x)`.

---

## 13. Documentation Audit

### 🔴 13.1 Docs Folder Is Overwhelming

The `docs/` folder has **56 markdown files**, many of which are implementation summaries (`*_COMPLETE.md`, `*_SUMMARY.md`, `*_FIX.md`). These read like git commit messages, not documentation.

| Category             | Count | Examples                                                           |
| -------------------- | ----- | ------------------------------------------------------------------ |
| Fix/completion notes | 25+   | `BUTTON_WIDTH_FIX_SUMMARY.md`, `CALENDAR_MIGRATION_COMPLETE.md`    |
| API guides           | 10+   | `FRONTEND_RECRUITER_API_GUIDE.md`, `OPPORTUNITIES_API_CONTRACT.md` |
| Architecture docs    | 5     | `PRODUCT_SPECIFICATION.md`, `DASHBOARD_STYLING_GUIDE.md`           |
| Process docs         | 3     | `agents.md`, `backend-tasks.md`                                    |

**Recommendation:**

- Archive fix/completion summaries — move to `docs/archive/` or delete (this info is in git history)
- Keep only living documentation: API contracts, architecture decisions, setup guides
- Create a `docs/README.md` index

### 🟡 13.2 No README.md

The project has **no root README.md** with:

- Setup instructions
- Environment variables needed
- Architecture overview
- Development workflow

---

## 14. Configuration & Package Audit

### 🔴 14.1 Package Name Is Wrong

```json
"name": "fusion-starter"
```

Should be `"talentng-frontend"` or similar.

### 🟡 14.2 Dependencies vs DevDependencies Misplacement

**React and React DOM are in `devDependencies`:**

```json
"devDependencies": {
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  // ... also react-hook-form, framer-motion, sonner, etc.
}
```

Runtime dependencies like `react`, `react-dom`, `react-hook-form`, `framer-motion`, `sonner`, `date-fns`, `lucide-react`, `recharts`, `@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `next-themes`, `input-otp`, `@tanstack/react-query` should be in `dependencies`, not `devDependencies`.

This works because Next.js bundles everything, but it's **semantically wrong** and confusing for any developer reviewing the package.json.

### 🟡 14.3 ESLint Globals Are Overly Broad

The eslint config manually lists ~60 browser/node globals. This should use `globals` package (already installed):

```js
import globals from "globals";
// ...
globals: { ...globals.browser, ...globals.node }
```

### 🟡 14.4 `prefer-const` Is Off

```js
"prefer-const": "off", // Non-critical
```

`prefer-const` is a readability best practice. Having it off means some variables use `let` when they never get reassigned.

---

## 15. Security Observations

### 🟡 15.1 Tokens in URL Query Parameters

The middleware handles tokens passed via URL (`?accessToken=...&refreshToken=...`). While this is common for OAuth callbacks, the tokens are visible in:

- Browser history
- Server logs
- Referrer headers

The `/redirect` page pattern is the right approach — just ensure tokens are cleared from the URL immediately.

### 🟡 15.2 Mixed Token Storage Strategy

The codebase has evidence of **two** auth strategies:

1. **localStorage tokens** (`lib/auth.ts` — `storeTokens`, `getAccessToken`)
2. **HTTP-only cookies** (comments say "Backend now sends tokens via HTTP-only cookies")

The `auth-service.ts` comment says "no localStorage storage needed" but `handleAuthResponse` still calls `storeTokens()` which writes to localStorage.

**Recommendation:** Document the canonical auth flow and clean up the legacy approach.

---

## 16. Performance Patterns — What's Good ✅

| Pattern                              | Location                                       | Verdict |
| ------------------------------------ | ---------------------------------------------- | ------- |
| Bundle analysis setup                | `next.config.mjs`                              | ✅      |
| Optimised package imports            | `next.config.mjs` — `optimizePackageImports`   | ✅      |
| Vendor chunk splitting               | `next.config.mjs` — webpack `splitChunks`      | ✅      |
| Lazy loading components              | `components/lazy/*.tsx`                        | ✅      |
| Virtual scrolling                    | `components/ui/VirtualScrollList.tsx`          | ✅      |
| React Query caching with persistence | `Providers.tsx`                                | ✅      |
| Debounced search inputs              | `hooks/useDebounce.ts`                         | ✅      |
| Image optimization                   | Using Next.js `Image` component in some places | ✅      |

---

## 17. Actionable Recommendations Summary

### 🔴 High Priority (Readability & Reliability)

| #   | Action                                                                           | Impact                         |
| --- | -------------------------------------------------------------------------------- | ------------------------------ |
| 1   | **Resolve "employer" vs "recruiter" naming** — pick "recruiter" to match backend | Eliminates #1 confusion point  |
| 2   | **Create `ApiError` class** — replace `(error as any).status` pattern            | Type safety for error handling |
| 3   | **Merge duplicate JWT decode** — delete `decodeJwt` from `utils.ts`              | Remove dead code               |
| 4   | **Consolidate type files** — one source per domain                               | Eliminates type conflicts      |
| 5   | **Clean `lib/utils.ts`** — keep only `cn()`, move rest                           | Clear module boundaries        |
| 6   | **Move loose files in `lib/`** — into proper subfolders                          | Navigable folder structure     |
| 7   | **Break up `app/page.tsx`** — extract landing page sections                      | 1160 lines → readable modules  |
| 8   | **Fix `package.json` name** — change from `fusion-starter`                       | Basic project identity         |
| 9   | **Move runtime deps to `dependencies`** — react, radix-ui, etc.                  | Correct npm semantics          |
| 10  | **Clean `docs/` folder** — archive fix summaries, add index                      | Usable documentation           |

### 🟡 Medium Priority (Consistency)

| #   | Action                                                                    | Impact                  |
| --- | ------------------------------------------------------------------------- | ----------------------- |
| 11  | Standardise file naming (PascalCase for components, kebab-case for utils) | Convention clarity      |
| 12  | Standardise API function style (function declarations)                    | Consistent API layer    |
| 13  | Remove `console.log` from production components                           | Clean production output |
| 14  | Fix hook file extensions (`.ts` for non-JSX hooks)                        | Correct tooling signals |
| 15  | Extract `forceLogout()` utility                                           | DRY auth cleanup        |
| 16  | Extract `buildQueryString()` utility                                      | DRY query building      |
| 17  | Add missing hooks to barrel file or document exclusions                   | Discoverable API        |
| 18  | Remove duplicate scrollbar utility                                        | Clean config            |
| 19  | Remove commented-out SSE code or create issue                             | No dead code            |
| 20  | Standardise test extension to `.test.ts(x)`                               | Convention clarity      |

### 🟢 Low Priority (Nice to Have)

| #   | Action                                                                            | Impact                    |
| --- | --------------------------------------------------------------------------------- | ------------------------- |
| 21  | Add root README.md                                                                | Onboarding new devs       |
| 22  | Move `*.example.tsx` files to docs or Storybook                                   | Cleaner component folders |
| 23  | Replace hardcoded hex colors with design tokens                                   | Design system integrity   |
| 24  | Use `next/font` instead of CSS `@import`                                          | Performance improvement   |
| 25  | Enable `prefer-const` lint rule                                                   | Code readability          |
| 26  | Clean up stale root files (`temp_talent_opp.txt`, `API_TEST_RESULTS.json`, `-p/`) | Repo hygiene              |
| 27  | Fix 404 page placeholder text                                                     | User-facing quality       |
| 28  | Simplify ESLint globals with `globals` package                                    | Cleaner config            |
| 29  | Add tests for critical paths (API client, profileMapper, middleware)              | Reliability               |
| 30  | Document canonical auth flow (localStorage vs cookies)                            | Dev understanding         |

---

_End of audit. Address items top-down by priority for maximum impact with minimum effort._

---

## 18. Supplementary Audit Findings (2026-04-08)

**Auditor:** AI Code Review
**Focus:** Additional issues not covered in original audit, with emphasis on React patterns, state management, and architectural concerns.

---

### 🔴 18.1 Missing README.md (Critical)

**Status:** CONFIRMED — No README file exists in project root

**Impact:**

- New developers have zero onboarding documentation
- No setup instructions, environment variable documentation, or architecture overview
- No contribution guidelines or development workflow documentation

**Recommendation:**
Create `README.md` with:

- Project overview and tech stack
- Prerequisites (Node version, package manager)
- Environment variables required (`.env.example`)
- Setup instructions (`npm install`, database setup if any)
- Development commands (`npm run dev`, `npm run build`, `npm test`)
- Project structure overview
- Deployment instructions
- Contributing guidelines

---

### 🔴 18.2 Duplicate JWT Decode Implementation (Confirmed)

**Status:** CONFIRMED — Exact duplicate found

**Locations:**

- `lib/auth.ts` → `decodeToken()` function (lines 58-73)
- `lib/utils.ts` → `decodeJwt()` function (lines 8-35)

**Details:**
Both functions perform identical base64 URL decoding of JWT tokens. The only difference is that `decodeJwt()` includes inline expiry checking, while `decodeToken()` has a separate `isTokenExpired()` function.

**Code Comparison:**

```ts
// lib/auth.ts
export const decodeToken = (token: string): any => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join(""),
    );
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};

// lib/utils.ts - DUPLICATE
export const decodeJwt = (token: string) => {
  try {
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join(""),
    );
    const decoded = JSON.parse(jsonPayload);
    if (decoded.exp * 1000 < Date.now()) {
      console.error("Token expired.");
      return null;
    }
    return decoded;
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null;
  }
};
```

**Recommendation:** Delete `decodeJwt()` from `lib/utils.ts`. Use `decodeToken()` + `isTokenExpired()` from `lib/auth.ts` everywhere.

---

### 🔴 18.3 Package.json Configuration Issues

**Issue 1: Wrong Project Name**

```json
"name": "fusion-starter"  // Should be "talentng-frontend"
```

**Issue 2: React in devDependencies (CRITICAL)**

```json
"devDependencies": {
  "react": "^18.3.1",
  "react-dom": "^18.3.1"
}
```

React and React DOM are **runtime dependencies**, not dev dependencies. While this works in Next.js due to bundling, it's semantically incorrect and could cause issues in:

- Production dependency analysis tools
- Docker multi-stage builds that only install production deps
- Package audits and security scans

**Recommendation:**

1. Change package name to `"talentng-frontend"`
2. Move React and React DOM to `dependencies`

---

### 🔴 18.4 Landing Page Monolith (Confirmed)

**Status:** CONFIRMED — 1112 lines in single file

**File:** `app/page.tsx`

**Breakdown:**

- 6 inline SVG icon components (~150 lines)
- Hardcoded data arrays (~300 lines):
  - `navLinks` (5 items)
  - `painPoints` (3 items with inline SVGs)
  - `roles` (3 items with Builder.io URLs)
  - `howItWorksSteps` (3 items with inline SVGs)
  - `categories` (10 items)
  - `talents` (6 items with Builder.io URLs)
  - `faqs` (5 items)
  - `footerLinks` (3 sections)
- 4 sub-components defined inline (~200 lines)
- Main component with 8 sections (~400 lines)

**Issues:**

- Impossible to test individual sections
- Difficult to maintain and update
- All Builder.io URLs are hardcoded in data
- SVG icons should be in separate files
- Data should be in constants file

**Recommendation:** Split into:

```
components/landing/
  ├── HeroSection.tsx
  ├── ProblemSection.tsx
  ├── RolesSection.tsx
  ├── HowItWorksSection.tsx
  ├── DiscoverSection.tsx
  ├── FAQSection.tsx
  ├── CTASection.tsx
  ├── LandingNavbar.tsx
  ├── LandingFooter.tsx
  └── icons/
      ├── LocationIcon.tsx
      ├── WorkIcon.tsx
      ├── DollarIcon.tsx
      └── PenToolIcon.tsx

lib/data/
  └── landing.ts  // All static data
```

---

### 🔴 18.5 Cookie Utility Duplication

**Status:** Cookie operations scattered across codebase

**Centralized Location:**

- `lib/utils.ts` has `getCookie()`, `setCookie()`, `deleteCookie()`

**Direct `document.cookie` Manipulation Found In:**

1. `lib/api/index.ts` (lines 180-185, 220-225, 260-265)
2. `components/GlobalErrorHandler.tsx` (lines 15, 26)
3. `app/(business)/profile-provider.tsx` (lines 150-155)

**Example of Duplication:**

```ts
// lib/api/index.ts - Direct manipulation
localStorage.removeItem("activeRole");
localStorage.removeItem("userRoles");
document.cookie = "activeRole=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";

// Should use:
import { deleteCookie } from "@/lib/utils";
deleteCookie("activeRole");
```

**Recommendation:**

1. Always use utilities from `lib/utils.ts`
2. Or move cookie utilities to `lib/auth/cookies.ts` since they're primarily for auth
3. Search codebase for `document.cookie` and replace with utility calls

---

### 🟡 18.6 Type Definition Chaos (Expanded Analysis)

**Status:** CONFIRMED — Type definitions scattered across 7+ locations per domain

**Opportunity Type Definitions (6 files):**

1. `lib/types/opportunity.ts` → `interface Opportunity`
2. `lib/types/opportunities.ts` → `interface OpportunityCard`, `type OpportunityType`
3. `lib/api/types/opportunity.ts` → `interface Opportunity`
4. `lib/api/opportunities/types.ts` → `interface Opportunity`, `type OpportunityType`
5. `lib/api/applications/types.ts` → `interface Opportunity` (different shape!)
6. `lib/mock-data/opportunities-detail.ts` → `interface OpportunityPublicData`
7. `components/talent/opportunities/types.ts` → `type Opportunity` (alias)

**Application Type Definitions (4 files):**

1. `lib/types/application.ts` → `interface Application`
2. `lib/api/types/application.ts` → `interface Application`
3. `lib/api/applications/types.ts` → `interface Application`
4. `lib/api/talent/dashboard-types.ts` → `type ApplicationStatus`

**User Type Definitions (3 files):**

1. `lib/types/auth.ts` → `type User`
2. `lib/api/users/types.ts` → `interface UsernameAvailability`
3. `lib/api/applications/types.ts` → `interface User` (different shape!)

**ProfileData Type Definitions (3 files with conflicting structures):**

1. `lib/types/onboarding.ts` → `interface ProfileData`
2. `lib/types/business.ts` → `interface ProfileData`
3. Multiple API type files

**Impact:**

- Import confusion: Which `Opportunity` type should I use?
- Type conflicts: Same name, different shapes
- Maintenance burden: Update in 6 places
- TypeScript errors when types don't align

**Recommendation:**
Create single source of truth:

```
lib/api/
  ├── opportunities/
  │   ├── index.ts
  │   └── types.ts  ← ONLY place for Opportunity types
  ├── applications/
  │   ├── index.ts
  │   └── types.ts  ← ONLY place for Application types
  └── users/
      ├── index.ts
      └── types.ts  ← ONLY place for User types

lib/types/  ← Only for UI-specific types that API doesn't need
```

Delete `lib/api/types/` folder entirely and merge into domain folders.

---

### 🟡 18.7 useEffect Dependency Issues

**Status:** Found 50+ useEffect calls with potential issues

**Pattern 1: Missing Dependencies**

```tsx
// app/(business)/calendar/page.tsx (line 245)
useEffect(() => {
  fetchData();
}, [fetchData]); // fetchData is recreated on every render!
```

**Pattern 2: Overly Broad Dependencies**

```tsx
// components/talent/profile/TalentProfile.tsx
useEffect(() => {
  setStats(initialStats);
}, [initialStats]); // initialStats is an object, causes re-render on every parent render
```

**Pattern 3: Unnecessary useEffect**

```tsx
// Multiple files
useEffect(() => {
  // Effect logic here if needed
}, [displayItems]); // Empty effect body
```

**Recommendation:**

1. Wrap functions in `useCallback` if used in useEffect dependencies
2. Use `useMemo` for object/array dependencies
3. Remove empty useEffect blocks
4. Enable `react-hooks/exhaustive-deps` ESLint rule

---

### 🟡 18.8 Auth State Management Complexity

**Issue:** `hooks/useAuth.ts` has confusing logic

```ts
// Line 23
const hasToken = true; // Always attempt to fetch, cookies will determine auth

// Line 30
const {
  data: user,
  isLoading: loading,
  refetch: refetchUser,
} = useQuery({
  queryKey: ["user"],
  queryFn: fetchUser,
  staleTime: 0,
  enabled: hasToken, // Always true, so this does nothing
  retry: 1,
});

// Lines 42-48
useEffect(() => {
  if (hasToken && !loading) {
    refetchUser();
  }
}, [hasToken, refetchUser, loading]); // hasToken never changes, refetchUser causes re-renders
```

**Problems:**

1. `hasToken = true` makes the `enabled` flag meaningless
2. useEffect refetches on every render because `refetchUser` changes
3. Comment says "cookies will determine auth" but there's no cookie checking

**Recommendation:**

```ts
// Option 1: Remove hasToken entirely
const {
  data: user,
  isLoading: loading,
  refetch: refetchUser,
} = useQuery({
  queryKey: ["user"],
  queryFn: fetchUser,
  staleTime: 0,
  retry: 1,
});

// Option 2: Actually check for cookies
const hasToken =
  typeof window !== "undefined" && document.cookie.includes("accessToken");
```

---

### 🟡 18.9 Profile Context Over-Engineering

**File:** `app/(business)/profile-provider.tsx` (300+ lines)

**Issues:**

1. **Too Many Responsibilities:**
   - Manages profiles for all 3 roles
   - Manages UI-mapped profile data
   - Manages stats for all roles
   - Handles role switching
   - Handles role mismatch errors
   - Persists cookies
   - Computes derived values

2. **Multiple useEffect Hooks:**
   - Cookie persistence effect (lines 145-160)
   - Runs on every activeRole or profile change
   - Could cause unnecessary re-renders

3. **Complex Computed Values:**

   ```ts
   const currentProfile = useMemo(() => {
     return profiles[activeRole] || null;
   }, [activeRole, profiles]); // Recalculates when profiles object changes
   ```

4. **Type Complexity:**
   ```ts
   profiles: Record<
     string,
     TalentProfile | RecruiterProfile | MentorProfile | null
   >;
   ```

**Recommendation:**

1. Split into smaller contexts:
   - `UserContext` (userId, userRoles)
   - `ActiveRoleContext` (activeRole, switchRole)
   - `ProfileContext` (current profile only)
2. Or use a state management library (Zustand, Jotai)
3. Memoize profile objects to prevent unnecessary recalculations

---

### 🟡 18.10 Inconsistent Error Handling

**Issue:** `GlobalErrorHandler.tsx` only handles role mismatch errors

```tsx
// components/GlobalErrorHandler.tsx
export function GlobalErrorHandler() {
  const queryClient = useQueryClient();
  const { triggerRoleSwitch, setActiveRole } = useProfile();

  useEffect(() => {
    const unsubscribeQuery = queryClient.getQueryCache().subscribe((event) => {
      if (event.type === "updated" && event.action.type === "error") {
        const error = event.action.error as any;
        if (error?.isRoleMismatch) {
          // ONLY handles role mismatch
          // ...
        }
      }
    });
    // ...
  }, [queryClient, triggerRoleSwitch]);

  return null;
}
```

**Problems:**

1. No global error boundary for React errors (component crashes)
2. No handling for network errors
3. No handling for 500 errors
4. No handling for rate limit errors (despite rate limit logic in API client)
5. API errors handled inconsistently across components

**Recommendation:**

1. Add React Error Boundary:

   ```tsx
   // components/ErrorBoundary.tsx
   class ErrorBoundary extends React.Component {
     componentDidCatch(error, errorInfo) {
       // Log to error reporting service
     }
     render() {
       if (this.state.hasError) {
         return <ErrorFallback />;
       }
       return this.props.children;
     }
   }
   ```

2. Expand GlobalErrorHandler to handle all error types
3. Create consistent error handling patterns

---

### 🟢 18.11 Console.log Statements (Confirmed)

**Status:** CONFIRMED — 70+ console statements in production code

**Examples Found:**

- `hooks/useAuth.ts` line 13: `console.error("Failed to fetch user data:", error)`
- `hooks/useAuth.ts` line 54: `console.error("Logout error:", error)`
- `lib/auth.ts` line 62: `console.error("Error decoding token:", error)`
- `lib/utils.ts` line 26: `console.error("Token expired.")`
- `lib/utils.ts` line 30: `console.error("Error decoding JWT:", error)`

**Recommendation:**

1. Remove all `console.log` statements
2. Keep `console.error` for genuine errors (but consider a logging service)
3. Create logging utility:
   ```ts
   // lib/utils/logger.ts
   export const logger = {
     log: (...args: any[]) => {
       if (process.env.NODE_ENV === "development") {
         console.log(...args);
       }
     },
     error: (...args: any[]) => {
       console.error(...args);
       // Send to error tracking service in production
     },
   };
   ```

---

### 🟢 18.12 Builder.io URL Hardcoding

**Issue:** 15+ hardcoded Builder.io URLs in landing page and mock data

**Examples:**

```tsx
// app/page.tsx
images: [
  "https://cdn.builder.io/api/v1/image/assets%2F76c72be1ed81454697472b6c9506a7ce%2Fe0804f84f46e458baf55d4e0894a1000?width=800",
],

// lib/mock-data/talents-detail.ts
images: [
  "https://api.builder.io/api/v1/image/assets/TEMP/d7a73bf68c36125971c3bb78d8c11455bc32bc8d?width=490",
],
```

**Risk:**

- URLs could break if Builder.io account changes
- No centralized management
- Difficult to update in bulk

**Recommendation:**

1. Create constants file:

   ```ts
   // lib/constants/images.ts
   export const BUILDER_IO_IMAGES = {
     HERO_MOCKUP: "https://cdn.builder.io/api/v1/image/assets%2F...",
     TALENT_PORTFOLIO_1: "https://api.builder.io/api/v1/image/assets/TEMP/...",
   };
   ```

2. Or use environment variables for base URL:
   ```
   NEXT_PUBLIC_BUILDER_IO_BASE_URL=https://cdn.builder.io/api/v1/image/assets
   ```

---

### 🟢 18.13 Landing Page Typos

**File:** `app/page.tsx`

**Typos Found:**

1. Line ~467: `"Private Policy"` should be `"Privacy Policy"`
2. Line ~467: `"Terms od Service"` should be `"Terms of Service"`

```tsx
const footerLinks = {
  Platform: ["Opportunities", "Discover Talent", "Mentorship", "Learning Hub"],
  Company: ["About", "Contact", "FAQ"],
  Legal: ["Private Policy", "Terms od Service"], // ← Typos here
};
```

**Recommendation:** Fix typos in footer links data.

---

## 19. Severity Summary (Updated)

| Severity    | Original Count | New Count | Total |
| ----------- | -------------- | --------- | ----- |
| 🔴 Critical | 10             | +5        | 15    |
| 🟡 Medium   | 20             | +5        | 25    |
| 🟢 Low      | 30             | +3        | 33    |

**New Critical Issues:**

1. Missing README.md
2. Duplicate JWT decode (confirmed)
3. Package.json issues (wrong name + React in devDeps)
4. Landing page monolith (confirmed 1112 lines)
5. Cookie utility duplication

**New Medium Issues:**

1. Type definition chaos (expanded analysis with 6+ files per domain)
2. useEffect dependency issues (50+ instances)
3. Auth state management complexity
4. Profile context over-engineering
5. Inconsistent error handling

**New Low Issues:**

1. Console.log statements (confirmed 70+)
2. Builder.io URL hardcoding
3. Landing page typos

---

## 20. Updated Priority Actions

### 🔴 Immediate (This Week)

| #   | Action                                               | Files Affected | Estimated Time |
| --- | ---------------------------------------------------- | -------------- | -------------- |
| 1   | Create README.md with setup instructions             | 1 new file     | 1 hour         |
| 2   | Fix package.json (name + move React to dependencies) | `package.json` | 15 minutes     |
| 3   | Delete duplicate JWT decode from utils.ts            | `lib/utils.ts` | 10 minutes     |
| 4   | Fix landing page typos                               | `app/page.tsx` | 5 minutes      |
| 5   | Consolidate cookie utilities usage                   | 3 files        | 30 minutes     |

**Total: ~2 hours**

### 🟡 Short Term (Next Sprint)

| #   | Action                                                  | Files Affected                | Estimated Time |
| --- | ------------------------------------------------------- | ----------------------------- | -------------- |
| 6   | Split landing page into components                      | `app/page.tsx` + 10 new files | 4 hours        |
| 7   | Consolidate type definitions (Opportunity, Application) | 10+ files                     | 3 hours        |
| 8   | Fix useEffect dependency arrays                         | 20+ files                     | 2 hours        |
| 9   | Simplify auth hook logic                                | `hooks/useAuth.ts`            | 1 hour         |
| 10  | Add global error boundary                               | 2 new files                   | 2 hours        |

**Total: ~12 hours**

### 🟢 Medium Term (Next Month)

| #   | Action                             | Files Affected                        | Estimated Time |
| --- | ---------------------------------- | ------------------------------------- | -------------- |
| 11  | Refactor profile context           | `app/(business)/profile-provider.tsx` | 4 hours        |
| 12  | Remove console.log statements      | 30+ files                             | 2 hours        |
| 13  | Centralize Builder.io URLs         | 5 files                               | 1 hour         |
| 14  | Improve error handling consistency | 10+ files                             | 3 hours        |
| 15  | Add tests for critical paths       | 5 new test files                      | 8 hours        |

**Total: ~18 hours**

---

## 21. Positive Findings (Supplementary)

**Additional things the codebase does well:**

1. **Property-Based Testing:** Uses `fast-check` for PBT (`.pbt.test.ts` files) — advanced testing approach
2. **API Contract Testing:** Has dedicated script for API contract validation
3. **Mobile-First Design:** Comprehensive mobile hooks and utilities
4. **Performance Monitoring:** Has performance monitoring components
5. **Lazy Loading:** Proper code splitting with lazy loading setup
6. **React Query:** Excellent use of caching and background refetching
7. **Type Safety:** Despite `any` usage, most of the codebase is properly typed
8. **Accessibility:** Skip navigation, ARIA labels, keyboard navigation support
9. **Role-Based Architecture:** Clean separation of concerns by user role
10. **Modern Stack:** Next.js 16, React 18, TypeScript, Tailwind — all current best practices

---

## 22. Conclusion

The supplementary audit confirms the original assessment: **solid foundation (7/10) with consistency issues**. The codebase is production-ready but would benefit from:

1. **Documentation** (README, architecture docs)
2. **Consistency** (naming, types, error handling)
3. **Refactoring** (landing page, profile context, type consolidation)
4. **Cleanup** (console.logs, duplicates, typos)

The good news: Most issues are **cosmetic or organizational**, not architectural. The core patterns (React Query, route groups, API client, role system) are sound. Focus on the 🔴 critical items first for maximum impact.

**Estimated Total Remediation Time:** ~32 hours (2 weeks for 1 developer)

---

_Supplementary audit completed 2026-04-08. Combined with original audit for comprehensive codebase assessment._
