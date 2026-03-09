/**
 * TalentDashboard Example
 * 
 * This example demonstrates the responsive layout of the TalentDashboard component.
 * 
 * Responsive Behavior:
 * - Mobile (< 768px): All sections stack vertically, stat cards in single column
 * - Tablet (768px - 1024px): Stat cards in 2 columns, charts stack vertically
 * - Desktop (≥ 1024px): Stat cards in 4 columns, charts side-by-side
 * 
 * Key Responsive Features:
 * 1. Stat Cards Grid: grid-cols-1 sm:grid-cols-2 lg:grid-cols-4
 * 2. Charts Section: grid-cols-1 lg:grid-cols-[5fr_3fr]
 * 3. Applications/Interviews: grid-cols-1 lg:grid-cols-2
 * 4. Responsive Padding: px-4 py-6 md:px-8 md:py-7
 * 5. Charts scale to full width on mobile with responsive height
 */

"use client";

import { TalentDashboard } from "./TalentDashboard";

export default function TalentDashboardExample() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-[1400px] mx-auto">
        <TalentDashboard />
      </div>
    </div>
  );
}

/**
 * Testing Responsive Behavior:
 * 
 * 1. Mobile View (< 768px):
 *    - Open browser DevTools
 *    - Set viewport to 375px width (iPhone)
 *    - Verify stat cards stack in single column
 *    - Verify all sections stack vertically
 *    - Verify charts use full width
 * 
 * 2. Tablet View (768px - 1024px):
 *    - Set viewport to 768px width (iPad)
 *    - Verify stat cards display in 2 columns
 *    - Verify charts still stack vertically
 *    - Verify increased padding
 * 
 * 3. Desktop View (≥ 1024px):
 *    - Set viewport to 1280px width
 *    - Verify stat cards display in 4 columns
 *    - Verify charts display side-by-side (5fr + 3fr)
 *    - Verify applications and interviews side-by-side
 * 
 * Component Structure:
 * ```
 * TalentDashboard
 * ├── WelcomeHeader (full width)
 * ├── StatCards (responsive grid: 1/2/4 columns)
 * ├── Charts Row (responsive: stacked/side-by-side)
 * │   ├── WeeklyOverview (5fr on desktop)
 * │   └── HiringPipeline (3fr on desktop)
 * ├── Content Row (responsive: stacked/side-by-side)
 * │   ├── RecentApplications
 * │   └── UpcomingInterviews
 * ├── TopSkills (full width)
 * └── Achievements (full width)
 * ```
 * 
 * Responsive Classes Used:
 * - Container: px-4 py-6 md:px-8 md:py-7
 * - Stat Cards: grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3
 * - Charts: grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-4
 * - Content: grid grid-cols-1 lg:grid-cols-2 gap-4
 * - Chart Height: h-[300px] md:h-[400px]
 * - Chart Width: w-full (always full container width)
 */
