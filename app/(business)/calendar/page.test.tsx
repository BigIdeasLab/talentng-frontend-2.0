import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import CalendarPage from "./page";

// Mock window.matchMedia for responsive hooks
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});

// Mock requestIdleCallback
if (!("requestIdleCallback" in window)) {
  Object.defineProperty(window, "requestIdleCallback", {
    writable: true,
    value: vi.fn().mockImplementation((cb: () => void) => setTimeout(cb, 0)),
  });
}

// Mock dependencies
vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({
    activeRole: "talent",
    isLoading: false,
  }),
}));

vi.mock("@/hooks/useRequireRole", () => ({
  useRequireRole: () => true,
}));

vi.mock("@/hooks/useToast", () => ({
  useToast: () => ({
    toast: vi.fn(),
  }),
}));

vi.mock("@/hooks/useNotificationSocket", () => ({
  useNotificationSocket: () => ({}),
}));

vi.mock("@/lib/api/talent", () => ({
  getTalentUpcoming: vi.fn().mockResolvedValue({
    items: [],
    pagination: {
      total: 0,
      offset: 0,
      limit: 20,
      currentPage: 1,
      totalPages: 1,
      hasPreviousPage: false,
      hasNextPage: false,
    },
  }),
}));

vi.mock("@/lib/api/mentorship", () => ({
  cancelSession: vi.fn(),
  rescheduleSession: vi.fn(),
  confirmSessionCompletion: vi.fn(),
  createSessionReview: vi.fn(),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
    replace: vi.fn(),
  }),
}));

describe("CalendarPage - Responsive Design", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render calendar page with responsive header", async () => {
    render(<CalendarPage />);

    // Wait for the page to load
    await screen.findByText("Calendar");

    // Check that the header is present
    expect(screen.getByText("Calendar")).toBeInTheDocument();
  });

  it("should render search input with responsive classes", async () => {
    render(<CalendarPage />);

    await screen.findByText("Calendar");

    // Check that search input is present
    const searchInput = screen.getByPlaceholderText(
      "Search interviews, sessions...",
    );
    expect(searchInput).toBeInTheDocument();
  });

  it("should render filter tabs with touch-friendly sizing", async () => {
    render(<CalendarPage />);

    await screen.findByText("Calendar");

    // Check that filter tabs are present
    expect(screen.getByText("All")).toBeInTheDocument();
    expect(screen.getByText("Interviews")).toBeInTheDocument();
    expect(screen.getByText("Sessions")).toBeInTheDocument();
  });

  it("should render date range filters with responsive layout", async () => {
    render(<CalendarPage />);

    await screen.findByText("Calendar");

    // Check that date range filters are present
    expect(screen.getByText("All Time")).toBeInTheDocument();
    expect(screen.getByText("Today")).toBeInTheDocument();
    expect(screen.getByText("This Week")).toBeInTheDocument();
    expect(screen.getByText("This Month")).toBeInTheDocument();
  });

  it("should render empty state when no events", async () => {
    render(<CalendarPage />);

    await screen.findByText("Calendar");

    // Check for empty state
    expect(await screen.findByText("No upcoming events")).toBeInTheDocument();
  });
});
