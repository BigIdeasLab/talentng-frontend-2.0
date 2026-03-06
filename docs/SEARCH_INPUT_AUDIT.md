# Search Input Audit

Complete inventory of all search inputs across the codebase.

## Summary

Total search inputs found: **20 unique search implementations**

## Search Input Locations

### 1. Talent Applications
**File:** `components/talent/applications/TalentMyApplications.tsx`
- **State:** `searchQuery`, `debouncedSearchQuery`
- **Placeholder:** Dynamic - "Search jobs..." or "Search mentorship requests..."
- **Features:** Clear button, debounced search
- **Search scope:** Jobs and mentorship requests

### 2. Talent Opportunities
**File:** `components/talent/opportunities/search-bar.tsx`
- **State:** `searchQuery` (passed as prop)
- **Placeholder:** "Search opportunities, skills..."
- **Features:** Clear button, loading state
- **Handler:** `onSearchChange` prop
- **Used by:** `components/talent/opportunities/header.tsx`

### 3. Talent Opportunities Filter Modal
**File:** `components/talent/opportunities/OpportunitiesFilterModal.tsx`
- **Multiple search inputs within filter:**
  - Category search: `categorySearch`
  - Skills search: `skillSearch`
  - Experience search: `experienceSearch`
  - Location search: `locationSearch`
- **Placeholders:**
  - "Search Category"
  - "Search Skills"
  - "Search Experience"
  - "Search State"

### 4. Discover Talent
**File:** `components/DiscoverTalent/DiscoverTalentHeader.tsx`
- **State:** `localSearchQuery` (local), `searchQuery` (prop)
- **Placeholder:** "Search talents, skills, or services"
- **Features:** 
  - Debounced search (300ms)
  - Max length validation (100 chars)
  - Clear button
  - Keyboard support
- **Handler:** `handleSearchChange` with debouncing
- **Used by:** `app/(business)/discover-talent/discover-talent-client.tsx`

### 5. Discover Talent Filter Modal
**File:** `components/DiscoverTalent/FilterModal.tsx`
- **Multiple search inputs within filter:**
  - Skills search: `skillSearch`
  - Stack search: `stackSearch`
  - Availability search: `availabilitySearch`
- **Placeholders:**
  - "Search Skills"
  - "Search Stack"
  - "Search Availability"

### 6. Employer Opportunities
**File:** `components/employer/opportunities/SearchAndFilters.tsx`
- **State:** `searchQuery` (passed as prop)
- **Placeholder:** "Search role, Level or jobs"
- **Handler:** `onSearchChange` prop
- **Used by:** `components/employer/opportunities/EmployerOpportunities.tsx`
- **Features:** Debounced search handler

### 7. Employer Opportunities - Applicants View
**File:** `components/employer/opportunities/ApplicantsView.tsx`
- **State:** `searchQuery`
- **Component:** Uses `ApplicantsHeader` component
- **Features:** Sort and filter integration

### 8. Employer Opportunities - Applicants Header
**File:** `components/employer/opportunities/ApplicantsHeader.tsx`
- **State:** `searchQuery` (passed as prop)
- **Placeholder:** "Search name or username"
- **Features:** Inline search input

### 9. Employer Opportunities - Individual Opportunity Applicants
**File:** `app/(business)/opportunities/[id]/applicants/page.tsx`
- **State:** `searchQuery`
- **Placeholder:** "Search name or username"
- **Features:** Inline search with sort integration

### 10. Employer Applicants Filter Modal
**File:** `components/employer/applicants/ApplicantFilterModal.tsx`
- **Search input within filter:**
  - Location search: `locationSearch`
- **Placeholder:** "Search Location"

### 11. Employer Past Hires
**File:** `components/employer/profile/tabs/PastHiresTab.tsx`
- **State:** `searchQuery`
- **Placeholder:** "Search Talent, Role"
- **Features:** Filter modal integration

### 12. Employer Past Hires Filter Modal
**File:** `components/employer/profile/tabs/HireFilterModal.tsx`
- **Search input within filter:**
  - Skills search: `skillSearch`
- **Placeholder:** "Search Skills"

### 13. Employer Upcoming Interviews
**File:** `components/employer/upcoming/RecruiterUpcoming.tsx`
- **State:** `searchQuery`, `debouncedSearchQuery`
- **Placeholder:** "Search interviews by candidate name or position..."
- **Features:** Clear button, debounced search

### 14. Mentor Upcoming Sessions
**File:** `components/mentor/upcoming/MentorUpcoming.tsx`
- **State:** `searchQuery`
- **Placeholder:** "Search sessions by topic or mentee name..."
- **Features:** Clear button

### 15. Mentor Filter Modal
**File:** `components/talent/mentorship/MentorFilterModal.tsx`
- **Multiple search inputs within filter:**
  - Headline search: `headlineSearch`
  - Expertise search: `expertiseSearch`
  - Language search: `languageSearch`
  - Location search: `locationSearch`
- **Placeholders:**
  - "Search/Add Headlines"
  - "Search Expertise"
  - "Search/Add Languages"
  - "Search State"

### 16. Mentorship Page
**File:** `app/(business)/mentorship/page.tsx`
- **State:** `searchQuery`
- **Placeholder:** "Search mentors, topics..."
- **Handler:** `handleMentorSearch` with debouncing

### 17. Applications Page (Mentor)
**File:** `app/(business)/applications/page.tsx`
- **State:** `searchQuery`, `debouncedSearchQuery`
- **Placeholder:** "Search mentee, topic..."
- **Features:** Clear button, debounced search

### 18. Sessions Page
**File:** `app/(business)/sessions/page.tsx`
- **State:** `searchQuery`, `debouncedSearchQuery`
- **Placeholder:** "Search mentee, topic..."
- **Features:** Clear button, debounced search

### 19. Calendar Page
**File:** `app/(business)/calendar/page.tsx`
- **State:** `searchQuery`, `debouncedSearchQuery`
- **Placeholder:** "Search interviews, sessions..."
- **Features:** Clear button, debounced search

### 20. Applicants Page
**File:** `app/(business)/applicants/page.tsx`
- **State:** `searchQuery`, `debouncedSearchQuery`
- **Placeholder:** "Search name, role..."
- **Features:** Clear button, debounced search

### 21. Hired Talents Page
**File:** `app/(business)/applicants/hired-talents/page.tsx`
- **State:** `searchQuery`
- **Placeholder:** "Search name or Role Or Opportunity"

## Search Patterns Identified

### Pattern 1: Simple Search
- Single `searchQuery` state
- Direct onChange handler
- No debouncing

### Pattern 2: Debounced Search
- `searchQuery` + `debouncedSearchQuery` states
- useEffect with setTimeout for debouncing
- Common delay: 300-500ms

### Pattern 3: Component-Based Search
- Search logic extracted to reusable components
- Props: `searchQuery`, `onSearchChange`
- Examples: `SearchBar`, `ApplicantsHeader`, `DiscoverTalentHeader`

### Pattern 4: Filter Modal Search
- Local search states within filter modals
- Used to filter dropdown options
- Multiple search inputs per modal

### Pattern 5: Search with Clear Button
- Conditional rendering of clear button
- onClick handler to reset search: `setSearchQuery("")`

## Common Features

1. **Clear Button:** Most search inputs include a clear/reset button
2. **Debouncing:** Many implementations use debounced search (300-500ms)
3. **Placeholder Text:** All inputs have descriptive placeholders
4. **Styling:** Consistent styling with `font-inter-tight`, `text-[13px]`
5. **Integration:** Often paired with filters, sorting, and pagination

## Recommendations

### Consistency Issues
1. **Inconsistent debounce delays:** Some use 300ms, others 500ms
2. **Mixed patterns:** Some use local state, others use props
3. **Placeholder capitalization:** Inconsistent (some capitalize, some don't)
4. **Search scope clarity:** Some placeholders are vague

### Potential Improvements
1. Create a unified `SearchInput` component
2. Standardize debounce delay (recommend 300ms)
3. Add loading indicators during search
4. Implement search history/suggestions
5. Add keyboard shortcuts (e.g., Cmd+K)
6. Standardize placeholder text format
7. Add search analytics/tracking
8. Implement search result highlighting

## Related Utilities

**File:** `lib/utils/tools.ts`
- Function: `searchTools(query: string): Tool[]`
- Searches tools by name, category, or ID

**File:** `lib/filters/talent-filter.ts`
- Function: `filterTalents(talents, filters, searchQuery)`
- Filters talents based on search query and filter state
- Search fields: fullName, headline, skills, location
