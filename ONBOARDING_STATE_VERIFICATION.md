# Onboarding Mutation & User State Update Verification

## Quick Answer

**The system does NOT use the onboarding mutation response to update user state. Instead:**

1. ✅ Mutation is awaited (line 172 in onboarding/page.tsx)
2. ✅ Success toast is shown
3. ✅ `refetchUser()` is called separately (line 182) - does NOT await
4. ✅ Redirect happens immediately (not waiting for refetch)
5. ⚠️ **Race condition risk**: User may see stale role list briefly on dashboard

---

## Detailed Code Flow

### Step 1: Onboarding Mutation (awaited)

**File**: `app/(auth)/onboarding/page.tsx` (Lines 172)

```typescript
await completeOnboardingMutation.mutateAsync(formData);
// ↓ Mutation returns something (but response is NOT captured)
```

**What the mutation does**:

- Located in `hooks/useUserApi.ts` (Lines 40-43)
- Uses React Query's `useMutation` with `userOnboardingApi.completeOnboarding`
- Calls `POST /users/me/onboard` endpoint

**What it returns** (response is discarded):

```
// Response from backend (not used)
await apiClient<any>("/users/me/onboard", {
  method: "POST",
  body: formData,
});
// Returns: Promise<any> but response is ignored
```

**In the code**:

```typescript
const completeOnboardingMutation = useCompleteOnboarding();
// ...
await completeOnboardingMutation.mutateAsync(formData);
// ↑ Response is not captured: const response = await...
// ↑ The <any> type means we're not even expecting a specific response format
```

---

### Step 2: Show Success Toast

**File**: `app/(auth)/onboarding/page.tsx` (Lines 174-179)

```typescript
toast({
  title: "Success",
  description: isAddingRole
    ? "Your new role has been successfully added."
    : "Your profile has been successfully created.",
});
```

---

### Step 3: Refetch User State (NOT awaited)

**File**: `app/(auth)/onboarding/page.tsx` (Line 182)

```typescript
// Refetch user data in background (don't await)
refetchUser();
// ↑ This is NOT awaited - fires in background
```

**How `refetchUser()` works**:

**File**: `hooks/useAuth.ts` (Lines 30-36)

```typescript
const {
  data: user,
  isLoading: loading,
  refetch: refetchUser, // ← This is React Query's refetch method
} = useQuery({
  queryKey: ["user"],
  queryFn: fetchUser, // ← Calls GET /users/me
  staleTime: 0, // ← Always consider stale (no caching)
  enabled: hasToken,
  retry: 1,
});
```

**What `fetchUser` does**:

**File**: `hooks/useAuth.ts` (Lines 9-17)

```typescript
const fetchUser = async (): Promise<User | null> => {
  try {
    const userData = await userProfileApi.getCurrentUser();
    // ↓ Calls GET /users/me
    return userData;
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    return null;
  }
};
```

**What `getCurrentUser` does**:

**File**: `lib/api/users/index.ts` (Lines 20-22)

```typescript
export const getCurrentUser = async (): Promise<User> => {
  return apiClient<User>("/users/me");
  // ↓ Makes GET /users/me request
};
```

---

### Step 4: Redirect to Dashboard

**File**: `app/(auth)/onboarding/page.tsx` (Lines 185-191)

```typescript
// If adding a role, redirect with the new role selected
if (isAddingRole) {
  router.push(`/dashboard?switchRole=${newRole}`);
} else {
  router.push("/dashboard");
}
// ↑ This happens IMMEDIATELY, NOT waiting for refetchUser() to complete
```

---

## The Race Condition Problem

```
Timeline of execution:
═══════════════════════════════════════════════════════════════

T0: await completeOnboardingMutation.mutateAsync(formData)
    ├─ POST /users/me/onboard ⬅️ BACKEND UPDATES PROFILE
    └─ Response: { success: true } (response ignored)

T1: toast({ title: "Success", ... })
    └─ Show success message

T2: refetchUser()  // ← NOT AWAITED, fires in background
    └─ Schedules: GET /users/me
       (will complete in ~100-500ms)

T3: router.push("/dashboard?switchRole=talent")
    └─ IMMEDIATE redirect to dashboard
       (doesn't wait for GET /users/me to complete)

T4-T5: User lands on dashboard
       └─ useAuth hook may still be using OLD user data
          (if GET /users/me hasn't returned yet)

T6: GET /users/me response arrives
    └─ React Query updates cache
    └─ ProfileSwitcher re-renders with NEW roles
```

### What the User Sees

**Best case** (network is fast ~100ms):

1. Success toast appears
2. Quick redirect to dashboard
3. ProfileSwitcher immediately shows new role (no flicker)

**Worst case** (network is slow ~500ms):

1. Success toast appears
2. Redirect to dashboard
3. ProfileSwitcher shows **OLD roles** (flicker)
4. After 500ms: ProfileSwitcher updates to show **NEW roles**

---

## Expected User State Response

**GET /users/me Response Format**:

**File**: `lib/types/auth.ts` (Lines 1-25)

```typescript
type User = {
  id: string;
  fullName?: string;
  email: string;
  username: string;
  role?: string;
  roles?: string[]; // ← THIS IS UPDATED BY BACKEND
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
  emailVerifiedAt: string | null;
  isVerified: boolean;
  lastLoginAt: string | null;
  oneSignalPlayerId: string | null;
  status: string;
  verificationLevel: string;
  talentProfile?: any;
  recruiterProfile?: any;
  mentorProfile?: any;
};
```

**Expected response after adding "talent" role**:

```json
{
  "id": "user-123",
  "email": "user@example.com",
  "username": "john_doe",
  "roles": ["recruiter", "talent"],  // ← UPDATED from ["recruiter"]
  "role": "recruiter",
  "createdAt": "2024-01-15T10:00:00Z",
  "updatedAt": "2024-01-30T14:00:00Z",
  "isVerified": true,
  "status": "active",
  "verificationLevel": "full",
  "talentProfile": { ... },
  "recruiterProfile": { ... },
  "mentorProfile": null
}
```

---

## What ProfileSwitcher Shows

**File**: `components/layouts/ProfileSwitcher.tsx`

The ProfileSwitcher component uses the `user.roles` array to determine:

1. Which roles are available in the dropdown
2. Which role can be switched to
3. Which role is currently active

```typescript
// In ProfileSwitcher (approximately):
const userRoles = user?.roles || []; // Get from updated user state
// ↓ This updates when refetchUser() completes and React Query updates cache
```

---

## How to Verify in Browser Network Tab

### Request 1: POST /users/me/onboard (Step 1)

```
POST /users/me/onboard
Content-Type: multipart/form-data

FormData:
├─ role: "TALENT"
├─ profile: "{"username":"john_doe","firstName":"John",...}"
├─ details: "{"skills":["JavaScript","React"]}"
└─ profileImage: File

Response:
{
  "success": true,
  "message": "Profile created successfully"
  // OR whatever your backend returns - frontend doesn't use it
}
```

### Request 2: GET /users/me (Step 3, happens after redirect)

```
GET /users/me
Authorization: Bearer {token}

Response:
{
  "id": "user-123",
  "email": "user@example.com",
  "roles": ["recruiter", "talent"],  // ← Now includes new role
  "roles": ["recruiter", "talent"],
  ... other fields
}
```

### Network Tab Timeline

```
0ms:   POST /users/me/onboard ──────── [Processing on backend...]
100ms: ← Response received
150ms: refetchUser() called
150ms: GET /users/me ──────────────── [Request sent...]
250ms: ← Response received with new roles
250ms: React Query cache updated
250ms: ProfileSwitcher re-renders with new roles
```

---

## Issues & Recommendations

### Current Issues

1. **No response validation**: Backend response is ignored

   ```typescript
   // Bad: Don't know if roles array was actually updated
   await completeOnboardingMutation.mutateAsync(formData);
   // Should be:
   const response = await completeOnboardingMutation.mutateAsync(formData);
   ```

2. **Race condition**: Redirect happens before refetch completes

   ```typescript
   // Bad: User redirects before GET /users/me completes
   refetchUser(); // Not awaited
   router.push("/dashboard");

   // Better: Wait for refetch before redirect
   await refetchUser();
   router.push("/dashboard");
   ```

3. **No error handling on refetch**: If GET /users/me fails, user won't know

   ```typescript
   // Bad: Silent failure
   refetchUser();

   // Better: Handle errors
   const result = await refetchUser();
   if (result.isError) {
     toast({ variant: "destructive", ... });
   }
   ```

4. **Response is typed as `<any>`**: No type safety
   ```typescript
   // In lib/api/users/index.ts
   export const completeOnboarding = async (
     formData: FormData,
   ): Promise<any> => {
     // Should have a real response type
   };
   ```

### Recommended Fixes

**RECOMMENDED: Use the response directly**

Backend already sends the complete updated user object. Use it instead of fetching again.

File: `app/(auth)/onboarding/page.tsx` (around line 172 and similar handlers)

```typescript
import { useQueryClient } from "@tanstack/react-query"; // ADD AT TOP

const OnboardingPage = () => {
  const queryClient = useQueryClient(); // ADD THIS
  // ... rest of code

  // In handleFinalSubmit, handleMentorExpertiseNext, handleCompanyDetailsNext:
  try {
    const response = await completeOnboardingMutation.mutateAsync(formData);
    // ↑ CHANGE: Capture response (was: await completeOnboardingMutation...)

    toast({
      title: "Success",
      description: isAddingRole
        ? "Your new role has been successfully added."
        : "...",
    });

    // ADD THESE 3 LINES:
    if (response?.roles) {
      queryClient.setQueryData(["user"], response);
    }
    // ↑ Updates React Query cache with fresh user data
    // ↑ ProfileSwitcher re-renders immediately with new roles

    // REMOVE THIS LINE:
    // refetchUser();  // No longer needed - we have fresh data

    // Rest of redirect logic (unchanged):
    if (isAddingRole) {
      router.push(`/dashboard?switchRole=${newRole}`);
    } else {
      router.push("/dashboard");
    }
  } catch (error) {
    // ... existing error handling
  }
};
```

**Result**:

- ✅ No race condition
- ✅ No extra GET /users/me call
- ✅ ProfileSwitcher shows new roles immediately
- ✅ Fast, clean UX

---

**SIMPLER ALTERNATIVE: Just await the refetch**

If you want minimal code changes:

```typescript
// Line 182 in handleMentorExpertiseNext
// Line 430 in handleCompanyDetailsNext
// Change this:
refetchUser();

// To this:
await refetchUser();
```

This waits for the refetch before redirecting. Still slower (extra API call) but eliminates the race condition.

---

## Backend Actual Behavior ✅ (VERIFIED)

Based on backend logs from real onboarding flow, the backend **already does this correctly**:

1. ✅ Accepts `POST /users/me/onboard` with FormData (role, profile, details, profileImage)
2. ✅ Creates the profile for the specified role
3. ✅ Adds the new role to user's `roles` array
4. ✅ **Returns the complete updated user object** in response
5. ✅ When `GET /users/me` is called, returns updated `roles` array

**Backend Response Example** (from real logs):

```json
[ONBOARD RESPONSE] {
  "id": "82a04c06-2ee0-4fca-b89f-89bcb78ed026",
  "username": "ffffffffff",
  "email": "hecanotus@gmail.com",
  "roles": ["talent", "recruiter"],  // ← UPDATED
  "status": "active",
  "isVerified": true,
  "talentProfile": { ... },
  "recruiterProfile": { ... },
  "mentorProfile": null
}
```

**The problem**: Frontend ignores this complete response and makes a separate `GET /users/me` call, causing the race condition.

---

## What Backend Logs Prove ✅

From the real onboarding flow logs, here's the timeline:

### First Onboarding (Talent Role)

```
[ONBOARD] Starting onboarding | userId=82a04c06-2ee0-4fca-b89f-89bcb78ed026 role=TALENT
[CREATE TALENT PROFILE] Profile created successfully | profileId=e040cdef-0b41-4c70-9564-f7e8d0449edd
[ONBOARD] Onboarding completed successfully | userId=82a04c06-2ee0-4fca-b89f-89bcb78ed026 role=TALENT returnedUser=true
[ONBOARD RESPONSE] {
  "id": "82a04c06-2ee0-4fca-b89f-89bcb78ed026",
  "roles": ["talent"],  // ← Response includes updated roles
  "talentProfile": { ... }
}
[GET ME] Fetching current user | userId=82a04c06-2ee0-4fca-b89f-89bcb78ed026
[GET ME] User retrieved | userId=82a04c06-2ee0-4fca-b89f-89bcb78ed026 roles=["talent"]
```

### Add Role (Recruiter Role)

```
[TALENT GET ME] Profile fetch result | isProfileCreated=true  // ← Checking what roles exist
[RECRUITER GET ME] Profile fetch result | isProfileCreated=false  // ← Recruiter not done yet
[MENTOR GET ME] Profile fetch result | isProfileCreated=false  // ← Mentor not done yet

[ONBOARD] Starting onboarding | userId=82a04c06-2ee0-4fca-b89f-89bcb78ed026 role=RECRUITER
[CREATE RECRUITER PROFILE] Profile created successfully | profileId=558a8a24-d1eb-4ce5-bb3f-a8083554543f
[ONBOARD] Onboarding completed successfully | userId=82a04c06-2ee0-4fca-b89f-89bcb78ed026 role=RECRUITER returnedUser=true
[ONBOARD RESPONSE] {
  "id": "82a04c06-2ee0-4fca-b89f-89bcb78ed026",
  "roles": ["talent", "recruiter"],  // ← Response includes BOTH roles now!
  "talentProfile": { ... },
  "recruiterProfile": { ... },
  "mentorProfile": null
}
```

### Key Findings

✅ **Backend returns complete user object with updated roles**

- The `[ONBOARD RESPONSE]` includes `roles: ["talent", "recruiter"]`
- It includes all profile objects (talentProfile, recruiterProfile, etc.)
- This is everything needed to update user state immediately

⚠️ **Frontend throws this away and fetches again**

- Frontend ignores the response (typed as `<any>`, not captured)
- Makes a separate `GET /users/me` call via `refetchUser()`
- Race condition: redirect before refetch completes

---

## Summary for Backend

| Question                                        | Answer                                             |
| ----------------------------------------------- | -------------------------------------------------- |
| Is mutation response used?                      | ❌ No - typed as `<any>` and not captured          |
| Does response contain updated roles?            | ✅ Yes - roles array includes new role             |
| Is refetchUser called separately?               | ✅ Yes - line 182, not awaited                     |
| Does frontend see updated roles after redirect? | ⚠️ Sometimes - depends on GET /users/me timing     |
| What does ProfileSwitcher show?                 | Updated roles (eventually) - but may flicker       |
| Potential issues?                               | Race condition - redirect before refetch completes |

**Backend is working perfectly.** The issue is entirely on the frontend - it's not using the response data that's already been sent.
