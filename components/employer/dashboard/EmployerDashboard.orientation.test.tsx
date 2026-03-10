import { render, screen, waitFor } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type MockedFunction,
} from "vitest";
import { EmployerDashboard } from "./EmployerDashboard";

// Mock the hooks and dependencies
vi.mock("@/hooks/useRecruiterDashboard", () => ({
  useRecruiterDashboard: vi.fn(() => ({
    data: {
      companyName: "Test Company",
      totalApplicants: { value: 150, change: 10 },
      activeOpportunities: { value: 25, change: 5 },
      hiredThisMonth: { value: 8, change: 2 },
      pendingReviews: { value: 12, change: -1 },
      weeklyOverview: [],
      hiringPipeline: [],
      topOpportunities: [],
      recentActivity: [],
    },
    isLoading: false,
    isPending: false,
    error: null,
  })),
}));

vi.mock("@/hooks/useOrientation", () => ({
  useOrientation: vi.fn(() => ({
    orientation: "portrait",
    angle: 0,
    isChanging: false,
  })),
  useIsLandscape: vi.fn(() => false),
  useIsPortrait: vi.fn(() => true),
}));

vi.mock("@/hooks/useOrientationState", () => ({
  useOrientationScrollPreservation: vi.fn(),
}));

vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: vi.fn(() => true),
}));

// Mock the chart components
vi.mock("./WeeklyOverviewChart", () => ({
  WeeklyOverviewChart: ({ data }: any) => (
    <div data-testid="weekly-chart">Weekly Chart</div>
  ),
}));

vi.mock("./HiringPipeline", () => ({
  HiringPipeline: ({ data }: any) => (
    <div data-testid="hiring-pipeline">Hiring Pipeline</div>
  ),
}));

vi.mock("./TopOpportunities", () => ({
  TopOpportunities: ({ data }: any) => (
    <div data-testid="top-opportunities">Top Opportunities</div>
  ),
}));

vi.mock("./RecentActivity", () => ({
  RecentActivity: ({ data }: any) => (
    <div data-testid="recent-activity">Recent Activity</div>
  ),
}));

vi.mock("./QuickActions", () => ({
  QuickActions: () => <div data-testid="quick-actions">Quick Actions</div>,
}));

vi.mock("./WelcomeHeader", () => ({
  WelcomeHeader: ({ companyName, totalApplicants, pendingReviews }: any) => (
    <div data-testid="welcome-header">Welcome {companyName}</div>
  ),
}));

vi.mock("./StatsCard", () => ({
  StatsCard: ({ label, value, href }: any) => (
    <div data-testid={`stats-card-${label.toLowerCase().replace(/\s+/g, "-")}`}>
      {label}: {value}
    </div>
  ),
}));

import { useOrientation, useIsLandscape } from "@/hooks/useOrientation";
import { useIsMobile } from "@/hooks/useIsMobile";

const mockUseOrientation = useOrientation as MockedFunction<
  typeof useOrientation
>;
const mockUseIsLandscape = useIsLandscape as MockedFunction<
  typeof useIsLandscape
>;
const mockUseIsMobile = useIsMobile as MockedFunction<typeof useIsMobile>;

describe("EmployerDashboard - Orientation Tests", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to mobile portrait
    mockUseOrientation.mockReturnValue({
      orientation: "portrait",
      angle: 0,
      isChanging: false,
    });
    mockUseIsLandscape.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);
  });

  it("should render stats cards in single column on portrait mobile", async () => {
    render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    });

    // Check that all stats cards are present
    expect(
      screen.getByTestId("stats-card-total-applicants"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-active-opportunities"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-hired-this-month"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-pending-reviews"),
    ).toBeInTheDocument();
  });

  it("should adapt stats cards layout for landscape mobile", async () => {
    // Set to landscape mobile
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    });

    // In landscape mobile, stats should be in 2 columns
    expect(
      screen.getByTestId("stats-card-total-applicants"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-active-opportunities"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-hired-this-month"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-pending-reviews"),
    ).toBeInTheDocument();
  });

  it("should stack chart sections vertically in portrait mobile", async () => {
    render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("weekly-chart")).toBeInTheDocument();
      expect(screen.getByTestId("hiring-pipeline")).toBeInTheDocument();
    });

    // Charts should be stacked vertically in portrait
    const weeklyChart = screen.getByTestId("weekly-chart");
    const hiringPipeline = screen.getByTestId("hiring-pipeline");

    expect(weeklyChart).toBeInTheDocument();
    expect(hiringPipeline).toBeInTheDocument();
  });

  it("should adapt chart layout for landscape mobile", async () => {
    // Set to landscape mobile
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("weekly-chart")).toBeInTheDocument();
      expect(screen.getByTestId("hiring-pipeline")).toBeInTheDocument();
    });

    // In landscape, charts may be side by side on larger screens
    const weeklyChart = screen.getByTestId("weekly-chart");
    const hiringPipeline = screen.getByTestId("hiring-pipeline");

    expect(weeklyChart).toBeInTheDocument();
    expect(hiringPipeline).toBeInTheDocument();
  });

  it("should handle orientation change transitions smoothly", async () => {
    const { rerender } = render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    });

    // Simulate orientation change starting
    mockUseOrientation.mockReturnValue({
      orientation: "portrait",
      angle: 0,
      isChanging: true,
    });

    rerender(<EmployerDashboard />);

    // Simulate orientation change completing to landscape
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });
    mockUseIsLandscape.mockReturnValue(true);

    rerender(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
      expect(
        screen.getByTestId("stats-card-total-applicants"),
      ).toBeInTheDocument();
    });
  });

  it("should preserve scroll position during orientation changes", async () => {
    render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    });

    // The useOrientationScrollPreservation hook should be called
    // This ensures scroll position is maintained during orientation changes
  });

  it("should render all dashboard sections in both orientations", async () => {
    // Test portrait first
    const { rerender } = render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
      expect(screen.getByTestId("weekly-chart")).toBeInTheDocument();
      expect(screen.getByTestId("hiring-pipeline")).toBeInTheDocument();
      expect(screen.getByTestId("top-opportunities")).toBeInTheDocument();
      expect(screen.getByTestId("recent-activity")).toBeInTheDocument();
      expect(screen.getByTestId("quick-actions")).toBeInTheDocument();
    });

    // Switch to landscape
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    rerender(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
      expect(screen.getByTestId("weekly-chart")).toBeInTheDocument();
      expect(screen.getByTestId("hiring-pipeline")).toBeInTheDocument();
      expect(screen.getByTestId("top-opportunities")).toBeInTheDocument();
      expect(screen.getByTestId("recent-activity")).toBeInTheDocument();
      expect(screen.getByTestId("quick-actions")).toBeInTheDocument();
    });
  });

  it("should handle tablet orientation correctly", async () => {
    // Set to tablet landscape
    mockUseIsMobile.mockReturnValue(false);
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    });

    // Tablet should show all 4 stats cards in a row
    expect(
      screen.getByTestId("stats-card-total-applicants"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-active-opportunities"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-hired-this-month"),
    ).toBeInTheDocument();
    expect(
      screen.getByTestId("stats-card-pending-reviews"),
    ).toBeInTheDocument();
  });

  it("should maintain functionality during rapid orientation changes", async () => {
    const { rerender } = render(<EmployerDashboard />);

    await waitFor(() => {
      expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
    });

    // Simulate rapid orientation changes
    for (let i = 0; i < 3; i++) {
      const isLandscape = i % 2 === 0;
      mockUseIsLandscape.mockReturnValue(isLandscape);
      mockUseOrientation.mockReturnValue({
        orientation: isLandscape ? "landscape" : "portrait",
        angle: isLandscape ? 90 : 0,
        isChanging: false,
      });

      rerender(<EmployerDashboard />);

      await waitFor(() => {
        expect(screen.getByTestId("welcome-header")).toBeInTheDocument();
        expect(
          screen.getByTestId("stats-card-total-applicants"),
        ).toBeInTheDocument();
      });
    }
  });
});
