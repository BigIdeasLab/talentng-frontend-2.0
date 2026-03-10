import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { SwipeableNotificationItem } from "./SwipeableNotificationItem";

// Mock the useSwipeGesture hook
vi.mock("@/hooks/useSwipeGesture", () => ({
  useSwipeGesture: vi.fn(() => ({
    ref: { current: null },
    onTouchStart: vi.fn(),
    onTouchMove: vi.fn(),
    onTouchEnd: vi.fn(),
  })),
}));

describe("SwipeableNotificationItem", () => {
  const mockOnDismiss = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <SwipeableNotificationItem onDismiss={mockOnDismiss}>
        <div>Test notification content</div>
      </SwipeableNotificationItem>,
    );

    expect(screen.getByText("Test notification content")).toBeInTheDocument();
  });

  it("applies custom className", () => {
    const { container } = render(
      <SwipeableNotificationItem
        onDismiss={mockOnDismiss}
        className="custom-class"
      >
        <div>Test content</div>
      </SwipeableNotificationItem>,
    );

    expect(container.firstChild).toHaveClass("custom-class");
  });

  it("renders with default props when enabled is not specified", () => {
    const { container } = render(
      <SwipeableNotificationItem onDismiss={mockOnDismiss}>
        <div>Test content</div>
      </SwipeableNotificationItem>,
    );

    expect(container.firstChild).toHaveClass("relative", "overflow-hidden");
  });

  it("renders notification content in relative container", () => {
    render(
      <SwipeableNotificationItem onDismiss={mockOnDismiss}>
        <div data-testid="notification-content">Test content</div>
      </SwipeableNotificationItem>,
    );

    const content = screen.getByTestId("notification-content");
    expect(content.parentElement).toHaveClass("relative", "bg-white");
  });

  it("can be disabled", () => {
    render(
      <SwipeableNotificationItem onDismiss={mockOnDismiss} enabled={false}>
        <div>Test content</div>
      </SwipeableNotificationItem>,
    );

    // Should still render but swipe functionality would be disabled
    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("accepts custom threshold", () => {
    render(
      <SwipeableNotificationItem onDismiss={mockOnDismiss} threshold={150}>
        <div>Test content</div>
      </SwipeableNotificationItem>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("handles missing onDismiss prop", () => {
    render(
      <SwipeableNotificationItem>
        <div>Test content</div>
      </SwipeableNotificationItem>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });
});
