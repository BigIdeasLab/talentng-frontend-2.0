# Verified Badge Implementation Spec

## Overview

Implementation of verified badge icons across the platform to indicate verified businesses. The badge displays a blue checkmark icon next to company names when their verification status is "approved".

## Context

- Backend includes `verificationStatus` field in API responses with values: "pending" | "approved" | "rejected" | null
- Backend uses `verificationLevel === 'org'` for business verification
- The `/verify.png` image (blue checkmark) is used as the badge icon
- A reusable `VerifiedBadgeIcon` helper component was created for consistency

## Completed Tasks

### 1. ✅ Add verified badge to employer profile panel

- **File**: `components/employer/profile/EmployerProfilePanel.tsx`
- **Implementation**: Added badge next to company name when verification status is 'approved'
- **Uses**: `useVerificationStatus` hook to fetch verification status
- **Badge size**: Medium (w-5 h-5)
- **Status**: Committed

### 2. ✅ Replace full VerifiedBadge with simple verify.png icon

- **Approach**: Use `/verify.png` image instead of full badge component (except WelcomeHeader)
- **Display condition**: `verificationStatus === 'approved'`
- **Locations implemented**:
  1. `components/employer/opportunities/OpportunityCard.tsx` - Next to company name in card header
  2. `components/employer/opportunities/OpportunitiesTable.tsx` - In table column and mobile card renderer
  3. `components/employer/opportunities/OpportunityPreview.tsx` - Next to company name in preview
  4. `components/talent/profile/components/OpportunitiesGrid.tsx` - Next to company name in talent grid
  5. `app/(business)/recruiter/[id]/page.tsx` - Next to company name in recruiter profile (2 locations)
  6. `components/employer/profile/EmployerProfilePanel.tsx` - Uses `/verify.png`
  7. `components/employer/profile/tabs/AboutTab.tsx` - Uses `/verify.png`
  8. `components/employer/dashboard/WelcomeHeader.tsx` - Keeps full VerifiedBadge component
  9. `components/talent/opportunities/opportunity-card.tsx` - Added verified badge next to company name

### 3. ✅ Fix verificationStatus showing as undefined

- **Root cause**: `verificationStatus` field was being dropped during frontend data transformation
- **Fixed in**:
  - `app/(business)/opportunities/server-data.ts` - Added `verificationStatus: opp.verificationStatus` in mapping (line 107)
  - `lib/utils/opportunities.ts` - Added `verificationStatus: opp.verificationStatus` to `transformOpportunityToCard` function (line 86)
- **Backend confirmation**: Field is included in API response per `docs/OPPORTUNITIES_RESPONSE_STRUCTURE.md`

### 4. ✅ Remove debug logs

- **Files cleaned**:
  - `components/employer/opportunities/OpportunityCard.tsx`
  - `components/talent/opportunities/opportunity-card.tsx`
  - `components/employer/opportunities/OpportunityPreview.tsx`
  - `components/talent/profile/components/OpportunitiesGrid.tsx`

### 5. ✅ Add verified badge to talent opportunity details page

- **File**: `components/talent/opportunities/OpportunityDetails.tsx`
- **Created**: `components/verification/VerifiedBadgeIcon.tsx` - Reusable helper component
- **Badge sizes**: `sm` (14px), `md` (16px), `lg` (20px)
- **Locations in OpportunityDetails**:
  1. Header section - Next to company name in top header (size: sm)
  2. Company card section - Next to company name in sidebar company card (size: sm)

### 6. ✅ Reduce verified badge icon size

- **Updated sizes in VerifiedBadgeIcon**:
  - `sm`: 16px → 14px (w-3.5 h-3.5)
  - `md`: 20px → 16px (w-4 h-4)
  - `lg`: 24px → 20px (w-5 h-5)

## In-Progress Tasks

### 7. ✅ Refactor all components to use VerifiedBadgeIcon helper

**Goal**: Replace all inline `<img src="/verify.png" />` tags with the `VerifiedBadgeIcon` helper component

**All Components COMPLETED**:

1. ✅ `components/employer/opportunities/OpportunityCard.tsx` - Replaced inline img with VerifiedBadgeIcon
2. ✅ `components/employer/opportunities/OpportunitiesTable.tsx` - Replaced 2 locations (table + mobile)
3. ✅ `components/employer/opportunities/OpportunityPreview.tsx` - Replaced inline img
4. ✅ `components/talent/profile/components/OpportunitiesGrid.tsx` - Replaced inline img
5. ✅ `components/talent/opportunities/opportunity-card.tsx` - Replaced inline img
6. ✅ `components/talent/opportunities/OpportunityDetails.tsx` - Already using VerifiedBadgeIcon
7. ✅ `components/employer/profile/EmployerProfilePanel.tsx` - Replaced inline img with VerifiedBadgeIcon
8. ✅ `components/employer/profile/tabs/AboutTab.tsx` - Replaced inline img with VerifiedBadgeIcon
9. ✅ `app/(business)/recruiter/[id]/page.tsx` - Replaced inline img with VerifiedBadgeIcon (2 locations)

**Type fix applied**:

- Updated `VerifiedBadgeIcon` component to accept `VerificationStatus` type from `@/lib/api/verification/types`
- This resolves type mismatch between `useVerificationStatus` hook and component props
- All TypeScript diagnostics passing

### 9. ✅ Add verified badge to My Applications page

- **File**: `components/talent/applications/JobApplicationCard.tsx`
- **Implementation**: Added `VerifiedBadgeIcon` next to company name in application cards
- **Badge size**: Small (w-3.5 h-3.5)
- **Type verification**: `Opportunity` type in `lib/api/applications/types.ts` already includes `verificationStatus` field
- **Status**: Completed
- **Note**: Backend needs to include `verificationStatus` in `/talent/applications` API response

### 10. ✅ Add verified badge to Calendar page

- **Files**:
  - `components/talent/applications/TalentInterviewCard.tsx` - Added badge next to company name
  - `app/(business)/calendar/page.tsx` - Added `verificationStatus` to data mapping and passed to component
- **Badge size**: Small (w-3.5 h-3.5)
- **Status**: Completed
- **Note**: Backend needs to include `verificationStatus` in `/talent/upcoming` API response

### 8. ✅ Move verification page content to profile page as new tab

**Goal**: Consolidate verification functionality into the profile page instead of having a separate page

**Implementation**:

- Created `components/employer/profile/tabs/VerificationTab.tsx` - wraps VerificationDashboard component
- Updated `EmployerProfileNav` to include "Verification" tab
- Updated `EmployerProfile` to render verification tab and handle URL query parameter `?tab=verification`
- Updated navigation links in:
  - `components/employer/settings/EmployerSettings.tsx` - changed `/verification` to `/profile?tab=verification`
  - `components/employer/dashboard/QuickActions.tsx` - changed `/verification` to `/profile?tab=verification`
  - `components/employer/dashboard/WelcomeHeader.tsx` - changed `/verification` to `/profile?tab=verification`
- Deleted `app/(business)/verification/page.tsx` (no longer needed)
- All TypeScript diagnostics passing

**Status**: Completed

### 11. ✅ Add verification prompt card to dashboard

**Goal**: Move the verification status banner to the employer dashboard, showing it only when the business is NOT verified

**Implementation**:

- Created `components/employer/dashboard/VerificationPromptCard.tsx` - displays verification prompt card
- Card only shows when `verificationStatus !== "approved"`
- Positioned below WelcomeHeader on the dashboard
- Uses amber/yellow gradient styling to match verification theme
- Links to `/profile?tab=verification` for starting verification
- All TypeScript diagnostics passing

**Status**: Completed

### 12. ✅ Optimize verification form for mobile

**Goal**: Ensure verification form is fully optimized for mobile devices with proper touch targets and responsive layout

**Mobile Optimization Features**:

- **Responsive Form Components**: Uses `ResponsiveFormField` and `ResponsiveFormButtons` for mobile-first design
- **Touch-Friendly Inputs**: All inputs have 44px minimum height for proper touch targets
- **Responsive Padding**: `px-3 md:px-8` on VerificationTab, `p-4 md:p-6` on cards
- **Stacked Layout**: Forms stack vertically on mobile, horizontal on desktop
- **Full-Width Buttons**: Buttons are full-width on mobile, auto-width on desktop
- **Grid Responsiveness**: Uses `grid-cols-1 md:grid-cols-2` for responsive columns
- **Document Uploader**: Responsive padding `p-4 md:p-6`, proper text wrapping with `break-words`
- **Touch-Friendly Remove Buttons**: 44px minimum touch target for document removal buttons
- **Consistent Typography**: All text uses `font-inter-tight` with mobile-appropriate sizes

**Files Updated**:

- `components/verification/DocumentUploader.tsx` - Added responsive padding, consistent fonts, touch-friendly buttons
- `components/verification/ApplicationForm.tsx` - Already using responsive components
- `components/verification/VerificationDashboard.tsx` - Already has responsive grid layout
- `components/employer/profile/tabs/VerificationTab.tsx` - Already has responsive padding

**Status**: Completed

## In-Progress Tasks

### 9. ⏸️ Replace opportunity description with company bio in company card

**Location**: `components/talent/opportunities/OpportunityDetails.tsx` (lines ~927-931)

**Current implementation**:

```tsx
{
  opportunity.description && (
    <p className="font-inter-tight text-[12px] font-normal text-black leading-[160%]">
      {opportunity.description}
    </p>
  );
}
```

**Issue discovered**:

- The API response doesn't include company bio in the `postedBy.recruiterProfile` object
- The `RecruiterProfile` type in `lib/api/recruiter/types.ts` has a `bio` field
- However, the opportunity response only includes a simplified recruiterProfile with: `company`, `profileImageUrl`, `location`
- To get company bio, would need to fetch full recruiter profile using `getRecruiterProfileByUserId(opportunity.postedById)`

**Options**:

1. **Client-side fetch**: Add state for recruiter bio, fetch using `getRecruiterProfileByUserId`, display in company card
2. **Backend update**: Update backend to include bio in opportunity response (preferred)

**Recommendation**: Defer this task until backend can include bio in the opportunity response to avoid additional API calls.

## Component Structure

### VerifiedBadgeIcon Component

**File**: `components/verification/VerifiedBadgeIcon.tsx`

```tsx
import type { VerificationStatus } from "@/lib/api/verification/types";

interface VerifiedBadgeIconProps {
  verificationStatus?:
    | VerificationStatus
    | "pending"
    | "approved"
    | "rejected"
    | null;
  size?: "sm" | "md" | "lg";
  className?: string;
}

const sizeClasses = {
  sm: "w-3.5 h-3.5", // 14px
  md: "w-4 h-4", // 16px
  lg: "w-5 h-5", // 20px
};
```

**Features**:

- Only displays when `verificationStatus === "approved"`
- Configurable sizes: sm, md, lg
- Uses `/verify.png` image
- Includes `flex-shrink-0` to prevent squishing
- Optional className for additional styling

## TypeScript Types

All relevant types include:

```typescript
verificationStatus?: "pending" | "approved" | "rejected" | null
```

**Files with type definitions**:

- `lib/api/opportunities/types.ts`
- `lib/api/recruiter/types.ts`
- `components/talent/opportunities/types.ts`

## Testing Checklist

- [ ] Verify badge appears on all locations when verificationStatus is "approved"
- [ ] Verify badge does NOT appear when verificationStatus is "pending", "rejected", or null
- [ ] Check badge sizing is consistent across all locations
- [ ] Test on mobile and desktop viewports
- [ ] Verify no TypeScript errors after refactoring
- [ ] Check that badge doesn't break layout (flex-shrink-0)
- [ ] Verify tooltip/alt text is accessible

## Files Modified

### Components

- `components/verification/VerifiedBadgeIcon.tsx` (NEW)
- `components/employer/profile/EmployerProfilePanel.tsx`
- `components/employer/profile/tabs/AboutTab.tsx`
- `components/employer/opportunities/OpportunityCard.tsx`
- `components/employer/opportunities/OpportunitiesTable.tsx`
- `components/employer/opportunities/OpportunityPreview.tsx`
- `components/talent/profile/components/OpportunitiesGrid.tsx`
- `components/talent/opportunities/opportunity-card.tsx`
- `components/talent/opportunities/OpportunityDetails.tsx`
- `components/talent/applications/JobApplicationCard.tsx`
- `components/talent/applications/TalentInterviewCard.tsx`
- `app/(business)/recruiter/[id]/page.tsx`
- `app/(business)/calendar/page.tsx`

### Data Transformation

- `app/(business)/opportunities/server-data.ts`
- `lib/utils/opportunities.ts`

### Documentation

- `docs/OPPORTUNITIES_RESPONSE_STRUCTURE.md` (reference)

## Notes

- The `WelcomeHeader` component keeps the full `VerifiedBadge` component (not the simple icon)
- Backend uses `verificationLevel === 'org'` (not `'business'`)
- The `verificationStatus` field is already included in backend API responses
- All changes should be committed together with message: "feat: standardize verified badge implementation"
- Do NOT commit changes until all refactoring is complete

## Future Enhancements

1. Add animation/transition when badge appears
2. Add tooltip with verification details on hover
3. Consider adding verification date to tooltip
4. Implement company bio in opportunity details (requires backend support)
