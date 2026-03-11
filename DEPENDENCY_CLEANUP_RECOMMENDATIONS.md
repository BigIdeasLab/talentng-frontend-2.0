# Dependency Cleanup Recommendations

## ✅ REMOVED (68 packages)
- `@react-three/drei` - 3D graphics library (not used)
- `@react-three/fiber` - React renderer for Three.js (not used)
- `three` - 3D graphics library (not used)
- `@types/three` - TypeScript types for Three.js (not used)
- `@vitest/ui` - Visual UI for Vitest (not actively used)

**Total packages removed: 68**
**Estimated size saved: ~15-20MB in node_modules**

---

## 🔍 CONSIDER REVIEWING (Potentially Unused Radix UI Components)

These Radix UI components may not be used in your codebase. Check if you need them:

### Likely Unused:
- `@radix-ui/react-context-menu` - Right-click context menus
- `@radix-ui/react-menubar` - Menu bars (like File, Edit, View)
- `@radix-ui/react-navigation-menu` - Complex navigation menus
- `@radix-ui/react-hover-card` - Hover cards/popovers
- `@radix-ui/react-toggle` + `@radix-ui/react-toggle-group` - Toggle buttons
- `@radix-ui/react-accordion` - Accordion/collapsible sections
- `@radix-ui/react-collapsible` - Collapsible content
- `@radix-ui/react-aspect-ratio` - Aspect ratio containers
- `@radix-ui/react-slider` - Range sliders
- `@radix-ui/react-progress` - Progress bars

### Other Libraries to Review:
- `embla-carousel-react` - Carousel/slider component
- `vaul` - Drawer component library
- `cmdk` - Command menu (Cmd+K style)
- `react-resizable-panels` - Resizable panel layouts

---

## 📊 HOW TO CHECK IF USED

Run these commands to check usage:

```bash
# Check for Radix UI components
npm run grep-search "@radix-ui/react-context-menu"
npm run grep-search "@radix-ui/react-menubar"
npm run grep-search "@radix-ui/react-navigation-menu"
npm run grep-search "@radix-ui/react-hover-card"
npm run grep-search "@radix-ui/react-toggle"
npm run grep-search "@radix-ui/react-accordion"
npm run grep-search "@radix-ui/react-collapsible"
npm run grep-search "@radix-ui/react-aspect-ratio"
npm run grep-search "@radix-ui/react-slider"
npm run grep-search "@radix-ui/react-progress"

# Check for other libraries
npm run grep-search "embla-carousel"
npm run grep-search "from ['\"']vaul"
npm run grep-search "from ['\"']cmdk"
npm run grep-search "react-resizable-panels"
```

---

## ⚠️ KEEP THESE (Actively Used)

These are essential and should NOT be removed:
- `@radix-ui/react-dialog` - Modals/dialogs
- `@radix-ui/react-dropdown-menu` - Dropdown menus
- `@radix-ui/react-popover` - Popovers
- `@radix-ui/react-select` - Select dropdowns
- `@radix-ui/react-tabs` - Tab components
- `@radix-ui/react-toast` - Toast notifications
- `@radix-ui/react-tooltip` - Tooltips
- `@radix-ui/react-switch` - Toggle switches
- `@radix-ui/react-checkbox` - Checkboxes
- `@radix-ui/react-radio-group` - Radio buttons
- `@radix-ui/react-label` - Form labels
- `@radix-ui/react-scroll-area` - Custom scrollbars
- `@radix-ui/react-separator` - Dividers
- `@radix-ui/react-slot` - Composition utility
- `@radix-ui/react-avatar` - Avatar components
- `@radix-ui/react-alert-dialog` - Alert dialogs

---

## 💡 NEXT STEPS

1. Search for usage of each potentially unused package
2. If no results found, remove with: `npm uninstall <package-name>`
3. Run tests after removal: `npm run test`
4. Run build to verify: `npm run build`
5. Commit changes

---

## 📈 PERFORMANCE IMPACT

**Already achieved:**
- Removed 68 packages
- Reduced node_modules size by ~15-20MB
- Faster npm install times
- Smaller bundle size potential

**Potential additional savings:**
- Each unused Radix UI component: ~100-500KB
- embla-carousel: ~200KB
- vaul: ~50KB
- cmdk: ~100KB
- react-resizable-panels: ~150KB

**Total potential additional savings: ~2-5MB**
