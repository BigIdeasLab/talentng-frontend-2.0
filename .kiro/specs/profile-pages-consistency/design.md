# Profile Pages Consistency Design

## Design Approach

This design document outlines the specific changes needed to standardize all profile detail pages (Talent, Recruiter, Mentor) to achieve complete visual and functional consistency.

## Component Structure

### Standard Profile Page Layout

```
┌─────────────────────────────────────────────────────────┐
│ Header (px-5 py-3, border-b)                           │
│ - Title (text-[14px])                                  │
│ - Back Button (px-4 py-1.5, text-[11px])              │
├──────────────┬──────────────────────────────────────────┤
│              │                                          │
│   Sidebar    │         Main Content                     │
│   350px      │                                          │
│              │   ┌──────────────────────────────────┐  │
│   Profile    │   │ Tab Navigation (if applicable)   │  │
│   Image      │   └──────────────────────────────────┘  │
│   110×110    │                                          │
│              │   Content Area                           │
│   Details    │   (scrollable)                           │
│              │                                          │
│   Button     │                                          │
│   44px       │                                          │
│              │                                          │
│   Skills     │                                          │
│              │                                          │
│   Stack      │                                          │
│              │                                          │
│   Social     │                                          │
│              │                                          │
└──────────────┴──────────────────────────────────────────┘
```

## Design Tokens

### Spacing Scale

```typescript
const spacing = {
  sidebarWidth: "w-[350px]",
  sidebarPadding: "px-[25px] py-[15px]",
  profileImageSize: "w-[110px] h-[110px]",
  profileSectionGap: "gap-[20px]",
  infoContainerGap: "gap-[12px]",
  detailsContainerGap: "gap-[10px]",
  detailItemGap: "gap-[6px]",
  sectionMarginTop: "mt-[20px]",
  sectionInternalGap: "gap-[12px]",
  skillPillPadding: "px-[10px] py-[6px]",
  skillPillGap: "gap-[6px]",
  socialLinksGap: "gap-[10px]",
  iconSize: "w-[18px] h-[18px]",
  stackIconSize: "w-[16px] h-[16px]",
  buttonHeight: "h-[44px]",
  buttonMargin: "mt-[20px]",
};
```

### Typography Scale

```typescript
const typography = {
  profileName: "text-[16px] font-medium font-inter-tight",
  subtitle: "text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight",
  detailItem: "text-[12px] font-normal font-inter-tight",
  sectionHeader:
    "text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight",
  contentHeader: "text-lg font-semibold font-inter-tight",
  buttonText: "text-[14px] font-normal font-inter-tight",
  pillText: "text-[11px] font-normal font-inter-tight",
  tabText: "text-[12px] sm:text-[13px] font-medium font-inter-tight",
};
```

### Color Palette

```typescript
const colors = {
  primaryButton: "bg-[#181B25]",
  primaryButtonHover: "hover:bg-[#2a2f3a]",
  border: "border-[#E1E4EA]",
  iconColor: "text-[#525866]",
  pillBackground: "bg-[#F5F5F5]",
  textPrimary: "text-black",
  textSecondary: "text-[rgba(0,0,0,0.30)]",
  white: "bg-white",
};
```

### Border & Radius

```typescript
const borders = {
  standard: "border border-[#E1E4EA]",
  buttonRadius: "rounded-full",
  cardRadius: "rounded-[8px]",
  pillRadius: "rounded-full",
  imageRadius: "rounded-full",
};
```

## Specific Changes by Component

### 1. Mentor Profile Page (`app/(business)/mentorship/[id]/page.tsx`)

#### Changes to Sidebar

```typescript
// BEFORE
<div className="w-full lg:w-[350px] flex-shrink-0 lg:border-r border-[#E1E4EA] bg-white flex flex-col lg:overflow-hidden">
  <div className="flex-1 lg:overflow-y-auto scrollbar-hidden px-4 py-7">

// AFTER
<div className="w-full lg:w-[350px] flex-shrink-0 lg:border-r border-[#E1E4EA] bg-white flex flex-col lg:overflow-hidden">
  <div className="flex-1 lg:overflow-y-auto scrollbar-hidden px-[25px] py-[15px]">
```

#### Changes to Profile Image

```typescript
// BEFORE
<div className="relative w-[90px] h-[90px] flex-shrink-0">

// AFTER
<div className="relative w-[110px] h-[110px] flex-shrink-0">
```

#### Changes to Subtitle

```typescript
// BEFORE
<p className="text-[14px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight text-center">

// AFTER
<p className="text-[13px] font-light text-[rgba(0,0,0,0.30)] font-inter-tight text-center">
```

#### Changes to Detail Items

```typescript
// BEFORE
<span className="text-[13px] font-normal text-black font-inter-tight">

// AFTER
<span className="text-[12px] font-normal text-black font-inter-tight">
```

#### Changes to Stack Pills

```typescript
// BEFORE
className =
  "px-[10px] py-[7px] rounded-full bg-[#F5F5F5] flex items-center gap-[5px]";

// AFTER
className =
  "px-[10px] py-[6px] rounded-full bg-[#F5F5F5] flex items-center gap-[5px]";
```

#### Changes to Social Links Header

```typescript
// BEFORE
<h3 className="text-[11px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">

// AFTER
<h3 className="text-[12px] font-normal text-[rgba(0,0,0,0.30)] font-inter-tight">
```

#### Changes to Social Links Items

```typescript
// BEFORE
<div className="flex flex-col gap-2 w-full">
  ...
  <span className="text-[13px] font-normal text-black font-inter-tight">

// AFTER
<div className="flex flex-col gap-[10px] w-full">
  ...
  <span className="text-[12px] font-normal text-black font-inter-tight">
```

#### Changes to Social Links Section Margin

```typescript
// BEFORE
<div className="flex flex-col items-start gap-4 w-full">

// AFTER
<div className="mt-[20px] flex flex-col items-start gap-[12px] flex-shrink-0">
```

### 2. Talent Profile Panel (`components/employer/talent-profile/components/TalentProfilePanel.tsx`)

#### Changes to Button Background

```typescript
// BEFORE
className =
  "w-full mt-[20px] px-6 py-3 min-h-[44px] rounded-full bg-[#1A1D2E] hover:bg-[#252A3E]";

// AFTER
className =
  "w-full mt-[20px] px-6 py-3 min-h-[44px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a]";
```

### 3. Recruiter Profile Page (`app/(business)/recruiter/[id]/page.tsx`)

#### Changes to Social Link Icons

```typescript
// BEFORE (inline SVG icons with width="16" height="16")
<svg width="16" height="16" viewBox="0 0 16 16" fill="none">

// AFTER
<svg width="18" height="18" viewBox="0 0 22 22" fill="none">
```

Note: This requires updating the SVG viewBox and paths to match the 18×18 size used in other profiles.

#### Changes to Button Margin

```typescript
// BEFORE
className =
  "w-full h-[44px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a] text-white font-normal text-[14px] font-inter-tight transition-colors flex-shrink-0 mt-[15px]";

// AFTER
className =
  "w-full h-[44px] rounded-full bg-[#181B25] hover:bg-[#2a2f3a] text-white font-normal text-[14px] font-inter-tight transition-colors flex-shrink-0 mt-[20px]";
```

### 4. Talent Profile Nav Component

Need to verify that `TalentProfileNav` matches the tab styling of the Recruiter profile:

- Padding: px-[12px] sm:px-[20px] py-[14px] sm:py-[18px]
- Font: text-[12px] sm:text-[13px] font-medium
- Active indicator: h-[2px] bg-black

## Implementation Strategy

### Phase 1: Mentor Profile Standardization

1. Update sidebar padding from px-4 py-7 to px-[25px] py-[15px]
2. Update profile image from 90px to 110px
3. Update subtitle from text-[14px] to text-[13px]
4. Update detail items from text-[13px] to text-[12px]
5. Update stack pills from py-[7px] to py-[6px]
6. Update social links header from text-[11px] to text-[12px]
7. Update social links items from text-[13px] to text-[12px]
8. Update social links gaps from gap-2/gap-4 to gap-[10px]/gap-[12px]
9. Add mt-[20px] to social links section

### Phase 2: Talent Profile Standardization

1. Update button background from bg-[#1A1D2E] to bg-[#181B25]
2. Update button hover from hover:bg-[#252A3E] to hover:bg-[#2a2f3a]
3. Verify all other values match standards

### Phase 3: Recruiter Profile Standardization

1. Update social link icons from 16×16 to 18×18
2. Update button margin from mt-[15px] to mt-[20px]
3. Verify all other values match standards

### Phase 4: Tab Navigation Verification

1. Read TalentProfileNav component
2. Compare with Recruiter tab styling
3. Standardize if needed

## Testing Checklist

### Visual Regression Testing

- [ ] Profile images are all 110×110px
- [ ] Sidebar widths are all 350px
- [ ] Sidebar padding is consistent
- [ ] All fonts match design tokens
- [ ] All spacing matches design tokens
- [ ] All colors match design tokens
- [ ] Skills/Stack pills are identical
- [ ] Social links sections are identical
- [ ] Buttons are identical
- [ ] Icons are all 18×18px (except stack icons at 16×16px)

### Responsive Testing

- [ ] Mobile view consistency
- [ ] Tablet view consistency
- [ ] Desktop view consistency
- [ ] Sidebar collapse behavior

### Cross-Browser Testing

- [ ] Chrome
- [ ] Firefox
- [ ] Safari
- [ ] Edge

## Accessibility Considerations

All changes maintain existing accessibility features:

- Touch targets remain 44px minimum
- Color contrast ratios unchanged
- Keyboard navigation unaffected
- Screen reader compatibility maintained

## Performance Impact

No performance impact expected:

- No new components added
- No additional API calls
- Only CSS class changes
- No JavaScript logic changes
