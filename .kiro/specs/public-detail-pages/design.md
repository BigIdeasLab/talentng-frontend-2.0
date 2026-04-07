# Public Detail Pages - Design Document

## Overview

This feature creates publicly accessible detail pages for talents, mentors, recruiters, and opportunities. These pages allow unauthenticated visitors to view comprehensive information before signing up, with prominent CTAs to encourage account creation.

The design follows the existing public page patterns (navbar, footer, styling) while adapting content from business detail pages for public consumption. Each page type has a unique layout optimized for its content while maintaining consistency across the platform.

## Architecture

### Page Structure

All public detail pages follow this high-level structure:

```
┌─────────────────────────────────────┐
│         Public Navbar               │ (Sticky)
├─────────────────────────────────────┤
│                                     │
│         Page Content                │ (Scrollable)
│         (Varies by type)            │
│                                     │
├─────────────────────────────────────┤
│         CTA Section                 │
├─────────────────────────────────────┤
│         Public Footer               │
└─────────────────────────────────────┘
```

### Route Structure

```
app/
├── talents/
│   ├── page.tsx                    (existing listing)
│   └── [userId]/
│       └── page.tsx                (NEW - detail page)
├── mentors/
│   ├── page.tsx                    (existing listing)
│   └── [id]/
│       └── page.tsx                (NEW - detail page)
├── recruiters/
│   ├── page.tsx                    (existing listing)
│   └── [id]/
│       └── page.tsx                (NEW - detail page)
└── opportunities-public/
    ├── page.tsx                    (existing listing)
    └── [id]/
        └── page.tsx                (NEW - detail page)
```

### Component Architecture

```
components/
├── public/
│   ├── PublicNavbar.tsx           (Shared navbar - extract from existing)
│   ├── PublicFooter.tsx           (Shared footer - extract from existing)
│   ├── PublicCTA.tsx              (Shared CTA section)
│   ├── talent/
│   │   └── TalentDetailPublic.tsx
│   ├── mentor/
│   │   └── MentorDetailPublic.tsx
│   ├── recruiter/
│   │   └── RecruiterDetailPublic.tsx
│   └── opportunity/
│       └── OpportunityDetailPublic.tsx
```

## Components and Interfaces

### 1. Shared Components

#### PublicNavbar Component

Extracted from existing public pages, provides consistent navigation.

```typescript
interface PublicNavbarProps {
  activeLink?: "Talents" | "Recruiters" | "Mentors" | "Opportunities";
}

// Features:
// - Logo linking to home
// - Navigation links (Talents, Recruiters, Mentors, Opportunities, FAQ)
// - Login button
// - "Create Free Account" CTA button
// - Mobile hamburger menu
// - Sticky positioning
```

#### PublicFooter Component

Extracted from existing public pages, provides consistent footer.

```typescript
interface PublicFooterProps {
  // No props needed - static content
}

// Features:
// - Platform links (Opportunities, Discover Talent, Mentorship, Learning Hub)
// - Company links (About, Contact, FAQ)
// - Legal links (Privacy Policy, Terms of Service)
// - Copyright notice
```

#### PublicCTA Component

Reusable CTA section for encouraging signups.

```typescript
interface PublicCTAProps {
  title: string;
  subtitle: string;
  ctaText: string;
  ctaHref: string;
}

// Example usage:
// <PublicCTA
//   title="Ready to hire top talent?"
//   subtitle="Join Talents.ng to connect with skilled professionals"
//   ctaText="Sign Up to Hire"
//   ctaHref="/signup"
// />
```

### 2. Talent Detail Page (`/talents/[userId]`)

#### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Public Navbar                                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │  Profile Header                                  │   │
│  │  - Avatar, Name, Headline                       │   │
│  │  - Location, Times Hired, Availability          │   │
│  │  - "Sign Up to Hire" CTA Button                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Portfolio Gallery (4-6 images)                 │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  About Section                                   │   │
│  │  - Bio/Description                              │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Skills & Stack                                  │   │
│  │  - Skills tags                                   │   │
│  │  - Stack/Tools tags                             │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Experience (if available)                       │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CTA: "Sign Up to Hire [Name]"                  │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  Public Footer                                          │
└─────────────────────────────────────────────────────────┘
```

#### Component Interface

```typescript
interface TalentDetailPublicProps {
  userId: string;
}

interface TalentPublicData {
  userId: string;
  fullName: string;
  headline: string;
  avatar: string;
  location: string;
  timesHired: number;
  availability: string[];
  category: string;
  bio?: string;
  skills: string[];
  stack: string[];
  gallery: string[];
  experience?: {
    title: string;
    company: string;
    duration: string;
  }[];
}
```

#### Data Fetching Strategy

```typescript
// Mock data structure (initial implementation)
const MOCK_TALENT_DETAILS: Record<string, TalentPublicData> = {
  "talent-1": {
    userId: "talent-1",
    fullName: "Ifeoma Chijioke",
    headline: "UX/UI Designer",
    // ... rest of data
  },
  // ... more mock data
};

// Future API integration point
async function getTalentPublicProfile(
  userId: string,
): Promise<TalentPublicData> {
  // TODO: Replace with actual API call
  // const response = await fetch(`/api/public/talents/${userId}`);
  // return response.json();

  return MOCK_TALENT_DETAILS[userId] || null;
}
```

### 3. Mentor Detail Page (`/mentors/[id]`)

#### Layout Structure

Based on business mentor detail page (`app/(business)/mentorship/[id]/page.tsx`) but adapted for public viewing:

```
┌─────────────────────────────────────────────────────────┐
│  Public Navbar                                          │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────┬──────────────────────────────────┐   │
│  │  Left Panel  │  Right Content Area              │   │
│  │              │                                   │   │
│  │  - Avatar    │  Tabs: Overview | Reviews        │   │
│  │  - Name      │                                   │   │
│  │  - Title     │  Overview Tab:                    │   │
│  │  - Company   │  - About/Bio                      │   │
│  │  - Rating    │  - Expertise areas                │   │
│  │  - Sessions  │  - Industries                     │   │
│  │  - Duration  │  - Experience                     │   │
│  │              │                                   │   │
│  │  Stack       │  Reviews Tab:                     │   │
│  │  - Tools     │  - Review cards                   │   │
│  │              │  - Ratings                        │   │
│  │  "Sign Up   │                                   │   │
│  │  to Book"    │                                   │   │
│  │  CTA Button  │                                   │   │
│  └──────────────┴──────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CTA: "Sign Up to Book a Session"               │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  Public Footer                                          │
└─────────────────────────────────────────────────────────┘
```

#### Component Interface

```typescript
interface MentorDetailPublicProps {
  id: string;
}

interface MentorPublicData {
  id: string;
  name: string;
  title: string;
  company?: string;
  avatar: string;
  location?: string;
  rating: number;
  totalReviews: number;
  totalSessions: number;
  sessionDuration: number;
  bio?: string;
  expertise: string[];
  industries: string[];
  stack: string[];
  reviews?: {
    id: string;
    rating: number;
    comment: string;
    author: string;
    date: string;
  }[];
}
```

### 4. Recruiter Detail Page (`/recruiters/[id]`)

#### Layout Structure

```
┌─────────────────────────────────────────────────────────┐
│  Public Navbar                                          │
├─────────────────────────────────────────────────────────┤
│  ┌─────────────────────────────────────────────────┐   │
│  │  Company Header                                  │   │
│  │  - Logo, Name, Industry                         │   │
│  │  - Location, Jobs Posted, Talents Hired         │   │
│  │  - "Sign Up to Apply" CTA Button                │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  About Company                                   │   │
│  │  - Description                                   │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Hiring For                                      │   │
│  │  - Role tags                                     │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  Open Positions                                  │   │
│  │  - List of opportunity cards                    │   │
│  │  - Each links to opportunity detail page        │   │
│  └─────────────────────────────────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CTA: "Sign Up to Connect"                      │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  Public Footer                                          │
└─────────────────────────────────────────────────────────┘
```

#### Component Interface

```typescript
interface RecruiterDetailPublicProps {
  id: string;
}

interface RecruiterPublicData {
  id: string;
  companyName: string;
  industry: string;
  location: string;
  jobsPosted: number;
  talentsHired: number;
  description: string;
  hiringFor: string[];
  logoBg: string;
  initials: string;
  companyLogo?: string;
  openPositions: {
    id: string;
    title: string;
    type: string;
    location: string;
    postedDate: string;
  }[];
}
```

### 5. Opportunity Detail Page (`/opportunities-public/[id]`)

#### Layout Structure

Based on business opportunity detail page (`components/employer/opportunities/OpportunityDetails.tsx`):

```
┌─────────────────────────────────────────────────────────┐
│  Public Navbar                                          │
├─────────────────────────────────────────────────────────┤
│  ┌──────────────────────────┬──────────────────────┐   │
│  │  Left Content            │  Right Summary Card  │   │
│  │                          │                      │   │
│  │  - Company Logo          │  - Budget/Rate       │   │
│  │  - Job Title             │  - Type              │   │
│  │  - Company Name          │  - Start Date        │   │
│  │  - Posted Date           │  - Location          │   │
│  │  - Type Badge            │  - Experience Level  │   │
│  │  - Skills Tags           │                      │   │
│  │                          │  "Sign Up to Apply"  │   │
│  │  About the Role          │  CTA Button          │   │
│  │  - Description           │                      │   │
│  │                          │  Company Card        │   │
│  │  Key Responsibilities    │  - Logo              │   │
│  │  - Bullet list           │  - Name              │   │
│  │                          │  - Category          │   │
│  │  Requirements            │  - Description       │   │
│  │  - Bullet list           │                      │   │
│  │                          │                      │   │
│  │  Tools Needed            │                      │   │
│  │  - Tool tags with icons  │                      │   │
│  └──────────────────────────┴──────────────────────┘   │
│                                                          │
│  ┌─────────────────────────────────────────────────┐   │
│  │  CTA: "Sign Up to Apply"                        │   │
│  └─────────────────────────────────────────────────┘   │
├─────────────────────────────────────────────────────────┤
│  Public Footer                                          │
└─────────────────────────────────────────────────────────┘
```

#### Component Interface

```typescript
interface OpportunityDetailPublicProps {
  id: string;
}

interface OpportunityPublicData {
  id: string;
  title: string;
  company: string;
  companyLogo: string;
  companyLogoBg: string;
  companyInitials: string;
  category: string;
  type: string;
  location: string;
  experienceLevel: string;
  description: string;
  keyResponsibilities: string[];
  requirements: string[];
  skills: string[];
  tools: string[];
  priceMode: "range" | "fixed";
  minBudget?: number;
  maxBudget?: number;
  price?: number;
  paymentType?: "hourly" | "weekly" | "monthly";
  startDate?: string;
  duration?: string;
  createdAt: string;
}
```

## Data Models

### Mock Data Structure

All mock data will follow the same structure as the listing pages for consistency:

```typescript
// Mock data files (to be created)
const MOCK_TALENTS: Record<string, TalentPublicData> = {
  /* ... */
};
const MOCK_MENTORS: Record<string, MentorPublicData> = {
  /* ... */
};
const MOCK_RECRUITERS: Record<string, RecruiterPublicData> = {
  /* ... */
};
const MOCK_OPPORTUNITIES: Record<string, OpportunityPublicData> = {
  /* ... */
};
```

### Data Fetching Pattern

```typescript
// Pattern for all detail pages
async function getPublicData<T>(
  type: "talent" | "mentor" | "recruiter" | "opportunity",
  id: string,
): Promise<T | null> {
  // Mock implementation
  const mockData = getMockData(type);
  return mockData[id] || null;

  // Future API implementation
  // const response = await fetch(`/api/public/${type}/${id}`);
  // if (!response.ok) return null;
  // return response.json();
}
```

## Correctness Properties

_A property is a characteristic or behavior that should hold true across all valid executions of a system-essentially, a formal statement about what the system should do. Properties serve as the bridge between human-readable specifications and machine-verifiable correctness guarantees._

### Property Reflection

After analyzing the acceptance criteria, I've identified the following patterns:

**Redundancies to eliminate:**

1. US-1.4, US-2.4, US-3.4, US-4.4 all test "Page is accessible without authentication" - these can be combined into a single property that applies to all public detail pages
2. US-1.5, US-2.5, US-3.5, US-4.5 all test "Page has same navbar/footer" - these can be combined into a single property
3. US-1.2, US-2.2, US-3.2, US-4.2 all test "Page displays full profile information" - while these are similar, they test different data structures, so they should remain separate properties
4. US-6.1 and US-6.2 both test CTA button properties - US-6.2 is more specific and subsumes US-6.1, so we only need US-6.2

**Properties to keep:**

- Profile information display properties (one per page type, as they validate different data structures)
- Navigation consistency property (combined from multiple criteria)
- Authentication accessibility property (combined from multiple criteria)
- CTA contextual text property (combined from US-6.1 and US-6.2)

**Examples to keep:**

- Navigation examples (one per page type, as they test specific routes)
- CTA button existence examples (one per page type, as they test specific button text)
- Back button example
- Footer links example
- CTA redirect example

### Property 1: Profile Information Completeness - Talent

_For any_ talent profile data with required fields (userId, fullName, headline, avatar, location, skills, stack, gallery), when rendered on the talent detail page, the page content should contain all of these fields.

**Validates: Requirements US-1.2**

### Property 2: Profile Information Completeness - Mentor

_For any_ mentor profile data with required fields (id, name, title, avatar, rating, totalSessions, sessionDuration, expertise, stack), when rendered on the mentor detail page, the page content should contain all of these fields.

**Validates: Requirements US-2.2**

### Property 3: Profile Information Completeness - Recruiter

_For any_ recruiter profile data with required fields (id, companyName, industry, location, description, hiringFor), when rendered on the recruiter detail page, the page content should contain all of these fields.

**Validates: Requirements US-3.2**

### Property 4: Profile Information Completeness - Opportunity

_For any_ opportunity data with required fields (id, title, company, type, location, description, skills, requirements), when rendered on the opportunity detail page, the page content should contain all of these fields.

**Validates: Requirements US-4.2**

### Property 5: Unauthenticated Access

_For any_ public detail page (talent, mentor, recruiter, or opportunity), the page should render successfully when accessed without authentication credentials.

**Validates: Requirements US-1.4, US-2.4, US-3.4, US-4.4**

### Property 6: Navigation Consistency

_For any_ public detail page, the rendered page should include both the public navbar component and the public footer component with the same structure as the listing pages.

**Validates: Requirements US-1.5, US-2.5, US-3.5, US-4.5, US-5.1**

### Property 7: CTA Contextual Text

_For any_ page type (talent, mentor, recruiter, opportunity), the primary CTA button text should match the expected action for that page type: "Sign Up to Hire" for talents, "Sign Up to Book Session" for mentors, "Sign Up to Apply" or "Sign Up to Connect" for recruiters, and "Sign Up to Apply" for opportunities.

**Validates: Requirements US-6.1, US-6.2**

## Error Handling

### 404 - Not Found

When a detail page is accessed with an invalid ID:

```typescript
// Pattern for all detail pages
if (!data) {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-500 mb-4">[Type] not found</p>
        <Link
          href="/[listing-page]"
          className="px-4 py-2 bg-[#5C30FF] text-white rounded-full hover:bg-[#4a26d4]"
        >
          Back to [Listing Page]
        </Link>
      </div>
    </div>
  );
}
```

### Loading States

All pages should show a loading skeleton while fetching data:

```typescript
if (isLoading) {
  return <DetailPageSkeleton type="talent|mentor|recruiter|opportunity" />;
}
```

### Error States

If data fetching fails:

```typescript
if (error) {
  return (
    <div className="h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <p className="text-gray-500 mb-4">Failed to load [type] details</p>
        <button
          onClick={() => retry()}
          className="px-4 py-2 bg-[#5C30FF] text-white rounded-full hover:bg-[#4a26d4]"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
```

## Testing Strategy

### Dual Testing Approach

This feature requires both unit tests and property-based tests to ensure comprehensive coverage:

**Unit Tests** will verify:

- Specific navigation examples (clicking cards navigates to correct URLs)
- CTA button existence and text for each page type
- Back button functionality
- Footer links presence
- 404 error handling
- Loading state rendering
- Unauthenticated access for specific pages

**Property-Based Tests** will verify:

- Profile information completeness across all valid data inputs
- Navigation consistency across all page types
- CTA contextual text correctness for all page types
- Unauthenticated access for all page types

### Property-Based Testing Configuration

**Library**: fast-check (for TypeScript/React)

**Configuration**:

- Minimum 100 iterations per property test
- Each test must reference its design document property
- Tag format: `Feature: public-detail-pages, Property {number}: {property_text}`

**Example Property Test Structure**:

```typescript
import fc from 'fast-check';
import { render } from '@testing-library/react';
import { TalentDetailPublic } from '@/components/public/talent/TalentDetailPublic';

describe('Feature: public-detail-pages, Property 1: Profile Information Completeness - Talent', () => {
  it('should display all required talent fields for any valid talent data', () => {
    fc.assert(
      fc.property(
        fc.record({
          userId: fc.string(),
          fullName: fc.string(),
          headline: fc.string(),
          avatar: fc.webUrl(),
          location: fc.string(),
          skills: fc.array(fc.string(), { minLength: 1 }),
          stack: fc.array(fc.string(), { minLength: 1 }),
          gallery: fc.array(fc.webUrl(), { minLength: 1 }),
          // ... other fields
        }),
        (talentData) => {
          const { container } = render(<TalentDetailPublic data={talentData} />);
          const content = container.textContent || '';

          // Verify all required fields are present in rendered content
          expect(content).toContain(talentData.fullName);
          expect(content).toContain(talentData.headline);
          expect(content).toContain(talentData.location);
          // ... verify other fields
        }
      ),
      { numRuns: 100 }
    );
  });
});
```

### Unit Test Examples

```typescript
describe("Talent Detail Page Navigation", () => {
  it("should navigate to /talents/[userId] when talent card is clicked", () => {
    // Test specific navigation behavior
  });

  it('should display "Sign Up to Hire" CTA button', () => {
    // Test specific CTA text
  });

  it("should redirect to /signup when CTA is clicked", () => {
    // Test CTA click behavior
  });
});

describe("Mentor Detail Page Navigation", () => {
  it("should navigate to /mentors/[id] when mentor card is clicked", () => {
    // Test specific navigation behavior
  });

  it('should display "Sign Up to Book Session" CTA button', () => {
    // Test specific CTA text
  });
});

// Similar tests for Recruiter and Opportunity pages
```

### Test Coverage Goals

- Unit tests: 80%+ coverage of component logic
- Property tests: 100% coverage of correctness properties
- Integration tests: Navigation flows between listing and detail pages
- Accessibility tests: WCAG 2.1 AA compliance

## Implementation Notes

### Phase 1: Shared Components

1. Extract PublicNavbar from existing public pages
2. Extract PublicFooter from existing public pages
3. Create PublicCTA component
4. Create loading skeleton components

### Phase 2: Detail Pages

1. Implement Talent detail page with mock data
2. Implement Mentor detail page with mock data
3. Implement Recruiter detail page with mock data
4. Implement Opportunity detail page with mock data

### Phase 3: Navigation Integration

1. Update TalentCard to link to detail page
2. Update MentorCard to link to detail page
3. Update RecruiterCard to link to detail page
4. Update OpportunityCard to link to detail page

### Phase 4: Testing

1. Write unit tests for each page type
2. Write property-based tests for correctness properties
3. Test navigation flows
4. Test error states and loading states

### Phase 5: Polish

1. Optimize images and performance
2. Add SEO meta tags
3. Test responsive design
4. Accessibility audit

## Design Decisions and Rationales

### Decision 1: Separate Routes vs Query Parameters

**Decision**: Use separate dynamic routes (`/talents/[userId]`) instead of query parameters (`/talents?id=userId`)

**Rationale**:

- Better SEO (clean URLs)
- Easier to share and bookmark
- Follows Next.js conventions
- Consistent with business page patterns

### Decision 2: Mock Data Initially

**Decision**: Use mock/static data initially, structured for easy API replacement

**Rationale**:

- Allows frontend development to proceed independently
- Mock data structure matches listing pages for consistency
- Easy to replace with API calls later
- Reduces initial complexity

### Decision 3: Reuse Business Page Layouts

**Decision**: Adapt layouts from business detail pages rather than creating entirely new designs

**Rationale**:

- Maintains consistency between public and authenticated experiences
- Reduces design and development time
- Users see familiar layouts after signing up
- Proven layouts that work well

### Decision 4: Prominent CTAs

**Decision**: Include multiple CTA buttons (header, footer, sticky) on each page

**Rationale**:

- Maximizes conversion opportunities
- Users can take action at any scroll position
- Clear value proposition at multiple touchpoints
- Industry best practice for landing pages

### Decision 5: No Authentication Required

**Decision**: All detail pages are publicly accessible without authentication

**Rationale**:

- Allows visitors to explore before committing
- Reduces friction in user journey
- Increases SEO visibility
- Aligns with requirements (BR-1)

## Responsive Design Considerations

### Mobile Layout Adjustments

**Talent Detail Page**:

- Stack profile header vertically
- Gallery scrolls horizontally
- Full-width CTA buttons
- Collapsible sections for long content

**Mentor Detail Page**:

- Left panel moves above content on mobile
- Tabs become full-width
- Availability calendar adapts to smaller screen
- Reviews stack vertically

**Recruiter Detail Page**:

- Company header stacks vertically
- Open positions become full-width cards
- Hiring tags wrap appropriately

**Opportunity Detail Page**:

- Two-column layout becomes single column
- Summary card moves below main content
- Sticky CTA button at bottom of screen

### Breakpoints

```css
/* Mobile: < 768px */
/* Tablet: 768px - 1024px */
/* Desktop: > 1024px */
```

## Accessibility Requirements

### Keyboard Navigation

- All interactive elements must be keyboard accessible
- Logical tab order
- Visible focus indicators

### Screen Readers

- Semantic HTML elements
- ARIA labels where needed
- Alt text for all images
- Descriptive link text

### Color Contrast

- WCAG AA compliance (4.5:1 for normal text)
- Don't rely solely on color to convey information

### Responsive Text

- Minimum 16px font size for body text
- Scalable text (no fixed pixel sizes)
- Readable line heights (1.5+)

## Performance Optimization

### Image Optimization

- Use Next.js Image component
- Lazy load below-the-fold images
- Appropriate image sizes for different viewports
- WebP format with fallbacks

### Code Splitting

- Dynamic imports for heavy components
- Route-based code splitting (automatic with Next.js)
- Lazy load non-critical components

### Caching Strategy

- Static generation for mock data pages
- Cache public data with appropriate TTL
- CDN caching for static assets

## SEO Optimization

### Meta Tags

```typescript
// Example for Talent Detail Page
export const metadata = {
  title: `${talentName} - ${talentHeadline} | Talents.ng`,
  description: `View ${talentName}'s profile, portfolio, and skills. ${talentBio}`,
  openGraph: {
    title: `${talentName} - ${talentHeadline}`,
    description: talentBio,
    images: [talentAvatar],
    type: "profile",
  },
  twitter: {
    card: "summary_large_image",
    title: `${talentName} - ${talentHeadline}`,
    description: talentBio,
    images: [talentAvatar],
  },
};
```

### Structured Data

```json
{
  "@context": "https://schema.org",
  "@type": "Person",
  "name": "Talent Name",
  "jobTitle": "Talent Headline",
  "image": "avatar_url",
  "description": "bio",
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "location"
  }
}
```

## Future Enhancements

### Phase 2 Features (Out of Current Scope)

- Real-time availability updates
- Direct messaging (requires authentication)
- Booking/hiring flows
- Reviews and ratings display
- Social sharing buttons
- Related profiles/opportunities
- Search within detail pages
- Filtering open positions on recruiter pages

### API Integration Points

- `GET /api/public/talents/:userId`
- `GET /api/public/mentors/:id`
- `GET /api/public/recruiters/:id`
- `GET /api/public/opportunities/:id`

## Dependencies

### External Libraries

- Next.js 14+ (App Router)
- React 18+
- TypeScript
- Tailwind CSS
- Lucide React (icons)
- fast-check (property-based testing)
- @testing-library/react (unit testing)

### Internal Dependencies

- Existing public page components (navbar, footer)
- Existing card components (TalentCard, MentorCard, etc.)
- Mock data from listing pages
- Shared UI components (Button, etc.)

## Success Criteria

### Functional Requirements

- ✅ All 4 detail page types are implemented
- ✅ Navigation from listing to detail pages works
- ✅ All pages are publicly accessible
- ✅ CTAs are prominent and functional
- ✅ Error states are handled gracefully

### Non-Functional Requirements

- ✅ Page load time < 3 seconds
- ✅ WCAG 2.1 AA compliance
- ✅ Responsive on all device sizes
- ✅ 80%+ test coverage
- ✅ All correctness properties pass

### User Experience

- ✅ Consistent design across all page types
- ✅ Clear navigation back to listing pages
- ✅ Smooth transitions and interactions
- ✅ Informative error messages
- ✅ Fast, responsive interface
