# Opportunities API Response Structure

## Overview

Both talent and recruiter opportunities endpoints return the **exact same structure** with `verificationStatus` included.

## Endpoints

### 1. Talent Opportunities

**Endpoint**: `GET /api/v1/talent/opportunities`

**Auth**: Required (JWT)

**Filters**:

- `q` - Search query
- `type` - Opportunity type
- `location` - Location filter
- `category` - Category filter
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset

**Behavior**: Automatically filters to `status: 'active'` only

### 2. Recruiter Opportunities

**Endpoint**: `GET /api/v1/recruiter/opportunities`

**Auth**: Required (JWT)

**Filters**:

- `status` - Filter by status (active, draft, closed)
- `limit` - Results per page (default: 20)
- `offset` - Pagination offset
- `talentId` - Check application status for specific talent

**Behavior**: Automatically filters to `postedById: currentUser.id`

## Response Structure

Both endpoints return:

```typescript
{
  data: Opportunity[],
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

## Opportunity Object Structure

Each opportunity in the `data` array contains:

```typescript
{
  // Core Fields
  id: string,
  title: string,
  type: "FullTime" | "PartTime" | "Contract" | "Internship" | "Volunteer" | "Freelance",
  status: "active" | "draft" | "closed",
  company: string,
  logo: string,
  tags: string[],
  createdAt: string,  // ISO date
  postedById: string,

  // Pricing Fields
  priceMode: "fixed" | "range",
  price: number | null,        // For fixed price
  minBudget: number | null,    // For range
  maxBudget: number | null,    // For range
  paymentType: "hourly" | "weekly" | "monthly",

  // Optional Fields
  category?: string,
  location?: string,
  experienceLevel?: string,
  duration?: string,
  description?: string,
  requirements?: string[],
  keyResponsibilities?: string[],

  // User-Specific Fields
  appliedAs?: ("talent" | "mentor")[],  // Which roles user applied as
  saved?: boolean,                       // Whether user saved this
  invitationSent?: boolean,             // Whether user was invited
  alreadyApplied?: boolean,             // Whether user already applied

  // Poster Information
  postedBy: {
    id: string,
    username: string,
    recruiterProfile: {
      company: string,
      profileImageUrl: string,
      location: string
    }
  },

  // ✅ VERIFICATION STATUS - CRITICAL
  verificationStatus: "pending" | "approved" | "rejected" | null
}
```

## Verification Status Logic

The `verificationStatus` field is calculated as follows:

```typescript
if (user.isVerified === true && user.verificationLevel === "org") {
  return "approved";
} else if (user.verificationLevel === "org" && user.isVerified === false) {
  return "pending";
} else {
  return null;
}
```

## Example Response

### Talent Opportunities Response

```json
{
  "data": [
    {
      "id": "fa90aef9-baf5-4f5b-98fd-3508ad9bfdbe",
      "title": "Senior Software Engineer",
      "type": "FullTime",
      "status": "active",
      "company": "Big Ideas Lab",
      "logo": "https://s3.amazonaws.com/...",
      "tags": ["React", "Node.js", "TypeScript"],
      "createdAt": "2025-03-31T10:00:00.000Z",
      "postedById": "40fd06b8-9d26-4de7-88e2-4ba442fe559e",

      "priceMode": "range",
      "price": null,
      "minBudget": 324,
      "maxBudget": 4334,
      "paymentType": "monthly",

      "category": "Engineering",
      "location": "Lagos, Nigeria",
      "experienceLevel": "Senior",
      "duration": "Full-time",
      "description": "We are looking for...",

      "appliedAs": ["talent"],
      "saved": false,
      "invitationSent": false,
      "alreadyApplied": true,

      "postedBy": {
        "id": "40fd06b8-9d26-4de7-88e2-4ba442fe559e",
        "username": "recruiter_user",
        "recruiterProfile": {
          "company": "Big Ideas Lab",
          "profileImageUrl": "https://s3.amazonaws.com/...",
          "location": "Lagos, Nigeria"
        }
      },

      "verificationStatus": "approved" // ✅ INCLUDED
    }
  ],
  "pagination": {
    "total": 45,
    "limit": 20,
    "offset": 0,
    "currentPage": 1,
    "totalPages": 3,
    "hasNextPage": true,
    "hasPreviousPage": false
  }
}
```

### Recruiter Opportunities Response

Same structure as above, but:

- All opportunities have `postedById` matching the current user
- May include draft and closed opportunities (not just active)
- `appliedAs`, `saved`, `invitationSent`, `alreadyApplied` still included for consistency

## Key Differences Between Endpoints

| Feature              | Talent Endpoint         | Recruiter Endpoint         |
| -------------------- | ----------------------- | -------------------------- |
| Filter by status     | Always `active`         | Can filter by any status   |
| Filter by poster     | All recruiters          | Only current user's posts  |
| User-specific fields | Based on current talent | Based on current recruiter |
| Verification status  | ✅ Included             | ✅ Included                |

## Consistency Guarantee

Both endpoints:

1. ✅ Call the same `opportunityService.findAll()` method
2. ✅ Return the same response structure
3. ✅ Include `verificationStatus` in every opportunity
4. ✅ Include `postedBy` relation with recruiter profile
5. ✅ Convert Decimal fields to numbers (minBudget, maxBudget, price)
6. ✅ Include user-specific fields (appliedAs, saved, etc.)

## Backend Implementation

The response is generated by:

1. **Service**: `src/modules/opportunity/opportunity.service.ts`
   - `findAll()` method handles all queries
   - `convertOpportunityForResponse()` adds `verificationStatus`

2. **Controllers**:
   - `src/modules/talent/talent.controller.ts` - Talent endpoint
   - `src/modules/recruiter/recruiter.controller.ts` - Recruiter endpoint

3. **Transformation**:
   - Prisma query includes `postedBy` with `isVerified` and `verificationLevel`
   - `convertOpportunityForResponse()` calculates `verificationStatus`
   - Decimal fields converted to numbers
   - User-specific fields added (appliedAs, saved, etc.)

## Testing

Both endpoints have been verified to return `verificationStatus: 'approved'` for verified recruiters:

```
🔍 Talent Controller returning (paginated): {
  firstOppId: '6205c73d-ffbb-4e98-a1c4-da6923c6c3f8',
  firstOppVerificationStatus: 'approved'
}
```

## Frontend Integration

The frontend can safely assume:

1. Both endpoints return the same structure
2. `verificationStatus` is always present (may be `null`)
3. `postedBy` relation is always included
4. Pagination metadata is always included
5. All numeric fields are JavaScript numbers (not strings or Decimals)

If `verificationStatus` is showing as `undefined` in the frontend, check:

1. Browser Network tab - is the field in the HTTP response?
2. Frontend data transformation - is something removing the field?
3. TypeScript interfaces - do they include `verificationStatus`?
4. Component props - is the field being passed through correctly?
