# Public Detail Pages - Requirements

## Overview

Create detail pages for all public card types (talents, mentors, recruiters, opportunities) to allow unauthenticated visitors to view full profiles and information before signing up.

## User Stories

### US-1: View Talent Detail Page

**As a** visitor  
**I want to** view a talent's full profile from the public talents page  
**So that** I can learn more about their skills, experience, and portfolio before signing up

**Acceptance Criteria:**

- Clicking a talent card navigates to `/talents/[userId]`
- Page displays full talent profile information
- Page includes CTA to sign up/login to hire the talent
- Page is accessible without authentication
- Page has same navbar/footer as other public pages

### US-2: View Mentor Detail Page

**As a** visitor  
**I want to** view a mentor's full profile from the public mentors page  
**So that** I can learn about their expertise, experience, and reviews before signing up

**Acceptance Criteria:**

- Clicking a mentor card navigates to `/mentors/[id]`
- Page displays full mentor profile information
- Page includes CTA to sign up/login to book a session
- Page is accessible without authentication
- Page has same navbar/footer as other public pages

### US-3: View Recruiter Detail Page

**As a** visitor  
**I want to** view a recruiter/company's full profile from the public recruiters page  
**So that** I can learn about the company, their open positions, and hiring needs before signing up

**Acceptance Criteria:**

- Clicking a recruiter card navigates to `/recruiters/[id]`
- Page displays company information, open positions, and hiring details
- Page includes CTA to sign up/login to apply or connect
- Page is accessible without authentication
- Page has same navbar/footer as other public pages

### US-4: View Opportunity Detail Page

**As a** visitor  
**I want to** view an opportunity's full details from the public opportunities page  
**So that** I can understand the job requirements, responsibilities, and compensation before signing up

**Acceptance Criteria:**

- Clicking an opportunity card navigates to `/opportunities-public/[id]`
- Page displays full opportunity details
- Page includes CTA to sign up/login to apply
- Page is accessible without authentication
- Page has same navbar/footer as other public pages

### US-5: Consistent Navigation

**As a** visitor  
**I want to** have consistent navigation across all public detail pages  
**So that** I can easily navigate back to listing pages or other sections

**Acceptance Criteria:**

- All detail pages have the same navbar as listing pages
- Back button/link to return to listing page
- Footer with links to other public pages
- Responsive design for mobile and desktop

### US-6: Sign Up CTAs

**As a** visitor  
**I want to** see clear calls-to-action to sign up  
**So that** I can easily create an account when I'm ready

**Acceptance Criteria:**

- Prominent "Sign Up to [Action]" buttons on each page
- CTAs are contextual (e.g., "Sign Up to Hire", "Sign Up to Book Session", "Sign Up to Apply")
- Clicking CTA redirects to signup page
- Optional: Return URL to come back to detail page after signup

## Content Requirements

### Talent Detail Page Content

- Profile header (avatar, name, headline, location)
- About/bio section
- Skills and stack
- Portfolio/gallery images
- Work history/experience
- Availability status
- Times hired metric
- "Sign Up to Hire" CTA

### Mentor Detail Page Content

- Profile header (image, name, title, company)
- Rating and reviews count
- About/bio section
- Expertise areas
- Experience/background
- Session pricing (if applicable)
- Availability
- Reviews section (if available)
- "Sign Up to Book Session" CTA

### Recruiter Detail Page Content

- Company header (logo, name, industry)
- Company description
- Location and size
- Open positions list
- Hiring for roles
- Company culture/values (if available)
- Contact information
- "Sign Up to Apply" or "Sign Up to Connect" CTA

### Opportunity Detail Page Content

- Opportunity header (company, title, type badge)
- Job description
- Responsibilities
- Requirements/qualifications
- Skills needed
- Compensation/budget
- Location and work arrangement
- Application deadline (if applicable)
- "Sign Up to Apply" CTA

## Technical Requirements

### TR-1: Routing

- Create dynamic routes for each detail page type
- Use Next.js App Router conventions
- Handle 404 for non-existent IDs

### TR-2: Data Fetching

- Use mock/static data initially (matching listing pages)
- Structure data to be easily replaceable with API calls
- Handle loading states

### TR-3: Responsive Design

- Mobile-first approach
- Consistent with existing public pages
- Match business page layouts where applicable

### TR-4: SEO

- Proper meta tags for each page
- Open Graph tags for social sharing
- Descriptive page titles

### TR-5: Performance

- Optimize images
- Lazy load non-critical content
- Fast page load times

## Business Rules

### BR-1: Authentication

- All pages are publicly accessible
- No authentication required to view
- Authentication required for actions (hire, book, apply)

### BR-2: Data Privacy

- Only show publicly available information
- No sensitive contact details
- No private messages or communications

### BR-3: Content Moderation

- Display only approved/verified content
- Hide inappropriate or flagged content

## Non-Functional Requirements

### NFR-1: Accessibility

- WCAG 2.1 AA compliance
- Keyboard navigation support
- Screen reader friendly

### NFR-2: Browser Support

- Modern browsers (Chrome, Firefox, Safari, Edge)
- Mobile browsers (iOS Safari, Chrome Mobile)

### NFR-3: Performance

- Page load time < 3 seconds
- Time to Interactive < 5 seconds

## Out of Scope

- User authentication/login functionality (already exists)
- Payment processing
- Messaging/chat features
- Application submission (requires authentication)
- Profile editing (requires authentication)
- Real-time data updates

## Dependencies

- Existing public listing pages (talents, mentors, recruiters, opportunities)
- Existing business detail pages (for reference)
- Shared components (navbar, footer, cards)
- Mock data structure

## Success Metrics

- Detail pages load successfully for all card types
- CTAs are clearly visible and functional
- Navigation between listing and detail pages works smoothly
- Pages are responsive on all device sizes
- Consistent design with existing public pages
