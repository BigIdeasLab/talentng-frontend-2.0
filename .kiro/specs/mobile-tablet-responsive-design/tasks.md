# Implementation Plan: Mobile and Tablet Responsive Design

## Overview

This implementation plan transforms the entire Next.js application into a fully responsive experience across mobile (< 768px), tablet (768px - 1024px), and desktop (≥ 1024px) viewports. The approach follows a bottom-up strategy: building core responsive utilities first, then adapting shared components, and finally implementing page-specific responsive behaviors.

The implementation uses TypeScript with React and leverages Tailwind CSS's utility-first responsive system combined with custom hooks for programmatic breakpoint detection.

## Tasks

- [x] 1. Create core responsive utilities and hooks
  - [x] 1.1 Create useIsTablet hook
    - Implement hook at `hooks/useIsTablet.tsx` using window.matchMedia
    - Detect viewport between 768px and 1023px
    - Handle SSR compatibility with undefined initial state
    - Add resize event listener for reactive updates
    - _Requirements: 1.6_

  - [x] 1.2 Create useBreakpoint hook
    - Implement hook at `hooks/useBreakpoint.tsx` returning current breakpoint name
    - Support breakpoints: 'xs', 'sm', 'md', 'lg', 'xl', '2xl'
    - Use multiple matchMedia queries for accurate detection
    - Handle SSR compatibility
    - _Requirements: 1.7_

  - [x] 1.3 Create breakpoint constants file
    - Create `lib/constants/breakpoints.ts` with BREAKPOINTS and TAILWIND_BREAKPOINTS
    - Export mobile breakpoint (768px) and tablet breakpoint (1024px)
    - Export all Tailwind breakpoint values
    - _Requirements: 1.1, 1.2, 1.3, 1.4_

  - [x] 1.4 Create touch target constants file
    - Create `lib/constants/touch-targets.ts` with TOUCH_TARGET configuration
    - Define minimum touch target size (44px) and spacing (8px)
    - _Requirements: 18.1, 18.2, 18.3_

- [x] 2. Implement mobile navigation system
  - [x] 2.1 Create MobileDrawer component
    - Create component at `components/navigation/MobileDrawer.tsx`
    - Use Radix UI Sheet component as foundation
    - Implement slide-in animation from left with overlay backdrop
    - Add swipe-to-close gesture support
    - Trap focus within drawer when open and prevent body scroll
    - Ensure minimum 44x44px tap targets for all navigation items
    - _Requirements: 2.2, 2.3, 2.7, 18.1_

  - [x] 2.2 Create HamburgerMenuButton component
    - Create component at `components/navigation/HamburgerMenuButton.tsx`
    - Implement animated icon (hamburger ↔ X transition)
    - Ensure 44x44px minimum tap target
    - Add ARIA labels for accessibility
    - Position in top-left of mobile header
    - _Requirements: 2.2, 18.1, 24.3_

  - [x] 2.3 Adapt desktop sidebar for responsive behavior
    - Update sidebar component to use `hidden lg:flex` for desktop visibility
    - Implement collapsed state for tablet view (icons only, 768px-1023px)
    - Add `md:w-16 lg:w-64` for width transitions
    - Hide labels on tablet, show on desktop
    - _Requirements: 2.1, 2.4, 2.5, 2.6_

  - [x] 2.4 Integrate mobile navigation into layout
    - Add MobileDrawer to main layout component
    - Add HamburgerMenuButton visible only on mobile (< 768px)
    - Include ProfileSwitcher component in mobile drawer
    - Display notification and upcoming badges in mobile navigation
    - Auto-close drawer on navigation item selection
    - _Requirements: 2.3, 2.7, 2.8, 2.9_

- [x] 3. Enhance modal system for responsive behavior
  - [x] 3.1 Create responsive modal wrapper utility
    - Create `components/ui/ResponsiveModal.tsx` wrapper component
    - Implement responsive sizing: mobile (100vw/100vh), tablet (90vw), desktop (fixed width)
    - Apply responsive padding: mobile (16px), tablet (24px), desktop (32px)
    - Ensure scrollable content area with proper overflow handling
    - Position close button in touch-friendly location (top-right, 44x44px)
    - _Requirements: 3.1, 3.2, 3.3, 3.4, 3.5, 18.1_

  - [x] 3.2 Adapt form modals for mobile layout
    - Update ApplicantFilterModal, HireOpportunitiesModal, ScheduleInterviewModal
    - Stack form fields vertically on mobile using `flex flex-col md:flex-row`
    - Expand input fields to full width on mobile
    - Increase input height to 44px minimum for touch targets
    - _Requirements: 3.7, 6.1, 6.2, 6.3, 18.1_

  - [x] 3.3 Adapt action button layouts in modals
    - Update all modals to stack action buttons vertically on mobile
    - Apply full width to buttons on mobile: `w-full md:w-auto`
    - Use `flex flex-col md:flex-row gap-2` for button containers
    - Ensure 44x44px minimum button height
    - _Requirements: 3.8, 18.1_

  - [x] 3.4 Apply responsive treatment to remaining modals (Part 1)
    - Update RescheduleInterviewModal, DeclineApplicationModal, HireApplicationModal
    - Update CancelInterviewModal, HiredTalentFilterModal, OpportunitiesFilterModal
    - Apply ResponsiveModal wrapper and mobile layout patterns
    - Test full-screen behavior on mobile, centered on tablet/desktop
    - _Requirements: 3.9_

  - [x] 3.5 Apply responsive treatment to remaining modals (Part 2)
    - Update UploadWorksModal, CreateServiceModal, ApplicationFilterModal
    - Update MentorFilterModal, FilterModal, RecommendationModal, HireFilterModal
    - Apply ResponsiveModal wrapper and mobile layout patterns
    - _Requirements: 3.9_

  - [x] 3.6 Apply responsive treatment to notification and system modals
    - Update NotificationsModal, NotificationDetailPanel
    - Update ConfirmationModal, RescheduleModal, ReviewModal
    - Update RoleSwitchModal, SuccessModal
    - Apply full-screen treatment on mobile with proper scrolling
    - _Requirements: 3.9, 17.1, 17.2_

- [x] 4. Checkpoint - Verify core utilities and navigation
  - Ensure all tests pass, ask the user if questions arise.

- [x] 5. Implement responsive data table system
  - [x] 5.1 Create ResponsiveTable component
    - Create component at `components/ui/ResponsiveTable.tsx`
    - Implement desktop view: traditional table with all columns
    - Implement tablet view: horizontal scrolling with essential columns only
    - Implement mobile view: card-based layout with table headers as labels
    - Add dropdown menu for row actions on mobile
    - Support custom mobile card renderer via prop
    - _Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6_

  - [x] 5.2 Create MobileTableCard component
    - Create component at `components/ui/MobileTableCard.tsx`
    - Display table data as labeled key-value pairs
    - Include action dropdown menu at card bottom
    - Ensure touch-friendly tap targets (44x44px minimum)
    - Apply card styling with proper spacing and borders
    - _Requirements: 4.1, 4.5, 4.6, 18.1_

  - [x] 5.3 Adapt ApplicantsTable to use ResponsiveTable
    - Refactor ApplicantsTable to use ResponsiveTable component
    - Define essential columns for tablet view
    - Create custom mobile card renderer for applicant data
    - Maintain sorting, filtering, and action functionality
    - _Requirements: 4.7, 12.2, 12.5_

  - [x] 5.4 Adapt OpportunitiesTable to use ResponsiveTable
    - Refactor OpportunitiesTable to use ResponsiveTable component
    - Define essential columns for tablet view
    - Create custom mobile card renderer for opportunity data
    - Maintain all table functionality in mobile view
    - _Requirements: 4.7, 12.1, 12.4_

  - [x] 5.5 Adapt remaining data tables
    - Update ApplicationsTable, SessionsTable, InterviewsTable, HiredTalentTable
    - Apply ResponsiveTable component to each
    - Define essential columns and mobile card renderers
    - Test functionality across all breakpoints
    - _Requirements: 4.7, 15.1, 15.2_

- [x] 6. Implement responsive grid layouts
  - [x] 6.1 Create ResponsiveGrid component
    - Create component at `components/ui/ResponsiveGrid.tsx`
    - Support configurable desktop columns (3 or 4)
    - Apply responsive classes: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4`
    - Maintain consistent gap spacing across breakpoints
    - _Requirements: 5.1, 5.2, 5.3, 5.4_

  - [x] 6.2 Adapt TalentGrid and OpportunitiesGrid
    - Update TalentGrid to use ResponsiveGrid component
    - Update OpportunitiesGrid to use ResponsiveGrid component
    - Ensure cards maintain aspect ratios and content hierarchy
    - Test single column on mobile, two columns on tablet, three+ on desktop
    - _Requirements: 5.5, 13.1, 13.2, 13.3_

  - [x] 6.3 Adapt WorksGrid, ServicesGrid, and RecommendationsGrid
    - Update WorksGrid, ServicesGrid, RecommendationsGrid to use ResponsiveGrid
    - Apply appropriate column counts for each grid type
    - Ensure proper spacing and alignment on all breakpoints
    - _Requirements: 5.5_

- [ ] 7. Implement responsive form layouts
  - [x] 7.1 Create responsive form field wrapper
    - Create `components/forms/ResponsiveFormField.tsx` wrapper component
    - Stack fields vertically on mobile, support multi-column on desktop
    - Apply full width on mobile: `w-full lg:w-auto`
    - Increase input height to 44px minimum on mobile
    - Position labels above inputs on mobile
    - _Requirements: 6.1, 6.2, 6.3, 6.4, 18.1_

  - [x] 7.2 Create responsive form button group
    - Create `components/forms/ResponsiveFormButtons.tsx` component
    - Stack buttons vertically on mobile with full width
    - Display horizontally on desktop: `flex flex-col md:flex-row gap-2`
    - Ensure 44px minimum button height
    - _Requirements: 6.7, 18.1_

  - [ ] 7.3 Adapt opportunity forms (Post and Edit)
    - Update PostOpportunityForm and EditOpportunityForm
    - Apply responsive form field wrappers
    - Collapse multi-column layouts to single column on mobile
    - Use responsive button groups for form actions
    - _Requirements: 6.5, 6.8, 12.4_

  - [ ] 7.4 Adapt profile edit forms
    - Update EmployerEditProfile, TalentEditProfile, MentorEditProfile
    - Apply responsive form patterns
    - Ensure profile image upload has touch-friendly controls
    - Stack all sections vertically on mobile
    - _Requirements: 6.8, 8.4_

  - [ ] 7.5 Adapt authentication forms
    - Update LoginForm, SignupForm, ForgotPasswordForm, ResetPasswordForm
    - Apply full width on mobile with appropriate padding
    - Stack form elements vertically
    - Ensure password visibility toggle is touch-friendly (44x44px)
    - _Requirements: 6.8, 10.1, 10.2, 10.4_

  - [ ] 7.6 Adapt onboarding forms
    - Update all onboarding step forms (SelectRoleStep, CreateProfileStep, etc.)
    - Apply responsive form patterns
    - Ensure step progress indicator adapts for narrow screens
    - Maintain navigation buttons in fixed position on mobile
    - _Requirements: 6.8, 11.1, 11.2, 11.3_

- [ ] 8. Checkpoint - Verify data display and forms
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 9. Implement dashboard responsive layouts
  - [x] 9.1 Create responsive stat cards layout
    - Update dashboard stat card containers
    - Apply responsive grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4`
    - Hide detailed descriptions on mobile, keep primary metric and label
    - Scale icon sizes appropriately for each breakpoint
    - _Requirements: 7.1, 7.2, 7.3_

  - [x] 9.2 Adapt chart components for mobile
    - Update WeeklyOverviewChart, HiringPipeline, and other chart components
    - Scale charts to full container width: `w-full h-[300px] md:h-[400px]`
    - Position legends below charts on mobile
    - Configure Recharts with responsive prop
    - Adjust font sizes for mobile readability
    - Maintain touch interactivity for tooltips
    - _Requirements: 7.4, 7.5, 7.6_

  - [ ] 9.3 Adapt EmployerDashboard for responsive layout
    - Update EmployerDashboard page component
    - Apply responsive stat cards layout
    - Ensure charts scale properly on mobile
    - Stack dashboard sections vertically on mobile
    - _Requirements: 7.7_

  - [ ] 9.4 Adapt TalentDashboard and MentorDashboard
    - Update TalentDashboard and MentorDashboard page components
    - Apply responsive patterns for stats and charts
    - Ensure consistent layout behavior across all dashboards
    - _Requirements: 7.7_

- [ ] 10. Implement profile page responsive layouts
  - [ ] 10.1 Adapt profile navigation for mobile
    - Update profile page navigation to horizontal scrollable tabs on mobile
    - Use `flex overflow-x-auto` with touch-friendly tab buttons
    - Maintain vertical sidebar navigation on desktop
    - _Requirements: 8.2_

  - [ ] 10.2 Adapt profile layout structure
    - Stack profile sections vertically on mobile
    - Hide profile sidebar on mobile, show content full-width
    - Apply responsive grid for profile stats: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4`
    - _Requirements: 8.1, 8.3, 8.5_

  - [ ] 10.3 Adapt EmployerProfile and TalentProfile pages
    - Update EmployerProfile and TalentProfile components
    - Apply responsive profile navigation and layout patterns
    - Ensure profile image upload has touch-friendly controls
    - Test profile viewing and editing on all breakpoints
    - _Requirements: 8.6_

  - [ ] 10.4 Adapt MentorProfile and TalentProfileView pages
    - Update MentorProfile and TalentProfileView components
    - Apply responsive layout patterns
    - Ensure all profile sections adapt properly
    - _Requirements: 8.6_

- [ ] 11. Implement search and filter responsive UI
  - [ ] 11.1 Adapt search input for mobile
    - Update search input components to full width on mobile
    - Apply `w-full lg:w-auto` responsive classes
    - Increase input height to 44px minimum
    - _Requirements: 9.1, 18.1_

  - [ ] 11.2 Adapt filter controls for mobile
    - Move filter buttons below search input on mobile
    - Stack filter controls vertically: `flex flex-col md:flex-row`
    - Ensure 44x44px minimum tap targets for filter buttons
    - _Requirements: 9.2, 18.1_

  - [ ] 11.3 Adapt filter chip display
    - Implement horizontal scrolling for filter chips on mobile
    - Use `flex overflow-x-auto gap-2` for chip container
    - Maintain touch-friendly chip removal buttons
    - _Requirements: 9.4_

  - [ ] 11.4 Adapt filter modals for full-screen mobile
    - Ensure all filter modals render full-screen on mobile
    - Apply responsive modal patterns from task 3
    - Test ApplicantFilterModal, OpportunitiesFilterModal, etc.
    - _Requirements: 9.3_

  - [ ] 11.5 Adapt search and filter headers
    - Update DiscoverTalentHeader, OpportunitiesHeader, ApplicantsHeader
    - Apply responsive search and filter patterns
    - Ensure proper layout on all breakpoints
    - _Requirements: 9.6_

- [ ] 12. Implement page-specific responsive layouts (Part 1)
  - [ ] 12.1 Adapt authentication pages
    - Update LoginPage, SignupPage, ForgotPasswordPage, ResetPasswordPage
    - Display auth forms at full width with appropriate padding on mobile
    - Stack form elements vertically
    - Maintain branding and logos with responsive sizing
    - _Requirements: 10.1, 10.2, 10.3, 10.5_

  - [ ] 12.2 Adapt onboarding pages
    - Update OnboardingPage and all step components
    - Display onboarding steps vertically on mobile
    - Adapt step progress indicator for narrow screens
    - Maintain navigation buttons in fixed position on mobile
    - _Requirements: 11.1, 11.2, 11.3, 11.4_

  - [ ] 12.3 Adapt opportunities pages
    - Update OpportunitiesPage and OpportunityDetails components
    - Transform opportunity cards to full-width stacked layout on mobile
    - Display opportunity details in scrollable full-screen view on mobile
    - Maintain all actions (edit, delete, view applicants) with touch-friendly controls
    - _Requirements: 12.1, 12.3, 12.4_

  - [ ] 12.4 Adapt applicants pages
    - Update ApplicantsPage and ApplicantsView components
    - Display applicant list as cards on mobile (using ResponsiveTable from task 5.3)
    - Maintain all applicant actions (schedule, hire, decline) in mobile view
    - Ensure touch-friendly action buttons
    - _Requirements: 12.2, 12.5_

- [ ] 13. Checkpoint - Verify page layouts and interactions
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 14. Implement page-specific responsive layouts (Part 2)
  - [ ] 14.1 Adapt discover talent pages
    - Update DiscoverTalentPage and TalentCard components
    - Apply responsive grid: single column mobile, two columns tablet, three columns desktop
    - Stack talent profile sections vertically on mobile in TalentProfileView
    - Maintain hire functionality with touch-friendly controls
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5, 13.6_

  - [ ] 14.2 Adapt calendar and scheduling pages
    - Update CalendarPage, InterviewsPage, SessionsPage, AvailabilityPage
    - Display calendar in day/list view on mobile, week view on tablet, month view on desktop
    - Provide touch-friendly view switcher controls
    - Display calendar events as touch-friendly cards on mobile
    - Implement mobile-optimized time pickers for scheduling
    - _Requirements: 14.1, 14.2, 14.3, 14.4, 14.5, 14.6, 14.7_

  - [ ] 14.3 Adapt mentorship and sessions pages
    - Update MentorshipPage, SessionsPage components
    - Display session cards in single-column layout on mobile
    - Stack session details vertically on mobile
    - Maintain session actions (reschedule, cancel, complete) with touch-friendly controls
    - _Requirements: 15.1, 15.2, 15.3, 15.4_

  - [ ] 14.4 Adapt settings pages
    - Update EmployerSettings, TalentSettings, MentorSettings components
    - Display settings sections as accordion or stacked layout on mobile
    - Expand settings forms to full width on mobile
    - Maintain all settings functionality with touch-friendly controls
    - _Requirements: 16.1, 16.2, 16.3, 16.4_

  - [ ] 14.5 Adapt notifications pages
    - Update NotificationsModal and NotificationDetailPanel (if not done in task 3.6)
    - Update EmployerNotifications, TalentNotifications, MentorNotifications
    - Display notifications modal as full-screen overlay on mobile
    - Display notification items as full-width cards on mobile
    - Maintain notification actions with touch-friendly controls
    - _Requirements: 17.1, 17.2, 17.3, 17.4_

- [ ] 15. Implement touch-friendly interaction patterns
  - [ ] 15.1 Audit and fix button tap targets
    - Audit all buttons across the application
    - Ensure minimum 44x44px tap target size
    - Add padding where necessary to meet minimum size
    - Apply to primary, secondary, icon, and text buttons
    - _Requirements: 18.1, 18.2_

  - [ ] 15.2 Audit and fix interactive element spacing
    - Audit spacing between interactive elements
    - Ensure minimum 8px spacing between tap targets
    - Apply to button groups, navigation items, form controls
    - _Requirements: 18.3_

  - [ ] 15.3 Implement touch-friendly dropdowns
    - Update dropdown menu components for larger touch targets
    - Increase menu item height to 44px minimum
    - Add adequate spacing between menu items
    - Ensure dropdown triggers are touch-friendly
    - _Requirements: 18.4_

  - [ ] 15.4 Add touch interaction feedback
    - Implement active states for all interactive elements
    - Add visual feedback on tap (scale, opacity, or background change)
    - Use Tailwind's `active:` prefix for touch feedback
    - Test on actual touch devices
    - _Requirements: 18.6_

  - [ ] 15.5 Disable hover-only interactions on touch devices
    - Identify hover-only interactions (tooltips, dropdowns)
    - Implement touch alternatives (tap to show, explicit close buttons)
    - Use `@media (hover: hover)` to conditionally apply hover styles
    - _Requirements: 18.7_

  - [ ] 15.6 Implement swipe gestures for dismissible components
    - Add swipe-to-dismiss for mobile drawer (already in task 2.1)
    - Add swipe-to-dismiss for notification cards
    - Add swipe-to-dismiss for modal sheets where appropriate
    - Use touch event handlers or gesture libraries
    - _Requirements: 18.5_

- [ ] 16. Implement image and media responsiveness
  - [ ] 16.1 Audit and optimize image components
    - Audit all image usage across the application
    - Ensure Next.js Image component is used with responsive sizing
    - Configure appropriate sizes prop for different breakpoints
    - _Requirements: 19.2_

  - [ ] 16.2 Implement responsive image sizing
    - Serve appropriately sized images based on viewport width
    - Use srcset and sizes attributes for optimal loading
    - Apply to profile images, gallery images, company logos
    - _Requirements: 19.1, 19.6_

  - [ ] 16.3 Implement lazy loading for images
    - Enable lazy loading for images below the fold
    - Use Next.js Image component's loading="lazy" prop
    - Test performance improvement on mobile devices
    - _Requirements: 19.3_

  - [ ] 16.4 Maintain image aspect ratios
    - Ensure images maintain aspect ratios across breakpoints
    - Use object-fit and aspect-ratio CSS properties
    - Test gallery and portfolio images on mobile
    - _Requirements: 19.4, 19.5_

- [ ] 17. Implement typography and spacing responsiveness
  - [ ] 17.1 Create responsive typography scale
    - Define responsive heading sizes in Tailwind config or CSS
    - Reduce heading sizes by 20-30% on mobile
    - Apply responsive classes: `text-2xl md:text-3xl lg:text-4xl`
    - _Requirements: 20.1_

  - [ ] 17.2 Ensure readable body text on mobile
    - Audit body text sizes across the application
    - Ensure minimum 16px font size on mobile for readability
    - Apply `text-base` or larger for body content
    - _Requirements: 20.2_

  - [ ] 17.3 Optimize spacing for mobile
    - Reduce padding and margins on mobile to maximize content space
    - Use responsive spacing: `p-4 md:p-6 lg:p-8`
    - Maintain adequate line height for readability
    - _Requirements: 20.3, 20.4_

  - [ ] 17.4 Handle text overflow
    - Implement text truncation for long content on mobile
    - Use `truncate`, `line-clamp`, or ellipsis where appropriate
    - Ensure no horizontal text overflow
    - _Requirements: 20.5_

  - [ ] 17.5 Scale button text appropriately
    - Adjust button text sizes for mobile
    - Ensure button text remains readable at smaller sizes
    - Apply responsive text classes to button components
    - _Requirements: 20.6_

- [ ] 18. Checkpoint - Verify touch interactions and media
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 19. Implement component visibility management
  - [ ] 19.1 Create responsive visibility utility components
    - Create `components/ui/HideOnMobile.tsx` wrapper component
    - Create `components/ui/HideOnTablet.tsx` wrapper component
    - Create `components/ui/HideOnDesktop.tsx` wrapper component
    - Create `components/ui/ShowOnMobile.tsx` wrapper component
    - Use Tailwind classes: `hidden md:block`, `md:hidden`, etc.
    - _Requirements: 21.6_

  - [ ] 19.2 Apply visibility rules to desktop sidebar
    - Hide desktop sidebar on mobile viewport
    - Show collapsed sidebar on tablet viewport
    - Show full sidebar on desktop viewport
    - _Requirements: 21.1_

  - [ ] 19.3 Apply visibility rules to stat descriptions
    - Hide detailed stat descriptions on mobile
    - Show full descriptions on tablet and desktop
    - Maintain primary metrics visible on all breakpoints
    - _Requirements: 21.2_

  - [ ] 19.4 Apply visibility rules to table columns
    - Hide non-essential table columns on mobile
    - Show essential columns on tablet with horizontal scroll
    - Show all columns on desktop
    - _Requirements: 21.3_

  - [ ] 19.5 Apply visibility rules to decorative elements
    - Identify and hide decorative elements on mobile
    - Hide background patterns, illustrations, or non-essential graphics
    - Maintain brand elements and essential visuals
    - _Requirements: 21.4_

  - [ ] 19.6 Apply visibility rules to mobile-specific components
    - Show hamburger menu only on mobile viewport
    - Show mobile tabs only on mobile viewport
    - Hide these components on tablet and desktop
    - _Requirements: 21.5_

- [ ] 20. Implement performance optimizations for mobile
  - [ ] 20.1 Implement lazy loading for below-fold components
    - Identify components below the fold on mobile
    - Use React.lazy() and Suspense for code splitting
    - Implement lazy loading for modals, drawers, and heavy components
    - _Requirements: 22.1_

  - [ ] 20.2 Optimize bundle size with code splitting
    - Analyze bundle size with Next.js bundle analyzer
    - Split large components into separate chunks
    - Implement route-based code splitting
    - Reduce initial bundle size for mobile users
    - _Requirements: 22.2_

  - [ ] 20.3 Optimize animations for mobile
    - Audit animations across the application
    - Reduce animation complexity on mobile devices
    - Use CSS transforms instead of layout-triggering properties
    - Consider disabling non-essential animations on low-end devices
    - _Requirements: 22.3_

  - [ ] 20.4 Implement virtual scrolling for long lists
    - Identify long lists on mobile (applicants, opportunities, notifications)
    - Implement virtual scrolling using react-window or similar
    - Test performance improvement on mobile devices
    - _Requirements: 22.4_

  - [ ] 20.5 Optimize re-renders with memoization
    - Audit components for unnecessary re-renders on mobile
    - Apply React.memo to expensive components
    - Use useMemo and useCallback for expensive computations
    - Test performance on mobile devices
    - _Requirements: 22.5_

  - [ ] 20.6 Implement resource prefetching
    - Prefetch critical resources for mobile navigation
    - Use Next.js Link prefetch for common navigation paths
    - Prefetch data for likely next pages
    - _Requirements: 22.6_

- [ ] 21. Implement orientation support
  - [ ] 21.1 Handle orientation change events
    - Add orientation change event listeners where needed
    - Preserve user state during orientation changes
    - Test state preservation on actual devices
    - _Requirements: 23.3, 23.4_

  - [ ] 21.2 Adapt layouts for landscape orientation
    - Use landscape-specific media queries where appropriate
    - Apply tablet-like layouts in landscape on mobile
    - Test calendar, dashboard, and data-heavy pages in landscape
    - _Requirements: 23.1, 23.2_

  - [ ] 21.3 Test orientation changes across key pages
    - Test authentication pages in both orientations
    - Test dashboard pages in both orientations
    - Test data tables and grids in both orientations
    - Ensure no layout breaks or content overflow
    - _Requirements: 23.1, 23.2_

- [ ] 22. Implement accessibility enhancements for mobile
  - [ ] 22.1 Ensure keyboard navigation on tablets
    - Test keyboard navigation on tablet devices
    - Ensure focus indicators are visible
    - Maintain logical tab order
    - _Requirements: 24.1_

  - [ ] 22.2 Ensure screen reader compatibility
    - Test with mobile screen readers (VoiceOver, TalkBack)
    - Ensure proper ARIA labels on all interactive elements
    - Test navigation announcements
    - _Requirements: 24.2, 24.3_

  - [ ] 22.3 Ensure color contrast on all screen sizes
    - Audit color contrast ratios on mobile
    - Ensure WCAG AA compliance (4.5:1 for normal text)
    - Test in bright sunlight conditions
    - _Requirements: 24.4_

  - [ ] 22.4 Support text scaling
    - Test layouts with increased text size (up to 200%)
    - Ensure layouts don't break with larger text
    - Use relative units (rem, em) instead of fixed pixels
    - _Requirements: 24.5_

  - [ ] 22.5 Implement skip navigation links
    - Add skip navigation links for mobile
    - Allow users to skip to main content
    - Ensure skip links are keyboard accessible
    - _Requirements: 24.6_

- [ ] 23. Final checkpoint and integration testing
  - Ensure all tests pass, ask the user if questions arise.

- [ ] 24. Testing and quality assurance
  - [ ] 24.1 Create visual regression test suite
    - Set up visual regression testing tool (Percy, Chromatic, or similar)
    - Create test cases for key pages at mobile, tablet, and desktop breakpoints
    - Include authentication, dashboard, opportunities, applicants, profile pages
    - _Requirements: 25.1_

  - [ ] 24.2 Create interaction tests for touch behaviors
    - Write tests for mobile drawer open/close
    - Write tests for swipe gestures
    - Write tests for touch-friendly tap targets
    - Write tests for modal interactions on mobile
    - _Requirements: 25.2_

  - [ ] 24.3 Create orientation change tests
    - Write tests for orientation change handling
    - Test state preservation during orientation changes
    - Test layout adaptation in landscape mode
    - _Requirements: 25.3_

  - [ ] 24.4 Create component visibility tests
    - Write tests for component visibility at different breakpoints
    - Test desktop sidebar visibility rules
    - Test mobile-specific component visibility
    - Test table column visibility on mobile
    - _Requirements: 25.4_

  - [ ] 24.5 Perform manual testing on real devices
    - Test on iOS devices (iPhone, iPad)
    - Test on Android devices (various screen sizes)
    - Test on small phones (< 375px width)
    - Test on large phones (> 414px width)
    - Test on small tablets (768px - 900px)
    - Test on large tablets (> 900px)
    - _Requirements: 25.5, 25.6_

  - [ ] 24.6 Create responsive behavior documentation
    - Document responsive patterns and components
    - Create usage examples for ResponsiveTable, ResponsiveGrid, etc.
    - Document breakpoint strategy and hooks
    - Document touch-friendly interaction patterns
    - _Requirements: 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7_

## Notes

- All tasks build incrementally, starting with core utilities and progressing to page-specific implementations
- Each task references specific requirements for traceability
- Checkpoints ensure validation at key milestones
- The implementation uses TypeScript with React and Next.js
- Tailwind CSS is the primary styling framework
- Touch-friendly interactions require minimum 44x44px tap targets
- Mobile viewport is < 768px, tablet is 768px-1023px, desktop is ≥ 1024px
- Performance optimization is critical for mobile devices
- Accessibility must be maintained across all breakpoints
- Testing on real devices is essential for quality assurance
