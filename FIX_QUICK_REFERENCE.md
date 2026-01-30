# Fix Quick Reference

## What Was Fixed

**Race Condition**: Frontend was ignoring the complete user object returned by `POST /users/me/onboard` and making an extra `GET /users/me` call instead.

## Key Changes

### Line-by-Line Changes

| File                | Location | Change                                                                       | Why                                    |
| ------------------- | -------- | ---------------------------------------------------------------------------- | -------------------------------------- |
| onboarding/page.tsx | Line 4   | Added `import { useQueryClient }`                                            | To access React Query cache            |
| onboarding/page.tsx | Line 40  | Added `const queryClient = useQueryClient()`                                 | Get cache instance                     |
| onboarding/page.tsx | Line 172 | Changed `await mutation` to `const response = await mutation`                | Capture response                       |
| onboarding/page.tsx | Line 181 | Replaced `refetchUser()` with `queryClient.setQueryData(["user"], response)` | Use response instead of extra API call |
| onboarding/page.tsx | Line 452 | Same as line 172                                                             | For company details submission         |
| onboarding/page.tsx | Line 462 | Same as line 181                                                             | For company details submission         |
| useAuth.ts          | Line 12  | Added logging in `fetchUser`                                                 | Track when user data updates           |
| useAuth.ts          | Line 44  | Added logging in `useEffect`                                                 | Track refetch triggers                 |
| useAuth.ts          | Line 51  | Added new `useEffect`                                                        | Track user state changes               |
| ProfileSwitcher.tsx | Line 177 | Added new `useEffect`                                                        | Track role updates                     |

## Expected Behavior After Fix

### Console Output

When you add a new role, you'll see:

```
[ONBOARDING] Starting mentor expertise submission
[ONBOARDING] Sending POST /users/me/onboard mutation
[ONBOARDING] Mutation response received {roles: [...], ...}
[ONBOARDING] Updating React Query cache with response
[ONBOARDING] Redirecting with new role
[useAuth] User state updated {roles: [...], ...}
[ProfileSwitcher] Roles updated {userRoles: [...], ...}
```

### Network Tab

Should show only **one** API call:

- ✅ POST /users/me/onboard
- ❌ NO GET /users/me (it's gone!)

### Visual Result

- No flicker on ProfileSwitcher
- New role appears immediately
- Faster redirect to dashboard

---

## Testing

```bash
# 1. Create new account (auto-onboards as Talent)
# 2. Go to dashboard
# 3. Click "Add New Role"
# 4. Select Mentor
# 5. Complete form and submit
# 6. Watch console logs (F12)
# 7. Should see logs listed above
# 8. ProfileSwitcher should show new role immediately
# 9. Check Network tab - only 1 POST request, no GET
```

---

## Troubleshooting

| Issue                                           | Cause                                  | Fix                                             |
| ----------------------------------------------- | -------------------------------------- | ----------------------------------------------- |
| ProfileSwitcher still flickers                  | `queryClient.setQueryData` didn't work | Check if response has `roles` field             |
| Still seeing GET /users/me call                 | Fallback triggered                     | Check response structure, ensure it has `roles` |
| "Updating React Query cache" log doesn't appear | Response missing roles                 | Backend might need to return roles array        |
| Redirect not happening                          | Error caught silently                  | Check error logs in catch block                 |

---

## Files Changed

```
✅ app/(auth)/onboarding/page.tsx
✅ hooks/useAuth.ts
✅ components/layouts/ProfileSwitcher.tsx
```

That's it! Only 3 files changed.

---

## Rollback (if needed)

To revert to old behavior:

```typescript
// In handleMentorExpertiseNext and handleCompanyDetailsNext:

// REMOVE these lines:
const response = await completeOnboardingMutation.mutateAsync(formData);
if (response?.roles) {
  queryClient.setQueryData(["user"], response);
} else {
  refetchUser();
}

// REPLACE with:
await completeOnboardingMutation.mutateAsync(formData);
refetchUser();
```

But don't - the fix is good!

---

## Summary

- ✅ Fixed race condition
- ✅ Removed unnecessary API call
- ✅ Eliminated ProfileSwitcher flicker
- ✅ Faster user experience
- ✅ Added comprehensive logging
- ✅ Defensive fallback included
