import { render, screen, fireEvent } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  SkipNavigation,
  MainContent,
  NavigationWrapper,
  FooterWrapper,
} from "./SkipNavigation";

// Mock scrollIntoView
Object.defineProperty(HTMLElement.prototype, "scrollIntoView", {
  configurable: true,
  value: vi.fn(),
});

describe("SkipNavigation", () => {
  beforeEach(() => {
    // Clear any existing elements
    document.body.innerHTML = "";
  });

  it("renders default skip links", () => {
    render(<SkipNavigation />);

    expect(screen.getByText("Skip to main content")).toBeInTheDocument();
    expect(screen.getByText("Skip to navigation")).toBeInTheDocument();
    expect(screen.getByText("Skip to footer")).toBeInTheDocument();
  });

  it("renders custom skip links", () => {
    const customLinks = [
      { href: "#custom-content", label: "Skip to custom content" },
      { href: "#custom-nav", label: "Skip to custom navigation" },
    ];

    render(<SkipNavigation links={customLinks} />);

    expect(screen.getByText("Skip to custom content")).toBeInTheDocument();
    expect(screen.getByText("Skip to custom navigation")).toBeInTheDocument();
  });

  it("has proper ARIA attributes", () => {
    render(<SkipNavigation />);

    const nav = screen.getByRole("navigation", { name: "Skip navigation" });
    expect(nav).toBeInTheDocument();
  });

  it("focuses target element when skip link is clicked", () => {
    // Create target element
    const mainContent = document.createElement("main");
    mainContent.id = "main-content";
    mainContent.setAttribute("tabindex", "-1");
    document.body.appendChild(mainContent);

    const focusSpy = vi.spyOn(mainContent, "focus");
    const scrollSpy = vi.spyOn(mainContent, "scrollIntoView");

    render(<SkipNavigation />);

    const skipLink = screen.getByText("Skip to main content");
    fireEvent.click(skipLink);

    expect(focusSpy).toHaveBeenCalled();
    expect(scrollSpy).toHaveBeenCalledWith({ behavior: "smooth" });
  });

  it("applies custom className", () => {
    render(<SkipNavigation className="custom-class" />);

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("custom-class");
  });
});

describe("MainContent", () => {
  it("renders with proper attributes", () => {
    render(<MainContent>Test content</MainContent>);

    const main = screen.getByRole("main", { name: "Main content" });
    expect(main).toBeInTheDocument();
    expect(main).toHaveAttribute("id", "main-content");
    expect(main).toHaveAttribute("tabindex", "-1");
    expect(main).toHaveTextContent("Test content");
  });

  it("applies custom className", () => {
    render(<MainContent className="custom-main">Test content</MainContent>);

    const main = screen.getByRole("main");
    expect(main).toHaveClass("custom-main");
  });
});

describe("NavigationWrapper", () => {
  it("renders with proper attributes", () => {
    render(<NavigationWrapper>Test navigation</NavigationWrapper>);

    const nav = screen.getByRole("navigation", { name: "Main navigation" });
    expect(nav).toBeInTheDocument();
    expect(nav).toHaveAttribute("id", "navigation");
    expect(nav).toHaveAttribute("tabindex", "-1");
    expect(nav).toHaveTextContent("Test navigation");
  });

  it("applies custom className", () => {
    render(
      <NavigationWrapper className="custom-nav">
        Test navigation
      </NavigationWrapper>,
    );

    const nav = screen.getByRole("navigation");
    expect(nav).toHaveClass("custom-nav");
  });
});

describe("FooterWrapper", () => {
  it("renders with proper attributes", () => {
    render(<FooterWrapper>Test footer</FooterWrapper>);

    const footer = screen.getByRole("contentinfo", { name: "Footer" });
    expect(footer).toBeInTheDocument();
    expect(footer).toHaveAttribute("id", "footer");
    expect(footer).toHaveAttribute("tabindex", "-1");
    expect(footer).toHaveTextContent("Test footer");
  });

  it("applies custom className", () => {
    render(
      <FooterWrapper className="custom-footer">Test footer</FooterWrapper>,
    );

    const footer = screen.getByRole("contentinfo");
    expect(footer).toHaveClass("custom-footer");
  });
});
