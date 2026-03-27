import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { MentorSettings } from "./MentorSettings";
import { ProfileProvider } from "@/app/(business)/profile-provider";

// Mock the API modules
vi.mock("@/lib/api/mentor", () => ({
  getMentorSettings: vi.fn(),
  updateMentorSettings: vi.fn(),
  updateMentorEmail: vi.fn(),
  verifyMentorEmail: vi.fn(),
  resendMentorVerification: vi.fn(),
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

const mockMentorSettings = {
  visibility: "public" as const,
  showStats: true,
  sessionDuration: 60,
  bufferTime: 15,
  advanceBookingDays: 14,
  minAdvanceBookingMinutes: 60,
  cancellationPolicy: "24hours",
  autoAccept: false,
  emailNewRequests: true,
  emailSessionReminders: true,
  emailMarketing: false,
  pushNewRequests: true,
  pushSessionReminders: true,
  emailVerified: false,
};

const mockUserData = {
  id: "1",
  email: "mentor@example.com",
  hasPassword: true,
  username: "mentor",
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
        initialRole="mentor"
        initialProfileName="Test Mentor"
        initialProfileAvatar=""
      >
        {component}
      </ProfileProvider>
    </QueryClientProvider>,
  );
}

describe("MentorSettings - Responsive Design", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { getMentorSettings } = await import("@/lib/api/mentor");
    const { getCurrentUser } = await import("@/lib/api/users");
    vi.mocked(getMentorSettings).mockResolvedValue(mockMentorSettings);
    vi.mocked(getCurrentUser).mockResolvedValue(mockUserData);
  });

  it("renders settings page with header", async () => {
    renderWithQueryClient(<MentorSettings />);

    expect(
      await screen.findByText("Manage your mentor profile and preferences"),
    ).toBeInTheDocument();
  });

  it("renders all settings sections", async () => {
    renderWithQueryClient(<MentorSettings />);

    // Use getAllByText for "Profile Visibility" since it appears twice
    const profileVisibilityElements =
      await screen.findAllByText("Profile Visibility");
    expect(profileVisibilityElements.length).toBeGreaterThan(0);
    expect(screen.getByText("Session Settings")).toBeInTheDocument();
    expect(screen.getByText("Notification Preferences")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("applies responsive classes to save buttons", async () => {
    renderWithQueryClient(<MentorSettings />);

    const saveButtons = await screen.findAllByText("Save Changes");

    // Check that buttons have responsive width classes
    saveButtons.forEach((button) => {
      expect(button).toHaveClass("w-full");
      expect(button).toHaveClass("md:w-auto");
      expect(button).toHaveClass("min-h-[44px]");
    });
  });

  it("applies responsive layout to session settings grid", async () => {
    const { container } = renderWithQueryClient(<MentorSettings />);

    // Wait for content to load
    await screen.findByText("Session Settings");

    // Check for responsive grid classes
    const gridElement = container.querySelector(".grid");
    expect(gridElement).toHaveClass("grid-cols-1");
    expect(gridElement).toHaveClass("lg:grid-cols-2");
  });

  it("applies responsive classes to account action buttons", async () => {
    renderWithQueryClient(<MentorSettings />);

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
    const { container } = renderWithQueryClient(<MentorSettings />);

    await screen.findByText("Account");

    // Check for responsive flex classes on action rows
    const actionRows = container.querySelectorAll(
      ".flex.flex-col.md\\:flex-row",
    );
    expect(actionRows.length).toBeGreaterThan(0);
  });

  it("ensures all interactive elements meet minimum touch target size", async () => {
    renderWithQueryClient(<MentorSettings />);

    // Wait for content to load using a unique text
    await screen.findByText("Manage your mentor profile and preferences");

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
    renderWithQueryClient(<MentorSettings />);

    const passwordButton = await screen.findByRole("button", {
      name: /change password/i,
    });

    expect(passwordButton).toHaveClass("w-full");
    expect(passwordButton).toHaveClass("md:w-auto");
    expect(passwordButton).toHaveClass("min-h-[44px]");
  });

  it("stacks form fields vertically on mobile in session settings", async () => {
    const { container } = renderWithQueryClient(<MentorSettings />);

    await screen.findByText("Session Settings");

    // The grid should be single column on mobile (grid-cols-1)
    const grid = container.querySelector(".grid.grid-cols-1.lg\\:grid-cols-2");
    expect(grid).toBeInTheDocument();
  });
});
