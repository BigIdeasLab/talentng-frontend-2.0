# Recruiter Applications API - Frontend Implementation Guide

## Endpoint

```
GET /api/v1/recruiter/applications
```

**Authentication Required:** Yes (Bearer Token)  
**Role Required:** Recruiter

---

## Overview

This endpoint allows recruiters to fetch applications for opportunities they've posted. It supports comprehensive search, filtering, sorting, and pagination capabilities - **matching the same pattern as the talent/opportunities endpoint**.

---

## Query Parameters

### 1. Search Parameters

#### `q` (string, optional)

Primary search parameter that searches across multiple fields:

- Applicant's username
- Applicant's full name (from talent profile)
- Opportunity title

**Example:**

```javascript
// Search for "John"
GET /api/v1/recruiter/applications?q=John

// Search for opportunity title
GET /api/v1/recruiter/applications?q=Software Engineer
```

**Note:** This matches the same `q` parameter pattern used in `/api/v1/talent/opportunities`

---

### 2. Filter Parameters

#### `opportunityId` (UUID, optional)

Filter applications for a specific opportunity.

**Example:**

```javascript
GET /api/v1/recruiter/applications?opportunityId=a1b2c3d4-e5f6-7890-1234-567890abcdef
```

#### `status` (enum, optional)

Filter by application status.

**Valid values:**

- `applied` - Initial application submitted
- `shortlisted` - Candidate shortlisted for interview
- `rejected` - Application rejected
- `hired` - Candidate hired
- `invited` - Candidate invited by recruiter

**Example:**

```javascript
GET /api/v1/recruiter/applications?status=shortlisted
```

#### `location` (string, optional)

Filter by talent's location (partial match, case-insensitive).

**Example:**

```javascript
GET /api/v1/recruiter/applications?location=Lagos
```

#### `skills` (string, optional)

Filter by skills (comma-separated). Matches talents who have ANY of the specified skills.

**Example:**

```javascript
// Single skill
GET /api/v1/recruiter/applications?skills=React

// Multiple skills
GET /api/v1/recruiter/applications?skills=React,Node.js,TypeScript
```

#### `dateRange` (enum, optional)

Filter applications by submission date.

**Valid values:**

- `today` - Applications submitted today
- `week` - Applications from the last 7 days
- `month` - Applications from the last 30 days

**Example:**

```javascript
GET /api/v1/recruiter/applications?dateRange=week
```

---

### 3. Sorting Parameters

#### `sortBy` (enum, optional)

Sort the results.

**Valid values:**

- `newest` (default) - Most recent applications first
- `oldest` - Oldest applications first
- `name-asc` - Alphabetical by applicant name (A-Z)
- `name-desc` - Alphabetical by applicant name (Z-A)

**Example:**

```javascript
GET /api/v1/recruiter/applications?sortBy=name-asc
```

---

### 4. Pagination Parameters

#### `limit` (number, optional, default: 20)

Number of results per page.

**Example:**

```javascript
GET /api/v1/recruiter/applications?limit=50
```

#### `offset` (number, optional, default: 0)

Number of results to skip (for pagination).

**Example:**

```javascript
// Page 1 (first 20 results)
GET /api/v1/recruiter/applications?limit=20&offset=0

// Page 2 (next 20 results)
GET /api/v1/recruiter/applications?limit=20&offset=20

// Page 3
GET /api/v1/recruiter/applications?limit=20&offset=40
```

---

## Response Format

```typescript
{
  data: Array<{
    id: string;
    userId: string;
    opportunityId: string;
    profileType: string;
    profileId: string;
    status: "applied" | "shortlisted" | "rejected" | "hired" | "invited";
    note: string | null;
    attachments: Array<any>;
    galleryIds: string[];
    sourceType: string;
    inviteResponse: string | null;
    respondedAt: Date | null;
    invitedAt: Date | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      username: string;
      email: string;
      talentProfile: {
        id: string;
        fullName: string;
        headline: string;
        bio: string;
        skills: string[];
        location: string;
        profileImageUrl: string;
        category: string;
        gallery: any[];
        hiredCount: number;
        earnings: number;
      };
    };
    opportunity: {
      id: string;
      title: string;
      company: string;
      type: string;
      description: string;
      location: string;
      logo: string;
      postedBy: {
        id: string;
        username: string;
        recruiterProfile: {
          profileImageUrl: string;
          company: string;
        };
      };
    };
    interviews: Array<{
      id: string;
      applicationId: string;
      scheduledDate: Date;
      message: string;
      meetingLink: string;
      status: "scheduled" | "completed" | "cancelled" | "rescheduled";
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>;
  pagination: {
    total: number;
    limit: number;
    offset: number;
    currentPage: number;
    totalPages: number;
    hasNextPage: boolean;
    hasPreviousPage: boolean;
  }
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
  user: {
    talentProfile: {
      fullName: string;
      headline: string;
      skills: string[];
      location: string;
      profileImageUrl: string;
    };
  };
  opportunity: {
    title: string;
    company: string;
  };
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
        `/api/v1/recruiter/applications?${queryParams.toString()}`,
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
        placeholder="Search by name or opportunity..."
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
    location: '',
    skills: '',
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
        <option value="shortlisted">Shortlisted</option>
        <option value="rejected">Rejected</option>
        <option value="hired">Hired</option>
        <option value="invited">Invited</option>
      </select>

      {/* Location Filter */}
      <input
        type="text"
        placeholder="Filter by location..."
        value={filters.location}
        onChange={(e) => handleFilterChange('location', e.target.value)}
      />

      {/* Skills Filter */}
      <input
        type="text"
        placeholder="Filter by skills (comma-separated)..."
        value={filters.skills}
        onChange={(e) => handleFilterChange('skills', e.target.value)}
      />

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

### 4. Pagination Implementation

```typescript
function ApplicationsPagination() {
  const { pagination, fetchApplications } = useApplications();
  const [currentFilters, setCurrentFilters] = useState({});

  const goToPage = (page: number) => {
    const offset = (page - 1) * (pagination?.limit || 20);
    fetchApplications({ ...currentFilters, offset });
  };

  const nextPage = () => {
    if (pagination?.hasNextPage) {
      goToPage(pagination.currentPage + 1);
    }
  };

  const prevPage = () => {
    if (pagination?.hasPreviousPage) {
      goToPage(pagination.currentPage - 1);
    }
  };

  if (!pagination) return null;

  return (
    <div className="pagination">
      <button onClick={prevPage} disabled={!pagination.hasPreviousPage}>
        Previous
      </button>

      <span>
        Page {pagination.currentPage} of {pagination.totalPages}
        ({pagination.total} total results)
      </span>

      <button onClick={nextPage} disabled={!pagination.hasNextPage}>
        Next
      </button>
    </div>
  );
}
```

---

### 5. Complete Component Example

```typescript
function RecruiterApplicationsPage() {
  const { applications, pagination, loading, fetchApplications } = useApplications();
  const [filters, setFilters] = useState({
    q: '',
    status: '',
    location: '',
    skills: '',
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
      <h1>Applications</h1>

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
          <option value="shortlisted">Shortlisted</option>
          <option value="hired">Hired</option>
        </select>

        <input
          type="text"
          placeholder="Location..."
          value={filters.location}
          onChange={(e) => handleFilterChange({ location: e.target.value })}
        />

        <select
          value={filters.dateRange}
          onChange={(e) => handleFilterChange({ dateRange: e.target.value })}
        >
          <option value="">All Time</option>
          <option value="today">Today</option>
          <option value="week">This Week</option>
          <option value="month">This Month</option>
        </select>
      </div>

      {/* Applications List */}
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="applications-list">
          {applications.map((app) => (
            <div key={app.id} className="application-card">
              <img src={app.user.talentProfile.profileImageUrl} alt="" />
              <div>
                <h3>{app.user.talentProfile.fullName}</h3>
                <p>{app.user.talentProfile.headline}</p>
                <p>Applied for: {app.opportunity.title}</p>
                <p>Status: {app.status}</p>
                <p>Location: {app.user.talentProfile.location}</p>
                <div>
                  Skills: {app.user.talentProfile.skills.join(', ')}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && (
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

### 1. Search for a specific applicant

```
GET /api/v1/recruiter/applications?q=John Doe
```

### 2. Get all shortlisted candidates

```
GET /api/v1/recruiter/applications?status=shortlisted
```

### 3. Find React developers in Lagos

```
GET /api/v1/recruiter/applications?skills=React&location=Lagos
```

### 4. Get this week's applications, sorted by name

```
GET /api/v1/recruiter/applications?dateRange=week&sortBy=name-asc
```

### 5. Combine multiple filters

```
GET /api/v1/recruiter/applications?status=applied&location=Lagos&skills=React,Node.js&dateRange=week&sortBy=newest&limit=50
```

---

## Notes

1. **Authentication**: All requests must include a valid Bearer token in the Authorization header
2. **Role Check**: Only users with the 'recruiter' role can access this endpoint
3. **Scope**: Recruiters only see applications for opportunities they posted or talents they invited
4. **Case Sensitivity**: Search and location filters are case-insensitive
5. **Skills Matching**: The skills filter uses "hasSome" logic - it matches talents who have ANY of the specified skills
6. **Default Pagination**: If not specified, limit defaults to 20 and offset defaults to 0
7. **Default Sorting**: If not specified, results are sorted by newest first
8. **Consistent API Pattern**: This endpoint uses the same `q` parameter pattern as `/api/v1/talent/opportunities` for consistency across the platform

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
  "message": "You can only view applications for opportunities you posted"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Invalid query parameters"
}
```
