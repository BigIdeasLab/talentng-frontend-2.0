# Mobile Scroll Progressive Header Fix - Bugfix Design

## Overview

The mobile mentorship page suffers from janky scroll behavior caused by the MobileProgressiveHeader component creating nested scroll containers. This results in users having to "pull up extra" to reach pagination controls and an inconsistent scroll experience compared to other pages. The fix involves removing MobileProgressiveHeader and implementing a simple single-scroll layout with sticky tabs, following the same pattern successfully applied to the opportunities page.

## Glossary

- **Bug_Condition (C)**: The condition that triggers the bug - when users scroll on the mobile mentorship page with MobileProgressiveHeader creating nested scroll containers
- **Property (P)**: The desired behavior - smooth single-scroll container without nesting, fully accessible pagination controls, and consistent scroll experience
- **Preservation**: Desktop layout, sticky tabs behavior, search/filter functionality, and pagination scroll-to-top behavior that must remain unchanged
- **MobileProgressiveHeader**: A component in `components/talent/opportunities/MobileProgressiveHeader.tsx` that wraps header, tabs, and content with its own scroll container
- **Nested Scroll Containers**: Multiple scrollable elements within each other, causing conflicting scroll behaviors and janky user experience
- **Single-Scroll Layout**: A layout pattern where only one element handles scrolling, with sticky elements positioned using CSS `position: sticky`

## Bug Details

### Bug Condition

The bug manifests when a user scrolls on the mobile mentorship page. The MobileProgressiveHeader component creates its own scroll container (`overflow-y-auto`) which nests inside the page's flex layout, resulting in two competing scroll contexts that cause janky behavior and accessibility issues with bottom content.

**Formal Specification:**

```
FUNCTION isBugCondition(input)
  INPUT: input of type ScrollEvent on mobile mentorship page
  OUTPUT: boolean

  RETURN input.viewport == 'mobile'
         AND input.page == 'mentorship'
         AND MobileProgressiveHeader.isUsed == true
         AND hasNestedScrollContainers() == true
END FUNCTION
```

### Examples

- **Scrolling to pagination**: User scrolls down to page 2 button, but has to "pull up extra" beyond the natural scroll endpoint to fully reveal the pagination controls
- **Scroll feel comparison**: User navigates from opportunities page (smooth single scroll) to mentorship page (janky nested scroll) and notices the inconsistent behavior
- **Content accessibility**: User tries to interact with bottom content but the nested scroll container makes it harder to reach
- **Edge case - rapid scrolling**: User rapidly scrolls up and down, experiencing stuttering and inconsistent scroll momentum due to nested containers

## Expected Behavior

### Preservation Requirements

**Unchanged Behaviors:**

- Desktop layout with static header, tabs, and scrollable content area must continue to work exactly as before
- Category tabs on mobile must remain visible and sticky at the top while scrolling
- Search and filter functionality must continue to display results correctly with pagination
- Pagination controls must continue to scroll to the top of results smoothly when clicked

**Scope:**
All inputs that do NOT involve mobile viewport scrolling on the mentorship page should be completely unaffected by this fix. This includes:

- Desktop viewport behavior (any screen size >= md breakpoint)
- Tab switching and filtering logic
- Search functionality and API calls
- Pagination state management and navigation

## Hypothesized Root Cause

Based on the bug description and code analysis, the root cause is:

1. **Nested Scroll Container Architecture**: The MobileProgressiveHeader component creates its own scroll container with `overflow-y-auto` on a div that wraps all content. This div is nested inside the page's flex layout (`flex-1 flex flex-col overflow-hidden`), creating two scroll contexts.

2. **Conflicting Scroll Behaviors**: When the user scrolls, the browser must decide which scroll container to scroll - the outer page container or the inner MobileProgressiveHeader container. This creates janky behavior and inconsistent scroll momentum.

3. **Content Accessibility Issues**: The nested scroll container's height calculation may not properly account for all content, requiring users to "pull up extra" to reach bottom elements like pagination controls.

4. **Inconsistent Pattern**: The opportunities page was recently fixed by removing MobileProgressiveHeader and using a simple single-scroll layout with `overflow-y-auto` directly on the mobile container and `position: sticky` for tabs. The mentorship page still uses the old problematic pattern.

## Correctness Properties

Property 1: Bug Condition - Single Smooth Scroll Container

_For any_ scroll event on the mobile mentorship page, the fixed layout SHALL provide a single smooth scroll container without nesting, making all content including pagination controls fully accessible without requiring extra scrolling effort, and providing a consistent scroll experience matching other pages like the fixed opportunities page.

**Validates: Requirements 2.1, 2.2, 2.3**

Property 2: Preservation - Desktop and Interaction Behavior

_For any_ interaction that is NOT mobile viewport scrolling (desktop layout, tab switching, search/filter, pagination clicks), the fixed code SHALL produce exactly the same behavior as the original code, preserving the static desktop header, sticky tabs functionality, search/filter results display, and pagination scroll-to-top behavior.

**Validates: Requirements 3.1, 3.2, 3.3, 3.4**

## Fix Implementation

### Changes Required

Assuming our root cause analysis is correct:

**File**: `app/(business)/mentorship/page.tsx`

**Component**: Mobile layout section (lines ~200-300)

**Specific Changes**:

1. **Remove MobileProgressiveHeader wrapper**: Replace the `<MobileProgressiveHeader>` component with a simple div that has `overflow-y-auto` for single-scroll behavior

2. **Restructure mobile layout**: Change from:

   ```tsx
   <MobileProgressiveHeader
     ref={mobileScrollRef}
     header={...}
     tabs={...}
   >
     {content}
   </MobileProgressiveHeader>
   ```

   To:

   ```tsx
   <div className="flex-1 overflow-y-auto">
     {/* Header - scrolls with content */}
     <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA]">
       {header content}
     </div>

     {/* Tabs - sticky */}
     <div className="sticky top-0 z-10 w-full px-[25px] py-[12px] bg-white border-b border-[#E1E4EA]">
       {tabs content}
     </div>

     {/* Content */}
     <div>
       {content}
     </div>
   </div>
   ```

3. **Update scroll-to-top implementation**: Replace the ref-based `mobileScrollRef.current?.scrollToTop()` with direct DOM manipulation or window.scrollTo since we no longer have the MobileProgressiveHeader ref

4. **Remove MobileProgressiveHeader import and ref**: Clean up unused imports and the `mobileScrollRef` variable

5. **Verify sticky positioning**: Ensure tabs use `sticky top-0 z-10` with proper background color to stick correctly during scroll

## Testing Strategy

### Validation Approach

The testing strategy follows a two-phase approach: first, surface counterexamples that demonstrate the bug on unfixed code, then verify the fix works correctly and preserves existing behavior.

### Exploratory Bug Condition Checking

**Goal**: Surface counterexamples that demonstrate the bug BEFORE implementing the fix. Confirm or refute the root cause analysis. If we refute, we will need to re-hypothesize.

**Test Plan**: Manually test the mobile mentorship page on unfixed code to observe nested scroll behavior, pagination accessibility issues, and scroll feel inconsistencies. Document specific examples of janky behavior.

**Test Cases**:

1. **Nested Scroll Detection**: Inspect DOM on mobile mentorship page to confirm two scroll containers exist (will show nested structure on unfixed code)
2. **Pagination Accessibility**: Scroll to bottom and attempt to click pagination controls, measuring if extra scroll effort is required (will fail on unfixed code)
3. **Scroll Feel Comparison**: Navigate between opportunities page (fixed) and mentorship page (unfixed) to document the difference in scroll smoothness (will show inconsistency on unfixed code)
4. **Rapid Scroll Test**: Rapidly scroll up and down to observe stuttering or momentum issues (may show janky behavior on unfixed code)

**Expected Counterexamples**:

- DOM inspection shows MobileProgressiveHeader creates a scroll container nested inside the page's flex container
- Pagination controls require "pulling up extra" beyond natural scroll endpoint
- Scroll momentum feels different/janky compared to opportunities page
- Possible causes: nested scroll containers, conflicting overflow properties, incorrect height calculations

### Fix Checking

**Goal**: Verify that for all inputs where the bug condition holds, the fixed function produces the expected behavior.

**Pseudocode:**

```
FOR ALL scrollEvent WHERE isBugCondition(scrollEvent) DO
  result := mobileLayout_fixed(scrollEvent)
  ASSERT hasSingleScrollContainer(result) == true
  ASSERT paginationFullyAccessible(result) == true
  ASSERT scrollFeelConsistent(result) == true
END FOR
```

**Test Cases**:

1. **Single Scroll Container**: Inspect DOM to verify only one scroll container exists
2. **Pagination Accessibility**: Scroll to bottom and verify pagination controls are fully accessible without extra effort
3. **Scroll Smoothness**: Test scroll momentum and smoothness, comparing to opportunities page
4. **Sticky Tabs**: Verify tabs stick to top correctly during scroll
5. **Content Visibility**: Verify all content is accessible and properly visible during scroll

### Preservation Checking

**Goal**: Verify that for all inputs where the bug condition does NOT hold, the fixed function produces the same result as the original function.

**Pseudocode:**

```
FOR ALL input WHERE NOT isBugCondition(input) DO
  ASSERT mentorshipPage_original(input) = mentorshipPage_fixed(input)
END FOR
```

**Testing Approach**: Manual testing is appropriate for this UI fix because:

- The changes are visual and interaction-based, requiring human observation
- Desktop layout behavior is straightforward to verify visually
- Tab switching, search, and filter functionality can be tested through normal user interactions
- The scope of unchanged behavior is well-defined and limited

**Test Plan**: Observe behavior on UNFIXED code first for desktop layout and interactions, then verify the same behavior continues after fix.

**Test Cases**:

1. **Desktop Layout Preservation**: Verify desktop layout (>= md breakpoint) shows static header with tabs and scrollable content area, unchanged from original
2. **Tab Switching Preservation**: Click through all category tabs and verify they work identically to original
3. **Search Functionality Preservation**: Enter search queries and verify results display correctly with pagination, unchanged from original
4. **Filter Functionality Preservation**: Apply various filters and verify results display correctly, unchanged from original
5. **Pagination Click Preservation**: Click next/previous page buttons and verify scroll-to-top behavior works identically to original

### Unit Tests

- Test that mobile layout renders with single scroll container (no nested MobileProgressiveHeader)
- Test that tabs have correct sticky positioning classes
- Test that pagination controls are rendered within the scrollable area
- Test that scroll-to-top functionality works on pagination clicks

### Property-Based Tests

Not applicable for this UI-focused bugfix. The bug involves visual layout and scroll behavior that requires manual testing rather than property-based testing.

### Integration Tests

- Test full mobile mentorship page flow: load page, scroll through content, interact with tabs, use search/filter, navigate pagination
- Test desktop mentorship page flow to verify no regressions
- Test switching between mobile and desktop viewports (responsive behavior)
- Compare scroll behavior between opportunities page and mentorship page to verify consistency
