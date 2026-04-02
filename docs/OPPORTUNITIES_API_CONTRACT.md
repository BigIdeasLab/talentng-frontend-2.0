# Opportunities API Contract

This document defines the exact fields the frontend expects from the opportunities API endpoints.

## Talent Opportunities Endpoint

**Endpoint**: `GET /api/talent/opportunities` (or similar)

### Required Response Structure

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

### Opportunity Object Fields

The frontend expects each opportunity object to have the following fields:

#### Core Fields (Required)

```typescript
{
  id: string,                    // Unique opportunity ID
  title: string,                 // Job title
  type: string,                  // "FullTime" | "PartTime" | "Contract" | "Internship" | "Volunteer" | "Freelance"
  status: string,                // "active" | "draft" | "closed"
  company: string,               // Company name
  logo: string,                  // Company logo URL
  tags: string[],                // Skills/tags array
  createdAt: string,             // ISO date string
  postedById: string,            // User ID of the poster
}
```

#### Pricing Fields (Required)

```typescript
{
  priceMode: string,             // "fixed" | "range"
  price: number | null,          // Used when priceMode is "fixed"
  minBudget: number | null,      // Used when priceMode is "range"
  maxBudget: number | null,      // Used when priceMode is "range"
  paymentType: string,           // "hourly" | "weekly" | "monthly"
}
```

#### Optional Fields

```typescript
{
  category?: string,             // Job category
  location?: string,             // Job location
  experienceLevel?: string,      // "Junior" | "Mid" | "Senior"
  duration?: string,             // Project duration
  description?: string,          // Job description
  requirements?: string[],       // Job requirements
  keyResponsibilities?: string[], // Key responsibilities
}
```

#### User-Specific Fields (Required for personalization)

```typescript
{
  appliedAs?: ("talent" | "mentor")[],  // Which roles the user applied as
  saved?: boolean,                       // Whether user saved this opportunity
  userHasSaved?: boolean,               // Alternative field name for saved status
}
```

#### Poster Information (Required for verification badge)

```typescript
{
  postedBy: {
    id: string,                  // User ID (same as postedById)
    username: string,            // Username
    recruiterProfile: {
      company: string,           // Company name
      profileImageUrl: string,   // Company logo URL
      location: string,          // Company location
    }
  },
  verificationStatus: "pending" | "approved" | "rejected" | null  // ⚠️ CRITICAL: Required for verified badge
}
```

## How verificationStatus Is Calculated (Backend Logic)

According to the backend documentation (`OPPORTUNITIES_RESPONSE_STRUCTURE.md`), the `verificationStatus` is calculated as:

```typescript
if (user.isVerified === true && user.verificationLevel === "org") {
  return "approved";
} else if (user.verificationLevel === "org" && user.isVerified === false) {
  return "pending";
} else {
  return null;
}
```

**Note**: The backend uses `verificationLevel === 'org'` (not `'business'`)

## Frontend Mapping

The frontend maps the API response to `DisplayOpportunity` type:

```typescript
{
  id: opp.id,
  postedById: opp.postedBy?.id || opp.postedById,
  companyName: opp.postedBy?.recruiterProfile?.company || opp.company,
  companyLogo: opp.logo || opp.postedBy?.recruiterProfile?.profileImageUrl,
  date: formatDate(opp.createdAt),  // Formatted as "Mar 31"
  type: opp.type,
  title: opp.title,
  category: opp.category,
  skills: opp.tags,
  rate: calculateRate(opp),  // Formatted as "₦324 - ₦4,334/mo"
  status: opp.status,
  appliedAs: opp.appliedAs || [],
  saved: opp.saved || opp.userHasSaved || false,
  priceMode: opp.priceMode,
  minBudget: opp.minBudget,
  maxBudget: opp.maxBudget,
  price: opp.price,
  paymentType: opp.paymentType,
  location: opp.location,
  experienceLevel: opp.experienceLevel,
  duration: opp.duration,
  verificationStatus: opp.verificationStatus  // ⚠️ CRITICAL: Must be included
}
```

## Current Issue

According to the backend documentation (`OPPORTUNITIES_RESPONSE_STRUCTURE.md`), the `verificationStatus` field **should already be included** in the API response. The backend has confirmed:

```
🔍 Talent Controller returning (paginated): {
  firstOppId: '6205c73d-ffbb-4e98-a1c4-da6923c6c3f8',
  firstOppVerificationStatus: 'approved'
}
```

However, the frontend is receiving `verificationStatus: undefined`. This suggests one of the following:

1. **Data transformation issue**: Something in the frontend is removing the field
2. **Type mismatch**: The field exists but with a different name
3. **Caching issue**: Old cached responses without the field
4. **Environment mismatch**: Backend changes not deployed to the environment being tested

### Debugging Steps

1. Check browser Network tab → Response → Look for `verificationStatus` in the raw JSON
2. Check if the field exists but is being filtered out during mapping
3. Clear browser cache and hard refresh
4. Verify the backend environment has the latest code deployed

### Example of Current (Broken) Response

```json
{
  "id": "fa90aef9-baf5-4f5b-98fd-3508ad9bfdbe",
  "title": "Senior Developer",
  "company": "Big ideas lab",
  "postedById": "40fd06b8-9d26-4de7-88e2-4ba442fe559e",
  "verificationStatus": undefined // ❌ Missing!
}
```

### Example of Expected (Fixed) Response

```json
{
  "id": "fa90aef9-baf5-4f5b-98fd-3508ad9bfdbe",
  "title": "Senior Developer",
  "company": "Big ideas lab",
  "postedById": "40fd06b8-9d26-4de7-88e2-4ba442fe559e",
  "verificationStatus": "approved" // ✅ Correct!
}
```

## Where Verified Badge Is Displayed

The verified badge appears in these locations:

1. **Talent Opportunities Page** (`/opportunities`) - Next to company name in opportunity cards
2. **Employer Opportunities Page** (`/opportunities` as recruiter) - Next to company name in opportunity cards and table
3. **Opportunity Preview** - Next to company name in preview panel
4. **Recruiter Profile Page** (`/recruiter/[id]`) - Next to company name in profile header
5. **Saved Opportunities** - Next to company name in saved opportunities grid

## Action Required

Based on the backend documentation showing that `verificationStatus` **should already be included**, the issue is likely:

### Frontend Investigation Needed:

1. ✅ Check browser Network tab for the raw API response
2. ✅ Verify `verificationStatus` exists in the HTTP response JSON
3. ✅ Check if data transformation is removing the field
4. ✅ Verify TypeScript types include `verificationStatus` (already done)
5. ✅ Clear browser cache and test again

### Backend Verification Needed:

1. ✅ Confirm the test user has `isVerified: true` and `verificationLevel: 'org'` in the database
2. ✅ Verify the backend environment has the latest code deployed
3. ✅ Check backend logs to confirm `verificationStatus` is being calculated
4. ✅ Test the API endpoint directly (Postman/curl) to see the raw response

## Testing

To verify the fix:

1. **Check Database**: Verify test user has:
   - `isVerified: true`
   - `verificationLevel: 'org'` (not 'business')

2. **Check API Response**: Use browser Network tab or Postman to verify the raw JSON includes:

   ```json
   {
     "verificationStatus": "approved"
   }
   ```

3. **Check Frontend**: Once the field is in the API response:
   - Browser console should show `verificationStatus: "approved"` in debug logs
   - Blue checkmark should appear next to company names
   - Badge should display in all locations listed above
