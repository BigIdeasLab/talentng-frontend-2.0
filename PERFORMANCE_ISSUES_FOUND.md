# Performance Issues Found in TalentNG Frontend

## Critical Issues

### 1. **use-toast.ts - Memory Leak in Listener Array** ⚠️ HIGH PRIORITY
**Location:** `hooks/use-toast.ts` (Line 177-185)

**Problem:**
The `listeners` array accumulates references without proper cleanup. Each component using `useToast()` adds a listener, but if a listener function identity changes between renders, duplicate listeners are added, causing memory bloat.

**Code:**
```typescript
React.useEffect(() => {
  listeners.push(setState)  // ← Adds listener every render
  return () => {
    const index = listeners.indexOf(setState)  // ← This will fail to find setState if it changed
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}, [state])  // ← setState changes on every render!
```

**Fix:**
```typescript
React.useEffect(() => {
  listeners.push(setState)
  return () => {
    const index = listeners.indexOf(setState)
    if (index > -1) {
      listeners.splice(index, 1)
    }
  }
}, [])  // ← Remove state dependency - it's not needed
```

---

### 2. **confirm-email/page.tsx - Inefficient useEffect for Auto-Submit** ⚠️ HIGH PRIORITY
**Location:** `app/(auth)/confirm-email/page.tsx` (Line 92-97)

**Problem:**
The code watches a form field on every render and auto-submits. The dependency array uses `form.watch()` which is a function call, causing the effect to run on every render, potentially triggering multiple API calls.

**Code:**
```typescript
React.useEffect(() => {
  const code = form.watch("verificationCode");
  if (code.length === 6) {
    onSubmit({ verificationCode: code });  // ← Called repeatedly
  }
}, [form.watch("verificationCode")])  // ← Dependency is function call!
```

**Fix:**
```typescript
const verificationCode = form.watch("verificationCode");

React.useEffect(() => {
  if (verificationCode.length === 6) {
    onSubmit({ verificationCode });
  }
}, [verificationCode])  // ← Use the watched value directly
```

---

### 3. **use-notifications.ts - Missing Dependency in useEffect** ⚠️ MEDIUM PRIORITY
**Location:** `hooks/use-notifications.ts` (Line 29-31)

**Problem:**
The effect depends on `user`, but `fetchNotifications` is defined inside the component and will change on every render. This could cause unnecessary re-renders.

**Code:**
```typescript
useEffect(() => {
  fetchNotifications();
}, [user]);  // ← user changes but fetchNotifications is not memoized
```

**Fix:**
```typescript
const fetchNotifications = useCallback(async () => {
  if (user) {
    setLoading(true);
    setError(null);
    try {
      const fetchedNotifications = await getNotifications(user.id);
      setNotifications(fetchedNotifications);
    } catch (err) {
      setError("Failed to fetch notifications.");
    }
    setLoading(false);
  }
}, [user]);

useEffect(() => {
  fetchNotifications();
}, [fetchNotifications]);
```

---

### 4. **confirm-email/page.tsx - Complex SVG Gradient Background** ⚠️ MEDIUM PRIORITY
**Location:** `app/(auth)/confirm-email/page.tsx` (Lines 102-165)

**Problem:**
6 large SVG filter definitions with Gaussian blur (stdDeviation="325") on a full-screen component. This is GPU-intensive and can cause browser slowdowns, especially on lower-end devices.

**Recommendation:**
- Convert SVG to static CSS gradients
- Use CSS animations instead of SVG filters
- Or lazy-load the SVG only when the page is visible

---

### 5. **Unused Dependency - react-confetti** ⚠️ LOW PRIORITY
**Location:** `package.json` line 17

**Problem:**
The `react-confetti` library is installed but never used in the codebase. It's 8.3KB gzipped and adds unnecessary bundle size.

**Fix:**
Remove from package.json:
```bash
npm uninstall react-confetti
```

---

## Architecture Concerns

### 6. **Global State in use-toast.ts** ⚠️ MEDIUM PRIORITY
The toast system uses module-level state (`memoryState`, `listeners`, `toastTimeouts`) that persists across component mounts/unmounts. While this works, it could cause unexpected behavior if multiple Toaster instances are rendered.

**Consider:** Using React Context or a proper state management solution if you need multiple toast instances.

---

### 7. **Token Refresh Race Condition in lib/api.ts** ⚠️ MEDIUM PRIORITY
**Location:** `lib/api.ts` (Lines 20-32, 69-103)

**Problem:**
The `isRefreshing` flag and `failedQueue` are global state, which could cause race conditions if:
- Multiple API requests fail with 401 simultaneously
- The promise in `failedQueue` resolves before the retry fetch completes

**Current Code:**
```typescript
let isRefreshing = false;
const failedQueue: any[] = [];

// If multiple 401s happen simultaneously:
if (response.status === 401) {
  if (isRefreshing) {
    // Multiple requests queue here, but only first one refreshes
    return new Promise((resolve, reject) => {
      failedQueue.push({ resolve, reject });
    })
  }
  isRefreshing = true;
  // ...
}
```

**Recommendation:** Use React Query's `onError` callback or axios interceptors for more robust token refresh handling.

---

## Bundle Size Issues

### 8. **Large Dependencies** ⚠️ MEDIUM PRIORITY

Check your bundle size with these heavy dependencies:
- `@react-three/fiber` (500KB+) - Only use if you need 3D
- `recharts` (350KB+) - Consider alternatives like `visx` or `chart.js`
- All `@radix-ui` components are bundled even if unused

**Recommendation:** Use Next.js bundleAnalyzer to see what's being shipped:
```bash
npm install @next/bundle-analyzer
```

---

## Quick Wins to Fix Immediately

1. **Fix use-toast.ts dependency** - 5 min (prevents memory leak)
2. **Fix confirm-email auto-submit** - 5 min (prevents duplicate submissions)
3. **Add useCallback to fetchNotifications** - 5 min (prevents excessive re-renders)
4. **Remove react-confetti** - 2 min (reduce bundle size)
5. **Replace SVG gradient with CSS** - 15 min (improves render performance)

---

## Testing Performance

Run these commands to verify improvements:

```bash
# Check for memory leaks
# Open DevTools > Performance tab > Record > Navigate > Stop
# Look for growing memory usage

# Check bundle size
npm run build

# Check Core Web Vitals
# Use Chrome DevTools > Lighthouse
```
