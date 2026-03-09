import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { MobileNavigation } from "./MobileNavigation";

// Mock next/navigation
vi.mock("next/navigation", () => ({
  usePathname: () => "/dashboard",
}));

// Mock ProfileSwitcher
vi.mock("@/components/layouts/ProfileSwitcher", () => ({
  ProfileSwitcher: () => <div data-testid="profile-switcher">ProfileSwitcher</div>,
}));

describe("MobileNavigation", () => {
  const defaultProps = {
    activeRole: "talent" as const,
    notificationCount: 0,
    upcomingCount: 0,
  };

  it("renders ProfileSwitcher at the top", () => {
    render(<MobileNavigation {...defaultProps} />);
    expect(screen.getByTestId("profile-switcher")).toBeInTheDocument();
  });

  it("renders talent navigation items", () => {
    render(<MobileNavigation {...defaultProps} />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Mentorship")).toBeInTheDocument();
    expect(screen.getByText("My Applications")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Notification")).toBeInTheDocument();
  });

  it("renders recruiter navigation items", () => {
    render(<MobileNavigation {...defaultProps} activeRole="recruiter" />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Opportunities")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Notification")).toBeInTheDocument();
    expect(screen.queryByText("Mentorship")).not.toBeInTheDocument();
  });

  it("renders mentor navigation items", () => {
    render(<MobileNavigation {...defaultProps} activeRole="mentor" />);
    
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
    expect(screen.getByText("Mentorship")).toBeInTheDocument();
    expect(screen.getByText("Calendar")).toBeInTheDocument();
    expect(screen.getByText("Notification")).toBeInTheDocument();
    expect(screen.queryByText("Opportunities")).not.toBeInTheDocument();
  });

  it("displays notification badge when count > 0", () => {
    render(<MobileNavigation {...defaultProps} notificationCount={5} />);
    
    const badge = screen.getByText("5");
    expect(badge).toBeInTheDocument();
    expect(badge).toHaveClass("bg-red-600");
  });

  it("displays upcoming badge when count > 0", () => {
    render(<MobileNavigation {...defaultProps} upcomingCount={3} />);
    
    const badge = screen.getByText("3");
    expect(badge).toBeInTheDocument();
  });

  it("does not display badges when count is 0", () => {
    render(<MobileNavigation {...defaultProps} />);
    
    // Should not find any badge elements
    const badges = screen.queryAllByText(/^\d+$/);
    expect(badges).toHaveLength(0);
  });

  it("calls onItemSelect when navigation item is clicked", () => {
    const onItemSelect = vi.fn();
    render(<MobileNavigation {...defaultProps} onItemSelect={onItemSelect} />);
    
    fireEvent.click(screen.getByText("Dashboard"));
    expect(onItemSelect).toHaveBeenCalledWith("dashboard");
  });

  it("calls onNotificationClick when notification item is clicked", () => {
    const onNotificationClick = vi.fn();
    render(
      <MobileNavigation
        {...defaultProps}
        onNotificationClick={onNotificationClick}
      />
    );
    
    fireEvent.click(screen.getByText("Notification"));
    expect(onNotificationClick).toHaveBeenCalled();
  });

  it("calls onClose when navigation item is clicked", () => {
    const onClose = vi.fn();
    render(<MobileNavigation {...defaultProps} onClose={onClose} />);
    
    fireEvent.click(screen.getByText("Dashboard"));
    expect(onClose).toHaveBeenCalled();
  });

  it("calls onClose when notification is clicked", () => {
    const onClose = vi.fn();
    const onNotificationClick = vi.fn();
    render(
      <MobileNavigation
        {...defaultProps}
        onClose={onClose}
        onNotificationClick={onNotificationClick}
      />
    );
    
    fireEvent.click(screen.getByText("Notification"));
    expect(onClose).toHaveBeenCalled();
    expect(onNotificationClick).toHaveBeenCalled();
  });

  it("renders other items section", () => {
    render(<MobileNavigation {...defaultProps} />);
    
    expect(screen.getByText("Others")).toBeInTheDocument();
    expect(screen.getByText("Support")).toBeInTheDocument();
    expect(screen.getByText("Settings")).toBeInTheDocument();
  });

  it("applies active styles to current route", () => {
    render(<MobileNavigation {...defaultProps} />);
    
    const dashboardLink = screen.getByText("Dashboard").closest("a");
    expect(dashboardLink).toHaveClass("border");
  });
});
