/**
 * Talent Dashboard API Types
 * GET /api/v1/talent/dashboard
 */

export interface TalentDashboardUser {
  name: string;
  greeting: "Good Morning" | "Good Afternoon" | "Good Evening";
}

export interface TalentDashboardWelcome {
  newOpportunities: number;
  profileViewsIncreasePercent: number;
}

export interface TalentDashboardStatTrend {
  value: string;
  isPositive: boolean;
}

export interface TalentDashboardStats {
  profileViews: {
    value: number;
    trend: TalentDashboardStatTrend;
  };
  applications: {
    value: number;
    inReview: number;
  };
  timesHired: {
    value: number;
    totalEarned: number;
  };
  profileScore: {
    value: number;
    pointsToComplete: number;
  };
}

export type WeekDay = "Mon" | "Tue" | "Wed" | "Thu" | "Fri" | "Sat" | "Sun";

export interface WeeklyOverviewData {
  day: WeekDay;
  applications: number;
  views: number;
}

export type HiringPipelineStage =
  | "Applied"
  | "In Review"
  | "Interview"
  | "Hired";

export interface HiringPipelineStageData {
  label: HiringPipelineStage;
  count: number;
}

export interface HiringPipelineData {
  stages: HiringPipelineStageData[];
  conversionRate: number;
}

export type ApplicationStatus =
  | "Applied"
  | "In Review"
  | "Interview"
  | "Hired"
  | "Rejected";

export interface RecentApplication {
  id: string;
  opportunityId?: string;
  title: string;
  company: string;
  companyLogo: string | null;
  appliedAt: string;
  status: ApplicationStatus;
}

export interface UpcomingInterview {
  id: string;
  company: string;
  position: string;
  scheduledAt: string;
  status: string;
  opportunityId?: string;
  location?: string;
  meetingLink?: string;
}

export interface TopSkill {
  id: string;
  name: string;
  percentage: number;
  endorsements: number;
}

export type AchievementKey =
  | "rising_star"
  | "first_hire"
  | "team_player"
  | "top_earner";

export interface Achievement {
  id: string;
  key: AchievementKey;
  title: string;
  description: string;
  isLocked: boolean;
}

export interface TalentDashboardResponse {
  user: TalentDashboardUser;
  welcome: TalentDashboardWelcome;
  stats: TalentDashboardStats;
  weeklyOverview: WeeklyOverviewData[];
  hiringPipeline: HiringPipelineData;
  recentApplications: RecentApplication[];
  upcomingInterviews: UpcomingInterview[];
  topSkills: TopSkill[];
  achievements: Achievement[];
}
