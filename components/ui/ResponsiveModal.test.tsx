import React from "react";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { ResponsiveModal } from "./ResponsiveModal";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";

describe("ResponsiveModal", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockClear();
  });

  it("should not render when isOpen is false", () => {
    render(
      <ResponsiveModal isOpen={false} onClose={mockOnClose}>
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("should render when isOpen is true", () => {
    render(
      <ResponsiveModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText("Modal Content")).toBeInTheDocument();
  });

  it("should render title and description when provided", () => {
    render(
      <ResponsiveModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Title"
        description="Test Description"
      >
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    expect(screen.getByText("Test Title")).toBeInTheDocument();
    expect(screen.getByText("Test Description")).toBeInTheDocument();
  });

  it("should render footer when provided", () => {
    render(
      <ResponsiveModal
        isOpen={true}
        onClose={mockOnClose}
        footer={<button>Footer Button</button>}
      >
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    expect(screen.getByText("Footer Button")).toBeInTheDocument();
  });

  it("should call onClose when close button is clicked", () => {
    render(
      <ResponsiveModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const closeButton = screen.getByLabelText("Close modal");
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should call onClose when backdrop is clicked and closeOnBackdrop is true", () => {
    render(
      <ResponsiveModal
        isOpen={true}
        onClose={mockOnClose}
        closeOnBackdrop={true}
      >
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const backdrop = screen
      .getByRole("dialog")
      .querySelector("[aria-hidden='true']") as HTMLElement;
    fireEvent.click(backdrop);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  it("should not call onClose when backdrop is clicked and closeOnBackdrop is false", () => {
    render(
      <ResponsiveModal
        isOpen={true}
        onClose={mockOnClose}
        closeOnBackdrop={false}
      >
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const backdrop = screen
      .getByRole("dialog")
      .querySelector("[aria-hidden='true']") as HTMLElement;
    fireEvent.click(backdrop);

    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it("should have touch-friendly close button size", () => {
    render(
      <ResponsiveModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const closeButton = screen.getByLabelText("Close modal");
    const styles = window.getComputedStyle(closeButton);

    expect(closeButton).toHaveStyle({
      width: `${TOUCH_TARGET.minSize}px`,
      height: `${TOUCH_TARGET.minSize}px`,
    });
  });

  it("should apply custom className when provided", () => {
    render(
      <ResponsiveModal
        isOpen={true}
        onClose={mockOnClose}
        className="custom-class"
      >
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const modalContent = screen
      .getByRole("dialog")
      .querySelector(".custom-class");
    expect(modalContent).toBeInTheDocument();
  });

  it("should apply correct size classes", () => {
    const { rerender } = render(
      <ResponsiveModal isOpen={true} onClose={mockOnClose} size="sm">
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    let modalContent = screen.getByRole("dialog").children[1] as HTMLElement;
    expect(modalContent).toHaveClass("lg:max-w-sm");

    rerender(
      <ResponsiveModal isOpen={true} onClose={mockOnClose} size="md">
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    modalContent = screen.getByRole("dialog").children[1] as HTMLElement;
    expect(modalContent).toHaveClass("lg:max-w-md");

    rerender(
      <ResponsiveModal isOpen={true} onClose={mockOnClose} size="lg">
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    modalContent = screen.getByRole("dialog").children[1] as HTMLElement;
    expect(modalContent).toHaveClass("lg:max-w-lg");
  });

  it("should have proper ARIA attributes", () => {
    render(
      <ResponsiveModal
        isOpen={true}
        onClose={mockOnClose}
        title="Test Title"
        description="Test Description"
      >
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const dialog = screen.getByRole("dialog");
    expect(dialog).toHaveAttribute("aria-modal", "true");
    expect(dialog).toHaveAttribute("aria-labelledby", "modal-title");
    expect(dialog).toHaveAttribute("aria-describedby", "modal-description");
  });

  it("should have scrollable content area", () => {
    render(
      <ResponsiveModal isOpen={true} onClose={mockOnClose}>
        <div style={{ height: "2000px" }}>Very long content</div>
      </ResponsiveModal>,
    );

    const modalContent = screen.getByRole("dialog").children[1] as HTMLElement;
    expect(modalContent).toHaveClass("overflow-hidden");

    const contentArea = modalContent.querySelector(".overflow-y-auto");
    expect(contentArea).toBeInTheDocument();
  });

  it("should apply responsive padding classes", () => {
    render(
      <ResponsiveModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const modalContent = screen.getByRole("dialog").children[1] as HTMLElement;
    expect(modalContent).toHaveClass("p-4", "md:p-6", "lg:p-8");
  });

  it("should apply responsive width and height classes", () => {
    render(
      <ResponsiveModal isOpen={true} onClose={mockOnClose}>
        <div>Modal Content</div>
      </ResponsiveModal>,
    );

    const modalContent = screen.getByRole("dialog").children[1] as HTMLElement;
    // Mobile: full screen
    expect(modalContent).toHaveClass("w-full", "h-full");
    // Tablet: 90vw width, auto height
    expect(modalContent).toHaveClass(
      "md:w-[90vw]",
      "md:h-auto",
      "md:max-h-[90vh]",
    );
  });
});
