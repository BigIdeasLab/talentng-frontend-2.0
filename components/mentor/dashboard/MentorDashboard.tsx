"use client";

import { useMentorDashboard } from "@/hooks/useMentorDashboard";
import { MentorHeroSection } from "@/components/talent/mentorship/mentor/MentorHeroSection";
import { MentorStatCards } from "@/components/talent/mentorship/mentor/MentorStatCards";
import { AchievementsSection } from "@/components/talent/mentorship/mentor/AchievementsSection";
import { WeeklyOverview } from "@/components/talent/mentorship/mentor/WeeklyOverview";
import { HiringPipeline } from "@/components/talent/mentorship/mentor/HiringPipeline";
import { UpcomingInterviews } from "@/components/talent/mentorship/mentor/UpcomingInterviews";
import { MenteeProgress } from "@/components/talent/mentorship/mentor/MenteeProgress";
import { RecentReviews } from "@/components/talent/mentorship/mentor/RecentReviews";
import { MentorDashboardSkeleton } from "./MentorDashboardSkeleton";
import type { MentorDashboardResponse } from "@/lib/api/mentorship";

export default function MentorDashboard() {
  const { data: rawData, isLoading, isPending, error } = useMentorDashboard();

  if (isLoading || isPending) {
    return <MentorDashboardSkeleton />;
  }

  if (error || !rawData) {
    return (
      <div className="px-4 py-6 md:px-8 md:py-7">
        <p className="text-red-500 text-[13px]">
          Failed to load dashboard data
        </p>
      </div>
    );
  }

  // Handle possible API envelope wrapping: { data: { user, stats, ... } }
  const data: MentorDashboardResponse = (rawData as any).data ?? rawData;

  if (!data.user) {
    console.error("[MentorDashboard] Unexpected response shape:", rawData);
    return (
      <div className="px-4 py-6 md:px-8 md:py-7">
        <p className="text-red-500 text-[13px]">
          Dashboard data unavailable. Check console for details.
        </p>
      </div>
    );
  }

  return (
    <div className="px-4 py-6 md:px-8 md:py-7 flex flex-col gap-5 h-full overflow-y-auto scrollbar-styled">
      <MentorHeroSection
        name={data.user.name}
        greeting={data.user.greeting}
        sessionsThisWeek={data.welcome.sessionsThisWeek}
        message={data.welcome.message}
      />
      <MentorStatCards stats={data.stats} />
      <div className="grid grid-cols-1 lg:grid-cols-[5fr_3fr] gap-4 flex-shrink-0">
        <WeeklyOverview data={data.weeklyOverview} />
        <HiringPipeline data={data.hiringPipeline} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 flex-shrink-0">
        <UpcomingInterviews sessions={data.upcomingSessions} />
        <MenteeProgress mentees={data.menteeProgress} />
      </div>
      <RecentReviews reviews={data.recentReviews} />
      <AchievementsSection achievements={data.achievements} />
    </div>
  );
}
