import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TouchFriendlyTooltip } from "./TouchFriendlyTooltip";
import { useIsTouchDevice } from "@/hooks/useIsTouchDevice";

// Mock the useIsTouchDevice hook
vi.mock("@/hooks/useIsTouchDevice", () => ({
  useIsTouchDevice: vi.fn(),
}));

const mockUseIsTouchDevice = vi.mocked(useIsTouchDevice);

describe("TouchFriendlyTooltip", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should render children", () => {
    mockUseIsTouchDevice.mockReturnValue(false);
    
    render(
      <TouchFriendlyTooltip content="Test tooltip">
        <button>Test Button</button>
      </TouchFriendlyTooltip>
    );

    expect(screen.getByText("Test Button")).toBeInTheDocument();
  });

  it("should not show tooltip on hover for touch devices", () => {
    mockUseIsTouchDevice.mockReturnValue(true);
    
    render(
      <TouchFriendlyTooltip content="Test tooltip">
        <button>Test Button</button>
      </TouchFriendlyTooltip>
    );

    const button = screen.getByText("Test Button");
    fireEvent.mouseEnter(button);

    // Should not show tooltip on hover for touch devices
    expect(screen.queryByText("Test tooltip")).not.toBeInTheDocument();
  });

  it("should apply custom className", () => {
    mockUseIsTouchDevice.mockReturnValue(false);
    
    const { container } = render(
      <TouchFriendlyTooltip content="Test tooltip" className="custom-class">
        <button>Test Button</button>
      </TouchFriendlyTooltip>
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });
});