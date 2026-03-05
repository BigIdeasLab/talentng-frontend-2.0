# Design Document: Recruiter Opportunities Improvements

## Overview

This design document outlines the technical approach for implementing UI/UX improvements to the recruiter opportunities page. The improvements are based on proven patterns successfully implemented across the upcoming, my-applications, and discover-talent pages. The goal is to create a consistent, responsive user experience with optimized loading states, intelligent search, and intuitive filtering.

### Key Design Goals

1. **Consistency**: Apply the same UX patterns used in other pages to create a unified experience
2. **Performance**: Optimize API calls through debouncing and intelligent loading states
3. **Usability**: Provide clear visual feedback for active filters and search states
4. **Responsiveness**: Ensure smooth transitions and prevent jarring UI changes

### Scope

The design covers modifications to:
- `components/employer/opportunities/EmployerOpportunities.tsx` - Main client component
- `components/employer/opportunities/SearchAndFilters.tsx` - Search input component
- `components/talent/opportunities/OpportunitiesFilterModal.tsx` - Filter modal (shared component)
- `components/ui/empty-state.tsx` - Empty state component (shared component)

## Architecture

### Component Hierarchy

```
EmployerOpportunities (State Management)
├── OpportunitiesHeader
├── SearchAndFilters (with debounce & clear)
│   └── OpportunitiesFilterModal (auto-apply on outside click)
├── OpportunitiesTabs
└── OpportunityCard[] / EmptyState (context-aware)
```

### State Management Approach

The design follows a centralized state management pattern in `EmployerOpportunities`:

```typescript
// Core state
const [activeTab, setActiveTab] = useState<TabType>("open")
const [searchQuery, setSearchQuery] = useState("")
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
const [sortBy, setSortBy] = useState<SortType>("newest")
const [isFilterOpen, setIsFilterOpen] = useState(false)
const [appliedFilters, setAppliedFilters] = useState<any>(null)

// Loading optimization refs
const isInitialLoadRef = useRef(true)
const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)
```

### Data Flow

1. **User Input** → Component event handlers
2. **State Updates** → Trigger useEffect hooks
3. **API Calls** → Fetch with current filters/search/pagination
4. **Response Handling** → Update state with fetch ID validation
5. **UI Rendering** → Display updated data with smooth transitions

### Loading State Strategy

The design implements a two-tier loading strategy:

1. **Initial Load**: Show skeleton loader for first data fetch
2. **Subsequent Updates**: Keep current data visible, show loading indicator in search bar

This prevents jarring UI changes when users apply filters or search.

## Components and Interfaces

### 1. EmployerOpportunities (Modified)

**Purpose**: Main orchestrator component managing all state and API interactions

**New State Variables**:
```typescript
const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("")
const isInitialLoadRef = useRef(true)
```

**New Methods**:
```typescript
// Debounced search handler
const handleSearchDebounced = (query: string) => {
  setSearchQuery(query)
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current)
  }
  searchTimeoutRef.current = setTimeout(() => {
    setDebouncedSearchQuery(query)
  }, 500)
}

// Clear search handler
const handleClearSearch = () => {
  setSearchQuery("")
  setDebouncedSearchQuery("")
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current)
  }
}

// Filter count calculation
const getFilterCount = (): number => {
  if (!appliedFilters) return 0
  let count = 0
  if (appliedFilters.skills?.length) count += appliedFilters.skills.length
  if (appliedFilters.types?.length) count += appliedFilters.types.length
  return count
}
```

**Modified Behavior**:
- Only show skeleton loader on initial load (using `isInitialLoadRef`)
- Keep current opportunities visible during subsequent fetches
- Use debounced search query for API calls

### 2. SearchAndFilters (Modified)

**Purpose**: Search input with loading indicator and clear button

**New Props**:
```typescript
interface SearchAndFiltersProps {
  searchQuery: string
  onSearchChange: (query: string) => void
  onClearSearch: () => void  // New
  sortBy: SortType
  onSortChange: (sort: SortType) => void
  onFilterClick: () => void
  isSearching?: boolean  // New - indicates search in progress
  filterCount?: number  // New - for badge display
}
```

**Key Features**:
- Loading spinner replaces search icon during API calls
- X button appears when search query is not empty
- Filter button shows purple styling when filters are active
- Filter count badge displayed inline with button text

### 3. OpportunitiesFilterModal (Modified - Shared Component)

**Purpose**: Filter modal with auto-apply on outside click

**Key Changes**:

1. **Auto-Apply on Outside Click**:
```typescript
useEffect(() => {
  if (!isOpen) return

  const handleClickOutside = (event: MouseEvent) => {
    if (modalRef.current && !modalRef.current.contains(event.target as Node)) {
      // Auto-apply filters when clicking outside
      onApply(filters)
      onClose()
    }
    
    // Handle dropdown closes
    // ... existing dropdown logic ...
  }

  document.addEventListener("mousedown", handleClickOutside)
  return () => document.removeEventListener("mousedown", handleClickOutside)
}, [isOpen, filters, onApply, onClose, /* dropdown states */])
```

2. **Maintain Apply Button**: Keep existing "Apply Filter" button for explicit application

### 4. EmptyState (Modified - Shared Component)

**Purpose**: Context-aware empty state messages

**Props Interface**:
```typescript
interface EmptyStateProps {
  icon: React.ComponentType
  title: string
  description: string
}
```

**Logic**:
```typescript
// In EmployerOpportunities component
const getEmptyStateProps = () => {
  const hasActiveFilters = appliedFilters && (
    (appliedFilters.skills?.length > 0) ||
    (appliedFilters.types?.length > 0)
  )
  const hasSearchQuery = searchQuery.trim().length > 0
  
  if (hasSearchQuery) {
    return {
      title: "No opportunities found",
      description: "Try adjusting your search query or filters"
    }
  } else if (hasActiveFilters) {
    return {
      title: "No opportunities found",
      description: "Try adjusting your filters"
    }
  } else {
    return {
      title: "No opportunities found",
      description: "Try adjusting your search or filters to find what you're looking for"
    }
  }
}
```

## Data Models

### OpportunitiesFilterState

```typescript
interface OpportunitiesFilterState {
  types: string[]              // Opportunity types (controlled by tabs)
  skills: string[]             // Selected skills
  categories?: string[]        // Selected categories
  experienceLevels?: string[]  // Selected experience levels
  location?: string            // Selected state
  minBudget?: number          // Minimum budget filter
  maxBudget?: number          // Maximum budget filter
}
```

### API Request Parameters

```typescript
interface OpportunitiesAPIParams {
  searchQuery?: string    // Search query (q parameter)
  limit: number          // Results per page
  offset: number         // Pagination offset
  type?: string          // Comma-separated opportunity types
  category?: string      // Comma-separated categories
  tags?: string          // Comma-separated skills
  location?: string      // State filter
  experienceLevel?: string  // Comma-separated experience levels
  minBudget?: number     // Minimum budget
  maxBudget?: number     // Maximum budget
  dateRange?: string     // Date range filter (today, week, month)
}
```

### Filter Count Calculation

The filter count excludes opportunity types (controlled by tabs) to prevent badge changes when switching tabs:

```typescript
function calculateFilterCount(filters: OpportunitiesFilterState | null): number {
  if (!filters) return 0
  
  let count = 0
  count += filters.skills.length
  count += filters.categories?.length || 0
  count += filters.experienceLevels?.length || 0
  count += filters.location ? 1 : 0
  count += (filters.minBudget && filters.minBudget > 0) ? 1 : 0
  count += (filters.maxBudget && filters.maxBudget > 0) ? 1 : 0
  
  return count
}
```


## Correctness Properties

*A property is a characteristic or behavior that should hold true across all valid executions of a system—essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees.*

### Property 1: Auto-Apply Filters on Outside Click

*For any* filter modal state, when the modal is open and the user clicks outside the modal bounds, the system should apply the current filter selections, close the modal, and fetch new data with the applied filters.

**Validates: Requirements 1.1, 1.3**

### Property 2: Filter Button Visual State

*For any* filter state, when one or more filters are active, the filter button should display purple styling (background #8463FF0D, border #8463FF, text #8463FF), and when no filters are active, the button should display default gray styling.

**Validates: Requirements 2.1, 2.2, 2.3, 2.4**

### Property 3: Filter Count Badge Accuracy

*For any* filter state, the count badge should display the exact number of active filters, calculated as: skills.length + types.length.

**Validates: Requirements 2.5, 8.1, 8.4**

### Property 4: Search Debounce Behavior

*For any* sequence of search input characters, the system should wait 500 milliseconds after the last character before triggering a search API call, and any new character typed before the delay completes should reset the timer.

**Validates: Requirements 3.1, 3.2**

### Property 5: Search API Parameter Naming

*For any* search query, when the search is triggered, the API call should use the `q` parameter to pass the search query string.

**Validates: Requirements 3.3, 10.1**

### Property 6: Search Loading Indicator

*For any* search query, while the search API call is in progress, the search input should display a loading spinner in place of the search icon.

**Validates: Requirements 3.4**

### Property 7: Clear Button Visibility

*For any* search input state, the X icon clear button should be visible if and only if the search query is non-empty.

**Validates: Requirements 4.1, 4.4**

### Property 8: Clear Button Functionality

*For any* non-empty search query, when the user clicks the X icon, the system should clear the search query and fetch opportunities without search filtering.

**Validates: Requirements 4.2, 4.3**

### Property 9: Loading State Optimization

*For any* filter or search parameter change after the initial page load, the system should keep the current opportunity list visible (not show skeleton loader) while fetching new data.

**Validates: Requirements 5.2, 5.3**

### Property 10: Empty State with Active Filters

*For any* filter state where filters are active and no opportunities match, the empty state should display "No opportunities found" as the title and "Try adjusting your filters" as the description.

**Validates: Requirements 6.1, 6.2**

### Property 11: Empty State with Search Query

*For any* search query where no results are found, the empty state should display "No opportunities found" as the title and "Try adjusting your search query or filters" as the description.

**Validates: Requirements 6.5, 6.6**

## Error Handling

### API Error Handling

**Network Failures**:
- Display error state in the grid area
- Show user-friendly error message: "Error loading opportunities"
- Provide retry mechanism through filter/search changes
- Log detailed error information to console for debugging

**Timeout Handling**:
- Set reasonable timeout for API calls (30 seconds)
- Treat timeouts as network failures
- Allow user to retry by changing filters or refreshing

**Invalid Response Handling**:
- Validate API response structure before processing
- Fall back to empty array if data is malformed
- Display appropriate empty state message
- Log validation errors for monitoring

### State Management Errors

**Stale State Prevention**:
- Use fetch ID system to discard outdated responses
- Prevent race conditions in concurrent API calls
- Ensure UI always reflects the latest user intent

**Filter State Validation**:
- Validate filter values before API calls
- Sanitize budget inputs (remove commas, validate numbers)
- Handle edge cases (negative budgets, invalid date ranges)

### User Input Errors

**Search Input**:
- Handle special characters gracefully
- Trim whitespace from search queries
- Prevent XSS through proper input sanitization

**Filter Input**:
- Validate budget inputs are positive numbers
- Ensure location selections are from valid state list
- Prevent duplicate skill/category selections

### Edge Cases

**Empty States**:
- No opportunities in database → Show default empty state
- No opportunities matching filters → Show filter-specific empty state
- No opportunities matching search → Show search-specific empty state

**Rapid User Actions**:
- Debounce search to prevent excessive API calls
- Use fetch ID to handle rapid filter changes
- Prevent double-clicks on pagination buttons

**Browser Compatibility**:
- Ensure debounce timers are properly cleaned up
- Handle browsers without IntersectionObserver gracefully
- Test on major browsers (Chrome, Firefox, Safari, Edge)

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

- **Unit tests**: Verify specific examples, edge cases, and error conditions
- **Property tests**: Verify universal properties across all inputs

### Unit Testing

Unit tests should focus on:

1. **Component Rendering**:
   - SearchBar renders with correct props
   - DateRangeButtons renders all four options
   - FilterModal renders with correct initial state
   - EmptyState renders with correct messages based on context

2. **Event Handlers**:
   - Search input onChange triggers debounce
   - Clear button onClick clears search
   - Filter button onClick opens modal
   - Date range button onClick applies filter
   - Pagination buttons onClick change page

3. **Edge Cases**:
   - Empty search query doesn't filter results (Requirement 3.5)
   - Initial load shows skeleton loader (Requirement 5.1)
   - Default empty state when no filters/search (Requirement 6.3)
   - Date range buttons render correctly (Requirement 7.1)
   - Apply Filter button still works (Requirement 1.4)

4. **Integration Points**:
   - OpportunitiesClient orchestrates state correctly
   - API calls use correct parameters
   - Filter count calculation excludes types
   - Fetch ID system prevents race conditions

### Property-Based Testing

Property tests should be implemented using a PBT library appropriate for the tech stack (e.g., fast-check for TypeScript/JavaScript). Each test should:

- Run minimum 100 iterations
- Generate random valid inputs
- Reference the design document property
- Use the tag format: **Feature: recruiter-opportunities-improvements, Property {number}: {property_text}**

**Property Test Examples**:

1. **Property 1 - Auto-Apply Filters**:
   - Generate random filter states
   - Simulate outside click
   - Verify filters applied and modal closed

2. **Property 3 - Filter Count**:
   - Generate random filter combinations
   - Calculate expected count (excluding types)
   - Verify badge displays correct count

3. **Property 4 - Search Debounce**:
   - Generate random character sequences with timing
   - Verify only one API call after 500ms
   - Verify rapid typing resets timer

4. **Property 10 - Stale Response Handling**:
   - Generate overlapping API requests
   - Verify only latest response is applied
   - Verify earlier responses are discarded

5. **Property 15 - Pagination Reset**:
   - Generate random filter/search/date changes
   - Verify pagination always resets to page 1
   - Verify offset is 0 after changes

### Test Configuration

**Property Test Settings**:
```typescript
// Example configuration for fast-check
fc.assert(
  fc.property(
    fc.record({
      skills: fc.array(fc.string()),
      categories: fc.array(fc.string()),
      experienceLevels: fc.array(fc.constantFrom("Entry", "Intermediate", "Senior", "Expert")),
      location: fc.option(fc.string()),
      minBudget: fc.nat(),
      maxBudget: fc.nat(),
    }),
    (filters) => {
      // Test property
    }
  ),
  { numRuns: 100 }
)
```

**Test Tags**:
```typescript
// Feature: recruiter-opportunities-improvements, Property 3: Filter count badge accuracy
test("filter count excludes types and counts all other filters", () => {
  // Property-based test implementation
})
```

### Testing Tools

- **Unit Testing**: Jest + React Testing Library
- **Property-Based Testing**: fast-check
- **Integration Testing**: Playwright or Cypress
- **Visual Regression**: Chromatic or Percy (optional)

### Coverage Goals

- **Unit Test Coverage**: Minimum 80% code coverage
- **Property Test Coverage**: All 16 correctness properties implemented
- **Integration Test Coverage**: Critical user flows (search, filter, pagination)
- **Edge Case Coverage**: All identified edge cases tested

