# Implementation Plan

- [x] 1. Write bug condition exploration test
  - **Property 1: Bug Condition** - React Key Uniqueness Violation
  - **CRITICAL**: This test MUST FAIL on unfixed code - failure confirms the bug exists
  - **DO NOT attempt to fix the test or the code when it fails**
  - **NOTE**: This test encodes the expected behavior - it will validate the fix when it passes after implementation
  - **GOAL**: Surface counterexamples that demonstrate React key prop warnings exist
  - **Scoped PBT Approach**: Scope the property to concrete failing cases - render DataTable with multiple rows and columns, capture console warnings
  - Test that rendering DataTable with data.length > 1 and columns.length > 1 generates React key warnings
  - Verify warnings reference lines 103 (desktop table cells) and 181 (mobile card fields)
  - Verify warning message contains "Each child in a list should have a unique 'key' prop"
  - Verify warning count equals (number of rows) × (number of columns) for each view
  - Run test on UNFIXED code
  - **EXPECTED OUTCOME**: Test FAILS (this is correct - it proves the bug exists)
  - Document counterexamples found: specific warning messages, line numbers, and frequencies
  - Mark task complete when test is written, run, and failure is documented
  - _Requirements: 1.1, 1.2_

- [x] 2. Write preservation property tests (BEFORE implementing fix)
  - **Property 2: Preservation** - Rendering and Behavior Unchanged
  - **IMPORTANT**: Follow observation-first methodology
  - Observe behavior on UNFIXED code for all rendering scenarios
  - Write property-based tests capturing observed behavior patterns:
    - Table headers use column.key as key prop (not composite keys)
    - Loading skeleton uses existing composite key pattern `${i}-${column.key}-${colIndex}`
    - All data displays correctly with proper styling and layout
    - Row click handlers trigger correctly when onRowClick is provided
    - Custom cell renderers (column.render functions) execute and display correctly
    - Pagination controls function properly
    - Mobile/desktop responsive switching works as expected
    - Empty state displays correctly
  - Property-based testing generates many test cases for stronger guarantees
  - Run tests on UNFIXED code
  - **EXPECTED OUTCOME**: Tests PASS (this confirms baseline behavior to preserve)
  - Mark task complete when tests are written, run, and passing on unfixed code
  - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5_

- [x] 3. Fix for DataTable React key uniqueness

  - [x] 3.1 Implement the fix
    - Update desktop table cell keys at line 103: change `key={column.key}` to `key={`${row.id || rowIndex}-${column.key}`}`
    - Update mobile card field keys at line 181: change `key={column.key}` to `key={`${row.id || rowIndex}-${column.key}`}`
    - Ensure table header keys remain `key={column.key}` (correct as-is)
    - Ensure loading skeleton keys remain `key={`${i}-${column.key}-${colIndex}`}` (correct as-is)
    - Use template literal syntax for readability
    - Use same fallback pattern as row keys: `row.id || rowIndex`
    - _Bug_Condition: isBugCondition(input) where input.data.length > 0 AND input.columns.length > 0 AND renderingNestedMaps(input.data, input.columns) AND usingNonUniqueKeys(column.key)_
    - _Expected_Behavior: All rendered list items have unique key props combining row and column identifiers (e.g., `${row.id || rowIndex}-${column.key}`)_
    - _Preservation: Table headers continue using column.key, loading skeleton continues using existing pattern, all rendering/styling/interactivity unchanged_
    - _Requirements: 1.1, 1.2, 2.1, 2.2, 3.1, 3.2, 3.3, 3.4, 3.5_

  - [x] 3.2 Verify bug condition exploration test now passes
    - **Property 1: Expected Behavior** - No React Key Warnings
    - **IMPORTANT**: Re-run the SAME test from task 1 - do NOT write a new test
    - The test from task 1 encodes the expected behavior
    - When this test passes, it confirms the expected behavior is satisfied
    - Run bug condition exploration test from step 1
    - **EXPECTED OUTCOME**: Test PASSES (confirms bug is fixed)
    - Verify no console warnings appear when rendering DataTable with multiple rows and columns
    - Verify all keys are unique in both desktop table view and mobile card view
    - _Requirements: 2.1, 2.2_

  - [x] 3.3 Verify preservation tests still pass
    - **Property 2: Preservation** - Rendering and Behavior Unchanged
    - **IMPORTANT**: Re-run the SAME tests from task 2 - do NOT write new tests
    - Run preservation property tests from step 2
    - **EXPECTED OUTCOME**: Tests PASS (confirms no regressions)
    - Confirm all tests still pass after fix (no regressions)
    - Verify table headers still use column.key
    - Verify loading skeleton still uses existing composite key pattern
    - Verify all rendering, styling, and interactivity unchanged

- [x] 4. Checkpoint - Ensure all tests pass
  - Ensure all tests pass, ask the user if questions arise.
