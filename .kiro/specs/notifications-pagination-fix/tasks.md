# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Fault Condition** - Extract Data Array from Paginated Response
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate the bug exists
  - **Scoped PBT Approach**: Scope the property to concrete failing cases where API returns `{data: Notification[], pagination: {...}}` but client expects `Notification[]`
  - Test that `getNotifications()` returns an array when API returns paginated response
  - Test that `getServerNotifications()` returns an array when API returns paginated response
  - Test that array methods (`.filter()`, `.map()`) work on the returned result
  - Test that `useNotifications` hook can calculate unread count without crashing
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS with "filter is not a function" or similar (this is correct - it proves the bug exists)
  - Document counterexamples found to understand root cause
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Notification Functionality Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code by mocking API to return direct arrays (simulating pre-pagination behavior)
  - Write property-based tests capturing observed behavior patterns:
    - Filtering by userId, type, deliveryStatus, read status, recipientRole produces expected results
    - Marking individual notifications as read updates state correctly
    - Marking all notifications as read works across different notification sets
    - Unread count calculation produces correct results
    - State updates in useNotifications hook trigger re-renders
    - Error handling continues to work as expected
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code (with mocked direct array responses)
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 3. Fix for notifications pagination response handling

  - [x] 3.1 Update getNotifications in lib/api/notifications/index.ts
    - Modify function to expect paginated response format `{data: Notification[], pagination: any}`
    - Extract and return only the `data` array
    - Keep return type as `Promise<Notification[]>` for backward compatibility
    - Verify dependent functions work correctly: markAllNotificationsAsRead, getUnreadNotificationsCount, getNotificationsByType, getFailedNotifications
    - _Bug_Condition: isBugCondition(input) where input.structure == {data: Array, pagination: Object} AND clientExpects(Array) AND NOT dataArrayExtracted(input)_
    - _Expected_Behavior: Extract data array from paginated response, return Notification[] type_
    - _Preservation: All notification filtering, marking as read, unread count, state updates, and error handling must work exactly as before_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 3.2 Update getServerNotifications in lib/api/notifications/server.ts
    - Modify function to expect paginated response format `{data: Notification[], pagination: any}`
    - Extract and return only the `data` array
    - Keep return type as `Promise<Notification[]>` for backward compatibility
    - _Bug_Condition: isBugCondition(input) where input.structure == {data: Array, pagination: Object} AND clientExpects(Array) AND NOT dataArrayExtracted(input)_
    - _Expected_Behavior: Extract data array from paginated response, return Notification[] type_
    - _Preservation: All notification filtering, marking as read, unread count, state updates, and error handling must work exactly as before_
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

  - [x] 3.3 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - Extract Data Array from Paginated Response
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5_

  - [x] 3.4 Verify preservation tests still pass
    - **Property 2: Preservation** - Notification Functionality Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 3.6, 3.7, 3.8_

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
