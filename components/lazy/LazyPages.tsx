/**
 * Lazy-loaded page components for improved performance on mobile devices.
 * These components are loaded only when the route is accessed, reducing the initial bundle size.
 */

import React from "react";
import { LazyWrapper, DefaultLazyFallback } from "@/lib/utils/lazy-loading";

// Page-specific loading fallback
const PageLazyFallback: React.FC = () => (
  <div className="min-h-screen bg-white flex items-center justify-center">
    <div className="flex flex-col items-center gap-4">
      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      <span className="text-sm text-gray-600">Loading page...</span>
    </div>
  </div>
);

// Dashboard pages
export const LazyDashboardPage = React.lazy(
  () => import("@/app/(business)/dashboard/page"),
);

export const LazyDiscoverTalentPage = React.lazy(
  () => import("@/app/(business)/discover-talent/page"),
);

export const LazyOpportunitiesPage = React.lazy(
  () => import("@/app/(business)/opportunities/page"),
);

export const LazyApplicantsPage = React.lazy(
  () => import("@/app/(business)/applicants/page"),
);

export const LazyHiredTalentsPage = React.lazy(
  () => import("@/app/(business)/applicants/hired-talents/page"),
);

export const LazyMentorshipPage = React.lazy(
  () => import("@/app/(business)/mentorship/page"),
);

export const LazyApplicationsPage = React.lazy(
  () => import("@/app/(business)/applications/page"),
);

export const LazyCalendarPage = React.lazy(
  () => import("@/app/(business)/calendar/page"),
);

export const LazySessionsPage = React.lazy(
  () => import("@/app/(business)/sessions/page"),
);

export const LazyInterviewsPage = React.lazy(
  () => import("@/app/(business)/interviews/page"),
);

export const LazyProfilePage = React.lazy(
  () => import("@/app/(business)/profile/page"),
);

// Wrapper components with proper fallbacks
export const DashboardPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyDashboardPage />
  </LazyWrapper>
);

export const DiscoverTalentPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyDiscoverTalentPage />
  </LazyWrapper>
);

export const OpportunitiesPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyOpportunitiesPage />
  </LazyWrapper>
);

export const ApplicantsPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyApplicantsPage />
  </LazyWrapper>
);

export const HiredTalentsPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyHiredTalentsPage />
  </LazyWrapper>
);

export const MentorshipPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyMentorshipPage />
  </LazyWrapper>
);

export const ApplicationsPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyApplicationsPage />
  </LazyWrapper>
);

export const CalendarPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyCalendarPage />
  </LazyWrapper>
);

export const SessionsPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazySessionsPage />
  </LazyWrapper>
);

export const InterviewsPageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyInterviewsPage />
  </LazyWrapper>
);

export const ProfilePageWithSuspense: React.FC = () => (
  <LazyWrapper fallback={<PageLazyFallback />}>
    <LazyProfilePage />
  </LazyWrapper>
);
