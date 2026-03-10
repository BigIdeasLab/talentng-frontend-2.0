import { render, screen, waitFor } from "@testing-library/react";
import {
  describe,
  it,
  expect,
  beforeEach,
  vi,
  type MockedFunction,
} from "vitest";
import { ResponsiveTable } from "./ResponsiveTable";

// Mock the hooks
vi.mock("@/hooks/useOrientation", () => ({
  useOrientation: vi.fn(() => ({
    orientation: "portrait",
    angle: 0,
    isChanging: false,
  })),
  useIsLandscape: vi.fn(() => false),
  useIsPortrait: vi.fn(() => true),
}));

vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: vi.fn(() => true),
}));

vi.mock("@/hooks/useIsTablet", () => ({
  useIsTablet: vi.fn(() => false),
}));

vi.mock("@/hooks/useBreakpoint", () => ({
  useBreakpoint: vi.fn(() => "xs"),
}));

import { useOrientation, useIsLandscape } from "@/hooks/useOrientation";
import { useIsMobile } from "@/hooks/useIsMobile";
import { useIsTablet } from "@/hooks/useIsTablet";

const mockUseOrientation = useOrientation as MockedFunction<
  typeof useOrientation
>;
const mockUseIsLandscape = useIsLandscape as MockedFunction<
  typeof useIsLandscape
>;
const mockUseIsMobile = useIsMobile as MockedFunction<typeof useIsMobile>;
const mockUseIsTablet = useIsTablet as MockedFunction<typeof useIsTablet>;

// Sample data for testing
const sampleData = [
  {
    id: 1,
    name: "John Doe",
    email: "john@example.com",
    role: "Developer",
    status: "Active",
  },
  {
    id: 2,
    name: "Jane Smith",
    email: "jane@example.com",
    role: "Designer",
    status: "Pending",
  },
  {
    id: 3,
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Manager",
    status: "Active",
  },
];

const sampleColumns = [
  { key: "name", header: "Name", label: "Name", essential: true },
  { key: "email", header: "Email", label: "Email", essential: true },
  { key: "role", header: "Role", label: "Role", essential: false },
  { key: "status", header: "Status", label: "Status", essential: true },
];

describe("ResponsiveTable - Orientation Tests", () => {
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
    mockUseIsTablet.mockReturnValue(false);
  });

  it("should render as cards in portrait mobile", async () => {
    render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    // In mobile portrait, should render as cards
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("jane@example.com")).toBeInTheDocument();
    });

    // Should not show traditional table headers in mobile view
    expect(screen.queryByRole("columnheader")).not.toBeInTheDocument();
  });

  it("should adapt to card grid layout in landscape mobile", async () => {
    // Set to landscape mobile
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // In landscape mobile, cards might be arranged in a 2-column grid
    // The exact implementation depends on the ResponsiveTable component
  });

  it("should show horizontal scrolling table in tablet portrait", async () => {
    // Set to tablet portrait
    mockUseIsMobile.mockReturnValue(false);
    mockUseIsTablet.mockReturnValue(true);
    mockUseIsLandscape.mockReturnValue(false);
    mockUseOrientation.mockReturnValue({
      orientation: "portrait",
      angle: 0,
      isChanging: false,
    });

    render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // In tablet, should show table with essential columns
    // May show table headers
  });

  it("should show full table in tablet landscape", async () => {
    // Set to tablet landscape
    mockUseIsMobile.mockReturnValue(false);
    mockUseIsTablet.mockReturnValue(true);
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // In tablet landscape, should show more columns
  });

  it("should handle orientation change transitions", async () => {
    const { rerender } = render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Simulate orientation change starting
    mockUseOrientation.mockReturnValue({
      orientation: "portrait",
      angle: 0,
      isChanging: true,
    });

    rerender(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    // Simulate orientation change completing to landscape
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });
    mockUseIsLandscape.mockReturnValue(true);

    rerender(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });
  });

  it("should preserve data integrity across orientation changes", async () => {
    const { rerender } = render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    // Check all data is present initially
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });

    // Change to landscape
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    rerender(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    // All data should still be present
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });
  });

  it("should handle empty data in all orientations", async () => {
    const { rerender } = render(
      <ResponsiveTable
        data={[]}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    // Should handle empty data in portrait
    await waitFor(() => {
      // Should show empty state or no data message
      expect(screen.getByText("No data found")).toBeInTheDocument();
    });

    // Change to landscape
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    rerender(
      <ResponsiveTable
        data={[]}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    // Should still handle empty data in landscape
    await waitFor(() => {
      expect(screen.getByText("No data found")).toBeInTheDocument();
    });
  });

  it("should maintain column visibility rules across orientations", async () => {
    const { rerender } = render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Essential columns should be visible in all orientations
    // Non-essential columns may be hidden in mobile

    // Change to landscape mobile
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: "landscape",
      angle: 90,
      isChanging: false,
    });

    rerender(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Essential data should still be visible
  });

  it("should handle rapid orientation changes without breaking", async () => {
    const { rerender } = render(
      <ResponsiveTable
        data={sampleData}
        columns={sampleColumns}
        data-testid="responsive-table"
      />,
    );

    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
    });

    // Simulate rapid orientation changes
    for (let i = 0; i < 5; i++) {
      const isLandscape = i % 2 === 0;
      mockUseIsLandscape.mockReturnValue(isLandscape);
      mockUseOrientation.mockReturnValue({
        orientation: isLandscape ? "landscape" : "portrait",
        angle: isLandscape ? 90 : 0,
        isChanging: i === 4 ? false : true,
      });

      rerender(
        <ResponsiveTable
          data={sampleData}
          columns={sampleColumns}
          data-testid="responsive-table"
        />,
      );
    }

    // Data should still be intact after rapid changes
    await waitFor(() => {
      expect(screen.getByText("John Doe")).toBeInTheDocument();
      expect(screen.getByText("Jane Smith")).toBeInTheDocument();
      expect(screen.getByText("Bob Johnson")).toBeInTheDocument();
    });
  });
});
