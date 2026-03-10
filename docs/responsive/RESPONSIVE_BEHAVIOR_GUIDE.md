# Responsive Behavior Guide

## Overview

This guide provides comprehensive documentation for the responsive design system implemented across the Next.js application. The system ensures seamless user experiences across mobile (< 768px), tablet (768px - 1024px), and desktop (≥ 1024px) viewports.

## Table of Contents

1. [Breakpoint Strategy](#breakpoint-strategy)
2. [Core Responsive Hooks](#core-responsive-hooks)
3. [Responsive Components](#responsive-components)
4. [Touch-Friendly Interaction Patterns](#touch-friendly-interaction-patterns)
5. [Component Visibility Management](#component-visibility-management)
6. [Usage Examples](#usage-examples)
7. [Best Practices](#best-practices)

## Breakpoint Strategy

The responsive system uses Tailwind CSS's default breakpoint system with semantic viewport definitions:

### Breakpoint Definitions

| Breakpoint | Min Width | Max Width | Device Target | Tailwind Prefix | Semantic Name |
|------------|-----------|-----------|---------------|-----------------|---------------|
| xs         | 0px       | 639px     | Small phones  | (none)          | Mobile        |
| sm         | 640px     | 767px     | Large phones  | `sm:`           | Mobile        |
| md         | 768px     | 1023px    | Tablets       | `md:`           | Tablet        |
| lg         | 1024px    | 1279px    | Small desktop | `lg:`           | Desktop       |
| xl         | 1280px    | 1535px    | Large desktop | `xl:`           | Desktop       |
| 2xl        | 1536px    | ∞         | Extra large   | `2xl:`          | Desktop       |

### Semantic Viewports

- **Mobile Viewport**: < 768px (xs + sm breakpoints)
- **Tablet Viewport**: 768px - 1023px (md breakpoint)  
- **Desktop Viewport**: ≥ 1024px (lg+ breakpoints)

### Implementation Constants

```typescript
// lib/constants/breakpoints.ts
export const BREAKPOINTS = {
  mobile: 768,
  tablet: 1024,
} as const;

export const TAILWIND_BREAKPOINTS = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
  "2xl": 1536,
} as const;
```
## Core Responsive Hooks

The application provides three core hooks for responsive behavior detection:

### useIsMobile Hook

Detects if the current viewport is mobile (< 768px).

```typescript
import { useIsMobile } from "@/hooks/useIsMobile";

function MyComponent() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <MobileLayout />
      ) : (
        <DesktopLayout />
      )}
    </div>
  );
}
```

**Features:**
- Returns `boolean` (initially `undefined` for SSR compatibility)
- Uses `window.matchMedia` for efficient breakpoint detection
- Automatically updates on viewport changes
- Breakpoint threshold: 768px

### useIsTablet Hook

Detects if the current viewport is tablet (768px - 1024px).

```typescript
import { useIsTablet } from "@/hooks/useIsTablet";

function MyComponent() {
  const isTablet = useIsTablet();
  
  return (
    <div className={isTablet ? "tablet-layout" : "mobile-or-desktop-layout"}>
      Content
    </div>
  );
}
```

**Features:**
- Returns `boolean` for viewport between 768px and 1023px
- SSR-compatible with `undefined` initial state
- Reactive to viewport changes
- Useful for tablet-specific layouts

### useBreakpoint Hook

Returns the current breakpoint name for fine-grained control.

```typescript
import { useBreakpoint } from "@/hooks/useBreakpoint";

function MyComponent() {
  const breakpoint = useBreakpoint();
  
  const getColumns = () => {
    switch (breakpoint) {
      case "xs":
      case "sm":
        return 1;
      case "md":
        return 2;
      case "lg":
      case "xl":
      case "2xl":
        return 3;
      default:
        return 1;
    }
  };
  
  return (
    <div className={`grid grid-cols-${getColumns()}`}>
      Content
    </div>
  );
}
```

**Features:**
- Returns `Breakpoint` type: `"xs" | "sm" | "md" | "lg" | "xl" | "2xl"`
- Uses multiple `matchMedia` queries for accuracy
- Provides granular control over responsive behavior
- SSR-compatible
## Responsive Components

### ResponsiveTable Component

Transforms tables into mobile-friendly card layouts while maintaining functionality.

#### Responsive Behavior

- **Desktop (≥ 1024px)**: Traditional table with all columns
- **Tablet (768px - 1023px)**: Horizontal scrolling with essential columns only
- **Mobile (< 768px)**: Card-based layout with table headers as labels

#### Usage Example

```typescript
import { ResponsiveTable, ColumnDef, RowAction } from "@/components/ui/ResponsiveTable";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive";
}

function UsersTable() {
  const columns: ColumnDef<User>[] = [
    {
      key: "name",
      label: "Name",
      essential: true, // Shown on tablet
      accessor: (user) => user.name,
    },
    {
      key: "email", 
      label: "Email",
      essential: true,
      accessor: (user) => user.email,
    },
    {
      key: "role",
      label: "Role", 
      essential: false, // Hidden on tablet
      accessor: (user) => user.role,
    },
    {
      key: "status",
      label: "Status",
      essential: true,
      render: (user) => (
        <span className={user.status === "active" ? "text-green-600" : "text-red-600"}>
          {user.status}
        </span>
      ),
    },
  ];

  const actions: RowAction<User>[] = [
    {
      key: "edit",
      label: "Edit",
      onClick: (user) => handleEdit(user.id),
    },
    {
      key: "delete",
      label: "Delete",
      onClick: (user) => handleDelete(user.id),
      className: "text-red-600",
    },
  ];

  return (
    <ResponsiveTable
      data={users}
      columns={columns}
      actions={actions}
      emptyMessage="No users found"
      showRowNumbers
    />
  );
}
```

#### Custom Mobile Card Renderer

```typescript
const customMobileRenderer = (user: User, index: number) => (
  <div className="space-y-2">
    <div className="flex items-center justify-between">
      <h3 className="font-semibold">{user.name}</h3>
      <span className={`px-2 py-1 rounded text-xs ${
        user.status === "active" ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"
      }`}>
        {user.status}
      </span>
    </div>
    <p className="text-sm text-gray-600">{user.email}</p>
    <p className="text-xs text-gray-500">{user.role}</p>
  </div>
);

<ResponsiveTable
  data={users}
  columns={columns}
  mobileCardRenderer={customMobileRenderer}
/>
```
### ResponsiveGrid Component

Adapts grid layouts to viewport size with configurable column counts.

#### Responsive Behavior

- **Mobile (< 768px)**: Single column layout
- **Tablet (768px - 1023px)**: Two column layout  
- **Desktop (≥ 1024px)**: Three or four columns (configurable)

#### Usage Example

```typescript
import { ResponsiveGrid } from "@/components/ui/ResponsiveGrid";

function ProductGrid() {
  return (
    <ResponsiveGrid columns={3} gap={6}>
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </ResponsiveGrid>
  );
}

// Four-column layout for dense content
function TalentGrid() {
  return (
    <ResponsiveGrid columns={4} gap={4}>
      {talents.map((talent) => (
        <TalentCard key={talent.id} talent={talent} />
      ))}
    </ResponsiveGrid>
  );
}
```

#### Props

```typescript
interface ResponsiveGridProps {
  columns?: 3 | 4;           // Desktop columns (default: 3)
  children: React.ReactNode; // Grid items
  className?: string;        // Additional styling
  gap?: 2 | 3 | 4 | 6 | 8;  // Gap size (default: 4)
}
```

### ResponsiveModal Component

Adapts modal sizing and behavior across different viewports.

#### Responsive Behavior

- **Mobile (< 768px)**: Full-screen overlay (100vw/100vh) with swipe-to-dismiss
- **Tablet (768px - 1023px)**: 90vw width, centered, 24px padding
- **Desktop (≥ 1024px)**: Fixed width based on size prop, 32px padding

#### Usage Example

```typescript
import { ResponsiveModal } from "@/components/ui/ResponsiveModal";

function EditUserModal() {
  return (
    <ResponsiveModal
      isOpen={isOpen}
      onClose={onClose}
      title="Edit User"
      description="Update user information"
      size="md"
      swipeEnabled={true}
      swipeDirection="down"
    >
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-1">Name</label>
          <input 
            type="text" 
            className="w-full px-3 py-2 border rounded-md min-h-[44px]" 
          />
        </div>
        <div>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input 
            type="email" 
            className="w-full px-3 py-2 border rounded-md min-h-[44px]" 
          />
        </div>
      </form>
    </ResponsiveModal>
  );
}
```

#### Props

```typescript
interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children?: React.ReactNode;
  footer?: React.ReactNode;
  size?: "sm" | "md" | "lg";
  closeOnBackdrop?: boolean;
  swipeEnabled?: boolean;        // Default: true
  swipeDirection?: "up" | "down" | "left" | "right"; // Default: "down"
}
```
### MobileDrawer Component

Provides mobile-optimized navigation with slide-out drawer functionality.

#### Usage Example

```typescript
import { MobileDrawer } from "@/components/navigation/MobileDrawer";
import { HamburgerMenuButton } from "@/components/navigation/HamburgerMenuButton";

function MobileNavigation() {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <HamburgerMenuButton 
        isOpen={isOpen}
        onClick={() => setIsOpen(!isOpen)}
        className="lg:hidden" // Only show on mobile/tablet
      />
      
      <MobileDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
        swipeToClose={true}
      >
        <nav className="space-y-2">
          <NavItem href="/dashboard" icon={HomeIcon}>
            Dashboard
          </NavItem>
          <NavItem href="/opportunities" icon={BriefcaseIcon}>
            Opportunities
          </NavItem>
          <NavItem href="/applicants" icon={UsersIcon}>
            Applicants
          </NavItem>
        </nav>
        
        <div className="mt-auto">
          <ProfileSwitcher />
        </div>
      </MobileDrawer>
    </>
  );
}
```

#### Features

- Slide-in animation from left with overlay backdrop
- Swipe-to-close gesture support
- Focus trapping when open
- Body scroll prevention
- Auto-close on navigation selection
- Touch-friendly tap targets (44x44px minimum)

### ResponsiveFormField Component

Adapts form layouts for optimal mobile input experience.

#### Usage Example

```typescript
import { ResponsiveFormField } from "@/components/forms/ResponsiveFormField";
import { ResponsiveFormButtons } from "@/components/forms/ResponsiveFormButtons";

function UserForm() {
  return (
    <form className="space-y-4">
      <ResponsiveFormField
        label="Full Name"
        required
        error={errors.name}
      >
        <input
          type="text"
          className="w-full px-3 py-2 border rounded-md min-h-[44px]"
          {...register("name")}
        />
      </ResponsiveFormField>

      <ResponsiveFormField
        label="Email Address"
        required
        error={errors.email}
      >
        <input
          type="email"
          className="w-full px-3 py-2 border rounded-md min-h-[44px]"
          {...register("email")}
        />
      </ResponsiveFormField>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ResponsiveFormField label="Phone" error={errors.phone}>
          <input
            type="tel"
            className="w-full px-3 py-2 border rounded-md min-h-[44px]"
            {...register("phone")}
          />
        </ResponsiveFormField>

        <ResponsiveFormField label="Company" error={errors.company}>
          <input
            type="text"
            className="w-full px-3 py-2 border rounded-md min-h-[44px]"
            {...register("company")}
          />
        </ResponsiveFormField>
      </div>

      <ResponsiveFormButtons>
        <button
          type="button"
          className="btn-secondary"
          onClick={onCancel}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn-primary"
        >
          Save Changes
        </button>
      </ResponsiveFormButtons>
    </form>
  );
}
```

#### Responsive Behavior

- **Mobile**: Fields stack vertically, full width, labels above inputs
- **Desktop**: Multi-column layouts supported, inline labels where appropriate
- **Touch Targets**: Minimum 44px height for all inputs
- **Button Groups**: Stack vertically on mobile, horizontal on desktop

## Touch-Friendly Interaction Patterns

### Touch Target Requirements

All interactive elements must meet minimum touch target standards:

```typescript
// lib/constants/touch-targets.ts
export const TOUCH_TARGET = {
  minSize: 44,    // pixels - WCAG 2.1 Level AAA standard
  minSpacing: 8,  // pixels - minimum space between targets
} as const;
```

### Implementation Examples

#### Touch-Friendly Buttons

```typescript
// ✅ Good - Meets minimum touch target
<button className="min-h-[44px] min-w-[44px] px-4 py-2 rounded-md">
  Save
</button>

// ✅ Good - Icon button with adequate padding
<button className="p-3 rounded-md" aria-label="Close">
  <XIcon className="w-5 h-5" />
</button>

// ❌ Bad - Too small for touch
<button className="px-2 py-1 text-xs">
  Save
</button>
```

#### Touch-Friendly Dropdowns

```typescript
import { TouchFriendlyDropdown } from "@/components/ui/TouchFriendlyDropdown";

function ActionDropdown() {
  return (
    <TouchFriendlyDropdown
      trigger={
        <button className="min-h-[44px] min-w-[44px] p-2 rounded-md">
          <MoreVerticalIcon className="w-5 h-5" />
        </button>
      }
    >
      <DropdownItem className="min-h-[44px] px-4 py-2">
        Edit
      </DropdownItem>
      <DropdownItem className="min-h-[44px] px-4 py-2">
        Delete
      </DropdownItem>
    </TouchFriendlyDropdown>
  );
}
```

### Swipe Gestures

#### SwipeableModal

```typescript
import { SwipeableModal } from "@/components/ui/SwipeableModal";

function ImageModal() {
  return (
    <SwipeableModal
      isOpen={isOpen}
      onClose={onClose}
      swipeDirection="down"
      swipeThreshold={100}
    >
      <img src={imageUrl} alt="Preview" className="w-full h-auto" />
    </SwipeableModal>
  );
}
```

#### SwipeableNotificationItem

```typescript
import { SwipeableNotificationItem } from "@/components/ui/SwipeableNotificationItem";

function NotificationList() {
  return (
    <div className="space-y-2">
      {notifications.map((notification) => (
        <SwipeableNotificationItem
          key={notification.id}
          onSwipeLeft={() => markAsRead(notification.id)}
          onSwipeRight={() => deleteNotification(notification.id)}
          leftAction={{
            icon: CheckIcon,
            color: "green",
            label: "Mark as read"
          }}
          rightAction={{
            icon: TrashIcon,
            color: "red", 
            label: "Delete"
          }}
        >
          <NotificationContent notification={notification} />
        </SwipeableNotificationItem>
      ))}
    </div>
  );
}
```

### Touch Interaction Feedback

```css
/* styles/touch-friendly.css */
.touch-feedback {
  @apply transition-transform duration-150 ease-out;
}

.touch-feedback:active {
  @apply scale-95;
}

/* Alternative feedback styles */
.touch-feedback-opacity:active {
  @apply opacity-70;
}

.touch-feedback-bg:active {
  @apply bg-gray-100;
}
```

```typescript
// Usage in components
<button className="touch-feedback min-h-[44px] px-4 py-2 rounded-md">
  Touch me
</button>
```

### Hover vs Touch Interactions

```typescript
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

function InteractiveCard() {
  const isTouchDevice = useIsTouchDevice();
  
  return (
    <div 
      className={`
        card p-4 rounded-lg border
        ${isTouchDevice 
          ? 'active:bg-gray-50' 
          : 'hover:bg-gray-50 hover:shadow-md'
        }
      `}
    >
      Content
    </div>
  );
}
```

```css
/* CSS-only approach */
@media (hover: hover) {
  .hover-only:hover {
    @apply bg-gray-50 shadow-md;
  }
}

@media (hover: none) {
  .hover-only:active {
    @apply bg-gray-50;
  }
}
```

## Component Visibility Management

### Utility Components

```typescript
import { 
  HideOnMobile, 
  HideOnTablet, 
  HideOnDesktop,
  ShowOnMobile,
  ShowOnTablet,
  ShowOnDesktop 
} from "@/components/ui/ResponsiveVisibility";

function ResponsiveLayout() {
  return (
    <div>
      {/* Desktop sidebar - hidden on mobile/tablet */}
      <HideOnMobile>
        <HideOnTablet>
          <DesktopSidebar />
        </HideOnTablet>
      </HideOnMobile>
      
      {/* Mobile hamburger - only on mobile */}
      <ShowOnMobile>
        <HamburgerMenuButton />
      </ShowOnMobile>
      
      {/* Tablet collapsed sidebar */}
      <ShowOnTablet>
        <CollapsedSidebar />
      </ShowOnTablet>
      
      {/* Detailed descriptions - hidden on mobile */}
      <div className="space-y-4">
        <h2>Statistics</h2>
        <HideOnMobile>
          <p className="text-gray-600">
            Detailed explanation of the statistics shown below...
          </p>
        </HideOnMobile>
      </div>
    </div>
  );
}
```

### Tailwind Utility Classes

```typescript
// Common responsive visibility patterns
const visibilityClasses = {
  // Hide on mobile, show on tablet+
  hideOnMobile: "hidden md:block",
  
  // Show only on mobile
  mobileOnly: "block md:hidden",
  
  // Show only on tablet
  tabletOnly: "hidden md:block lg:hidden",
  
  // Show only on desktop
  desktopOnly: "hidden lg:block",
  
  // Hide on desktop, show on mobile/tablet
  hideOnDesktop: "block lg:hidden",
};

// Usage
<div className="hidden md:block">Desktop content</div>
<div className="block md:hidden">Mobile content</div>
<div className="hidden md:block lg:hidden">Tablet only</div>
```

## Usage Examples

### Complete Responsive Page Layout

```typescript
import { useIsMobile, useIsTablet } from "@/hooks";
import { 
  ResponsiveTable, 
  ResponsiveGrid, 
  ResponsiveModal,
  MobileDrawer,
  HamburgerMenuButton 
} from "@/components/ui";

function OpportunitiesPage() {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [filterModalOpen, setFilterModalOpen] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Navigation */}
      {isMobile && (
        <>
          <header className="bg-white border-b px-4 py-3 flex items-center justify-between">
            <HamburgerMenuButton 
              isOpen={mobileNavOpen}
              onClick={() => setMobileNavOpen(!mobileNavOpen)}
            />
            <h1 className="text-lg font-semibold">Opportunities</h1>
            <button 
              onClick={() => setFilterModalOpen(true)}
              className="min-h-[44px] min-w-[44px] p-2 rounded-md"
            >
              <FilterIcon className="w-5 h-5" />
            </button>
          </header>
          
          <MobileDrawer
            isOpen={mobileNavOpen}
            onClose={() => setMobileNavOpen(false)}
          >
            <Navigation />
          </MobileDrawer>
        </>
      )}

      {/* Desktop/Tablet Sidebar */}
      <div className="hidden md:block">
        <Sidebar collapsed={isTablet} />
      </div>

      {/* Main Content */}
      <main className={`
        ${isMobile ? 'p-4' : 'md:ml-16 lg:ml-64 p-6'}
      `}>
        {/* Search and Filters */}
        <div className="mb-6 space-y-4 md:space-y-0 md:flex md:items-center md:justify-between">
          <div className="flex-1 max-w-md">
            <input
              type="search"
              placeholder="Search opportunities..."
              className="w-full min-h-[44px] px-4 py-2 border rounded-md"
            />
          </div>
          
          {/* Desktop filters */}
          <div className="hidden md:flex space-x-2">
            <FilterButton>Location</FilterButton>
            <FilterButton>Type</FilterButton>
            <FilterButton>Budget</FilterButton>
          </div>
        </div>

        {/* Opportunities Grid/Table */}
        {isMobile ? (
          <ResponsiveGrid columns={1}>
            {opportunities.map((opportunity) => (
              <OpportunityCard 
                key={opportunity.id} 
                opportunity={opportunity}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))}
          </ResponsiveGrid>
        ) : (
          <ResponsiveTable
            data={opportunities}
            columns={opportunityColumns}
            actions={opportunityActions}
          />
        )}
      </main>

      {/* Filter Modal */}
      <ResponsiveModal
        isOpen={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        title="Filter Opportunities"
        size="md"
      >
        <FilterForm onApply={handleFilterApply} />
      </ResponsiveModal>
    </div>
  );
}
```

### Responsive Dashboard Layout

```typescript
function Dashboard() {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <ResponsiveGrid columns={4} gap={4}>
        <StatCard
          title="Total Applications"
          value="1,234"
          change="+12%"
          hideDescription={isMobile}
        />
        <StatCard
          title="Active Opportunities"
          value="56"
          change="+5%"
          hideDescription={isMobile}
        />
        <StatCard
          title="Interviews Scheduled"
          value="23"
          change="+18%"
          hideDescription={isMobile}
        />
        <StatCard
          title="Hires This Month"
          value="8"
          change="+3%"
          hideDescription={isMobile}
        />
      </ResponsiveGrid>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Application Trends</h3>
          <ResponsiveChart
            data={applicationData}
            height={isMobile ? 300 : 400}
            showLegend={!isMobile}
          />
        </div>
        
        <div className="bg-white p-6 rounded-lg border">
          <h3 className="text-lg font-semibold mb-4">Hiring Pipeline</h3>
          <ResponsiveChart
            data={pipelineData}
            height={isMobile ? 300 : 400}
            showLegend={!isMobile}
          />
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg border">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold">Recent Activity</h3>
        </div>
        
        <ResponsiveTable
          data={recentActivity}
          columns={activityColumns}
          showPagination={!isMobile}
          pageSize={isMobile ? 5 : 10}
        />
      </div>
    </div>
  );
}
```

## Best Practices

### 1. Mobile-First Development

Always start with mobile styles and progressively enhance for larger screens:

```css
/* ✅ Good - Mobile first */
.card {
  @apply p-4 rounded-lg;
}

@screen md {
  .card {
    @apply p-6;
  }
}

@screen lg {
  .card {
    @apply p-8;
  }
}
```

### 2. Touch Target Standards

Ensure all interactive elements meet minimum touch requirements:

```typescript
// ✅ Good - Adequate touch targets
<button className="min-h-[44px] min-w-[44px] px-4 py-2">
  Action
</button>

// ✅ Good - Proper spacing between targets
<div className="flex space-x-2">
  <button className="min-h-[44px] px-4 py-2">Edit</button>
  <button className="min-h-[44px] px-4 py-2">Delete</button>
</div>
```

### 3. Performance Considerations

Optimize for mobile performance:

```typescript
// ✅ Good - Lazy load heavy components
const HeavyChart = lazy(() => import("./HeavyChart"));

function Dashboard() {
  const isMobile = useIsMobile();
  
  return (
    <div>
      {isMobile ? (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart simplified />
        </Suspense>
      ) : (
        <Suspense fallback={<ChartSkeleton />}>
          <HeavyChart />
        </Suspense>
      )}
    </div>
  );
}
```

### 4. Consistent Breakpoint Usage

Use semantic breakpoints consistently:

```typescript
// ✅ Good - Consistent breakpoint usage
const useResponsiveColumns = () => {
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  
  if (isMobile) return 1;
  if (isTablet) return 2;
  return 3;
};

// ✅ Good - Tailwind classes match hook logic
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
```

### 5. Accessibility Maintenance

Preserve accessibility across all breakpoints:

```typescript
// ✅ Good - Maintains ARIA labels
<button 
  className="min-h-[44px] min-w-[44px] p-2"
  aria-label="Close modal"
>
  <XIcon className="w-5 h-5" />
</button>

// ✅ Good - Maintains focus management
<MobileDrawer
  isOpen={isOpen}
  onClose={onClose}
  trapFocus={true}
  restoreFocus={true}
>
```

### 6. Testing Across Devices

Always test responsive behavior on real devices:

```typescript
// Use the provided testing utilities
import { testBreakpoints } from "@/tests/utils/responsive-testing";

describe("OpportunitiesPage", () => {
  testBreakpoints((breakpoint) => {
    it(`renders correctly on ${breakpoint}`, () => {
      // Test implementation
    });
  });
});
```

### 7. Error Handling

Handle responsive hook edge cases:

```typescript
function MyComponent() {
  const isMobile = useIsMobile();
  
  // Handle SSR/initial render
  if (isMobile === undefined) {
    return <LoadingSkeleton />;
  }
  
  return isMobile ? <MobileView /> : <DesktopView />;
}
```

## Related Documentation

- [Visual Regression Testing Guide](../testing/visual-regression/README.md)
- [Manual Device Testing Guide](../testing/MANUAL_DEVICE_TESTING_GUIDE.md)
- [Touch Interaction Testing](../testing/TOUCH_INTERACTION_TESTING.md)
- [Performance Testing Procedures](../testing/PERFORMANCE_TESTING_PROCEDURES.md)
- [Accessibility Testing Procedures](../testing/ACCESSIBILITY_TESTING_PROCEDURES.md)

## Support

For questions about responsive behavior implementation:

1. Check existing component examples in the codebase
2. Review the visual regression tests for expected behavior
3. Test on real devices using the manual testing guide
4. Refer to the Tailwind CSS responsive design documentation

---

*Last updated: March 2026*
*Version: 1.0.0*