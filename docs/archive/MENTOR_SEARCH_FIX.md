# Mentor Search Parameter Fix

## Issue

Search functionality was not working on mentor applications and sessions pages because the API functions were looking for `searchQuery` parameter but the pages were passing `q` parameter (which is what the backend expects).

---

## Root Cause

The type definitions and API functions had a mismatch:

- **Frontend pages**: Passing `q` parameter (correct, matches backend)
- **Type definitions**: Defined as `searchQuery` (incorrect)
- **API functions**: Checking for `params.searchQuery` and converting to `q` (incorrect)
- **Backend**: Expects `q` parameter (per MENTOR_ENDPOINTS_SUMMARY.md)

---

## Changes Made

### 1. Updated RequestsQueryParams Type

**File**: `lib/api/mentorship/types.ts`

**Before:**

```typescript
export interface RequestsQueryParams {
  role?: "sent" | "received";
  status?: RequestStatus;
  searchQuery?: string; // ❌ Wrong parameter name
  dateRange?: "today" | "week" | "month";
  page?: number;
  limit?: number;
  offset?: number;
}
```

**After:**

```typescript
export interface RequestsQueryParams {
  role?: "sent" | "received";
  status?: RequestStatus;
  q?: string; // ✅ Backend expects 'q' not 'searchQuery'
  dateRange?: "today" | "week" | "month";
  page?: number;
  limit?: number;
  offset?: number;
}
```

---

### 2. Updated getMentorMentorshipRequests Function

**File**: `lib/api/mentorship/index.ts`

**Before:**

```typescript
export async function getMentorMentorshipRequests(
  params?: Omit<RequestsQueryParams, "role">,
): Promise<PaginatedResponse<MentorshipRequest>> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.searchQuery) queryParams.append("q", params.searchQuery); // ❌ Checking wrong property
  // ...
}
```

**After:**

```typescript
export async function getMentorMentorshipRequests(
  params?: Omit<RequestsQueryParams, "role">,
): Promise<PaginatedResponse<MentorshipRequest>> {
  const queryParams = new URLSearchParams();
  if (params?.status) queryParams.append("status", params.status);
  if (params?.q) queryParams.append("q", params.q); // ✅ Backend expects 'q'
  // ...
}
```

---

### 3. Updated SessionsQueryParams Type

**File**: `lib/api/mentorship/types.ts`

**Before:**

```typescript
export interface SessionsQueryParams {
  role?: "mentor" | "mentee";
  status?: SessionStatus;
  upcoming?: boolean;
  past?: boolean;
  searchQuery?: string; // ❌ Wrong parameter name
  dateRange?: "today" | "week" | "month";
  page?: number;
  limit?: number;
  offset?: number;
}
```

**After:**

```typescript
export interface SessionsQueryParams {
  role?: "mentor" | "mentee";
  status?: SessionStatus;
  upcoming?: boolean;
  past?: boolean;
  q?: string; // ✅ Backend expects 'q' not 'searchQuery'
  dateRange?: "today" | "week" | "month";
  page?: number;
  limit?: number;
  offset?: number;
}
```

---

### 4. Updated getSessions Function

**File**: `lib/api/mentorship/index.ts`

**Before:**

```typescript
export async function getSessions(
  params?: SessionsQueryParams,
): Promise<SessionsListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.role) queryParams.append("role", params.role);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.upcoming) queryParams.append("upcoming", "true");
  if (params?.past) queryParams.append("past", "true");
  if (params?.searchQuery) queryParams.append("q", params.searchQuery); // ❌ Checking wrong property
  // ...
}
```

**After:**

```typescript
export async function getSessions(
  params?: SessionsQueryParams,
): Promise<SessionsListResponse> {
  const queryParams = new URLSearchParams();
  if (params?.role) queryParams.append("role", params.role);
  if (params?.status) queryParams.append("status", params.status);
  if (params?.upcoming) queryParams.append("upcoming", "true");
  if (params?.past) queryParams.append("past", "true");
  if (params?.q) queryParams.append("q", params.q); // ✅ Backend expects 'q'
  // ...
}
```

---

## Frontend Pages (Already Correct)

### Applications Page

**File**: `app/(business)/applications/page.tsx`

```typescript
const apiParams = {
  ...(filter !== "all" ? { status: filter as RequestStatus } : {}),
  ...(debouncedSearchQuery ? { q: debouncedSearchQuery } : {}), // ✅ Correct
  ...(dateRange && dateRange !== "all"
    ? { dateRange: dateRange as "today" | "week" | "month" }
    : {}),
};

const requestsResponse = await getMentorMentorshipRequests(apiParams);
```

### Sessions Page

**File**: `app/(business)/sessions/page.tsx`

```typescript
const apiParams = {
  role: "mentor",
  ...(statusParam ? { status: statusParam } : {}),
  ...(debouncedSearchQuery ? { q: debouncedSearchQuery } : {}), // ✅ Correct
  ...(dateRange && dateRange !== "all"
    ? { dateRange: dateRange as "today" | "week" | "month" }
    : {}),
};

const response = await getSessions(apiParams);
```

---

## Testing

### Applications Page Search

1. Navigate to `/applications` (mentor role)
2. Type in search box: "mentee name" or "topic"
3. ✅ Results should filter based on search query
4. ✅ Loading indicator should show in search icon during search
5. ✅ Empty state should show "Try adjusting your search query" if no results

### Sessions Page Search

1. Navigate to `/sessions` (mentor role)
2. Type in search box: "mentee name" or "topic"
3. ✅ Results should filter based on search query
4. ✅ Loading indicator should show in search icon during search
5. ✅ Empty state should show "Try adjusting your search query" if no results

---

## Related Documentation

- **Mentor Endpoints**: `docs/MENTOR_ENDPOINTS_SUMMARY.md`
- **Filter/Search Patterns**: `docs/FILTER_SEARCH_PATTERNS.md`
- **Session Flow**: `docs/SESSION_FLOW_GUIDE.md`

---

## Summary

Fixed search functionality on mentor applications and sessions pages by:

1. ✅ Updated `RequestsQueryParams` type to use `q` instead of `searchQuery`
2. ✅ Updated `SessionsQueryParams` type to use `q` instead of `searchQuery`
3. ✅ Updated `getMentorMentorshipRequests` function to check for `params.q`
4. ✅ Updated `getSessions` function to check for `params.q`

All mentor endpoints now correctly use the `q` parameter as expected by the backend API.
