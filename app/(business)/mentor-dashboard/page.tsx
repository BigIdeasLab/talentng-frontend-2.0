"use client";

import { MentorHeroSection } from "@/components/talent/mentorship/mentor/MentorHeroSection";
import { MentorStatCards } from "@/components/talent/mentorship/mentor/MentorStatCards";
import { AchievementsSection } from "@/components/talent/mentorship/mentor/AchievementsSection";
import { WeeklyOverview } from "@/components/talent/mentorship/mentor/WeeklyOverview";
import { HiringPipeline } from "@/components/talent/mentorship/mentor/HiringPipeline";
import { UpcomingInterviews } from "@/components/talent/mentorship/mentor/UpcomingInterviews";
import { MenteeProgress } from "@/components/talent/mentorship/mentor/MenteeProgress";
import { RecentReviews } from "@/components/talent/mentorship/mentor/RecentReviews";

export default function MentorDashboardPage() {
  return (
    <div className="min-h-screen bg-white p-6 md:p-8">
      <div className="mx-auto max-w-[1140px] space-y-7">
        {/* Hero Section */}
        <MentorHeroSection />

        {/* Stat Cards */}
        <MentorStatCards />

        {/* Achievements */}
        <AchievementsSection />

        {/* Weekly Overview and Hiring Pipeline */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-[1.5fr_1fr]">
          <WeeklyOverview />
          <HiringPipeline />
        </div>

        {/* Upcoming Interviews and Mentee Progress */}
        <div className="grid grid-cols-1 gap-7 lg:grid-cols-2">
          <UpcomingInterviews />
          <MenteeProgress />
        </div>

        {/* Recent Reviews */}
        <RecentReviews />
      </div>
    </div>
  );
}
