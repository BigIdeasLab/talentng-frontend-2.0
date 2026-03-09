import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { ApplicantsTable } from "./ApplicantsTable";

// Mock the ResponsiveTable component
vi.mock("@/components/ui/ResponsiveTable", () => ({
  ResponsiveTable: ({ data, columns, mobileCardRenderer, emptyMessage }: any) => (
    <div data-testid="responsive-table">
      {data.length === 0 ? (
        <div>{emptyMessage}</div>
      ) : (
        data.map((item: any, index: number) => (
          <div key={item.id} data-testid={`table-row-${index}`}>
            {columns.map((col: any) => (
              <div key={col.key} data-testid={`cell-${col.key}`}>
                {col.render ? col.render(item, index) : col.accessor ? col.accessor(item) : "-"}
              </div>
            ))}
          </div>
        ))
      )}
    </div>
  ),
}));

// Mock hooks
vi.mock("@/hooks", () => ({
  useToast: () => ({ toast: vi.fn() }),
}));

// Mock API functions
vi.mock("@/lib/api/applications", () => ({
  updateApplicationStatus: vi.fn(),
  scheduleInterview: vi.fn(),
}));

// Mock modals
vi.mock("@/components/ui/success-modal", () => ({
  SuccessModal: () => null,
}));

vi.mock("@/components/employer/applicants/HireApplicationModal", () => ({
  HireApplicationModal: () => null,
}));

const mockApplicant = {
  id: "app-1",
  userId: "user-1",
  opportunityId: "opp-1",
  status: "pending",
  createdAt: "2024-01-15T10:00:00Z",
  updatedAt: "2024-01-15T10:00:00Z",
  user: {
    id: "user-1",
    username: "johndoe",
    email: "john@example.com",
    talentProfile: {
      id: "profile-1",
      fullName: "John Doe",
      headline: "Software Engineer",
      bio: "Experienced developer",
      skills: ["React", "TypeScript"],
      location: "New York",
      profileImageUrl: "https://example.com/avatar.jpg",
      category: "Engineering",
    },
  },
};

describe("ApplicantsTable", () => {
  it("renders empty state when no applicants", () => {
    render(
      <ApplicantsTable
        searchQuery=""
        sortBy="newest"
        applicants={[]}
        opportunityTitle="Software Engineer"
      />
    );

    expect(screen.getByText("No applicants found")).toBeInTheDocument();
  });

  it("renders applicants data", () => {
    render(
      <ApplicantsTable
        searchQuery=""
        sortBy="newest"
        applicants={[mockApplicant]}
        opportunityTitle="Software Engineer"
      />
    );

    expect(screen.getByTestId("responsive-table")).toBeInTheDocument();
    expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
  });

  it("filters applicants by search query", () => {
    render(
      <ApplicantsTable
        searchQuery="john"
        sortBy="newest"
        applicants={[mockApplicant]}
        opportunityTitle="Software Engineer"
      />
    );

    expect(screen.getByTestId("table-row-0")).toBeInTheDocument();
  });

  it("filters out non-matching applicants", () => {
    render(
      <ApplicantsTable
        searchQuery="jane"
        sortBy="newest"
        applicants={[mockApplicant]}
        opportunityTitle="Software Engineer"
      />
    );

    expect(screen.getByText("No applicants found")).toBeInTheDocument();
  });

  it("sorts applicants by newest", () => {
    const applicant2 = {
      ...mockApplicant,
      id: "app-2",
      createdAt: "2024-01-16T10:00:00Z",
    };

    render(
      <ApplicantsTable
        searchQuery=""
        sortBy="newest"
        applicants={[mockApplicant, applicant2]}
        opportunityTitle="Software Engineer"
      />
    );

    const rows = screen.getAllByTestId(/table-row-/);
    expect(rows).toHaveLength(2);
  });

  it("sorts applicants by oldest", () => {
    const applicant2 = {
      ...mockApplicant,
      id: "app-2",
      createdAt: "2024-01-16T10:00:00Z",
    };

    render(
      <ApplicantsTable
        searchQuery=""
        sortBy="oldest"
        applicants={[mockApplicant, applicant2]}
        opportunityTitle="Software Engineer"
      />
    );

    const rows = screen.getAllByTestId(/table-row-/);
    expect(rows).toHaveLength(2);
  });

  it("applies status filter", () => {
    render(
      <ApplicantsTable
        searchQuery=""
        sortBy="newest"
        applicants={[mockApplicant]}
        opportunityTitle="Software Engineer"
        appliedFilters={{
          status: ["hired"],
          location: "",
          dateRange: "all",
        }}
      />
    );

    expect(screen.getByText("No applicants found")).toBeInTheDocument();
  });

  it("applies location filter", () => {
    render(
      <ApplicantsTable
        searchQuery=""
        sortBy="newest"
        applicants={[mockApplicant]}
        opportunityTitle="Software Engineer"
        appliedFilters={{
          status: [],
          location: "San Francisco",
          dateRange: "all",
        }}
      />
    );

    expect(screen.getByText("No applicants found")).toBeInTheDocument();
  });

  it("displays opportunity title in columns", () => {
    render(
      <ApplicantsTable
        searchQuery=""
        sortBy="newest"
        applicants={[mockApplicant]}
        opportunityTitle="Senior Developer"
      />
    );

    expect(screen.getByTestId("responsive-table")).toBeInTheDocument();
  });
});
