# Public API Client

This module provides client functions for accessing public discovery endpoints without authentication.

## Quick Start

```typescript
import {
  getTalentProfile,
  getMentorProfile,
  getRecruiterProfile,
  getOpportunityProfile,
} from "@/lib/api/public";

// Fetch a talent profile
const talent = await getTalentProfile("talent-id");

// Fetch a mentor profile
const mentor = await getMentorProfile("mentor-id");

// Fetch a recruiter profile
const recruiter = await getRecruiterProfile("recruiter-id");

// Fetch an opportunity
const opportunity = await getOpportunityProfile("opportunity-id");
```

## Modules

### Talents (`talents.ts`)

```typescript
import { browseTalents, getTalentProfile } from "@/lib/api/public/talents";

// Browse talents with filters
const talents = await browseTalents({
  category: "Designer",
  skills: "Figma,Sketch",
  location: "Lagos",
  limit: 20,
});

// Get single talent
const talent = await getTalentProfile("talent-id");
```

### Mentors (`mentors.ts`)

```typescript
import {
  browseMentors,
  getMentorProfile,
  getMentorReviews,
  getMentorAvailability,
} from "@/lib/api/public/mentors";

// Browse mentors with filters
const mentors = await browseMentors({
  expertise: "Product Management",
  industries: "Tech,Fintech",
  sortBy: "avgRating",
  sortOrder: "desc",
});

// Get single mentor
const mentor = await getMentorProfile("mentor-id");

// Get mentor reviews
const reviews = await getMentorReviews("mentor-id", { limit: 10 });

// Get mentor availability
const availability = await getMentorAvailability("mentor-id", {
  startDate: "2026-04-01",
  endDate: "2026-04-30",
});
```

### Recruiters (`recruiters.ts`)

```typescript
import {
  browseRecruiters,
  getRecruiterProfile,
} from "@/lib/api/public/recruiters";

// Browse recruiters with filters
const recruiters = await browseRecruiters({
  industry: "Technology",
  location: "Lagos",
  sort: "views",
});

// Get single recruiter
const recruiter = await getRecruiterProfile("recruiter-id");
```

### Opportunities (`opportunities.ts`)

```typescript
import {
  browseOpportunities,
  getOpportunityProfile,
} from "@/lib/api/public/opportunities";

// Browse opportunities (unauthenticated)
const opportunities = await browseOpportunities({
  type: "job",
  category: "Software Development",
  location: "Remote",
});

// Browse opportunities (authenticated - includes application status)
const opportunitiesAuth = await browseOpportunities(
  {
    type: "job",
    category: "Software Development",
  },
  accessToken,
);

// Get single opportunity
const opportunity = await getOpportunityProfile("opportunity-id");

// Get single opportunity (authenticated)
const opportunityAuth = await getOpportunityProfile(
  "opportunity-id",
  accessToken,
);
```

## Error Handling

All functions throw errors that can be caught and handled:

```typescript
try {
  const talent = await getTalentProfile("invalid-id");
} catch (error) {
  console.error("Error fetching talent:", error.message);
  // error.status contains HTTP status code
  // error.data contains error response data
}
```

## Response Types

All functions return fully typed responses. Import types as needed:

```typescript
import type {
  TalentPublicProfile,
  MentorPublicProfile,
  RecruiterPublicProfile,
  OpportunityPublicProfile,
} from "@/lib/api/public";
```

## Configuration

The base URL is configured via environment variable:

```bash
NEXT_PUBLIC_TALENTNG_API_URL=http://localhost:3001/api/v1
```

## Caching

All requests use `cache: "no-store"` to ensure fresh data and accurate view tracking. For production optimization, consider implementing:

- ISR (Incremental Static Regeneration)
- Client-side caching
- SWR or React Query

## Related Documentation

- [PUBLIC_DISCOVERY_APIS.md](../../../docs/PUBLIC_DISCOVERY_APIS.md) - Complete API documentation
- [PUBLIC_DETAIL_PAGES_API_INTEGRATION.md](../../../docs/PUBLIC_DETAIL_PAGES_API_INTEGRATION.md) - Integration guide

## Support

For issues or questions, refer to the main API documentation or contact the backend team.
