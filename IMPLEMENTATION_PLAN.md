# Complete Role-Based Profile System Implementation Plan

## Overview
Implement a unified multi-role profile system where users with talent, recruiter, and mentor roles can seamlessly switch between profiles. Profile switching happens in `ProfileSwitcher.tsx` component (not via URL query params).

## Current State
- Only talent profiles are loaded and managed
- `ProfileSwitcher.tsx` has hardcoded role switching that navigates to `/dashboard?role=employer` or `/dashboard?role=mentor`
- Multiple profiles fetched but not available simultaneously
- No role state management for profile switching

## Target Architecture

```
User with [talent, recruiter, mentor] roles
        ↓
ProfileProvider (Multi-role context)
├─ profiles: { talent, recruiter, mentor }
├─ profilesUI: { talent, recruiter, mentor } (mapped)
├─ stats: { talent, recruiter, mentor } (when available)
├─ activeRole: string (current active role)
├─ setActiveRole: (role) => void
└─ computed properties:
   ├─ currentProfile
   ├─ currentProfileUI
   └─ currentStats
        ↓
ProfileSwitcher.tsx (Role Switching Hub)
├─ Dynamic buttons for available roles
├─ Pass profiles data from context
├─ Call setActiveRole(role) on click
├─ No URL navigation for role switching
        ↓
Layout/Components
├─ Listen to activeRole changes
├─ Render appropriate sidebar
├─ Pass correct profile data
└─ All pages use "recruiter" not "employer"
```

## Implementation Steps

### Step 1: Create Server Functions
**Files to create:**
- `lib/api/recruiter/server.ts` ✅
- `lib/api/mentor/server.ts` ✅

**Functions:**
- `getServerCurrentRecruiterProfile()`
- `getServerCurrentMentorProfile()`
- `getServerCurrentTalentProfile()` (already exists)

### Step 2: Update ProfileProvider Context
**File:** `app/(business)/profile-provider.tsx`

**Changes:**
```typescript
interface ProfileContextType {
  // User info
  userId: string | null;
  userRoles: string[];
  
  // Current active role
  activeRole: string;
  setActiveRole: (role: string) => void;
  
  // All profiles by role
  profiles: {
    talent?: TalentProfile;
    recruiter?: RecruiterProfile;
    mentor?: MentorProfile;
  };
  
  // Mapped UI data by role
  profilesUI: {
    talent?: UIProfileData;
    recruiter?: UIProfileData;
    mentor?: UIProfileData;
  };
  
  // Stats by role (when available)
  stats: {
    talent?: DashboardStats;
    recruiter?: any; // RecruiterDashboardStats when endpoint exists
    mentor?: any; // MentorDashboardStats when endpoint exists
  };
  
  // Computed getters for current role
  currentProfile: TalentProfile | RecruiterProfile | MentorProfile | null;
  currentProfileUI: UIProfileData | null;
  currentStats: any | null;
  
  // Legacy fields for backward compatibility
  initialProfileData: UIProfileData | null;
  initialProfileRaw: TalentProfile | null;
  recommendations: any[];
  error: string | null;
}
```

### Step 3: Update layout-data.ts
**File:** `app/(business)/layout-data.ts`

**Changes:**
```typescript
export async function getBusinessLayoutData() {
  try {
    // 1. Get user with roles
    const [profileRes, userRes] = await Promise.all([
      getServerCurrentProfile(), // talent
      getCurrentUser(),
    ]);
    
    // 2. Fetch all available profiles in parallel
    const profilePromises: Record<string, Promise<any>> = {
      talent: Promise.resolve(profileRes),
    };
    
    // Add recruiter profile if user has recruiter role
    if (userRes.roles?.includes("recruiter")) {
      profilePromises.recruiter = getServerCurrentRecruiterProfile()
        .catch(() => null);
    }
    
    // Add mentor profile if user has mentor role
    if (userRes.roles?.includes("mentor")) {
      profilePromises.mentor = getServerCurrentMentorProfile()
        .catch(() => null);
    }
    
    const [talent, recruiter, mentor] = await Promise.allSettled([
      profilePromises.talent,
      profilePromises.recruiter,
      profilePromises.mentor,
    ]);
    
    // 3. Map all profiles to UI format
    const allProfiles = {
      talent: talentResult,
      ...(recruiterResult && { recruiter: recruiterResult }),
      ...(mentorResult && { mentor: mentorResult }),
    };
    
    const allProfilesUI = {
      talent: mapAPIToUI(talentResult),
      ...(recruiterResult && { recruiter: mapRecruiterAPIToUI(recruiterResult) }),
      ...(mentorResult && { mentor: mapMentorAPIToUI(mentorResult) }),
    };
    
    // 4. Fetch stats for each role
    const statsPromises: Record<string, Promise<any>> = {
      talent: getServerDashboardStats(),
    };
    
    // Add other stats if endpoints exist (placeholder)
    // if (recruiterResult) statsPromises.recruiter = getServerRecruiterStats();
    // if (mentorResult) statsPromises.mentor = getServerMentorStats();
    
    const allStats = {
      talent: talentStats,
      // recruiter: recruiterStats (when endpoint exists),
      // mentor: mentorStats (when endpoint exists),
    };
    
    // 5. Default active role: talent (or first available)
    const defaultRole = userRes.roles?.[0] || "talent";
    
    return {
      profiles: allProfiles,
      profilesUI: allProfilesUI,
      stats: allStats,
      userId: talentResult.userId,
      userRoles: userRes.roles || ["talent"],
      activeRole: defaultRole,
      
      // Legacy fields
      profileData: allProfilesUI.talent,
      profileRaw: allProfiles.talent,
      recommendations: [...],
      error: null,
    };
  } catch (error) {
    // Error handling...
  }
}
```

### Step 4: Update ProfileProvider Component
**File:** `app/(business)/profile-provider.tsx`

**Changes:**
- Add client-side `activeRole` state
- Add `setActiveRole` function
- Add computed properties that select from `profiles[activeRole]`
- Pass enhanced context with all profiles and role switcher

### Step 5: Update ProfileSwitcher Component
**File:** `components/layouts/ProfileSwitcher.tsx`

**Changes:**
```typescript
export function ProfileSwitcher({ userRoles }: ProfileSwitcherProps) {
  const { profiles, profilesUI, activeRole, setActiveRole } = useProfile();
  
  // Dynamically render buttons only for roles user has
  const availableRoles = userRoles.filter(role => 
    profiles[role] !== null && profiles[role] !== undefined
  );
  
  const handleSwitchRole = (role: string) => {
    setActiveRole(role);
    setIsOpen(false);
  };
  
  // Render switch profile section dynamically
  // Only show roles that are not the current active role
  return (
    // ... existing structure
    <div className="mb-[20px]">
      <div className="text-[12px] leading-[20px] font-medium text-[rgba(0,0,0,0.30)] font-['Inter_Tight'] mb-[18px]">
        SWITCH PROFILE
      </div>
      <div className="flex flex-col gap-[20px]">
        {availableRoles.map(role => {
          if (role === activeRole) return null; // Hide current role
          
          const profile = profiles[role];
          const displayName = profile?.fullName || profile?.companyName || "User";
          const displayRole = role.charAt(0).toUpperCase() + role.slice(1);
          
          return (
            <button
              key={role}
              onClick={() => handleSwitchRole(role)}
              className="flex items-center justify-between hover:opacity-70 transition-opacity"
            >
              <div className="flex items-center gap-[10px]">
                <div
                  className="w-[42px] h-[42px] rounded-full bg-cover bg-center flex-shrink-0"
                  style={{
                    backgroundImage: `url(${profile?.profileImageUrl || defaultImage})`,
                  }}
                />
                <div className="flex flex-col gap-[10px] text-left">
                  <div className="text-[16px] font-medium text-black">
                    {displayName}
                  </div>
                  <div className="text-[15px] font-light text-[#525866]">
                    {displayRole}
                  </div>
                </div>
              </div>
              <ArrowRightIcon />
            </button>
          );
        })}
      </div>
    </div>
    // ... rest of component
  );
}
```

### Step 6: Update Role String References
**Find and replace:**
- All references to `"employer"` role → `"recruiter"`
- Pages that check `role === "employer"` → `role === "recruiter"`
- Sidebars components: update to use `recruiter` not `employer`

**Search patterns:**
```
- EmployerSidebar → RecruiterSidebar (rename component/file)
- role === "employer" → role === "recruiter"
- "employer" → "recruiter"
- userRole === "employer" → userRole === "recruiter"
```

### Step 7: Update layout-client.tsx
**File:** `app/(business)/layout-client.tsx`

**Changes:**
```typescript
export function AppLayoutClient({ children }: { children: React.ReactNode }) {
  const [activeNavItem, setActiveNavItem] = useState("dashboard");
  const { userRoles, activeRole } = useProfile(); // Add activeRole
  
  // Use activeRole instead of userRoles[0]
  const renderSidebar = () => {
    switch (activeRole) {
      case "recruiter":
        return <RecruiterSidebar ... />;
      case "mentor":
        return <MentorSidebar ... />;
      case "talent":
      default:
        return <TalentSidebar ... />;
    }
  };
  
  // ... rest of component
}
```

### Step 8: Update useProfile Hook
**File:** `hooks/useProfile.ts`

**Changes:**
```typescript
export function useProfile() {
  const context = useContext(ProfileContext);
  
  if (!context) {
    throw new Error("useProfile must be used within ProfileProvider");
  }
  
  // Add helper to switch role
  return {
    ...context,
    switchRole: (role: string) => context.setActiveRole(role),
  };
}
```

### Step 9: Create Profile Mappers (if needed)
**Files:**
- `lib/profileMapper.ts` (enhance existing)
- `lib/mappers/recruiterMapper.ts` (new)
- `lib/mappers/mentorMapper.ts` (new)

**Purpose:**
- Map recruiter/mentor API data to UI format
- Normalize all profiles to consistent UI structure

## API Files Created

### Client APIs (Already Created)
✅ `lib/api/recruiter/index.ts` - Recruiter client functions
✅ `lib/api/recruiter/types.ts` - Recruiter types
✅ `lib/api/mentor/index.ts` - Mentor client functions (13 endpoints)
✅ `lib/api/mentor/types.ts` - Mentor types

### Server APIs (Already Created)
✅ `lib/api/recruiter/server.ts` - Server-side recruiter functions
✅ `lib/api/mentor/server.ts` - Server-side mentor functions

## Data Flow After Implementation

```
1. Page Load
   ↓
2. layout.tsx calls getBusinessLayoutData()
   ↓
3. Fetch all profiles in parallel (talent, recruiter, mentor)
   ↓
4. Map all to UI format
   ↓
5. Pass to ProfileProvider with:
   - profiles: { talent, recruiter, mentor }
   - profilesUI: { talent, recruiter, mentor }
   - activeRole: "talent" (default)
   - setActiveRole: function
   ↓
6. ProfileSwitcher renders available roles
   ↓
7. User clicks "Switch to Recruiter"
   ↓
8. setActiveRole("recruiter") updates context
   ↓
9. layout-client.tsx detects activeRole change
   ↓
10. Renders RecruiterSidebar instead of TalentSidebar
    ↓
11. All components using useProfile() get recruiter profile data
```

## Key Principles

1. **No URL changes for role switching** - It's a context state update, not navigation
2. **All profiles loaded once** - Parallel fetching at layout level, not on every route
3. **Type-safe** - Each role has dedicated types and APIs
4. **Backward compatible** - Legacy talent-only code still works
5. **Dynamic role switching** - Only show roles user actually has
6. **Single source of truth** - Context is the only place profiles are stored

## Testing Checklist

- [ ] User with single role loads correctly
- [ ] User with multiple roles loads all profiles
- [ ] Switching roles updates sidebar
- [ ] Profile data reflects current role
- [ ] Stats reflect current role
- [ ] ProfileSwitcher only shows available roles
- [ ] Active role not shown in switcher
- [ ] Refresh maintains active role (or defaults to first)
- [ ] All page refs use "recruiter" not "employer"
- [ ] Each role sees correct dashboard

## Migration Notes

1. **Phased approach:**
   - Phase 1: Set up infrastructure (context, layout-data)
   - Phase 2: Add recruiter/mentor profiles
   - Phase 3: Update ProfileSwitcher
   - Phase 4: Update all role references ("employer" → "recruiter")

2. **Existing pages:**
   - Talent profile pages work as-is
   - Update recruiter pages to use "recruiter" role
   - Add mentor pages when ready

3. **Future enhancements:**
   - Dashboard stats for each role
   - Role-specific onboarding flows
   - Profile validation per role
   - Analytics per role
