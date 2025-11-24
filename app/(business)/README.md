# Business Routes

This folder contains all business-related pages and features for the TalentNG platform.

## Structure

```
(business)/
├── layout.tsx         # Layout wrapper for business routes
├── profile/
│   └── page.tsx       # User profile page
└── README.md          # This file
```

## Components

The business components are located in `components/business/`:

- **ProfileSidebar** - Left navigation sidebar with main menu items
- **ProfileInfo** - Middle panel showing user profile details, skills, stack, and social links
- **ProfileWorks** - Right panel displaying user's portfolio works with tabs

## Profile Page

The profile page (`/profile`) displays a comprehensive user profile with:

- User avatar with completion percentage
- Bio and role information
- Location, hire count, and earnings
- Skills and tech stack
- Social media links
- Portfolio works grid
- Navigation tabs (My Works, Services, Recommendation, Saved Opportunities)

## Types

Business-related TypeScript types are defined in `lib/types/business.ts`:

- `ProfileData` - Main profile structure
- `WorkItem` - Portfolio work item
- `Service` - Service offering
- `Recommendation` - User recommendation/review
- `StackItem` - Technology stack item
- `SocialLink` - Social media link

## Styling

The components use:
- Tailwind CSS for responsive layouts
- Inter Tight font family (matching Figma design)
- Custom color palette from the design system
- Pixel-perfect implementation of the Figma design

## Routes

- `/profile` - User profile page (currently implemented)

Future routes can be added to this folder as the business features expand.
