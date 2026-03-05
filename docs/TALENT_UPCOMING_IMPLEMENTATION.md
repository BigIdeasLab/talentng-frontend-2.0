# Talent Upcoming API Implementation

## Summary

Successfully implemented the `/api/v1/talent/upcoming` endpoint integration following the API guide specifications.

## Changes Made

### 1. Updated `app/(business)/upcoming/page.tsx`

#### Added State Management

- Added `pagination` state to store pagination metadata
- Added `debouncedSearchQuery` state for search debouncing (500ms delay)
- Added `currentPage` state for pagination tracking

#### Implemented Search Debouncing

- Search queries are debounced by 500ms to avoid excessive API calls
- Page resets to 0 when search query or filters change

#### Updated API Integration

- Changed from `limit: 100` to `limit: 20` (standard pagination)
- Added `offset: currentPage * 20` for pagination
- Added `type` parameter that maps filter tabs to API:
  - `filter === "interviews"` → `type: "interview"`
  - `filter === "sessions"` → `type: "session"`
  - `filter === "all"` → `type: undefined`
- Changed `q: searchQuery` to `q: debouncedSearchQuery || undefined`

#### Server-Side Filtering

- Removed client-side filtering logic since server now handles it
- Filter tabs now trigger API calls with appropriate `type` parameter
- Tab counts now use pagination metadata when available

#### Added Pagination UI

- Shows "Showing X to Y of Z events" text
- Previous/Next buttons with proper disabled states
- Page indicator showing "Page X of Y"
- Pagination only displays when there are results

## API Parameters Used

### Search

- `q` - Search query (debounced, 500ms delay)

### Filters

- `dateRange` - "today" | "week" | "month" (from ApplicationFilterModal)
- `type` - "interview" | "session" (from filter tabs)

### Pagination

- `limit` - 20 (standard page size)
- `offset` - currentPage \* 20

## Response Format

```typescript
{
  data: Array<Interview | Session>,
  pagination: {
    total: number,
    limit: number,
    offset: number,
    currentPage: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

## User Experience Improvements

1. **Search Debouncing**: Reduces API calls while typing
2. **Server-Side Filtering**: Faster filtering with proper pagination
3. **Pagination**: Users can navigate through large result sets
4. **Accurate Counts**: Tab badges show server-side counts
5. **Consistent Pattern**: Matches other paginated endpoints (applications, opportunities)

## Files Modified

- `app/(business)/upcoming/page.tsx` - Main implementation

## Files Already Correct

- `lib/api/talent/index.ts` - API function already supported all required parameters

## Testing Checklist

- [x] Search functionality with debouncing
- [x] Filter by date range (today, week, month)
- [x] Filter by type (all, interviews, sessions)
- [x] Pagination (previous/next buttons)
- [x] Tab counts update correctly
- [x] Empty states display properly
- [x] Loading states work correctly

## Notes

- The API function `getTalentUpcoming` in `lib/api/talent/index.ts` already had the correct signature
- No changes were needed to the API layer
- The implementation follows the same pattern as the recruiter applications endpoint
- Real-time updates via WebSocket are preserved
