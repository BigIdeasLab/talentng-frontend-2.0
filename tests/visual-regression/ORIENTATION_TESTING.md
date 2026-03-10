# Orientation Change Testing Documentation

## Overview

This document describes the comprehensive orientation change testing suite for the mobile-tablet responsive design implementation. The tests verify that the application handles device orientation changes correctly, preserves user state, and adapts layouts appropriately.

## Test Files

### 1. `orientation-changes.spec.ts`

Comprehensive test suite covering all aspects of orientation change handling:

- **Orientation Change Event Handling**: Tests basic orientation transitions and rapid changes
- **State Preservation**: Verifies form data, scroll position, and modal state preservation
- **Layout Adaptation**: Tests landscape mode adaptations for different page types
- **Cross-Page Testing**: Tests orientation changes across all major pages
- **Navigation Testing**: Tests mobile navigation behavior during orientation changes
- **Modal Behavior**: Tests modal sizing and behavior during orientation changes
- **Touch Target Consistency**: Verifies touch-friendly targets remain accessible

### 2. `orientation-core.spec.ts`

Focused test suite for core orientation functionality:

- Basic portrait to landscape transitions
- Form data preservation
- Touch target consistency
- Rapid orientation change handling

## Test Coverage

### Pages Tested

- Authentication pages (login, signup)
- Dashboard pages (employer, talent, mentor)
- Business pages (opportunities, applicants, calendar)
- Profile pages
- Settings pages

### Orientation Scenarios

- Portrait mobile (375x812) → Landscape mobile (812x375)
- Landscape mobile → Portrait mobile
- Rapid orientation changes (multiple quick transitions)
- Orientation changes with open modals/drawers

### State Preservation Tests

- **Form Data**: Input values preserved during orientation changes
- **Scroll Position**: Page scroll position maintained (with reasonable tolerance)
- **Modal State**: Open modals remain functional after orientation changes
- **Navigation State**: Mobile drawer state preserved during changes

### Layout Adaptation Tests

- **Dashboard**: Stats cards adapt from single column to grid layout
- **Data Tables**: Transform from cards to tablet-like layouts in landscape
- **Calendar**: Switches from day/list view to week view in landscape
- **Forms**: Utilize horizontal space better in landscape mode
- **Navigation**: Drawer sizing adapts for landscape orientation

## Key Testing Patterns

### 1. Viewport Transitions

```typescript
// Start in portrait
await page.setViewportSize({ width: 375, height: 812 });
await waitForPageStable(page);

// Change to landscape
await page.setViewportSize({ width: 812, height: 375 });
await waitForPageStable(page);
```

### 2. State Verification

```typescript
// Fill form data
await page.fill('input[type="email"]', "test@example.com");

// Change orientation
await page.setViewportSize({ width: 812, height: 375 });

// Verify data preserved
await expect(page.locator('input[type="email"]')).toHaveValue(
  "test@example.com",
);
```

### 3. Touch Target Testing

```typescript
const boundingBox = await button.boundingBox();
expect(boundingBox.height).toBeGreaterThanOrEqual(40);
expect(boundingBox.width).toBeGreaterThanOrEqual(40);
```

### 4. Layout Adaptation Verification

```typescript
// Verify tablet-like behavior in landscape
const statsGrid = page.locator(".stats-grid");
const boundingBox = await statsGrid.boundingBox();
expect(boundingBox?.width).toBeGreaterThan(600);
```

## Expected Behaviors

### Portrait Mobile (375x812)

- Single column layouts
- Full-screen modals
- Stacked form fields
- Mobile navigation drawer
- Card-based data display

### Landscape Mobile (812x375)

- Tablet-like layouts where appropriate
- Two-column grids for stats/cards
- Horizontal form layouts
- Adapted modal sizing
- Week view for calendar

### State Preservation

- Form inputs maintain their values
- Scroll position preserved (with layout-based adjustments)
- Open modals remain open and functional
- Navigation state maintained

### Touch Targets

- Minimum 44x44px touch targets maintained
- Adequate spacing between interactive elements
- Consistent button sizing across orientations

## Test Execution

### Running All Orientation Tests

```bash
npx playwright test tests/visual-regression/orientation-changes.spec.ts
```

### Running Core Tests Only

```bash
npx playwright test tests/visual-regression/orientation-core.spec.ts
```

### Running Specific Test Groups

```bash
# State preservation tests only
npx playwright test tests/visual-regression/orientation-changes.spec.ts -g "State Preservation"

# Layout adaptation tests only
npx playwright test tests/visual-regression/orientation-changes.spec.ts -g "Layout Adaptation"
```

## Visual Regression Screenshots

The tests generate screenshots for visual comparison:

- `*-portrait-*.png`: Portrait orientation screenshots
- `*-landscape-*.png`: Landscape orientation screenshots
- `*-after-change.png`: Screenshots after orientation transitions
- `*-preserved.png`: Screenshots showing preserved state

## Browser Coverage

Tests run across multiple browser configurations:

- **chromium-mobile**: iPhone 12 simulation (375x812)
- **chromium-tablet**: iPad simulation (768x1024)
- **chromium-desktop**: Desktop Chrome (1280x720)

## Debugging Failed Tests

### Common Issues

1. **Timing Issues**: Increase wait times if layout changes are slow
2. **State Not Preserved**: Check if useOrientationState hooks are properly implemented
3. **Layout Not Adapting**: Verify CSS classes and media queries
4. **Touch Targets Too Small**: Check button/input styling

### Debug Commands

```bash
# Run with headed browser to see what's happening
npx playwright test orientation-changes.spec.ts --headed

# Generate trace for debugging
npx playwright test orientation-changes.spec.ts --trace on

# Update screenshots if layout changes are intentional
npx playwright test orientation-changes.spec.ts --update-snapshots
```

## Requirements Validation

These tests validate the following requirements:

- **Requirement 23.1**: Layout adaptation for landscape orientation
- **Requirement 23.2**: Tablet-like layouts in landscape on mobile
- **Requirement 23.3**: Functionality maintained across orientation changes
- **Requirement 23.4**: User state preserved during orientation changes
- **Requirement 25.3**: Comprehensive orientation change testing

## Maintenance

### Adding New Pages

1. Add page configuration to `testPages` array in cross-page tests
2. Specify appropriate wait selectors
3. Add authentication requirements if needed

### Adding New Test Scenarios

1. Follow existing test patterns
2. Use consistent naming for screenshots
3. Include both portrait and landscape testing
4. Verify touch target accessibility

### Updating Screenshots

When layout changes are intentional:

```bash
npx playwright test orientation-changes.spec.ts --update-snapshots
```

## Integration with CI/CD

These tests should be run as part of the visual regression testing pipeline:

- Run on pull requests affecting responsive layouts
- Compare screenshots against baseline
- Fail builds if orientation handling breaks
- Generate reports for manual review of visual changes
