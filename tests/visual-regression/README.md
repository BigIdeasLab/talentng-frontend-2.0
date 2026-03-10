# Visual Regression Test Suite

This directory contains comprehensive visual regression tests for the mobile and tablet responsive design implementation. The tests use Playwright to capture screenshots across different viewport sizes and compare them for visual consistency.

## Overview

The visual regression test suite validates the responsive behavior of the application across three main breakpoints:

- **Mobile**: 375px × 812px (< 768px)
- **Tablet**: 768px × 1024px (768px - 1024px)
- **Desktop**: 1280px × 720px (≥ 1024px)

## Test Structure

### Test Files

- `auth.spec.ts` - Authentication pages (login, signup, forgot password)
- `dashboard.spec.ts` - Dashboard pages for all user types (employer, talent, mentor)
- `opportunities.spec.ts` - Opportunities listing, details, and forms
- `applicants.spec.ts` - Applicants listing, profiles, and hiring workflows
- `profiles.spec.ts` - User profiles, editing, and public views
- `modals.spec.ts` - Modal components and responsive behavior
- `navigation.spec.ts` - Navigation components (sidebar, mobile drawer, hamburger menu)
- `responsive-components.spec.ts` - Responsive tables, grids, forms, and other components
- `orientation-changes.spec.ts` - Comprehensive orientation change testing
- `orientation-core.spec.ts` - Core orientation functionality tests

### Helper Utilities

- `helpers/test-utils.ts` - Common utilities for test setup, authentication mocking, and screenshot capture

## Key Features Tested

### Responsive Breakpoints

- Mobile viewport behavior (< 768px)
- Tablet viewport behavior (768px - 1024px)
- Desktop viewport behavior (≥ 1024px)

### Component Transformations

- **Tables**: Desktop table → Tablet horizontal scroll → Mobile cards
- **Grids**: 4 columns → 2 columns → 1 column
- **Navigation**: Full sidebar → Collapsed sidebar → Mobile drawer
- **Modals**: Fixed width → 90% width → Full screen
- **Forms**: Multi-column → Single column with stacked fields

### Touch-Friendly Interactions

- Minimum 44×44px tap targets
- Touch feedback states
- Swipe gestures for dismissible components
- Mobile-optimized dropdowns and menus

### Typography and Spacing

- Responsive heading sizes (20-30% smaller on mobile)
- Minimum 16px body text on mobile
- Responsive padding and margins
- Text overflow handling

### Accessibility

- Keyboard navigation on tablets
- Screen reader compatibility
- Color contrast compliance
- Focus indicators

### Orientation Support

- Portrait to landscape transitions
- State preservation during orientation changes
- Layout adaptation for landscape mobile
- Touch target consistency across orientations
- Rapid orientation change handling

## Running Tests

### Prerequisites

1. Ensure the development server is running on port 8080
2. Install Playwright browsers: `npx playwright install`

### Test Commands

```bash
# Run all visual regression tests
npm run test:visual

# Run tests with UI mode (interactive)
npm run test:visual:ui

# Run tests in headed mode (see browser)
npm run test:visual:headed

# Debug tests step by step
npm run test:visual:debug

# Update baseline screenshots
npm run test:visual:update
```

### Running Specific Tests

```bash
# Run only authentication tests
npx playwright test auth.spec.ts

# Run only mobile tests
npx playwright test --grep "mobile"

# Run only dashboard tests for tablet
npx playwright test dashboard.spec.ts --grep "tablet"

# Run orientation change tests
npx playwright test orientation-changes.spec.ts

# Run core orientation tests only
npx playwright test orientation-core.spec.ts
```

## Test Configuration

The tests are configured in `playwright.config.ts` with:

- Three browser projects for different viewports
- Automatic dev server startup
- Screenshot comparison with 0.2 threshold
- Retry logic for CI environments
- HTML reporter for test results

## Screenshot Management

### Baseline Screenshots

- Stored in `test-results/` directory
- Generated on first test run or with `--update-snapshots`
- Should be committed to version control

### Comparison Logic

- Threshold: 0.2 (20% difference tolerance)
- Max diff pixels: 100
- Full page screenshots by default
- Focused screenshots for specific components

## Mock Data and Authentication

Tests use mock authentication to simulate different user types:

- **Employer**: Access to business features
- **Talent**: Access to talent features
- **Mentor**: Access to mentorship features

Mock data includes:

- User profiles with consistent data
- Authentication tokens
- Local storage state

## Dynamic Content Handling

The test suite handles dynamic content by:

- Hiding timestamps and relative dates
- Disabling animations for consistent screenshots
- Waiting for network idle state
- Waiting for font loading completion
- Mocking time-sensitive data

## Debugging Failed Tests

### Visual Differences

1. Check the HTML report: `npx playwright show-report`
2. Compare actual vs expected screenshots
3. Look for layout shifts, missing elements, or styling changes

### Test Failures

1. Use `--debug` flag to step through tests
2. Check browser console for JavaScript errors
3. Verify mock data and authentication state
4. Ensure development server is running correctly

## Best Practices

### Writing New Tests

1. Use the helper utilities in `test-utils.ts`
2. Follow the naming convention: `test-name-viewport.png`
3. Wait for page stability before screenshots
4. Hide dynamic content that changes between runs
5. Focus on specific components when possible

### Maintaining Tests

1. Update baselines when intentional design changes are made
2. Review failed tests for legitimate regressions
3. Keep test data consistent and predictable
4. Document any special setup requirements

## CI/CD Integration

The tests are configured for CI environments with:

- Retry logic for flaky tests
- Parallel execution disabled for consistency
- Automatic baseline comparison
- HTML report generation

## Troubleshooting

### Common Issues

1. **Flaky tests**: Increase wait times or improve stability checks
2. **Font loading**: Ensure `document.fonts.ready` is awaited
3. **Animation interference**: Disable animations in CSS
4. **Dynamic content**: Add proper data-testid attributes
5. **Viewport issues**: Verify viewport size is set correctly

### Performance Considerations

- Tests run in parallel by default
- Use `fullPage: false` for component-specific tests
- Limit interactions to essential user flows
- Consider test execution time vs coverage trade-offs

## Requirements Coverage

This test suite validates the following requirements from the mobile responsive design specification:

- **25.1**: Visual regression tests for key pages at mobile, tablet, and desktop breakpoints
- **25.2**: Interaction tests for touch behaviors (covered in interaction tests)
- **25.3**: Orientation change tests (comprehensive coverage in orientation-changes.spec.ts)
- **25.4**: Component visibility tests at different breakpoints
- **25.5-25.6**: Manual testing guidelines for real devices

The visual regression tests provide automated validation of the responsive design implementation, ensuring consistent user experience across all supported viewport sizes.
