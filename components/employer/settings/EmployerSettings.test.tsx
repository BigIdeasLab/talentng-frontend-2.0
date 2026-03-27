import { render, screen } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { EmployerSettings } from "./EmployerSettings";
import { ProfileProvider } from "@/app/(business)/profile-provider";

// Mock the API modules
vi.mock("@/lib/api/recruiter", () => ({
  getRecruiterSettings: vi.fn(),
  updateRecruiterSettings: vi.fn(),
  updateRecruiterEmail: vi.fn(),
  verifyRecruiterEmail: vi.fn(),
  resendRecruiterVerification: vi.fn(),
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

const mockRecruiterSettings = {
  emailNewApplications: true,
  emailMarketing: false,
  pushNewApplications: true,
  profileVisible: true,
  emailVerified: false,
};

const mockUserData = {
  id: "1",
  email: "employer@example.com",
  hasPassword: true,
  username: "employer",
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
      <ProfileProvider initialRole="recruiter" initialProfileName="Test Employer" initialProfileAvatar="">
        {component}
      </ProfileProvider>
    </QueryClientProvider>,
  );
}

describe("EmployerSettings - Responsive Design", () => {
  beforeEach(async () => {
    vi.clearAllMocks();
    const { getRecruiterSettings } = await import("@/lib/api/recruiter");
    const { getCurrentUser } = await import("@/lib/api/users");
    vi.mocked(getRecruiterSettings).mockResolvedValue(mockRecruiterSettings);
    vi.mocked(getCurrentUser).mockResolvedValue(mockUserData);
  });

  it("renders settings page with header", async () => {
    renderWithQueryClient(<EmployerSettings />);

    expect(
      await screen.findByText("Manage your recruiter preferences and account"),
    ).toBeInTheDocument();
  });

  it("renders all settings sections", async () => {
    renderWithQueryClient(<EmployerSettings />);

    expect(await screen.findByText("Profile Discovery")).toBeInTheDocument();
    expect(screen.getByText("Notification Preferences")).toBeInTheDocument();
    expect(screen.getByText("Security")).toBeInTheDocument();
    expect(screen.getByText("Account")).toBeInTheDocument();
  });

  it("applies responsive classes to save buttons", async () => {
    renderWithQueryClient(<EmployerSettings />);

    const saveButtons = await screen.findAllByText("Save Changes");

    // Check that buttons have responsive width classes
    saveButtons.forEach((button) => {
      expect(button).toHaveClass("w-full");
      expect(button).toHaveClass("md:w-auto");
      expect(button).toHaveClass("min-h-[44px]");
    });
  });

  it("applies responsive classes to account action buttons", async () => {
    renderWithQueryClient(<EmployerSettings />);

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
    const { container } = renderWithQueryClient(<EmployerSettings />);

    await screen.findByText("Account");

    // Check for responsive flex classes on action rows
    const actionRows = container.querySelectorAll(
      ".flex.flex-col.md\\:flex-row",
    );
    expect(actionRows.length).toBeGreaterThan(0);
  });

  it("ensures all interactive elements meet minimum touch target size", async () => {
    renderWithQueryClient(<EmployerSettings />);

    await screen.findByText("Profile Discovery");

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
    renderWithQueryClient(<EmployerSettings />);

    const passwordButton = await screen.findByRole("button", {
      name: /change password/i,
    });

    expect(passwordButton).toHaveClass("w-full");
    expect(passwordButton).toHaveClass("md:w-auto");
    expect(passwordButton).toHaveClass("min-h-[44px]");
  });

  it("displays settings sections in stacked layout", async () => {
    const { container } = renderWithQueryClient(<EmployerSettings />);

    await screen.findByText("Profile Discovery");

    // Settings sections should be in a vertical stack with space-y-6
    const settingsContainer = container.querySelector(".space-y-6");
    expect(settingsContainer).toBeInTheDocument();
  });
});
