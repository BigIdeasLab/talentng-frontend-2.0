import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TalentGrid } from "./TalentGrid";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

// Mock the ResponsiveGrid component
vi.mock("@/components/ui/ResponsiveGrid", () => ({
  ResponsiveGrid: ({ children, columns, gap }: any) => (
    <div data-testid="responsive-grid" data-columns={columns} data-gap={gap}>
      {children}
    </div>
  ),
}));

// Mock the TalentCard component
vi.mock("./TalentCard", () => ({
  TalentCard: ({ talent }: { talent: TalentData }) => (
    <div data-testid={`talent-card-${talent.id}`}>{talent.fullName}</div>
  ),
}));

const mockTalents: TalentData[] = [
  {
    id: 1,
    userId: "user-1",
    fullName: "John Doe",
    headline: "Senior Designer",
    location: "New York, NY",
    timesHired: 5,
    earnings: 10000,
    avatar: "/images/profile1.jpg",
    gallery: [],
    skills: ["UI Design", "UX Research"],
    stack: ["Figma", "Sketch"],
    availability: ["Full-time"],
    category: "Design",
    createdAt: "2024-01-01T00:00:00Z",
  },
  {
    id: 2,
    userId: "user-2",
    fullName: "Jane Smith",
    headline: "Product Designer",
    location: "San Francisco, CA",
    timesHired: 3,
    earnings: 8000,
    avatar: "/images/profile2.jpg",
    gallery: [],
    skills: ["Product Design", "Prototyping"],
    stack: ["Figma", "Adobe XD"],
    availability: ["Contract"],
    category: "Design",
    createdAt: "2024-02-01T00:00:00Z",
  },
];

describe("TalentGrid", () => {
  it("renders talent cards using ResponsiveGrid", () => {
    render(<TalentGrid talents={mockTalents} />);

    const grid = screen.getByTestId("responsive-grid");
    expect(grid).toBeInTheDocument();
    expect(grid).toHaveAttribute("data-columns", "3");
    expect(grid).toHaveAttribute("data-gap", "2");
  });

  it("renders all talent cards", () => {
    render(<TalentGrid talents={mockTalents} />);

    expect(screen.getByTestId("talent-card-1")).toBeInTheDocument();
    expect(screen.getByTestId("talent-card-2")).toBeInTheDocument();
  });

  it("displays correct talent count", () => {
    render(<TalentGrid talents={mockTalents} totalTalents={10} />);

    expect(screen.getByText("10 talents found")).toBeInTheDocument();
  });

  it("displays singular form for single talent", () => {
    render(<TalentGrid talents={[mockTalents[0]]} totalTalents={1} />);

    expect(screen.getByText("1 talent found")).toBeInTheDocument();
  });

  it("displays empty state when no talents", () => {
    render(<TalentGrid talents={[]} />);

    expect(screen.getByText("No talents found")).toBeInTheDocument();
  });

  it("displays pagination controls", () => {
    render(
      <TalentGrid
        talents={mockTalents}
        currentPage={2}
        totalPages={5}
        hasNextPage={true}
        hasPreviousPage={true}
      />,
    );

    expect(screen.getByText("Page 2 of 5")).toBeInTheDocument();
    expect(screen.getByText("Previous")).toBeInTheDocument();
    expect(screen.getByText("Next")).toBeInTheDocument();
  });
});
