# Implementation Plan

- [ ] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - Nested Scroll Container Detection
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate nested scroll containers and janky behavior
  - **Scoped PBT Approach**: Scope the property to the concrete failing case - mobile mentorship page with MobileProgressiveHeader
  - Test that mobile mentorship page has only ONE scroll container (from Bug Condition in design: hasNestedScrollContainers() == false)
  - Test that pagination controls are fully accessible without extra scroll effort (from Expected Behavior 2.2)
  - Test that scroll behavior is consistent with opportunities page (from Expected Behavior 2.3)
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found:
    - DOM inspection shows MobileProgressiveHeader creates nested scroll container
    - Pagination controls require "pulling up extra" beyond natural scroll endpoint
    - Scroll momentum differs from opportunities page
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3_

- [ ] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Desktop and Interaction Behavior
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for non-buggy inputs (desktop viewport, tab switching, search/filter, pagination clicks)
  - Write property-based tests capturing observed behavior patterns from Preservation Requirements:
    - Desktop layout shows static header with tabs and scrollable content area
    - Category tabs on mobile remain visible and sticky at top while scrolling
    - Search and filter functionality displays results correctly with pagination
    - Pagination controls scroll to top of results smoothly when clicked
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 3. Fix for mobile scroll nested container issue

  - [ ] 3.1 Implement the fix
    - Remove MobileProgressiveHeader wrapper from mobile layout section
    - Replace with simple div that has `overflow-y-auto` for single-scroll behavior
    - Restructure mobile layout to have header (scrolls with content), tabs (sticky), and content sections
    - Update scroll-to-top implementation to use direct DOM manipulation instead of mobileScrollRef
    - Remove MobileProgressiveHeader import and mobileScrollRef variable
    - Ensure tabs use `sticky top-0 z-10` with proper background color
    - _Bug_Condition: isBugCondition(input) where input.viewport == 'mobile' AND input.page == 'mentorship' AND MobileProgressiveHeader.isUsed == true AND hasNestedScrollContainers() == true_
    - _Expected_Behavior: hasSingleScrollContainer(result) == true AND paginationFullyAccessible(result) == true AND scrollFeelConsistent(result) == true_
    - _Preservation: Desktop layout, sticky tabs behavior, search/filter functionality, and pagination scroll-to-top behavior must remain unchanged_
    - _Requirements: 1.1, 1.2, 1.3, 2.1, 2.2, 2.3, 3.1, 3.2, 3.3, 3.4_

  - [ ] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Single Smooth Scroll Container
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify single scroll container exists (no nested MobileProgressiveHeader)
    - Verify pagination controls are fully accessible without extra effort
    - Verify scroll behavior is consistent with opportunities page
    - _Requirements: 2.1, 2.2, 2.3_

  - [ ] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Desktop and Interaction Behavior
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm desktop layout still works correctly
    - Confirm tab switching, search/filter, and pagination clicks still work identically
    - _Requirements: 3.1, 3.2, 3.3, 3.4_

- [ ] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
