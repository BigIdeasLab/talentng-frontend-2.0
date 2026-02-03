"use client";

import { Users, Briefcase, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { WeeklyOverviewChart } from "./WeeklyOverviewChart";
import { HiringPipeline } from "./HiringPipeline";
import { TopOpportunities } from "./TopOpportunities";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";
import { useRecruiterDashboard } from "@/hooks/useRecruiterDashboard";

function Skeleton({ className }: { className?: string }) {
  return (
    <div
      className={`bg-gray-200 animate-pulse rounded-lg ${className ?? ""}`}
    />
  );
}

function DashboardSkeleton() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-7">
      <div className="flex flex-col gap-4 mb-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <Skeleton className="h-6 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-[38px] w-36" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-28 w-full" />
          ))}
        </div>
      </div>
      <div className="flex flex-col gap-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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

function formatChange(value: number, isPercent: boolean): string {
  const sign = value >= 0 ? "+" : "";
  return isPercent ? `${sign}${value}%` : `${sign}${value}`;
}

export function EmployerDashboard() {
  const { data, isLoading, error } = useRecruiterDashboard();

  if (isLoading) {
    return <DashboardSkeleton />;
  }

  if (error) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-7">
        <div className="flex flex-col items-center justify-center gap-4 py-12">
          <p className="text-red-500 font-inter-tight text-sm">
            Failed to load dashboard data
          </p>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 rounded-lg border border-gray-300 text-sm"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-7">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-inter-tight text-xl md:text-[21px] font-bold text-black leading-5">
              Welcome back, {data?.companyName ?? "Employer"}!
            </h1>
            <p className="font-inter-tight text-[13px] font-normal text-[rgba(0,0,0,0.30)]">
              Here&apos;s what&apos;s happening with your talent pipeline
            </p>
          </div>
          <button className="flex h-[38px] px-4 justify-center items-center gap-1 rounded-lg border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4A26CC] transition-colors group flex-shrink-0">
            <span className="font-inter-tight text-xs font-normal text-white">
              Review Applicants
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-white group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Stats Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <StatsCard
            icon={
              <Users className="w-4 h-4 text-[#5C30FF]" strokeWidth={1.6} />
            }
            value={data?.totalApplicants?.value ?? 0}
            label="Total Applicants"
            change={{
              value: formatChange(data?.totalApplicants?.change ?? 0, true),
              type:
                (data?.totalApplicants?.change ?? 0) >= 0
                  ? "positive"
                  : "negative",
            }}
          />
          <StatsCard
            icon={
              <Briefcase className="w-4 h-4 text-[#5C30FF]" strokeWidth={1.6} />
            }
            value={data?.activeOpportunities?.value ?? 0}
            label="Active Opportunities"
            change={{
              value: formatChange(
                data?.activeOpportunities?.change ?? 0,
                false,
              ),
              type:
                (data?.activeOpportunities?.change ?? 0) >= 0
                  ? "positive"
                  : "negative",
            }}
          />
          <StatsCard
            icon={
              <TrendingUp className="w-4 h-4 text-[#5C30FF]" strokeWidth={2} />
            }
            value={data?.hiredThisMonth?.value ?? 0}
            label="Hired This Month"
            change={{
              value: formatChange(data?.hiredThisMonth?.change ?? 0, true),
              type:
                (data?.hiredThisMonth?.change ?? 0) >= 0
                  ? "positive"
                  : "negative",
            }}
          />
          <StatsCard
            icon={
              <Clock className="w-4 h-4 text-[#5C30FF]" strokeWidth={1.6} />
            }
            value={data?.pendingReviews?.value ?? 0}
            label="Pending Reviews"
            change={{
              value: formatChange(data?.pendingReviews?.change ?? 0, false),
              type:
                (data?.pendingReviews?.change ?? 0) >= 0
                  ? "positive"
                  : "negative",
            }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-4">
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeeklyOverviewChart data={data?.weeklyOverview} />
          <HiringPipeline data={data?.hiringPipeline} />
        </div>

        {/* Opportunities and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopOpportunities data={data?.topOpportunities} />
          <RecentActivity data={data?.recentActivity} />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
