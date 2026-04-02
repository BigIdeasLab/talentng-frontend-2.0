# Implementation Plan: Admin Frontend Application

## Overview

This plan breaks down the implementation of the admin frontend application into discrete, actionable tasks. The admin app is a standalone Next.js application with 10 core pages for managing the TalentNG platform. Each task builds incrementally, ensuring integration at every step.

## Tasks

- [ ] 1. Project setup and core infrastructure
  - Create admin-app directory structure with Next.js 14 app router
  - Configure TypeScript, ESLint, Prettier, and Tailwind CSS
  - Set up shadcn/ui component library
  - Create root layout with global styles and providers
  - Configure environment variables for API endpoints
  - _Requirements: Design - Architecture section_

- [ ] 2. Authentication system
  - [ ] 2.1 Create admin authentication utilities
    - Implement JWT token storage and retrieval functions
    - Create token refresh logic with automatic retry
    - Build admin role validation utilities
    - _Requirements: Design - Property 30, 31, 32, 33_
  
  - [ ] 2.2 Build login page
    - Create login form with email and password fields
    - Implement form validation and error handling
    - Add "Forgot Password" link
    - Handle successful login with token storage and redirect
    - _Requirements: Design - Authentication section_
  
  - [ ] 2.3 Build forgot password page
    - Create password reset request form
    - Implement email validation
    - Display success message after submission
    - _Requirements: Design - Authentication section_
  
  - [ ] 2.4 Create protected route wrapper
    - Build HOC or middleware to check admin authentication
    - Redirect unauthenticated users to login
    - Handle token expiration with automatic refresh
    - _Requirements: Design - Property 30, 33_
  
  - [ ]* 2.5 Write property test for token refresh
    - **Property 31: Expired Token Triggers Refresh**
    - **Validates: Design - Property 31**

- [ ] 3. Layout and navigation components
  - [ ] 3.1 Create AdminSidebar component
    - Build sidebar with navigation items (Dashboard, Talents, Recruiters, Mentors, Opportunities, Analytics, Broadcasts, Logs, Support, Settings)
    - Add icons and labels for each menu item
    - Implement active route highlighting
    - Add admin profile section at bottom
    - Make responsive: full on desktop, collapsed on tablet, drawer on mobile
    - _Requirements: Design - AdminSidebar interface_
  
  - [ ] 3.2 Create AdminHeader component
    - Build header with logo and app title
    - Add hamburger menu button for mobile
    - Implement admin user info dropdown with logout
    - Add breadcrumb navigation
    - _Requirements: Design - AdminHeader interface_
  
  - [ ] 3.3 Create AdminMobileNav component
    - Build mobile drawer navigation
    - Implement open/close animations
    - Add overlay backdrop
    - _Requirements: Design - Layout Components section_
  
  - [ ] 3.4 Create admin layout wrapper
    - Build layout component combining sidebar and header
    - Implement responsive layout switching
    - Add protected route wrapper
    - Handle mobile menu state
    - _Requirements: Design - Architecture section_

- [ ] 4. Shared components library
  - [ ] 4.1 Create DataTable component
    - Build table with sortable columns
    - Implement pagination controls
    - Add loading skeleton state
    - Create empty state display
    - Build mobile card view for small screens
    - Add row click handler
    - _Requirements: Design - DataTable interface, Property 34_
  
  - [ ] 4.2 Create SearchBar component
    - Build search input with debouncing (300ms default)
    - Add clear button
    - Implement keyboard shortcut (Cmd+K)
    - _Requirements: Design - SearchBar interface_
  
  - [ ] 4.3 Create FilterPanel component
    - Build filter panel with multiple filter types (select, multiselect, date, daterange)
    - Add reset all filters button
    - Implement mobile drawer for small screens
    - Add active filter count badge
    - _Requirements: Design - FilterPanel interface_
  
  - [ ] 4.4 Create StatusBadge component
    - Build badge with color coding by status
    - Support variants: default and outline
    - Ensure accessible contrast ratios
    - _Requirements: Design - StatusBadge interface_
  
  - [ ] 4.5 Create ConfirmDialog component
    - Build confirmation dialog with title and description
    - Add optional reason input field
    - Support destructive variant for dangerous actions
    - Implement keyboard shortcuts (Enter to confirm, Esc to cancel)
    - Add loading state during confirmation
    - _Requirements: Design - ConfirmDialog interface_
  
  - [ ] 4.6 Create ExportButton component
    - Build export button with format selector (CSV/PDF)
    - Implement download functionality
    - Add loading state during export
    - _Requirements: Design - Analytics and Logs pages_

- [ ] 5. API client infrastructure
  - [ ] 5.1 Create base API client
    - Build fetch wrapper with authentication headers
    - Implement automatic token refresh on 401
    - Add request/response interceptors
    - Handle network errors and retries
    - _Requirements: Design - Error Handling section, Property 31, 32_
  
  - [ ] 5.2 Create admin API modules
    - Create API functions for dashboard endpoints
    - Create API functions for talents endpoints
    - Create API functions for recruiters endpoints
    - Create API functions for mentors endpoints
    - Create API functions for opportunities endpoints
    - Create API functions for analytics endpoints
    - Create API functions for broadcasts endpoints
    - Create API functions for audit logs endpoints
    - Create API functions for support endpoints
    - Create API functions for settings endpoints
    - _Requirements: Design - Architecture section, Backend Plan_
  
  - [ ]* 5.3 Write property test for API error handling
    - **Property 37: API Error Shows Message And Retry**
    - **Validates: Design - Property 37**

- [ ] 6. Dashboard page
  - [ ] 6.1 Create DashboardStats component
    - Build metric cards for users (total, by role, active counts, new counts)
    - Build metric cards for opportunities (total, by status, new counts)
    - Build metric cards for applications (total, by status, new counts)
    - Build metric cards for mentorship (sessions, ratings)
    - Build metric cards for reports (pending, resolved, flagged)
    - _Requirements: Design - Dashboard Page section, Backend Plan - Dashboard_
  
  - [ ] 6.2 Create ActivityFeed component
    - Build timeline view for recent activities
    - Display user avatars and activity descriptions
    - Format timestamps relative to now
    - _Requirements: Design - Dashboard Page section_
  
  - [ ] 6.3 Create TrendCharts component
    - Build line/bar charts using Chart.js or Recharts
    - Add period selector (7d, 30d, 90d)
    - Implement metric toggle (users, opportunities, applications)
    - _Requirements: Design - Dashboard Page section, Property 1_
  
  - [ ] 6.4 Build dashboard page
    - Fetch dashboard stats from API
    - Fetch activity feed from API
    - Fetch chart data from API
    - Implement React Query caching (5 minutes TTL)
    - Wire all components together
    - _Requirements: Design - Dashboard Page section_
  
  - [ ]* 6.5 Write property test for time period selection
    - **Property 1: Time Period Selection Updates Charts**
    - **Validates: Design - Property 1**

- [ ] 7. Talent management page
  - [ ] 7.1 Create TalentTable component
    - Build table with columns: username, email, full name, status, verified, created date, last active
    - Add search functionality
    - Add filters for status and verification
    - Implement sorting by created date and last active
    - Add pagination
    - Handle row click to open detail modal
    - _Requirements: Design - Talent Management Page section, Backend Plan - Talent Page_
  
  - [ ] 7.2 Create TalentDetailModal component
    - Build modal with tabs: Profile, Applications, Activity
    - Display profile information and stats
    - Show applications list in Applications tab
    - Show activity timeline in Activity tab
    - Add action buttons: Update Status, Delete
    - _Requirements: Design - Talent Management Page section, Property 7_
  
  - [ ] 7.3 Create StatusUpdateModal component
    - Build form with status dropdown (active, suspended, banned)
    - Add required reason textarea
    - Implement validation for required reason
    - Handle status update API call
    - Show success/error messages
    - _Requirements: Design - Talent Management Page section, Property 4_
  
  - [ ] 7.4 Create DeleteConfirmDialog for talents
    - Build confirmation dialog with warning message
    - Add required reason input
    - Implement soft delete API call
    - Show success message and refresh table
    - _Requirements: Design - Talent Management Page section, Property 5_
  
  - [ ] 7.5 Build talent management page
    - Fetch talents from API with query params
    - Wire search and filters to API calls
    - Integrate TalentTable, TalentDetailModal, StatusUpdateModal, DeleteConfirmDialog
    - Handle loading and error states
    - _Requirements: Design - Talent Management Page section_
  
  - [ ]* 7.6 Write property test for search filtering
    - **Property 2: Search Filters Results**
    - **Validates: Design - Property 2**
  
  - [ ]* 7.7 Write property test for status filtering
    - **Property 3: Status Filter Matches Results**
    - **Validates: Design - Property 3**
  
  - [ ]* 7.8 Write property test for status update validation
    - **Property 4: Status Update Requires Reason**
    - **Validates: Design - Property 4**

- [ ] 8. Recruiter management page
  - [ ] 8.1 Create RecruiterTable component
    - Build table with columns: username, email, company, company size, industry, status, opportunities count
    - Add company logo display
    - Add search functionality
    - Add filters for status, company size, and industry
    - Implement pagination
    - Handle row click to open detail modal
    - _Requirements: Design - Recruiter Management Page section, Backend Plan - Recruiters Page_
  
  - [ ] 8.2 Create RecruiterDetailModal component
    - Build modal with tabs: Profile, Opportunities, Earnings
    - Display company info and stats in Profile tab
    - _Requirements: Design - Recruiter Management Page section_
  
  - [ ] 8.3 Create OpportunitiesTab component
    - Fetch recruiter's opportunities from API
    - Display opportunity cards with status badges
    - Add view details links
    - _Requirements: Design - Recruiter Management Page section, Property 7_
  
  - [ ] 8.4 Create EarningsTab component
    - Build date range picker
    - Fetch earnings data from API
    - Display earnings chart
    - Show transaction table
    - _Requirements: Design - Recruiter Management Page section_
  
  - [ ] 8.5 Build recruiter management page
    - Fetch recruiters from API with query params
    - Wire search and filters to API calls
    - Integrate RecruiterTable, RecruiterDetailModal, status update, and delete functionality
    - Handle loading and error states
    - _Requirements: Design - Recruiter Management Page section_
  
  - [ ]* 8.6 Write property test for recruiter filtering
    - **Property 6: Recruiter Filter Matches Criteria**
    - **Validates: Design - Property 6**
  
  - [ ]* 8.7 Write property test for recruiter opportunities
    - **Property 7: Recruiter Opportunities Belong To Recruiter**
    - **Validates: Design - Property 7**

- [ ] 9. Mentor management page
  - [ ] 9.1 Create MentorTable component
    - Build table with columns: username, email, full name, expertise, rating, sessions count, status
    - Add profile image display
    - Add search functionality
    - Add filters for status, minimum rating, and expertise
    - Implement pagination
    - Handle row click to open detail modal
    - _Requirements: Design - Mentor Management Page section, Backend Plan - Mentors Page_
  
  - [ ] 9.2 Create MentorDetailModal component
    - Build modal with tabs: Profile, Sessions, Reviews
    - Display profile info, rating, and stats in Profile tab
    - _Requirements: Design - Mentor Management Page section_
  
  - [ ] 9.3 Create SessionsTab component
    - Fetch mentor's sessions from API
    - Display session cards with status badges and ratings
    - Add date/time formatting
    - _Requirements: Design - Mentor Management Page section, Property 10_
  
  - [ ] 9.4 Create ReviewsTab component
    - Fetch mentor's reviews from API
    - Display review cards with star ratings
    - Show reviewer info and timestamps
    - _Requirements: Design - Mentor Management Page section, Property 11_
  
  - [ ] 9.5 Create VisibilityToggle component
    - Build toggle switch for public/private profile
    - Add confirmation dialog
    - Handle visibility update API call
    - _Requirements: Design - Mentor Management Page section, Property 12_
  
  - [ ] 9.6 Build mentor management page
    - Fetch mentors from API with query params
    - Wire search and filters to API calls
    - Integrate MentorTable, MentorDetailModal, VisibilityToggle, status update functionality
    - Handle loading and error states
    - _Requirements: Design - Mentor Management Page section_
  
  - [ ]* 9.7 Write property test for mentor rating filter
    - **Property 9: Mentor Rating Filter**
    - **Validates: Design - Property 9**
  
  - [ ]* 9.8 Write property test for mentor sessions
    - **Property 10: Mentor Sessions Belong To Mentor**
    - **Validates: Design - Property 10**

- [ ] 10. Opportunity management page
  - [ ] 10.1 Create OpportunityTable component
    - Build table with columns: title, company, type, status, location, views, applications, posted date
    - Add search functionality
    - Add filters for status, type, and posted by
    - Implement pagination
    - Handle row click to open detail modal
    - _Requirements: Design - Opportunity Management Page section, Backend Plan - Opportunity Page_
  
  - [ ] 10.2 Create OpportunityDetailModal component
    - Build modal with full job description
    - Display applicants list
    - Show opportunity stats (views, applications, interviews)
    - Add action buttons: Update Status, Flag, Delete
    - _Requirements: Design - Opportunity Management Page section_
  
  - [ ] 10.3 Create FlagModal component
    - Build form with reason dropdown (inappropriate, spam, misleading)
    - Add required notes textarea
    - Implement validation
    - Handle flag API call
    - _Requirements: Design - Opportunity Management Page section, Property 15_
  
  - [ ] 10.4 Build opportunity management page
    - Fetch opportunities from API with query params
    - Wire search and filters to API calls
    - Integrate OpportunityTable, OpportunityDetailModal, FlagModal, status update, and delete functionality
    - Handle loading and error states
    - _Requirements: Design - Opportunity Management Page section_
  
  - [ ]* 10.5 Write property test for opportunity filtering
    - **Property 14: Opportunity Filter Matches Criteria**
    - **Validates: Design - Property 14**
  
  - [ ]* 10.6 Write property test for opportunity flag validation
    - **Property 15: Opportunity Flag Requires Reason And Notes**
    - **Validates: Design - Property 15**

- [ ] 11. Analytics page
  - [ ] 11.1 Create AnalyticsOverview component
    - Build metric cards for user growth, engagement, opportunities, applications, mentorship, and revenue
    - Add date range picker
    - Fetch overview data from API
    - _Requirements: Design - Analytics Page section, Backend Plan - Analytics Page_
  
  - [ ] 11.2 Create TrendsChart component
    - Build line chart for selected metric over time
    - Add metric selector dropdown
    - Add period toggle (7d, 30d, 90d)
    - Fetch trends data from API
    - _Requirements: Design - Analytics Page section_
  
  - [ ] 11.3 Create RetentionTable component
    - Build cohort retention table with heatmap visualization
    - Fetch retention data from API
    - _Requirements: Design - Analytics Page section_
  
  - [ ] 11.4 Create ChurnAnalysis component
    - Display churn rate metric
    - Show churn reasons breakdown
    - Fetch churn data from API
    - _Requirements: Design - Analytics Page section_
  
  - [ ] 11.5 Build analytics page
    - Wire all analytics components together
    - Implement date range filtering across all components
    - Add export functionality
    - Handle loading and error states
    - _Requirements: Design - Analytics Page section_
  
  - [ ]* 11.6 Write property test for date range filtering
    - **Property 18: Analytics Date Range Filters Data**
    - **Validates: Design - Property 18**

- [ ] 12. Broadcast page
  - [ ] 12.1 Create BroadcastTable component
    - Build table with columns: title, target audience, channels, status, sent date, delivery stats
    - Add status badges
    - Add filters for status
    - Implement pagination
    - Handle row click to open detail modal
    - _Requirements: Design - Broadcast Page section, Backend Plan - Broadcast Page_
  
  - [ ] 12.2 Create CreateBroadcastModal component
    - Build form with title, message, target audience selector, channels checkboxes
    - Add optional scheduling date/time picker
    - Implement validation (future date for scheduled broadcasts)
    - Handle create API call
    - _Requirements: Design - Broadcast Page section, Property 20_
  
  - [ ] 12.3 Create BroadcastDetailModal component
    - Display broadcast message preview
    - Show delivery stats (sent, delivered, opened, clicked)
    - Display engagement metrics
    - _Requirements: Design - Broadcast Page section_
  
  - [ ] 12.4 Build broadcast page
    - Fetch broadcasts from API with filters
    - Integrate BroadcastTable, CreateBroadcastModal, BroadcastDetailModal
    - Implement delete functionality with status validation
    - Handle loading and error states
    - _Requirements: Design - Broadcast Page section_
  
  - [ ]* 12.5 Write property test for broadcast scheduling
    - **Property 20: Broadcast Schedule Must Be Future**
    - **Validates: Design - Property 20**
  
  - [ ]* 12.6 Write property test for sent broadcast deletion
    - **Property 21: Sent Broadcasts Cannot Be Deleted**
    - **Validates: Design - Property 21**

- [ ] 13. Audit logs page
  - [ ] 13.1 Create AuditLogsTable component
    - Build table with columns: action, performed by, entity type, entity name, timestamp, IP address
    - Add filters for action type, performing admin, entity type, date range
    - Implement search functionality
    - Add sortable columns
    - Implement pagination
    - Handle row click to open detail modal
    - _Requirements: Design - Audit Logs Page section, Backend Plan - Logs Page_
  
  - [ ] 13.2 Create LogDetailModal component
    - Display full log entry details
    - Show before/after values for updates
    - Display reason if provided
    - _Requirements: Design - Audit Logs Page section_
  
  - [ ] 13.3 Build audit logs page
    - Fetch logs from API with filters
    - Integrate AuditLogsTable, LogDetailModal
    - Add export functionality
    - Handle loading and error states
    - _Requirements: Design - Audit Logs Page section_
  
  - [ ]* 13.4 Write property test for audit log filtering
    - **Property 22: Audit Log Filter Matches Criteria**
    - **Validates: Design - Property 22**

- [ ] 14. Support page
  - [ ] 14.1 Create SupportStats component
    - Build metric cards for open tickets, avg response time, avg resolution time, satisfaction rate
    - Fetch stats from API
    - _Requirements: Design - Support Page section, Backend Plan - Support Page_
  
  - [ ] 14.2 Create TicketsTable component
    - Build table with columns: ticket ID, subject, category, priority, status, user, assigned to, created date
    - Add priority badges and status indicators
    - Add filters for status, priority, assigned to, category
    - Add search functionality
    - Implement pagination
    - Handle row click to open detail modal
    - _Requirements: Design - Support Page section_
  
  - [ ] 14.3 Create TicketDetailModal component
    - Display full conversation thread
    - Show user info and ticket metadata
    - Add action buttons: Update Status, Assign, Reply
    - _Requirements: Design - Support Page section_
  
  - [ ] 14.4 Create CreateTicketModal component
    - Build form with user selector, subject, description, category, priority
    - Implement validation
    - Handle create API call
    - _Requirements: Design - Support Page section_
  
  - [ ] 14.5 Create ReplyForm component
    - Build rich text editor for reply message
    - Add internal note toggle
    - Add attachment support
    - Handle reply API call
    - _Requirements: Design - Support Page section, Property 25_
  
  - [ ] 14.6 Build support page
    - Fetch tickets and stats from API
    - Integrate SupportStats, TicketsTable, TicketDetailModal, CreateTicketModal, ReplyForm
    - Implement ticket update functionality
    - Handle loading and error states
    - _Requirements: Design - Support Page section_
  
  - [ ]* 14.7 Write property test for reply visibility
    - **Property 25: Reply Visibility Matches Type**
    - **Validates: Design - Property 25**

- [ ] 15. Settings page
  - [ ] 15.1 Create AdminUsersTable component
    - Build table with columns: username, email, roles, permissions, status, last login
    - Add action buttons: Edit, Delete
    - _Requirements: Design - Settings Page section, Backend Plan - Settings Page_
  
  - [ ] 15.2 Create CreateAdminModal component
    - Build form with email, username, password, roles selector, permissions checkboxes
    - Implement validation for all required fields
    - Handle create API call
    - _Requirements: Design - Settings Page section, Property 26_
  
  - [ ] 15.3 Create EditAdminModal component
    - Build form with roles selector, permissions checkboxes, status toggle
    - Implement validation
    - Handle update API call
    - _Requirements: Design - Settings Page section_
  
  - [ ] 15.4 Create PlatformSettingsForm component
    - Build form with maintenance mode toggle and message input
    - Add feature toggles for user registration, opportunity posting, mentorship booking
    - Add limits inputs for max opportunities per recruiter, max applications per talent
    - Handle update API call
    - _Requirements: Design - Settings Page section, Property 29_
  
  - [ ] 15.5 Build settings page
    - Fetch admin users and platform settings from API
    - Integrate AdminUsersTable, CreateAdminModal, EditAdminModal, PlatformSettingsForm
    - Implement delete functionality with self-deletion prevention
    - Handle loading and error states
    - _Requirements: Design - Settings Page section_
  
  - [ ]* 15.6 Write property test for admin creation validation
    - **Property 26: Admin Creation Requires All Fields**
    - **Validates: Design - Property 26**
  
  - [ ]* 15.7 Write property test for self-deletion prevention
    - **Property 28: Self-Deletion Is Prevented**
    - **Validates: Design - Property 28**

- [ ] 16. Error handling and loading states
  - [ ] 16.1 Create error boundary component
    - Build error boundary with fallback UI
    - Log errors to monitoring service
    - Add reset functionality
    - _Requirements: Design - Error Handling section_
  
  - [ ] 16.2 Create loading state components
    - Build full-page skeleton loader
    - Build table skeleton rows
    - Build modal skeleton content
    - Build button loading spinner
    - Build inline loading spinner
    - _Requirements: Design - Loading States section, Property 36_
  
  - [ ] 16.3 Create empty state components
    - Build generic empty state with icon, title, description, and optional action
    - Create specific empty states for each page
    - _Requirements: Design - Empty States section_
  
  - [ ] 16.4 Implement global error handling
    - Handle 401 errors with token refresh
    - Handle 403 errors with permissions message
    - Handle 429 errors with rate limit message
    - Handle network errors with offline indicator
    - Handle 500 errors with retry option
    - _Requirements: Design - Error Handling section, Property 37, 38, 39, 40_
  
  - [ ]* 16.5 Write property test for loading states
    - **Property 36: Loading State Shows Indicator**
    - **Validates: Design - Property 36**
  
  - [ ]* 16.6 Write property test for API error handling
    - **Property 37: API Error Shows Message And Retry**
    - **Validates: Design - Property 37**

- [ ] 17. Responsive design and mobile optimization
  - [ ] 17.1 Implement mobile table layouts
    - Convert all DataTable instances to card view on mobile (<768px)
    - Ensure touch targets are at least 44px
    - Test all pages on mobile viewport
    - _Requirements: Design - Property 34, 35_
  
  - [ ] 17.2 Optimize mobile navigation
    - Test sidebar drawer on mobile
    - Ensure smooth animations
    - Test touch gestures
    - _Requirements: Design - Layout Components section_
  
  - [ ] 17.3 Test mobile forms
    - Ensure all form fields are accessible on mobile
    - Test keyboard behavior
    - Verify touch target sizes
    - _Requirements: Design - Property 35_
  
  - [ ]* 17.4 Write property test for mobile touch targets
    - **Property 35: Mobile Touch Targets Meet Minimum**
    - **Validates: Design - Property 35**

- [ ] 18. Testing and quality assurance
  - [ ]* 18.1 Write unit tests for shared components
    - Test DataTable rendering and interactions
    - Test SearchBar debouncing and clear functionality
    - Test FilterPanel filter application and reset
    - Test StatusBadge color coding
    - Test ConfirmDialog keyboard shortcuts
    - _Requirements: Design - Testing Strategy section_
  
  - [ ]* 18.2 Write integration tests for pages
    - Test dashboard page rendering and data fetching
    - Test talent page search, filter, and CRUD operations
    - Test recruiter page with opportunities and earnings tabs
    - Test mentor page with sessions and reviews tabs
    - Test opportunity page with flag and delete operations
    - Test analytics page with date range filtering
    - Test broadcast page with create and schedule
    - Test audit logs page with filtering and export
    - Test support page with ticket creation and replies
    - Test settings page with admin management
    - _Requirements: Design - Testing Strategy section_
  
  - [ ]* 18.3 Write E2E tests for critical flows
    - Test authentication flow (login, token refresh, logout)
    - Test talent suspension flow
    - Test opportunity flagging flow
    - Test broadcast creation and scheduling flow
    - Test support ticket creation and reply flow
    - _Requirements: Design - Testing Strategy section_

- [ ] 19. Documentation
  - [ ] 19.1 Create README with setup instructions
    - Document environment variables
    - Document development commands
    - Document build and deployment process
    - _Requirements: Design - Architecture section_
  
  - [ ] 19.2 Document component API
    - Create Storybook stories for shared components
    - Document props and usage examples
    - _Requirements: Design - Shared Components section_
  
  - [ ] 19.3 Create API integration guide
    - Document API client usage
    - Document error handling patterns
    - Document authentication flow
    - _Requirements: Design - API client infrastructure_

- [ ] 20. Final checkpoint
  - Ensure all tests pass
  - Verify all pages are functional
  - Test authentication and authorization
  - Test responsive design on all viewports
  - Review code quality and documentation
  - Ask the user if questions arise

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific design sections for traceability
- Property tests validate universal correctness properties from the design document
- The implementation follows an incremental approach, building from infrastructure to features
- All pages integrate with the shared component library for consistency
