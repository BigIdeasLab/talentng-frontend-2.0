# Requirements Document

## Introduction

This document specifies requirements for applying UI/UX improvements to the recruiter opportunities page. These improvements have been successfully implemented across other pages (upcoming, my-applications, discover-talent) and need to be consistently applied to the opportunities page to ensure a unified user experience across the application.

## Glossary

- **Opportunities_Page**: The recruiter-facing page that displays posted job opportunities at `components/employer/opportunities/EmployerOpportunities.tsx`
- **Filter_Modal**: The modal component that allows users to filter opportunities by various criteria
- **Search_Input**: The text input field that allows users to search for opportunities
- **Filter_Button**: The button that opens the Filter_Modal
- **Date_Range_Filter**: Button-style filters for selecting time periods (All Time, Today, This Week, This Month)
- **Skeleton_Loader**: Loading placeholder UI shown during initial data fetch
- **Empty_State**: UI displayed when no opportunities match the current filters or search query
- **Active_Filter**: A filter that has been applied and is currently affecting the displayed results

## Requirements

### Requirement 1: Auto-Apply Filters on Outside Click

**User Story:** As a recruiter, I want filters to be automatically applied when I click outside the filter modal, so that I don't have to explicitly click "Apply Filter" every time.

#### Acceptance Criteria

1. WHEN the Filter_Modal is open AND the user clicks outside the modal, THE Opportunities_Page SHALL apply the current filter selections
2. WHEN filters are auto-applied via outside click, THE Filter_Modal SHALL close
3. WHEN filters are auto-applied, THE Opportunities_Page SHALL fetch new data with the applied filters
4. THE Opportunities_Page SHALL maintain the existing "Apply Filter" button functionality for explicit application

### Requirement 2: Visual Indication of Active Filters

**User Story:** As a recruiter, I want to see when filters are active, so that I understand why certain opportunities are being displayed.

#### Acceptance Criteria

1. WHEN one or more Active_Filter exists, THE Filter_Button SHALL display a purple background color (#8463FF with 5% opacity)
2. WHEN one or more Active_Filter exists, THE Filter_Button SHALL display a purple border color (#8463FF)
3. WHEN one or more Active_Filter exists, THE Filter_Button SHALL display purple text color (#8463FF)
4. WHEN no Active_Filter exists, THE Filter_Button SHALL display the default gray styling
5. THE Filter_Button SHALL display a count badge showing the number of Active_Filter items
6. THE count badge SHALL be displayed inline with the button text
7. THE count badge SHALL exclude opportunity type filters from the count (as these are controlled by tabs)

### Requirement 3: Debounced Search with Loading Indicator

**User Story:** As a recruiter, I want search to wait until I finish typing, so that the system doesn't make unnecessary API calls while I'm still entering my search query.

#### Acceptance Criteria

1. WHEN the user types in the Search_Input, THE Opportunities_Page SHALL wait 500 milliseconds before triggering a search
2. WHEN a new character is typed before the 500ms delay completes, THE Opportunities_Page SHALL reset the delay timer
3. WHEN the search is triggered, THE Opportunities_Page SHALL use the `q` parameter for API calls
4. WHILE a search API call is in progress, THE Search_Input SHALL display a loading spinner
5. WHEN the search query is empty, THE Opportunities_Page SHALL fetch all opportunities without search filtering

### Requirement 4: Clear Search Functionality

**User Story:** As a recruiter, I want to quickly clear my search query, so that I can easily return to viewing all opportunities.

#### Acceptance Criteria

1. WHEN the Search_Input contains text, THE Opportunities_Page SHALL display an X icon button inside the search field
2. WHEN the user clicks the X icon, THE Opportunities_Page SHALL clear the search query
3. WHEN the search query is cleared via the X icon, THE Opportunities_Page SHALL fetch opportunities without search filtering
4. WHEN the Search_Input is empty, THE X icon SHALL not be displayed

### Requirement 5: Optimized Loading States

**User Story:** As a recruiter, I want to see smooth transitions when filtering or searching, so that the interface feels responsive and I can track what's happening.

#### Acceptance Criteria

1. WHEN the Opportunities_Page loads for the first time, THE Opportunities_Page SHALL display the Skeleton_Loader
2. WHEN filters or search parameters change after initial load, THE Opportunities_Page SHALL keep the current opportunity list visible
3. WHEN new data is being fetched after initial load, THE Opportunities_Page SHALL not display the Skeleton_Loader
4. WHEN new data arrives, THE Opportunities_Page SHALL smoothly transition to displaying the new results

### Requirement 6: Context-Aware Empty States

**User Story:** As a recruiter, I want helpful messages when no opportunities are found, so that I understand whether there's no data or my filters are too restrictive.

#### Acceptance Criteria

1. WHEN no opportunities match the current filters AND Active_Filter exists, THE Empty_State SHALL display "No opportunities found"
2. WHEN no opportunities match the current filters AND Active_Filter exists, THE Empty_State SHALL display "Try adjusting your filters" as the description
3. WHEN no opportunities exist AND no Active_Filter exists AND no search query exists, THE Empty_State SHALL display "No opportunities available"
4. WHEN no opportunities exist AND no Active_Filter exists AND no search query exists, THE Empty_State SHALL display a helpful description about posting opportunities
5. WHEN a search query exists AND no results are found, THE Empty_State SHALL display "No opportunities found"
6. WHEN a search query exists AND no results are found, THE Empty_State SHALL display "Try adjusting your search query or filters" as the description

### Requirement 7: Consistent Loading States

**User Story:** As a recruiter, I want to see smooth transitions when filtering or searching, so that the interface feels responsive and I can track what's happening.

#### Acceptance Criteria

1. WHEN the Opportunities_Page loads for the first time, THE Opportunities_Page SHALL display the Skeleton_Loader
2. WHEN filters or search parameters change after initial load, THE Opportunities_Page SHALL keep the current opportunity list visible
3. WHEN new data is being fetched after initial load, THE Opportunities_Page SHALL not display the Skeleton_Loader
4. WHEN new data arrives, THE Opportunities_Page SHALL smoothly transition to displaying the new results

### Requirement 8: Consistent Filter Count Badge Styling

**User Story:** As a recruiter, I want the filter count badge to match the styling used in other pages, so that the interface feels consistent.

#### Acceptance Criteria

1. WHEN Active_Filter exists, THE Filter_Button SHALL display a count badge
2. THE count badge SHALL use the same styling as the upcoming and my-applications pages
3. THE count badge SHALL be positioned inline with the "Filter" text
4. THE count badge SHALL include counts for: skills and types

### Requirement 9: Preserve User Context During Filter Changes

**User Story:** As a recruiter, I want to maintain my position and context when applying filters, so that I don't lose track of where I was in the list.

#### Acceptance Criteria

1. WHEN filters are applied, THE Opportunities_Page SHALL maintain the current view
2. WHEN search query changes, THE Opportunities_Page SHALL maintain the current view
3. THE Opportunities_Page SHALL maintain scroll position within the current page view

### Requirement 10: Consistent API Parameter Naming

**User Story:** As a developer, I want consistent API parameter naming across all pages, so that the codebase is maintainable and predictable.

#### Acceptance Criteria

1. WHEN making search API calls, THE Opportunities_Page SHALL use the `q` parameter for search queries
2. WHEN making filter API calls, THE Opportunities_Page SHALL use consistent parameter names matching other pages
3. THE Opportunities_Page SHALL maintain backward compatibility with existing API endpoints
