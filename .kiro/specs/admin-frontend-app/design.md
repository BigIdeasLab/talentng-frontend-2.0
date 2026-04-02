# Admin Frontend Application - Design Document

## Overview

The admin frontend is a standalone Next.js application that provides administrators with comprehensive tools to manage the TalentNG platform. It follows the same architectural patterns as the main application but is completely separate, with its own routing, authentication, and deployment pipeline.

The application provides 10 core pages: Dashboard, Talent Management, Recruiter Management, Mentor Management, Opportunity Management, Analytics, Broadcast, Audit Logs, Support Tickets, and Settings.

### Key Design Principles

1. **Separation of Concerns**: Admin app is completely separate from the main user-facing application
2. **Consistent Patterns**: Follows the same design system, component patterns, and API client architecture as the main app
3. **Role-Based Access**: All routes and API calls require admin authentication
4. **Responsive Design**: Mobile-first approach with tablet and desktop optimizations
5. **Performance**: Code splitting, lazy loading, and caching strategies for optimal performance

## Architecture

### High-Level Structure

```
admin-app/
├── app/
│   ├── (auth)/
│   │   ├── login/
│   │   └── forgot-password/
│   ├── (admin)/
│   │   ├── layout.tsx              # Admin layout with sidebar
│   │   ├── layout-client.tsx       # Client-side layout logic
│   │   ├── dashboard/
│   │   ├── talents/
│   │   ├── recruiters/
│   │   ├── mentors/
│   │   ├── opportunities/
│   │   ├── analytics/
│   │   ├── broadcasts/
│   │   ├── logs/
│   │   ├── support/
│   │   └── settings/
│   ├── layout.tsx                  # Root layout
│   └── global.css
├── components/
│   ├── admin/
│   │   ├── dashboard/
│   │   ├── talents/
│   │   ├── recruiters/
│   │   ├── mentors/
│   │   ├── opportunities/
│   │   ├── analytics/
│   │   ├── broadcasts/
│   │   ├── logs/
│   │   ├── support/
│   │   └── settings/
│   ├── layouts/
│   │   ├── AdminSidebar.tsx
│   │   ├── AdminHeader.tsx
│   │   └── AdminMobileNav.tsx
│   ├── shared/
│   │   ├── DataTable.tsx
│   │   ├── SearchBar.tsx
│   │   ├── FilterPanel.tsx
│   │   ├── StatusBadge.tsx
│   │   ├── ConfirmDialog.tsx
│   │   └── ExportButton.tsx
│   └── ui/                         # shadcn/ui components
├── lib/
│   ├── api/
│   │   ├── admin/
│   │   │   ├── dashboard.ts
│   │   │   ├── talents.ts
│   │   │   ├── recruiters.ts
│   │   │   ├── mentors.ts
│   │   │   ├── opportunities.ts
│   │   │   ├── analytics.ts
│   │   │   ├── broadcasts.ts
│   │   │   ├── logs.ts
│   │   │   ├── support.ts
│   │   │   └── settings.ts
│   │   ├── index.ts                # API client
│   │   └── server-client.ts        # Server-side API client
│   ├── auth/
│   │   ├── admin-auth.ts           # Admin-specific auth utilities
│   │   └── session.ts
│   ├── types/
│   │   └── admin.ts                # Admin-specific types
│   ├── utils/
│   └── validations/
├── hooks/
│   ├── useAdminAuth.ts
│   ├── useAdminData.ts
│   └── useExport.ts
└── public/
```

### Folder Structure Rationale

1. **Route Groups**: `(auth)` and `(admin)` separate authentication pages from admin pages
2. **Component Organization**: Components are organized by feature under `components/admin/`
3. **Shared Components**: Reusable components like DataTable, SearchBar in `components/shared/`
4. **API Layer**: All API calls centralized in `lib/api/admin/` with typed responses
5. **Type Safety**: TypeScript types in `lib/types/admin.ts` for all admin entities

## Components and Interfaces

### Layout Components

#### AdminSidebar

```typescript
interface AdminSidebarProps {
  activeItem: string;
  onItemSelect: (item: string) => void;
  onMobileClose?: () => void;
}
```

**Responsibilities:**

- Display navigation menu with icons and labels
- Highlight active route
- Show admin profile section
- Responsive: full sidebar on desktop, collapsed on tablet, drawer on mobile

**Navigation Items:**

- Dashboard
- Talents
- Recruiters
- Mentors
- Opportunities
- Analytics
- Broadcasts
- Logs
- Support
- Settings

#### AdminHeader

```typescript
interface AdminHeaderProps {
  onMenuClick: () => void;
  showMenu: boolean;
}
```

**Responsibilities:**

- Display logo and app title
- Show hamburger menu button on mobile
- Display admin user info and logout button
- Breadcrumb navigation

### Page Components

#### Dashboard Page

**Components:**

- `DashboardStats`: Metric cards for users, opportunities, applications, mentorship
- `ActivityFeed`: Recent platform activity timeline
- `TrendCharts`: Line/bar charts for user growth, opportunities, applications
- `PeriodSelector`: Toggle for 7d, 30d, 90d time periods

**Data Flow:**

1. Fetch dashboard stats from `/api/v1/admin/dashboard/stats`
2. Fetch activity feed from `/api/v1/admin/dashboard/activity`
3. Fetch chart data from `/api/v1/admin/dashboard/charts`
4. Cache stats for 5 minutes using React Query

#### Talent Management Page

**Components:**

- `TalentTable`: Paginated table with search and filters
- `TalentDetailModal`: Full profile view with tabs (Profile, Applications, Activity)
- `StatusUpdateModal`: Form to update talent status with reason
- `DeleteConfirmDialog`: Confirmation dialog for talent deletion

**Data Flow:**

1. Fetch talents from `/api/v1/admin/talents` with query params
2. Search/filter triggers new API call with updated params
3. Click talent row opens detail modal
4. Status update/delete triggers API call and refreshes table

#### Recruiter Management Page

**Components:**

- `RecruiterTable`: Paginated table with company info
- `RecruiterDetailModal`: Tabs for Profile, Opportunities, Earnings
- `OpportunitiesTab`: List of recruiter's posted jobs
- `EarningsTab`: Earnings chart and transaction table

**Data Flow:**

1. Fetch recruiters from `/api/v1/admin/recruiters`
2. Detail modal fetches additional data from `/api/v1/admin/recruiters/:id`
3. Opportunities tab fetches from `/api/v1/admin/recruiters/:id/opportunities`
4. Earnings tab fetches from `/api/v1/admin/recruiters/:id/earnings`

#### Mentor Management Page

**Components:**

- `MentorTable`: Table with ratings and expertise
- `MentorDetailModal`: Tabs for Profile, Sessions, Reviews
- `SessionsTab`: Session history with ratings
- `ReviewsTab`: All mentee reviews and ratings
- `VisibilityToggle`: Toggle for public/private profile

**Data Flow:**

1. Fetch mentors from `/api/v1/admin/mentors`
2. Detail modal fetches from `/api/v1/admin/mentors/:id`
3. Sessions tab fetches from `/api/v1/admin/mentors/:id/sessions`
4. Reviews tab fetches from `/api/v1/admin/mentors/:id/reviews`

#### Opportunity Management Page

**Components:**

- `OpportunityTable`: Table with job details and stats
- `OpportunityDetailModal`: Full job description and applicants
- `FlagModal`: Form to flag opportunity with reason
- `StatusUpdateModal`: Form to change opportunity status

**Data Flow:**

1. Fetch opportunities from `/api/v1/admin/opportunities`
2. Detail modal fetches from `/api/v1/admin/opportunities/:id`
3. Flag/status update triggers API call and refreshes table

#### Analytics Page

**Components:**

- `AnalyticsOverview`: Metric cards for all key metrics
- `DateRangePicker`: Date range selector
- `TrendsChart`: Line chart for selected metric over time
- `RetentionTable`: Cohort retention analysis
- `ChurnAnalysis`: Churn rate and reasons
- `ExportButton`: Export analytics to CSV/PDF

**Data Flow:**

1. Fetch overview from `/api/v1/admin/analytics/overview`
2. Fetch trends from `/api/v1/admin/analytics/trends`
3. Fetch retention from `/api/v1/admin/analytics/retention`
4. Fetch churn from `/api/v1/admin/analytics/churn`
5. Export triggers `/api/v1/admin/analytics/export`

#### Broadcast Page

**Components:**

- `BroadcastTable`: Table with broadcast status and stats
- `CreateBroadcastModal`: Form to create new broadcast
- `BroadcastDetailModal`: View broadcast details and delivery stats
- `ScheduleSelector`: Date/time picker for scheduling

**Data Flow:**

1. Fetch broadcasts from `/api/v1/admin/broadcasts`
2. Create broadcast posts to `/api/v1/admin/broadcasts`
3. Detail modal fetches from `/api/v1/admin/broadcasts/:id`
4. Delete triggers `/api/v1/admin/broadcasts/:id` DELETE

#### Audit Logs Page

**Components:**

- `AuditLogsTable`: Table with filters for action, admin, entity, date
- `LogDetailModal`: Detailed view of log entry
- `ExportButton`: Export logs to CSV/PDF

**Data Flow:**

1. Fetch logs from `/api/v1/admin/audit-logs`
2. Filters trigger new API call with updated params
3. Export triggers `/api/v1/admin/audit-logs/export`

#### Support Page

**Components:**

- `TicketsTable`: Table with filters for status, priority, category
- `TicketDetailModal`: Full conversation history
- `CreateTicketModal`: Form to create ticket on behalf of user
- `ReplyForm`: Form to reply to ticket (internal/external)
- `SupportStats`: Metric cards for support performance

**Data Flow:**

1. Fetch tickets from `/api/v1/admin/support/tickets`
2. Fetch stats from `/api/v1/admin/support/stats`
3. Detail modal fetches from `/api/v1/admin/support/tickets/:id`
4. Create ticket posts to `/api/v1/admin/support/tickets`
5. Reply posts to `/api/v1/admin/support/tickets/:id/reply`

#### Settings Page

**Components:**

- `AdminUsersTable`: Table of admin users
- `CreateAdminModal`: Form to create new admin
- `EditAdminModal`: Form to edit admin roles/permissions
- `PlatformSettingsForm`: Form for platform configuration
- `FeatureToggles`: Switches for feature flags
- `LimitsForm`: Form for platform limits

**Data Flow:**

1. Fetch admin users from `/api/v1/admin/settings/admins`
2. Fetch platform settings from `/api/v1/admin/settings/platform`
3. Create admin posts to `/api/v1/admin/settings/admins`
4. Update settings patches to `/api/v1/admin/settings/platform`

### Shared Components

#### DataTable

```typescript
interface DataTableProps<T> {
  data: T[];
  columns: ColumnDef<T>[];
  pagination: PaginationState;
  onPaginationChange: (pagination: PaginationState) => void;
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
}
```

**Features:**

- Sortable columns
- Pagination controls
- Loading skeleton
- Empty state
- Mobile card view
- Row click handler

#### SearchBar

```typescript
interface SearchBarProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  debounceMs?: number;
}
```

**Features:**

- Debounced input (default 300ms)
- Clear button
- Search icon
- Keyboard shortcuts (Cmd+K)

#### FilterPanel

```typescript
interface FilterPanelProps {
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onReset: () => void;
}

interface FilterConfig {
  key: string;
  label: string;
  type: "select" | "multiselect" | "date" | "daterange";
  options?: { label: string; value: string }[];
}
```

**Features:**

- Multiple filter types
- Reset all filters
- Mobile drawer on small screens
- Active filter count badge

#### StatusBadge

```typescript
interface StatusBadgeProps {
  status: "active" | "suspended" | "banned" | "pending" | "resolved" | "closed";
  variant?: "default" | "outline";
}
```

**Features:**

- Color-coded by status
- Consistent styling across app
- Accessible contrast ratios

#### ConfirmDialog

```typescript
interface ConfirmDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  variant?: "default" | "destructive";
  requireReason?: boolean;
  onReasonChange?: (reason: string) => void;
}
```

**Features:**

- Optional reason input
- Destructive variant for dangerous actions
- Keyboard shortcuts (Enter to confirm, Esc to cancel)
- Loading state during confirmation

## Data Models

### Admin User

```typescript
interface AdminUser {
  id: string;
  username: string;
  email: string;
  roles: string[];
  permissions: string[];
  isActive: boolean;
  lastLoginAt: string | null;
  createdAt: string;
}
```

### Talent

```typescript
interface Talent {
  id: string;
  username: string;
  email: string;
  fullName: string;
  profileImageUrl: string | null;
  isVerified: boolean;
  status: "active" | "suspended" | "banned";
  createdAt: string;
  lastActiveAt: string | null;
  talentProfile: {
    category: string;
    location: string;
    bio: string;
    skills: string[];
    experienceLevel: string;
    stack: string[];
  };
  stats: {
    applicationsSubmitted: number;
    interviewsAttended: number;
    offersReceived: number;
  };
}
```

### Recruiter

```typescript
interface Recruiter {
  id: string;
  username: string;
  email: string;
  isVerified: boolean;
  status: "active" | "suspended" | "banned";
  createdAt: string;
  recruiterProfile: {
    company: string;
    companySize: "startup" | "small" | "medium" | "large";
    industry: string;
    website: string;
    logo: string | null;
  };
  stats: {
    opportunitiesPosted: number;
    activeOpportunities: number;
    totalApplications: number;
    totalEarnings: number;
  };
}
```

### Mentor

```typescript
interface Mentor {
  id: string;
  username: string;
  email: string;
  fullName: string;
  profileImageUrl: string | null;
  isVerified: boolean;
  status: "active" | "suspended" | "banned";
  mentorProfile: {
    expertise: string[];
    headline: string;
    sessionRate: number;
    sessionCurrency: string;
  };
  stats: {
    totalSessions: number;
    completedSessions: number;
    avgRating: number;
    totalEarnings: number;
  };
}
```

### Opportunity

```typescript
interface Opportunity {
  id: string;
  title: string;
  company: string;
  type: "job" | "gig" | "internship";
  status: "active" | "draft" | "closed" | "flagged";
  location: string;
  employmentType: string;
  postedBy: {
    id: string;
    company: string;
    email: string;
  };
  stats: {
    views: number;
    applications: number;
    interviews: number;
  };
  createdAt: string;
  isFlagged: boolean;
}
```

### Broadcast

```typescript
interface Broadcast {
  id: string;
  title: string;
  message: string;
  targetAudience: "all" | "talents" | "recruiters" | "mentors";
  channels: ("email" | "inapp" | "push")[];
  status: "draft" | "scheduled" | "sent";
  scheduledFor: string | null;
  sentAt: string | null;
  stats: {
    sent: number;
    delivered: number;
    opened: number;
    clicked: number;
  };
}
```

### AuditLog

```typescript
interface AuditLog {
  id: string;
  action: string;
  performedBy: {
    id: string;
    username: string;
    email: string;
  };
  entity: {
    type: "users" | "opportunities" | "applications" | "mentors" | "broadcasts";
    id: string;
    name: string;
  };
  details: {
    reason?: string;
    previousStatus?: string;
    newStatus?: string;
    [key: string]: any;
  };
  ipAddress: string;
  timestamp: string;
}
```

### SupportTicket

```typescript
interface SupportTicket {
  id: string;
  subject: string;
  category: "account" | "payment" | "technical" | "other";
  priority: "low" | "medium" | "high" | "urgent";
  status: "open" | "in_progress" | "resolved" | "closed";
  user: {
    id: string;
    name: string;
    email: string;
  };
  assignedTo: {
    id: string;
    name: string;
  } | null;
  createdAt: string;
  updatedAt: string;
  responseTime: number; // minutes
  messages: TicketMessage[];
}

interface TicketMessage {
  id: string;
  message: string;
  sender: {
    id: string;
    name: string;
    type: "user" | "admin";
  };
  internal: boolean;
  createdAt: string;
}
```

### DashboardStats

```typescript
interface DashboardStats {
  users: {
    total: number;
    talents: number;
    recruiters: number;
    mentors: number;
    activeToday: number;
    activeThisWeek: number;
    activeThisMonth: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  opportunities: {
    total: number;
    active: number;
    draft: number;
    closed: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  applications: {
    total: number;
    pending: number;
    reviewing: number;
    accepted: number;
    rejected: number;
    newThisWeek: number;
    newThisMonth: number;
  };
  mentorship: {
    totalSessions: number;
    upcomingSessions: number;
    completedThisWeek: number;
    completedThisMonth: number;
    avgRating: number;
  };
  reports: {
    pending: number;
    resolved: number;
    flaggedContent: number;
  };
}
```

##

Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property 1: Time Period Selection Updates Charts

_For any_ time period selection (7d, 30d, 90d), when the period is changed, the chart data should be fetched with the new period parameter and the charts should re-render with the updated data.

**Validates: Requirements 1.4**

### Property 2: Search Filters Results

_For any_ search query on the talent page, all returned results should have the query string present in either the name, email, or username field (case-insensitive).

**Validates: Requirements 2.2**

### Property 3: Status Filter Matches Results

_For any_ status filter selection (active, suspended, banned), all returned results should have a status that matches the selected filter value.

**Validates: Requirements 2.3**

### Property 4: Status Update Requires Reason

_For any_ talent status update attempt, if no reason is provided, the system should reject the update and display a validation error.

**Validates: Requirements 2.5**

### Property 5: Soft Delete Preserves Record

_For any_ talent deletion, the record should still exist in the database with a deletedAt timestamp (soft delete), not be permanently removed.

**Validates: Requirements 2.6**

### Property 6: Recruiter Filter Matches Criteria

_For any_ combination of recruiter filters (status, company size, industry), all returned results should match all selected filter criteria.

**Validates: Requirements 3.2**

### Property 7: Recruiter Opportunities Belong To Recruiter

_For any_ recruiter's opportunities list, all displayed opportunities should have a postedBy.id that matches the recruiter's id.

**Validates: Requirements 3.4**

### Property 8: Recruiter Suspension Flags Opportunities

_For any_ recruiter suspension, all of the recruiter's active opportunities should be automatically flagged for review.

**Validates: Requirements 3.6**

### Property 9: Mentor Rating Filter

_For any_ minimum rating filter value, all returned mentors should have an avgRating greater than or equal to the filter value.

**Validates: Requirements 4.2**

### Property 10: Mentor Sessions Belong To Mentor

_For any_ mentor's session list, all displayed sessions should have a mentorId that matches the mentor's id.

**Validates: Requirements 4.4**

### Property 11: Mentor Reviews Belong To Mentor

_For any_ mentor's reviews list, all displayed reviews should be associated with sessions where the mentorId matches the mentor's id.

**Validates: Requirements 4.5**

### Property 12: Mentor Visibility Update Reflects

_For any_ mentor visibility update, the mentor's profile visibility status should immediately reflect the new value (public or private).

**Validates: Requirements 4.6**

### Property 13: Low Rating Flags Account

_For any_ mentor with an average rating below 3.0, the account should be automatically flagged for admin review.

**Validates: Requirements 4.7**

### Property 14: Opportunity Filter Matches Criteria

_For any_ combination of opportunity filters (status, type, postedBy), all returned results should match all selected filter criteria.

**Validates: Requirements 5.2**

### Property 15: Opportunity Flag Requires Reason And Notes

_For any_ opportunity flag attempt, if either reason or notes are missing, the system should reject the flag and display a validation error.

**Validates: Requirements 5.4**

### Property 16: Opportunity Status Change Notifies And Logs

_For any_ opportunity status change, a notification should be sent to the posting recruiter and an audit log entry should be created.

**Validates: Requirements 5.5**

### Property 17: Opportunity Delete Is Soft Delete

_For any_ opportunity deletion, the record should still exist with a deletedAt timestamp, applicants should be notified, and admin confirmation should be required.

**Validates: Requirements 5.6**

### Property 18: Analytics Date Range Filters Data

_For any_ date range selection in analytics, all displayed metrics should only include data from within the selected date range.

**Validates: Requirements 6.7**

### Property 19: Analytics Export Generates File

_For any_ analytics export request, the system should generate a downloadable file in the requested format (CSV or PDF).

**Validates: Requirements 6.8**

### Property 20: Broadcast Schedule Must Be Future

_For any_ scheduled broadcast, the scheduledFor timestamp should be in the future (greater than the current time).

**Validates: Requirements 7.2**

### Property 21: Sent Broadcasts Cannot Be Deleted

_For any_ broadcast with status "sent", deletion attempts should be rejected with an error message.

**Validates: Requirements 7.5**

### Property 22: Audit Log Filter Matches Criteria

_For any_ combination of audit log filters (action type, performing admin, entity type, date range), all returned results should match all selected filter criteria.

**Validates: Requirements 8.2**

### Property 23: Audit Log Export Generates File

_For any_ audit log export request, the system should generate a downloadable file in the requested format (CSV or PDF).

**Validates: Requirements 8.4**

### Property 24: Ticket Update Reflects New Values

_For any_ support ticket update, the ticket's status, priority, and assignedTo fields should immediately reflect the new values.

**Validates: Requirements 9.4**

### Property 25: Reply Visibility Matches Type

_For any_ ticket reply, if marked as internal, it should only be visible to admins; if external, it should be visible to both admins and the user.

**Validates: Requirements 9.5**

### Property 26: Admin Creation Requires All Fields

_For any_ admin user creation attempt, if any required field (email, username, password, role, permissions) is missing, the system should reject the creation and display validation errors.

**Validates: Requirements 10.2**

### Property 27: Admin Update Reflects New Values

_For any_ admin user update, the admin's roles, permissions, and status should immediately reflect the new values.

**Validates: Requirements 10.3**

### Property 28: Self-Deletion Is Prevented

_For any_ admin deletion attempt where the target admin id matches the current user's id, the system should reject the deletion with an error message.

**Validates: Requirements 10.4**

### Property 29: Platform Settings Update Reflects

_For any_ platform settings update, the new values for maintenance mode, feature toggles, and limits should immediately be reflected in the settings display.

**Validates: Requirements 10.6**

### Property 30: Protected Routes Require Admin Auth

_For any_ admin route access attempt without a valid admin JWT token, the system should redirect to the login page.

**Validates: Requirements 11.1**

### Property 31: Expired Token Triggers Refresh

_For any_ API call with an expired access token, the system should automatically attempt to refresh the token using the refresh token before retrying the original request.

**Validates: Requirements 11.3**

### Property 32: Failed Refresh Clears Tokens

_For any_ failed token refresh attempt, all stored tokens should be cleared and the user should be redirected to the login page.

**Validates: Requirements 11.4**

### Property 33: Unauthorized Access Redirects

_For any_ route access attempt without authentication, the system should redirect to the login page.

**Validates: Requirements 11.6**

### Property 34: Mobile Tables Display As Cards

_For any_ data table rendered on a mobile viewport (<768px), the layout should be cards instead of table rows.

**Validates: Requirements 12.4**

### Property 35: Mobile Touch Targets Meet Minimum

_For any_ form field or interactive element on mobile, the touch target height should be at least 44px.

**Validates: Requirements 12.5**

### Property 36: Loading State Shows Indicator

_For any_ data loading state, a loading indicator (skeleton or spinner) should be visible to the user.

**Validates: Requirements 13.1**

### Property 37: API Error Shows Message And Retry

_For any_ API error response, an error message should be displayed along with a retry button.

**Validates: Requirements 13.2**

### Property 38: Network Error Shows Offline Indicator

_For any_ network error, an offline indicator should be displayed to the user.

**Validates: Requirements 13.3**

### Property 39: 403 Error Shows Permissions Message

_For any_ 403 API response, the system should display an "insufficient permissions" error message.

**Validates: Requirements 13.4**

### Property 40: 429 Error Shows Rate Limit Message

_For any_ 429 API response, the system should display a "too many requests" error message with the retry-after time if available.

**Validates: Requirements 13.5**

## Error Handling

### API Error Handling

The admin app follows the same error handling patterns as the main application:

1. **Token Expiration (401)**: Automatically attempt token refresh using refresh token
2. **Forbidden (403)**: Display "insufficient permissions" message
3. **Rate Limiting (429)**: Display rate limit message with retry-after time
4. **Network Errors**: Display offline indicator and queue actions for retry
5. **Validation Errors (400)**: Display field-specific error messages
6. **Server Errors (500)**: Display generic error message with retry option

### Error Boundary

```typescript
class AdminErrorBoundary extends React.Component {
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Log error to monitoring service
    console.error('Admin app error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <ErrorFallback onReset={() => this.setState({ hasError: false })} />;
    }
    return this.props.children;
  }
}
```

### Loading States

All data fetching operations should display appropriate loading states:

1. **Initial Load**: Full-page skeleton loader
2. **Table Loading**: Skeleton rows in table
3. **Modal Loading**: Skeleton content in modal
4. **Button Loading**: Spinner in button with disabled state
5. **Inline Loading**: Small spinner next to content

### Empty States

All lists and tables should display empty states when no data is available:

```typescript
interface EmptyStateProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}
```

## Testing Strategy

### Unit Testing

Unit tests focus on individual components and utility functions:

1. **Component Tests**: Test component rendering, props, and user interactions
2. **Utility Tests**: Test helper functions, formatters, validators
3. **Hook Tests**: Test custom hooks with mock data
4. **API Client Tests**: Test API client with mocked fetch responses

**Tools**: Vitest, React Testing Library

**Example Test**:

```typescript
describe('StatusBadge', () => {
  it('renders active status with correct color', () => {
    render(<StatusBadge status="active" />);
    const badge = screen.getByText('Active');
    expect(badge).toHaveClass('bg-green-100');
  });

  it('renders suspended status with correct color', () => {
    render(<StatusBadge status="suspended" />);
    const badge = screen.getByText('Suspended');
    expect(badge).toHaveClass('bg-yellow-100');
  });
});
```

### Property-Based Testing

Property tests verify universal properties across many generated inputs:

**Configuration**: Minimum 100 iterations per test using fast-check

**Tag Format**: `// Feature: admin-frontend-app, Property {number}: {property_text}`

**Example Test**:

```typescript
import fc from "fast-check";

// Feature: admin-frontend-app, Property 3: Status Filter Matches Results
describe("Talent filtering", () => {
  it("filters talents by status correctly", () => {
    fc.assert(
      fc.property(
        fc.array(talentArbitrary),
        fc.constantFrom("active", "suspended", "banned"),
        (talents, status) => {
          const filtered = filterTalentsByStatus(talents, status);
          return filtered.every((talent) => talent.status === status);
        },
      ),
      { numRuns: 100 },
    );
  });
});
```

### Integration Testing

Integration tests verify interactions between components and API:

1. **Page Tests**: Test full page rendering and user flows
2. **Form Tests**: Test form submission and validation
3. **Modal Tests**: Test modal open/close and data flow
4. **Navigation Tests**: Test routing and navigation

**Example Test**:

```typescript
describe('Talent Management Page', () => {
  it('allows searching and viewing talent details', async () => {
    render(<TalentPage />);

    // Search for talent
    const searchInput = screen.getByPlaceholderText('Search talents...');
    await userEvent.type(searchInput, 'john');

    // Wait for results
    await waitFor(() => {
      expect(screen.getByText('John Doe')).toBeInTheDocument();
    });

    // Click to view details
    await userEvent.click(screen.getByText('John Doe'));

    // Verify modal opens
    expect(screen.getByRole('dialog')).toBeInTheDocument();
    expect(screen.getByText('Profile')).toBeInTheDocument();
  });
});
```

### E2E Testing

End-to-end tests verify complete user workflows:

1. **Authentication Flow**: Login, token refresh, logout
2. **CRUD Operations**: Create, read, update, delete entities
3. **Search and Filter**: Search, filter, pagination
4. **Export**: Export data to CSV/PDF

**Tools**: Playwright

**Example Test**:

```typescript
test("admin can suspend a talent", async ({ page }) => {
  // Login
  await page.goto("/login");
  await page.fill('[name="email"]', "admin@talentng.com");
  await page.fill('[name="password"]', "password");
  await page.click('button[type="submit"]');

  // Navigate to talents
  await page.click("text=Talents");
  await expect(page).toHaveURL("/talents");

  // Search for talent
  await page.fill('[placeholder="Search talents..."]', "john");
  await page.click("text=John Doe");

  // Suspend talent
  await page.click("text=Suspend");
  await page.fill('[name="reason"]', "Violation of terms");
  await page.click("text=Confirm");

  // Verify success
  await expect(
    page.locator("text=Talent suspended successfully"),
  ).toBeVisible();
});
```

### Testing Coverage Goals

- Unit Tests: 80% code coverage
- Property Tests: All correctness properties from design document
- Integration Tests: All major user flows
- E2E Tests: Critical paths (auth, CRUD, search/filter)
