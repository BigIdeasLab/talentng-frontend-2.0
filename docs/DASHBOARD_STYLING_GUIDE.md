# Dashboard Page - Complete Styling Guide

## Overview
This document provides exact styling specifications for the TalentNG Admin Dashboard page, including all components, colors, spacing, typography, and responsive behavior.

---

## Page Layout

### Container
```css
Padding: px-3 py-4 (mobile) | px-5 py-5 (desktop)
Display: flex flex-col
Gap: 16px (gap-4)
Height: h-full
Overflow: overflow-y-auto
```

### Structure
```
┌─────────────────────────────────────────┐
│  Welcome Header Card                    │
├─────────────────────────────────────────┤
│  Stats Grid (8 cards)                   │
├─────────────────────────────────────────┤
│  ┌──────────────────┬─────────────────┐ │
│  │  Trend Charts    │  Activity Feed  │ │
│  │  (2/3 width)     │  (1/3 width)    │ │
│  └──────────────────┴─────────────────┘ │
└─────────────────────────────────────────┘
```

---

## 1. Welcome Header Card

### Container Styling
```css
Width: w-full
Border Radius: rounded-2xl (16px)
Border: 1px solid #E1E4EA
Background: white
Padding: p-4 (mobile) | p-6 (desktop)
Flex Shrink: flex-shrink-0
```

### Content Structure
```tsx
<div className="w-full rounded-2xl border border-[#E1E4EA] bg-white p-4 md:p-6 flex-shrink-0">
  {/* Greeting */}
  <p className="text-[#525866] text-[11px] font-inter-tight mb-2">
    Good morning! {/* Dynamic: Good morning/afternoon/evening */}
  </p>
  
  {/* Title */}
  <h1 className="text-[#111827] text-[18px] font-inter-tight font-bold mb-2">
    Admin Dashboard
  </h1>
  
  {/* Description */}
  <p className="text-[#525866] text-[13px] font-inter-tight">
    Monitor platform activity and manage users, opportunities, and applications.
  </p>
</div>
```

### Typography
| Element | Font Size | Weight | Color | Font Family |
|---------|-----------|--------|-------|-------------|
| Greeting | 11px | normal | #525866 | Inter Tight |
| Title | 18px | bold | #111827 | Inter Tight |
| Description | 13px | normal | #525866 | Inter Tight |

---

## 2. Stats Grid

### Grid Layout
```css
Display: grid
Columns: 
  - Mobile: 1 column (grid-cols-1)
  - Small: 2 columns (sm:grid-cols-2)
  - Large: 4 columns (lg:grid-cols-4)
Gap: 12px (gap-3)
Flex Shrink: flex-shrink-0
```

### Stat Card Styling
```css
Display: flex flex-col
Justify: justify-center
Gap: 12px (gap-3)
Padding: 16px (p-4)
Border Radius: rounded-2xl (16px)
Border: 1px solid #E1E4EA
Background: white
Hover Border: #2563EB
Transition: transition-colors
```

### Stat Card Structure
```tsx
<div className="flex flex-col justify-center gap-3 p-4 rounded-2xl border border-[#E1E4EA] bg-white hover:border-[#2563EB] transition-colors">
  {/* Top Row */}
  <div className="flex justify-between items-center">
    {/* Left: Text */}
    <div className="flex flex-col gap-2">
      <h3 className="text-[#525866] text-[11px] font-medium font-inter-tight uppercase tracking-wide">
        TOTAL USERS
      </h3>
      <p className="text-[20px] md:text-[24px] font-bold font-inter-tight text-[#111827]">
        1,234
      </p>
    </div>
    
    {/* Right: Icon */}
    <div className="w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full bg-[#DBEAFE] flex items-center justify-center">
      <Users className="w-5 h-5 text-[#2563EB]" />
    </div>
  </div>
  
  {/* Bottom: Subtitle */}
  <p className="text-[#525866] text-[11px] font-medium font-inter-tight">
    15 new this week
  </p>
</div>
```

### Stat Card Typography
| Element | Font Size | Weight | Color | Transform |
|---------|-----------|--------|-------|-----------|
| Title | 11px | medium | #525866 | uppercase |
| Value | 20px (mobile) / 24px (desktop) | bold | #111827 | - |
| Subtitle | 11px | medium | #525866 | - |

### Icon Configurations
Each stat card has a unique icon with specific colors:

| Stat | Icon | Background | Icon Color |
|------|------|------------|------------|
| Total Users | Users | #DBEAFE | #2563EB |
| Active Users | TrendingUp | #D1FAE5 | #059669 |
| Opportunities | Briefcase | #EDE9FE | #7C3AED |
| Applications | FileText | #FEF3C7 | #D97706 |
| Talents | Target | #E0E7FF | #4F46E5 |
| Recruiters | Briefcase | #FCE7F3 | #DB2777 |
| Mentors | GraduationCap | #CCFBF1 | #0D9488 |
| Mentorship Sessions | Calendar | #CFFAFE | #0891B2 |

### Icon Sizing
```css
Container: 
  - Mobile: 36px × 36px
  - Desktop: 40px × 40px
  - Border Radius: rounded-full
Icon: 20px × 20px (w-5 h-5)
```

---

## 3. Trend Charts Component

### Container Styling
```css
Background: white
Border Radius: rounded-2xl (16px)
Border: 1px solid #E1E4EA
Padding: 20px (mobile) | 24px (desktop)
```

### Header Section
```tsx
<div className="flex items-center justify-between mb-4">
  {/* Title */}
  <h3 className="text-[16px] font-bold font-inter-tight text-[#111827]">
    Activity Trends
  </h3>
  
  {/* Period Buttons */}
  <div className="flex gap-1">
    <button className="px-4 py-1.5 text-[11px] font-semibold font-inter-tight rounded-[50px] bg-[#2563EB] text-white">
      7D
    </button>
    <button className="px-4 py-1.5 text-[11px] font-semibold font-inter-tight rounded-[50px] bg-white border border-[#E1E4EA] text-[#525866] hover:border-[#2563EB]">
      30D
    </button>
    <button className="px-4 py-1.5 text-[11px] font-semibold font-inter-tight rounded-[50px] bg-white border border-[#E1E4EA] text-[#525866] hover:border-[#2563EB]">
      90D
    </button>
  </div>
</div>
```

### Period Button States
| State | Background | Border | Text Color | Hover |
|-------|------------|--------|------------|-------|
| Active | #2563EB | none | white | - |
| Inactive | white | 1px #E1E4EA | #525866 | border: #2563EB |

### Metric Tabs
```tsx
<div className="flex gap-2 mb-5">
  <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium font-inter-tight rounded-[50px] bg-[#2563EB] text-white">
    <span className="text-[13px]">👤</span>
    Users
  </button>
  <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium font-inter-tight rounded-[50px] bg-white border border-[#E1E4EA] text-[#525866] hover:border-[#2563EB]">
    <span className="text-[13px]">💼</span>
    Opportunities
  </button>
  <button className="flex items-center gap-1.5 px-4 py-2 text-[13px] font-medium font-inter-tight rounded-[50px] bg-white border border-[#E1E4EA] text-[#525866] hover:border-[#2563EB]">
    <span className="text-[13px]">📄</span>
    Applications
  </button>
</div>
```

### Metric Tab States
| State | Background | Border | Text Color | Icon Size |
|-------|------------|--------|------------|-----------|
| Active | #2563EB | none | white | 13px |
| Inactive | white | 1px #E1E4EA | #525866 | 13px |

### Metric Colors
| Metric | Primary Color | Gradient Start | Gradient End |
|--------|---------------|----------------|--------------|
| Users | #2563EB | #2563EB | #93C5FD |
| Opportunities | #7C3AED | #7C3AED | #C4B5FD |
| Applications | #059669 | #059669 | #6EE7B7 |

### Summary Stats Row
```tsx
<div className="flex gap-4 mb-5">
  {/* Total */}
  <div className="flex flex-col">
    <span className="text-[11px] text-[#525866] font-inter-tight font-medium uppercase tracking-wide">
      Total
    </span>
    <span className="text-[18px] font-bold font-inter-tight text-[#111827]">
      1,234
    </span>
  </div>
  
  {/* Divider */}
  <div className="w-px bg-[#E1E4EA]" />
  
  {/* Avg / Day */}
  <div className="flex flex-col">
    <span className="text-[11px] text-[#525866] font-inter-tight font-medium uppercase tracking-wide">
      Avg / Day
    </span>
    <span className="text-[18px] font-bold font-inter-tight text-[#111827]">
      176
    </span>
  </div>
  
  {/* Divider */}
  <div className="w-px bg-[#E1E4EA]" />
  
  {/* Trend */}
  <div className="flex flex-col">
    <span className="text-[11px] text-[#525866] font-inter-tight font-medium uppercase tracking-wide">
      Trend
    </span>
    <span className="text-[18px] font-bold font-inter-tight text-emerald-600">
      +12%
    </span>
  </div>
</div>
```

### Summary Stats Typography
| Element | Font Size | Weight | Color | Transform |
|---------|-----------|--------|-------|-----------|
| Label | 11px | medium | #525866 | uppercase |
| Value | 18px | bold | #111827 | - |
| Trend (positive) | 18px | bold | #059669 | - |
| Trend (negative) | 18px | bold | #EF4444 | - |
| Trend (neutral) | 18px | bold | #525866 | - |

### Chart Area
```css
Height: 224px (h-56)
Width: 100%
Margin: { top: 4, right: 4, left: -20, bottom: 0 }
```

### Chart Styling
```css
Grid:
  - Stroke: #F3F4F6
  - Dash Array: 3 3
  - Vertical: false

X-Axis:
  - Font Size: 10px
  - Color: #9CA3AF
  - Font Family: Inter Tight
  - Axis Line: false
  - Tick Line: false
  - Offset Y: 8px

Y-Axis:
  - Font Size: 10px
  - Color: #9CA3AF
  - Font Family: Inter Tight
  - Axis Line: false
  - Tick Line: false
  - Offset X: -4px

Area:
  - Stroke Width: 2px
  - Type: monotone
  - Gradient: 20% opacity at top, 2% at bottom
  - Dot Radius: 3px (if ≤14 points)
  - Active Dot Radius: 5px
  - Dot Stroke: white, 2px
```

### Tooltip Styling
```css
Background: #1E293B
Text Color: white
Padding: 8px 12px (px-3 py-2)
Border Radius: 8px (rounded-lg)
Shadow: shadow-lg
Font Size: 12px
Font Family: Inter Tight

Label Color: #94A3B8
Value Font Size: 14px
Value Font Weight: semibold
```

---

## 4. Activity Feed Component

### Container Styling
```css
Background: white
Border Radius: rounded-2xl (16px)
Border: 1px solid #E1E4EA
Padding: 16px (mobile) | 24px (desktop)
```

### Header
```tsx
<h3 className="text-[16px] font-bold font-inter-tight text-[#111827] mb-4">
  Recent Activity
</h3>
```

### Activity List
```css
Display: flex flex-col
Gap: 12px (gap-3)
Max Height: 400px
Overflow Y: auto
Padding Right: 4px (pr-1)
```

### Activity Item
```tsx
<div className="flex items-start gap-3 p-3 rounded-lg border border-[#E1E4EA] hover:border-[#2563EB] transition-colors">
  {/* Icon */}
  <div className="w-10 h-10 rounded-lg flex items-center justify-center text-lg flex-shrink-0" style={{ backgroundColor: '#DBEAFE' }}>
    👤
  </div>
  
  {/* Content */}
  <div className="flex-1 min-w-0">
    <p className="text-[13px] font-inter-tight text-[#111827]">
      <span className="font-semibold">John Doe</span>
      <span className="text-[#525866]"> registered as a talent</span>
    </p>
    <p className="text-[11px] text-[#525866] font-inter-tight mt-1">
      2h ago
    </p>
  </div>
</div>
```

### Activity Item Styling
```css
Container:
  - Padding: 12px (p-3)
  - Border Radius: 8px (rounded-lg)
  - Border: 1px solid #E1E4EA
  - Hover Border: #2563EB
  - Transition: transition-colors

Icon Container:
  - Size: 40px × 40px
  - Border Radius: 8px (rounded-lg)
  - Font Size: 18px (text-lg)
  - Flex Shrink: 0
```

### Activity Icon Backgrounds
| Activity Type | Icon | Background | Color |
|---------------|------|------------|-------|
| user_registered | 👤 | #DBEAFE | #2563EB |
| opportunity_posted | 💼 | #DBEAFE | #2563EB |
| application_submitted | 📝 | #DBEAFE | #2563EB |
| session_booked | 📅 | #DBEAFE | #2563EB |
| review_submitted | ⭐ | #FEF3C7 | #F59E0B |
| default | 📌 | #F5F5F5 | #606060 |

### Activity Typography
| Element | Font Size | Weight | Color |
|---------|-----------|--------|-------|
| User Name | 13px | semibold | #111827 |
| Description | 13px | normal | #525866 |
| Timestamp | 11px | normal | #525866 |

### Empty State
```tsx
<div className="py-8 text-center">
  <p className="text-[13px] text-[#525866] font-inter-tight">
    No recent activity
  </p>
</div>
```

---

## 5. Responsive Layout

### Grid Breakpoints
```css
Mobile (< 640px):
  - Stats: 1 column
  - Charts/Activity: stacked (1 column)

Small (640px - 1023px):
  - Stats: 2 columns
  - Charts/Activity: stacked (1 column)

Large (≥ 1024px):
  - Stats: 4 columns
  - Charts: 2/3 width (lg:col-span-2)
  - Activity: 1/3 width (1 column)
```

### Padding Adjustments
| Element | Mobile | Desktop |
|---------|--------|---------|
| Page Container | px-3 py-4 | px-5 py-5 |
| Welcome Card | p-4 | p-6 |
| Stat Cards | p-4 | p-4 |
| Trend Charts | p-5 | p-6 |
| Activity Feed | p-4 | p-6 |

---

## 6. Loading States

### Stat Card Skeleton
```tsx
<div className="flex flex-col justify-center gap-3 p-4 rounded-2xl border border-[#E1E4EA] bg-white animate-pulse">
  <div className="flex justify-between items-center">
    <div className="flex flex-col gap-2 flex-1">
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-3/4"></div>
    </div>
    <div className="w-[40px] h-[40px] rounded-full bg-gray-200"></div>
  </div>
  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
</div>
```

### Chart Skeleton
```tsx
<div className="bg-white rounded-2xl border border-[#E1E4EA] p-5 md:p-6">
  <div className="flex items-center justify-between mb-5">
    <div className="h-5 bg-gray-200 rounded-md w-36 animate-pulse" />
    <div className="flex gap-1">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-7 bg-gray-200 rounded-[50px] w-10 animate-pulse" />
      ))}
    </div>
  </div>
  <div className="flex gap-2 mb-5">
    {[...Array(3)].map((_, i) => (
      <div key={i} className="h-8 bg-gray-100 rounded-[50px] w-28 animate-pulse" />
    ))}
  </div>
  <div className="h-56 bg-gray-50 rounded-lg animate-pulse" />
</div>
```

### Activity Feed Skeleton
```tsx
<div className="flex items-start gap-3 animate-pulse">
  <div className="w-10 h-10 bg-gray-200 rounded-lg"></div>
  <div className="flex-1">
    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
  </div>
</div>
```

---

## 7. Color Palette

### Primary Colors
```css
Primary Blue: #2563EB
Primary Blue Light: #DBEAFE
Primary Blue Lighter: #93C5FD
```

### Text Colors
```css
Heading: #111827
Body: #525866
Muted: #9CA3AF
```

### Border Colors
```css
Default: #E1E4EA
Hover: #2563EB
Grid: #F3F4F6
```

### Background Colors
```css
White: #FFFFFF
Light Gray: #F9FAFB
Gray 50: #F5F5F5
```

### Status Colors
```css
Success/Positive: #059669
Success Light: #D1FAE5
Warning: #F59E0B
Warning Light: #FEF3C7
Error/Negative: #EF4444
```

### Stat Icon Colors
```css
Blue: #2563EB / #DBEAFE
Green: #059669 / #D1FAE5
Purple: #7C3AED / #EDE9FE
Amber: #D97706 / #FEF3C7
Indigo: #4F46E5 / #E0E7FF
Pink: #DB2777 / #FCE7F3
Teal: #0D9488 / #CCFBF1
Cyan: #0891B2 / #CFFAFE
```

---

## 8. Typography System

### Font Family
```css
Primary: Inter Tight (font-inter-tight)
Fallback: system-ui, -apple-system, sans-serif
```

### Font Sizes
| Size | Pixels | Usage |
|------|--------|-------|
| text-[11px] | 11px | Labels, timestamps, small text |
| text-[13px] | 13px | Body text, descriptions |
| text-[16px] | 16px | Section headings |
| text-[18px] | 18px | Page title, summary values |
| text-[20px] | 20px | Stat values (mobile) |
| text-[24px] | 24px | Stat values (desktop) |

### Font Weights
| Weight | Value | Usage |
|--------|-------|-------|
| normal | 400 | Body text |
| medium | 500 | Labels, subtitles |
| semibold | 600 | Emphasized text |
| bold | 700 | Headings, values |

---

## 9. Spacing System

### Gap Sizes
```css
gap-1: 4px
gap-2: 8px
gap-3: 12px
gap-4: 16px
gap-5: 20px
gap-6: 24px
```

### Padding Sizes
```css
p-3: 12px
p-4: 16px
p-5: 20px
p-6: 24px
```

### Margin Bottom
```css
mb-1: 4px
mb-2: 8px
mb-4: 16px
mb-5: 20px
```

---

## 10. Border Radius

```css
rounded-lg: 8px
rounded-2xl: 16px
rounded-[50px]: 50px (pill shape)
rounded-full: 9999px (circle)
```

---

## 11. Transitions

```css
transition-colors: color, background-color, border-color
transition-all: all properties
Duration: 150ms (default)
Timing: ease-in-out
```

---

## 12. Hover States

### Stat Cards
```css
Default Border: #E1E4EA
Hover Border: #2563EB
```

### Activity Items
```css
Default Border: #E1E4EA
Hover Border: #2563EB
```

### Buttons
```css
Period/Metric Inactive:
  - Default Border: #E1E4EA
  - Hover Border: #2563EB
```

---

## Summary

This dashboard follows a clean, modern design with:
- **Consistent spacing** using Tailwind's spacing scale
- **Rounded corners** (8px for small elements, 16px for cards)
- **Subtle borders** (#E1E4EA) with blue hover states (#2563EB)
- **Inter Tight font** throughout
- **Color-coded icons** for visual hierarchy
- **Responsive grid** that adapts from 1 to 4 columns
- **Smooth transitions** on interactive elements
- **Loading skeletons** for better UX
- **Accessible color contrast** for all text

All measurements, colors, and spacing values are exact and production-ready.
