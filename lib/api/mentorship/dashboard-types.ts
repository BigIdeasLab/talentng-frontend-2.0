/**
 * Mentor Dashboard API Types
 * GET /api/v1/mentor/dashboard
 */

export interface MentorDashboardUser {
  name: string;
  greeting: "Good Morning" | "Good Afternoon" | "Good Evening";
}

export interface MentorDashboardWelcome {
  sessionsThisWeek: number;
  message: string;
}

export interface MentorDashboardStatTrend {
  value: string;
  isPositive: boolean;
}

export interface MentorDashboardStats {
  totalMentees: {
    value: number;
    trend: MentorDashboardStatTrend;
  };
  sessionsDone: {
    value: number;
    trend: MentorDashboardStatTrend;
  };
  pendingRequests: {
    value: number;
    trend: MentorDashboardStatTrend;
  };
  averageRating: {
    value: number;
    trend: MentorDashboardStatTrend;
  };
}

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface MentorWeeklyOverviewData {
  day: WeekDay;
  sessions: number;
  views: number;
}

export interface MentorHiringPipelineStageData {
  label: string;
  count: number;
}

export interface MentorHiringPipelineData {
  stages: MentorHiringPipelineStageData[];
  conversionRate: number;
}

export interface MentorUpcomingSession {
  id: string;
  menteeName: string;
  menteeInitials: string;
  menteeProfileImageUrl: string | null;
  topic: string;
  scheduledDate: string;
  scheduledTime: string;
  duration: string;
}

export interface MentorMenteeProgress {
  id: string;
  name: string;
  initials: string;
  profileImageUrl: string | null;
  course: string;
  progress: number;
}

export interface MentorRecentReview {
  id: string;
  rating: number;
  comment: string;
  reviewerName: string;
  reviewerInitial: string;
  verified: boolean;
}

export type MentorAchievementKey =
  | "top_mentor"
  | "100_mentees"
  | "rising_star"
  | "fast_growing";

export interface MentorAchievement {
  id: string;
  key: MentorAchievementKey;
  title: string;
  description: string;
  isLocked: boolean;
}

export interface MentorDashboardResponse {
  user: MentorDashboardUser;
  welcome: MentorDashboardWelcome;
  stats: MentorDashboardStats;
  weeklyOverview: MentorWeeklyOverviewData[];
  hiringPipeline: MentorHiringPipelineData;
  upcomingSessions: MentorUpcomingSession[];
  menteeProgress: MentorMenteeProgress[];
  recentReviews: MentorRecentReview[];
  achievements: MentorAchievement[];
}
