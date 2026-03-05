# Recruiter Applications API Implementation Review

## Summary
Your implementation is **mostly correct** but has **one critical issue** that needs to be fixed.

---

## ✅ What's Correct

### 1. API Function (`lib/api/applications/index.ts`)
```typescript
export const getRecruiterApplications = async (params: {
  status?: string;
  opportunityId?: string;
  searchQuery?: string;  // ❌ WRONG - should be 'q'
  location?: string;
  skills?: string;
  dateRange?: "today" | "week" | "month";
  sortBy?: "newest" | "oldest" | "name-asc" | "name-desc";
  limit?: number;
  offset?: number;
}): Promise<Application[]> => {
```

**Issues:**
- ✅ All parameters are present
- ❌ **CRITICAL:** Uses `searchQuery` instead of `q` as the search parameter
- ❌ **CRITICAL:** Return type is `Application[]` but should be paginated response

### 2. Hook Implementation (`hooks/useRecruiterApplications.ts`)
```typescript
interface RecruiterApplicationsParams {
  opportunityId?: string;
  status?: string;
  searchQuery?: string;  // ❌ WRONG - should be 'q'
  location?: string;
  skills?: string;
  dateRange?: "today" | "week" | "month";
  sortBy?: "newest" | "oldest" | "name-asc" | "name-desc";
  limit?: number;
  offset?: number;
}
```

**Issues:**
- ✅ All parameters are present
- ❌ **CRITICAL:** Uses `searchQuery` instead of `q`

### 3. Page Implementation (`app/(business)/applicants/page.tsx`)
```typescript
const queryParams = useMemo(
  () => ({
    ...(searchQuery ? { searchQuery } : {}),  // ❌ WRONG - should be 'q'
    ...(activeTab !== "all" ? { status: activeTab } : {}),
    ...(filters.status.length === 1 ? { status: filters.status[0] } : {}),
    ...(filters.location ? { location: filters.location } : {}),
    ...(filters.skills.length > 0
      ? { skills: filters.skills.join(",") }
      : {}),
    ...(filters.dateRange !== "all"
      ? { dateRange: filters.dateRange as "today" | "week" | "month" }
      : {}),
    ...(sortBy !== "newest"
      ? { sortBy: sortBy as "newest" | "oldest" | "name-asc" | "name-desc" }
      : {}),
  }),
  [searchQuery, activeTab, filters, sortBy],
);
```

**Issues:**
- ✅ All filters are correctly implemented
- ✅ Skills are correctly joined with commas
- ✅ Sorting is correctly implemented
- ❌ **CRITICAL:** Uses `searchQuery` instead of `q`
- ❌ **Missing:** No pagination implementation (limit/offset)

---

## 🔴 Critical Issues to Fix

### Issue 1: Wrong Search Parameter Name
**Current:** `searchQuery`  
**Expected:** `q`

**Why this matters:**
- The API guide explicitly states the parameter should be `q`
- This matches the pattern used in `/api/v1/talent/opportunities`
- Your backend is likely expecting `q`, not `searchQuery`

### Issue 2: Missing Pagination Response Type
**Current:**
```typescript
Promise<Application[]>
```

**Expected:**
```typescript
interface PaginatedApplicationsResponse {
  data: Application[];
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

Promise<PaginatedApplicationsResponse>
```

### Issue 3: No Pagination Implementation
The page doesn't implement pagination controls (Previous/Next buttons, page numbers, etc.)

---

## 🔧 Required Fixes

### Fix 1: Update API Function
```typescript
// lib/api/applications/index.ts

export const getRecruiterApplications = async (params: {
  status?: string;
  opportunityId?: string;
  q?: string;  // ✅ FIXED: Changed from searchQuery to q
  location?: string;
  skills?: string;
  dateRange?: "today" | "week" | "month";
  sortBy?: "newest" | "oldest" | "name-asc" | "name-desc";
  limit?: number;
  offset?: number;
}): Promise<PaginatedApplicationsResponse> => {  // ✅ FIXED: Return paginated response
  const query = new URLSearchParams();
  if (params.status) query.append("status", params.status);
  if (params.opportunityId) query.append("opportunityId", params.opportunityId);
  if (params.q) query.append("q", params.q);  // ✅ FIXED: Changed from searchQuery to q
  if (params.location) query.append("location", params.location);
  if (params.skills) query.append("skills", params.skills);
  if (params.dateRange) query.append("dateRange", params.dateRange);
  if (params.sortBy) query.append("sortBy", params.sortBy);
  if (params.limit) query.append("limit", String(params.limit));
  if (params.offset) query.append("offset", String(params.offset));

  const queryString = query.toString();
  const endpoint = `/recruiter/applications${queryString ? `?${queryString}` : ""}`;

  return apiClient<PaginatedApplicationsResponse>(endpoint);
};
```

### Fix 2: Update Hook Interface
```typescript
// hooks/useRecruiterApplications.ts

interface RecruiterApplicationsParams {
  opportunityId?: string;
  status?: string;
  q?: string;  // ✅ FIXED: Changed from searchQuery to q
  location?: string;
  skills?: string;
  dateRange?: "today" | "week" | "month";
  sortBy?: "newest" | "oldest" | "name-asc" | "name-desc";
  limit?: number;
  offset?: number;
}
```

### Fix 3: Update Page Implementation
```typescript
// app/(business)/applicants/page.tsx

const queryParams = useMemo(
  () => ({
    ...(searchQuery ? { q: searchQuery } : {}),  // ✅ FIXED: Changed to 'q'
    ...(activeTab !== "all" ? { status: activeTab } : {}),
    ...(filters.status.length === 1 ? { status: filters.status[0] } : {}),
    ...(filters.location ? { location: filters.location } : {}),
    ...(filters.skills.length > 0
      ? { skills: filters.skills.join(",") }
      : {}),
    ...(filters.dateRange !== "all"
      ? { dateRange: filters.dateRange as "today" | "week" | "month" }
      : {}),
    ...(sortBy !== "newest"
      ? { sortBy: sortBy as "newest" | "oldest" | "name-asc" | "name-desc" }
      : {}),
    limit: 20,  // ✅ ADDED: Default limit
    offset: currentPage * 20,  // ✅ ADDED: Pagination offset
  }),
  [searchQuery, activeTab, filters, sortBy, currentPage],
);

// Update data extraction
const {
  data: response,
  isLoading,
  isPending,
  error: queryError,
} = useRecruiterApplicationsQuery(queryParams);

const rawApplicants = response?.data || [];
const pagination = response?.pagination;
```

### Fix 4: Add Pagination Component
```typescript
// Add to the page
{pagination && (
  <div className="flex items-center justify-between px-6 py-4 border-t border-[#E1E4EA]">
    <div className="text-sm text-[#525866]">
      Showing {pagination.offset + 1} to {Math.min(pagination.offset + pagination.limit, pagination.total)} of {pagination.total} results
    </div>
    <div className="flex items-center gap-2">
      <button
        onClick={() => setCurrentPage(currentPage - 1)}
        disabled={!pagination.hasPreviousPage}
        className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Previous
      </button>
      <span className="text-sm text-[#525866]">
        Page {pagination.currentPage} of {pagination.totalPages}
      </span>
      <button
        onClick={() => setCurrentPage(currentPage + 1)}
        disabled={!pagination.hasNextPage}
        className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
      >
        Next
      </button>
    </div>
  </div>
)}
```

---

## 📋 Files That Need Updates

1. ✅ `lib/api/applications/index.ts` - Change `searchQuery` to `q`, update return type
2. ✅ `lib/api/applications/types.ts` - Add `PaginatedApplicationsResponse` type
3. ✅ `hooks/useRecruiterApplications.ts` - Change `searchQuery` to `q`
4. ✅ `app/(business)/applicants/page.tsx` - Change `searchQuery` to `q`, add pagination
5. ✅ `app/(business)/applicants/hired-talents/page.tsx` - Same fixes
6. ✅ `app/(business)/opportunities/[id]/applicants/page.tsx` - Same fixes
7. ✅ `components/employer/opportunities/ApplicantsView.tsx` - Same fixes
8. ✅ `components/employer/profile/tabs/PastHiresTab.tsx` - Same fixes

---

## ✅ What's Already Good

1. ✅ All filter parameters are correctly implemented
2. ✅ Skills are correctly joined with commas
3. ✅ Sorting options match the API spec
4. ✅ Date range filtering is correct
5. ✅ Status filtering is correct
6. ✅ Location filtering is correct
7. ✅ The UI/UX is well-designed and user-friendly
8. ✅ Error handling is present
9. ✅ Loading states are handled

---

## 🎯 Priority Order

1. **HIGH PRIORITY:** Fix `searchQuery` → `q` (breaks search functionality)
2. **HIGH PRIORITY:** Add pagination response type (breaks data access)
3. **MEDIUM PRIORITY:** Implement pagination UI (improves UX)
4. **LOW PRIORITY:** Add pagination to other pages using this API

---

## Testing Checklist

After making the fixes, test:
- [ ] Search by applicant name works
- [ ] Search by opportunity title works
- [ ] Filter by status works
- [ ] Filter by location works
- [ ] Filter by skills works
- [ ] Filter by date range works
- [ ] Sorting works (newest, oldest, A-Z, Z-A)
- [ ] Pagination works (Previous/Next buttons)
- [ ] Page numbers display correctly
- [ ] Total count displays correctly
- [ ] Combining multiple filters works
- [ ] API returns paginated response structure
