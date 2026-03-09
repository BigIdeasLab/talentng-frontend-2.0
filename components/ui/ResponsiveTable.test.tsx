import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { ResponsiveTable, ColumnDef, RowAction } from "./ResponsiveTable";
import * as useBreakpointModule from "@/hooks/useBreakpoint";

// Mock the useBreakpoint hook
vi.mock("@/hooks/useBreakpoint");

interface TestData {
  id: string;
  name: string;
  email: string;
  role: string;
  status: string;
}

const mockData: TestData[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    status: "Active",
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Designer",
    status: "Inactive",
  },
];

const mockColumns: ColumnDef<TestData>[] = [
  {
    key: "name",
    label: "Name",
    essential: true,
    accessor: (item) => item.name,
  },
  {
    key: "email",
    label: "Email",
    essential: true,
    accessor: (item) => item.email,
  },
  {
    key: "role",
    label: "Role",
    essential: false,
    accessor: (item) => item.role,
  },
  {
    key: "status",
    label: "Status",
    essential: true,
    accessor: (item) => item.status,
  },
];

const mockActions: RowAction<TestData>[] = [
  {
    key: "edit",
    label: "Edit",
    onClick: vi.fn(),
  },
  {
    key: "delete",
    label: "Delete",
    onClick: vi.fn(),
  },
];

describe("ResponsiveTable", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe("Desktop view (lg breakpoint)", () => {
    beforeEach(() => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("lg");
    });

    it("renders all columns on desktop", () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />);

      // Check all column headers are visible
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Role")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();
    });

    it("renders all data rows on desktop", () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();

      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
      expect(screen.getByText("Designer")).toBeInTheDocument();
      expect(screen.getByText("Inactive")).toBeInTheDocument();
    });

    it("renders action buttons on desktop", () => {
      render(
        <ResponsiveTable
          data={mockData}
          columns={mockColumns}
          actions={mockActions}
        />,
      );

      // Should have action buttons for each row
      const editButtons = screen.getAllByText("Edit");
      const deleteButtons = screen.getAllByText("Delete");

      expect(editButtons).toHaveLength(2);
      expect(deleteButtons).toHaveLength(2);
    });

    it("calls action onClick handler when button is clicked", () => {
      render(
        <ResponsiveTable
          data={mockData}
          columns={mockColumns}
          actions={mockActions}
        />,
      );

      const editButtons = screen.getAllByText("Edit");
      fireEvent.click(editButtons[0]);

      expect(mockActions[0].onClick).toHaveBeenCalledWith(mockData[0]);
    });

    it("shows row numbers when showRowNumbers is true", () => {
      render(
        <ResponsiveTable
          data={mockData}
          columns={mockColumns}
          showRowNumbers={true}
        />,
      );

      expect(screen.getByText("S/N")).toBeInTheDocument();
      expect(screen.getByText("1.")).toBeInTheDocument();
      expect(screen.getByText("2.")).toBeInTheDocument();
    });
  });

  describe("Tablet view (md breakpoint)", () => {
    beforeEach(() => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("md");
    });

    it("renders only essential columns on tablet", () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />);

      // Essential columns should be visible
      expect(screen.getByText("Name")).toBeInTheDocument();
      expect(screen.getByText("Email")).toBeInTheDocument();
      expect(screen.getByText("Status")).toBeInTheDocument();

      // Non-essential column should not be visible
      expect(screen.queryByText("Role")).not.toBeInTheDocument();
    });

    it("renders data for essential columns only", () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />);

      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();

      // Non-essential data should not be visible
      expect(screen.queryByText("Developer")).not.toBeInTheDocument();
    });
  });

  describe("Mobile view (xs/sm breakpoint)", () => {
    beforeEach(() => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("xs");
    });

    it("renders card-based layout on mobile", () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />);

      // Should render cards instead of table
      // Check for column labels within cards
      const nameLabels = screen.getAllByText("Name");
      const emailLabels = screen.getAllByText("Email");

      expect(nameLabels.length).toBeGreaterThan(1); // Header + cards
      expect(emailLabels.length).toBeGreaterThan(1);
    });

    it("renders all column data in mobile cards", () => {
      render(<ResponsiveTable data={mockData} columns={mockColumns} />);

      // All data should be visible in cards
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("john@example.com")).toBeInTheDocument();
      expect(screen.getByText("Developer")).toBeInTheDocument();
      expect(screen.getByText("Active")).toBeInTheDocument();
    });

    it("renders actions dropdown on mobile", () => {
      render(
        <ResponsiveTable
          data={mockData}
          columns={mockColumns}
          actions={mockActions}
        />,
      );

      // Should have action dropdown triggers
      const actionButtons = screen.getAllByText("Actions");
      expect(actionButtons).toHaveLength(2); // One per row
    });

    it("uses custom mobile card renderer when provided", () => {
      const customRenderer = vi.fn((item: TestData) => (
        <div data-testid="custom-card">{item.name}</div>
      ));

      render(
        <ResponsiveTable
          data={mockData}
          columns={mockColumns}
          mobileCardRenderer={customRenderer}
        />,
      );

      expect(customRenderer).toHaveBeenCalledTimes(2);
      expect(screen.getAllByTestId("custom-card")).toHaveLength(2);
    });
  });

  describe("Empty state", () => {
    it("renders empty message when no data", () => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("lg");

      render(<ResponsiveTable data={[]} columns={mockColumns} />);

      expect(screen.getByText("No data found")).toBeInTheDocument();
    });

    it("renders custom empty message", () => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("lg");

      render(
        <ResponsiveTable
          data={[]}
          columns={mockColumns}
          emptyMessage="No users available"
        />,
      );

      expect(screen.getByText("No users available")).toBeInTheDocument();
    });
  });

  describe("Custom rendering", () => {
    it("uses custom render function for column", () => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("lg");

      const customColumns: ColumnDef<TestData>[] = [
        {
          key: "name",
          label: "Name",
          render: (item) => <strong>{item.name.toUpperCase()}</strong>,
        },
      ];

      render(<ResponsiveTable data={mockData} columns={customColumns} />);

      expect(screen.getByText("JOHN DOE")).toBeInTheDocument();
      expect(screen.getByText("JANE SMITH")).toBeInTheDocument();
    });
  });

  describe("Key extraction", () => {
    it("uses custom keyExtractor when provided", () => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("lg");

      const keyExtractor = vi.fn((item: TestData) => `user-${item.id}`);

      render(
        <ResponsiveTable
          data={mockData}
          columns={mockColumns}
          keyExtractor={keyExtractor}
        />,
      );

      expect(keyExtractor).toHaveBeenCalledTimes(2);
    });

    it("uses id property as default key", () => {
      vi.spyOn(useBreakpointModule, "useBreakpoint").mockReturnValue("lg");

      const { container } = render(
        <ResponsiveTable data={mockData} columns={mockColumns} />,
      );

      // Check that rows are rendered (implementation detail, but verifies keys work)
      const rows = container.querySelectorAll(".hover\\:bg-gray-50\\/50");
      expect(rows).toHaveLength(2);
    });
  });
});
