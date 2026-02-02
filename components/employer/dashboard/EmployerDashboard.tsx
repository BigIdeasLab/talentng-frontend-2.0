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
    <div className="min-h-screen bg-white">
      <div className="max-w-[1440px] mx-auto px-6 py-8 md:px-12 md:py-10">
        {/* Header Section */}
        <div className="flex flex-col gap-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div className="flex flex-col gap-2">
              <h1 className="font-inter-tight text-2xl md:text-[25px] font-bold text-black leading-5">
                Welcome back, Chowdeck!
              </h1>
              <p className="font-inter-tight text-[15px] font-normal text-[rgba(0,0,0,0.30)]">
                Here&apos;s what&apos;s happening with your talent pipeline
              </p>
            </div>
            <button className="flex h-[46px] px-6 justify-center items-center gap-1 rounded-[10px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4A26CC] transition-colors group">
              <span className="font-inter-tight text-sm font-normal text-white">
                Review Applicants
              </span>
              <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>

          {/* Stats Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatsCard
              icon={<Users className="w-4.5 h-4.5 text-[#5C30FF]" strokeWidth={1.6} />}
              value={156}
              label="Total Applicants"
              change={{ value: "+12%", type: "positive" }}
            />
            <StatsCard
              icon={<Briefcase className="w-4.5 h-4.5 text-[#5C30FF]" strokeWidth={1.6} />}
              value={8}
              label="Active Opportunities"
              change={{ value: "+3", type: "positive" }}
            />
            <StatsCard
              icon={<TrendingUp className="w-4.5 h-4.5 text-[#5C30FF]" strokeWidth={2} />}
              value={24}
              label="Hired This Month"
              change={{ value: "+18%", type: "positive" }}
            />
            <StatsCard
              icon={<Clock className="w-4.5 h-4.5 text-[#5C30FF]" strokeWidth={1.6} />}
              value={12}
              label="Pending Reviews"
              change={{ value: "-5", type: "negative" }}
            />
          </div>
        </div>

        {/* Main Content Grid */}
        <div className="flex flex-col gap-6">
          {/* Charts Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <WeeklyOverviewChart />
            <HiringPipeline />
          </div>

          {/* Opportunities and Activity Row */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <TopOpportunities />
            <RecentActivity />
          </div>

          {/* Quick Actions */}
          <QuickActions />
        </div>
      </div>
    </div>
  );
}
