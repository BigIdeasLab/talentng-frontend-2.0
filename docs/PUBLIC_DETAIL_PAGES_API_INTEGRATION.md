# Public Detail Pages API Integration

This document describes the API integration for the public detail pages feature, replacing mock data with real API calls.

## Overview

All public detail pages now fetch data from the backend API endpoints documented in `PUBLIC_DISCOVERY_APIS.md`. The integration follows these principles:

- **No authentication required** for public endpoints (except opportunities which is optional)
- **Server-side rendering** using Next.js App Router
- **Automatic view tracking** via IP-based deduplication
- **Error handling** with graceful fallbacks to 404 pages
- **SEO optimization** with dynamic metadata generation

## API Client Modules

### Location: `lib/api/public/`

All public API client functions are organized by resource type:

#### 1. Talents API (`lib/api/public/talents.ts`)

**Functions:**

- `browseTalents(params?)` - Browse/search public talent profiles
- `getTalentProfile(id)` - Get single talent profile by ID

**Types:**

- `TalentPublicProfile` - Talent profile response structure
- `BrowseTalentsParams` - Query parameters for browsing

**Endpoint:** `GET /api/v1/talents` and `GET /api/v1/talents/:id`

#### 2. Mentors API (`lib/api/public/mentors.ts`)

**Functions:**

- `browseMentors(params?)` - Browse/search public mentor profiles
- `getMentorProfile(id)` - Get single mentor profile by ID
- `getMentorReviews(id, params?)` - Get reviews for a mentor
- `getMentorAvailability(id, params?)` - Get mentor availability slots

**Types:**

- `MentorPublicProfile` - Mentor profile response structure
- `MentorReview` - Review structure
- `MentorAvailability` - Availability slot structure
- `BrowseMentorsParams` - Query parameters for browsing

**Endpoints:**

- `GET /api/v1/mentors`
- `GET /api/v1/mentors/:id`
- `GET /api/v1/mentors/:id/reviews`
- `GET /api/v1/mentors/:id/availability`

#### 3. Recruiters API (`lib/api/public/recruiters.ts`)

**Functions:**

- `browseRecruiters(params?)` - Browse/search public recruiter profiles
- `getRecruiterProfile(id)` - Get single recruiter profile by ID

**Types:**

- `RecruiterPublicProfile` - Recruiter profile response structure
- `BrowseRecruitersParams` - Query parameters for browsing

**Endpoints:**

- `GET /api/v1/recruiters`
- `GET /api/v1/recruiters/:id`

#### 4. Opportunities API (`lib/api/public/opportunities.ts`)

**Functions:**

- `browseOpportunities(params?, accessToken?)` - Browse/search opportunities
- `getOpportunityProfile(id, accessToken?)` - Get single opportunity by ID

**Types:**

- `OpportunityPublicProfile` - Opportunity response structure
- `BrowseOpportunitiesParams` - Query parameters for browsing

**Endpoints:**

- `GET /api/v1/opportunities`
- `GET /api/v1/opportunities/:id`

**Note:** Opportunities API supports optional authentication. When authenticated, includes `hasApplied` and `userApplicationStatus` fields.

## Page Integration

### Talent Detail Page (`app/talents/[userId]/page.tsx`)

**Data Flow:**

1. Fetch talent profile using `getTalentProfile(userId)`
2. Transform API response to match component interface
3. Handle errors with 404 fallback
4. Generate SEO metadata dynamically

**Transformations:**

- `profileImageUrl` → `avatar`
- API response doesn't include `timesHired` or `experience` (set to defaults)
- `coverImageUrl` → `gallery` array

### Mentor Detail Page (`app/mentors/[id]/page.tsx`)

**Data Flow:**

1. Fetch mentor profile using `getMentorProfile(id)`
2. Transform API response to match component interface
3. Handle errors with 404 fallback
4. Generate SEO metadata dynamically

**Transformations:**

- `fullName` → `name`
- `headline` → `title`
- `category` → `company` (fallback)
- `profileImageUrl` → `avatar`
- Reviews fetched separately if needed

### Recruiter Detail Page (`app/recruiters/[id]/page.tsx`)

**Data Flow:**

1. Fetch recruiter profile using `getRecruiterProfile(id)`
2. Fetch opportunities posted by recruiter using `browseOpportunities({ postedById })`
3. Transform responses to match component interface
4. Handle errors with 404 fallback
5. Generate SEO metadata dynamically

**Transformations:**

- `company` → `companyName`
- `bio` → `description`
- Generate `initials` from company name
- Transform opportunities to `openPositions` format

### Opportunity Detail Page (`app/opportunities-public/[id]/page.tsx`)

**Data Flow:**

1. Fetch opportunity using `getOpportunityProfile(id)`
2. Transform API response to match component interface
3. Handle errors with 404 fallback
4. Generate SEO metadata dynamically

**Transformations:**

- `tags` → `skills`
- `employmentType` → `duration`
- Generate `companyInitials` from company name
- `createdAt` → formatted date string

## Error Handling

All pages implement consistent error handling:

```typescript
try {
  const data = await getProfile(id);
  // Render page with data
} catch (error) {
  // Render 404 page with "Back to [Resource]" link
}
```

**Error States:**

- 404: Resource not found or private
- 500: Server error
- Network errors: Connection issues

All errors result in a user-friendly 404 page with navigation back to the listing page.

## Caching Strategy

All API calls use `cache: "no-store"` to ensure:

- Fresh data on every page load
- Accurate view count tracking
- Real-time updates for availability and reviews

**Future Optimization:**
Consider implementing:

- ISR (Incremental Static Regeneration) for stable profiles
- Client-side caching for repeated visits
- Optimistic UI updates

## SEO Implementation

Each page generates dynamic metadata using `generateMetadata()`:

**Included:**

- Page title with profile name and role
- Meta description from bio/description
- Open Graph tags for social sharing
- Twitter Card tags
- Profile images for social previews

**Structured Data:**

- Person schema for talents and mentors
- Organization schema for recruiters
- JobPosting schema for opportunities

## View Tracking

View tracking is handled automatically by the backend API:

- IP-based deduplication prevents duplicate counts
- No client-side tracking required
- Works on every `GET` request to detail endpoints

## Testing

**Manual Testing Checklist:**

- [ ] Talent detail page loads with real data
- [ ] Mentor detail page loads with real data
- [ ] Recruiter detail page loads with real data and opportunities
- [ ] Opportunity detail page loads with real data
- [ ] 404 pages display for invalid IDs
- [ ] SEO metadata appears correctly
- [ ] Images load properly
- [ ] Navigation links work
- [ ] View counts increment (check backend)

**API Testing:**
Use the API contract testing suite in `scripts/api-contract-testing/` to validate:

- Response structure matches TypeScript interfaces
- All required fields are present
- Data types are correct
- Error responses are handled

## Migration from Mock Data

The following mock data files are now deprecated but kept for reference:

- `lib/mock-data/talents-detail.ts`
- `lib/mock-data/mentors-detail.ts`
- `lib/mock-data/recruiters-detail.ts`
- `lib/mock-data/opportunities-detail.ts`

**To remove mock data:**

1. Verify all pages work with real API
2. Delete mock data files
3. Remove imports from any remaining files

## Environment Configuration

Ensure the following environment variable is set:

```bash
NEXT_PUBLIC_TALENTNG_API_URL=http://localhost:3001/api/v1  # Development
NEXT_PUBLIC_TALENTNG_API_URL=https://api.talentng.com/api/v1  # Production
```

## Future Enhancements

1. **Pagination Support**
   - Add pagination for recruiter opportunities
   - Add pagination for mentor reviews

2. **Real-time Updates**
   - WebSocket integration for live availability
   - Real-time application status updates

3. **Enhanced Error Messages**
   - Specific error messages for different failure types
   - Retry mechanisms for transient failures

4. **Performance Optimization**
   - Implement ISR for stable profiles
   - Add client-side caching layer
   - Optimize image loading with blur placeholders

5. **Analytics Integration**
   - Track page views and user interactions
   - Monitor API performance and errors
   - A/B testing for CTA effectiveness

## Related Documentation

- [PUBLIC_DISCOVERY_APIS.md](./PUBLIC_DISCOVERY_APIS.md) - Complete API documentation
- [Public Detail Pages Spec](./.kiro/specs/public-detail-pages/) - Feature requirements and design
- [API Contract Testing](../scripts/api-contract-testing/README.md) - Testing suite

## Support

For issues or questions:

1. Check API documentation in `PUBLIC_DISCOVERY_APIS.md`
2. Review error logs in browser console
3. Test API endpoints directly using curl or Postman
4. Contact backend team for API-related issues

**Last Updated:** April 6, 2026
