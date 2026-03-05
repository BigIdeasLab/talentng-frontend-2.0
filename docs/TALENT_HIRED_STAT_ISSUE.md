# Talent "Hired" Stat Issue - Investigation Report

## Issue Description

The "Hired" count displayed on the talent profile page is showing incorrect values.

## Root Cause Analysis

### API Endpoint

- **Endpoint**: `GET /api/v1/talent/profile`
- **Function**: `getCurrentProfile()` in `lib/api/talent/index.ts`
- **Response Type**: `TalentProfile`

### Data Flow Problem

1. **Backend Response** (`TalentProfile` type):

   ```typescript
   {
     hiredCount: number;  // Direct field on profile
     stats?: {
       earnings: string;
       hired: number;     // Nested in stats object
       views: number;
       completionPercentage: number;
     };
   }
   ```

2. **Profile Page** (`app/(business)/profile/page.tsx`):

   ```typescript
   // Line 127 - Stats are hardcoded to null!
   initialStats={null}
   ```

3. **TalentProfile Component** (`components/talent/profile/TalentProfile.tsx`):
   ```typescript
   // Line 237 - Tries to read from stats.hired
   hired: stats?.hired ?? 0,
   ```

### The Problem

- The profile page receives the full `TalentProfile` object from the API
- This object contains `hiredCount` and potentially `stats.hired`
- But the page passes `initialStats={null}` to the component
- So the component always shows `0` for hired count

## Solution Options

### Option 1: Use `hiredCount` from Profile (Recommended)

Update `TalentProfile.tsx` to read from `profileData` instead of `stats`:

```typescript
stats={{
  earnings: stats ? `${stats.earnings} Earned` : "—",
  hired: profileData?.hiredCount ?? 0,  // Read from profile directly
  jobType: profileData?.professional?.category || "—",
}}
```

### Option 2: Pass Stats from API Response

Update `app/(business)/profile/page.tsx` to extract and pass stats:

```typescript
const talentData = rawProfile as any;
const talentStats = {
  earnings: talentData.stats?.earnings || talentData.earnings || "0",
  hired: talentData.stats?.hired || talentData.hiredCount || 0,
  views: talentData.stats?.views || talentData.views || 0,
};

return (
  <TalentProfile
    initialStats={talentStats}  // Pass actual stats
    // ... other props
  />
);
```

### Option 3: Use Backend Stats Object

If the backend returns `stats.hired`, use that directly:

```typescript
initialStats={talentData.stats || null}
```

## Recommended Fix

**Option 1** is recommended because:

- It's simpler and more direct
- Doesn't require changes to multiple files
- Uses the primary `hiredCount` field from the profile
- Less prone to null/undefined issues

## Files Involved

- `lib/api/talent/types.ts` - Type definitions
- `lib/api/talent/index.ts` - API call
- `app/(business)/profile/page.tsx` - Profile page (passes null)
- `components/talent/profile/TalentProfile.tsx` - Component (displays stat)
- `components/talent/profile/components/ProfilePanel.tsx` - UI display

## Fix Applied

Updated `app/(business)/profile/page.tsx` to extract and pass stats from the API response:

```typescript
// Extract stats from the API response
const talentStats = {
  earnings: talentData?.stats?.earnings ?? talentData?.earnings ?? "0",
  hired: talentData?.stats?.hired ?? talentData?.hiredCount ?? 0,
  profileViews: talentViews,
  profileCompletion: talentCompleteness,
  applicationsSubmitted: talentData?.stats?.applicationsSubmitted ?? 0,
  interviewsScheduled: talentData?.stats?.interviewsScheduled ?? 0,
};

return (
  <TalentProfile
    initialStats={talentStats}  // Now passing actual stats instead of null
    // ... other props
  />
);
```

This fix:

- Checks both `stats.hired` and `hiredCount` fields from the API response
- Falls back to `0` if neither is available
- Also extracts other stats like earnings, views, applications, and interviews
- Ensures the component receives real data instead of null

## Testing

1. Reload the talent profile page
2. Verify the "Hired" count now shows the correct value from the backend
3. Check that other stats (earnings, views) are also displayed correctly
