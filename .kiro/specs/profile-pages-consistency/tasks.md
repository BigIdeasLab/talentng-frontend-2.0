# Profile Pages Consistency - Implementation Tasks

## Task 1: Standardize Mentor Profile Page
Update `app/(business)/mentorship/[id]/page.tsx` to match design system standards.

### Sub-tasks:
- [ ] 1.1: Update sidebar padding from `px-4 py-7` to `px-[25px] py-[15px]`
- [ ] 1.2: Update profile image size from `w-[90px] h-[90px]` to `w-[110px] h-[110px]`
- [ ] 1.3: Update subtitle font size from `text-[14px]` to `text-[13px]`
- [ ] 1.4: Update all detail item text from `text-[13px]` to `text-[12px]`
- [ ] 1.5: Update stack pill padding from `py-[7px]` to `py-[6px]`
- [ ] 1.6: Update social links header from `text-[11px]` to `text-[12px]`
- [ ] 1.7: Update social links item text from `text-[13px]` to `text-[12px]`
- [ ] 1.8: Update social links container gap from `gap-2` to `gap-[10px]`
- [ ] 1.9: Update social links section gap from `gap-4` to `gap-[12px]`
- [ ] 1.10: Add `mt-[20px]` to social links section wrapper

## Task 2: Standardize Talent Profile Panel
Update `components/employer/talent-profile/components/TalentProfilePanel.tsx` to match design system standards.

### Sub-tasks:
- [ ] 2.1: Update button background from `bg-[#1A1D2E]` to `bg-[#181B25]`
- [ ] 2.2: Update button hover from `hover:bg-[#252A3E]` to `hover:bg-[#2a2f3a]`

## Task 3: Standardize Recruiter Profile Page
Update `app/(business)/recruiter/[id]/page.tsx` to match design system standards.

### Sub-tasks:
- [ ] 3.1: Update button margin from `mt-[15px]` to `mt-[20px]`
- [ ] 3.2: Update social link icon SVGs from 16×16 to 18×18 (update viewBox and paths)

## Task 4: Verify Tab Navigation Consistency
Check and standardize tab navigation components.

### Sub-tasks:
- [ ] 4.1: Read `TalentProfileNav` component
- [ ] 4.2: Compare with Recruiter tab styling
- [ ] 4.3: Update if inconsistencies found

## Task 5: Visual Verification
Perform visual inspection and testing.

### Sub-tasks:
- [ ] 5.1: Compare all three profile pages side-by-side
- [ ] 5.2: Verify mobile responsiveness
- [ ] 5.3: Verify tablet responsiveness
- [ ] 5.4: Verify desktop layout
- [ ] 5.5: Check all spacing values
- [ ] 5.6: Check all font sizes
- [ ] 5.7: Check all colors
- [ ] 5.8: Check all icon sizes

## Task 6: Code Review and Cleanup
Final review and documentation.

### Sub-tasks:
- [ ] 6.1: Review all changed files
- [ ] 6.2: Ensure no regressions
- [ ] 6.3: Update any related documentation
- [ ] 6.4: Remove any unused code or classes
