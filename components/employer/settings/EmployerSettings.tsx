"use client";

import { useState, useEffect } from "react";
import { toast } from "sonner";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Loader2,
  Bell,
  Shield,
  Trash2,
  Mail,
  User,
  LogOut,
  Eye,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { DeleteConfirmationModal } from "@/components/ui/delete-confirmation-modal";
import { ProfileEmailSection } from "@/components/profile-email";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import {
  getRecruiterSettings,
  updateRecruiterSettings,
  updateRecruiterEmail,
  verifyRecruiterEmail,
  resendRecruiterVerification,
} from "@/lib/api/recruiter";
import { getCurrentUser } from "@/lib/api/users";
import { logoutAllDevices } from "@/lib/api/auth";
import { changePassword } from "@/lib/api/auth";
import { deleteRecruiterProfile } from "@/lib/api/users";
import { useProfile } from "@/hooks/useProfile";
import type { RecruiterSettings as RecruiterSettingsType } from "@/lib/api/recruiter/types";

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
    <div className="border border-[#E1E4EA] rounded-[16px] bg-white px-6 py-5">
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

export function EmployerSettings() {
  const roleColors = ROLE_COLORS.recruiter;
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
    queryKey: ["recruiterSettings"],
    queryFn: getRecruiterSettings,
  });

  // Fetch real user data for email
  const { data: userData } = useQuery({
    queryKey: ["currentUser"],
    queryFn: getCurrentUser,
  });

  // Local state — initialized from API data
  const [notifications, setNotifications] = useState<RecruiterSettingsType>({
    emailNewApplications: true,
    emailMarketing: false,
    pushNewApplications: true,
    profileVisible: true,
  });

  const [visibility, setVisibility] = useState({
    profileVisible: true,
  });

  // Sync local state when API data arrives
  useEffect(() => {
    if (settings) {
      setNotifications(settings);
    }
  }, [settings]);

  const saveSettings = useMutation({
    mutationFn: (data: Partial<RecruiterSettingsType>) =>
      updateRecruiterSettings(data),
    onSuccess: () => {
      toast.success("Settings saved");
      queryClient.invalidateQueries({ queryKey: ["recruiterSettings"] });
    },
    onError: () => toast.error("Failed to save settings"),
  });

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
    mutationFn: deleteRecruiterProfile,
    onSuccess: async () => {
      toast.success("Recruiter profile deleted successfully");

      // Find the next available role to switch to
      const remainingRoles = userRoles.filter(
        (role) => role !== "recruiter" && role !== "employer",
      );

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
      toast.error(error.message || "Failed to delete recruiter profile"),
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
    mutationFn: updateRecruiterEmail,
    onSuccess: () => {
      toast.success("Email updated successfully. Please check your email for verification code.");
      queryClient.invalidateQueries({ queryKey: ["recruiterSettings"] });
    },
    onError: (error: any) => {
      if (error.error === 'RATE_LIMITED') {
        toast.error(error.message || "You can only update your email once every 7 days.");
      } else if (error.error === 'DUPLICATE_EMAIL') {
        toast.error("This email is already in use. Please choose a different email.");
      } else {
        toast.error(error.message || "Failed to update email");
      }
    },
  });

  const verifyEmailMutation = useMutation({
    mutationFn: verifyRecruiterEmail,
    onSuccess: () => {
      toast.success("Email verified successfully!");
      queryClient.invalidateQueries({ queryKey: ["recruiterSettings"] });
    },
    onError: (error: any) => {
      toast.error(error.message || "Failed to verify email");
    },
  });

  const resendCodeMutation = useMutation({
    mutationFn: resendRecruiterVerification,
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
          Manage your recruiter preferences and account
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Profile Visibility */}
          <SettingsSection
            title="Profile Discovery"
            description="Control how your company profile appears to candidates"
          >
            <div className="space-y-2">
              <ToggleSetting
                label="Public Profile"
                description="Allow candidates to find and view your company profile"
                checked={visibility.profileVisible}
                onChange={(v) => setVisibility({ profileVisible: v })}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="text-white hover:opacity-90 w-full md:w-auto min-h-[44px]"
                style={{ backgroundColor: roleColors.primary }}
                onClick={() =>
                  saveSettings.mutate({
                    profileVisible: visibility.profileVisible,
                  })
                }
                disabled={saveSettings.isPending}
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
            role="recruiter"
            currentEmail={settings?.email}
            emailVerified={settings?.emailVerified || false}
            emailUpdatedAt={settings?.emailUpdatedAt}
            mainAccountEmail={userData?.email || ""}
            onEmailUpdate={handleEmailUpdate}
            onVerifyEmail={handleVerifyEmail}
            onResendCode={handleResendCode}
            isLoading={updateEmailMutation.isPending || verifyEmailMutation.isPending || resendCodeMutation.isPending}
            rateLimitedUntil={undefined} // This would come from API error response
            roleColors={roleColors}
            isInitialLoading={isLoading || !userData}
          />

          {/* Notification Preferences */}
          <SettingsSection
            title="Notification Preferences"
            description="Choose how you want to be notified about updates"
          >
            <div className="mb-4">
              <h3 className="text-[13px] font-medium font-inter-tight text-black mb-3 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Notifications
              </h3>
              <div className="space-y-2 pl-5">
                <ToggleSetting
                  label="New Applications"
                  description="Get notified when candidates apply to your opportunities"
                  checked={notifications.emailNewApplications}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      emailNewApplications: v,
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
                  label="New Applications"
                  checked={notifications.pushNewApplications}
                  onChange={(v) =>
                    setNotifications((prev) => ({
                      ...prev,
                      pushNewApplications: v,
                    }))
                  }
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => saveSettings.mutate(notifications)}
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
                      Delete Recruiter Profile
                    </p>
                    <p className="text-[12px] font-inter-tight text-[#525866]">
                      Permanently delete your recruiter profile and data
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
        title="Delete Recruiter Profile"
        description="This will permanently remove all your company data, job postings, applications, and candidate interactions. You can still use your other profiles if you have any. This action cannot be undone."
        confirmationText="delete recruiter profile"
        confirmText="Delete Profile"
        cancelText="Cancel"
        isLoading={deleteProfileMutation.isPending}
      />
    </div>
  );
}
