import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  MobileOptimizedAnimation,
  MobileFadeIn,
  MobileOptimizedSpinner,
  useMobileAnimationOptimizations,
} from "./MobileOptimizedAnimation";

// Mock the mobile animations utility
vi.mock("../../lib/utils/mobile-animations", () => ({
  getMobileOptimizedAnimation: vi.fn((animation) => `mock-${animation}`),
  mobileAnimations: {
    fadeIn: "animate-in fade-in duration-300",
    spin: "animate-spin",
    pulse: "animate-pulse",
  },
  injectMobileAnimationOptimizations: vi.fn(),
}));

describe("MobileOptimizedAnimation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("renders children correctly", () => {
    render(
      <MobileOptimizedAnimation>
        <div>Test content</div>
      </MobileOptimizedAnimation>,
    );

    expect(screen.getByText("Test content")).toBeInTheDocument();
  });

  it("applies animation class when animation prop is provided", () => {
    const { container } = render(
      <MobileOptimizedAnimation animation="fadeIn">
        <div>Test content</div>
      </MobileOptimizedAnimation>,
    );

    expect(container.firstChild).toHaveClass("mock-fadeIn");
  });

  it("applies custom animation when provided", () => {
    const { container } = render(
      <MobileOptimizedAnimation customAnimation="custom-animation">
        <div>Test content</div>
      </MobileOptimizedAnimation>,
    );

    expect(container.firstChild).toHaveClass("custom-animation");
  });

  it("applies additional className", () => {
    const { container } = render(
      <MobileOptimizedAnimation className="additional-class">
        <div>Test content</div>
      </MobileOptimizedAnimation>,
    );

    expect(container.firstChild).toHaveClass("additional-class");
  });
});

describe("MobileFadeIn", () => {
  it("renders with fade in animation", () => {
    const { container } = render(
      <MobileFadeIn>
        <div>Fade content</div>
      </MobileFadeIn>,
    );

    expect(screen.getByText("Fade content")).toBeInTheDocument();
    expect(container.firstChild).toHaveClass("mock-fadeIn");
  });
});

describe("MobileOptimizedSpinner", () => {
  it("renders spinner with default size", () => {
    const { container } = render(<MobileOptimizedSpinner />);

    const spinner = container.firstChild;
    expect(spinner).toHaveClass("w-6", "h-6", "rounded-full", "border-2");
  });

  it("renders spinner with small size", () => {
    const { container } = render(<MobileOptimizedSpinner size="sm" />);

    const spinner = container.firstChild;
    expect(spinner).toHaveClass("w-4", "h-4");
  });

  it("renders spinner with large size", () => {
    const { container } = render(<MobileOptimizedSpinner size="lg" />);

    const spinner = container.firstChild;
    expect(spinner).toHaveClass("w-8", "h-8");
  });

  it("applies additional className", () => {
    const { container } = render(
      <MobileOptimizedSpinner className="custom-spinner" />,
    );

    expect(container.firstChild).toHaveClass("custom-spinner");
  });
});

describe("useMobileAnimationOptimizations", () => {
  it("renders without errors", () => {
    function TestComponent() {
      useMobileAnimationOptimizations();
      return <div>Test</div>;
    }

    render(<TestComponent />);
    expect(screen.getByText("Test")).toBeInTheDocument();
  });
});

// Test basic functionality without complex mocking
describe("Animation Components Basic Functionality", () => {
  it("renders components without errors", () => {
    render(
      <div>
        <MobileFadeIn>Fade content</MobileFadeIn>
        <MobileOptimizedSpinner />
      </div>,
    );

    expect(screen.getByText("Fade content")).toBeInTheDocument();
  });
});
