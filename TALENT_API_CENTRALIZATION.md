# Talent API Centralization

## Overview
All talent API calls are now centralized in a single location for easier maintenance, debugging, and error tracking.

## Architecture

### 1. **Talent API Service** (`lib/api/talent-service.ts`)
- Central export file that re-exports all talent APIs from `lib/api/talent`
- Organizes APIs into logical groups:
  - `talentProfileApi` - Profile CRUD operations
  - `talentDiscoveryApi` - Search and discovery
  - `talentServicesApi` - Service management
  - `talentGalleryApi` - Gallery/portfolio operations
  - `talentRecommendationsApi` - Recommendations

### 2. **Talent API Hook** (`hooks/useTalentApi.ts`)
- React Query hooks wrapping all talent API calls
- Provides consistent loading, error, and data management
- Handles caching and stale time configuration
- Single point for adding logging/monitoring

## Usage

### Option 1: Direct API Calls (Server-side or simple operations)
```typescript
import { talentDiscoveryApi } from "@/lib/api/talent-service";

const profiles = await talentDiscoveryApi.listTalentProfiles(filters);
```

### Option 2: React Hooks (Client-side with caching)
```typescript
import { useMyServices, useCreateService } from "@/hooks/useTalentApi";

function MyComponent() {
  const { data: services } = useMyServices();
  const createService = useCreateService();
  
  return (/* ... */);
}
```

## Benefits

1. **Single Source of Truth** - All talent API calls in one place
2. **Easy Debugging** - Can add logging/monitoring in one file
3. **Consistent Error Handling** - Apply across all APIs
4. **Query Management** - React Query caching configured centrally
5. **Type Safety** - Types exported from single location
6. **Easier Refactoring** - No scattered imports to update

## Migration Guide

### Before (Scattered imports)
```typescript
// In component A
import { getMyServices } from "@/lib/api/talent";
import { createService } from "@/lib/api/talent";

// In component B
import { listTalentProfiles } from "@/lib/api/talent";

// In server file
import { getCurrentProfile } from "@/lib/api/talent";
```

### After (Centralized)
```typescript
// For client components
import { useMyServices, useCreateService } from "@/hooks/useTalentApi";

// For server-side calls
import { talentDiscoveryApi, talentProfileApi } from "@/lib/api/talent-service";
```

## Adding New Talent APIs

1. Add the function to `lib/api/talent/index.ts` (if not already there)
2. Re-export in `lib/api/talent-service.ts` under appropriate group
3. Create a hook in `hooks/useTalentApi.ts` if it's client-side
4. Update this documentation

## Files That Import Talent APIs

### ✅ Migrated to Centralized Service
- `app/(business)/discover-talent/server-data.ts` - Uses `talentDiscoveryApi`
- `hooks/useProfileData.ts` - Uses `talentProfileApi`, `talentRecommendationsApi`, `talentServicesApi`
- `components/talent/profile/components/ServicesGrid.tsx` - Uses `useMyServices` hook
- `components/talent/profile/components/CreateServiceModal.tsx` - Uses `useCreateService` and `useMyServices` hooks

### TODO: Migrate to Centralized Service
- `components/talent/profile/components/RecommendationsGrid.tsx` - Should use `useTalentRecommendations`
- `components/talent/profile/components/UploadWorksModal.tsx` - Should use `useUploadGalleryImages`
- `components/talent/profile/components/WorksGrid.tsx` - Should use `useDeleteGalleryItem`
- `app/(business)/profile/page.tsx` - Should use `useCurrentProfile`

## Error Handling Pattern

For centralized error handling, monitoring, or logging:

```typescript
// lib/api/talent-service.ts
export const talentApi = {
  profile: {
    getCurrentProfile: async () => {
      try {
        return await talentProfileApi.getCurrentProfile();
      } catch (error) {
        // Log, monitor, or transform error here
        throw error;
      }
    }
  }
};
```
