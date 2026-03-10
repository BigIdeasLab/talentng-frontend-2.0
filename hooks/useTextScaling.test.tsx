import { renderHook, act } from "@testing-library/react";
import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useTextScaling, TextScalingControls } from "./useTextScaling";

// Mock localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  removeItem: vi.fn(),
  clear: vi.fn(),
};
Object.defineProperty(window, "localStorage", {
  value: localStorageMock,
});

// Mock CSS.supports
Object.defineProperty(window, "CSS", {
  value: {
    supports: vi.fn(() => true),
  },
});

describe("useTextScaling", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);

    // Mock document.documentElement.style.setProperty
    Object.defineProperty(document.documentElement, "style", {
      value: {
        setProperty: vi.fn(),
      },
      writable: true,
    });
  });

  it("initializes with normal text scale", () => {
    const { result } = renderHook(() => useTextScaling());

    expect(result.current.textScale).toBe("normal");
    expect(result.current.scaleValue).toBe(1);
    expect(result.current.isSupported).toBe(true);
  });

  it("loads saved text scale from localStorage", () => {
    localStorageMock.getItem.mockReturnValue("large");

    const { result } = renderHook(() => useTextScaling());

    expect(result.current.textScale).toBe("large");
    expect(result.current.scaleValue).toBe(1.25);
  });

  it("sets text scale level and saves to localStorage", () => {
    const { result } = renderHook(() => useTextScaling());

    act(() => {
      result.current.setTextScaleLevel("larger");
    });

    expect(result.current.textScale).toBe("larger");
    expect(result.current.scaleValue).toBe(1.5);
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "text-scale",
      "larger",
    );
  });

  it("resets text scale to normal", () => {
    const { result } = renderHook(() => useTextScaling());

    act(() => {
      result.current.setTextScaleLevel("largest");
    });

    expect(result.current.textScale).toBe("largest");

    act(() => {
      result.current.resetTextScale();
    });

    expect(result.current.textScale).toBe("normal");
    expect(result.current.scaleValue).toBe(1);
  });

  it("applies CSS custom property when scaling changes", () => {
    const { result } = renderHook(() => useTextScaling());
    const setPropertySpy = document.documentElement.style
      .setProperty as ReturnType<typeof vi.fn>;

    act(() => {
      result.current.setTextScaleLevel("large");
    });

    expect(setPropertySpy).toHaveBeenCalledWith("--text-scale", "1.25");
  });
});

describe("TextScalingControls", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  it("renders all text scaling options", () => {
    render(<TextScalingControls />);

    expect(screen.getByText("Normal")).toBeInTheDocument();
    expect(screen.getByText("Large")).toBeInTheDocument();
    expect(screen.getByText("Larger")).toBeInTheDocument();
    expect(screen.getByText("Largest")).toBeInTheDocument();
    expect(screen.getByText("Reset to default")).toBeInTheDocument();
  });

  it("shows current selection with proper ARIA attributes", () => {
    render(<TextScalingControls />);

    const normalButton = screen.getByText("Normal");
    expect(normalButton).toHaveAttribute("aria-pressed", "true");

    const largeButton = screen.getByText("Large");
    expect(largeButton).toHaveAttribute("aria-pressed", "false");
  });

  it("changes text scale when button is clicked", () => {
    render(<TextScalingControls />);

    const largeButton = screen.getByText("Large");
    fireEvent.click(largeButton);

    expect(largeButton).toHaveAttribute("aria-pressed", "true");
    expect(localStorageMock.setItem).toHaveBeenCalledWith(
      "text-scale",
      "large",
    );
  });

  it("resets text scale when reset button is clicked", () => {
    render(<TextScalingControls />);

    // First set to large
    const largeButton = screen.getByText("Large");
    fireEvent.click(largeButton);

    // Then reset
    const resetButton = screen.getByText("Reset to default");
    fireEvent.click(resetButton);

    const normalButton = screen.getByText("Normal");
    expect(normalButton).toHaveAttribute("aria-pressed", "true");
  });

  it("has proper accessibility attributes", () => {
    render(<TextScalingControls />);

    const group = screen.getByRole("group");
    expect(group).toHaveAttribute("aria-labelledby", "text-scaling-label");

    const label = screen.getByText("Text Size");
    expect(label).toHaveAttribute("id", "text-scaling-label");
  });

  it("includes screen reader descriptions", () => {
    render(<TextScalingControls />);

    const normalDesc = screen.getByText("Normal text size (100%)");
    const largeDesc = screen.getByText("Large text size (125%)");
    const largerDesc = screen.getByText("Larger text size (150%)");
    const largestDesc = screen.getByText("Largest text size (200%)");

    // These are inside a parent <div className="sr-only">
    expect(normalDesc.parentElement).toHaveClass("sr-only");
    expect(largeDesc.parentElement).toHaveClass("sr-only");
    expect(largerDesc.parentElement).toHaveClass("sr-only");
    expect(largestDesc.parentElement).toHaveClass("sr-only");
  });

  it("applies custom className", () => {
    render(<TextScalingControls className="custom-controls" />);

    const group = screen.getByRole("group");
    expect(group).toHaveClass("custom-controls");
  });

  it("has minimum touch target size for buttons", () => {
    render(<TextScalingControls />);

    const buttons = screen.getAllByRole("button");
    buttons.forEach((button) => {
      expect(button).toHaveClass("min-h-[44px]");
    });
  });
});
