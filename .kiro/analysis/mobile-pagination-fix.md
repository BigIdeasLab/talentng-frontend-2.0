# Mobile Pagination Fix

## Problem
On mobile, pages with pagination couldn't scroll to show the pagination controls at the bottom. The pagination was cut off and inaccessible.

## Root Cause
- Mobile layout has a header (~60px height) that takes space
- Pages were using `h-screen` (100vh) which includes the header space
- Actual available space for page content = `100vh - 60px` (header)
- Pagination at bottom was outside the visible area

## Solution
Changed pages from `h-screen` to `h-[calc(100vh-60px)]` on mobile, keeping `h-screen` on desktop.

### Formula:
```tsx
// Mobile: Account for header height
h-[calc(100vh-60px)]

// Desktop: Full screen (no mobile header)
md:h-screen
```

## Files Changed

### Pages with Pagination Fixed:

1. **app/(business)/calendar/page.tsx**
   - Changed: `h-screen` → `h-[calc(100vh-60px)] md:h-screen`

2. **app/(business)/applicants/page.tsx**
   - Changed: `h-screen` → `h-[calc(100vh-60px)] md:h-screen`

3. **app/(business)/applications/page.tsx**
   - Changed: `h-screen` → `h-[calc(100vh-60px)] md:h-screen`

4. **app/(business)/sessions/page.tsx**
   - Changed: `h-screen` → `h-[calc(100vh-60px)] md:h-screen`

5. **app/(business)/opportunities/opportunities-client.tsx**
   - Changed: `h-screen` → `h-[calc(100vh-60px)] md:h-screen`

6. **app/(business)/mentorship/page.tsx**
   - Changed: `h-screen` → `h-[calc(100vh-60px)] md:h-screen`

7. **app/(business)/discover-talent/discover-talent-client.tsx**
   - Changed: `h-screen` → `h-[calc(100vh-60px)] md:h-screen`

8. **components/talent/applications/TalentMyApplications.tsx**
   - Mobile layout: `h-screen` → `h-[calc(100vh-60px)]`

## Testing

### ✅ Expected Results:
- Mobile: Can scroll to see pagination at bottom
- Mobile: Pagination is fully visible and clickable
- Desktop: No change in behavior (still uses full screen height)
- No double scroll effect

### Test These Pages on Mobile:
- [ ] Calendar - scroll to pagination
- [ ] My Applications - scroll to pagination
- [ ] Applicants - scroll to pagination
- [ ] Applications - scroll to pagination
- [ ] Sessions - scroll to pagination
- [ ] Opportunities - scroll to pagination
- [ ] Mentorship - scroll to pagination
- [ ] Discover Talent - scroll to pagination

### Test on Desktop:
- [ ] All pages still work correctly
- [ ] Pagination visible at bottom
- [ ] No layout shifts

## Technical Details

### Mobile Header Height
The mobile header in `layout-client.tsx` has:
- `py-3` (12px top + 12px bottom = 24px)
- Logo height: `h-10` (40px)
- Border: 1px
- **Total: ~60px**

### Why calc(100vh-60px)?
- `100vh` = full viewport height
- `-60px` = subtract mobile header height
- Result = available space for page content
- Pagination now fits within this space

## Notes

- Desktop uses `md:h-screen` (no calc needed, no mobile header)
- Mobile uses `h-[calc(100vh-60px)]` (accounts for header)
- This maintains the single-scroll behavior we implemented earlier
- No double scroll, just proper height calculation
