import { render, screen } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { SwipeableModal } from "./SwipeableModal";

// Mock the useSwipeGesture hook
vi.mock("@/hooks/useSwipeGesture", () => ({
  useSwipeGesture: vi.fn(() => ({
    ref: { current: null },
    onTouchStart: vi.fn(),
    onTouchMove: vi.fn(),
    onTouchEnd: vi.fn(),
  })),
}));

describe("SwipeableModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("renders when open", () => {
    render(
      <SwipeableModal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </SwipeableModal>
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("does not render when closed", () => {
    render(
      <SwipeableModal isOpen={false} onClose={mockOnClose}>
        <div>Modal content</div>
      </SwipeableModal>
    );

    expect(screen.queryByText("Modal content")).not.toBeInTheDocument();
  });

  it("applies mobile styles when isMobile is true", () => {
    const { container } = render(
      <SwipeableModal isOpen={true} onClose={mockOnClose} isMobile={true}>
        <div>Modal content</div>
      </SwipeableModal>
    );

    const modal = container.firstChild as HTMLElement;
    expect(modal).toHaveClass("inset-0", "z-[51]");
  });

  it("applies desktop styles when isMobile is false", () => {
    const { container } = render(
      <SwipeableModal isOpen={true} onClose={mockOnClose} isMobile={false}>
        <div>Modal content</div>
      </SwipeableModal>
    );

    const modal = container.firstChild as HTMLElement;
    expect(modal).toHaveClass("left-[600px]", "top-0", "bottom-0", "right-0", "z-50");
  });

  it("applies custom className", () => {
    const { container } = render(
      <SwipeableModal isOpen={true} onClose={mockOnClose} className="custom-modal">
        <div>Modal content</div>
      </SwipeableModal>
    );

    expect(container.firstChild).toHaveClass("custom-modal");
  });

  it("has proper accessibility attributes", () => {
    const { container } = render(
      <SwipeableModal isOpen={true} onClose={mockOnClose}>
        <div>Modal content</div>
      </SwipeableModal>
    );

    const modal = container.firstChild as HTMLElement;
    expect(modal).toHaveAttribute("role", "dialog");
    expect(modal).toHaveAttribute("aria-modal", "true");
  });

  it("can be configured with different swipe directions", () => {
    render(
      <SwipeableModal 
        isOpen={true} 
        onClose={mockOnClose} 
        swipeDirection="left"
      >
        <div>Modal content</div>
      </SwipeableModal>
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("can be disabled", () => {
    render(
      <SwipeableModal 
        isOpen={true} 
        onClose={mockOnClose} 
        swipeEnabled={false}
      >
        <div>Modal content</div>
      </SwipeableModal>
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });

  it("accepts custom threshold", () => {
    render(
      <SwipeableModal 
        isOpen={true} 
        onClose={mockOnClose} 
        threshold={150}
      >
        <div>Modal content</div>
      </SwipeableModal>
    );

    expect(screen.getByText("Modal content")).toBeInTheDocument();
  });
});