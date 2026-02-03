"use client";

import { WelcomeHeader } from "./WelcomeHeader";
import { StatCards } from "./StatCards";
import { WeeklyOverview } from "./WeeklyOverview";
import { HiringPipeline } from "./HiringPipeline";
import { RecentApplications } from "./RecentApplications";
import { UpcomingInterviews } from "./UpcomingInterviews";
import { TopSkills } from "./TopSkills";
import { Achievements } from "./Achievements";

export function TalentDashboard() {
  // In production, this would come from user data
  const userName = "Akanbi";

  return (
    <div className="w-full min-h-screen bg-white p-4 md:p-6 lg:p-8">
      <div className="max-w-[1140px] mx-auto flex flex-col gap-7">
        {/* Welcome Header */}
        <WelcomeHeader name={userName} />

        {/* Stat Cards */}
        <StatCards />

        {/* Weekly Overview and Hiring Pipeline */}
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_420px] gap-6">
          <WeeklyOverview />
          <HiringPipeline />
        </div>

        {/* Recent Applications and Upcoming Interviews */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentApplications />
          <UpcomingInterviews />
        </div>

        {/* Top Skills */}
        <TopSkills />

        {/* Achievements */}
        <Achievements />
      </div>
    </div>
  );
}
