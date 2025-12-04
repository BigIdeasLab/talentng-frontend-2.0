# Onboarding Expertise Data Format Fix

## Problem
Expertise was being stored as nested arrays `[["Mobile Development"]]` instead of flat arrays `["Mobile Development"]` during onboarding.

## Root Cause
There was a mismatch in how expertise data was being handled between:
1. **MentorExpertiseStep** - Returns `expertise` as `string[]` (array of selected items)
2. **ShowcaseExpertiseStep** - Returns `expertise` as `string` (single text input)
3. **Onboarding page handler** - Was passing `data.expertise` directly without normalizing the format

## Solution

### 1. Updated Type Definition (`lib/types/onboarding.ts`)
Changed `MentorExpertiseData` interface to support both string and array:
```typescript
export interface MentorExpertiseData {
  expertise: string | string[];  // Now accepts both formats
  experience: string;
  mentorshipStyle: string;
  linkedIn: string;
}
```

### 2. Normalized Data in Onboarding Handler (`app/(auth)/onboarding/page.tsx`)
Updated `handleMentorExpertiseNext` to always ensure expertise is an array:
```typescript
const detailsData = {
  expertise: Array.isArray(data.expertise) ? data.expertise : [data.expertise],
  experience: data.experience,
  mentorshipStyle: data.mentorshipStyle,
  linkedIn: data.linkedIn,
};
```

### 3. Added Debug Logging
Added console logs to track the expertise data format during submission:
```typescript
console.log("Expertise:", detailsData.expertise);
console.log("Expertise type:", Array.isArray(detailsData.expertise) ? "array" : "string");
```

## Data Flow
```
MentorExpertiseStep (expertise: ["Mobile Development"])
       ↓
handleMentorExpertiseNext (data.expertise is already array)
       ↓
Array.isArray check → true, use as-is
       ↓
detailsData.expertise = ["Mobile Development"]
       ↓
JSON.stringify → {"expertise":["Mobile Development"]}
       ↓
Backend receives flat array ✓
```

## Testing
After this fix:
- Mentor role should save expertise as flat array: `["Mobile Development"]`
- Talent role should save expertise as flat array (wrapped from string): `["Software Engineering"]`
- No more double-nested arrays in the database
