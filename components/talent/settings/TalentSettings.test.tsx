import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { TalentSettings } from "./TalentSettings";
import { ProfileProvider } from "@/app/(business)/profile-provider";

// Mock the API modules
vi.mock("@/lib/api/talent", () => ({
  getTalentSettings: vi.fn(),
  updateTalentSettings: vi.fn(),
  updateTalentEmail: vi.fn(),
  verifyTalentEmail: vi.fn(),
  resendTalentVerification: vi.fn(),
}));

vi.mock("@/lib/api/users", () => ({
  getCurrentUser: vi.fn(),
  deleteMentorProfile: vi.fn(),
  deleteTalentProfile: vi.fn(),
  deleteRecruiterProfile: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
  logoutAllDevices: vi.fn(),
}));

const mockTalentSettings = {
  profileVisible: true,
  emailApplications: true,
  emailInterviews: true,
  emailMarketing: false,
  pushApplications: true,
  pushInterviews: true,
  emailVerified: false,
};

const mockUserData = {
  id: "1",
  email: "talent@example.com",
  hasPassword: true,
  username: "talent",
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  deletedAt: null,
  emailVerified: true,
  emailVerifiedAt: new Date().toISOString(),
  isVerified: true,
  lastLoginAt: new Date().toISOString(),
  oneSignalPlayerId: null,
  profilePicture: null,
  bio: null,
  status: "active" as const,
  verificationLevel: "0",
};

function renderWithQueryClient(component: React.ReactElement) {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: { retry: false },
      mutations: { retry: false },
    },
  });

  return render(
    <QueryClientProvider client={queryClient}>
      <ProfileProvider
        initialRole="talent"
        initialProfileName="Test Talent"
        initialProfileAvatar=""
      >
        {component}
      </ProfileProvider>
    </QueryClientProvider>,
  );
}

describe("TalentSettings - Responsive Design", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { getTalentSettings } = await import("@/lib/api/talent");
    const { getCurrentUser } = await import("@/lib/api/users");
    vi.mocked(getTalentSettings).mockResolvedValue(mockTalentSettings);
    vi.mocked(getCurrentUser).mockResolvedValue(mockUserData);
  });

  it("renders settings page with header", async () => {
    renderWithQueryClient(<TalentSettings />);

    expect(
      await screen.findByText("Manage your account settings and preferences"),
    ).toBeInTheDocument();
  });

  it("renders all settings sections", async () => {
    renderWithQueryClient(<TalentSettings />);

    // Use getAllByText for "Profile Visibility" since it appears twice
    const profileVisibilityElements =
      await screen.findAllByText("Profile Visibility");
    expect(profileVisibilityElements.length).toBeGreaterThan(0);
    expect(screen.getByText("Notification Preferences")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("applies responsive classes to save buttons", async () => {
    renderWithQueryClient(<TalentSettings />);

    const saveButtons = await screen.findAllByText("Save Changes");

    // Check that buttons have responsive width classes
    saveButtons.forEach((button) => {
      expect(button).toHaveClass("w-full");
      expect(button).toHaveClass("md:w-auto");
      expect(button).toHaveClass("min-h-[44px]");
    });
  });

  it("applies responsive classes to account action buttons", async () => {
    renderWithQueryClient(<TalentSettings />);

    const changeButton = await screen.findByRole("button", {
      name: /change password/i,
    });
    const signOutButton = screen.getByRole("button", { name: /sign out/i });
    const deleteButton = screen.getByRole("button", { name: /delete/i });

    // Check responsive classes
    expect(changeButton).toHaveClass("w-full");
    expect(changeButton).toHaveClass("md:w-auto");
    expect(changeButton).toHaveClass("min-h-[44px]");

    expect(signOutButton).toHaveClass("w-full");
    expect(signOutButton).toHaveClass("md:w-auto");
    expect(signOutButton).toHaveClass("min-h-[44px]");

    expect(deleteButton).toHaveClass("w-full");
    expect(deleteButton).toHaveClass("md:w-auto");
    expect(deleteButton).toHaveClass("min-h-[44px]");
  });

  it("applies responsive layout to account action rows", async () => {
    const { container } = renderWithQueryClient(<TalentSettings />);

    await screen.findByText("Account");

    // Check for responsive flex classes on action rows
    const actionRows = container.querySelectorAll(
      ".flex.flex-col.md\\:flex-row",
    );
    expect(actionRows.length).toBeGreaterThan(0);
  });

  it("ensures all interactive elements meet minimum touch target size", async () => {
    renderWithQueryClient(<TalentSettings />);

    // Wait for content to load using a unique text
    await screen.findByText("Manage your account settings and preferences");

    // All buttons should have min-h-[44px] for touch targets
    const allButtons = screen.getAllByRole("button");
    allButtons.forEach((button) => {
      const classes = button.className;
      // Should have either min-h-[44px] or be a switch component
      const hasMinHeight = classes.includes("min-h-[44px]");
      const isSwitch = button.getAttribute("role") === "switch";
      expect(hasMinHeight || isSwitch).toBe(true);
    });
  });

  it("renders password change button with responsive classes", async () => {
    renderWithQueryClient(<TalentSettings />);

    const passwordButton = await screen.findByRole("button", {
      name: /change password/i,
    });

    expect(passwordButton).toHaveClass("w-full");
    expect(passwordButton).toHaveClass("md:w-auto");
    expect(passwordButton).toHaveClass("min-h-[44px]");
  });

  it("displays settings sections in stacked layout", async () => {
    const { container } = renderWithQueryClient(<TalentSettings />);

    // Wait for content to load using a unique text
    await screen.findByText("Manage your account settings and preferences");

    // Settings sections should be in a vertical stack with space-y-4 (md:space-y-6)
    const settingsContainer = container.querySelector(".space-y-4");
    expect(settingsContainer).toBeInTheDocument();
  });

  it("renders notification preferences with proper structure", async () => {
    renderWithQueryClient(<TalentSettings />);

    await screen.findByText("Notification Preferences");

    // Check for email and push notification sections
    expect(screen.getByText("Email Notifications")).toBeInTheDocument();
    expect(screen.getByText("Push Notifications")).toBeInTheDocument();
  });
});
