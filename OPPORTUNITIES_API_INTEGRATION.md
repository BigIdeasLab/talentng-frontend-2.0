# Opportunities API Integration

## Overview
The talent opportunities page is now integrated with the real API backend. The system fetches opportunities from `GET /opportunities` and displays them with filtering and search capabilities.

## API Structure

### Response Format
```typescript
GET /opportunities
```

Returns an array of opportunity objects with the following structure:

```typescript
interface Opportunity {
  id: string;
  type: "Job" | "Internship" | "Mentorship" | string;
  title: string;
  description: string;
  requirements: string[];
  company: string;
  logo: string;
  keyResponsibilities: string[];
  employmentType: "Full-Time" | "Part-Time" | "Contract" | string;
  location: string;
  compensation: string;
  tags: string[];
  category: string;
  workType: string;
  compensationType: "Fixed" | "Hourly" | "Project-based" | string;
  experienceLevel: "Junior" | "Mid" | "Senior" | string;
  minBudget: number;
  maxBudget: number;
  paymentType: "weekly" | "monthly" | "hourly" | string;
  tools: string[];
  duration: string;
  maxHours: number;
  startDate: string; // ISO date
  applicationCap: number;
  closingDate: string; // ISO date
  applicationCount: number;
  status: "active" | "draft" | "closed" | string;
  postedById: string;
  isFeatured: boolean;
  featuredUntil: string | null; // ISO date
  createdAt: string; // ISO date
  updatedAt: string; // ISO date
  deletedAt: string | null; // ISO date
  postedBy: {
    id: string;
    username: string;
    recruiterProfile: {
      id: string;
      company: string;
      location: string;
      profileImageUrl: string;
    };
  };
}
```

## Query Parameters

```typescript
interface GetOpportunitiesParams {
  q?: string;              // Search query
  type?: string;           // Filter by type (Job, Internship, etc.)
  title?: string;          // Filter by title
  location?: string;       // Filter by location
  tags?: string;           // Filter by skills/tags
  status?: string;         // Filter by status (active, draft, closed)
  category?: string;       // Filter by category
  experienceLevel?: string; // Filter by experience level
  isFeatured?: boolean;    // Filter by featured status
  limit?: number;          // Pagination limit
  offset?: number;         // Pagination offset
  sortBy?: "createdAt" | "applicationCount" | "compensation"; // Sort field
  sortOrder?: "asc" | "desc"; // Sort order
}
```

## Files Structure

### API Client
- **`lib/api/opportunities/index.ts`** - API client functions
  - `getOpportunities(params?)` - Fetch all opportunities
  - `getOpportunityById(id)` - Fetch single opportunity
  - `createOpportunity(data)` - Create new opportunity

- **`lib/api/opportunities/types.ts`** - TypeScript interfaces
  - `Opportunity` - Main opportunity interface
  - `RecruiterProfile` - Recruiter profile details
  - `PostedBy` - Posted by user details
  - `GetOpportunitiesParams` - Query parameters interface

### Custom Hook
- **`hooks/useOpportunities.ts`** - React hook for fetching opportunities
  ```typescript
  const { opportunities, isLoading, isError, error, refetch } = useOpportunities(params?);
  ```

### Talent Opportunities Components
- **`components/talent/opportunities/TalentOpportunities.tsx`** - Main component
  - Fetches opportunities using `useOpportunities()` hook
  - Transforms API data to display format
  - Handles filtering by type (Job, Internship, Volunteer, Part-time)
  - Handles search by title, company, and skills

- **`components/talent/opportunities/`** - Supporting components
  - `header.tsx` - Page header
  - `search-bar.tsx` - Search input with sort/filter buttons
  - `filter-tabs.tsx` - Filter tabs (All, Job Listing, Internship, Part-time, Volunteer)
  - `opportunity-card.tsx` - Individual opportunity card with type badge
  - `opportunities-grid.tsx` - Grid layout for opportunities
  - `application-status-banner.tsx` - Status banner (Awaiting, Hired, Not Hired)
  - `empty-state.tsx` - Empty state message
  - `types.ts` - Display format types

### Pages
- **`app/(business)/opportunities/page.tsx`** - Main opportunities page
  - Role-based routing (talent/mentor vs recruiter)
  - Renders `TalentOpportunities` for talent and mentor roles
  - Renders `EmployerOpportunities` for recruiter role

## Usage

### In Components
```typescript
import { useOpportunities } from "@/hooks/useOpportunities";

function MyComponent() {
  const { opportunities, isLoading, isError, refetch } = useOpportunities({
    type: "Job",
    experienceLevel: "Senior",
    location: "Lagos"
  });

  // Use opportunities data
}
```

### Direct API Calls
```typescript
import { getOpportunities, getOpportunityById } from "@/lib/api/opportunities";

// Get all opportunities
const opportunities = await getOpportunities({ type: "Job" });

// Get single opportunity
const opportunity = await getOpportunityById("550e8400-e29b-41d4-a716-446655440000");
```

## Data Transformation

The TalentOpportunities component transforms API opportunities to a display-friendly format:

```typescript
{
  id: string;
  posterName: string;           // From postedBy.username or company
  posterAvatar: string;         // From postedBy.recruiterProfile.profileImageUrl or logo
  date: string;                 // Formatted from createdAt
  type: FilterType;             // Mapped from API type
  title: string;
  skills: string[];             // From tags
  rate: string;                 // From compensation
  showActions: boolean;         // Based on status === "active"
  applicationStatus?: string;   // From postedBy
}
```

## Features

1. **Filtering**
   - Filter by opportunity type (Job, Internship, Volunteer, Part-time)
   - All opportunities view

2. **Search**
   - Search by title
   - Search by company name
   - Search by skills/tags

3. **Display**
   - Opportunity cards with type badges
   - Application status banners (when applicable)
   - Company logo and recruiter info
   - Skills/tags display
   - Compensation display
   - Apply/Save actions for active opportunities

4. **Loading States**
   - Loading spinner during fetch
   - Error handling with fallback message

## Integration with Dashboard

The opportunities page is integrated into the role-based dashboard system:

```typescript
// In app/(business)/dashboard/page.tsx
const role = activeRole || userRoles?.[0] || "talent";

switch (role) {
  case "recruiter":
    return <EmployerDashboard />;
  case "mentor":
    return <MentorDashboard />;
  case "talent":
  default:
    return <TalentDashboard />;
}
```

Similarly, in `app/(business)/opportunities/page.tsx`:

```typescript
switch (role) {
  case "recruiter":
    return <EmployerOpportunities />;
  case "talent":
    return <TalentOpportunities />;
  case "mentor":
  default:
    return <TalentOpportunities />;
}
```

## Next Steps

1. **Application Tracking** - Add ability to apply to opportunities
2. **Saved Opportunities** - Implement bookmark/save functionality
3. **Opportunity Details** - Create detail page with full information
4. **Recommended Opportunities** - Add ML-based recommendations based on profile
5. **Application Status** - Display application status for submitted applications
