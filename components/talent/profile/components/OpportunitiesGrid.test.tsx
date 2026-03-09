import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { OpportunitiesGrid } from "./OpportunitiesGrid";

// Mock the ResponsiveGrid component
vi.mock("@/components/ui/ResponsiveGrid", () => ({
  ResponsiveGrid: ({ children, columns, gap }: any) => (
    <div data-testid="responsive-grid" data-columns={columns} data-gap={gap}>
      {children}
    </div>
  ),
}));

// Mock the hooks
vi.mock("@/hooks/useTalentOpportunities", () => ({
  useSaveOpportunity: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
  useUnsaveOpportunity: () => ({
    mutateAsync: vi.fn(),
    isPending: false,
  }),
}));

vi.mock("@/hooks", () => ({
  useProfile: () => ({
    activeRole: "talent",
  }),
}));

vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

// Mock the ApplicationModal
vi.mock("@/components/talent/opportunities/application-modal", () => ({
  ApplicationModal: () => <div data-testid="application-modal" />,
}));

// Mock the EmptyState
vi.mock("./EmptyState", () => ({
  EmptyState: ({ title }: { title: string }) => (
    <div data-testid="empty-state">{title}</div>
  ),
}));

const mockOpportunities = [
  {
    id: "1",
    companyName: "Test Company",
    companyLogo: "/logo.png",
    date: "Nov 16",
    type: "internship" as const,
    title: "Product Designer",
    skills: ["UI Design", "UX Research"],
    rate: "$250 / Month",
    isSaved: true,
  },
  {
    id: "2",
    companyName: "Another Company",
    companyLogo: "/logo2.png",
    date: "Dec 01",
    type: "job_listing" as const,
    title: "Senior Designer",
    skills: ["Web Design", "Prototyping"],
    rate: "$85/hr",
    isSaved: false,
  },
];

describe("OpportunitiesGrid", () => {
  it("renders opportunities using ResponsiveGrid", () => {
    render(<OpportunitiesGrid opportunities={mockOpportunities} />);

    const grid = screen.getByTestId("responsive-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("data-columns", "3");
    expect(grid).toHaveAttribute("data-gap", "2");
  });

  it("renders all opportunity cards", () => {
    render(<OpportunitiesGrid opportunities={mockOpportunities} />);

    expect(screen.getByText("Product Designer")).toBeInTheDocument();
    expect(screen.getByText("Senior Designer")).toBeInTheDocument();
  });

  it("displays loading state", () => {
    render(<OpportunitiesGrid opportunities={[]} isLoading={true} />);

    expect(screen.getByText("Loading opportunities...")).toBeInTheDocument();
  });

  it("displays empty state when no opportunities", () => {
    render(<OpportunitiesGrid opportunities={[]} />);

    expect(screen.getByTestId("empty-state")).toBeInTheDocument();
    expect(screen.getByText("No saved opportunities yet")).toBeInTheDocument();
  });

  it("displays opportunity type badges correctly", () => {
    render(<OpportunitiesGrid opportunities={mockOpportunities} />);

    expect(screen.getByText("Internship")).toBeInTheDocument();
    expect(screen.getByText("Job Listing")).toBeInTheDocument();
  });

  it("displays skills for each opportunity", () => {
    render(<OpportunitiesGrid opportunities={mockOpportunities} />);

    expect(screen.getByText("UI Design")).toBeInTheDocument();
    expect(screen.getByText("UX Research")).toBeInTheDocument();
    expect(screen.getByText("Web Design")).toBeInTheDocument();
    expect(screen.getByText("Prototyping")).toBeInTheDocument();
  });

  it("displays rates for each opportunity", () => {
    render(<OpportunitiesGrid opportunities={mockOpportunities} />);

    expect(screen.getByText("$250 / Month")).toBeInTheDocument();
    expect(screen.getByText("$85/hr")).toBeInTheDocument();
  });
});
