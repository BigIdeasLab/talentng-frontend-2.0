# Component Visibility Testing

This document describes the comprehensive component visibility tests for the mobile-tablet-responsive-design specification.

## Overview

The component visibility tests verify that UI components show and hide correctly at different responsive breakpoints according to the design requirements. These tests ensure that:

- Desktop sidebar follows proper visibility rules across breakpoints
- Mobile-specific components appear only when appropriate
- Table columns transform correctly for different screen sizes
- Decorative elements are hidden on mobile to save space
- Utility components (HideOnMobile, ShowOnMobile) work as expected

## Test Categories

### 1. Desktop Sidebar Visibility
Tests the responsive behavior of the main navigation sidebar:

- **Mobile (< 768px)**: Sidebar is completely hidden (`hidden` class)
- **Tablet (768px - 1023px)**: Sidebar is collapsed to icons only (`md:w-16`)
- **Desktop (≥ 1024px)**: Sidebar is full width with labels (`lg:w-[250px]`)

**Key Tests:**
- `sidebar-hidden-mobile` - Verifies sidebar is not visible on mobile
- `sidebar-collapsed-tablet` - Verifies sidebar shows icons only on tablet
- `sidebar-full-desktop` - Verifies full sidebar with labels on desktop
- Logo and ProfileSwitcher visibility rules

### 2. Mobile-Specific Components
Tests components that should only appear on mobile devices:

- **Hamburger Menu**: Visible only on mobile (`< 768px`)
- **Mobile Drawer**: Navigation drawer functionality on mobile
- **Mobile Tabs**: Tab navigation optimized for mobile screens

**Key Tests:**
- `hamburger-menu-mobile-only` - Hamburger menu visible on mobile
- `hamburger-menu-hidden-tablet` - Hamburger menu hidden on tablet/desktop
- `mobile-drawer-functionality` - Mobile drawer opens and functions correctly

### 3. Table Column Visibility
Tests responsive table transformations:

- **Desktop**: Traditional table with all columns visible
- **Tablet**: Horizontal scrolling table with essential columns only
- **Mobile**: Card-based layout replacing table structure

**Key Tests:**
- `table-all-columns-desktop` - All table columns visible on desktop
- `table-essential-columns-tablet` - Only essential columns on tablet
- `table-card-layout-mobile` - Card layout replaces table on mobile
- `opportunities-table-mobile-cards` - Specific table transformations

### 4. Stat Descriptions Visibility
Tests dashboard statistics component visibility:

- **Mobile**: Hide detailed descriptions, show only primary metrics
- **Tablet/Desktop**: Show full descriptions and metrics

**Key Tests:**
- `stat-descriptions-hidden-mobile` - Descriptions hidden on mobile
- `stat-descriptions-shown-desktop` - Descriptions visible on desktop

### 5. Decorative Elements Visibility
Tests non-essential visual elements:

- **Mobile**: Hide decorative elements to save space
- **Desktop**: Show decorative elements for enhanced visual appeal
- **Brand Elements**: Always maintain essential brand elements

**Key Tests:**
- `decorative-elements-hidden-mobile` - Decorative elements hidden on mobile
- `brand-elements-maintained-mobile` - Essential brand elements preserved

### 6. Visibility Utility Components
Tests the HideOnMobile and ShowOnMobile wrapper components:

- **HideOnMobile**: `hidden md:block` - Hidden on mobile, visible on tablet+
- **ShowOnMobile**: `block md:hidden` - Visible on mobile, hidden on tablet+

**Key Tests:**
- `HideOnMobile component` - Proper hiding/showing behavior
- `ShowOnMobile component` - Proper showing/hiding behavior

### 7. Profile Switcher Visibility
Tests profile switcher component placement:

- **Tablet Sidebar**: Hidden in collapsed sidebar
- **Desktop Sidebar**: Visible in full sidebar
- **Mobile Drawer**: Visible in mobile navigation drawer

### 8. Navigation Badge Positioning
Tests notification badge positioning:

- **Tablet**: Absolute positioning on collapsed icons
- **Desktop**: Static positioning next to labels

### 9. Cross-Viewport Consistency
Tests consistent behavior across different user types:

- Employer, Talent, and Mentor dashboards
- Consistent visibility rules regardless of user type

### 10. Accessibility and Focus Management
Tests accessibility considerations:

- Hidden elements are not focusable
- Proper focus management during responsive changes
- Screen reader compatibility

## Test Structure

### Test Files
- `component-visibility.spec.ts` - Main test file with all visibility tests
- `validate-component-visibility-tests.js` - Validation script for test coverage

### Test Helpers
Tests use the shared test utilities from `helpers/test-utils.ts`:

- `testPageResponsive()` - Standard responsive page testing
- `VIEWPORTS` - Consistent viewport configurations
- `mockAuthentication()` - Authentication mocking
- `waitForPageStable()` - Page stability waiting

### Viewport Configuration
```typescript
VIEWPORTS = {
  mobile: { width: 375, height: 812 },   // < 768px
  tablet: { width: 768, height: 1024 },  // 768px - 1023px  
  desktop: { width: 1280, height: 720 }  // ≥ 1024px
}
```

## Running the Tests

### Run All Visibility Tests
```bash
npx playwright test tests/visual-regression/component-visibility.spec.ts
```

### Run Specific Test Category
```bash
npx playwright test tests/visual-regression/component-visibility.spec.ts -g "Desktop Sidebar Visibility"
```

### Validate Test Coverage
```bash
node tests/visual-regression/validate-component-visibility-tests.js
```

## Test Assertions

### Common Assertions Used

**Visibility Assertions:**
- `await expect(element).toBeVisible()` - Element is visible
- `await expect(element).not.toBeVisible()` - Element is hidden
- `await expect(element).toHaveClass(/hidden/)` - Has hidden class

**Responsive Class Assertions:**
- `await expect(element).toHaveClass(/md:hidden/)` - Hidden on tablet+
- `await expect(element).toHaveClass(/lg:block/)` - Visible on desktop
- `await expect(element).toHaveClass(/md:w-16/)` - Tablet width
- `await expect(element).toHaveClass(/lg:w-\[250px\]/)` - Desktop width

**Layout Assertions:**
- `await expect(element).toHaveClass(/overflow-x-auto/)` - Horizontal scroll
- `await expect(element).toHaveClass(/md:absolute/)` - Absolute positioning

## Requirements Mapping

This test suite validates **Requirements 25.4** from the mobile-tablet-responsive-design specification:

- ✅ Component visibility at different breakpoints
- ✅ Desktop sidebar visibility rules  
- ✅ Mobile-specific component visibility
- ✅ Table column visibility on mobile
- ✅ Comprehensive test coverage

## Visual Regression Testing

The tests generate visual regression screenshots for:

- Component states at different breakpoints
- Before/after responsive transformations
- Interactive states (drawer open/closed)
- Focus states and accessibility features

Screenshots are stored in the `test-results/` directory with naming convention:
`{test-name}-{viewport}.png`

## Maintenance

### Adding New Visibility Tests

1. Identify the component and its responsive behavior
2. Add test case to appropriate describe block
3. Use `testPageResponsive()` helper for consistency
4. Include assertions for all relevant breakpoints
5. Update validation script if needed

### Updating Existing Tests

1. Modify test assertions to match new responsive behavior
2. Update viewport configurations if breakpoints change
3. Regenerate visual regression baselines
4. Update documentation

## Troubleshooting

### Common Issues

**Test Failures:**
- Check if component classes match expected responsive patterns
- Verify viewport sizes are correctly set
- Ensure page is fully loaded before assertions

**Visual Regression Failures:**
- Regenerate baselines after intentional design changes
- Check for timing issues with animations
- Verify consistent test environment

**Accessibility Issues:**
- Test with actual screen readers when possible
- Verify focus management with keyboard navigation
- Check ARIA labels and roles are preserved