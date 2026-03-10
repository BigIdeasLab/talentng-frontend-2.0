import { describe, it, expect, vi, beforeEach } from "vitest";
import { render, screen } from "@testing-library/react";
import { NotificationsModal } from "./NotificationsModal";

// Mock dependencies
vi.mock("next/navigation", () => ({
  useRouter: () => ({
    push: vi.fn(),
  }),
}));

vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({
    activeRole: "talent",
  }),
}));

vi.mock("@/hooks/useNotifications", () => ({
  useNotifications: () => ({
    notifications: [],
    loading: false,
    error: null,
    markAsRead: vi.fn(),
  }),
}));

vi.mock("@/hooks/useIsMobile", () => ({
  useIsMobile: () => false,
}));

vi.mock("@/components/talent/notification/TalentNotifications", () => ({
  TalentNotifications: () => <div>Talent Notifications</div>,
}));

vi.mock("@/components/employer/notification/EmployerNotifications", () => ({
  EmployerNotifications: () => <div>Employer Notifications</div>,
}));

vi.mock("@/components/mentor/notification/MentorNotifications", () => ({
  MentorNotifications: () => <div>Mentor Notifications</div>,
}));

vi.mock("@/components/layouts/modals/NotificationDetailPanel", () => ({
  NotificationDetailPanel: () => <div>Notification Detail Panel</div>,
}));

describe("NotificationsModal", () => {
  const mockOnClose = vi.fn();
  const mockOnNotificationRead = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should not render when isOpen is false", () => {
    const { container } = render(
      <NotificationsModal
        isOpen={false}
        onClose={mockOnClose}
        onNotificationRead={mockOnNotificationRead}
      />,
    );

    expect(container.firstChild).toBeNull();
  });

  it("should render when isOpen is true", () => {
    render(
      <NotificationsModal
        isOpen={true}
        onClose={mockOnClose}
        onNotificationRead={mockOnNotificationRead}
      />,
    );

    expect(screen.getByText("Notifications")).toBeInTheDocument();
  });

  it("should render with full-screen on mobile (responsive classes)", () => {
    const { container } = render(
      <NotificationsModal
        isOpen={true}
        onClose={mockOnClose}
        onNotificationRead={mockOnNotificationRead}
      />,
    );

    // Check for responsive classes on the modal container (second .fixed element)
    const fixedElements = container.querySelectorAll(".fixed");
    const modalContainer = fixedElements[1]; // Second fixed element is the modal
    expect(modalContainer).toHaveClass("inset-0");
    expect(modalContainer).toHaveClass("md:left-[250px]");
    expect(modalContainer).toHaveClass("md:w-[350px]");
  });

  it("should have touch-friendly close button", () => {
    render(
      <NotificationsModal
        isOpen={true}
        onClose={mockOnClose}
        onNotificationRead={mockOnNotificationRead}
      />,
    );

    const closeButton = screen.getByLabelText("Close notifications");
    expect(closeButton).toBeInTheDocument();
    expect(closeButton).toHaveClass("min-w-[44px]");
    expect(closeButton).toHaveClass("min-h-[44px]");
  });

  it("should render TalentNotifications for talent role", () => {
    render(
      <NotificationsModal
        isOpen={true}
        onClose={mockOnClose}
        onNotificationRead={mockOnNotificationRead}
      />,
    );

    expect(screen.getByText("Talent Notifications")).toBeInTheDocument();
  });
});
