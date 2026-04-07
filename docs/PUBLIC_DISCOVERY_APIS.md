# Public Discovery APIs Documentation

This document provides comprehensive documentation for all public discovery endpoints in the TalentNG platform. These endpoints allow users to browse and search for talents, mentors, recruiters, and opportunities without authentication.

## Table of Contents

1. [Talents API](#talents-api)
2. [Mentors API](#mentors-api)
3. [Recruiters API](#recruiters-api)
4. [Opportunities API](#opportunities-api)
5. [Common Patterns](#common-patterns)
6. [Response Structures](#response-structures)

---

## Talents API

### Browse/Search Talents

**Endpoint**: `GET /api/v1/talents`

**Authentication**: None (Public)

**Description**: Browse and search public talent profiles with filtering, sorting, and pagination.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search by name, headline, bio, skills, or services |
| `category` | string | No | Filter by category |
| `headline` | string | No | Filter by headline (partial match) |
| `skills` | string | No | Filter by skills (comma-separated) |
| `stack` | string | No | Filter by tech stack/tools (comma-separated) |
| `location` | string | No | Filter by location |
| `availability` | string | No | Filter by availability (comma-separated) |
| `isFeatured` | boolean | No | Filter featured talents |
| `sort` | enum | No | Sort order: `newest`, `oldest` (default: `newest`) |
| `limit` | number | No | Results per page (default: 20) |
| `offset` | number | No | Results offset (default: 0) |

#### Example Request

```bash
GET /api/v1/talents?q=developer&skills=JavaScript,React&location=Lagos&limit=10
```

#### Response

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "fullName": "John Doe",
    "headline": "Full Stack Developer",
    "bio": "Experienced developer...",
    "skills": ["JavaScript", "React", "Node.js"],
    "stack": ["React", "PostgreSQL"],
    "location": "Lagos, Nigeria",
    "availability": ["full-time", "contract"],
    "category": "Software Development",
    "profileImageUrl": "https://...",
    "coverImageUrl": "https://...",
    "views": 150,
    "isFeatured": false,
    "visibility": "public",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

### Get Single Talent Profile

**Endpoint**: `GET /api/v1/talents/:id`

**Authentication**: None (Public)

**Description**: Get a single public talent profile by talent profile ID. Automatically increments view count with IP-based tracking.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Talent profile ID |

#### Example Request

```bash
GET /api/v1/talents/a04f7f39-fc4a-4413-ac1d-f9bc52e45f34
```

#### Response

Same structure as browse endpoint, but returns a single object instead of an array.

#### Response

Same structure as browse endpoint, but returns a single object instead of an array.

---

## Mentors API

### Browse/Search Mentors

**Endpoint**: `GET /api/v1/mentors`

**Authentication**: None (Public)

**Description**: Browse and search public mentor profiles with filtering, sorting, and pagination.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search by name, expertise, headline, or bio (with prioritized ranking) |
| `expertise` | string | No | Filter by expertise (comma-separated) |
| `industries` | string | No | Filter by industries (comma-separated) |
| `location` | string | No | Filter by location |
| `category` | string | No | Filter by category |
| `languages` | string | No | Filter by languages (comma-separated) |
| `stack` | string | No | Filter by tech stack (comma-separated) |
| `isFeatured` | boolean | No | Filter featured mentors |
| `sortBy` | enum | No | Sort field: `createdAt`, `avgRating`, `totalSessions` (default: `createdAt`) |
| `sortOrder` | enum | No | Sort order: `asc`, `desc` (default: `desc`) |
| `limit` | number | No | Results per page (default: 20) |
| `offset` | number | No | Results offset (default: 0) |

#### Example Request

```bash
GET /api/v1/mentors?expertise=Product%20Management&industries=Tech&sortBy=avgRating&sortOrder=desc
```

#### Response

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "fullName": "Jane Smith",
    "headline": "Senior Product Manager",
    "bio": "10+ years in product...",
    "expertise": ["Product Management", "Strategy"],
    "industries": ["Tech", "Fintech"],
    "languages": ["English", "French"],
    "stack": ["Jira", "Figma"],
    "location": "Remote",
    "category": "Product Management",
    "avgRating": 4.8,
    "totalSessions": 45,
    "totalMentees": 30,
    "sessionRate": 50000,
    "sessionCurrency": "NGN",
    "profileImageUrl": "https://...",
    "views": 200,
    "isFeatured": true,
    "visibility": "public",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

### Get Single Mentor Profile

**Endpoint**: `GET /api/v1/mentors/:id`

**Authentication**: None (Public)

**Description**: Get a single public mentor profile by mentor profile ID. Automatically increments view count with IP-based tracking.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Mentor profile ID |

#### Example Request

```bash
GET /api/v1/mentors/b15c8e47-fc4a-4413-ac1d-f9bc52e45f34
```

#### Response

Same structure as browse endpoint, but returns a single object instead of an array.

### Get Mentor Reviews

**Endpoint**: `GET /api/v1/mentors/:id/reviews`

**Authentication**: None (Public)

**Description**: Get paginated reviews for a mentor.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Mentor profile ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `limit` | number | No | Results per page |
| `offset` | number | No | Results offset |

### Get Mentor Availability

**Endpoint**: `GET /api/v1/mentors/:id/availability`

**Authentication**: None (Public)

**Description**: Get available booking time slots for a mentor.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Mentor profile ID |

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `startDate` | string | No | Start date (YYYY-MM-DD) |
| `endDate` | string | No | End date (YYYY-MM-DD) |

#### Example Request

```bash
GET /api/v1/mentors/b15c8e47-fc4a-4413-ac1d-f9bc52e45f34/availability?startDate=2024-02-01&endDate=2024-02-14
```

---

## Recruiters API

### Browse/Search Recruiters

**Endpoint**: `GET /api/v1/recruiters`

**Authentication**: None (Public)

**Description**: Browse and search public recruiter profiles with filtering, sorting, and pagination.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | Search by company name, industry, or bio |
| `company` | string | No | Filter by company name (partial match) |
| `industry` | string | No | Filter by industry |
| `location` | string | No | Filter by location |
| `companySize` | string | No | Filter by company size |
| `companyStage` | string | No | Filter by company stage |
| `operatingModel` | string | No | Filter by operating model |
| `isFeatured` | boolean | No | Filter featured recruiters |
| `sort` | enum | No | Sort order: `newest`, `oldest`, `views` (default: `newest`) |
| `limit` | number | No | Results per page (default: 20, max: 100) |
| `offset` | number | No | Results offset (default: 0) |

#### Example Request

```bash
GET /api/v1/recruiters?industry=Technology&companySize=51-200&location=Lagos&sort=views
```

#### Response

```json
[
  {
    "id": "uuid",
    "userId": "uuid",
    "username": "techcorp",
    "company": "TechCorp Nigeria",
    "industry": "Technology",
    "bio": "Leading tech company...",
    "location": "Lagos, Nigeria",
    "companySize": "51-200",
    "companyStage": "Series A",
    "operatingModel": "Hybrid",
    "links": {
      "website": "https://techcorp.com",
      "linkedin": "https://linkedin.com/company/techcorp"
    },
    "profileImageUrl": "https://...",
    "coverImageUrl": "https://...",
    "views": 500,
    "isFeatured": true,
    "visibility": "public",
    "verificationStatus": "approved",
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

### Get Single Recruiter Profile

**Endpoint**: `GET /api/v1/recruiters/:id`

**Authentication**: None (Public)

**Description**: Get a single public recruiter profile by profile ID or user ID. Attempts profile ID first, then falls back to user ID lookup.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Recruiter profile ID (or user ID as fallback) |

#### Example Request

```bash
GET /api/v1/recruiters/c26d9f58-fc4a-4413-ac1d-f9bc52e45f34
```

#### Response

Same structure as browse endpoint, but returns a single object instead of an array.

#### Response

Same structure as browse endpoint, but returns a single object instead of an array.

---

## Opportunities API

### Browse/Search Opportunities

**Endpoint**: `GET /api/v1/opportunities`

**Authentication**: Optional (Enhanced with auth)

**Description**: Browse and search opportunities with filtering, sorting, and pagination. When authenticated, includes user's application status for each opportunity.

#### Query Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `q` | string | No | General search query |
| `type` | enum | No | Opportunity type: `job`, `gig`, `contract`, `internship` |
| `title` | string | No | Filter by title (partial match) |
| `location` | string | No | Filter by location |
| `tags` | string | No | Filter by tags (comma-separated) |
| `status` | enum | No | Filter by status: `active`, `closed`, `draft` |
| `postedById` | string | No | Filter by recruiter user ID |
| `isFeatured` | boolean | No | Filter featured opportunities |
| `category` | string | No | Filter by category |
| `experienceLevel` | string | No | Filter by experience level |
| `minBudget` | number | No | Minimum budget filter |
| `maxBudget` | number | No | Maximum budget filter |
| `sortBy` | string | No | Sort field |
| `sortOrder` | enum | No | Sort order: `asc`, `desc` |
| `limit` | number | No | Results per page |
| `offset` | number | No | Results offset |
| `talentId` | string | No | Talent ID to check application status (for recruiters) |

#### Example Request

```bash
GET /api/v1/opportunities?type=job&category=Software%20Development&experienceLevel=Mid-Level&location=Remote
```

#### Response (Authenticated)

```json
[
  {
    "id": "uuid",
    "type": "job",
    "title": "Senior Backend Engineer",
    "description": "We are looking for...",
    "requirements": ["5+ years experience", "Node.js expertise"],
    "keyResponsibilities": ["Design APIs", "Mentor juniors"],
    "company": "TechCorp Nigeria",
    "logo": "https://...",
    "employmentType": "Full-time",
    "location": "Remote",
    "compensation": "₦8,000,000 - ₦12,000,000/year",
    "tags": ["Backend", "Node.js", "PostgreSQL"],
    "category": "Software Development",
    "experienceLevel": "Senior",
    "status": "active",
    "views": 1250,
    "applicationCount": 45,
    "isFeatured": true,
    "postedBy": {
      "id": "uuid",
      "username": "techcorp",
      "company": "TechCorp Nigeria",
      "verificationStatus": "approved"
    },
    "hasApplied": false,
    "userApplicationStatus": null,
    "createdAt": "2024-01-01T00:00:00.000Z",
    "updatedAt": "2024-01-15T00:00:00.000Z"
  }
]
```

#### Response (Unauthenticated)

Same structure but without `hasApplied` and `userApplicationStatus` fields.

### Get Single Opportunity

**Endpoint**: `GET /api/v1/opportunities/:id`

**Authentication**: Optional (Enhanced with auth)

**Description**: Get a single opportunity by ID. Automatically increments view count with IP-based tracking. When authenticated, includes user's application status.

#### Path Parameters

| Parameter | Type | Required | Description |
|-----------|------|----------|-------------|
| `id` | string | Yes | Opportunity ID |

#### Example Request

```bash
GET /api/v1/opportunities/d37e0g69-fc4a-4413-ac1d-f9bc52e45f34
```

---

## Common Patterns

### Pagination

All browse/search endpoints support pagination using `limit` and `offset` parameters:

```bash
# Get first 20 results (default)
GET /api/v1/talents

# Get next 20 results
GET /api/v1/talents?limit=20&offset=20

# Get 50 results starting from position 100
GET /api/v1/talents?limit=50&offset=100
```

### Filtering

Multiple filters can be combined:

```bash
GET /api/v1/mentors?expertise=Product&industries=Tech,Fintech&location=Lagos
```

### Searching

The `q` parameter performs full-text search across multiple fields:

```bash
# Search talents by name, headline, bio, or skills
GET /api/v1/talents?q=react%20developer

# Search mentors by name, expertise, headline, or bio
GET /api/v1/mentors?q=product%20management

# Search recruiters by company, industry, or bio
GET /api/v1/recruiters?q=fintech
```

### Sorting

Different endpoints support different sort options:

**Talents**: `newest`, `oldest`
**Mentors**: `createdAt`, `avgRating`, `totalSessions` (with `sortOrder`: `asc`/`desc`)
**Recruiters**: `newest`, `oldest`, `views`
**Opportunities**: Custom `sortBy` and `sortOrder`

### Featured Items

All endpoints support filtering by featured status:

```bash
GET /api/v1/talents?isFeatured=true
GET /api/v1/mentors?isFeatured=true
GET /api/v1/recruiters?isFeatured=true
GET /api/v1/opportunities?isFeatured=true
```

### View Tracking

All single-item GET endpoints automatically track views using IP-based deduplication to count unique visitors.

---

## Response Structures

### Verification Status

Recruiter profiles include a `verificationStatus` field:

- `approved`: User is verified with organization-level verification
- `pending`: User has submitted verification but awaiting approval
- `rejected`: Verification was rejected
- `null`: No verification submitted

### Visibility

All profile endpoints only return `public` profiles. Private profiles are not accessible through these endpoints.

### Timestamps

All responses include:
- `createdAt`: ISO 8601 timestamp of creation
- `updatedAt`: ISO 8601 timestamp of last update

### Error Responses

All endpoints follow standard HTTP status codes:

- `200 OK`: Successful request
- `404 Not Found`: Resource not found
- `400 Bad Request`: Invalid parameters
- `500 Internal Server Error`: Server error

Error response format:

```json
{
  "statusCode": 404,
  "message": "Talent profile not found or private",
  "error": "Not Found"
}
```

---

## Rate Limiting

All public endpoints are subject to rate limiting. Contact the API team for current rate limit policies.

---

## Support

For questions or issues with these APIs, please contact the backend team or create a support ticket.

**Last Updated**: April 6, 2026
