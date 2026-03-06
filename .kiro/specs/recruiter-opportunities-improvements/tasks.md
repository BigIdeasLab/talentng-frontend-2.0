# Implementation Tasks

- [x] Task 1: Update EmployerOpportunities State Management

Add debounced search, loading optimization, and filter count calculation to the main component.

### Sub-tasks:

- [x] 1.1 Add `debouncedSearchQuery` state variable
- [x] 1.2 Add `isInitialLoadRef` ref with initial value `true`
- [x] 1.3 Add `searchTimeoutRef` ref for debounce timer
- [x] 1.4 Create `handleSearchDebounced` method with 500ms debounce
- [x] 1.5 Create `handleClearSearch` method to clear search and timer
- [x] 1.6 Create `getFilterCount` method that counts skills and types
- [x] 1.7 Update query to use `debouncedSearchQuery` instead of `searchQuery`

- [x] Task 2: Optimize Loading States in EmployerOpportunities

Implement loading optimization to show skeleton only on initial load.

### Sub-tasks:

- [x] 2.1 Wrap skeleton loader display with `isInitialLoadRef.current` check
- [x] 2.2 Set `isInitialLoadRef.current = false` after first successful data fetch
- [x] 2.3 Keep current opportunities visible during subsequent fetches
- [x] 2.4 Test that skeleton shows only on initial page load
- [x] 2.5 Test that opportunities remain visible when filters/search change

- [x] Task 3: Update SearchAndFilters Component

Add loading indicator, clear button, and filter count badge.

### Sub-tasks:

- [x] 3.1 Add `isSearching` prop to SearchAndFiltersProps interface
- [x] 3.2 Add `onClearSearch` prop to SearchAndFiltersProps interface
- [x] 3.3 Add `filterCount` prop to SearchAndFiltersProps interface
- [x] 3.4 Replace search icon with loading spinner when `isSearching` is true
- [x] 3.5 Add X button that appears when `searchQuery` is not empty
- [x] 3.6 Wire up X button onClick to call `onClearSearch`
- [x] 3.7 Update filter button to show purple styling when `filterCount > 0`
- [x] 3.8 Add filter count badge inline with "Filter" text

- [x] Task 4: Update OpportunitiesFilterModal for Auto-Apply

Modify the shared filter modal to auto-apply filters when clicking outside.

### Sub-tasks:

- [x] 4.1 Ensure `handleApplyFilter` or `onApply` is wrapped in useCallback
- [x] 4.2 Update useEffect to call `onApply(filters)` before `onClose()` when clicking outside modal
- [x] 4.3 Ensure Apply Filter button still works for explicit application
- [x] 4.4 Test that filters are applied when clicking outside modal bounds

- [x] Task 5: Implement Context-Aware Empty States

Update empty state logic to show different messages based on context.

### Sub-tasks:

- [x] 5.1 Create `getEmptyStateProps` helper function in EmployerOpportunities
- [x] 5.2 Implement logic: if `searchQuery` exists, show "No opportunities found" / "Try adjusting your search query or filters"
- [x] 5.3 Implement logic: if `appliedFilters` exist (and no search), show "No opportunities found" / "Try adjusting your filters"
- [x] 5.4 Implement logic: if no filters and no search, show default message
- [x] 5.5 Pass computed props to EmptyState component

- [x] Task 6: Wire Up All Components in EmployerOpportunities

Connect all updated components with proper props and state.

### Sub-tasks:

- [x] 6.1 Pass `isSearching` prop to SearchAndFilters (derived from isPending or isLoading during search)
- [x] 6.2 Pass `onClearSearch` handler to SearchAndFilters
- [x] 6.3 Pass `filterCount` from `getFilterCount()` to SearchAndFilters
- [x] 6.4 Update `onSearchChange` to use `handleSearchDebounced`
- [x] 6.5 Update EmptyState to use context-aware props from `getEmptyStateProps()`

- [x] Task 7: Test Search Debounce Functionality

Verify search debounce works correctly with 500ms delay.

### Sub-tasks:

- [x] 7.1 Test that typing in search input waits 500ms before triggering API call
- [x] 7.2 Test that rapid typing resets the debounce timer
- [x] 7.3 Test that clearing search via X button immediately triggers API call
- [x] 7.4 Test that loading spinner appears during search API call
- [x] 7.5 Test that empty search query fetches all opportunities

- [x] Task 8: Test Auto-Apply Filter Functionality

Verify filters auto-apply when clicking outside the modal.

### Sub-tasks:

- [x] 8.1 Test that clicking outside filter modal applies current filter selections
- [x] 8.2 Test that clicking outside filter modal closes the modal
- [x] 8.3 Test that auto-applied filters trigger API call with correct parameters
- [x] 8.4 Test that Apply Filter button still works for explicit application

- [x] Task 9: Test Loading State Optimization

Verify loading states work correctly for initial load vs subsequent updates.

### Sub-tasks:

- [x] 9.1 Test that skeleton loader appears on initial page load
- [x] 9.2 Test that skeleton loader does NOT appear when applying filters after initial load
- [x] 9.3 Test that skeleton loader does NOT appear when changing search query after initial load
- [x] 9.4 Test that current opportunities remain visible during filter/search updates

- [x] Task 10: Test Empty State Messages

Verify empty state displays correct messages based on context.

### Sub-tasks:

- [x] 10.1 Test empty state with active filters shows "No opportunities found" / "Try adjusting your filters"
- [x] 10.2 Test empty state with search query shows "No opportunities found" / "Try adjusting your search query or filters"
- [x] 10.3 Test empty state with no filters/search shows default message

- [x] Task 11: Test Filter Count Badge

Verify filter count badge displays correct count.

### Sub-tasks:

- [x] 11.1 Test that filter count includes skills and types
- [x] 11.2 Test that filter button shows purple styling when count > 0
- [x] 11.3 Test that filter button shows default styling when count = 0
- [x] 11.4 Test that count badge is displayed inline with button text

- [x] Task 12: Write Property-Based Tests

Implement property-based tests for all 11 correctness properties.

### Sub-tasks:

- [x] 12.1 Write PBT for Property 1: Auto-Apply Filters on Outside Click
- [x] 12.2 Write PBT for Property 2: Filter Button Visual State
- [x] 12.3 Write PBT for Property 3: Filter Count Badge Accuracy
- [x] 12.4 Write PBT for Property 4: Search Debounce Behavior
- [x] 12.5 Write PBT for Property 5: Search API Parameter Naming
- [x] 12.6 Write PBT for Property 6: Search Loading Indicator
- [x] 12.7 Write PBT for Property 7: Clear Button Visibility
- [x] 12.8 Write PBT for Property 8: Clear Button Functionality
- [x] 12.9 Write PBT for Property 9: Loading State Optimization
- [x] 12.10 Write PBT for Property 10: Empty State with Active Filters
- [x] 12.11 Write PBT for Property 11: Empty State with Search Query
