"use client";

import { useTalentDashboard } from "@/hooks/useTalentDashboard";
import { WelcomeHeader } from "./WelcomeHeader";
import { StatCards } from "./StatCards";
import { WeeklyOverview } from "./WeeklyOverview";
import { HiringPipeline } from "./HiringPipeline";
import { RecentApplications } from "./RecentApplications";
import { UpcomingInterviews } from "./UpcomingInterviews";
import { TopSkills } from "./TopSkills";
import { Achievements } from "./Achievements";
import { TalentDashboardSkeleton } from "./TalentDashboardSkeleton";

export function TalentDashboard() {
  const { data, isLoading, error } = useTalentDashboard();

  if (isLoading) {
    return <TalentDashboardSkeleton />;
  }

  if (error || !data) {
    return (
      <div className="w-full min-h-screen bg-white p-4 md:p-6 lg:p-8">
        <div className="max-w-[1140px] mx-auto">
          <p className="text-red-500">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-7">
        {/* Welcome Header */}
        <WelcomeHeader
          name={data.user.name}
          greeting={data.user.greeting}
          newOpportunities={data.welcome.newOpportunities}
          profileViewsIncreasePercent={data.welcome.profileViewsIncreasePercent}
        />

        {/* Stat Cards */}
        <StatCards stats={data.stats} />

        {/* Weekly Overview and Hiring Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <WeeklyOverview data={data.weeklyOverview} />
          <HiringPipeline data={data.hiringPipeline} />
        </div>

        {/* Recent Applications and Upcoming Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentApplications applications={data.recentApplications} />
          <UpcomingInterviews interviews={data.upcomingInterviews} />
        </div>

        {/* Top Skills */}
        <TopSkills skills={data.topSkills} />

        {/* Achievements */}
        <Achievements achievements={data.achievements} />
      </div>
    </div>
  );
}
