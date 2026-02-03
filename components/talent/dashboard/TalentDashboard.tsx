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
      <div className="px-4 py-6 md:px-8 md:py-7">
        <p className="text-red-500 text-[13px]">
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-7 flex flex-col gap-5 h-full overflow-y-auto scrollbar-styled">
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
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-4 flex-shrink-0">
        <WeeklyOverview data={data.weeklyOverview} />
        <HiringPipeline data={data.hiringPipeline} />
      </div>

      {/* Recent Applications and Upcoming Interviews */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
        <RecentApplications applications={data.recentApplications} />
        <UpcomingInterviews interviews={data.upcomingInterviews} />
      </div>

      {/* Top Skills */}
      <TopSkills skills={data.topSkills} />

      {/* Achievements */}
      <Achievements achievements={data.achievements} />
    </div>
  );
}
