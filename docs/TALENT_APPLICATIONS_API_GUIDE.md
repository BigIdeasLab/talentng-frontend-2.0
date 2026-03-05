# Talent Applications API - Frontend Implementation Guide

## Endpoint

```
GET /api/v1/talent/applications
```

**Authentication Required:** Yes (Bearer Token)  
**Role Required:** Talent

---

## Overview

This endpoint allows talents to fetch their own job applications with comprehensive search, filtering, and pagination capabilities - **following the same pattern as other endpoints** (opportunities, upcoming, talents, mentors).

---

## Query Parameters

### 1. Search Parameter

#### `q` (string, optional)

Search across multiple fields:

- Applicant name
- Applicant username
- Opportunity title

**Example:**

```javascript
// Search for "Frontend Developer"
GET /api/v1/talent/applications?q=Frontend Developer

// Search for specific company
GET /api/v1/talent/applications?q=Google
```

---

### 2. Filter Parameters

#### `status` (enum, optional)

Filter by application status.

**Valid values:**

- `applied` - Application submitted
- `reviewing` - Under review
- `shortlisted` - Shortlisted for interview
- `interviewed` - Interview completed
- `offered` - Job offer extended
- `hired` - Hired
- `rejected` - Application rejected
- `withdrawn` - Application withdrawn

**Example:**

```javascript
// Get all shortlisted applications
GET /api/v1/talent/applications?status=shortlisted

// Get all hired applications
GET /api/v1/talent/applications?status=hired
```

#### `location` (string, optional)

Filter by location (partial match on talent profile location).

**Example:**

```javascript
// Filter by location
GET /api/v1/talent/applications?location=Lagos

// Filter by remote
GET /api/v1/talent/applications?location=Remote
```

#### `skills` (string, optional)

Filter by skills (comma-separated, matches talent profile skills).

**Example:**

```javascript
// Single skill
GET /api/v1/talent/applications?skills=JavaScript

// Multiple skills
GET /api/v1/talent/applications?skills=JavaScript,React,Node.js
```

#### `dateRange` (enum, optional)

Filter applications by submission date.

**Valid values:**

- `today` - Applications submitted today
- `week` - Applications from the last 7 days
- `month` - Applications from the last 30 days

**Example:**

```javascript
// Get this week's applications
GET /api/v1/talent/applications?dateRange=week

// Get today's applications
GET /api/v1/talent/applications?dateRange=today
```

#### `sortBy` (enum, optional)

Sort results by different criteria.

**Valid values:**

- `newest` - Most recent first (default)
- `oldest` - Oldest first
- `name-asc` - Alphabetical by username (A-Z)
- `name-desc` - Alphabetical by username (Z-A)

**Example:**

```javascript
// Sort by oldest first
GET /api/v1/talent/applications?sortBy=oldest

// Sort alphabetically
GET /api/v1/talent/applications?sortBy=name-asc
```

---

### 3. Pagination Parameters

#### `limit` (number, optional, default: 20)

Number of results per page.

**Example:**

```javascript
GET /api/v1/talent/applications?limit=50
```

#### `offset` (number, optional, default: 0)

Number of results to skip (for pagination).

**Example:**

```javascript
// Page 1 (first 20 results)
GET /api/v1/talent/applications?limit=20&offset=0

// Page 2 (next 20 results)
GET /api/v1/talent/applications?limit=20&offset=20
```

---

## Response Format

```typescript
{
  data: Application[],
  pagination: {
    total: number,
    limit: number,
    offset: number,
    currentPage: number,
    totalPages: number,
    hasNextPage: boolean,
    hasPreviousPage: boolean
  }
}
```

### Application Object

```typescript
{
  id: string;
  userId: string;
  opportunityId: string;
  status: ApplicationStatus;
  note?: string;
  attachments: any[];
  createdAt: string;
  updatedAt: string;
  galleryIds: string[];
  sourceType?: string;
  invitedBy?: string;
  invitedAt?: string;
  respondedAt?: string;
  inviteResponse?: string;
  profileType: string;
  profileId: string;
  user: {
    id: string;
    username: string;
    email: string;
    talentProfile: {
      id: string;
      fullName: string;
      headline?: string;
      bio?: string;
      skills: string[];
      location?: string;
      profileImageUrl?: string;
      category?: string;
      gallery: any[];
      hiredCount: number;
      earnings: number;
    };
  };
  opportunity: {
    id: string;
    title: string;
    company?: string;
    type: string;
    description: string;
    location?: string;
    logo?: string;
    postedBy: {
      id: string;
      username: string;
      recruiterProfile?: {
        profileImageUrl?: string;
        company?: string;
      };
    };
  };
  interviews: Array<{
    id: string;
    applicationId: string;
    scheduledDate: string;
    message?: string;
    meetingLink?: string;
    status: string;
    createdAt: string;
    updatedAt: string;
  }>;
}
```

---

## Frontend Implementation Examples

### 1. Basic Fetch (React/TypeScript)

```typescript
import { useState, useEffect } from "react";

interface Application {
  id: string;
  status: string;
  createdAt: string;
  opportunity: {
    id: string;
    title: string;
    company?: string;
    type: string;
    logo?: string;
  };
  interviews: Array<{
    id: string;
    scheduledDate: string;
    status: string;
    meetingLink?: string;
  }>;
}

interface ApplicationsResponse {
  data: Application[];
  pagination: {
    total: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  };
}

function useApplications() {
  const [applications, setApplications] = useState<Application[]>([]);
  const [pagination, setPagination] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const fetchApplications = async (params: {
    q?: string;
    status?: string;
    location?: string;
    skills?: string;
    dateRange?: string;
    sortBy?: string;
    limit?: number;
    offset?: number;
  }) => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams();

      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          queryParams.append(key, String(value));
        }
      });

      const response = await fetch(
        `/api/v1/talent/applications?${queryParams.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
            "Content-Type": "application/json",
          },
        },
      );

      if (!response.ok) throw new Error("Failed to fetch applications");

      const data: ApplicationsResponse = await response.json();
      setApplications(data.data);
      setPagination(data.pagination);
    } catch (error) {
      console.error("Error fetching applications:", error);
    } finally {
      setLoading(false);
    }
  };

  return { applications, pagination, loading, fetchApplications };
}
```

---

### 2. Search Implementation

```typescript
function ApplicationsSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const { fetchApplications } = useApplications();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchApplications({ q: searchTerm, offset: 0 });
  };

  return (
    <form onSubmit={handleSearch}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search by job title or company..."
      />
      <button type="submit">Search</button>
    </form>
  );
}
```

---

### 3. Filters Implementation

```typescript
function ApplicationsFilters() {
  const [filters, setFilters] = useState({
    status: '',
    dateRange: '',
    sortBy: 'newest',
  });
  const { fetchApplications } = useApplications();

  const handleFilterChange = (key: string, value: string) => {
    const newFilters = { ...filters, [key]: value };
    setFilters(newFilters);
    fetchApplications({ ...newFilters, offset: 0 });
  };

  return (
    <div className="filters">
      {/* Status Filter */}
      <select
        value={filters.status}
        onChange={(e) => handleFilterChange('status', e.target.value)}
      >
        <option value="">All Statuses</option>
        <option value="applied">Applied</option>
        <option value="reviewing">Reviewing</option>
        <option value="shortlisted">Shortlisted</option>
        <option value="interviewed">Interviewed</option>
        <option value="offered">Offered</option>
        <option value="hired">Hired</option>
        <option value="rejected">Rejected</option>
        <option value="withdrawn">Withdrawn</option>
      </select>

      {/* Date Range Filter */}
      <select
        value={filters.dateRange}
        onChange={(e) => handleFilterChange('dateRange', e.target.value)}
      >
        <option value="">All Time</option>
        <option value="today">Today</option>
        <option value="week">This Week</option>
        <option value="month">This Month</option>
      </select>

      {/* Sort By */}
      <select
        value={filters.sortBy}
        onChange={(e) => handleFilterChange('sortBy', e.target.value)}
      >
        <option value="newest">Newest First</option>
        <option value="oldest">Oldest First</option>
        <option value="name-asc">Name (A-Z)</option>
        <option value="name-desc">Name (Z-A)</option>
      </select>
    </div>
  );
}
```

---

### 4. Application Card Component

```typescript
function ApplicationCard({ application }: { application: Application }) {
  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      applied: 'blue',
      reviewing: 'yellow',
      shortlisted: 'purple',
      interviewed: 'orange',
      offered: 'green',
      hired: 'green',
      rejected: 'red',
      withdrawn: 'gray',
    };
    return colors[status] || 'gray';
  };

  const upcomingInterview = application.interviews.find(
    (i) => i.status === 'scheduled' && new Date(i.scheduledDate) > new Date()
  );

  return (
    <div className="application-card">
      <div className="card-header">
        {application.opportunity.logo && (
          <img
            src={application.opportunity.logo}
            alt={application.opportunity.company}
          />
        )}
        <div>
          <h3>{application.opportunity.title}</h3>
          <p>{application.opportunity.company}</p>
          <span className="opportunity-type">{application.opportunity.type}</span>
        </div>
      </div>

      <div className="card-body">
        <div className="status-badge" style={{ color: getStatusColor(application.status) }}>
          {application.status}
        </div>

        <p className="applied-date">
          Applied: {new Date(application.createdAt).toLocaleDateString()}
        </p>

        {upcomingInterview && (
          <div className="interview-info">
            <p>📅 Interview: {new Date(upcomingInterview.scheduledDate).toLocaleString()}</p>
            {upcomingInterview.meetingLink && (
              <a href={upcomingInterview.meetingLink} target="_blank" rel="noopener">
                Join Meeting
              </a>
            )}
          </div>
        )}

        {application.note && (
          <p className="note">{application.note}</p>
        )}
      </div>

      <div className="card-footer">
        <button onClick={() => window.location.href = `/opportunities/${application.opportunityId}`}>
          View Opportunity
        </button>
      </div>
    </div>
  );
}
```

---

### 5. Complete Applications Page

```typescript
function ApplicationsPage() {
  const { applications, pagination, loading, fetchApplications } = useApplications();
  const [filters, setFilters] = useState({
    q: '',
    status: '',
    dateRange: '',
    sortBy: 'newest',
    limit: 20,
    offset: 0,
  });

  useEffect(() => {
    fetchApplications(filters);
  }, []);

  const handleFilterChange = (updates: Partial<typeof filters>) => {
    const newFilters = { ...filters, ...updates, offset: 0 };
    setFilters(newFilters);
    fetchApplications(newFilters);
  };

  const handlePageChange = (newOffset: number) => {
    const newFilters = { ...filters, offset: newOffset };
    setFilters(newFilters);
    fetchApplications(newFilters);
  };

  return (
    <div className="applications-page">
      <h1>My Applications</h1>

      {/* Search Bar */}
      <input
        type="text"
        placeholder="Search applications..."
        value={filters.q}
        onChange={(e) => handleFilterChange({ q: e.target.value })}
      />

      {/* Filters */}
      <div className="filters">
        <select
          value={filters.status}
          onChange={(e) => handleFilterChange({ status: e.target.value })}
        >
          <option value="">All Statuses</option>
          <option value="applied">Applied</option>
          <option value="reviewing">Reviewing</option>
          <option value="shortlisted">Shortlisted</option>
          <option value="interviewed">Interviewed</option>
          <option value="offered">Offered</option>
          <option value="hired">Hired</option>
          <option value="rejected">Rejected</option>
        </select>

        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange({ dateRange: e.target.value })}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>

        <select
          value={filters.sortBy}
          onChange={(e) => handleFilterChange({ sortBy: e.target.value })}
        >
          <option value="newest">Newest First</option>
          <option value="oldest">Oldest First</option>
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div>Loading...</div>
      ) : applications.length === 0 ? (
        <div className="empty-state">
          <p>No applications found</p>
          <button onClick={() => window.location.href = '/opportunities'}>
            Browse Opportunities
          </button>
        </div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <ApplicationCard key={app.id} application={app} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => handlePageChange(filters.offset - filters.limit)}
            disabled={!pagination.hasPreviousPage}
          >
            Previous
          </button>
          <span>
            Page {pagination.currentPage} of {pagination.totalPages}
          </span>
          <button
            onClick={() => handlePageChange(filters.offset + filters.limit)}
            disabled={!pagination.hasNextPage}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
}
```

---

## Common Use Cases

### 1. Get all my applications

```
GET /api/v1/talent/applications
```

### 2. Get shortlisted applications

```
GET /api/v1/talent/applications?status=shortlisted
```

### 3. Search for specific company

```
GET /api/v1/talent/applications?q=Google
```

### 4. Get this week's applications

```
GET /api/v1/talent/applications?dateRange=week
```

### 5. Get hired applications sorted by oldest

```
GET /api/v1/talent/applications?status=hired&sortBy=oldest
```

### 6. Combine filters

```
GET /api/v1/talent/applications?q=Frontend&status=shortlisted&dateRange=month&sortBy=newest&limit=50
```

---

## Status Badge Colors (Suggested)

```typescript
const statusColors = {
  applied: "#3B82F6", // Blue
  reviewing: "#F59E0B", // Yellow
  shortlisted: "#8B5CF6", // Purple
  interviewed: "#F97316", // Orange
  offered: "#10B981", // Green
  hired: "#059669", // Dark Green
  rejected: "#EF4444", // Red
  withdrawn: "#6B7280", // Gray
};
```

---

## Consistency with Other Endpoints

This endpoint follows the **same pattern** as:

- ✅ `/api/v1/talent/opportunities` - Browse opportunities
- ✅ `/api/v1/talent/upcoming` - Upcoming events
- ✅ `/api/v1/recruiter/applications` - View applications
- ✅ `/api/v1/talents` - Browse talents
- ✅ `/api/v1/mentors` - Browse mentors

**Shared patterns:**

- ✅ Uses `q` for search
- ✅ Uses `limit` and `offset` for pagination
- ✅ Returns `{ data, pagination }` format
- ✅ Default limit: 20
- ✅ Default offset: 0
- ✅ Complete API documentation

---

## Error Responses

### 401 Unauthorized

```json
{
  "statusCode": 401,
  "message": "Unauthorized"
}
```

### 403 Forbidden

```json
{
  "statusCode": 403,
  "message": "Forbidden resource"
}
```

---

## Notes

1. **Authentication**: Requires valid Bearer token
2. **Role**: Only accessible to users with 'talent' role
3. **Auto-scoped**: Automatically filters to show only the current user's applications
4. **Includes Interviews**: Each application includes associated interview data
5. **Rich Data**: Includes full opportunity and talent profile details
6. **Search**: Case-insensitive search across relevant fields
7. **Sorting**: Multiple sort options for flexible data organization

---

## Summary

The talent applications endpoint provides:

- ✅ Consistent `q` search parameter
- ✅ Comprehensive filtering (status, location, skills, dateRange)
- ✅ Flexible sorting (newest, oldest, name-asc, name-desc)
- ✅ Standard pagination (limit, offset)
- ✅ Unified response format with pagination metadata
- ✅ Complete API documentation
- ✅ Rich application data with opportunity and interview details

Frontend developers can use the **same components and patterns** as other endpoints!
