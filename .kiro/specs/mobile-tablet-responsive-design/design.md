# Design Document: Mobile and Tablet Responsive Design

## Overview

This design document outlines the technical implementation for making the entire Next.js application responsive across mobile (< 768px), tablet (768px - 1024px), and desktop (≥ 1024px) viewports. The solution leverages Tailwind CSS's responsive utilities, custom React hooks for breakpoint detection, and component-level adaptations to ensure optimal user experience across all device sizes.

The application contains multiple user flows (authentication, business/employer, talent, mentor) with numerous pages, modals, tables, forms, and interactive components. The responsive system will transform layouts, hide/show components conditionally, adapt navigation patterns, and optimize touch interactions for mobile and tablet devices.

### Key Design Principles

1. **Mobile-First Approach**: Base styles target mobile viewports, with progressive enhancement for larger screens
2. **Performance-Conscious**: Minimize re-renders, lazy load components, and optimize bundle size for mobile
3. **Touch-Friendly**: All interactive elements meet minimum 44x44px tap target requirements
4. **Consistent Breakpoints**: Use Tailwind's standard breakpoint system consistently across the application
5. **Graceful Degradation**: Maintain full functionality across all breakpoints, adapting UI patterns as needed
6. **Accessibility**: Preserve ARIA labels, keyboard navigation, and screen reader compatibility

## Architecture

### Breakpoint System

The responsive system is built on Tailwind CSS's default breakpoint configuration:

- **sm**: 640px (small phones in landscape, reference point)
- **md**: 768px (tablets in portrait, primary mobile/tablet boundary)
- **lg**: 1024px (tablets in landscape, primary tablet/desktop boundary)
- **xl**: 1280px (desktop)
- **2xl**: 1536px (large desktop)

**Viewport Classifications**:

- **Mobile_Viewport**: < 768px (below md breakpoint)
- **Tablet_Viewport**: 768px - 1023px (md to lg breakpoint)
- **Desktop_Viewport**: ≥ 1024px (lg breakpoint and above)

### Core Utilities Layer

#### Breakpoint Detection Hooks

Three custom hooks provide programmatic breakpoint detection for conditional rendering and logic:

**useIsMobile Hook** (already exists, will be enhanced):

```typescript
// Returns true for viewports < 768px
const isMobile = useIsMobile();
```

**useIsTablet Hook** (new):

```typescript
// Returns true for viewports 768px - 1023px
const isTablet = useIsTablet();
```

**useBreakpoint Hook** (new):

```typescript
// Returns current breakpoint name: 'mobile' | 'tablet' | 'desktop'
const breakpoint = useBreakpoint();
```

These hooks use `window.matchMedia` with proper event listeners for real-time updates and SSR-safe initialization.

#### Responsive Utility Components

**ResponsiveContainer Component**:
Wrapper component that provides consistent padding and max-width constraints across breakpoints.

**ConditionalRender Component**:
Declarative component for showing/hiding content based on breakpoint:

```typescript
<ConditionalRender mobile tablet desktop>
  {children}
</ConditionalRender>
```

### Component Architecture Layers

#### 1. Navigation System

**Desktop Sidebar** (≥ 1024px):

- Full-width sidebar (240px) with icons and labels
- Fixed position on left side
- ProfileSwitcher at bottom
- Notification badges visible

**Tablet Sidebar** (768px - 1023px):

- Collapsed sidebar (64px) with icons only
- Labels appear on hover
- Fixed position on left side
- Maintains all navigation items

**Mobile Navigation** (< 768px):

- Desktop sidebar hidden completely
- Hamburger menu button in header (top-left)
- Slide-out drawer from left on menu tap
- Full navigation items in drawer
- ProfileSwitcher in drawer
- Auto-close on navigation selection
- Overlay backdrop when open

**Implementation Components**:

- `MobileNav`: Hamburger button + drawer component
- `TabletSidebar`: Collapsed icon-only sidebar
- `DesktopSidebar`: Full sidebar (existing)
- `NavigationDrawer`: Shared drawer content for mobile

#### 2. Modal System

All modals adapt based on viewport:

**Mobile Modals** (< 768px):

- Full-screen overlay (100vw x 100vh)
- Slide-up animation from bottom
- Close button top-right (44x44px minimum)
- Reduced padding (16px)
- Vertical button stacking
- Scrollable content area

**Tablet Modals** (768px - 1023px):

- 90% screen width with max-width constraints
- Centered positioning
- Standard padding (24px)
- Buttons can be horizontal if space permits

**Desktop Modals** (≥ 1024px):

- Fixed widths as designed
- Centered positioning
- Full padding (32px)

**Modal Component Wrapper**:
A `ResponsiveModal` wrapper component that handles viewport-specific rendering for all modal types.

#### 3. Data Display System

**Table to Card Transformation**:

Mobile viewports transform tables into card-based layouts:

- Each table row becomes a card
- Column headers become labels within cards
- Actions appear as dropdown menu in card
- Sorting/filtering maintained
- Pagination adapted for mobile

**Grid Layouts**:

- Mobile: 1 column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 3-4 columns (lg:grid-cols-3 or lg:grid-cols-4)

**Implementation Components**:

- `ResponsiveTable`: Wrapper that switches between table and card view
- `TableCard`: Card representation of table row
- `ResponsiveGrid`: Grid with responsive column counts

#### 4. Form System

Forms adapt to maximize usability on smaller screens:

**Mobile Forms** (< 768px):

- Single column layout (all fields full-width)
- Increased input height (48px minimum)
- Labels above inputs
- Vertical button stacking
- Full-width buttons

**Tablet/Desktop Forms**:

- Multi-column layouts where designed
- Standard input heights
- Horizontal button groups

**Form Components**:

- All existing form components enhanced with responsive classes
- No new wrapper needed, just Tailwind utility updates

#### 5. Dashboard and Stats

**Stat Cards Grid**:

- Mobile: 1 column (grid-cols-1)
- Tablet: 2 columns (md:grid-cols-2)
- Desktop: 4 columns (lg:grid-cols-4)

**Charts**:

- Responsive width (w-full)
- Height adjusts based on viewport
- Legends positioned below on mobile
- Touch-friendly tooltips

### Touch Interaction Layer

**Touch Target Requirements**:

- Minimum 44x44px for all interactive elements
- 8px minimum spacing between touch targets
- Visual feedback on touch (active states)
- Disable hover-only interactions on touch devices

**Swipe Gestures**:

- Dismissible modals with swipe-down gesture
- Horizontal scrolling for tabs and chips
- Swipe navigation for carousels

### Performance Optimization Layer

**Code Splitting**:

- Lazy load mobile-specific components
- Separate bundles for navigation variants
- Dynamic imports for modals

**Image Optimization**:

- Next.js Image component with responsive sizes
- Serve appropriately sized images per viewport
- Lazy loading for below-fold images

**Virtual Scrolling**:

- Implement for long lists on mobile
- Reduces DOM nodes and improves performance

## Components and Interfaces

### New Hooks

#### useIsTablet

```typescript
export function useIsTablet(): boolean {
  const [isTablet, setIsTablet] = useState<boolean | undefined>(undefined);

  useEffect(() => {
    const mql = window.matchMedia("(min-width: 768px) and (max-width: 1023px)");
    const onChange = () => {
      setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    };
    mql.addEventListener("change", onChange);
    setIsTablet(window.innerWidth >= 768 && window.innerWidth < 1024);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  return !!isTablet;
}
```

#### useBreakpoint

```typescript
type Breakpoint = "mobile" | "tablet" | "desktop";

export function useBreakpoint(): Breakpoint {
  const [breakpoint, setBreakpoint] = useState<Breakpoint>("desktop");

  useEffect(() => {
    const updateBreakpoint = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setBreakpoint("mobile");
      } else if (width < 1024) {
        setBreakpoint("tablet");
      } else {
        setBreakpoint("desktop");
      }
    };

    updateBreakpoint();
    window.addEventListener("resize", updateBreakpoint);
    return () => window.removeEventListener("resize", updateBreakpoint);
  }, []);

  return breakpoint;
}
```

### New Components

#### ResponsiveModal

Wrapper component for all modals that handles viewport-specific rendering:

```typescript
interface ResponsiveModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  size?: "sm" | "md" | "lg" | "xl";
}

export function ResponsiveModal({
  isOpen,
  onClose,
  children,
  title,
  size = "md",
}: ResponsiveModalProps) {
  const isMobile = useIsMobile();

  // Mobile: full-screen, Tablet/Desktop: sized modal
  const modalClasses = isMobile
    ? "fixed inset-0 z-50 bg-background"
    : `fixed inset-0 z-50 flex items-center justify-center p-4`;

  const contentClasses = isMobile
    ? "h-full w-full flex flex-col"
    : `bg-background rounded-lg shadow-lg ${sizeClasses[size]} max-h-[90vh] flex flex-col`;

  // Implementation details...
}
```

#### MobileNav

Mobile navigation component with hamburger menu and drawer:

```typescript
export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="p-2 hover:bg-gray-100 rounded-lg"
        aria-label="Open navigation menu"
      >
        <MenuIcon className="h-6 w-6" />
      </button>

      <NavigationDrawer
        isOpen={isOpen}
        onClose={() => setIsOpen(false)}
      />
    </>
  );
}
```

#### NavigationDrawer

Slide-out drawer for mobile navigation:

```typescript
interface NavigationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NavigationDrawer({ isOpen, onClose }: NavigationDrawerProps) {
  // Slide-in from left animation
  // Contains all navigation items
  // ProfileSwitcher at bottom
  // Overlay backdrop
  // Auto-close on navigation
}
```

#### ResponsiveTable

Wrapper that switches between table and card view:

```typescript
interface ResponsiveTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  onRowAction?: (row: T, action: string) => void;
}

export function ResponsiveTable<T>({
  data,
  columns,
  onRowAction
}: ResponsiveTableProps<T>) {
  const isMobile = useIsMobile();

  if (isMobile) {
    return <TableCardView data={data} columns={columns} onRowAction={onRowAction} />;
  }

  return <TableView data={data} columns={columns} onRowAction={onRowAction} />;
}
```

#### TableCard

Card representation of a table row for mobile:

```typescript
interface TableCardProps<T> {
  row: T;
  columns: ColumnDef<T>[];
  onAction?: (action: string) => void;
}

export function TableCard<T>({ row, columns, onAction }: TableCardProps<T>) {
  // Renders each column as label: value pair
  // Actions as dropdown menu
  // Touch-friendly tap targets
}
```

#### ConditionalRender

Declarative component for breakpoint-based rendering:

```typescript
interface ConditionalRenderProps {
  mobile?: boolean;
  tablet?: boolean;
  desktop?: boolean;
  children: React.ReactNode;
}

export function ConditionalRender({
  mobile = false,
  tablet = false,
  desktop = false,
  children
}: ConditionalRenderProps) {
  const breakpoint = useBreakpoint();

  const shouldRender = (
    (mobile && breakpoint === 'mobile') ||
    (tablet && breakpoint === 'tablet') ||
    (desktop && breakpoint === 'desktop')
  );

  return shouldRender ? <>{children}</> : null;
}
```

### Component Modifications

The following existing components will be modified with responsive Tailwind classes:

#### Navigation Components

- `DesktopSidebar`: Add `hidden lg:flex` to hide on mobile/tablet
- `ProfileSwitcher`: Adapt for mobile drawer placement
- Header components: Add mobile hamburger menu

#### Modal Components

All modals wrapped with `ResponsiveModal`:

- ApplicantFilterModal
- HireOpportunitiesModal
- ScheduleInterviewModal
- RescheduleInterviewModal
- DeclineApplicationModal
- HireApplicationModal
- CancelInterviewModal
- HiredTalentFilterModal
- OpportunitiesFilterModal
- UploadWorksModal
- CreateServiceModal
- ApplicationFilterModal
- MentorFilterModal
- FilterModal
- RecommendationModal
- HireFilterModal
- NotificationsModal
- NotificationDetailPanel
- ConfirmationModal
- RescheduleModal
- ReviewModal
- RoleSwitchModal
- SuccessModal

#### Table Components

Wrapped with `ResponsiveTable`:

- ApplicantsTable
- OpportunitiesTable
- ApplicationsTable
- SessionsTable
- InterviewsTable

#### Grid Components

Add responsive grid classes:

- TalentGrid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- OpportunitiesGrid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- WorksGrid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- ServicesGrid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`
- RecommendationsGrid: `grid-cols-1 md:grid-cols-2 lg:grid-cols-3`

#### Form Components

Add responsive form classes:

- PostOpportunityForm
- EditOpportunityForm
- EmployerEditProfile
- TalentEditProfile
- MentorEditProfile
- OnboardingForms
- LoginForm
- SignupForm

#### Dashboard Components

Add responsive stat grid classes:

- EmployerDashboard: Stats grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- TalentDashboard: Stats grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- MentorDashboard: Stats grid `grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
- Chart components: Responsive width and height

#### Profile Components

Add responsive layout classes:

- EmployerProfile: Stack sections on mobile
- TalentProfile: Stack sections on mobile
- MentorProfile: Stack sections on mobile
- TalentProfileView: Stack sections on mobile
- Profile navigation: Horizontal scrollable tabs on mobile

#### Search and Filter Components

Add responsive classes:

- SearchAndFilters: Stack on mobile, full-width search
- DiscoverTalentHeader: Responsive layout
- OpportunitiesHeader: Responsive layout
- ApplicantsHeader: Responsive layout

## Data Models

### Breakpoint Type

```typescript
type Breakpoint = "mobile" | "tablet" | "desktop";
```

### Responsive Configuration

```typescript
interface ResponsiveConfig {
  breakpoints: {
    mobile: number; // 768
    tablet: number; // 1024
  };
  touchTargetSize: number; // 44
  touchTargetSpacing: number; // 8
}
```

### Modal Size Mapping

```typescript
const modalSizeClasses = {
  sm: "max-w-sm",
  md: "max-w-md md:max-w-lg",
  lg: "max-w-lg md:max-w-2xl",
  xl: "max-w-xl md:max-w-4xl",
};
```

### Grid Column Mapping

```typescript
const gridColumnClasses = {
  talent: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  opportunities: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
  stats: "grid-cols-1 md:grid-cols-2 lg:grid-cols-4",
  works: "grid-cols-1 md:grid-cols-2 lg:grid-cols-3",
};
```
