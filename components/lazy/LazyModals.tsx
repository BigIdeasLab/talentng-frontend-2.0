/**
 * Lazy-loaded modal components for improved performance on mobile devices.
 * These components are loaded only when needed, reducing the initial bundle size.
 */

import React from "react";
import { createLazyModal } from "@/lib/utils/lazy-loading";

// Employer modals
export const LazyApplicantFilterModal = createLazyModal(
  () => import("@/components/employer/applicants/ApplicantFilterModal"),
);

export const LazyHiredTalentFilterModal = createLazyModal(
  () => import("@/components/employer/applicants/HiredTalentFilterModal"),
);

export const LazyScheduleInterviewModal = createLazyModal(
  () => import("@/components/employer/applicants/ScheduleInterviewModal"),
);

export const LazyRescheduleInterviewModal = createLazyModal(
  () => import("@/components/employer/applicants/RescheduleInterviewModal"),
);

export const LazyDeclineApplicationModal = createLazyModal(
  () => import("@/components/employer/applicants/DeclineApplicationModal"),
);

export const LazyHireApplicationModal = createLazyModal(
  () => import("@/components/employer/applicants/HireApplicationModal"),
);

export const LazyCancelInterviewModal = createLazyModal(
  () => import("@/components/employer/applicants/CancelInterviewModal"),
);

export const LazyHireOpportunitiesModal = createLazyModal(
  () => import("@/components/employer/talent-profile/HireOpportunitiesModal"),
);

export const LazyRecommendationModal = createLazyModal(
  () => import("@/components/employer/opportunities/RecommendationModal"),
);

export const LazyHireFilterModal = createLazyModal(
  () => import("@/components/employer/profile/tabs/HireFilterModal"),
);

// Talent modals
export const LazyOpportunitiesFilterModal = createLazyModal(
  () => import("@/components/talent/opportunities/OpportunitiesFilterModal"),
);

export const LazyApplicationModal = createLazyModal(
  () => import("@/components/talent/opportunities/ApplicationModal"),
);

export const LazyProjectSelectionModal = createLazyModal(
  () => import("@/components/talent/opportunities/ProjectSelectionModal"),
);

export const LazyUploadWorksModal = createLazyModal(
  () => import("@/components/talent/profile/components/UploadWorksModal"),
);

export const LazyCreateServiceModal = createLazyModal(
  () => import("@/components/talent/profile/components/CreateServiceModal"),
);

export const LazyApplicationFilterModal = createLazyModal(
  () => import("@/components/talent/applications/ApplicationFilterModal"),
);

export const LazyMentorFilterModal = createLazyModal(
  () => import("@/components/talent/mentorship/MentorFilterModal"),
);

// General modals
export const LazyFilterModal = createLazyModal(
  () => import("@/components/discover-talent/FilterModal"),
);

export const LazyNotificationsModal = createLazyModal(
  () => import("@/components/layouts/modals/NotificationsModal"),
);

export const LazyConfirmationModal = createLazyModal(
  () => import("@/components/ui/ConfirmationModal"),
);

export const LazyRescheduleModal = createLazyModal(
  () => import("@/components/ui/RescheduleModal"),
);

export const LazyReviewModal = createLazyModal(
  () => import("@/components/ui/ReviewModal"),
);

export const LazyRoleSwitchModal = createLazyModal(
  () => import("@/components/ui/RoleSwitchModal"),
);

export const LazySuccessModal = createLazyModal(
  () => import("@/components/ui/SuccessModal"),
);

export const LazySwipeableModal = createLazyModal(
  () => import("@/components/ui/SwipeableModal"),
);
