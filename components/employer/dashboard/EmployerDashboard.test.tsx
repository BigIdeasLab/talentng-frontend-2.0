import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { EmployerDashboard } from "./EmployerDashboard";
import { useRecruiterDashboard } from "@/hooks/useRecruiterDashboard";

// Mock the hook
vi.mock("@/hooks/useRecruiterDashboard");
const mockUseRecruiterDashboard = useRecruiterDashboard as ReturnType<typeof vi.fn>;

// Mock Next.js router
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
    prefetch: vi.fn(),
  }),
}));

// Mock child components
vi.mock("./StatsCard", () => ({
  StatsCard: ({ label, value }: { label: string; value: number }) => (
    <div data-testid="stats-card">
      <span>{label}</span>
      <span>{value}</span>
    </div>
  ),
}));

vi.mock("./WeeklyOverviewChart", () => ({
  WeeklyOverviewChart: () => <div data-testid="weekly-overview-chart">Chart</div>,
}));

vi.mock("./HiringPipeline", () => ({
  HiringPipeline: () => <div data-testid="hiring-pipeline">Pipeline</div>,
}));

vi.mock("./TopOpportunities", () => ({
  TopOpportunities: () => <div data-testid="top-opportunities">Opportunities</div>,
}));

vi.mock("./RecentActivity", () => ({
  RecentActivity: () => <div data-testid="recent-activity">Activity</div>,
}));

vi.mock("./QuickActions", () => ({
  QuickActions: () => <div data-testid="quick-actions">Actions</div>,
}));

vi.mock("./WelcomeHeader", () => ({
  WelcomeHeader: ({ companyName }: { companyName: string }) => (
    <div data-testid="welcome-header">Welcome, {companyName}</div>
  ),
}));

const mockDashboardData = {
  companyName: "Test Company",
  totalApplicants: { value: 150, change: 12 },
  activeOpportunities: { value: 8, change: 2 },
  hiredThisMonth: { value: 5, change: 25 },
  pendingReviews: { value: 12, change: -3 },
  weeklyOverview: [
    { day: "Mon", applications: 10, interviews: 5 },
    { day: "Tue", applications: 15, interviews: 8 },
  ],
  hiringPipeline: {
    applied: 100,
    shortlisted: 40,
    invited: 20,
    rejected: 30,
    hired: 10,
  },
  topOpportunities: [],
  recentActivity: [],
};

describe("EmployerDashboard - Responsive Layout", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders all dashboard sections", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    render(<EmployerDashboard />);

    expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    expect(screen.getAllByTestId("stats-card")).toHaveLength(4);
    expect(screen.getByTestId("weekly-overview-chart")).toBeInTheDocument();
    expect(screen.getByTestId("hiring-pipeline")).toBeInTheDocument();
    expect(screen.getByTestId("top-opportunities")).toBeInTheDocument();
    expect(screen.getByTestId("recent-activity")).toBeInTheDocument();
    expect(screen.getByTestId("quick-actions")).toBeInTheDocument();
  });

  it("applies responsive grid classes to stat cards container", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<EmployerDashboard />);

    // Find the stat cards container
    const statsContainer = container.querySelector(
      ".grid.grid-cols-1.sm\\:grid-cols-2.lg\\:grid-cols-4"
    );
    expect(statsContainer).toBeInTheDocument();
  });

  it("applies responsive grid classes to charts section", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<EmployerDashboard />);

    // Find the charts container
    const chartsContainer = container.querySelector(
      ".grid.grid-cols-1.lg\\:grid-cols-\\[5fr_3fr\\]"
    );
    expect(chartsContainer).toBeInTheDocument();
  });

  it("applies responsive grid classes to opportunities/activity section", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<EmployerDashboard />);

    // Find the opportunities/activity container
    const opportunitiesContainer = container.querySelector(
      ".grid.grid-cols-1.lg\\:grid-cols-2"
    );
    expect(opportunitiesContainer).toBeInTheDocument();
  });

  it("displays loading skeleton when data is loading", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: undefined,
      isLoading: true,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<EmployerDashboard />);

    // Check for skeleton elements
    const skeletons = container.querySelectorAll(".animate-pulse");
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it("displays error message when data fetch fails", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: undefined,
      isLoading: false,
      isPending: false,
      error: new Error("Failed to fetch"),
    } as any);

    render(<EmployerDashboard />);

    expect(screen.getByText("Failed to load dashboard data")).toBeInTheDocument();
    expect(screen.getByText("Retry")).toBeInTheDocument();
  });

  it("applies responsive padding to main container", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<EmployerDashboard />);

    // Find the main container
    const mainContainer = container.querySelector(
      ".px-4.py-6.md\\:px-8.md\\:py-7"
    );
    expect(mainContainer).toBeInTheDocument();
  });

  it("maintains scrollable overflow for dashboard content", () => {
    mockUseRecruiterDashboard.mockReturnValue({
      data: mockDashboardData,
      isLoading: false,
      isPending: false,
      error: null,
    } as any);

    const { container } = render(<EmployerDashboard />);

    // Find the main container with overflow
    const mainContainer = container.querySelector(".overflow-y-auto");
    expect(mainContainer).toBeInTheDocument();
  });
});
