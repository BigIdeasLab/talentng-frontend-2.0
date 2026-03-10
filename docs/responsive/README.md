# Responsive Design Documentation

This directory contains comprehensive documentation for the responsive design system implemented across the Next.js application.

## 📚 Documentation Files

### [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR_GUIDE.md)
The main comprehensive guide covering:
- Breakpoint strategy and semantic viewports
- Core responsive hooks (`useIsMobile`, `useIsTablet`, `useBreakpoint`)
- Responsive components (`ResponsiveTable`, `ResponsiveGrid`, `ResponsiveModal`, etc.)
- Touch-friendly interaction patterns
- Component visibility management
- Best practices and performance considerations

### [Component Examples](./COMPONENT_EXAMPLES.md)
Practical, copy-paste ready examples showing:
- Navigation implementations (mobile drawer, responsive sidebars)
- Data display patterns (responsive tables, grids)
- Form layouts (multi-column forms, multi-step forms)
- Modal implementations (filter modals, confirmation dialogs)
- Complete page layouts (dashboard, listing pages)

### [Quick Reference](./QUICK_REFERENCE.md)
Fast lookup reference for:
- Breakpoint definitions and hook usage
- Common CSS patterns and utility classes
- Touch target requirements
- Component API quick reference
- Performance tips and debugging helpers

## 🎯 Getting Started

1. **Read the [Responsive Behavior Guide](./RESPONSIVE_BEHAVIOR_GUIDE.md)** for comprehensive understanding
2. **Check [Component Examples](./COMPONENT_EXAMPLES.md)** for implementation patterns
3. **Use [Quick Reference](./QUICK_REFERENCE.md)** for day-to-day development

## 🔧 Key Concepts

### Breakpoint Strategy
- **Mobile**: < 768px (Tailwind: default, `sm:`)
- **Tablet**: 768px - 1023px (Tailwind: `md:`)
- **Desktop**: ≥ 1024px (Tailwind: `lg:`, `xl:`, `2xl:`)

### Core Hooks
```typescript
const isMobile = useIsMobile();    // < 768px
const isTablet = useIsTablet();    // 768px - 1023px  
const breakpoint = useBreakpoint(); // "xs" | "sm" | "md" | "lg" | "xl" | "2xl"
```

### Touch Standards
- **Minimum tap target**: 44x44px (WCAG 2.1 Level AAA)
- **Minimum spacing**: 8px between interactive elements
- **Visual feedback**: Active states for all touch interactions

## 🧩 Core Components

| Component | Purpose | Mobile Behavior |
|-----------|---------|-----------------|
| `ResponsiveTable` | Data tables | Transforms to card layout |
| `ResponsiveGrid` | Grid layouts | 1 → 2 → 3+ columns |
| `ResponsiveModal` | Modals/dialogs | Full-screen overlay |
| `MobileDrawer` | Navigation | Slide-out from left |
| `ResponsiveFormField` | Form inputs | Vertical stacking |
| `ResponsiveFormButtons` | Button groups | Vertical stacking |

## 📱 Testing

### Visual Regression Tests
```bash
npm run test:visual
```

### Manual Device Testing
See [Manual Device Testing Guide](../testing/MANUAL_DEVICE_TESTING_GUIDE.md)

### Browser DevTools
1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Test different viewport sizes

## 🎨 Design Principles

1. **Mobile-First**: Start with mobile styles, enhance for larger screens
2. **Touch-Friendly**: All interactions optimized for touch input
3. **Performance-Conscious**: Lazy loading and code splitting for mobile
4. **Accessible**: Maintain ARIA labels and keyboard navigation
5. **Consistent**: Use semantic breakpoints across all components

## 🔗 Related Documentation

- [Visual Regression Testing](../testing/visual-regression/README.md)
- [Manual Device Testing Guide](../testing/MANUAL_DEVICE_TESTING_GUIDE.md)
- [Touch Interaction Testing](../testing/TOUCH_INTERACTION_TESTING.md)
- [Performance Testing Procedures](../testing/PERFORMANCE_TESTING_PROCEDURES.md)
- [Accessibility Testing Procedures](../testing/ACCESSIBILITY_TESTING_PROCEDURES.md)

## 🆘 Support

For questions about responsive implementation:

1. Check the [Component Examples](./COMPONENT_EXAMPLES.md) for similar patterns
2. Review existing component implementations in the codebase
3. Test on real devices using the [Manual Testing Guide](../testing/MANUAL_DEVICE_TESTING_GUIDE.md)
4. Run visual regression tests to ensure consistency

---

*Last updated: March 2026*
*Version: 1.0.0*