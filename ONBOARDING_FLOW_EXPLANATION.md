# Onboarding Flow Explanation - TalentNG Frontend

## Overview

The onboarding system is a **multi-step wizard** that allows users to:

1. **Initial Onboarding**: Create their first role (Talent, Recruiter/Employer, or Mentor)
2. **Add New Role**: Add additional roles after the first one is completed

The system **blocks users from selecting roles they've already completed** and uses a single API endpoint to handle all role creation/onboarding.

---

## How New Onboarding Works After Creating a Role

### 1. **User Initiates "Add New Role"**

**Location**: `components/layouts/ProfileSwitcher.tsx` (Lines 202-207)

```typescript
const handleAddNewRole = () => {
  setIsOpen(false);
  // Pass existing roles as query params to avoid stale data issues
  const rolesParam = userRoles.join(",");
  router.push(`/onboarding?mode=add-role&roles=${rolesParam}`);
};
```

**What happens**:

- User clicks "Add New Role" button in the dashboard ProfileSwitcher dropdown
- Frontend navigates to `/onboarding?mode=add-role&roles=talent,recruiter`
- Existing roles are passed as query parameters to avoid stale data issues

---

### 2. **Onboarding Page Detects "Add Role" Mode**

**Location**: `app/(auth)/onboarding/page.tsx` (Lines 49-90)

```typescript
// Check if we're in "add role" mode
const isAddingRole = searchParams.get("mode") === "add-role";

// Fetch completed profile statuses when in add-role mode
useEffect(() => {
  if (isAddingRole) {
    const fetchCompletedRoles = async () => {
      const completed: string[] = [];

      // Check Talent Profile
      try {
        const talentResponse = await getServerCurrentProfile();
        if (talentResponse?.isProfileCreated) {
          completed.push("talent");
        }
      } catch {
        // Profile doesn't exist or error occurred
      }

      // Check Recruiter Profile
      try {
        const recruiterResponse = await getServerCurrentRecruiterProfile();
        if (recruiterResponse?.isProfileCreated) {
          completed.push("recruiter");
        }
      } catch {
        // Profile doesn't exist or error occurred
      }

      // Check Mentor Profile
      try {
        const mentorResponse = await getServerCurrentMentorProfile();
        if (mentorResponse?.isProfileCreated) {
          completed.push("mentor");
        }
      } catch {
        // Profile doesn't exist or error occurred
      }

      setCompletedRoles(completed);
    };

    fetchCompletedRoles();
  }
}, [isAddingRole]);
```

**What happens**:

- Detects `mode=add-role` query parameter
- Makes 3 parallel server calls to check profile creation status:
  - `GET /talent/me` → checks if `isProfileCreated: true`
  - `GET /recruiter/me` → checks if `isProfileCreated: true`
  - `GET /mentor/me` → checks if `isProfileCreated: true`
- Collects completed roles in `completedRoles` state
- Any profile that doesn't exist or returns false is excluded

---

### 3. **Role Selection - Blocking Completed Roles**

**Location**: `components/onboarding/SelectRoleStep.tsx` (Lines 64-75)

```typescript
// Check if a role is already completed
const isRoleCompleted = (roleId: string): boolean => {
  // Map frontend role IDs to API role values
  const roleMap: Record<string, string[]> = {
    talent: ["talent"],
    employer: ["recruiter"], // employer role maps to recruiter in API
    mentor: ["mentor"],
  };

  const apiRoles = roleMap[roleId] || [roleId];
  return apiRoles.some((role) => existingRoles.includes(role));
};

// Count completed roles for progress badge
const completedCount = roles.filter((r) => isRoleCompleted(r.id)).length;
```

**What happens**:

- Maps frontend role IDs to backend API role names (employer → recruiter)
- Checks if each role is in the `existingRoles` array
- If role is completed:
  - Button is **disabled** and has `opacity-50` styling
  - Shows "Completed" badge with checkmark overlay
  - Cannot be clicked
  - Shows tooltip: "You're already onboarded as [role]"
- Shows progress badge: "X of 3" (e.g., "1 of 3" if 1 role is completed)

**UI Result**:

```
How do you want to use Talent.ng        1 of 3
┌─────────────┬─────────────┬─────────────┐
│  Talent     │  Employer   │   Mentor    │
│  [Normal]   │  [Disabled] │  [Normal]   │
│             │  ✓ Complete │             │
└─────────────┴─────────────┴─────────────┘
```

---

### 4. **Step-by-Step Profile Completion**

Once a role is selected, the user goes through role-specific steps:

#### **For Talent Role** (3 steps):

1. **Step 2**: `CreateProfileStep` - Basic profile (firstName, lastName, username, location, bio, profileImage)
2. **Step 3**: `ShowcaseSkillsStep` - Add skills/expertise

#### **For Employer/Recruiter Role** (3 steps):

1. **Step 2**: `CompanyProfileStep` - Company basic info (companyName, industry, logo)
2. **Step 3**: `CompanyDetailsStep` - Company details (companySize, companyStage, operatingModel)

#### **For Mentor Role** (3 steps):

1. **Step 2**: `MentorProfileStep` - Mentor basic profile (firstName, lastName, username, location, bio, logo)
2. **Step 3**: `MentorExpertiseStep` - Expertise details (expertise, experience, mentorshipStyle, linkedIn)

---

## API Endpoints Used

### 1. **Check Profile Status** (Frontend Calls)

Used in add-role mode to determine which roles are already completed:

```
GET /talent/me
GET /recruiter/me
GET /mentor/me
```

**Response Format**:

```json
{
  "id": "user-id",
  "isProfileCreated": true, // Key field - determines if role is completed
  "firstName": "John",
  "lastName": "Doe"
  // ... other fields
}
```

**What backend needs to return**:

- `isProfileCreated: true` if the user has created a profile for that role
- `isProfileCreated: false` or endpoint throws error if profile doesn't exist

---

### 2. **Complete Onboarding** (Final Submission)

Used for all role types (new onboarding or adding new role):

```
POST /users/me/onboard
Content-Type: multipart/form-data
```

**FormData Payload** (regardless of new onboarding or add-role mode):

```
├─ role: "TALENT" | "RECRUITER" | "MENTOR"
├─ profile: JSON string
│  └─ {
│     "username": "john_doe",
│     "firstName": "John",
│     "lastName": "Doe",
│     "location": "Lagos, Nigeria",
│     "bio": "Software Developer",
│     // For Recruiter only:
│     "companyName": "Tech Corp",
│     "industry": "Technology"
│   }
├─ details: JSON string
│  └─ {
│     // For Talent:
│     "skills": ["JavaScript", "React"],
│
│     // For Recruiter:
│     "companySize": "10-50",
│     "companyStage": "Series A",
│     "operatingModel": "Remote",
│
│     // For Mentor:
│     "expertise": ["JavaScript", "Leadership"],
│     "experience": "10 years",
│     "mentorshipStyle": "Hands-on",
│     "linkedIn": "linkedin.com/in/johndoe"
│   }
└─ profileImage: File (optional)
```

**Important Notes**:

- Role value is always sent as `"TALENT"`, `"RECRUITER"`, or `"MENTOR"` (uppercase)
- `"employer"` frontend role is mapped to `"RECRUITER"` API role
- Both new onboarding and add-role mode use the **same endpoint**
- The system differentiates based on whether `isProfileCreated` was true for that role before

---

### 3. **Check Username Availability**

Used during profile creation:

```
GET /users/me/username-available/{username}
```

**Response Format**:

```json
{
  "available": true | false
}
```

---

## Complete Request/Response Flow for Add-Role Scenario

### User adds "Talent" role after being a "Recruiter":

```
1. User clicks "Add New Role" on Dashboard
   ↓
2. Frontend: GET /recruiter/me
   Response: { isProfileCreated: true } → blocked from selection
   ↓
3. Frontend: GET /talent/me
   Response: { isProfileCreated: false } → available for selection
   ↓
4. Frontend: GET /mentor/me
   Response: { isProfileCreated: false } → available for selection
   ↓
5. UI shows only Talent and Mentor as clickable options

6. User fills Talent profile data:
   - CreateProfileStep: firstName, lastName, username, location, bio, image
   - ShowcaseSkillsStep: skills array
   ↓
7. User submits FormData:
   POST /users/me/onboard
   {
     role: "TALENT",
     profile: {
       username: "john_doe",
       firstName: "John",
       lastName: "Doe",
       location: "Lagos",
       bio: "Developer"
     },
     details: {
       skills: ["JavaScript", "React"]
     },
     profileImage: File
   }
   ↓
8. Backend creates/updates Talent profile for existing user
   ↓
9. Frontend: refetchUser() to get updated roles
   ↓
10. Redirect to: /dashboard?switchRole=talent
```

---

## Key Differences: New Onboarding vs Add-Role

| Aspect              | New Onboarding                                | Add-Role                                                |
| ------------------- | --------------------------------------------- | ------------------------------------------------------- |
| **URL**             | `/onboarding`                                 | `/onboarding?mode=add-role&roles=...`                   |
| **Profile Checks**  | Skipped (no user roles yet)                   | Fetches all 3 profile endpoints to get `completedRoles` |
| **Available Roles** | All 3 roles shown                             | Only roles with `isProfileCreated: false`               |
| **Success Message** | "Your profile has been successfully created." | "Your new role has been successfully added."            |
| **Redirect**        | `/dashboard`                                  | `/dashboard?switchRole={newRole}`                       |
| **API Endpoint**    | Same: `POST /users/me/onboard`                | Same: `POST /users/me/onboard`                          |

---

## State Management

**Key state variables in `OnboardingPage.tsx`**:

```typescript
const [currentStep, setCurrentStep] = useState(1); // 1, 2, 3
const [selectedRole, setSelectedRole] = useState<Role>(); // "talent", "employer", "mentor"
const [profileData, setProfileData] = useState<ProfileData>(); // Profile fields
const [companyData, setCompanyData] = useState(); // For employer role
const [mentorData, setMentorData] = useState(); // For mentor role
const [profileImage, setProfileImage] = useState<File>(); // Image upload
const [completedRoles, setCompletedRoles] = useState<string[]>(); // From profile checks
const isAddingRole = searchParams.get("mode") === "add-role"; // Add-role flag
```

---

## Summary for Backend Team

**When explaining endpoint usage to backend:**

1. **Profile Status Endpoints** (`GET /talent/me`, `/recruiter/me`, `/mentor/me`):
   - Called only in add-role mode to determine which roles are already completed
   - Must return `isProfileCreated: boolean` flag
   - If role not started yet, endpoint should either return `false` or throw an error (both are handled)

2. **Onboarding Endpoint** (`POST /users/me/onboard`):
   - Single endpoint for all role types and all onboarding scenarios
   - Role value in FormData determines which profile type to create
   - Backend should check if `isProfileCreated` already exists to distinguish between:
     - New profile creation (first time user is creating this role)
     - Existing profile update (unlikely in production but possible)
   - `profileImage` is optional multipart field

3. **Username Endpoint** (`GET /users/me/username-available/{username}`):
   - Called during profile creation with debounce
   - Validates username uniqueness for the role being created

4. **User Refetch**:
   - After successful onboarding, frontend calls `refetchUser()` which does `GET /users/me`
   - This should return updated `roles` array including the newly added role
   - Frontend uses this to determine which roles the user now has

---

## Visual Diagram

```
┌─────────────────────────────────────────────────┐
│           Dashboard (User Logged In)             │
│    Click "Add New Role" in ProfileSwitcher       │
└────────────────┬────────────────────────────────┘
                 │
                 ▼
    /onboarding?mode=add-role&roles=recruiter
                 │
    ┌────────────┴────────────┐
    ▼                         ▼
GET /talent/me        GET /recruiter/me      GET /mentor/me
(isProfileCreated: false) (isProfileCreated: true) (isProfileCreated: false)
    │                         │                     │
    └────────┬────────────────┴─────────┬───────────┘
             │                          │
      completedRoles = ["recruiter"]    │
             │                          │
             ▼                          │
     SelectRoleStep (Step 1)            │
     ┌─────────────────────────────┐    │
     │ ☐ Talent    (enabled)       │    │
     │ ☒ Recruiter (disabled)      │    │
     │ ☐ Mentor    (enabled)       │    │
     └────────┬────────────────────┘    │
              │ User selects "Talent"   │
              ▼                         │
     CreateProfileStep (Step 2)         │
     ┌─────────────────────────────┐    │
     │ Username, First Name, etc   │    │
     └────────┬────────────────────┘    │
              │                         │
              ▼                         │
     ShowcaseSkillsStep (Step 3)        │
     ┌─────────────────────────────┐    │
     │ Add Skills, Experience      │    │
     └────────┬────────────────────┘    │
              │                         │
              ▼                         │
       POST /users/me/onboard           │
       (role: "TALENT", ...)            │
              │                         │
              ▼                         │
    Backend creates Talent profile      │
              │                         │
              ▼                         │
    Frontend GET /users/me (refetchUser)
    New roles: ["recruiter", "talent"]  │
              │                         │
              ▼                         │
    Redirect: /dashboard?switchRole=talent
```

---

## Username Validation

During profile creation, username validation:

- Uses **debounce** to avoid excessive API calls
- Validates locally: 3-50 characters, alphanumeric+underscore
- Calls `GET /users/me/username-available/{username}` to check uniqueness
- Must be unique across the platform (not role-specific)

---

## Error Handling

Both new onboarding and add-role mode handle:

- **Timeout errors**: Special message about request duration
- **Transaction errors**: Handled the same as timeout
- **Generic errors**: Display error message from backend
- **Missing data errors**: Display "Profile data is missing"

Error messages are role-aware:

- New onboarding: "Onboarding Failed"
- Add-role: "Failed to add role"
