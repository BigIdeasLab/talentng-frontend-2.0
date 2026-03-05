# Filter & Search UI Patterns Study

## Overview

This document captures the consistent patterns used across recruiter and talent pages for filter buttons, search functionality, loading states, and empty states.

---

## 1. Filter Button Styling

### Base Styling

```tsx
<button
  className={`h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] rounded-[8px] flex-shrink-0 transition-colors ${
    filterCount > 0
      ? "bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]" // Active state
      : "bg-[#F5F5F5] hover:bg-gray-100 text-black border border-transparent" // Default state
  }`}
>
  <SlidersHorizontal className="w-[15px] h-[15px]" />
  <span className="text-[13px] font-normal font-inter-tight">Filter</span>
  {filterCount > 0 && (
    <span className="ml-1 bg-[#8463FF] text-white text-[10px] w-4 h-4 flex items-center justify-center rounded-full">
      {filterCount}
    </span>
  )}
</button>
```

### Key Features:

- **Height**: Fixed at `38px` to match search bar
- **Active State**: Purple background `#8463FF0D` with purple border when filters applied
- **Badge**: Shows count of active filters in a purple circle
- **Icon**: `SlidersHorizontal` from lucide-react at `15px`
- **Disabled State**: `disabled:opacity-60 disabled:cursor-not-allowed`

---

## 2. Search Bar Styling

### Base Structure

```tsx
<div className="flex-1 max-w-[585px] h-[38px] px-[12px] py-[7px] flex items-center gap-[6px] border border-[#E1E4EA] rounded-[8px]">
  {isLoading ? (
    <div className="w-[15px] h-[15px] border-2 border-[#B2B2B2] border-t-transparent rounded-full animate-spin flex-shrink-0" />
  ) : (
    <Search className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0" />
  )}
  <input
    type="text"
    placeholder="Search name, role..."
    value={searchQuery}
    onChange={(e) => setSearchQuery(e.target.value)}
    className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
  />
  {searchQuery && (
    <button
      onClick={() => setSearchQuery("")}
      className="flex-shrink-0 text-[#B2B2B2] hover:text-black transition-colors"
    >
      <X className="w-[15px] h-[15px]" />
    </button>
  )}
</div>
```

### Key Features:

- **Max Width**: `585px` for optimal readability
- **Loading State**: Spinner replaces search icon when loading
- **Clear Button**: X icon appears when there's text, clears on click
- **Placeholder**: Uses `text-black/30` for subtle appearance
- **No Border on Input**: Input has `border-0 focus:outline-none`

---

## 3. Search Debouncing

### Implementation Pattern

```tsx
const [searchQuery, setSearchQuery] = useState("");
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");

// Debounce search query
useEffect(() => {
  const timer = setTimeout(() => {
    setDebouncedSearchQuery(searchQuery);
  }, 500); // 500ms delay

  return () => clearTimeout(timer);
}, [searchQuery]);

// Reset to page 1 when filters change
useEffect(() => {
  setCurrentPage(0);
}, [debouncedSearchQuery, activeTab, filters, sortBy]);
```

### Alternative Pattern (DiscoverTalent)

```tsx
const [localSearchQuery, setLocalSearchQuery] = useState(searchQuery);
const debounceTimer = useRef<NodeJS.Timeout>();

const handleSearchChange = useCallback(
  (value: string) => {
    // Update local state immediately for responsive input
    setLocalSearchQuery(value);

    // Clear previous debounce
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce the search call
    debounceTimer.current = setTimeout(() => {
      onSearchChange(value);
    }, 300); // 300ms delay
  },
  [onSearchChange],
);
```

### Key Features:

- **Delay**: 300-500ms is standard
- **Local State**: Immediate UI update, debounced API call
- **Cleanup**: Clear timeout on unmount
- **Page Reset**: Reset pagination when search changes

---

## 4. Loading States

### Initial Load vs Filter Changes

#### Pattern 1: Show Previous Data During Filter Changes

```tsx
const [displayedApplicants, setDisplayedApplicants] = useState<
  MappedApplicant[]
>([]);
const [isInitialLoad, setIsInitialLoad] = useState(true);
const lastProcessedDataRef = useRef<any>(null);

// Only update if response has actually changed
useEffect(() => {
  if (response && response !== lastProcessedDataRef.current) {
    lastProcessedDataRef.current = response;
    const mapped = mapApplicationsToUI(response.data || []);
    setDisplayedApplicants(mapped);
    if (isInitialLoad && !isLoading && !isPending) {
      setIsInitialLoad(false);
    }
  }
}, [response, isLoading, isPending, isInitialLoad]);

// Only show skeleton on initial load
if (isInitialLoad && (isLoading || isPending || !response)) {
  return <ApplicantsSkeleton />;
}
```

#### Pattern 2: Show Skeleton for All Loading

```tsx
{
  isLoading ? (
    <ApplicationsSkeleton />
  ) : (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px]">
      {/* Content */}
    </div>
  );
}
```

### Key Features:

- **Initial Load**: Show full skeleton
- **Subsequent Loads**: Keep previous data visible (Pattern 1) OR show skeleton (Pattern 2)
- **Ref Tracking**: Use `useRef` to track if data actually changed
- **Loading Indicator**: Spinner in search icon during loading

---

## 5. Context-Aware Empty States

### Implementation Pattern

```tsx
{filteredApplicants.length === 0 ? (
  <EmptyState
    icon={Users}
    title="No applicants found"
    description={
      debouncedSearchQuery.trim()
        ? "Try adjusting your search query"
        : filters.status.length > 0 ||
            filters.location ||
            filters.dateRange !== "all"
          ? "Try adjusting your filters"
          : activeTab === "hired"
            ? "You haven't hired any talents yet"
            : activeTab === "rejected"
              ? "You haven't rejected any applicants"
              : activeTab === "shortlisted"
                ? "You haven't shortlisted any applicants yet"
                : activeTab === "applied"
                  ? "No applicants are currently in review"
                  : "When candidates apply to opportunities, they'll appear here"
    }
  />
) : (
  // Show content
)}
```

### Message Priority:

1. **Search Active**: "Try adjusting your search query"
2. **Filters Active**: "Try adjusting your filters"
3. **Tab-Specific**: Custom message based on active tab
4. **Default**: Generic "no data yet" message

---

## 6. Filter Modal Integration

### Modal Trigger Pattern

```tsx
const [isFilterOpen, setIsFilterOpen] = useState(false);
const [filters, setFilters] = useState<ApplicantFilterState>({
  status: [],
  location: "",
  dateRange: "all",
});

<div className="relative">
  <button onClick={() => setIsFilterOpen(true)}>{/* Filter button */}</button>
  <ApplicantFilterModal
    isOpen={isFilterOpen}
    onClose={() => setIsFilterOpen(false)}
    onApply={(newFilters) => setFilters(newFilters)}
    initialFilters={filters}
  />
</div>;
```

### Filter Count Calculation

```tsx
const getFilterCount = () => {
  let count = 0;
  if (filters.status.length > 0) count += filters.status.length;
  if (filters.location) count += 1;
  if (filters.dateRange !== "all") count += 1;
  return count;
};
```

---

## 7. Tab Navigation

### Standard Tab Pattern

```tsx
const TABS = [
  { id: "all", label: "All" },
  { id: "pending", label: "Pending" },
  { id: "accepted", label: "Accepted" },
  { id: "rejected", label: "Rejected" },
];

<div className="flex items-center gap-[8px] overflow-x-auto scrollbar-hide">
  {TABS.map((tab) => (
    <button
      key={tab.id}
      onClick={() => setActiveTab(tab.id)}
      className={`px-[12px] py-[6px] flex justify-center items-center whitespace-nowrap flex-shrink-0 rounded transition-colors ${
        activeTab === tab.id
          ? "text-black font-medium border-b-2 border-black"
          : "text-black/30 font-medium hover:text-black/50"
      }`}
    >
      <span className="text-[13px] font-inter-tight">{tab.label}</span>
    </button>
  ))}
</div>;
```

### Key Features:

- **Active State**: Black text with 2px bottom border
- **Inactive State**: 30% opacity black text
- **Hover**: 50% opacity on inactive tabs
- **Scrollable**: `overflow-x-auto scrollbar-hide` for mobile
- **No Wrap**: `whitespace-nowrap` prevents text wrapping

---

## 8. Server-Side Filtering Pattern

### Query Params Construction

```tsx
const queryParams = useMemo(
  () => ({
    ...(debouncedSearchQuery ? { q: debouncedSearchQuery } : {}),
    ...(activeTab !== "all" ? { status: activeTab } : {}),
    ...(filters.status.length === 1 ? { status: filters.status[0] } : {}),
    ...(filters.location ? { location: filters.location } : {}),
    ...(filters.dateRange !== "all"
      ? { dateRange: filters.dateRange as "today" | "week" | "month" }
      : {}),
    ...(sortBy !== "newest"
      ? { sortBy: sortBy as "newest" | "oldest" | "name-asc" | "name-desc" }
      : {}),
    limit: 20,
    offset: currentPage * 20,
  }),
  [debouncedSearchQuery, activeTab, filters, sortBy, currentPage],
);

const { data: response, isLoading } =
  useRecruiterApplicationsQuery(queryParams);

// Server handles all filtering — use results directly
const filteredApplicants = displayedApplicants;
```

### Key Features:

- **Conditional Params**: Only include non-default values
- **Memoization**: Use `useMemo` to prevent unnecessary re-renders
- **No Client Filtering**: Trust server results completely
- **Pagination**: Include limit/offset in params

---

## 9. Sort Dropdown Pattern

### Implementation

```tsx
<div className="relative group flex-shrink-0">
  <button className="h-[38px] px-[15px] py-[7px] flex items-center gap-[5px] bg-[#F5F5F5] rounded-[8px] hover:bg-gray-100 transition-colors">
    <span className="text-[13px] font-normal text-black font-inter-tight">
      {sortBy === "newest"
        ? "Newest"
        : sortBy === "oldest"
          ? "Oldest"
          : sortBy === "name-asc"
            ? "A-Z"
            : "Z-A"}
    </span>
    <ChevronDown className="w-4 h-4" />
  </button>
  <div className="absolute top-full right-0 mt-1 w-[120px] bg-white rounded-[8px] shadow-lg border border-[#E1E4EA] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
    {[
      { value: "newest", label: "Newest" },
      { value: "oldest", label: "Oldest" },
      { value: "name-asc", label: "A-Z" },
      { value: "name-desc", label: "Z-A" },
    ].map((option) => (
      <button
        key={option.value}
        onClick={() => setSortBy(option.value)}
        className={`w-full text-left px-3 py-2 text-[12px] hover:bg-gray-50 first:rounded-t-[8px] last:rounded-b-[8px] ${
          sortBy === option.value
            ? "bg-[#5C30FF]/10 text-[#5C30FF]"
            : "text-black"
        }`}
      >
        {option.label}
      </button>
    ))}
  </div>
</div>
```

---

## 10. Pagination Pattern

### Implementation

```tsx
{
  pagination && pagination.total > 0 && (
    <div className="flex items-center justify-between px-[24px] py-[16px] border-t border-[#E1E4EA] flex-shrink-0">
      <div className="text-[13px] text-[#525866] font-inter-tight">
        Showing {pagination.offset + 1} to{" "}
        {Math.min(pagination.offset + pagination.limit, pagination.total)} of{" "}
        {pagination.total} results
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={() => setCurrentPage(currentPage - 1)}
          disabled={!pagination.hasPreviousPage}
          className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Previous
        </button>
        <span className="text-[13px] text-[#525866] font-inter-tight">
          Page {pagination.currentPage} of {pagination.totalPages}
        </span>
        <button
          onClick={() => setCurrentPage(currentPage + 1)}
          disabled={!pagination.hasNextPage}
          className="px-4 py-2 border border-[#E1E4EA] rounded-lg text-[13px] font-inter-tight disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50 transition-colors"
        >
          Next
        </button>
      </div>
    </div>
  );
}
```

---

## Summary Checklist

When implementing filter/search functionality:

- [ ] Filter button shows active state with purple background when filters applied
- [ ] Filter count badge displays number of active filters
- [ ] Search bar has loading spinner that replaces search icon
- [ ] Search has clear (X) button that appears when text is entered
- [ ] Search is debounced (300-500ms)
- [ ] Initial load shows skeleton, subsequent loads keep previous data visible
- [ ] Empty states are context-aware (search vs filters vs tab vs default)
- [ ] Tabs have proper active/inactive styling with bottom border
- [ ] Server-side filtering with conditional query params
- [ ] Pagination resets when filters/search changes
- [ ] All buttons have proper hover states and transitions
- [ ] Disabled states have reduced opacity and cursor-not-allowed
