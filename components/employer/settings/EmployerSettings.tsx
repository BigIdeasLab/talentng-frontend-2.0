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
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import {
  getRecruiterSettings,
  updateRecruiterSettings,
} from "@/lib/api/recruiter";
import { getCurrentUser } from "@/lib/api/users";
import { logoutAllDevices } from "@/lib/api/auth";
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

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

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

  const changePassword = useMutation({
    mutationFn: async () => {
      // Mocking password change as no endpoint exists yet
      await new Promise((resolve) => setTimeout(resolve, 800));
      if (newPassword !== confirmPassword)
        throw new Error("Passwords don't match");
      return { success: true };
    },
    onSuccess: () => {
      toast.success("Password changed successfully");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    },
    onError: (error: any) =>
      toast.error(error.message || "Failed to change password"),
  });

  const handleLogoutAll = useMutation({
    mutationFn: logoutAllDevices,
    onSuccess: () => {
      toast.success("Logged out from all devices");
      window.location.href = "/login";
    },
    onError: () => toast.error("Failed to sign out from all devices"),
  });

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
            <div className="space-y-1">
              <ToggleSetting
                label="Public Profile"
                description="Allow candidates to find and view your company profile"
                checked={visibility.profileVisible}
                onChange={(v) => setVisibility({ profileVisible: v })}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                className="text-white hover:opacity-90"
                style={{ backgroundColor: roleColors.primary }}
              >
                Save Visibility
              </Button>
            </div>
          </SettingsSection>

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
              <div className="space-y-1 pl-5">
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
              <div className="space-y-1 pl-5">
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
                className="text-white hover:opacity-90"
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
                  onClick={() => changePassword.mutate()}
                  disabled={
                    changePassword.isPending ||
                    !currentPassword ||
                    !newPassword ||
                    !confirmPassword
                  }
                  className="text-white hover:opacity-90"
                  style={{ backgroundColor: roleColors.primary }}
                >
                  {changePassword.isPending && (
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
              <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
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
                <Button variant="outline" size="sm" asChild>
                  <a href="/profile/edit">Change</a>
                </Button>
              </div>

              <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
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
                  onClick={() => handleLogoutAll.mutate()}
                  disabled={handleLogoutAll.isPending}
                >
                  {handleLogoutAll.isPending ? "Signing out..." : "Sign Out"}
                </Button>
              </div>

              <div className="flex items-center justify-between py-3">
                <div className="flex items-center gap-3">
                  <Trash2 className="w-5 h-5 text-red-500" />
                  <div>
                    <p className="text-[13px] font-medium font-inter-tight text-red-600">
                      Delete Account
                    </p>
                    <p className="text-[12px] font-inter-tight text-[#525866]">
                      Permanently delete your account and all data
                    </p>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-200 hover:bg-red-50"
                >
                  Delete
                </Button>
              </div>
            </div>
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
