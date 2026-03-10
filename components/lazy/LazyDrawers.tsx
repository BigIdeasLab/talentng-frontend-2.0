/**
 * Lazy-loaded drawer components for improved performance on mobile devices.
 * Drawers are typically used for navigation and can be heavy components.
 */

import { createLazyModal } from '@/lib/utils/lazy-loading';

// Navigation drawers
export const LazyMobileDrawer = createLazyModal(() =>
  import('@/components/navigation/MobileDrawer').then(m => ({ default: m.MobileDrawer }))
);