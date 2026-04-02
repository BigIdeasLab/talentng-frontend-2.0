"use client";

import React from "react";
import { Users, Briefcase, TrendingUp, Clock } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { WeeklyOverviewChart } from "./WeeklyOverviewChart";
import { HiringPipeline } from "./HiringPipeline";
import { TopOpportunities } from "./TopOpportunities";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { WelcomeHeader } from "./WelcomeHeader";
import { VerificationPromptCard } from "./VerificationPromptCard";
import { useRecruiterDashboard } from "@/hooks/useRecruiterDashboard";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import {
  mobileOptimizedMemo,
  useMobileOptimizedMemo,
  useMobileOptimizedCallback,
} from "@/lib/utils/mobile-performance";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`animate-pulse rounded-lg ${className ?? ""}`}
      style={{ backgroundColor: ROLE_COLORS.recruiter.light }}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-7">
      {/* Welcome Header Skeleton */}
      <Skeleton className="h-[105px] w-full rounded-2xl mb-6" />

      <div className="flex flex-col gap-4 mb-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-4">
          <Skeleton className="h-72 w-full" />
          <Skeleton className="h-72 w-full" />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <Skeleton className="h-56 w-full" />
          <Skeleton className="h-56 w-full" />
        </div>
      </div>
    </div>
  );
}

const EmployerDashboard = mobileOptimizedMemo(function EmployerDashboard() {
  const { data, isLoading, isPending, error } = useRecruiterDashboard();

  console.log("Recruiter Dashboard Data:", data);

  // Memoized format function
  const formatChange = useMobileOptimizedCallback(
    (value: number, isPercent: boolean): string => {
      const sign = value >= 0 ? "+" : "";
      return isPercent ? `${sign}${value}%` : `${sign}${value}`;
    },
    [],
  );

  // Memoize formatted stats to prevent unnecessary re-calculations
  const formattedStats = useMobileOptimizedMemo(
    () => {
      if (!data) return null;

      return {
        totalApplicants: {
          value: data.totalApplicants?.value ?? 0,
          change: formatChange(data.totalApplicants?.change ?? 0, true),
          changeType:
            (data.totalApplicants?.change ?? 0) >= 0 ? "positive" : "negative",
        },
        activeOpportunities: {
          value: data.activeOpportunities?.value ?? 0,
          change: formatChange(data.activeOpportunities?.change ?? 0, false),
          changeType:
            (data.activeOpportunities?.change ?? 0) >= 0
              ? "positive"
              : "negative",
        },
        hiredThisMonth: {
          value: data.hiredThisMonth?.value ?? 0,
          change: formatChange(data.hiredThisMonth?.change ?? 0, true),
          changeType:
            (data.hiredThisMonth?.change ?? 0) >= 0 ? "positive" : "negative",
        },
        pendingReviews: {
          value: data.pendingReviews?.value ?? 0,
          change: formatChange(data.pendingReviews?.change ?? 0, false),
          changeType:
            (data.pendingReviews?.change ?? 0) >= 0 ? "positive" : "negative",
        },
      };
    },
    [data, formatChange],
    {
      // On mobile, only recalculate if data reference changes
      simplifyOnMobile: true,
      mobileDeps: [data],
    },
  );

  const handleRetry = useMobileOptimizedCallback(() => {
    window.location.reload();
  }, []);

  if (isLoading || isPending) {
    return <DashboardSkeleton />;
  }

  if (error) {
    console.error("Recruiter Dashboard Error:", error);
    return (
      <div className="px-4 py-6 md:px-8 md:py-7">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500 font-inter-tight text-sm">
            Failed to load dashboard data
          </p>
          <button
            onClick={handleRetry}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!formattedStats) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="flex flex-col gap-4 px-3 py-4 md:px-5 md:py-5 h-full overflow-y-auto scrollbar-styled">
      {/* Welcome Header */}
      <WelcomeHeader
        companyName={data?.companyName ?? "Employer"}
        totalApplicants={formattedStats.totalApplicants.value}
        pendingReviews={formattedStats.pendingReviews.value}
      />

      {/* Verification Prompt Card - Only shows when NOT verified */}
      <VerificationPromptCard />

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
        <StatsCard
          icon={<Users className="w-5 h-5" strokeWidth={1.6} />}
          value={formattedStats.totalApplicants.value}
          label="Total Applicants"
          gradient="bg-gradient-to-br from-[#F59E0B]/8 to-white"
          iconBg="bg-[#FEF3C7]"
          iconColor="text-[#D97706]"
          href="/applicants"
          change={{
            value: formattedStats.totalApplicants.change,
            type: formattedStats.totalApplicants.changeType as
              | "positive"
              | "negative",
          }}
        />
        <StatsCard
          icon={<Briefcase className="w-5 h-5" strokeWidth={1.6} />}
          value={formattedStats.activeOpportunities.value}
          label="Active Opportunities"
          gradient="bg-gradient-to-br from-[#008B47]/8 to-white"
          iconBg="bg-[#D1FAE5]"
          iconColor="text-[#008B47]"
          href="/opportunities"
          change={{
            value: formattedStats.activeOpportunities.change,
            type: formattedStats.activeOpportunities.changeType as
              | "positive"
              | "negative",
          }}
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" strokeWidth={2} />}
          value={formattedStats.hiredThisMonth.value}
          label="Hired This Month"
          gradient="bg-gradient-to-br from-[#2463EB]/8 to-white"
          iconBg="bg-[#DBE9FE]"
          iconColor="text-[#2463EB]"
          href="/applicants/hired-talents"
          change={{
            value: formattedStats.hiredThisMonth.change,
            type: formattedStats.hiredThisMonth.changeType as
              | "positive"
              | "negative",
          }}
        />
        <StatsCard
          icon={<Clock className="w-5 h-5" strokeWidth={1.6} />}
          value={formattedStats.pendingReviews.value}
          label="Pending Reviews"
          gradient="bg-gradient-to-br from-[#FCE7F3] to-white"
          iconBg="bg-[#FCE7F3]"
          iconColor="text-[#DB2777]"
          href="/applicants"
          change={{
            value: formattedStats.pendingReviews.change,
            type: formattedStats.pendingReviews.changeType as
              | "positive"
              | "negative",
          }}
        />
      </div>

      {/* Weekly Overview and Hiring Pipeline */}
      <div className="grid grid-cols-1 lg:grid-cols-[2fr_1fr] gap-4 flex-shrink-0">
        <WeeklyOverviewChart data={data?.weeklyOverview} />
        <HiringPipeline data={data?.hiringPipeline} />
      </div>

      {/* Opportunities and Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
        <TopOpportunities data={data?.topOpportunities} />
        <RecentActivity data={data?.recentActivity} />
      </div>

      {/* Quick Actions */}
      <QuickActions />
    </div>
  );
});

function formatChange(value: number, isPercent: boolean): string {
  const sign = value >= 0 ? "+" : "";
  return isPercent ? `${sign}${value}%` : `${sign}${value}`;
}

export { EmployerDashboard };
