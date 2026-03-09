# Design Document: Mobile and Tablet Responsive Design

## Overview

This design document outlines the comprehensive responsive design system for the Next.js application, enabling seamless user experiences across mobile (< 768px), tablet (768px - 1024px), and desktop (≥ 1024px) viewports. The system leverages Tailwind CSS's utility-first approach combined with custom React hooks to provide a robust, maintainable responsive architecture.

### Goals

- Provide consistent, touch-friendly interfaces across all device sizes
- Maintain feature parity across breakpoints while optimizing for device capabilities
- Ensure performance optimization for mobile devices with limited resources
- Create reusable patterns and components for responsive behavior
- Support both portrait and landscape orientations
- Maintain accessibility standards across all viewports

### Non-Goals

- Native mobile application development
- Progressive Web App (PWA) offline functionality (out of scope for this feature)
- Device-specific optimizations beyond standard responsive breakpoints
- Custom breakpoints beyond Tailwind's default system

## Architecture

### High-Level Architecture

The responsive system follows a layered architecture:

```
┌─────────────────────────────────────────────────────────┐
│                    Application Layer                     │
│  (Pages, Features, Business Logic)                      │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│              Responsive Component Layer                  │
│  (Adaptive Components, Layout Transformers)             │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│           Responsive Utilities Layer                     │
│  (Hooks, Breakpoint Detection, Visibility Control)      │
└─────────────────────────────────────────────────────────┘
                          │
┌─────────────────────────────────────────────────────────┐
│              Tailwind CSS Foundation                     │
│  (Breakpoints, Utilities, Responsive Classes)           │
└─────────────────────────────────────────────────────────┘
```

### Breakpoint Strategy

The system uses Tailwind CSS's default breakpoint system:

| Breakpoint   | Min Width | Max Width | Device Target  | Prefix |
| ------------ | --------- | --------- | -------------- | ------ |
| xs (default) | 0px       | 639px     | Small phones   | (none) |
| sm           | 640px     | 767px     | Large phones   | `sm:`  |
| md           | 768px     | 1023px    | Tablets        | `md:`  |
| lg           | 1024px    | 1279px    | Small desktops | `lg:`  |
| xl           | 1280px    | 1535px    | Large desktops | `xl:`  |
| 2xl          | 1536px    | ∞         | Extra large    | `2xl:` |

**Semantic Breakpoints:**

- **Mobile Viewport**: < 768px (xs + sm)
- **Tablet Viewport**: 768px - 1023px (md)
- **Desktop Viewport**: ≥ 1024px (lg+)

### Component Transformation Patterns

The system employs several transformation patterns:

1. **Layout Transformation**: Grid → Column stacking, Multi-column → Single column
2. **Component Replacement**: Desktop sidebar → Mobile drawer, Table → Card list
3. **Visibility Control**: Show/hide components based on breakpoint
4. **Size Adaptation**: Modal sizing, touch target expansion, typography scaling
5. **Interaction Adaptation**: Hover → Touch, Click → Tap with visual feedback

## Components and Interfaces

### Core Responsive Hooks

#### useIsMobile Hook

**Purpose**: Detect if the current viewport is mobile (< 768px)

**Interface**:

```typescript
function useIsMobile(): boolean;
```

**Implementation Details**:

- Uses `window.matchMedia` for efficient breakpoint detection
- Returns `undefined` initially (SSR compatibility), then `boolean`
- Listens to viewport changes and updates reactively
- Breakpoint threshold: 768px

**Current Implementation**: Already exists at `hooks/useIsMobile.tsx`

#### useIsTablet Hook (New)

**Purpose**: Detect if the current viewport is tablet (768px - 1024px)

**Interface**:

```typescript
function useIsTablet(): boolean;
```

**Implementation Details**:

- Uses `window.matchMedia` with range query
- Returns `true` when viewport is between 768px and 1023px
- Handles SSR with `undefined` initial state
- Updates on viewport resize

#### useBreakpoint Hook (New)

**Purpose**: Get the current breakpoint name for fine-grained control

**Interface**:

```typescript
type Breakpoint = "xs" | "sm" | "md" | "lg" | "xl" | "2xl";

function useBreakpoint(): Breakpoint;
```

**Implementation Details**:

- Returns current breakpoint based on viewport width
- Uses multiple `matchMedia` queries for accuracy
- Provides more granular control than boolean hooks
- Useful for complex responsive logic

### Navigation System

#### Desktop Sidebar Component

**Current Behavior**: Full-width sidebar with icons and labels

**Responsive Adaptations**:

- **Desktop (≥ 1024px)**: Full sidebar with icons and labels
- **Tablet (768px - 1023px)**: Collapsed sidebar with icons only
- **Mobile (< 768px)**: Hidden completely

**Implementation Strategy**:

- Use Tailwind classes: `hidden lg:flex` for desktop sidebar
- Maintain existing sidebar component structure
- Add collapsed state for tablet view

#### Mobile Navigation Drawer (New)

**Purpose**: Provide mobile-optimized navigation

**Interface**:

```typescript
interface MobileDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}
```

**Features**:

- Slide-in animation from left
- Overlay backdrop with blur effect
- Auto-close on navigation item selection
- Contains ProfileSwitcher component
- Displays notification badges
- Touch-friendly tap targets (minimum 44x44px)

**Implementation Details**:

- Use Radix UI Sheet component as foundation
- Implement swipe-to-close gesture
- Trap focus within drawer when open
- Prevent body scroll when drawer is open

#### Hamburger Menu Button (New)

**Purpose**: Toggle mobile navigation drawer

**Visibility**: Only on mobile viewport (< 768px)

**Implementation**:

- Positioned in top-left of mobile header
- Animated icon (hamburger ↔ X)
- Minimum 44x44px tap target
- Accessible with ARIA labels

### Modal System

#### Responsive Modal Wrapper (Enhanced)

**Purpose**: Adapt all modals to viewport size

**Responsive Behavior**:

| Viewport | Width          | Height      | Padding | Position    |
| -------- | -------------- | ----------- | ------- | ----------- |
| Mobile   | 100vw          | 100vh       | 16px    | Full screen |
| Tablet   | 90vw           | max-content | 24px    | Centered    |
| Desktop  | Fixed (varies) | max-content | 32px    | Centered    |

**Implementation Strategy**:

- Enhance existing Modal component with responsive classes
- Use Tailwind: `w-full h-full md:w-[90vw] md:h-auto lg:w-[600px]`
- Ensure all modal content is scrollable
- Position close button in touch-friendly location (top-right, 44x44px)

**Modals Requiring Treatment**:

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

**Modal Content Adaptations**:

- Stack form fields vertically on mobile
- Stack action buttons vertically on mobile with full width
- Reduce padding on mobile (16px vs 32px desktop)
- Ensure scrollable content area

### Data Display Components

#### Responsive Table Component (New)

**Purpose**: Transform tables into mobile-friendly card layouts

**Desktop View** (≥ 1024px):

- Traditional table with all columns
- Sortable headers
- Row actions in dedicated column

**Tablet View** (768px - 1023px):

- Horizontal scrolling table
- Essential columns only
- Sticky first column

**Mobile View** (< 768px):

- Card-based layout
- Each row becomes a card
- Table headers become labels within cards
- Actions in dropdown menu per card

**Interface**:

```typescript
interface ResponsiveTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  mobileCardRenderer?: (item: T) => React.ReactNode;
  essentialColumns?: string[]; // For tablet view
  onRowAction?: (action: string, item: T) => void;
}
```

**Tables Requiring Treatment**:

- ApplicantsTable
- OpportunitiesTable
- ApplicationsTable
- SessionsTable
- InterviewsTable
- HiredTalentTable

#### Responsive Grid Component

**Purpose**: Adapt grid layouts to viewport size

**Grid Columns by Viewport**:

- Mobile: 1 column
- Tablet: 2 columns
- Desktop: 3-4 columns (configurable)

**Implementation**:

```typescript
interface ResponsiveGridProps {
  children: React.ReactNode;
  desktopColumns?: 3 | 4;
  className?: string;
}
```

**Tailwind Classes**:

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4
```

**Grids Requiring Treatment**:

- TalentGrid
- OpportunitiesGrid
- WorksGrid
- ServicesGrid
- RecommendationsGrid

### Form Components

#### Responsive Form Layout

**Mobile Adaptations**:

- All fields stack vertically (single column)
- Input fields expand to full width
- Input height increased to 44px minimum
- Labels positioned above inputs
- Action buttons stack vertically with full width
- Increased spacing between fields (16px)

**Desktop Layout**:

- Multi-column layouts where appropriate
- Inline labels for compact forms
- Horizontal button groups
- Tighter spacing (12px)

**Implementation Strategy**:

- Use Tailwind grid: `grid grid-cols-1 lg:grid-cols-2 gap-4`
- Apply to all form containers
- Ensure touch-friendly input sizing

**Forms Requiring Treatment**:

- PostOpportunityForm
- EditOpportunityForm
- EmployerEditProfile
- TalentEditProfile
- MentorEditProfile
- OnboardingForms
- LoginForm
- SignupForm

### Dashboard Components

#### Stat Cards Layout

**Responsive Grid**:

- Mobile: 1 column (stacked)
- Tablet: 2 columns
- Desktop: 4 columns

**Implementation**:

```
grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4
```

**Content Adaptations**:

- Hide detailed descriptions on mobile
- Maintain primary metric and label
- Scale icon sizes appropriately

#### Chart Components

**Mobile Adaptations**:

- Scale to full container width
- Reduce height for better scrolling
- Position legend below chart
- Simplify tooltips for touch
- Maintain interactivity with touch events

**Implementation Strategy**:

- Use responsive container: `w-full h-[300px] md:h-[400px]`
- Configure Recharts with responsive prop
- Adjust font sizes for mobile readability

## Data Models

### Breakpoint Configuration

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

### Touch Target Configuration

```typescript
// lib/constants/touch-targets.ts
export const TOUCH_TARGET = {
  minSize: 44, // pixels
  minSpacing: 8, // pixels
} as const;
```

### Responsive Component Props

```typescript
// types/responsive.ts
export interface ResponsiveProps {
  hideOnMobile?: boolean;
  hideOnTablet?: boolean;
  hideOnDesktop?: boolean;
  mobileOnly?: boolean;
  tabletOnly?: boolean;
  desktopOnly?: boolean;
}

export interface TouchFriendlyProps {
  touchTarget?: "small" | "medium" | "large";
  touchFeedback?: boolean;
}
```

### Modal Responsive Configuration

```typescript
// types/modal.ts
export interface ResponsiveModalConfig {
  mobileFullScreen?: boolean;
  tabletWidth?: string;
  desktopWidth?: string;
  maxHeight?: string;
  mobilePadding?: string;
  desktopPadding?: string;
}
```
