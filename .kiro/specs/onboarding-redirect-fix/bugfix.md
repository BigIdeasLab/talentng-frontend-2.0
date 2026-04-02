# Bugfix Requirements Document

## Introduction

Social login users who have no profiles can bypass the onboarding flow if they have a stale `activeRole` value cached in localStorage or cookies from a previous session. This creates a security and user experience issue where users without complete profiles can access the main application.

The backend already provides an authoritative `needsOnboarding` field in the GET /api/v1/users/me response, but the frontend currently relies on the unreliable `activeRole` check from localStorage/cookies to determine if onboarding is required.

## Bug Analysis

### Root Cause

**CONFIRMED via backend test and terminal logs**: The backend correctly sends:

```
/onboarding?accessToken=...&refreshToken=...&userId=...&needsOnboarding=true
```

**BUT** the Next.js middleware (`middleware.ts`) intercepts the `/onboarding` route and checks `isNewUser` instead of `needsOnboarding`. When `isNewUser=false` (user logged in before), it redirects to `/redirect` and **strips the `needsOnboarding` parameter**.

**Middleware logic (lines 105-119)**:

```typescript
if (pathname === "/onboarding") {
  if (!isNewUser) {
    // ← WRONG: checks isNewUser instead of needsOnboarding
    // Redirect to /redirect, stripping needsOnboarding parameter
    const redirectUrl = `/redirect?${params.toString()}`;
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
}
```

This causes users who have logged in before but have no profiles (`isNewUser=false`, `needsOnboarding=true`) to be incorrectly redirected to `/redirect` without the `needsOnboarding` parameter, which then routes them to `/dashboard` instead of `/onboarding`.

### Current Behavior (Defect)

1.1 WHEN backend Google OAuth redirects to `/onboarding?...&needsOnboarding=true` THEN Next.js middleware intercepts the request

1.2 WHEN middleware checks `isNewUser=false` (user logged in before) THEN it redirects to `/redirect` and strips the `needsOnboarding` parameter

1.3 WHEN frontend `/redirect` page receives URL params WITHOUT `needsOnboarding` THEN `needsOnboarding` is `null` and the user is routed to `/dashboard` (incorrect for users without profiles)

### Expected Behavior (Correct)

2.1 WHEN backend Google OAuth redirects to `/onboarding?...&needsOnboarding=true` THEN middleware SHALL check `needsOnboarding` (not `isNewUser`) to determine routing

2.2 WHEN middleware sees `needsOnboarding=true` THEN it SHALL allow the request to proceed to `/onboarding` (not redirect to `/redirect`)

2.3 WHEN middleware sees `needsOnboarding=false` THEN it SHALL redirect to `/redirect` with all parameters preserved including `needsOnboarding=false`

2.4 WHEN frontend `/redirect` page receives `needsOnboarding=false` THEN it SHALL route to `/dashboard`

### Unchanged Behavior (Regression Prevention)

3.1 WHEN a user has completed onboarding AND has valid profiles THEN the system SHALL CONTINUE TO allow access to the main application without redirecting to onboarding

3.2 WHEN a user switches roles using the profile switcher THEN the system SHALL CONTINUE TO function correctly without triggering unnecessary onboarding redirects

3.3 WHEN the user data is still loading (`isLoading: true`) THEN the system SHALL CONTINUE TO show the loading screen without premature redirects

3.4 WHEN a user has multiple profiles (e.g., both talent and recruiter) THEN the system SHALL CONTINUE TO allow role switching and access to all profile features

## Fix Location

### Frontend Middleware Fix (IMPLEMENTED)

The Next.js middleware (`middleware.ts`) has been updated to:

1. Extract `needsOnboarding` parameter from URL
2. Use `needsOnboarding` instead of `isNewUser` for routing decisions
3. Preserve `needsOnboarding` parameter when redirecting

**Changes made**:

- Line 73: Added `const needsOnboardingFromUrl = searchParams.get("needsOnboarding");`
- Line 85: Changed logic to check `needsOnboarding` instead of `isNewUser`
- Lines 95, 113, 127: Preserve `needsOnboarding` parameter in redirect URLs

### Backend Status

The backend is correctly implemented:

- ✅ Google OAuth callback sends `needsOnboarding=true` for users without profiles
- ✅ Google OAuth callback sends `needsOnboarding=false` for users with profiles
- ✅ All auth endpoints return `needsOnboarding` field in user response

### Frontend Status

The frontend is correctly implemented:

- ✅ `app/(auth)/redirect/page.tsx` reads `needsOnboarding` from URL params and routes accordingly
- ✅ `app/(business)/layout-client.tsx` checks `user?.needsOnboarding` as a safety net
- ✅ `lib/types/auth.ts` includes `needsOnboarding?: boolean` in User type
- ✅ Terminal logging added to track OAuth redirect parameters
- ✅ Middleware now checks `needsOnboarding` instead of `isNewUser`
