"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Bell,
  Shield,
  Clock,
  Trash2,
  Mail,
  Calendar,
  User,
  LogOut,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { ProfileEmailSection } from "@/components/profile-email";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import {
  getMentorSettings,
  updateMentorSettings,
  updateMentorEmail,
  verifyMentorEmail,
  resendMentorVerification,
} from "@/lib/api/mentor";
import { getCurrentUser } from "@/lib/api/users";
import { logoutAllDevices } from "@/lib/api/auth";
import { changePassword } from "@/lib/api/auth";
import { deleteMentorProfile } from "@/lib/api/users";
import { useProfile } from "@/hooks/useProfile";
import type { MentorSettings as MentorSettingsType } from "@/lib/api/mentor/types";

function SettingsSection({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: React.ReactNode;
}) {
  return (
    <div className="border border-[#E1E4EA] rounded-[16px] bg-white px-4 md:px-6 py-4 md:py-5">
      <div className="mb-5">
        <h2 className="text-[15px] font-medium font-inter-tight text-black">
          {title}
        </h2>
        <p className="text-[13px] font-inter-tight text-[#525866] mt-1">
          {description}
        </p>
      </div>
      {children}
    </div>
  );
}

function ToggleSetting({
  label,
  description,
  checked,
  onChange,
}: {
  label: string;
  description?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA] last:border-0">
      <div>
        <p className="text-[13px] font-medium font-inter-tight text-black">
          {label}
        </p>
        {description && (
          <p className="text-[12px] font-inter-tight text-[#525866]">
            {description}
          </p>
        )}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function MentorSettings() {
  const roleColors = ROLE_COLORS.mentor;
  const queryClient = useQueryClient();
  const { userRoles, switchRole } = useProfile();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // Fetch settings from the API
  const {
    data: settings,
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["mentorSettings"],
    queryFn: getMentorSettings,
  });

  // Fetch real user data for email
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  // Local state for editing — initialized from API data
  const [visibility, setVisibility] = useState({
    profileVisible: true,
    showStats: true,
  });

  const [session, setSession] = useState({
    sessionDuration: 60,
    bufferTime: 15,
    minAdvanceBookingMinutes: 30,
    advanceBookingDays: 14,
    cancellationPolicy: "24hours",
    autoAccept: false,
  });

  const [notifications, setNotifications] = useState({
    emailNewRequests: true,
    emailSessionReminders: true,
    emailMarketing: false,
    pushNewRequests: true,
    pushSessionReminders: true,
  });

  // Sync local state when API data arrives
  useEffect(() => {
    if (settings) {
      setVisibility({
        profileVisible: settings.visibility === "public",
        showStats: settings.showStats,
      });
      setSession({
        sessionDuration: settings.sessionDuration,
        bufferTime: settings.bufferTime,
        minAdvanceBookingMinutes: settings.minAdvanceBookingMinutes ?? 30,
        advanceBookingDays: settings.advanceBookingDays,
        cancellationPolicy: settings.cancellationPolicy,
        autoAccept: settings.autoAccept,
      });
      setNotifications({
        emailNewRequests: settings.emailNewRequests,
        emailSessionReminders: settings.emailSessionReminders,
        emailMarketing: settings.emailMarketing,
        pushNewRequests: settings.pushNewRequests,
        pushSessionReminders: settings.pushSessionReminders,
      });
    }
  }, [settings]);

  // Mutation for saving settings
  const saveSettings = useMutation({
    mutationFn: (data: Partial<MentorSettingsType>) =>
      updateMentorSettings(data),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["mentorSettings"] });
    },
    onError: () => toast.error("Failed to save settings"),
  });

  const handleSaveVisibility = () => {
    saveSettings.mutate({
      visibility: visibility.profileVisible ? "public" : "private",
      showStats: visibility.showStats,
    });
  };

  const handleSaveSession = () => {
    saveSettings.mutate({
      sessionDuration: session.sessionDuration,
      bufferTime: session.bufferTime,
      minAdvanceBookingMinutes: session.minAdvanceBookingMinutes,
      advanceBookingDays: session.advanceBookingDays,
      cancellationPolicy: session.cancellationPolicy,
      autoAccept: session.autoAccept,
    });
  };

  const handleSaveNotifications = () => {
    saveSettings.mutate({
      emailNewRequests: notifications.emailNewRequests,
      emailSessionReminders: notifications.emailSessionReminders,
      emailMarketing: notifications.emailMarketing,
      pushNewRequests: notifications.pushNewRequests,
      pushSessionReminders: notifications.pushSessionReminders,
    });
  };

  const changePasswordMutation = useMutation({
    mutationFn: () => changePassword(currentPassword, newPassword),
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to change password"),
  });

  const deleteProfileMutation = useMutation({
    mutationFn: deleteMentorProfile,
    onSuccess: async (result) => {
      if (result.accountDeleted) {
        // User account was soft-deleted — clear all cache and redirect to login
        queryClient.clear();
        localStorage.removeItem("userRoles");
        toast.info(
          "Your account has been deleted as this was your last profile.",
        );
        window.location.href = "/login";
        return;
      }

      toast.success("Mentor profile deleted successfully");

      // Clear cache to remove stale data
      queryClient.clear();
      localStorage.removeItem("userRoles");

      // Find the next available role to switch to
      const remainingRoles = userRoles.filter((role) => role !== "mentor");

      if (remainingRoles.length > 0) {
        // Switch to the first available role
        const nextRole = remainingRoles[0];
        try {
          await switchRole(nextRole);
          // Reload to clear stale state and redirect to new role's dashboard
          window.location.href = "/dashboard";
        } catch (error) {
          console.error("Failed to switch role after deletion:", error);
          // Fallback: just redirect to dashboard
          window.location.href = "/dashboard";
        }
      } else {
        // No remaining roles, redirect to onboarding to create a new profile
        window.location.href = "/onboarding";
      }
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to delete mentor profile"),
  });

  const handleLogoutAll = useMutation({
    mutationFn: logoutAllDevices,
    onSuccess: () => {
      toast.success("Logged out from all devices");
      window.location.href = "/login";
    },
    onError: () => toast.error("Failed to sign out from all devices"),
  });

  // Email management mutations
  const updateEmailMutation = useMutation({
    mutationFn: updateMentorEmail,
    onSuccess: () => {
      toast.success(
        "Email updated successfully. Please check your email for verification code.",
      );
      queryClient.invalidateQueries({ queryKey: ["mentorSettings"] });
    },
    onError: (error: any) => {
      if (error.error === "RATE_LIMITED") {
        toast.error(
          error.message || "You can only update your email once every 7 days.",
        );
      } else if (error.error === "DUPLICATE_EMAIL") {
        toast.error(
          "This email is already in use. Please choose a different email.",
        );
      } else {
        toast.error(error.message || "Failed to update email");
      }
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: verifyMentorEmail,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["mentorSettings"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to verify email");
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: resendMentorVerification,
    onSuccess: () => {
      toast.success("Verification code sent to your email");
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to resend verification code");
    },
  });

  // Email management handlers
  const handleEmailUpdate = async (email: string) => {
    await updateEmailMutation.mutateAsync(email);
  };

  const handleVerifyEmail = async (code: string) => {
    await verifyEmailMutation.mutateAsync(code);
  };

  const handleResendCode = async () => {
    await resendCodeMutation.mutateAsync();
  };

  if (isLoading) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 animate-spin text-[#525866]" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="h-screen bg-white flex items-center justify-center">
        <p className="text-[13px] text-red-500">
          Failed to load settings. Please try again.
        </p>
      </div>
    );
  }

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
          Settings
        </h1>
        <p className="text-[13px] font-inter-tight text-[#525866] mt-2">
          Manage your mentor profile and preferences
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6 space-y-4 md:space-y-6">
          {/* Profile Visibility */}
          <SettingsSection
            title="Profile Visibility"
            description="Control who can see your profile and information"
          >
            <div className="space-y-2">
              <ToggleSetting
                label="Profile Visibility"
                description="Allow your profile to be discovered by mentees"
                checked={visibility.profileVisible}
                onChange={(v) =>
                  setVisibility((prev) => ({ ...prev, profileVisible: v }))
                }
              />
              <ToggleSetting
                label="Show Statistics"
                description="Display your session count and rating publicly"
                checked={visibility.showStats}
                onChange={(v) =>
                  setVisibility((prev) => ({ ...prev, showStats: v }))
                }
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSaveVisibility}
                disabled={saveSettings.isPending}
                className="text-white hover:opacity-90 w-full md:w-auto min-h-[44px]"
                style={{ backgroundColor: roleColors.primary }}
              >
                {saveSettings.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </SettingsSection>

          {/* Profile Email */}
          <ProfileEmailSection
            role="mentor"
            currentEmail={settings?.email}
            emailVerified={settings?.emailVerified || false}
            emailUpdatedAt={settings?.emailUpdatedAt}
            mainAccountEmail={userData?.email || ""}
            onEmailUpdate={handleEmailUpdate}
            onVerifyEmail={handleVerifyEmail}
            onResendCode={handleResendCode}
            isLoading={
              updateEmailMutation.isPending ||
              verifyEmailMutation.isPending ||
              resendCodeMutation.isPending
            }
            rateLimitedUntil={undefined} // This would come from API error response
            roleColors={roleColors}
            isInitialLoading={isLoading || !userData}
          />

          {/* Session Settings */}
          <SettingsSection
            title="Session Settings"
            description="Configure your mentoring session preferences"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
              <div>
                <Label className="text-[12px] font-medium font-inter-tight text-[#525866] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Session Duration (minutes)
                </Label>
                <Input
                  type="number"
                  value={session.sessionDuration}
                  onChange={(e) =>
                    setSession((prev) => ({
                      ...prev,
                      sessionDuration: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1"
                  min={15}
                  max={180}
                />
              </div>
              <div>
                <Label className="text-[12px] font-medium font-inter-tight text-[#525866] flex items-center gap-2">
                  <Calendar className="w-4 h-4" />
                  Buffer Time (minutes)
                </Label>
                <Input
                  type="number"
                  value={session.bufferTime}
                  onChange={(e) =>
                    setSession((prev) => ({
                      ...prev,
                      bufferTime: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1"
                  min={0}
                  max={60}
                />
              </div>
              <div>
                <Label className="text-[12px] font-medium font-inter-tight text-[#525866] flex items-center gap-2">
                  <Clock className="w-4 h-4" />
                  Minimum notice before booking
                </Label>
                <select
                  value={session.minAdvanceBookingMinutes}
                  onChange={(e) =>
                    setSession((prev) => ({
                      ...prev,
                      minAdvanceBookingMinutes: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1 w-full h-[38px] px-3 rounded-[8px] border border-[#E1E4EA] bg-white text-[13px] font-inter-tight"
                >
                  <option value={0}>No minimum</option>
                  <option value={15}>15 minutes</option>
                  <option value={30}>30 minutes</option>
                  <option value={60}>1 hour</option>
                  <option value={120}>2 hours</option>
                </select>
              </div>
              <div>
                <Label className="text-[12px] font-medium font-inter-tight text-[#525866]">
                  Advance Booking (days)
                </Label>
                <Input
                  type="number"
                  value={session.advanceBookingDays}
                  onChange={(e) =>
                    setSession((prev) => ({
                      ...prev,
                      advanceBookingDays: parseInt(e.target.value),
                    }))
                  }
                  className="mt-1"
                  min={1}
                  max={90}
                />
              </div>
              <div>
                <Label className="text-[12px] font-medium font-inter-tight text-[#525866]">
                  Cancellation Policy
                </Label>
                <select
                  value={session.cancellationPolicy}
                  onChange={(e) =>
                    setSession((prev) => ({
                      ...prev,
                      cancellationPolicy: e.target.value,
                    }))
                  }
                  className="mt-1 w-full h-[38px] px-3 rounded-[8px] border border-[#E1E4EA] bg-white text-[13px] font-inter-tight"
                >
                  <option value="24hours">At least 24 hours before</option>
                  <option value="12hours">At least 12 hours before</option>
                  <option value="6hours">At least 6 hours before</option>
                  <option value="no-policy">No cancellation policy</option>
                </select>
              </div>
            </div>
            <div className="py-3 border-b border-[#E1E4EA]">
              <ToggleSetting
                label="Auto-Accept Requests"
                description="Automatically accept booking requests"
                checked={session.autoAccept}
                onChange={(v) =>
                  setSession((prev) => ({ ...prev, autoAccept: v }))
                }
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSaveSession}
                disabled={saveSettings.isPending}
                className="text-white hover:opacity-90 w-full md:w-auto min-h-[44px]"
                style={{ backgroundColor: roleColors.primary }}
              >
                {saveSettings.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </SettingsSection>

          {/* Notification Preferences */}
          <SettingsSection
            title="Notification Preferences"
            description="Choose how you want to be notified"
          >
            <div className="mb-4">
              <h3 className="text-[13px] font-medium font-inter-tight text-black mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </h3>
              <div className="space-y-2 pl-5">
                <ToggleSetting
                  label="New Booking Requests"
                  description="Get notified when someone wants to book a session"
                  checked={notifications.emailNewRequests}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailNewRequests: v,
                    }))
                  }
                />
                <ToggleSetting
                  label="Session Reminders"
                  description="Get reminders before scheduled sessions"
                  checked={notifications.emailSessionReminders}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailSessionReminders: v,
                    }))
                  }
                />
                <ToggleSetting
                  label="Marketing & Updates"
                  description="Receive news about new features and tips"
                  checked={notifications.emailMarketing}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailMarketing: v,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mb-4">
              <h3 className="text-[13px] font-medium font-inter-tight text-black mb-3 flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Push Notifications
              </h3>
              <div className="space-y-2 pl-5">
                <ToggleSetting
                  label="New Booking Requests"
                  checked={notifications.pushNewRequests}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      pushNewRequests: v,
                    }))
                  }
                />
                <ToggleSetting
                  label="Session Reminders"
                  checked={notifications.pushSessionReminders}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      pushSessionReminders: v,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={handleSaveNotifications}
                disabled={saveSettings.isPending}
                className="text-white hover:opacity-90 w-full md:w-auto min-h-[44px]"
                style={{ backgroundColor: roleColors.primary }}
              >
                {saveSettings.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </SettingsSection>

          {/* Security — only show for email/password users */}
          {userData?.hasPassword !== false && (
            <SettingsSection
              title="Security"
              description="Manage your password and account security"
            >
              <div className="space-y-4 max-w-md">
                <div>
                  <Label
                    htmlFor="current-password"
                    className="text-[12px] font-medium font-inter-tight text-[#525866]"
                  >
                    Current Password
                  </Label>
                  <Input
                    id="current-password"
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    className="mt-1"
                    placeholder="Enter current password"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="new-password"
                    className="text-[12px] font-medium font-inter-tight text-[#525866]"
                  >
                    New Password
                  </Label>
                  <Input
                    id="new-password"
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="mt-1"
                    placeholder="Enter new password"
                  />
                </div>
                <div>
                  <Label
                    htmlFor="confirm-password"
                    className="text-[12px] font-medium font-inter-tight text-[#525866]"
                  >
                    Confirm New Password
                  </Label>
                  <Input
                    id="confirm-password"
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="mt-1"
                    placeholder="Confirm new password"
                  />
                </div>
                <Button
                  onClick={() => {
                    if (newPassword !== confirmPassword) {
                      toast.error("Passwords don't match");
                      return;
                    }
                    changePasswordMutation.mutate();
                  }}
                  disabled={
                    changePasswordMutation.isPending ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="text-white hover:opacity-90 w-full md:w-auto min-h-[44px]"
                  style={{ backgroundColor: roleColors.primary }}
                >
                  {changePasswordMutation.isPending && (
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  )}
                  <Shield className="w-4 h-4 mr-2" />
                  Change Password
                </Button>
              </div>
            </SettingsSection>
          )}

          {/* Account */}
          <SettingsSection title="Account" description="Manage your account">
            <div className="space-y-4">
              <div className="flex items-center py-3 border-b border-[#E1E4EA]">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#B2B2B2]" />
                  <div>
                    <p className="text-[13px] font-medium font-inter-tight text-black">
                      Email Address
                    </p>
                    <p className="text-[12px] font-inter-tight text-[#525866]">
                      {userData?.email || "Loading..."}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 border-b border-[#E1E4EA] gap-3">
                <div className="flex items-center gap-3">
                  <LogOut className="w-5 h-5 text-[#B2B2B2]" />
                  <div>
                    <p className="text-[13px] font-medium font-inter-tight text-black">
                      Sign out from all devices
                    </p>
                    <p className="text-[12px] font-inter-tight text-[#525866]">
                      Log out from all active sessions
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full md:w-auto min-h-[44px]"
                  onClick={() => handleLogoutAll.mutate()}
                  disabled={handleLogoutAll.isPending}
                >
                  {handleLogoutAll.isPending ? "Signing out..." : "Sign Out"}
                </Button>
              </div>

              <div className="flex flex-col md:flex-row md:items-center md:justify-between py-3 gap-3">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-[13px] font-medium font-inter-tight text-red-600">
                      Delete Mentor Profile
                    </p>
                    <p className="text-[12px] font-inter-tight text-[#525866]">
                      Permanently delete your mentor profile and data
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50 w-full md:w-auto min-h-[44px]"
                  onClick={() => setShowDeleteModal(true)}
                  disabled={deleteProfileMutation.isPending}
                >
                  {deleteProfileMutation.isPending ? "Deleting..." : "Delete"}
                </Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => deleteProfileMutation.mutate()}
        title="Delete Mentor Profile"
        description="This will permanently remove all your mentoring data, sessions, reviews, and availability settings. You can still use your other profiles if you have any. This action cannot be undone."
        confirmationText="delete mentor profile"
        confirmText="Delete Profile"
        cancelText="Cancel"
        isLoading={deleteProfileMutation.isPending}
      />
    </div>
  );
}
