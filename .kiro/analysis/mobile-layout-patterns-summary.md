# Mobile Layout Patterns - Talent Pages Analysis

## Overview

This document summarizes the mobile layout patterns established across talent pages that should be applied consistently to recruiter and mentor roles.

## Core Pattern: Single Smooth Scroll

### Container Structure

```tsx
<div className="flex flex-col h-[calc(100vh-60px)] md:h-screen overflow-x-hidden bg-white">
```

**Key Points:**

- Mobile: `h-[calc(100vh-60px)]` - accounts for 60px mobile header
- Desktop: `md:h-screen` - full viewport height
- `overflow-x-hidden` - prevents horizontal scroll
- `bg-white` - consistent background

## Desktop Layout Pattern

### Static Header

```tsx
<div className="hidden md:block w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
  {/* Title, search, filters, tabs */}
</div>
```

### Scrollable Content

```tsx
<div className="hidden md:block flex-1 overflow-hidden">
  {/* Grid/list with internal scroll */}
</div>
```

## Mobile Layout Pattern

### Simple Scrollable Container

```tsx
<div className="md:hidden flex-1 overflow-y-auto">
  {/* All content scrolls together */}
</div>
```

### Header Section (Scrolls with content)

```tsx
<div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA]">
  <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px] mb-[19px]">
    Page Title
  </h1>

  {/* Search and Filter Row */}
  <div className="flex items-center gap-[8px]">
    <div className="flex-1">
      <SearchInput {...} />
    </div>
    <div className="relative flex-shrink-0">
      <button onClick={() => setIsFilterOpen(true)}>
        {/* Filter button with badge */}
      </button>
    </div>
  </div>
</div>
```

### Sticky Tabs (When applicable)

```tsx
<div className="sticky top-0 z-10 w-full px-[25px] py-[12px] bg-white border-b border-[#E1E4EA]">
  {/* Filter tabs or category tabs */}
</div>
```

**Key Points:**

- `sticky top-0` - sticks to top when scrolling
- `z-10` - stays above content
- `bg-white` - required for sticky to work visually
- `border-b` - visual separation

### Content Section

```tsx
<div>
  {/* Grid/list content */}
  {/* Pagination at bottom (naturally accessible) */}
</div>
```

## Pages Analyzed

### ✅ Opportunities Page

- **Pattern**: Single scroll with sticky tabs
- **Features**: Search, filter modal, category tabs, pagination
- **Mobile**: Header scrolls, tabs stick, smooth scroll to pagination

### ✅ Mentorship Page

- **Pattern**: Single scroll with sticky category tabs
- **Features**: Search, filter modal, category tabs, pagination
- **Mobile**: Header scrolls, tabs stick, smooth scroll to pagination

### ✅ Calendar Page

- **Pattern**: Single scroll with filter tabs
- **Features**: Search, date range filters, type tabs, pagination
- **Mobile**: All filters in header, smooth scroll to pagination

### ✅ Applications Page (Mentor)

- **Pattern**: Single scroll with status tabs
- **Features**: Search, date range filters, status tabs
- **Mobile**: Header scrolls, tabs in header, smooth scroll

### ✅ Applicants Page (Recruiter)

- **Pattern**: Single scroll with status tabs
- **Features**: Search, filter modal, sort, status tabs, table view
- **Mobile**: Header scrolls, tabs in header, smooth scroll

### ✅ Sessions Page (Mentor)

- **Pattern**: Single scroll with status tabs
- **Features**: Search, date range filters, status tabs
- **Mobile**: Header scrolls, tabs in header, smooth scroll

## Common Components

### Search Input

- Debounced (400-500ms)
- Loading indicator
- Placeholder text
- Full width on mobile

### Filter Button

- Icon + "Filter" text
- Badge count when filters applied
- Opens full-screen modal on mobile
- Highlighted when active: `bg-[#8463FF0D] border border-[#8463FF] text-[#8463FF]`

### Filter Modal

- Full-screen on mobile
- Slide-up animation
- Apply/Clear buttons
- Preserves state

### Date Range Filters

- Horizontal scrollable pills
- Options: All Time, Today, This Week, This Month
- Active state: `bg-[#8463FF0D] border-[#8463FF] text-[#8463FF]`

### Tabs

- Horizontal scrollable
- Active state: `border-b-2 border-black`
- Inactive: `text-black/30`
- Min height on mobile: `min-h-[44px]` for touch targets

### Pagination

- Fixed at bottom of content
- Previous/Next buttons
- Page indicator
- Scroll to top on page change (mobile)

## Grid Components Pattern

### Desktop

```tsx
<div className="flex-1 md:overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
  {/* Grid content */}
</div>
```

### Mobile

```tsx
{
  /* Relies on parent scroll - no overflow-y-auto */
}
<div className="px-[25px] py-[16px]">{/* Grid content */}</div>;
```

## Anti-Patterns (Removed)

### ❌ MobileProgressiveHeader

- Created nested scroll containers
- Caused janky scroll behavior
- Required "pull up extra" to reach pagination
- **Solution**: Removed, use simple single-scroll layout

### ❌ Nested Overflow Containers

- Multiple `overflow-y-auto` in hierarchy
- Conflicting scroll contexts
- **Solution**: Single scroll container at page level

### ❌ Fixed Heights on Mobile

- `h-screen` without accounting for header
- Cut off pagination
- **Solution**: `h-[calc(100vh-60px)]` on mobile

## Implementation Checklist

When implementing mobile layout for a page:

- [ ] Container: `h-[calc(100vh-60px)] md:h-screen`
- [ ] Desktop: Static header + scrollable content
- [ ] Mobile: Single `overflow-y-auto` container
- [ ] Header: Scrolls with content (not fixed)
- [ ] Tabs: `sticky top-0 z-10 bg-white` (if applicable)
- [ ] Search: Full width, debounced
- [ ] Filter: Button with badge, full-screen modal
- [ ] Pagination: At bottom of content, naturally accessible
- [ ] Grid: `md:overflow-y-auto` only (desktop), no overflow on mobile
- [ ] Touch targets: `min-h-[44px]` on mobile buttons
- [ ] Scroll to top: On pagination clicks (mobile)

## Pages Needing Updates

All pages have been updated to follow the mobile layout patterns! ✅

### Completed Updates

**Recruiter Role:**

- ✅ Opportunities page (shared with talent)
- ✅ Discover Talent page (shared with talent)
- ✅ Applicants page
- ✅ Interviews page (RecruiterUpcoming)
- ✅ Dashboard (EmployerDashboard)

**Mentor Role:**

- ✅ Applications page
- ✅ Sessions page
- ✅ Dashboard (MentorDashboard)
- ✅ Mentorship page (shared with talent)

**Talent Role:**

- ✅ Opportunities page
- ✅ Mentorship page
- ✅ Calendar page
- ✅ My Applications page
- ✅ Discover Talent page (shared)

## Testing Checklist

For each page:

- [ ] Mobile header visible on load
- [ ] Smooth scroll from top to pagination
- [ ] Tabs stick correctly (if applicable)
- [ ] No nested scroll containers
- [ ] No "pull up extra" needed
- [ ] Filter modal full-screen
- [ ] Touch targets 44px minimum
- [ ] Desktop layout unchanged
- [ ] Pagination accessible
- [ ] Scroll to top works on page change

## Notes

- The mobile header in layout is now `sticky top-0` (fixed in layout-client.tsx)
- All pages should account for 60px mobile header height
- Consistent spacing: `px-[25px]` for content padding
- Consistent borders: `border-[#E1E4EA]`
- Consistent text sizes: `text-[16px]` for titles, `text-[13px]` for body
