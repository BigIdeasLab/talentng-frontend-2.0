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
    const { container } = render(<TalentGrid talents={mockTalents} />);

    const grids = container.querySelectorAll('[data-testid="responsive-grid"]');
    expect(grids.length).toBeGreaterThan(0);
    grids.forEach((grid) => {
      expect(grid).toHaveAttribute("data-columns", "3");
      expect(grid).toHaveAttribute("data-gap", "2");
    });
  });

  it("renders all talent cards", () => {
    const { container } = render(<TalentGrid talents={mockTalents} />);

    const card1Elements = container.querySelectorAll('[data-testid="talent-card-1"]');
    expect(card1Elements.length).toBeGreaterThan(0);
    const card2Elements = container.querySelectorAll('[data-testid="talent-card-2"]');
    expect(card2Elements.length).toBeGreaterThan(0);
  });

  it("displays correct talent count", () => {
    render(<TalentGrid talents={mockTalents} totalTalents={10} />);

    const countElements = screen.getAllByText("10 talents found");
    expect(countElements.length).toBeGreaterThan(0);
  });

  it("displays singular form for single talent", () => {
    render(<TalentGrid talents={[mockTalents[0]]} totalTalents={1} />);

    const countElements = screen.getAllByText("1 talent found");
    expect(countElements.length).toBeGreaterThan(0);
  });

  it("displays empty state when no talents", () => {
    render(<TalentGrid talents={[]} />);

    const emptyElements = screen.getAllByText("No talents found");
    expect(emptyElements.length).toBeGreaterThan(0);
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

    const pageElements = screen.getAllByText("Page 2 of 5");
    expect(pageElements.length).toBeGreaterThan(0);
    const prevButtons = screen.getAllByText("Previous");
    expect(prevButtons.length).toBeGreaterThan(0);
    const nextButtons = screen.getAllByText("Next");
    expect(nextButtons.length).toBeGreaterThan(0);
  });
});
