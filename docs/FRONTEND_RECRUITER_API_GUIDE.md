# Frontend Guide: Recruiter API Endpoints

## Overview

This guide provides complete information about the recruiter endpoints, including request parameters, response formats, and usage examples for frontend integration.

---

## 1. Get My Opportunities

### Endpoint

```
GET /api/v1/recruiter/opportunities
```

### Description

Fetches opportunities posted by the current recruiter with search, filters, and pagination.

### Authentication

- **Required**: Yes (Bearer token)
- **Role**: Recruiter

### Query Parameters

| Parameter         | Type    | Required | Default     | Description                                                                |
| ----------------- | ------- | -------- | ----------- | -------------------------------------------------------------------------- |
| `q`               | string  | No       | -           | Search across title, category, tags, company, description                  |
| `limit`           | number  | No       | 20          | Results per page                                                           |
| `offset`          | number  | No       | 0           | Results offset for pagination                                              |
| `type`            | enum    | No       | -           | Opportunity type: `job`, `freelance`, `contract`, `internship`, `parttime` |
| `status`          | enum    | No       | -           | Status: `active`, `closed`, `draft`                                        |
| `location`        | string  | No       | -           | Filter by location (partial match, case-insensitive)                       |
| `category`        | string  | No       | -           | Filter by category (comma-separated, case-insensitive)                     |
| `tags`            | string  | No       | -           | Filter by tags (comma-separated, case-insensitive)                         |
| `experienceLevel` | string  | No       | -           | Filter by experience level (case-insensitive)                              |
| `minBudget`       | number  | No       | -           | Minimum budget filter                                                      |
| `maxBudget`       | number  | No       | -           | Maximum budget filter                                                      |
| `isFeatured`      | boolean | No       | -           | Filter featured opportunities                                              |
| `sortBy`          | string  | No       | `createdAt` | Sort field: `createdAt`, `applicationCount`, `title`, `price`, `minBudget` |
| `sortOrder`       | string  | No       | `desc`      | Sort order: `asc`, `desc`                                                  |

### Search Priority (when using `q`)

Results are ranked by relevance:

1. **Title match** (highest priority)
2. **Category match**
3. **Tags match**
4. **Company match**
5. **Description match** (lowest priority)

### Response Format

```typescript
{
  data: Array<{
    id: string;
    type: string;
    title: string;
    description: string;
    requirements: string | null;
    company: string;
    logo: string | null;
    keyResponsibilities: string | null;
    employmentType: string | null;
    location: string;
    compensation: string | null;
    tags: string[];
    category: string;
    workType: string | null;
    compensationType: string | null;
    experienceLevel: string | null;
    minBudget: number | null;
    maxBudget: number | null;
    paymentType: string | null;
    priceMode: string | null;
    price: number | null;
    tools: string[] | null;
    duration: string | null;
    maxHours: number | null;
    startDate: Date | null;
    applicationCap: number | null;
    closingDate: Date | null;
    applicationCount: number;
    status: string;
    postedById: string;
    isFeatured: boolean;
    featuredUntil: Date | null;
    createdAt: Date;
    updatedAt: Date;
    postedBy: {
      id: string;
      email: string;
      username: string;
      roles: string[];
      recruiterProfile: {
        id: string;
        bio: string | null;
        company: string | null;
        industry: string | null;
        location: string | null;
        companySize: string | null;
        companyStage: string | null;
        operatingModel: string | null;
        profileImageUrl: string | null;
        coverImageUrl: string | null;
        links: any | null;
        visibility: string;
      } | null;
    };
    appliedAs: string[];
    saved: boolean;
    invitationSent: boolean;
  }>,
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

### Example Requests

**Basic search:**

```javascript
const response = await fetch(
  "/api/v1/recruiter/opportunities?q=developer&limit=20&offset=0",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

**With filters:**

```javascript
const response = await fetch(
  "/api/v1/recruiter/opportunities?q=designer&location=Lagos&tags=Remote,Full Time&status=active&limit=20",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

**Pagination (page 2):**

```javascript
const response = await fetch(
  "/api/v1/recruiter/opportunities?limit=20&offset=20",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

### Frontend Implementation Example

```typescript
interface OpportunityFilters {
  q?: string;
  limit?: number;
  offset?: number;
  type?: string;
  status?: string;
  location?: string;
  category?: string;
  tags?: string;
  experienceLevel?: string;
  minBudget?: number;
  maxBudget?: number;
  isFeatured?: boolean;
  sortBy?: string;
  sortOrder?: string;
}

async function fetchMyOpportunities(filters: OpportunityFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await fetch(`/api/v1/recruiter/opportunities?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
}

// Usage
const result = await fetchMyOpportunities({
  q: "developer",
  location: "Lagos",
  tags: "React,Node.js",
  limit: 20,
  offset: 0,
});

console.log(result.data); // Array of opportunities
console.log(result.pagination); // Pagination metadata
```

---

## 2. Get My Applications

### Endpoint

```
GET /api/v1/recruiter/applications
```

### Description

Fetches applications to opportunities posted by the current recruiter with search, filters, and pagination.

### Authentication

- **Required**: Yes (Bearer token)
- **Role**: Recruiter

### Query Parameters

| Parameter       | Type   | Required | Default  | Description                                                                                                               |
| --------------- | ------ | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------- |
| `q`             | string | No       | -        | Search by applicant name, username, or opportunity title                                                                  |
| `limit`         | number | No       | 20       | Results per page                                                                                                          |
| `offset`        | number | No       | 0        | Results offset for pagination                                                                                             |
| `opportunityId` | string | No       | -        | Filter by specific opportunity ID                                                                                         |
| `status`        | enum   | No       | -        | Application status: `applied`, `reviewing`, `shortlisted`, `interviewing`, `offered`, `accepted`, `rejected`, `withdrawn` |
| `location`      | string | No       | -        | Filter by talent location (partial match, case-insensitive)                                                               |
| `skills`        | string | No       | -        | Filter by skills (comma-separated, case-insensitive)                                                                      |
| `dateRange`     | enum   | No       | -        | Date range: `today`, `week`, `month`                                                                                      |
| `sortBy`        | enum   | No       | `newest` | Sort order: `newest`, `oldest`, `name-asc`, `name-desc`                                                                   |

### Response Format

```typescript
{
  data: Array<{
    id: string;
    userId: string;
    opportunityId: string;
    profileType: string;
    status: string;
    note: string | null;
    invitedBy: string | null;
    createdAt: Date;
    updatedAt: Date;
    user: {
      id: string;
      username: string;
      email: string;
      talentProfile: {
        id: string;
        fullName: string;
        headline: string | null;
        bio: string | null;
        skills: string[];
        location: string | null;
        profileImageUrl: string | null;
        category: string | null;
        gallery: string[] | null;
        hiredCount: number;
        earnings: number;
      } | null;
    };
    opportunity: {
      id: string;
      title: string;
      company: string;
      type: string;
      description: string;
      location: string;
      logo: string | null;
      postedBy: {
        id: string;
        username: string;
        recruiterProfile: {
          profileImageUrl: string | null;
          company: string | null;
        } | null;
      };
    };
    interviews: Array<{
      id: string;
      applicationId: string;
      scheduledDate: Date;
      message: string | null;
      meetingLink: string | null;
      status: string;
      createdAt: Date;
      updatedAt: Date;
    }>;
  }>,
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

### Example Requests

**Basic search:**

```javascript
const response = await fetch(
  "/api/v1/recruiter/applications?q=john&limit=20&offset=0",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

**With filters:**

```javascript
const response = await fetch(
  "/api/v1/recruiter/applications?status=applied&skills=React,TypeScript&location=Lagos&dateRange=week&limit=20",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

**Filter by opportunity:**

```javascript
const response = await fetch(
  "/api/v1/recruiter/applications?opportunityId=opp-123&status=shortlisted",
  {
    headers: { Authorization: `Bearer ${token}` },
  },
);
```

### Frontend Implementation Example

```typescript
interface ApplicationFilters {
  q?: string;
  limit?: number;
  offset?: number;
  opportunityId?: string;
  status?: string;
  location?: string;
  skills?: string;
  dateRange?: "today" | "week" | "month";
  sortBy?: "newest" | "oldest" | "name-asc" | "name-desc";
}

async function fetchMyApplications(filters: ApplicationFilters) {
  const params = new URLSearchParams();

  Object.entries(filters).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== "") {
      params.append(key, String(value));
    }
  });

  const response = await fetch(`/api/v1/recruiter/applications?${params}`, {
    headers: { Authorization: `Bearer ${token}` },
  });

  return response.json();
}

// Usage
const result = await fetchMyApplications({
  q: "john",
  status: "applied",
  skills: "React,Node.js",
  dateRange: "week",
  limit: 20,
  offset: 0,
});

console.log(result.data); // Array of applications
console.log(result.pagination); // Pagination metadata
```

---

## Common Patterns

### 1. Pagination

All endpoints use the same pagination pattern:

```typescript
// Calculate page number from offset
const currentPage = Math.floor(offset / limit) + 1;

// Go to next page
const nextOffset = offset + limit;

// Go to previous page
const prevOffset = Math.max(0, offset - limit);

// Go to specific page (1-indexed)
const pageOffset = (pageNumber - 1) * limit;
```

### 2. Search Debouncing

Implement debouncing for search inputs:

```typescript
import { useState, useEffect } from "react";

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value);

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value);
    }, delay);

    return () => clearTimeout(handler);
  }, [value, delay]);

  return debouncedValue;
}

// Usage
const [searchTerm, setSearchTerm] = useState("");
const debouncedSearch = useDebounce(searchTerm, 500);

useEffect(() => {
  if (debouncedSearch) {
    fetchMyOpportunities({ q: debouncedSearch });
  }
}, [debouncedSearch]);
```

### 3. Filter State Management

```typescript
const [filters, setFilters] = useState({
  q: "",
  limit: 20,
  offset: 0,
  status: "",
  location: "",
  tags: "",
});

// Update single filter
const updateFilter = (key: string, value: any) => {
  setFilters((prev) => ({
    ...prev,
    [key]: value,
    offset: 0, // Reset to first page when filters change
  }));
};

// Clear all filters
const clearFilters = () => {
  setFilters({
    q: "",
    limit: 20,
    offset: 0,
    status: "",
    location: "",
    tags: "",
  });
};
```

### 4. Loading States

```typescript
const [loading, setLoading] = useState(false);
const [data, setData] = useState([]);
const [pagination, setPagination] = useState(null);
const [error, setError] = useState(null);

async function loadData(filters) {
  setLoading(true);
  setError(null);

  try {
    const result = await fetchMyOpportunities(filters);
    setData(result.data);
    setPagination(result.pagination);
  } catch (err) {
    setError(err.message);
  } finally {
    setLoading(false);
  }
}
```

---

## Important Notes

### Case-Insensitive Filters

All text-based filters are case-insensitive. These searches will all work:

- `skills=React` matches "React", "react", "REACT"
- `skills=UX Design` matches "UX Design", "ux design", "Ux Design"
- `location=lagos` matches "Lagos", "LAGOS", "lagos"

### Comma-Separated Filters

Multiple values can be provided using commas:

- `tags=Remote,Full Time,Contract`
- `skills=React,Node.js,TypeScript`
- `category=Design,Development`

### Pagination Metadata

Use the pagination object to build UI:

```typescript
<Pagination
  currentPage={pagination.currentPage}
  totalPages={pagination.totalPages}
  hasNextPage={pagination.hasNextPage}
  hasPreviousPage={pagination.hasPreviousPage}
  onPageChange={(page) => {
    const newOffset = (page - 1) * filters.limit;
    updateFilter('offset', newOffset);
  }}
/>
```

### Empty Results

When no results match the filters:

```typescript
{
  data: [],
  pagination: {
    total: 0,
    limit: 20,
    offset: 0,
    currentPage: 1,
    totalPages: 0,
    hasNextPage: false,
    hasPreviousPage: false
  }
}
```

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning      | Action                       |
| ---- | ------------ | ---------------------------- |
| 200  | Success      | Process the response         |
| 401  | Unauthorized | Redirect to login            |
| 403  | Forbidden    | Show "Access denied" message |
| 404  | Not found    | Show "Resource not found"    |
| 500  | Server error | Show "Something went wrong"  |

### Example Error Handler

```typescript
async function fetchWithErrorHandling(url: string, options: RequestInit) {
  try {
    const response = await fetch(url, options);

    if (!response.ok) {
      if (response.status === 401) {
        // Redirect to login
        window.location.href = "/login";
        return;
      }

      const error = await response.json();
      throw new Error(error.message || "Request failed");
    }

    return response.json();
  } catch (error) {
    console.error("API Error:", error);
    throw error;
  }
}
```

---

## Complete React Example

```typescript
import { useState, useEffect } from 'react';

function RecruiterOpportunities() {
  const [opportunities, setOpportunities] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState({
    q: '',
    limit: 20,
    offset: 0,
    status: 'active',
    location: '',
    tags: '',
  });

  useEffect(() => {
    loadOpportunities();
  }, [filters]);

  async function loadOpportunities() {
    setLoading(true);

    try {
      const params = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });

      const response = await fetch(
        `/api/v1/recruiter/opportunities?${params}`,
        {
          headers: { 'Authorization': `Bearer ${token}` }
        }
      );

      const result = await response.json();
      setOpportunities(result.data);
      setPagination(result.pagination);
    } catch (error) {
      console.error('Failed to load opportunities:', error);
    } finally {
      setLoading(false);
    }
  }

  const handleSearch = (q: string) => {
    setFilters(prev => ({ ...prev, q, offset: 0 }));
  };

  const handlePageChange = (page: number) => {
    const offset = (page - 1) * filters.limit;
    setFilters(prev => ({ ...prev, offset }));
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

      {loading ? (
        <Loader />
      ) : (
        <>
          <OpportunityList opportunities={opportunities} />

          {pagination && (
            <Pagination
              currentPage={pagination.currentPage}
              totalPages={pagination.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
```

---

## Summary

Both recruiter endpoints (`/opportunities` and `/applications`) follow the same patterns:

✅ Use `q` for search  
✅ Use `limit` and `offset` for pagination (defaults: 20, 0)  
✅ Return `{ data, pagination }` format  
✅ Support case-insensitive filters  
✅ Support comma-separated multi-value filters  
✅ Include complete pagination metadata

This consistency makes it easy to build reusable components for search, filtering, and pagination across your application.
