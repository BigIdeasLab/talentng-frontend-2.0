# Profile Provider Implementation

## Overview
A Context Provider that wraps the entire `(business)` layout to provide profile data to all child components. Profile data is fetched on the server at layout level, passed to the provider, and available throughout the business section.

## Architecture

### Files Created/Modified

#### New Files
1. **`hooks/useProfile.ts`** - Hook to access ProfileContext
2. **`app/(business)/layout-data.ts`** - Server-side data fetching function
3. **`app/(business)/profile-provider.tsx`** - Context provider component
4. **`app/(business)/layout-client.tsx`** - Client component for layout (moved from layout.tsx)

#### Modified Files
1. **`app/(business)/layout.tsx`** - Now a Server Component that fetches data and wraps with ProfileProvider
2. **`components/business/Layout/Sidebar.tsx`** - Now uses context for initial data + React Query for live updates

## Data Flow

```
app/(business)/layout.tsx (Server Component)
  ↓ calls
app/(business)/layout-data.ts (Server Function)
  ↓ fetches
lib/api/talent/server.ts (Server API)
  ↓ passes initial data
ProfileProvider (Context)
  ↓ wraps
BusinessLayoutClient (Client Component)
  ├─ Sidebar (useProfile() + useCurrentProfile())
  ├─ MobileSidebar
  └─ children pages
```

## How It Works

### 1. Server-Side Fetching (layout.tsx)
```tsx
// Runs on server
const { profileData, profileRaw, stats, recommendations, error } = 
  await getBusinessLayoutData();
```

### 2. Provider Initialization
```tsx
<ProfileProvider
  initialProfileData={profileData}
  initialProfileRaw={profileRaw}
  userId={userId}
  stats={stats}
  recommendations={recommendations}
  error={error}
>
  <BusinessLayoutClient>{children}</BusinessLayoutClient>
</ProfileProvider>
```

### 3. Components Consume Data
```tsx
// In any component within (business) section
const { initialProfileRaw, stats, recommendations } = useProfile();

// For live updates, also use React Query
const { data: liveProfileData } = useCurrentProfile();
```

### 4. Sidebar Example (uses both)
```tsx
// Get initial data from context (instant on load)
const { initialProfileRaw } = useProfile();

// Get live data from React Query (for updates)
const { data: liveProfileData } = useCurrentProfile();

// Use live if available, else initial
const talentProfile = useMemo(() => {
  if (liveProfileData) return liveProfileData;
  return initialProfileRaw;
}, [liveProfileData, initialProfileRaw]);
```

## Benefits

✅ **No reload flicker** - Profile data available immediately  
✅ **Single server fetch** - Data fetched once at layout level  
✅ **Live updates** - React Query still manages updates/mutations  
✅ **Reusable** - Access from any component in (business) section  
✅ **Type-safe** - Full TypeScript support  
✅ **Follows existing pattern** - Similar to profile page approach  

## Caching Strategy

- **Initial load**: Server-fetched data (instant)
- **Updates**: React Query (5 min stale time, 10 min cache time)
- **Page reload**: Context re-initializes with fresh server data
- **Navigation**: Data persists in context until new layout fetch

## Usage in Other Components

If you need profile data in other components within `(business)`:

```tsx
import { useProfile } from "@/hooks/useProfile";

export function MyComponent() {
  const { initialProfileData, userId, stats } = useProfile();
  
  return (
    <div>
      {initialProfileData?.personal.fullName}
    </div>
  );
}
```

## Future Enhancements

1. Add React Query persistence to avoid redundant refetches
2. Create `useProfileWithLive()` hook for convenience
3. Add error boundary around ProfileProvider
4. Consider combining initial data with React Query cache
