# Back Burner Improvements

## React Query / SWR Implementation

### What It Does

Automatic caching layer for API calls with smart refetching and mutation invalidation.

### Current Situation

- Using `useOpportunitiesManager` with manual state management
- Manual refetch callbacks after mutations
- No caching between page visits
- Each component manages its own loading/error state

### What It Would Look Like

```typescript
// Before
const { getAll, isLoading } = useOpportunitiesManager();
await getAll(params);

// After
const { data, isLoading } = useQuery({
  queryKey: ["opportunities", userId],
  queryFn: () => getOpportunities({ postedById: userId }),
});
```

### Benefits

- Auto-cache identical queries
- Background refetch on window focus
- Automatic mutation invalidation (post → auto-refetch list)
- Built-in DevTools
- Cleaner component code

### Downsides

- New dependency (~35KB)
- Learning curve (2-3 hours)
- Requires QueryClientProvider wrapper at root

### Effort

- **Setup**: 30 mins (install, provider, queryClient config)
- **Refactor opportunities**: 1.5 hours (convert 5 hooks + components)
- **Refactor talent**: 1 hour (similar pattern)
- **Testing**: 1 hour

### Decision

**Keep in backburner** - not critical for current app size, but high ROI if we add more API-heavy features.

### When to Implement

- App grows to 10+ API endpoints
- Users report stale data issues
- Need offline support
- Want to add infinite scrolling with pagination

### Resources

- https://tanstack.com/query/latest
- https://swr.vercel.app

---

## Talent API - Improvement Status

### ✅ Completed

- Already using React Query via `useTalentApi.ts` hooks
- Centralized API layer at `lib/api/talent/index.ts`
- No direct fetch/axios calls in components (all via hooks)
- Services use `useMyServices` hook ✓
- Gallery uses `deleteGalleryItem` API ✓

### ✅ Recent Fixes (Applied)

- Replaced `window.location.reload()` with state reset in `WorksGrid.tsx`
- Replaced `window.location.reload()` with state reset in `ServicesGrid.tsx`
- Added toast notifications for delete operations
- Fixed typing: `(hookError as any)` → `(hookError as Error & { status?: number })`
- Added `useToast` hook to error states

### Status

Talent API is already well-structured with React Query. No major refactoring needed.

---

## Applications API - Improvement Status

### ✅ Completed

- Created centralized hook: `hooks/useApplications.ts`
- Removed dynamic imports: `await import()` → static import
- Added error handling & loading states in hook
- Removed duplicate type definitions (now use API types)

### ✅ Changes Applied

- **ApplicantsView.tsx**:
  - Replaced dynamic import with `useApplications()` hook
  - Added toast notifications for errors
  - Removed custom Applicant interface (use Application from API)
- **ApplicationModal.tsx**:
  - Replaced `submitApplication()` direct call with `useApplications().submit()`
  - Added toast notifications for success/error
  - Simplified state management (isSubmitting from hook)

### Status

Applications API now fully centralized through `useApplications` hook.
