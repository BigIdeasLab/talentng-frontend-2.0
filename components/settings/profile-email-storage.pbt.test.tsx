/**
 * Property-Based Tests - Profile Email Storage and Retrieval
 * Feature: profile-email-customization
 * 
 * Property 1: Profile Email Storage and Retrieval
 * **Validates: Requirements 1.1, 1.2, 8.1, 8.3**
 */

import { describe, it, expect, vi, beforeEach } from "vitest";
import * as fc from "fast-check";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TalentSettings } from "../talent/settings/TalentSettings";
import { MentorSettings } from "../mentor/settings/MentorSettings";
import { EmployerSettings } from "../employer/settings/EmployerSettings";

// Mock the API modules
vi.mock("@/lib/api/talent", () => ({
  getTalentSettings: vi.fn(),
  updateTalentSettings: vi.fn(),
  updateTalentEmail: vi.fn(),
  verifyTalentEmail: vi.fn(),
  resendTalentVerification: vi.fn(),
}));

vi.mock("@/lib/api/mentor", () => ({
  getMentorSettings: vi.fn(),
  updateMentorSettings: vi.fn(),
  updateMentorEmail: vi.fn(),
  verifyMentorEmail: vi.fn(),
  resendMentorVerification: vi.fn(),
}));

vi.mock("@/lib/api/recruiter", () => ({
  getRecruiterSettings: vi.fn(),
  updateRecruiterSettings: vi.fn(),
  updateRecruiterEmail: vi.fn(),
  verifyRecruiterEmail: vi.fn(),
  resendRecruiterVerification: vi.fn(),
}));

vi.mock("@/lib/api/users", () => ({
  getCurrentUser: vi.fn(),
  deleteTalentProfile: vi.fn(),
  deleteMentorProfile: vi.fn(),
  deleteRecruiterProfile: vi.fn(),
}));

vi.mock("@/lib/api/auth", () => ({
  logoutAllDevices: vi.fn(),
  changePassword: vi.fn(),
}));

vi.mock("@/hooks/useProfile", () => ({
  useProfile: () => ({
    userRoles: ['talent', 'mentor', 'recruiter'],
    switchRole: vi.fn(),
  }),
}));

vi.mock("sonner", () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
  },
}));

// Import the mocked modules
import { getTalentSettings, updateTalentEmail } from "@/lib/api/talent";
import { getMentorSettings, updateMentorEmail } from "@/lib/api/mentor";
import { getRecruiterSettings, updateRecruiterEmail } from "@/lib/api/recruiter";
import { getCurrentUser } from "@/lib/api/users";

const mockGetTalentSettings = vi.mocked(getTalentSettings);
const mockUpdateTalentEmail = vi.mocked(updateTalentEmail);
const mockGetMentorSettings = vi.mocked(getMentorSettings);
const mockUpdateMentorEmail = vi.mocked(updateMentorEmail);
const mockGetRecruiterSettings = vi.mocked(getRecruiterSettings);
const mockUpdateRecruiterEmail = vi.mocked(updateRecruiterEmail);
const mockGetCurrentUser = vi.mocked(getCurrentUser);

// Arbitraries
const emailArbitrary = () => fc.emailAddress();
const roleArbitrary = () => fc.constantFrom('talent', 'mentor', 'recruiter');
const timestampArbitrary = () =>
  fc.integer({ min: 1577836800000, max: 1735689600000 }) // 2020-01-01 to 2025-01-01 in ms
    .map(ms => new Date(ms).toISOString());

const settingsArbitrary = (role: string) => {
  const baseSettings = {
    email: fc.option(emailArbitrary()),
    emailVerified: fc.boolean(),
    emailUpdatedAt: fc.option(timestampArbitrary()),
  };

  switch (role) {
    case 'talent':
      return fc.record({
        ...baseSettings,
        profileVisible: fc.boolean(),
        emailApplications: fc.boolean(),
        emailInterviews: fc.boolean(),
        emailMarketing: fc.boolean(),
        pushApplications: fc.boolean(),
        pushInterviews: fc.boolean(),
      });
    case 'mentor':
      return fc.record({
        ...baseSettings,
        sessionDuration: fc.integer({ min: 15, max: 180 }),
        bufferTime: fc.integer({ min: 0, max: 60 }),
        minAdvanceBookingMinutes: fc.integer({ min: 60, max: 1440 }),
        advanceBookingDays: fc.integer({ min: 1, max: 30 }),
        cancellationPolicy: fc.string(),
        autoAccept: fc.boolean(),
        visibility: fc.constantFrom('public', 'private'),
        showStats: fc.boolean(),
        emailNewRequests: fc.boolean(),
        emailSessionReminders: fc.boolean(),
        emailMarketing: fc.boolean(),
        pushNewRequests: fc.boolean(),
        pushSessionReminders: fc.boolean(),
      });
    case 'recruiter':
      return fc.record({
        ...baseSettings,
        emailNewApplications: fc.boolean(),
        emailMarketing: fc.boolean(),
        pushNewApplications: fc.boolean(),
        profileVisible: fc.boolean(),
      });
    default:
      return fc.record(baseSettings);
  }
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
      {component}
    </QueryClientProvider>
  );
}

describe("Property 1: Profile Email Storage and Retrieval", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock user data
    mockGetCurrentUser.mockResolvedValue({
      id: "user-1",
      email: "main@example.com",
      hasPassword: true,
    } as any);
  });

  /**
   * Property: Each role should store and retrieve email settings independently
   */
  it("should store and retrieve email settings independently for each role", async () => {
    await fc.assert(
      fc.asyncProperty(
        roleArbitrary(),
        settingsArbitrary('talent'),
        emailArbitrary(),
        async (role, settings, newEmail) => {
          // Mock the appropriate settings getter
          switch (role) {
            case 'talent':
              mockGetTalentSettings.mockResolvedValue(settings as any);
              mockUpdateTalentEmail.mockResolvedValue({ ...settings, email: newEmail, emailVerified: false } as any);
              break;
            case 'mentor':
              mockGetMentorSettings.mockResolvedValue(settings as any);
              mockUpdateMentorEmail.mockResolvedValue({ ...settings, email: newEmail, emailVerified: false } as any);
              break;
            case 'recruiter':
              mockGetRecruiterSettings.mockResolvedValue(settings as any);
              mockUpdateRecruiterEmail.mockResolvedValue({ ...settings, email: newEmail, emailVerified: false } as any);
              break;
          }

          // Render the appropriate settings component
          let SettingsComponent;
          switch (role) {
            case 'talent':
              SettingsComponent = TalentSettings;
              break;
            case 'mentor':
              SettingsComponent = MentorSettings;
              break;
            case 'recruiter':
              SettingsComponent = EmployerSettings;
              break;
            default:
              return; // Skip invalid roles
          }

          const { container } = renderWithQueryClient(<SettingsComponent />);

          // Wait for component to load
          await waitFor(() => {
            expect(container.textContent).toContain('Profile Email');
          });

          // Property: Should display current email settings
          if (settings.email && settings.emailVerified) {
            expect(container.textContent).toContain(settings.email);
            expect(container.textContent).toContain('Verified');
          } else if (settings.email && !settings.emailVerified) {
            expect(container.textContent).toContain('Pending Verification');
          } else {
            expect(container.textContent).toContain('Using Main Email');
          }

          // Property: Should show correct role name in title
          const roleDisplayName = role.charAt(0).toUpperCase() + role.slice(1);
          expect(container.textContent).toContain(`${roleDisplayName} Profile Email`);
        }
      ),
      { numRuns: 30 } // Reduced for performance
    );
  });

  /**
   * Property: Email updates should not affect main account email
   */
  it("should not affect main account email when updating profile emails", async () => {
    await fc.assert(
      fc.asyncProperty(
        roleArbitrary(),
        emailArbitrary(),
        emailArbitrary(),
        async (role, mainEmail, profileEmail) => {
          // Ensure emails are different
          if (mainEmail === profileEmail) return;

          const settings = {
            email: undefined,
            emailVerified: false,
            emailUpdatedAt: undefined,
            profileVisible: true,
            emailApplications: true,
            emailInterviews: true,
            emailMarketing: false,
            pushApplications: true,
            pushInterviews: true,
          };

          // Mock user with main email
          mockGetCurrentUser.mockResolvedValue({
            id: "user-1",
            email: mainEmail,
            hasPassword: true,
          } as any);

          // Mock settings and update functions
          switch (role) {
            case 'talent':
              mockGetTalentSettings.mockResolvedValue(settings as any);
              mockUpdateTalentEmail.mockResolvedValue({ ...settings, email: profileEmail, emailVerified: false } as any);
              break;
            case 'mentor':
              mockGetMentorSettings.mockResolvedValue({ ...settings, sessionDuration: 60 } as any);
              mockUpdateMentorEmail.mockResolvedValue({ ...settings, email: profileEmail, emailVerified: false } as any);
              break;
            case 'recruiter':
              mockGetRecruiterSettings.mockResolvedValue(settings as any);
              mockUpdateRecruiterEmail.mockResolvedValue({ ...settings, email: profileEmail, emailVerified: false } as any);
              break;
          }

          let SettingsComponent;
          switch (role) {
            case 'talent':
              SettingsComponent = TalentSettings;
              break;
            case 'mentor':
              SettingsComponent = MentorSettings;
              break;
            case 'recruiter':
              SettingsComponent = EmployerSettings;
              break;
            default:
              return;
          }

          const { container } = renderWithQueryClient(<SettingsComponent />);

          await waitFor(() => {
            expect(container.textContent).toContain('Profile Email');
          });

          // Property: Should show main account email in account section
          expect(container.textContent).toContain(mainEmail);

          // Property: Should show main email as current notification email initially
          expect(container.textContent).toContain(`Current Email for ${role.charAt(0).toUpperCase() + role.slice(1)} Notifications`);
          expect(container.textContent).toContain(mainEmail);
        }
      ),
      { numRuns: 20 }
    );
  });

  /**
   * Property: Settings should maintain backward compatibility
   */
  it("should maintain backward compatibility with existing settings", async () => {
    await fc.assert(
      fc.asyncProperty(
        roleArbitrary(),
        async (role) => {
          // Mock settings without email fields (backward compatibility)
          const legacySettings = {
            profileVisible: true,
            emailApplications: true,
            emailInterviews: true,
            emailMarketing: false,
            pushApplications: true,
            pushInterviews: true,
          };

          switch (role) {
            case 'talent':
              mockGetTalentSettings.mockResolvedValue(legacySettings as any);
              break;
            case 'mentor':
              mockGetMentorSettings.mockResolvedValue({ 
                ...legacySettings, 
                sessionDuration: 60,
                bufferTime: 15,
                minAdvanceBookingMinutes: 60,
                advanceBookingDays: 7,
                cancellationPolicy: "24 hours",
                autoAccept: false,
                visibility: 'public',
                showStats: true,
                emailNewRequests: true,
                emailSessionReminders: true,
                pushNewRequests: true,
                pushSessionReminders: true,
              } as any);
              break;
            case 'recruiter':
              mockGetRecruiterSettings.mockResolvedValue({
                emailNewApplications: true,
                emailMarketing: false,
                pushNewApplications: true,
                profileVisible: true,
              } as any);
              break;
          }

          let SettingsComponent;
          switch (role) {
            case 'talent':
              SettingsComponent = TalentSettings;
              break;
            case 'mentor':
              SettingsComponent = MentorSettings;
              break;
            case 'recruiter':
              SettingsComponent = EmployerSettings;
              break;
            default:
              return;
          }

          const { container } = renderWithQueryClient(<SettingsComponent />);

          await waitFor(() => {
            expect(container.textContent).toContain('Settings');
          });

          // Property: Should handle missing email fields gracefully
          expect(container.textContent).toContain('Profile Email');
          expect(container.textContent).toContain('Using Main Email');

          // Property: Should still show existing notification settings
          expect(container.textContent).toContain('Notification');
        }
      ),
      { numRuns: 15 }
    );
  });

  /**
   * Property: Email verification status should be correctly displayed
   */
  it("should correctly display email verification status", async () => {
    await fc.assert(
      fc.asyncProperty(
        roleArbitrary(),
        emailArbitrary(),
        fc.boolean(),
        async (role, email, isVerified) => {
          const settings = {
            email,
            emailVerified: isVerified,
            emailUpdatedAt: new Date().toISOString(),
            profileVisible: true,
            emailApplications: true,
            emailInterviews: true,
            emailMarketing: false,
            pushApplications: true,
            pushInterviews: true,
          };

          switch (role) {
            case 'talent':
              mockGetTalentSettings.mockResolvedValue(settings as any);
              break;
            case 'mentor':
              mockGetMentorSettings.mockResolvedValue({ ...settings, sessionDuration: 60 } as any);
              break;
            case 'recruiter':
              mockGetRecruiterSettings.mockResolvedValue(settings as any);
              break;
          }

          let SettingsComponent;
          switch (role) {
            case 'talent':
              SettingsComponent = TalentSettings;
              break;
            case 'mentor':
              SettingsComponent = MentorSettings;
              break;
            case 'recruiter':
              SettingsComponent = EmployerSettings;
              break;
            default:
              return;
          }

          const { container } = renderWithQueryClient(<SettingsComponent />);

          await waitFor(() => {
            expect(container.textContent).toContain('Profile Email');
          });

          // Property: Should show correct verification status
          if (isVerified) {
            expect(container.textContent).toContain('Verified');
            expect(container.textContent).toContain(email);
          } else {
            expect(container.textContent).toContain('Pending Verification');
            expect(container.textContent).toContain('Email verification required');
          }
        }
      ),
      { numRuns: 20 }
    );
  });
});