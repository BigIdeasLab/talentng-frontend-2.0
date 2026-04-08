# TalentNG Frontend — Remediation Plan

**Created:** 2026-04-08
**Source:** `docs/CODE_AUDIT.md`
**Estimated Total:** ~32 hours

---

## How to Use This Plan

Each **Phase** is ordered by priority and designed to be completed in sequence. Within each phase, **Groups** bundle related tasks that should be done together. Each task has a checkbox for tracking.

---

## Phase 1 — Quick Wins (< 2 hours)

_Zero-risk fixes that can be shipped immediately. No refactoring, no moving files._

### Group 1A: Typos & Identity Fixes

| #       | Task                                                                                          | File(s)             | Est. |
| ------- | --------------------------------------------------------------------------------------------- | ------------------- | ---- |
| - [x] 1 | Fix `"Private Policy"` → `"Privacy Policy"`                                                   | `app/page.tsx`      | ✅   |
| - [x] 2 | Fix `"Terms od Service"` → `"Terms of Service"`                                               | `app/page.tsx`      | ✅   |
| - [x] 3 | Change package name `"fusion-starter"` → `"talentng-frontend"`                                | `package.json`      | ✅   |
| - [x] 4 | Fix `not-found.tsx` placeholder text (`"NOT IMPLEMENTED YET"`) — replace with proper 404 copy | `app/not-found.tsx` | ✅   |

### Group 1B: Dependency Placement

| #       | Task                                                                                                                                                                                                                                                                              | File(s)        | Est. |
| ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------- | ---- |
| - [x] 5 | Move `react`, `react-dom`, `react-hook-form`, `framer-motion`, `sonner`, `date-fns`, `lucide-react`, `recharts`, `@radix-ui/*`, `class-variance-authority`, `clsx`, `tailwind-merge`, `next-themes`, `input-otp`, `@tanstack/react-query` from `devDependencies` → `dependencies` | `package.json` | ✅   |

### Group 1C: Dead Code & Stale Files

| #        | Task                                                                                                                                          | File(s)                            | Est.       |
| -------- | --------------------------------------------------------------------------------------------------------------------------------------------- | ---------------------------------- | ---------- |
| - [x] 6  | Delete `temp_talent_opp.txt`                                                                                                                  | project root                       | ✅         |
| - [x] 7  | Delete `API_TEST_RESULTS.json`                                                                                                                | project root                       | ✅         |
| - [x] 8  | Delete `-p/` directory                                                                                                                        | project root                       | ✅         |
| - [x] 9  | Investigate `admin-frontend` file — delete if empty/stale                                                                                     | project root                       | ✅ (empty) |
| - [x] 10 | Remove commented-out SSE/WebSocket code in `layout-client.tsx` (lines 69–105), or create a GitLab issue and add a `// TODO(#issue)` reference | `app/(business)/layout-client.tsx` | ✅ (TODO)  |

### Group 1D: Duplicate JWT Decode

| #        | Task                                                                                                 | File(s)              | Est.        |
| -------- | ---------------------------------------------------------------------------------------------------- | -------------------- | ----------- |
| - [x] 11 | Delete `decodeJwt()` from `lib/utils.ts`                                                             | `lib/utils.ts`       | ✅          |
| - [x] 12 | Find all imports of `decodeJwt` and replace with `decodeToken` + `isTokenExpired` from `lib/auth.ts` | grep across codebase | ✅ (unused) |

**Phase 1 Commit:** `chore: quick-win fixes — typos, package identity, dead code, duplicate JWT`

---

## Phase 2 — Auth & Cookie Consolidation (~ 1.5 hours)

_Eliminate duplicated auth patterns. No folder restructuring yet._

### Group 2A: Create `forceLogout()` Utility

**Context:** The pattern `localStorage.removeItem("activeRole"); localStorage.removeItem("userRoles"); document.cookie = "activeRole=...expired"; window.location.href = "/login"` is repeated 3 times in `lib/api/index.ts`.

| #        | Task                                                                                                        | File(s)            | Est. |
| -------- | ----------------------------------------------------------------------------------------------------------- | ------------------ | ---- |
| - [x] 13 | Create `forceLogout()` function in `lib/auth.ts` that clears localStorage + cookies + redirects to `/login` | `lib/auth.ts`      | ✅   |
| - [x] 14 | Replace all 3 inline occurrences in `lib/api/index.ts` with `forceLogout()`                                 | `lib/api/index.ts` | ✅   |

### Group 2B: Consolidate Cookie Utilities

**Context:** `lib/utils.ts` has `getCookie`, `setCookie`, `deleteCookie` but 3 files bypass them with raw `document.cookie`.

| #        | Task                                                                                                     | File(s)                               | Est. |
| -------- | -------------------------------------------------------------------------------------------------------- | ------------------------------------- | ---- |
| - [x] 15 | Replace direct `document.cookie` reads/writes in `lib/api/index.ts` with `setCookie` from `lib/utils.ts` | `lib/api/index.ts`                    | ✅   |
| - [x] 16 | Replace direct `document.cookie` in `components/GlobalErrorHandler.tsx`                                  | `components/GlobalErrorHandler.tsx`   | ✅   |
| - [x] 17 | Replace direct `document.cookie` in `app/(business)/profile-provider.tsx`                                | `app/(business)/profile-provider.tsx` | ✅   |

### Group 2C: Fix `useAuth` Hook

**Context:** `hasToken = true` is always true — the `enabled` flag and useEffect are misleading.

| #        | Task                                                                                                                     | File(s)            | Est. |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | ------------------ | ---- |
| - [x] 18 | Remove `hasToken` constant; removed `enabled` entirely                                                                   | `hooks/useAuth.ts` | ✅   |
| - [x] 19 | Remove the useEffect that re-fetches based on `hasToken` — it fired every render because `refetchUser` reference changes | `hooks/useAuth.ts` | ✅   |
| - [ ] 20 | Verify auth flow still works (login → dashboard → refresh)                                                               | Manual testing     | ⏳   |

**Phase 2 Commit:** `refactor: consolidate auth utilities — forceLogout, cookie utils, useAuth cleanup`

---

## Phase 3 — `lib/utils.ts` Cleanup & File Organisation (~ 2 hours)

_Clean the utility dumping ground and move loose files into proper subfolders._

### Group 3A: Split `lib/utils.ts`

**Context:** `lib/utils.ts` has 7 unrelated functions. Only `cn()` belongs there (shadcn convention).

| #        | Task                                                                             | File(s)                                | Est. |
| -------- | -------------------------------------------------------------------------------- | -------------------------------------- | ---- |
| - [x] 21 | Move `getCookie`, `setCookie`, `deleteCookie` → `lib/auth/cookies.ts` (new file) | `lib/utils.ts` → `lib/auth/cookies.ts` | ✅   |
| - [x] 22 | `formatDateForDisplay`, `formatDuration` were unused — removed                   | `lib/utils.ts`                         | ✅   |
| - [x] 23 | Re-export cookie utils from `lib/utils.ts` for backwards compatibility           | `lib/utils.ts`                         | ✅   |
| - [x] 24 | `lib/utils.ts` now only exports `cn()` + re-exports cookie utils                 | `lib/utils.ts`                         | ✅   |

### Group 3B: Organise Loose `lib/` Files

| #        | Task                                                                      | File(s)                | Est. |
| -------- | ------------------------------------------------------------------------- | ---------------------- | ---- |
| - [x] 25 | Move `lib/auth.ts` → `lib/auth/tokens.ts` (old file re-exports)           | done + re-export shim  | ✅   |
| - [x] 26 | Move `lib/auth.test.ts` → `lib/auth/tokens.test.ts`                       | renamed + fixed import | ✅   |
| - [x] 27 | Move `lib/token-refresh.ts` → `lib/auth/token-refresh.ts`                 | done + re-export shim  | ✅   |
| - [x] 28 | Move `lib/device.ts` → `lib/auth/device.ts`                               | done + re-export shim  | ✅   |
| - [x] 29 | Move `lib/profileMapper.ts` → `lib/mappers/profile.ts`                    | done + re-export shim  | ✅   |
| - [x] 30 | Rename `lib/utils.spec.ts` → `lib/utils.test.ts` (standardise on `.test`) | renamed                | ✅   |

### Group 3C: Extract `buildQueryString()` Utility

| #        | Task                                                                            | File(s)                          | Est. |
| -------- | ------------------------------------------------------------------------------- | -------------------------------- | ---- |
| - [x] 31 | Create `buildQueryString(params)` in `lib/utils/query.ts`                       | new file                         | ✅   |
| - [x] 32 | Replace 3 repeated `URLSearchParams` blocks in `lib/api/opportunities/index.ts` | `lib/api/opportunities/index.ts` | ✅   |

**Phase 3 Commit:** `refactor: reorganise lib/ — split utils, move loose files, add buildQueryString`

---

## Phase 4 — Type Consolidation (~ 3 hours)

_Single source of truth for every domain type. This is the highest-complexity phase._

### Group 4A: Audit Current State

| #        | Task                                                                                                    | File(s)       | Est. |
| -------- | ------------------------------------------------------------------------------------------------------- | ------------- | ---- |
| - [x] 33 | Map every `interface Opportunity` / `type Opportunity` across the codebase — note which fields each has | investigation | ✅   |
| - [x] 34 | Map every `interface Application` / `type Application`                                                  | investigation | ✅   |
| - [x] 35 | Map every `interface User` / `type User`                                                                | investigation | ✅   |

### Group 4B: Consolidate Opportunity Types

**Rule:** API response types live in `lib/api/<domain>/types.ts`. UI-only types live in `lib/types/`.

| #        | Task                                                                                                                     | File(s)        | Est.                                               |
| -------- | ------------------------------------------------------------------------------------------------------------------------ | -------------- | -------------------------------------------------- |
| - [x] 36 | Merge `lib/types/opportunity.ts` + `lib/types/opportunities.ts` into a single `lib/types/opportunity.ts` (UI types only) | 2 files → 1    | ✅ (deleted opportunity.ts, kept opportunities.ts) |
| - [x] 37 | Delete `lib/api/types/opportunity.ts` — merge its definitions into `lib/api/opportunities/types.ts`                      | delete + merge | ✅ (entire lib/api/types deleted)                  |
| - [x] 38 | Update `components/talent/opportunities/types.ts` to re-export from canonical location (or delete if redundant)          | 1 file         | ✅ (kept as is - local types)                      |
| - [x] 39 | Update all imports codebase-wide                                                                                         | grep + update  | ✅ (no imports found)                              |

### Group 4C: Consolidate Application & User Types

| #        | Task                                                                                                 | File(s)        | Est.                                    |
| -------- | ---------------------------------------------------------------------------------------------------- | -------------- | --------------------------------------- |
| - [x] 40 | Delete `lib/api/types/application.ts` — merge into `lib/api/applications/types.ts`                   | delete + merge | ✅ (entire lib/api/types deleted)       |
| - [x] 41 | Reconcile `lib/types/application.ts` with `lib/api/applications/types.ts` — keep one canonical shape | 2 files        | ✅ (deleted lib/types/application.ts)   |
| - [x] 42 | Reconcile `lib/types/auth.ts` User type with `lib/api/applications/types.ts` User type               | 2 files        | ✅ (kept separate - different purposes) |
| - [x] 43 | Update all imports codebase-wide                                                                     | grep + update  | ✅ (no imports found)                   |

### Group 4D: Delete `lib/api/types/` Folder

| #        | Task                                                                  | File(s)            | Est.          |
| -------- | --------------------------------------------------------------------- | ------------------ | ------------- |
| - [x] 44 | Ensure everything from `lib/api/types/` is merged into domain folders | verify             | ✅            |
| - [x] 45 | Delete `lib/api/types/` directory                                     | delete             | ✅            |
| - [x] 46 | Run TypeScript compiler — fix any broken imports                      | `npx tsc --noEmit` | ✅ (0 errors) |

**Phase 4 Commit:** `refactor: consolidate type definitions — single source of truth per domain`

---

## Phase 5 — API Layer Cleanup (~ 1.5 hours)

### Group 5A: Merge Auth Service

**Context:** Auth API is split between `lib/api/auth-service.ts` and `lib/api/auth/index.ts`.

| #        | Task                                                                           | File(s)       | Est. |
| -------- | ------------------------------------------------------------------------------ | ------------- | ---- |
| - [x] 47 | Move all functions from `lib/api/auth-service.ts` into `lib/api/auth/index.ts` | 2 files → 1   | ✅   |
| - [x] 48 | Delete `lib/api/auth-service.ts`                                               | delete        | ✅   |
| - [x] 49 | Update all imports                                                             | grep + update | ✅   |

### Group 5B: Create `ApiError` Class

**Context:** Error handling casts `(error as any).status` ~10 times in `lib/api/index.ts`.

| #        | Task                                                                                                                                                           | File(s)            | Est. |
| -------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------ | ---- |
| - [x] 50 | Create `lib/api/errors.ts` with typed `ApiError` class (fields: `status`, `data`, `isRateLimit`, `isRoleMismatch`, `retryAfter`, `actualRole`, `requiredRole`) | new file           | ✅   |
| - [x] 51 | Update `lib/api/index.ts` to throw `ApiError` instead of setting `any` properties on `Error`                                                                   | `lib/api/index.ts` | ✅   |
| - [x] 52 | Update `GlobalErrorHandler.tsx` and other error consumers to use `ApiError` type guard                                                                         | 3-5 files          | ✅   |

### Group 5C: Standardise API Function Style

| #        | Task                                                                                                                                       | File(s)                          | Est. |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------- | ---- |
| - [x] 53 | Convert arrow function API exports in `lib/api/opportunities/index.ts` to function declarations (to match `lib/api/talent/index.ts` style) | `lib/api/opportunities/index.ts` | ✅   |
| - [x] 54 | Scan other API files (`lib/api/mentor/`, `lib/api/recruiter/`, `lib/api/applications/`) for arrow functions and convert                    | 3-4 files                        | ✅   |

### Group 5D: Fix Base URL Inconsistency

| #        | Task                                                                                                                                        | File(s) | Est. |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------- | ------- | ---- |
| - [x] 55 | Align fallback URLs in `lib/api/index.ts` and `lib/api/server-client.ts` — both should use the same default (e.g., `http://localhost:3001`) | 2 files | ✅   |

**Phase 5 Commit:** `refactor: API layer — merge auth-service, add ApiError class, standardise style`

---

## Phase 6 — Landing Page Split (~ 4 hours)

_Break the 1112-line monolith into testable, maintainable components._

### Group 6A: Extract Static Data

| #        | Task                                                                                                                                                    | File(s)  | Est. |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ---- |
| - [x] 56 | Create `lib/data/landing.ts` with all data arrays: `navLinks`, `painPoints`, `roles`, `howItWorksSteps`, `categories`, `talents`, `faqs`, `footerLinks` | new file | ✅   |

### Group 6B: Extract SVG Icons

| #        | Task                                                                          | File(s)  | Est. |
| -------- | ----------------------------------------------------------------------------- | -------- | ---- |
| - [x] 57 | Create `components/landing/icons.tsx` — move all 6 inline SVG icon components | new file | ✅   |

### Group 6C: Extract Sections

| #        | Task                                                         | File(s)  | Est. |
| -------- | ------------------------------------------------------------ | -------- | ---- |
| - [x] 58 | Create `components/landing/HeroSection.tsx`                  | new file | ✅   |
| - [x] 59 | Create `components/landing/ProblemSection.tsx` (pain points) | new file | ✅   |
| - [x] 60 | Create `components/landing/RolesSection.tsx`                 | new file | ✅   |
| - [x] 61 | Create `components/landing/HowItWorksSection.tsx`            | new file | ✅   |
| - [x] 62 | Create `components/landing/DiscoverSection.tsx`              | new file | ✅   |
| - [x] 63 | Create `components/landing/FAQSection.tsx`                   | new file | ✅   |
| - [x] 64 | Create `components/landing/CTASection.tsx`                   | new file | ✅   |
| - [x] 65 | Create `components/landing/LandingNavbar.tsx`                | new file | ✅   |
| - [x] 66 | Create `components/landing/LandingFooter.tsx`                | new file | ✅   |

### Group 6D: Simplify `app/page.tsx`

| #        | Task                                                                 | File(s)        | Est. |
| -------- | -------------------------------------------------------------------- | -------------- | ---- |
| - [x] 67 | Rewrite `app/page.tsx` to import and compose sections (~30–50 lines) | `app/page.tsx` | ✅   |
| - [ ] 68 | Visually verify landing page renders identically                     | Manual testing | ⏳   |

**Phase 6 Commit:** `refactor: split landing page into components — 1112 lines → composable sections`

---

## Phase 7 — Naming & Convention Standardisation (~ 3 hours)

### Group 7A: File Naming

| #        | Task                                                                                                                                                                                                    | File(s)       | Est.                 |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------- | -------------------- |
| - [x] 69 | Rename kebab-case `.tsx` component files to PascalCase (e.g., `application-modal.tsx` → `ApplicationModal.tsx`, `opportunity-card.tsx` → `OpportunityCard.tsx`, `search-input.tsx` → `SearchInput.tsx`) | ~15 files     | ✅                   |
| - [x] 70 | Rename camelCase `.ts` utility files to kebab-case (e.g., `profileMapper.ts` → already moved in Phase 3)                                                                                                | verify        | ✅ (done in Phase 3) |
| - [x] 71 | Rename `DiscoverTalent/` folder → `discover-talent/`                                                                                                                                                    | 1 folder      | ✅                   |
| - [x] 72 | Update all imports affected by renames                                                                                                                                                                  | grep + update | ✅                   |

### Group 7B: Hook File Extensions

| #        | Task                                                                                                                                                                                             | File(s)       | Est.   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------- | ------ |
| - [x] 73 | Rename `.tsx` → `.ts` for hooks without JSX: `useIsMobile`, `useIsTablet`, `useOrientation`, `useOrientationState`, `useMobileInputScroll`, `useBreakpoint`, `useSwipeGesture`, `useTextScaling` | 8 files       | ✅ (7 files, useTextScaling kept as .tsx) |
| - [x] 74 | Update all imports                                                                                                                                                                               | grep + update | ✅ (no imports needed updating) |

### Group 7C: Update Hooks Barrel File

| #        | Task                                                                                                                                                                                                                                                                                                                                      | File(s)          | Est.   |
| -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ---------------- | ------ |
| - [x] 75 | Add missing hooks to `hooks/index.ts` barrel: `useAvailabilityPrefetch`, `useBusinessVerification`, `useMobileInputScroll`, `useBreakpoint`, `useIsTablet`, `useIsTouchDevice`, `useOrientation`, `useOrientationState`, `useSwipeGesture`, `useTabletKeyboardNavigation`, `useTextScaling`, `useRequireRole`, `useUnsavedChangesWarning` | `hooks/index.ts` | ✅ |

### Group 7D: Duplicate Scrollbar Utility

| #        | Task                                                                          | File(s)              | Est.   |
| -------- | ----------------------------------------------------------------------------- | -------------------- | ------ |
| - [x] 76 | Remove `.scrollbar-hide` (keep `.scrollbar-hidden`) from `tailwind.config.ts` | `tailwind.config.ts` | ✅ |
| - [x] 77 | Replace all usages of `scrollbar-hide` with `scrollbar-hidden` in templates   | grep + update        | ✅ (31 files) |

**Phase 7 Commit:** `refactor: standardise naming — PascalCase components, kebab-case utils, hook extensions`

---

## Phase 8 — Console Logs & Debug Code (~ 2 hours)

### Group 8A: Remove `console.log` from Production Components

| #        | Task                                                                                                                                                   | File(s)    | Est.   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------ | ---------- | ------ |
| - [ ] 78 | Remove debug `console.log` statements from all components listed in audit section 10.1 (~20 files, 70+ statements)                                     | 20+ files  | 45 min |
| - [ ] 79 | Keep `console.error` for genuine caught errors — review each and decide                                                                                | same files | 15 min |
| - [ ] 80 | Remove `console.log` statements from `components/performance/PerformanceMonitor.tsx` (7 statements) and `MobilePerformanceProvider.tsx` (5 statements) | 2 files    | 10 min |

### Group 8B: Create Dev-Only Logger (Optional)

| #        | Task                                                                                                | File(s)   | Est.   |
| -------- | --------------------------------------------------------------------------------------------------- | --------- | ------ |
| - [ ] 81 | Create `lib/utils/logger.ts` — `logger.log()` is no-op in production, `logger.error()` always fires | new file  | 10 min |
| - [ ] 82 | Replace remaining `console.error` calls with `logger.error()` where appropriate                     | 10+ files | 20 min |

### Group 8C: Remove Debug Route

| #        | Task                                                                     | File(s) | Est.  |
| -------- | ------------------------------------------------------------------------ | ------- | ----- |
| - [ ] 83 | Delete `app/(business)/debug/` directory — should not ship to production | delete  | 2 min |

**Phase 8 Commit:** `chore: remove console.log debug code, add logger utility, delete debug route`

---

## Phase 9 — Docs & Developer Experience (~ 2 hours)

### Group 9A: Create README

| #        | Task                                                                                                                                                                                        | File(s)  | Est.   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | ------ |
| - [ ] 84 | Create `README.md` with: project overview, tech stack, prerequisites, env vars (`.env.example`), setup steps, dev commands, project structure overview, deployment, contributing guidelines | new file | 45 min |
| - [ ] 85 | Create `.env.example` listing all required `NEXT_PUBLIC_*` variables                                                                                                                        | new file | 10 min |

### Group 9B: Clean `docs/` Folder

| #        | Task                                                                                                            | File(s)   | Est.   |
| -------- | --------------------------------------------------------------------------------------------------------------- | --------- | ------ |
| - [ ] 86 | Move all `*_COMPLETE.md`, `*_SUMMARY.md`, `*_FIX.md` files (25+) → `docs/archive/`                              | 25+ files | 15 min |
| - [ ] 87 | Create `docs/README.md` — index of remaining living docs                                                        | new file  | 10 min |
| - [ ] 88 | Delete `components/ui/error-state.md` and `components/ui/search-input.md` — move content to `docs/` if valuable | 2 files   | 5 min  |

### Group 9C: Move Example Files

| #        | Task                                                                            | File(s)  | Est.   |
| -------- | ------------------------------------------------------------------------------- | -------- | ------ |
| - [ ] 89 | Move all `*.example.tsx` files (14 files) from `components/` → `docs/examples/` | 14 files | 15 min |

**Phase 9 Commit:** `docs: add README, clean docs folder, move examples`

---

## Phase 10 — Styling & Config Improvements (~ 2 hours)

### Group 10A: Font Loading

| #        | Task                                                                                           | File(s)                                | Est.   |
| -------- | ---------------------------------------------------------------------------------------------- | -------------------------------------- | ------ |
| - [ ] 90 | Replace CSS `@import` font loading with `next/font` in root layout (Geist, Inter, Inter Tight) | `app/layout.tsx`, `styles/globals.css` | 30 min |

### Group 10B: Design Token Alignment

| #        | Task                                                                                                                                                          | File(s)                         | Est.   |
| -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------- | ------ |
| - [ ] 91 | Audit hardcoded hex colors in `app/page.tsx` and `layout-client.tsx` — map each to nearest Tailwind token or add missing brand tokens to `tailwind.config.ts` | `tailwind.config.ts`, 2–3 files | 30 min |
| - [ ] 92 | Replace hardcoded hex values with design tokens (`bg-[#181B25]` → `bg-brand-dark`, etc.)                                                                      | 5+ files                        | 30 min |

### Group 10C: ESLint & Lint Config

| #        | Task                                                                          | File(s)            | Est.   |
| -------- | ----------------------------------------------------------------------------- | ------------------ | ------ |
| - [ ] 93 | Replace manual globals listing with `{ ...globals.browser, ...globals.node }` | `eslint.config.js` | 10 min |
| - [ ] 94 | Enable `prefer-const` rule                                                    | `eslint.config.js` | 2 min  |
| - [ ] 95 | Enable `react-hooks/exhaustive-deps` rule (as warning first)                  | `eslint.config.js` | 2 min  |

**Phase 10 Commit:** `chore: use next/font, align design tokens, tighten lint rules`

---

## Phase 11 — Deferred / Larger Efforts (~ 10+ hours)

_These are significant refactors. Schedule as separate sprints._

### Group 11A: "Employer" → "Recruiter" Rename

**Context:** Backend and role system use "recruiter". Frontend components say "employer". This is the #1 confusion point.

| #        | Task                                                    | Est.    |
| -------- | ------------------------------------------------------- | ------- |
| - [ ] 96 | Rename `components/employer/` → `components/recruiter/` | 2 hours |
| - [ ] 97 | Rename all `Employer*` component names to `Recruiter*`  | 1 hour  |
| - [ ] 98 | Update every import across codebase                     | 1 hour  |
| - [ ] 99 | Verify all routes and navigation still work             | 30 min  |

### Group 11B: Profile Provider Simplification

| #         | Task                                                                                                      | Est.    |
| --------- | --------------------------------------------------------------------------------------------------------- | ------- |
| - [ ] 100 | Split `profile-provider.tsx` into `UserContext`, `ActiveRoleContext`, `ProfileContext`                    | 3 hours |
| - [ ] 101 | Move `ProfileContext` definition from `app/` to `lib/` so `hooks/useProfile.ts` doesn't reach into `app/` | 30 min  |

### Group 11C: Error Handling Architecture

| #         | Task                                                                                             | Est.    |
| --------- | ------------------------------------------------------------------------------------------------ | ------- |
| - [ ] 102 | Add React Error Boundary wrapping in root layout                                                 | 1 hour  |
| - [ ] 103 | Expand `GlobalErrorHandler` to handle network errors, 500s, rate limits (not just role mismatch) | 2 hours |

### Group 11D: Test Coverage for Critical Paths

| #         | Task                                                                      | Est.    |
| --------- | ------------------------------------------------------------------------- | ------- |
| - [ ] 104 | Write tests for `lib/api/index.ts` (token refresh, error handling, retry) | 2 hours |
| - [ ] 105 | Write tests for `lib/profileMapper.ts`                                    | 1 hour  |
| - [ ] 106 | Write tests for `hooks/useAuth.ts`                                        | 1 hour  |
| - [ ] 107 | Write tests for `middleware.ts`                                           | 1 hour  |

### Group 11E: Auth Flow Documentation

| #         | Task                                                                                                   | Est.   |
| --------- | ------------------------------------------------------------------------------------------------------ | ------ |
| - [ ] 108 | Document canonical auth flow (localStorage vs HTTP-only cookies) — resolve the dual-strategy confusion | 1 hour |
| - [ ] 109 | Remove legacy `storeTokens()` localStorage calls if HTTP-only cookies are the canonical approach       | 1 hour |

---

## Summary by Phase

| Phase     | Focus              | Tasks   | Est. Time   |
| --------- | ------------------ | ------- | ----------- |
| 1         | Quick Wins         | 12      | 30 min      |
| 2         | Auth & Cookies     | 8       | 1.5 hrs     |
| 3         | lib/ Cleanup       | 12      | 2 hrs       |
| 4         | Type Consolidation | 14      | 3 hrs       |
| 5         | API Layer          | 9       | 1.5 hrs     |
| 6         | Landing Page Split | 13      | 4 hrs       |
| 7         | Naming Standards   | 9       | 3 hrs       |
| 8         | Console Logs       | 6       | 2 hrs       |
| 9         | Docs & DX          | 6       | 2 hrs       |
| 10        | Styling & Config   | 6       | 2 hrs       |
| 11        | Deferred Refactors | 14      | 10+ hrs     |
| **Total** |                    | **109** | **~32 hrs** |

---

_Ready to start? Run Phase 1 first — it's all quick wins with zero risk._
