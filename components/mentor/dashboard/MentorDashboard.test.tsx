import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import MentorDashboard from "./MentorDashboard";
import { useMentorDashboard } from "@/hooks/useMentorDashboard";

// Mock the hook
vi.mock("@/hooks/useMentorDashboard");

// Mock child components
vi.mock("@/components/talent/mentorship/mentor/MentorHeroSection", () => ({
  MentorHeroSection: () => <div data-testid="hero-section">Hero Section</div>,
}));

vi.mock("@/components/talent/mentorship/mentor/MentorStatCards", () => ({
  MentorStatCards: () => <div data-testid="stat-cards">Stat Cards</div>,
}));

vi.mock("@/components/talent/mentorship/mentor/WeeklyOverview", () => ({
  WeeklyOverview: () => <div data-testid="weekly-overview">Weekly Overview</div>,
}));

vi.mock("@/components/talent/mentorship/mentor/HiringPipeline", () => ({
  HiringPipeline: () => <div data-testid="hiring-pipeline">Hiring Pipeline</div>,
}));

vi.mock("@/components/talent/mentorship/mentor/UpcomingInterviews", () => ({
  UpcomingInterviews: () => <div data-testid="upcoming-interviews">Upcoming Interviews</div>,
}));

vi.mock("@/components/talent/mentorship/mentor/MenteeProgress", () => ({
  MenteeProgress: () => <div data-testid="mentee-progress">Mentee Progress</div>,
}));

vi.mock("@/components/talent/mentorship/mentor/RecentReviews", () => ({
  RecentReviews: () => <div data-testid="recent-reviews">Recent Reviews</div>,
}));

vi.mock("@/components/talent/mentorship/mentor/AchievementsSection", () => ({
  AchievementsSection: () => <div data-testid="achievements">Achievements</div>,
}));

vi.mock("./MentorDashboardSkeleton", () => ({
  MentorDashboardSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

const mockDashboardData = {
  user: {
    name: "Jane Smith",
    greeting: "Good Afternoon" as const,
  },
  welcome: {
    sessionsThisWeek: 3,
    message: "You have 2 upcoming sessions",
  },
  stats: {
    totalMentees: {
      value: 10,
      trend: { value: "+2", isPositive: true },
    },
    sessionsDone: {
      value: 25,
      trend: { value: "+5", isPositive: true },
    },
    pendingRequests: {
      value: 3,
      trend: { value: "+1", isPositive: true },
    },
    averageRating: {
      value: 4.8,
      trend: { value: "+0.2", isPositive: true },
    },
  },
  weeklyOverview: [],
  hiringPipeline: {
    stages: [],
    conversionRate: 0,
  },
  upcomingSessions: [],
  menteeProgress: [],
  recentReviews: [],
  achievements: [],
};

describe("MentorDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when data is loading", () => {
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: false,
      error: null,
    } as any);

    render(<MentorDashboard />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: undefined,
      isLoading: false,
      isPending: false,
      error: new Error("Failed to fetch"),
    } as any);

    render(<MentorDashboard />);
    expect(screen.getByText("Failed to load dashboard data")).toBeInTheDocument();
  });

  it("renders all dashboard sections when data is loaded", () => {
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    render(<MentorDashboard />);

    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
    expect(screen.getByTestId("stat-cards")).toBeInTheDocument();
    expect(screen.getByTestId("weekly-overview")).toBeInTheDocument();
    expect(screen.getByTestId("hiring-pipeline")).toBeInTheDocument();
    expect(screen.getByTestId("upcoming-interviews")).toBeInTheDocument();
    expect(screen.getByTestId("mentee-progress")).toBeInTheDocument();
    expect(screen.getByTestId("recent-reviews")).toBeInTheDocument();
    expect(screen.getByTestId("achievements")).toBeInTheDocument();
  });

  it("handles API envelope wrapping correctly", () => {
    const wrappedData = { data: mockDashboardData };
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: wrappedData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    render(<MentorDashboard />);
    expect(screen.getByTestId("hero-section")).toBeInTheDocument();
  });

  it("renders error when user data is missing", () => {
    const invalidData = { ...mockDashboardData, user: undefined };
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: invalidData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    render(<MentorDashboard />);
    expect(screen.getByText("Dashboard data unavailable. Check console for details.")).toBeInTheDocument();
  });

  it("applies responsive padding classes", () => {
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<MentorDashboard />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass("px-4");
    expect(mainDiv).toHaveClass("py-6");
    expect(mainDiv).toHaveClass("md:px-8");
    expect(mainDiv).toHaveClass("md:py-7");
  });

  it("applies responsive grid layout for charts section", () => {
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<MentorDashboard />);
    const chartsGrid = container.querySelector(".grid.grid-cols-1.lg\\:grid-cols-\\[5fr_3fr\\]");

    expect(chartsGrid).toBeInTheDocument();
  });

  it("applies responsive grid layout for sessions and mentee progress section", () => {
    vi.mocked(useMentorDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<MentorDashboard />);
    const sectionsGrid = container.querySelector(".grid.grid-cols-1.lg\\:grid-cols-2");

    expect(sectionsGrid).toBeInTheDocument();
  });
});
