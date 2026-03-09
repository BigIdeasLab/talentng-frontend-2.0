import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { TalentSidebar } from "./TalentSidebar";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock ProfileSwitcher component
vi.mock("@/components/layouts/ProfileSwitcher", () => ({
  ProfileSwitcher: () => (
    <div data-testid="profile-switcher">ProfileSwitcher</div>
  ),
}));

describe("TalentSidebar", () => {
  it("renders sidebar with responsive classes", () => {
    const { container } = render(<TalentSidebar />);

    const sidebar = container.querySelector("aside");
    expect(sidebar).toBeInTheDocument();

    // Check for responsive width classes
    expect(sidebar).toHaveClass("hidden");
    expect(sidebar).toHaveClass("lg:flex");
    expect(sidebar).toHaveClass("md:w-16");
    expect(sidebar).toHaveClass("lg:w-[250px]");
  });

  it("hides logo on tablet, shows on desktop", () => {
    const { container } = render(<TalentSidebar />);

    const logoSection = container.querySelector(".px-\\[30px\\].py-\\[12px\\]");
    expect(logoSection).toHaveClass("md:hidden");
    expect(logoSection).toHaveClass("lg:block");
  });

  it("hides ProfileSwitcher on tablet, shows on desktop", () => {
    render(<TalentSidebar />);

    const profileSwitcherContainer =
      screen.getByTestId("profile-switcher").parentElement;
    expect(profileSwitcherContainer).toHaveClass("md:hidden");
    expect(profileSwitcherContainer).toHaveClass("lg:block");
  });

  it("renders navigation items with responsive label visibility", () => {
    const { container } = render(<TalentSidebar />);

    // Find navigation item labels
    const labels = container.querySelectorAll(
      ".text-\\[13px\\].font-inter-tight",
    );

    labels.forEach((label) => {
      // Labels should be hidden on tablet (md:hidden) and visible on desktop (lg:inline)
      expect(label).toHaveClass("md:hidden");
      expect(label).toHaveClass("lg:inline");
    });
  });

  it("centers icons on tablet, aligns left on desktop", () => {
    const { container } = render(<TalentSidebar />);

    // Find navigation buttons/links
    const navItems = container.querySelectorAll("a, button");

    navItems.forEach((item) => {
      if (item.closest("aside")) {
        expect(item).toHaveClass("md:justify-center");
        expect(item).toHaveClass("lg:justify-start");
      }
    });
  });

  it("displays notification badge with responsive positioning", () => {
    render(<TalentSidebar notificationCount={5} />);

    const badge = screen.getByText("5");
    const badgeContainer = badge.parentElement;

    // Badge should be absolutely positioned on tablet, static on desktop
    expect(badgeContainer).toHaveClass("md:absolute");
    expect(badgeContainer).toHaveClass("lg:static");
  });

  it("hides OTHERS label on tablet, shows on desktop", () => {
    const { container } = render(<TalentSidebar />);

    const othersLabel = screen.getByText("OTHERS").parentElement;
    expect(othersLabel).toHaveClass("md:hidden");
    expect(othersLabel).toHaveClass("lg:block");
  });
});
