import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TalentDashboard } from "./TalentDashboard";
import { useTalentDashboard } from "@/hooks/useTalentDashboard";

// Mock the hook
vi.mock("@/hooks/useTalentDashboard");

// Mock child components
vi.mock("./WelcomeHeader", () => ({
  WelcomeHeader: () => <div data-testid="welcome-header">Welcome Header</div>,
}));

vi.mock("./StatCards", () => ({
  StatCards: () => <div data-testid="stat-cards">Stat Cards</div>,
}));

vi.mock("./WeeklyOverview", () => ({
  WeeklyOverview: () => (
    <div data-testid="weekly-overview">Weekly Overview</div>
  ),
}));

vi.mock("./HiringPipeline", () => ({
  HiringPipeline: () => (
    <div data-testid="hiring-pipeline">Hiring Pipeline</div>
  ),
}));

vi.mock("./RecentApplications", () => ({
  RecentApplications: () => (
    <div data-testid="recent-applications">Recent Applications</div>
  ),
}));

vi.mock("./UpcomingInterviews", () => ({
  UpcomingInterviews: () => (
    <div data-testid="upcoming-interviews">Upcoming Interviews</div>
  ),
}));

vi.mock("./TopSkills", () => ({
  TopSkills: () => <div data-testid="top-skills">Top Skills</div>,
}));

vi.mock("./Achievements", () => ({
  Achievements: () => <div data-testid="achievements">Achievements</div>,
}));

vi.mock("./TalentDashboardSkeleton", () => ({
  TalentDashboardSkeleton: () => <div data-testid="skeleton">Loading...</div>,
}));

const mockDashboardData = {
  user: {
    name: "John Doe",
    greeting: "Good Morning" as const,
  },
  welcome: {
    newOpportunities: 5,
    profileViewsIncreasePercent: 15,
  },
  stats: {
    profileViews: {
      value: 120,
      trend: { value: "+15%", isPositive: true },
    },
    applications: {
      value: 8,
      inReview: 3,
    },
    timesHired: {
      value: 2,
      savedOpportunities: 5,
    },
    profileScore: {
      value: 75,
      pointsToComplete: 25,
    },
  },
  weeklyOverview: [],
  hiringPipeline: {
    stages: [],
    conversionRate: 0,
  },
  recentApplications: [],
  upcomingInterviews: [],
  topSkills: [],
  achievements: [],
};

describe("TalentDashboard", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders loading skeleton when data is loading", () => {
    vi.mocked(useTalentDashboard).mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: false,
      error: null,
    } as any);

    render(<TalentDashboard />);
    expect(screen.getByTestId("skeleton")).toBeInTheDocument();
  });

  it("renders error message when there is an error", () => {
    vi.mocked(useTalentDashboard).mockReturnValue({
      data: undefined,
      isLoading: false,
      isPending: false,
      error: new Error("Failed to fetch"),
    } as any);

    render(<TalentDashboard />);
    expect(
      screen.getByText("Failed to load dashboard data"),
    ).toBeInTheDocument();
  });

  it("renders all dashboard sections when data is loaded", () => {
    vi.mocked(useTalentDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    render(<TalentDashboard />);

    expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    expect(screen.getByTestId("stat-cards")).toBeInTheDocument();
    expect(screen.getByTestId("weekly-overview")).toBeInTheDocument();
    expect(screen.getByTestId("hiring-pipeline")).toBeInTheDocument();
    expect(screen.getByTestId("recent-applications")).toBeInTheDocument();
    expect(screen.getByTestId("upcoming-interviews")).toBeInTheDocument();
    expect(screen.getByTestId("top-skills")).toBeInTheDocument();
    expect(screen.getByTestId("achievements")).toBeInTheDocument();
  });

  it("applies responsive padding classes", () => {
    vi.mocked(useTalentDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<TalentDashboard />);
    const mainDiv = container.firstChild as HTMLElement;

    expect(mainDiv).toHaveClass("px-4");
    expect(mainDiv).toHaveClass("py-6");
    expect(mainDiv).toHaveClass("md:px-8");
    expect(mainDiv).toHaveClass("md:py-7");
  });

  it("applies responsive grid layout for charts section", () => {
    vi.mocked(useTalentDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<TalentDashboard />);
    const chartsGrid = container.querySelector(
      ".grid.grid-cols-1.lg\\:grid-cols-\\[5fr_3fr\\]",
    );

    expect(chartsGrid).toBeInTheDocument();
  });

  it("applies responsive grid layout for applications and interviews section", () => {
    vi.mocked(useTalentDashboard).mockReturnValue({
      data: mockDashboardData as any,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<TalentDashboard />);
    const sectionsGrid = container.querySelector(
      ".grid.grid-cols-1.lg\\:grid-cols-2",
    );

    expect(sectionsGrid).toBeInTheDocument();
  });
});
