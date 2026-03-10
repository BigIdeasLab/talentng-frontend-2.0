/**
 * Lazy-loaded chart components for improved performance on mobile devices.
 * Charts are typically heavy components that benefit from lazy loading.
 */

import { createLazyChart } from "@/lib/utils/lazy-loading";

// Dashboard charts
export const LazyWeeklyOverviewChart = createLazyChart(() =>
  import("@/components/employer/dashboard/WeeklyOverviewChart").then((m) => ({
    default: m.WeeklyOverviewChart,
  })),
);

// Add other chart components as they are identified
// These would be added as we find more chart components in the codebase
