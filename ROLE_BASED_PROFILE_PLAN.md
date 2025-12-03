# Role-Based Profile Management Plan

## Problem
Currently, the profile system only fetches talent profile data. Users can have multiple roles (talent, employer/recruiter, mentor) and should see the correct profile data based on their active role. When switching roles, the UI should load the appropriate profile.

## Architecture

### 1. Enhanced Profile Context Structure

```typescript
interface ProfileContextType {
  userId: string | null;
  userRoles: string[];
  activeRole: string; // Currently selected role
  
  // Profiles indexed by role
  profiles: {
    talent?: TalentProfile;
    recruiter?: RecruiterProfile;
    mentor?: MentorProfile; // when available
  };
  
  // Mapped UI data indexed by role
  profilesUI: {
    talent?: UIProfileData;
    recruiter?: UIProfileData;
    mentor?: UIProfileData;
  };
  
  // Stats indexed by role
  stats: {
    talent?: DashboardStats;
    recruiter?: RecruiterDashboardStats; // when available
    mentor?: MentorDashboardStats;
  };
  
  // Helpers for current role
  currentProfile: TalentProfile | RecruiterProfile | null;
  currentProfileUI: UIProfileData | null;
  currentStats: DashboardStats | any | null;
  
  // Role switching
  setActiveRole: (role: string) => void;
  
  // Error state
  error: string | null;
}
```

### 2. Data Fetching Strategy

#### Server-side (layout-data.ts)
```
1. Fetch current user + roles
2. For each role user has:
   - Fetch role-specific profile
   - Fetch role-specific stats
   - Map to UI format
3. Pass all data to context
4. Default activeRole to first role in userRoles
```

#### Client-side (layout-client.tsx)
```
- Listen to activeRole changes
- Re-render sidebar based on activeRole
- Pass correct profile to child components
```

### 3. Implementation Steps

#### Step 1: Create Server-side Functions
Location: `lib/api/recruiter/server.ts`
```
- getServerCurrentRecruiterProfile()
- getServerRecruiterDashboardStats() [if endpoint exists]
```

#### Step 2: Update ProfileProvider
File: `app/(business)/profile-provider.tsx`
- Add `profiles` object (indexed by role)
- Add `profilesUI` object
- Add `stats` object
- Add `activeRole` state
- Add `setActiveRole` function
- Add computed `currentProfile`, `currentProfileUI`, `currentStats` properties

#### Step 3: Update layout-data.ts
- Fetch all available profiles based on user roles
- Map all profiles to UI format
- Pass `profiles`, `profilesUI`, `stats`, and default `activeRole`

#### Step 4: Update layout-client.tsx
- Listen to `activeRole` changes via context
- Pass `activeRole` to sidebars
- Add role switcher component (button/dropdown)
- Re-render sidebar when role changes

#### Step 5: Update useProfile Hook
- Add helper selectors
- `useProfile().currentProfile` - get currently active profile
- `useProfile().switchRole(role)` - switch active role

### 4. Profile Mapper Updates

Create role-aware mappers:
```typescript
lib/profileMapper.ts
- mapAPIToUI(profile, role) // Include role in mapping logic
- mapRecruiterAPIToUI(profile) // Recruiter-specific mapping
```

### 5. Component Updates

Update components that use profile data:
- Sidebars - Already support different UIs per role, now pass `activeRole`
- Profile edit forms - Check for correct profile type
- Dashboard components - Use `currentStats`

### 6. Role Switching UX

Add role switcher in:
- Header/Navbar
- Sidebar footer
- Account settings

Shows available roles as:
- Dropdown
- Button tabs
- Radio buttons

Only shows roles user actually has.

## Data Flow

```
Layout (Server)
  ↓
getBusinessLayoutData()
  ├─ fetchAllProfiles(roles) → {talent, recruiter, mentor}
  ├─ mapAllProfiles() → profilesUI
  ├─ fetchAllStats() → {talent, recruiter, mentor}
  └─ Pass to ProfileProvider
    ↓
ProfileProvider (with all profiles)
  ├─ activeRole state
  ├─ computed currentProfile, currentProfileUI, currentStats
  └─ setActiveRole function
    ↓
layout-client.tsx
  ├─ useProfile()
  ├─ renderSidebar(activeRole)
  ├─ RoleSwitcher(activeRole, setActiveRole)
  └─ {children}
    ↓
Child Pages/Components
  └─ useProfile().currentProfile
  └─ useProfile().switchRole()
```

## Benefits

1. **Single data fetch**: All profiles loaded at layout level
2. **No page reloads**: Role switching is instant, just context update
3. **Type-safe**: Each role has its own type
4. **Extensible**: Easy to add new roles (mentor, etc.)
5. **Lazy loading ready**: Can optimize to fetch profiles on-demand if needed later
6. **Consistent UX**: Same pattern across talent, recruiter, mentor

## Migration Path

1. Start with talent + recruiter
2. Keep existing talent-only UI working
3. Gradually migrate components to use `currentProfile`
4. Add role switcher component
5. Add mentor role when ready

## Files to Create/Modify

### Create
- `lib/api/recruiter/server.ts` - Recruiter server functions

### Modify
- `app/(business)/profile-provider.tsx` - Enhanced context
- `app/(business)/layout-data.ts` - Fetch all profiles
- `app/(business)/layout-client.tsx` - Role switching logic
- `hooks/useProfile.ts` - Add helpers
- `lib/profileMapper.ts` - Role-aware mapping (if needed)

### Future
- Role switcher component in navbar
- Profile edit pages with role detection
- Role-specific dashboards
