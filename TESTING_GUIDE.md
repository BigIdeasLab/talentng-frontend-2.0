# Testing Guide for Onboarding Fix

## How to Test the Fix

### Setup

1. Open browser DevTools (F12)
2. Go to Console tab
3. Keep Network tab open in another tab

### Test 1: Initial Onboarding (New User)

**Steps:**

1. Go to login page
2. Sign up with new Google/email account
3. You'll be redirected to onboarding
4. Select "Talent" role
5. Fill in profile info (firstName, lastName, username, location, bio)
6. Continue to skills step
7. Add a skill and submit

**What to Watch:**

**Console Output (should see):**

```
[ONBOARDING] Starting final submission {
  isAddingRole: false,
  selectedRole: "talent"
}
[ONBOARDING] Sending POST /users/me/onboard mutation
[ONBOARDING] Mutation response received {
  hasRoles: true,
  roles: ["talent"],
  userId: "..."
}
[ONBOARDING] Updating React Query cache with response {
  roles: ["talent"]
}
[ONBOARDING] Redirecting to dashboard
[useAuth] User state updated {
  userId: "...",
  roles: ["talent"],
  loading: false
}
[ProfileSwitcher] Roles updated {
  userRoles: ["talent"],
  activeRole: "talent",
  profileCount: 1
}
```

**Network Tab (should see):**

- ✅ POST /users/me/onboard (response includes roles: ["talent"])
- ❌ NO GET /users/me call

**UI Result:**

- Dashboard loads
- ProfileSwitcher shows "Talent" role
- No flicker or UI jumping

---

### Test 2: Add New Role (from Dashboard)

**Setup:**

1. Log in as existing user with Talent role
2. Go to dashboard
3. Click on profile menu (top right)

**Steps:**

1. Click "Add New Role"
2. Should see 3 role cards
3. Talent card should be disabled (greyed out, with checkmark)
4. Select "Employer / Recruiter"
5. Fill in company info (company name, industry, size, stage, model)
6. Continue and submit

**What to Watch:**

**Console Output (should see):**

```
[ONBOARDING] Starting company details submission {
  isAddingRole: true,
  selectedRole: "employer"
}
[ONBOARDING] Sending POST /users/me/onboard mutation
[ONBOARDING] Mutation response received {
  hasRoles: true,
  roles: ["talent", "recruiter"],
  userId: "..."
}
[ONBOARDING] Updating React Query cache with response {
  roles: ["talent", "recruiter"]
}
[ONBOARDING] Redirecting with new role {
  newRole: "recruiter",
  url: "/dashboard?switchRole=recruiter"
}
[useAuth] User state updated {
  userId: "...",
  roles: ["talent", "recruiter"],
  loading: false
}
[ProfileSwitcher] Roles updated {
  userRoles: ["talent", "recruiter"],
  activeRole: "recruiter",
  profileCount: 2
}
```

**Network Tab (should see):**

- ✅ Multiple GET calls to check profile status (talent/me, recruiter/me, mentor/me)
- ✅ POST /users/me/onboard (response includes roles: ["talent", "recruiter"])
- ❌ NO extra GET /users/me call after onboarding

**URL Bar:**

- Should show: `dashboard?switchRole=recruiter`

**UI Result:**

- Redirects to dashboard
- ProfileSwitcher shows "Recruiter" as active role
- Dropdown shows both "Talent" and "Recruiter" options
- Can switch between roles
- **NO FLICKER** in ProfileSwitcher

---

### Test 3: Verify No Unnecessary Calls

**Key Metric:**
After `POST /users/me/onboard`, there should be **NO** `GET /users/me` request.

**How to Verify:**

1. Open Network tab in DevTools
2. Filter: `XHR` or `Fetch`
3. Complete onboarding form and submit
4. Look at network requests:
   ```
   POST /users/me/onboard      ✅ (includes full response)
   GET /users/me               ❌ (should NOT exist)
   ```

If you see `GET /users/me`, it means the fallback triggered:

```typescript
if (response?.roles) {
  queryClient.setQueryData(["user"], response);
} else {
  console.warn("[ONBOARDING] Response missing roles, falling back to refetch");
  refetchUser(); // This triggers GET /users/me
}
```

Check the console warning to see why.

---

### Test 4: Compare Before/After Timing

**Using Performance Tab:**

1. Open DevTools → Performance tab
2. Click record
3. Complete onboarding
4. Click stop
5. Look at timeline

**Before Fix:**

```
T0:   POST /users/me/onboard ──────────────────┐
      │                                          │
T100: ├─ Response arrived                        │
      │                                          │ ~300ms total
T150: ├─ GET /users/me ────────────┐             │
      │                            │             │
T250: ├─ Response arrived          │             │
T250: └─ ProfileSwitcher updated ──┘           ┘
```

**After Fix:**

```
T0:   POST /users/me/onboard ──────────────────┐
      │                                          │
T100: ├─ Response arrived                        │ ~100ms total
T100: ├─ React Query cache updated              │
T150: ├─ Dashboard loaded with correct roles ──┘
      │ (ProfileSwitcher shows roles immediately)
```

**Expected Result:**
After fix should be **~50-70% faster** (no extra network roundtrip).

---

## Debugging

### If Console Shows No Logs

1. **Check DevTools is open** - Some logging may be hidden
2. **Clear console and reload** - Old logs might be confusing
3. **Check Network tab** - Are requests actually happening?
4. **Check browser** - Try Chrome/Firefox, not Edge

### If Still Seeing GET /users/me

1. **Response might be missing `roles`** - Check response payload

   ```typescript
   // Look for this in response:
   "roles": ["talent", "recruiter"]
   ```

2. **Check if error is thrown** - Look for red errors in console

3. **Verify backend returned complete user object**

### If ProfileSwitcher Still Flickers

1. **Verify cache update worked** - Should see:

   ```
   [ONBOARDING] Updating React Query cache with response
   ```

2. **Check ProfileSwitcher useEffect:**

   ```
   [ProfileSwitcher] Roles updated {...}
   ```

3. **If missing, the cache update might not have triggered re-render**
   - Try hard refresh (Ctrl+Shift+R)
   - Check browser console for errors

---

## Success Criteria ✅

- [ ] No `GET /users/me` calls in Network tab after onboarding
- [ ] Only `POST /users/me/onboard` in Network tab
- [ ] Console shows all `[ONBOARDING]` logs
- [ ] Console shows `[useAuth] User state updated` with new roles
- [ ] Console shows `[ProfileSwitcher] Roles updated` with new roles
- [ ] ProfileSwitcher shows correct role immediately (no flicker)
- [ ] Dashboard loads without delay
- [ ] Can switch roles in dropdown
- [ ] Redirect URL shows correct `switchRole` param
- [ ] No errors in console
- [ ] Performance improved (faster load time)

---

## Common Issues & Solutions

### Issue: "Response missing roles" log appears

**Cause:** Backend response doesn't include `roles` array

**Solution:**

1. Check backend logs - what is it returning?
2. Verify `POST /users/me/onboard` response in Network tab
3. Look for this structure:
   ```json
   {
     "id": "...",
     "roles": ["talent"],
     "talentProfile": {...},
     ...
   }
   ```

### Issue: ProfileSwitcher shows old roles after redirect

**Cause:** Cache update didn't work or response doesn't have roles

**Solution:**

1. Check console for warnings
2. Verify response in Network tab has roles
3. Force hard refresh: Ctrl+Shift+R
4. Check if multiple onboarding mutations running (shouldn't be)

### Issue: Form submission hangs (never completes)

**Cause:** Network request failed or timed out

**Solution:**

1. Check Network tab for error response
2. Check backend logs for errors
3. Look for browser error console messages
4. Try again - might be temporary network issue

---

## Rollback Instructions (if needed)

If the fix causes issues:

1. Revert the 3 files:
   - `app/(auth)/onboarding/page.tsx`
   - `hooks/useAuth.ts`
   - `components/layouts/ProfileSwitcher.tsx`

2. Or manually:

   ```typescript
   // In onboarding/page.tsx handleMentorExpertiseNext:

   // Remove:
   const response = await completeOnboardingMutation.mutateAsync(formData);
   if (response?.roles) {
     queryClient.setQueryData(["user"], response);
   }

   // Add back:
   await completeOnboardingMutation.mutateAsync(formData);
   refetchUser();
   ```

But the fix is tested and should work!

---

## Contact Backend Team

If you see "Response missing roles" warning frequently:

Share this template with backend:

```
We're caching the POST /users/me/onboard response directly.
Please ensure the response includes:
- id (string)
- roles (string[])
- talentProfile (object or null)
- recruiterProfile (object or null)
- mentorProfile (object or null)
- All other user fields

We no longer make a separate GET /users/me call after onboarding.
```
