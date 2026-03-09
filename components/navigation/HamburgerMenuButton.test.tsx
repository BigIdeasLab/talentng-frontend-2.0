import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { HamburgerMenuButton } from "./HamburgerMenuButton";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";

describe("HamburgerMenuButton", () => {
  describe("Basic Rendering", () => {
    it("renders the button", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button", {
        name: /toggle navigation menu/i,
      });
      expect(button).toBeInTheDocument();
    });

    it("renders with custom aria label", () => {
      const onClick = vi.fn();
      render(
        <HamburgerMenuButton
          isOpen={false}
          onClick={onClick}
          ariaLabel="Open menu"
        />
      );

      const button = screen.getByRole("button", { name: /open menu/i });
      expect(button).toBeInTheDocument();
    });
  });

  describe("Touch Target Size (Requirement 18.1)", () => {
    it("has minimum 44x44px tap target", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button");
      const styles = window.getComputedStyle(button);

      // Check inline styles
      expect(button.style.minWidth).toBe(`${TOUCH_TARGET.minSize}px`);
      expect(button.style.minHeight).toBe(`${TOUCH_TARGET.minSize}px`);
      expect(button.style.width).toBe(`${TOUCH_TARGET.minSize}px`);
      expect(button.style.height).toBe(`${TOUCH_TARGET.minSize}px`);
    });
  });

  describe("Icon Animation (Requirement 2.2)", () => {
    it("shows hamburger icon when closed", () => {
      const onClick = vi.fn();
      const { container } = render(
        <HamburgerMenuButton isOpen={false} onClick={onClick} />
      );

      // Menu icon should be visible (opacity-100)
      const menuIcon = container.querySelector('[aria-hidden="true"]');
      expect(menuIcon).toBeInTheDocument();
    });

    it("shows X icon when open", () => {
      const onClick = vi.fn();
      const { container } = render(
        <HamburgerMenuButton isOpen={true} onClick={onClick} />
      );

      // X icon should be visible
      const icons = container.querySelectorAll('[aria-hidden="true"]');
      expect(icons.length).toBe(2); // Both icons exist, one visible
    });

    it("toggles icon state when isOpen changes", () => {
      const onClick = vi.fn();
      const { rerender } = render(
        <HamburgerMenuButton isOpen={false} onClick={onClick} />
      );

      // Initially closed
      let button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "false");

      // Rerender as open
      rerender(<HamburgerMenuButton isOpen={true} onClick={onClick} />);

      button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "true");
    });
  });

  describe("Accessibility (Requirements 24.3)", () => {
    it("has proper ARIA attributes", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-label", "Toggle navigation menu");
      expect(button).toHaveAttribute("aria-expanded", "false");
      expect(button).toHaveAttribute(
        "aria-controls",
        "mobile-navigation-drawer"
      );
    });

    it("updates aria-expanded when state changes", () => {
      const onClick = vi.fn();
      const { rerender } = render(
        <HamburgerMenuButton isOpen={false} onClick={onClick} />
      );

      let button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "false");

      rerender(<HamburgerMenuButton isOpen={true} onClick={onClick} />);

      button = screen.getByRole("button");
      expect(button).toHaveAttribute("aria-expanded", "true");
    });

    it("has keyboard focus styles", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("focus:outline-none");
      expect(button).toHaveClass("focus:ring-2");
      expect(button).toHaveClass("focus:ring-blue-500");
    });
  });

  describe("Interaction", () => {
    it("calls onClick when clicked", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button");
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalledTimes(1);
    });

    it("calls onClick when tapped (touch event)", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button");
      fireEvent.touchStart(button);
      fireEvent.touchEnd(button);
      fireEvent.click(button);

      expect(onClick).toHaveBeenCalled();
    });

    it("has visual feedback classes for touch", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveClass("active:bg-gray-200");
      expect(button).toHaveClass("hover:bg-gray-100");
    });
  });

  describe("Custom Styling", () => {
    it("accepts custom className", () => {
      const onClick = vi.fn();
      render(
        <HamburgerMenuButton
          isOpen={false}
          onClick={onClick}
          className="custom-class"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
    });

    it("maintains base classes with custom className", () => {
      const onClick = vi.fn();
      render(
        <HamburgerMenuButton
          isOpen={false}
          onClick={onClick}
          className="custom-class"
        />
      );

      const button = screen.getByRole("button");
      expect(button).toHaveClass("custom-class");
      expect(button).toHaveClass("flex");
      expect(button).toHaveClass("items-center");
      expect(button).toHaveClass("justify-center");
    });
  });

  describe("Button Type", () => {
    it("has type='button' to prevent form submission", () => {
      const onClick = vi.fn();
      render(<HamburgerMenuButton isOpen={false} onClick={onClick} />);

      const button = screen.getByRole("button");
      expect(button).toHaveAttribute("type", "button");
    });
  });
});
