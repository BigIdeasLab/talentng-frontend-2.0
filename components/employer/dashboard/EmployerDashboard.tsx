"use client";

import { Users, Briefcase, TrendingUp, Clock, ArrowRight } from "lucide-react";
import { StatsCard } from "./StatsCard";
import { WeeklyOverviewChart } from "./WeeklyOverviewChart";
import { HiringPipeline } from "./HiringPipeline";
import { TopOpportunities } from "./TopOpportunities";
import { RecentActivity } from "./RecentActivity";
import { QuickActions } from "./QuickActions";

export function EmployerDashboard() {
  return (
    <div className="px-4 py-6 md:px-8 md:py-7">
      {/* Header Section */}
      <div className="flex flex-col gap-4 mb-6 flex-shrink-0">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div className="flex flex-col gap-1.5">
            <h1 className="font-inter-tight text-xl md:text-[21px] font-bold text-black leading-5">
              Welcome back, Chowdeck!
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
            value={156}
            label="Total Applicants"
            change={{ value: "+12%", type: "positive" }}
          />
          <StatsCard
            icon={
              <Briefcase className="w-4 h-4 text-[#5C30FF]" strokeWidth={1.6} />
            }
            value={8}
            label="Active Opportunities"
            change={{ value: "+3", type: "positive" }}
          />
          <StatsCard
            icon={
              <TrendingUp className="w-4 h-4 text-[#5C30FF]" strokeWidth={2} />
            }
            value={24}
            label="Hired This Month"
            change={{ value: "+18%", type: "positive" }}
          />
          <StatsCard
            icon={
              <Clock className="w-4 h-4 text-[#5C30FF]" strokeWidth={1.6} />
            }
            value={12}
            label="Pending Reviews"
            change={{ value: "-5", type: "negative" }}
          />
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="flex flex-col gap-4">
        {/* Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <WeeklyOverviewChart />
          <HiringPipeline />
        </div>

        {/* Opportunities and Activity Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <TopOpportunities />
          <RecentActivity />
        </div>

        {/* Quick Actions */}
        <QuickActions />
      </div>
    </div>
  );
}
