# Profile Pages Consistency Requirements

## Overview

Standardize all profile detail pages (Talent, Recruiter/Company, Mentor) to ensure visual and functional consistency across fonts, borders, padding, tabs, buttons, image sizes, spacing, skills, social links, and all other UI elements.

## Affected Pages

1. **Talent Profile** - `components/employer/talent-profile/TalentProfileView.tsx` + `TalentProfilePanel.tsx`
2. **Recruiter/Company Profile** - `app/(business)/recruiter/[id]/page.tsx`
3. **Mentor Profile** - `app/(business)/mentorship/[id]/page.tsx`

## Current Inconsistencies Identified

### 1. Profile Image Sizes

- **Talent**: 110px × 110px
- **Recruiter**: 110px × 110px
- **Mentor**: 90px × 90px ❌ INCONSISTENT

### 2. Sidebar Width

- **Talent**: 350px (lg:w-[350px])
- **Recruiter**: 350px (lg:w-[350px])
- **Mentor**: 350px (lg:w-[350px]) ✓ CONSISTENT

### 3. Sidebar Padding

- **Talent**: px-[25px] py-[15px]
- **Recruiter**: px-[25px] py-[15px]
- **Mentor**: px-4 py-7 ❌ INCONSISTENT (px-4 = 16px, py-7 = 28px)

### 4. Profile Name Font Size

- **Talent**: text-[16px]
- **Recruiter**: text-[16px]
- **Mentor**: text-[16px] ✓ CONSISTENT

### 5. Subtitle/Headline Font Size

- **Talent**: text-[13px] font-light
- **Recruiter**: text-[13px] font-light
- **Mentor**: text-[14px] font-light ❌ INCONSISTENT

### 6. Detail Items (Location, Jobs, etc.)

- **Talent**: text-[12px], gap-[6px], icon w-[18px] h-[18px]
- **Recruiter**: text-[12px], gap-[6px], icon w-[18px] h-[18px]
- **Mentor**: text-[13px], gap-1.5, icon w-[18px] h-[18px] ❌ INCONSISTENT (text size)

### 7. Action Button (Hire/View Opportunities/Book Session)

- **Talent**: h-[44px], mt-[20px], text-[14px], rounded-full, bg-[#1A1D2E]
- **Recruiter**: h-[44px], mt-[15px], text-[14px], rounded-full, bg-[#181B25]
- **Mentor**: h-[44px], text-[14px], rounded-full, bg-[#181B25] ❌ INCONSISTENT (margin, bg color)

### 8. Skills/Stack Section

- **Talent**:
  - Header: text-[12px], gap-[12px], mt-[20px]
  - Pills: px-[10px] py-[6px], text-[11px], bg-[#F5F5F5]
  - Gap between pills: gap-[6px]
- **Recruiter**: N/A (no skills section)
- **Mentor**:
  - Header: text-[12px], gap-[12px]
  - Pills: px-[10px] py-[7px], text-[11px], bg-[#F5F5F5]
  - Gap between pills: gap-[6px]
  - ❌ INCONSISTENT (py-[7px] vs py-[6px])

### 9. Social Links Section

- **Talent**:
  - Header: text-[12px], gap-[12px], mt-[20px]
  - Items: gap-[10px], text-[12px]
  - Icon: w-[18px] h-[18px]
- **Recruiter**:
  - Header: text-[12px], gap-[12px], mt-[20px]
  - Items: gap-[10px], text-[12px]
  - Icon: w-[16px] h-[16px] ❌ INCONSISTENT
- **Mentor**:
  - Header: text-[11px], gap-4
  - Items: gap-2, text-[13px]
  - Icon: w-[18px] h-[18px]
  - ❌ INCONSISTENT (header size, gaps, text size)

### 10. Tab Navigation

- **Talent**: Custom component (TalentProfileNav)
- **Recruiter**:
  - Padding: px-[12px] sm:px-[20px] py-[14px] sm:py-[18px]
  - Font: text-[12px] sm:text-[13px]
  - Border: h-[2px]
- **Mentor**: No tabs (single page view)
- ❌ INCONSISTENT (need to verify Talent tabs match Recruiter)

### 11. Content Padding

- **Talent**: p-3 md:p-4 lg:p-5
- **Recruiter**: p-3 md:p-4 lg:p-5
- **Mentor**: N/A (different structure)
- ✓ CONSISTENT (where applicable)

### 12. Section Headers in Content

- **Talent**: text-lg font-semibold
- **Recruiter**: text-lg font-semibold
- **Mentor**: N/A
- ✓ CONSISTENT

### 13. Detail Cards/Boxes

- **Talent**: px-3 py-2.5, rounded-[8px], border border-[#E1E4EA]
- **Recruiter**: px-3 py-2.5, rounded-[8px], border border-[#E1E4EA]
- **Mentor**: N/A
- ✓ CONSISTENT

## Design System Standards (To Be Applied)

### Typography

- **Profile Name**: text-[16px] font-medium font-inter-tight
- **Subtitle/Headline**: text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight
- **Detail Items**: text-[12px] font-normal font-inter-tight
- **Section Headers (Sidebar)**: text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight
- **Section Headers (Content)**: text-lg font-semibold font-inter-tight
- **Button Text**: text-[14px] font-normal font-inter-tight
- **Skill/Stack Pills**: text-[11px] font-normal font-inter-tight

### Spacing

- **Sidebar Width**: w-[350px] (desktop)
- **Sidebar Padding**: px-[25px] py-[15px]
- **Profile Image Size**: w-[110px] h-[110px]
- **Profile Section Gap**: gap-[20px]
- **Info Container Gap**: gap-[12px]
- **Details Container Gap**: gap-[10px]
- **Detail Item Gap**: gap-[6px]
- **Section Margin Top**: mt-[20px]
- **Section Internal Gap**: gap-[12px]
- **Skill/Stack Pills**: px-[10px] py-[6px], gap-[6px]
- **Social Links Items**: gap-[10px]

### Colors

- **Primary Button BG**: bg-[#181B25]
- **Primary Button Hover**: hover:bg-[#2a2f3a]
- **Border**: border-[#E1E4EA]
- **Icon Color**: text-[#525866]
- **Pill Background**: bg-[#F5F5F5]
- **Text Primary**: text-black
- **Text Secondary**: text-[rgba(0,0,0,0.30)]

### Borders & Radius

- **Border Width**: 1px (border)
- **Border Color**: border-[#E1E4EA]
- **Button Radius**: rounded-full
- **Card Radius**: rounded-[8px]
- **Pill Radius**: rounded-full

### Icons

- **Standard Icon Size**: w-[18px] h-[18px]
- **Stack Icon Size**: w-[16px] h-[16px] (for tool logos)

### Buttons

- **Primary Action Button**: h-[44px], rounded-full, text-[14px]
- **Button Margin**: mt-[20px]

## Requirements

### R1: Profile Image Standardization

All profile images must be 110px × 110px, rounded-full, with consistent object-cover styling.

### R2: Sidebar Layout Consistency

All sidebars must use:

- Width: w-[350px] on desktop
- Padding: px-[25px] py-[15px]
- Overflow: overflow-y-auto scrollbar-hide

### R3: Typography Consistency

All text elements must follow the design system standards defined above.

### R4: Spacing Consistency

All spacing (gaps, margins, padding) must follow the design system standards.

### R5: Color Consistency

All colors must use the standardized palette, especially:

- Primary button: bg-[#181B25]
- Borders: border-[#E1E4EA]

### R6: Skills/Stack Section Consistency

- Header: text-[12px], mt-[20px], gap-[12px]
- Pills: px-[10px] py-[6px], text-[11px], gap-[6px]
- Show first 5 items + count

### R7: Social Links Section Consistency

- Header: text-[12px], mt-[20px], gap-[12px]
- Items: gap-[10px], text-[12px]
- Icons: w-[18px] h-[18px]
- External link icon: w-[18px] h-[18px]

### R8: Tab Navigation Consistency

Where tabs exist, they must use:

- Padding: px-[12px] sm:px-[20px] py-[14px] sm:py-[18px]
- Font: text-[12px] sm:text-[13px] font-medium
- Active indicator: h-[2px] bg-black

### R9: Button Consistency

All primary action buttons must use:

- Height: h-[44px]
- Margin: mt-[20px]
- Radius: rounded-full
- Background: bg-[#181B25]
- Hover: hover:bg-[#2a2f3a]
- Text: text-[14px] font-normal

### R10: Icon Consistency

- Detail icons: w-[18px] h-[18px]
- Social link icons: w-[18px] h-[18px]
- Stack tool icons: w-[16px] h-[16px]

## Success Criteria

1. All three profile pages use identical spacing, typography, and color values
2. Visual inspection shows no discernible differences in layout structure
3. All measurements match the design system standards
4. Code review shows consistent class names and values across all three pages
5. Mobile and desktop views maintain consistency across all pages

## Out of Scope

- Content structure changes (tabs, sections unique to each profile type)
- Functional behavior changes
- API or data structure changes
- New features or capabilities
