# Responsive Design Quick Reference

## Breakpoints

| Viewport | Size           | Tailwind             | Hook                               |
| -------- | -------------- | -------------------- | ---------------------------------- |
| Mobile   | < 768px        | `(default)`, `sm:`   | `useIsMobile()`                    |
| Tablet   | 768px - 1023px | `md:`                | `useIsTablet()`                    |
| Desktop  | ≥ 1024px       | `lg:`, `xl:`, `2xl:` | `!useIsMobile() && !useIsTablet()` |

## Common Patterns

### Layout Patterns

```css
/* Single column mobile, multi-column desktop */
.responsive-grid {
  @apply grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3;
}

/* Stack on mobile, horizontal on desktop */
.responsive-flex {
  @apply flex flex-col md:flex-row;
}

/* Full width mobile, constrained desktop */
.responsive-width {
  @apply w-full lg:w-auto;
}
```

### Spacing Patterns

```css
/* Responsive padding */
.responsive-padding {
  @apply p-4 md:p-6 lg:p-8;
}

/* Responsive margins */
.responsive-margin {
  @apply m-2 md:m-4 lg:m-6;
}

/* Responsive gaps */
.responsive-gap {
  @apply gap-2 md:gap-4 lg:gap-6;
}
```

### Typography Patterns

```css
/* Responsive headings */
.responsive-h1 {
  @apply text-2xl md:text-3xl lg:text-4xl;
}

.responsive-h2 {
  @apply text-xl md:text-2xl lg:text-3xl;
}

.responsive-body {
  @apply text-sm md:text-base;
}
```

## Touch Targets

### Minimum Sizes

```css
/* Buttons */
.touch-button {
  @apply min-h-[44px] min-w-[44px] px-4 py-2;
}

/* Icon buttons */
.touch-icon-button {
  @apply min-h-[44px] min-w-[44px] p-2;
}

/* Form inputs */
.touch-input {
  @apply min-h-[44px] px-3 py-2;
}

/* Dropdown items */
.touch-dropdown-item {
  @apply min-h-[44px] px-4 py-2;
}
```

### Spacing

```css
/* Minimum spacing between touch targets */
.touch-spacing {
  @apply space-x-2 space-y-2;
}
```

## Component Quick Reference

### ResponsiveTable

```typescript
<ResponsiveTable
  data={items}
  columns={columns}
  actions={actions}
  mobileCardRenderer={customRenderer}
/>
```

### ResponsiveGrid

```typescript
<ResponsiveGrid columns={3} gap={4}>
  {items.map(item => <Card key={item.id} />)}
</ResponsiveGrid>
```

### ResponsiveModal

```typescript
<ResponsiveModal
  isOpen={isOpen}
  onClose={onClose}
  title="Modal Title"
  size="md"
  swipeEnabled={true}
>
  Content
</ResponsiveModal>
```

### MobileDrawer

```typescript
<MobileDrawer
  isOpen={isOpen}
  onClose={onClose}
  swipeToClose={true}
>
  Navigation content
</MobileDrawer>
```

## Visibility Classes

```css
/* Hide on mobile */
.hide-mobile {
  @apply hidden md:block;
}

/* Show only on mobile */
.mobile-only {
  @apply block md:hidden;
}

/* Show only on tablet */
.tablet-only {
  @apply hidden md:block lg:hidden;
}

/* Show only on desktop */
.desktop-only {
  @apply hidden lg:block;
}

/* Hide on desktop */
.hide-desktop {
  @apply block lg:hidden;
}
```

## Hook Usage

```typescript
// Basic responsive detection
const isMobile = useIsMobile();
const isTablet = useIsTablet();
const breakpoint = useBreakpoint();

// Conditional rendering
{isMobile ? <MobileComponent /> : <DesktopComponent />}

// Conditional props
<Component columns={isMobile ? 1 : 3} />

// Conditional classes
<div className={isMobile ? "mobile-class" : "desktop-class"}>
```

## Performance Tips

```typescript
// Lazy load heavy components
const HeavyComponent = lazy(() => import('./HeavyComponent'));

// Conditional loading
{!isMobile && (
  <Suspense fallback={<Skeleton />}>
    <HeavyComponent />
  </Suspense>
)}

// Simplified mobile versions
<Chart simplified={isMobile} />
```

## Testing Breakpoints

```typescript
// In tests
import { testBreakpoints } from "@/tests/utils/responsive-testing";

testBreakpoints((breakpoint) => {
  it(`renders correctly on ${breakpoint}`, () => {
    // Test implementation
  });
});
```

## Common Mistakes to Avoid

❌ **Don't:**

```typescript
// Using fixed pixel values
<div className="w-[320px]">

// Not considering touch targets
<button className="p-1 text-xs">

// Forgetting SSR compatibility
if (isMobile) { // isMobile might be undefined initially
```

✅ **Do:**

```typescript
// Use responsive classes
<div className="w-full md:w-auto">

// Ensure touch targets
<button className="min-h-[44px] px-4 py-2">

// Handle SSR
if (isMobile === undefined) return <Skeleton />;
if (isMobile) {
```

## Debugging

```typescript
// Add to component for debugging
console.log({
  isMobile: useIsMobile(),
  isTablet: useIsTablet(),
  breakpoint: useBreakpoint(),
  viewport: {
    width: window.innerWidth,
    height: window.innerHeight,
  },
});
```

## Browser DevTools

1. Open DevTools (F12)
2. Click device toolbar icon (Ctrl+Shift+M)
3. Select device or set custom dimensions
4. Test responsive behavior

## Useful Tailwind Classes

```css
/* Container queries (when available) */
@container (min-width: 768px) {
  .container-responsive {
    @apply grid-cols-2;
  }
}

/* Aspect ratios */
.responsive-aspect {
  @apply aspect-square md:aspect-video;
}

/* Text truncation */
.responsive-text {
  @apply truncate md:text-clip;
}
```
