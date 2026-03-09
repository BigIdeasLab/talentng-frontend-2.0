/**
 * EmployerDashboard Component - Responsive Layout Example
 *
 * This example demonstrates the responsive behavior of the EmployerDashboard component
 * across different breakpoints (mobile, tablet, and desktop).
 *
 * Responsive Features:
 *
 * 1. Stat Cards Grid:
 *    - Mobile (< 640px): 1 column (stacked vertically)
 *    - Tablet (640px - 1023px): 2 columns
 *    - Desktop (≥ 1024px): 4 columns
 *    - Classes: `grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3`
 *
 * 2. Charts Section:
 *    - Mobile (< 1024px): Stacked vertically (1 column)
 *    - Desktop (≥ 1024px): Side-by-side with 5:3 ratio
 *    - Classes: `grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-4`
 *    - WeeklyOverviewChart: Responsive height `h-[300px] md:h-[400px]`
 *    - HiringPipeline: Full width on mobile, adapts to grid on desktop
 *
 * 3. Opportunities & Activity Section:
 *    - Mobile (< 1024px): Stacked vertically (1 column)
 *    - Desktop (≥ 1024px): Side-by-side (2 columns)
 *    - Classes: `grid grid-cols-1 lg:grid-cols-2 gap-4`
 *
 * 4. Quick Actions:
 *    - Mobile: Vertical layout with full-width buttons
 *    - Desktop: Horizontal layout with inline buttons
 *    - Classes: `flex-col md:flex-row`
 *
 * 5. Welcome Header:
 *    - Mobile: Stacked content with button below
 *    - Desktop: Content and button side-by-side
 *    - Responsive padding: `p-4 md:p-6`
 *
 * 6. Container Padding:
 *    - Mobile: `px-4 py-6`
 *    - Desktop: `px-8 py-7`
 *
 * Testing Responsive Behavior:
 *
 * To test the responsive layout:
 * 1. Open the dashboard in a browser
 * 2. Use browser DevTools to toggle device emulation
 * 3. Test at these breakpoints:
 *    - 375px (iPhone SE - small mobile)
 *    - 768px (iPad Mini - tablet)
 *    - 1024px (iPad Pro - large tablet/small desktop)
 *    - 1440px (Desktop)
 *
 * Expected Behavior:
 *
 * Mobile (< 768px):
 * - All sections stack vertically
 * - Stat cards in 1 column
 * - Charts take full width
 * - Touch-friendly spacing
 *
 * Tablet (768px - 1023px):
 * - Stat cards in 2 columns
 * - Charts still stacked vertically
 * - Opportunities/Activity stacked vertically
 *
 * Desktop (≥ 1024px):
 * - Stat cards in 4 columns
 * - Charts side-by-side (5:3 ratio)
 * - Opportunities/Activity side-by-side
 * - Optimal use of horizontal space
 */

import { EmployerDashboard } from "./EmployerDashboard";

export default function EmployerDashboardExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1920px] mx-auto">
        <EmployerDashboard />
      </div>
    </div>
  );
}

/**
 * Responsive Breakpoint Reference:
 *
 * Tailwind CSS Breakpoints:
 * - sm: 640px
 * - md: 768px
 * - lg: 1024px
 * - xl: 1280px
 * - 2xl: 1536px
 *
 * Semantic Breakpoints (from design.md):
 * - Mobile: < 768px
 * - Tablet: 768px - 1023px
 * - Desktop: ≥ 1024px
 *
 * Component-Specific Responsive Classes:
 *
 * StatsCard:
 * - Value text: `text-[20px] md:text-[24px]`
 * - Icon size: `w-[36px] h-[36px] md:w-[40px] md:h-[40px]`
 * - Change indicator: `md:hidden lg:flex` (hidden on tablet)
 *
 * WeeklyOverviewChart:
 * - Container: `w-full h-[300px] md:h-[400px]`
 * - Uses ResponsiveContainer from Recharts
 *
 * TopOpportunities:
 * - Item height: `h-auto md:h-[50px]`
 * - Item padding: `py-3 md:py-0`
 *
 * QuickActions:
 * - Layout: `flex-col md:flex-row`
 * - Padding: `py-4 md:py-5`
 *
 * WelcomeHeader:
 * - Layout: `flex-col md:flex-row`
 * - Padding: `p-4 md:p-6`
 */
