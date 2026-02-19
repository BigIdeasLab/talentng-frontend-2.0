"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  Bell,
  Shield,
  User,
  Trash2,
  LogOut,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface NotificationSettings {
  emailApplications: boolean;
  emailInterviews: boolean;
  emailMessages: boolean;
  emailMarketing: boolean;
  pushApplications: boolean;
  pushInterviews: boolean;
  pushMessages: boolean;
}

interface VisibilitySettings {
  profileVisible: boolean;
  showEmail: boolean;
  showPhone: boolean;
  showLocation: boolean;
  allowRecruiters: boolean;
}

const defaultNotifications: NotificationSettings = {
  emailApplications: true,
  emailInterviews: true,
  emailMessages: true,
  emailMarketing: false,
  pushApplications: true,
  pushInterviews: true,
  pushMessages: true,
};

const defaultVisibility: VisibilitySettings = {
  profileVisible: true,
  showEmail: false,
  showPhone: false,
  showLocation: true,
  allowRecruiters: true,
};

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

export function TalentSettings() {
  const roleColors = ROLE_COLORS.talent;
  const [notifications, setNotifications] =
    useState<NotificationSettings>(defaultNotifications);
  const [visibility, setVisibility] =
    useState<VisibilitySettings>(defaultVisibility);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const saveNotifications = useMutation({
    mutationFn: async (data: NotificationSettings) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Notification settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const saveVisibility = useMutation({
    mutationFn: async (data: VisibilitySettings) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Visibility settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const changePassword = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
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
    onError: (error) =>
      toast.error(error.message || "Failed to change password"),
  });

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean,
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleVisibilityChange = (
    key: keyof VisibilitySettings,
    value: boolean,
  ) => {
    setVisibility((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
          Settings
        </h1>
        <p className="text-[13px] font-inter-tight text-[#525866] mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Profile Visibility */}
          <SettingsSection
            title="Profile Visibility"
            description="Control who can see your profile and what information is displayed"
          >
            <div className="space-y-1">
              <ToggleSetting
                label="Profile Visibility"
                description="Allow your profile to be discovered by recruiters"
                checked={visibility.profileVisible}
                onChange={(v) => handleVisibilityChange("profileVisible", v)}
              />
              <ToggleSetting
                label="Show Email"
                description="Display your email address on your profile"
                checked={visibility.showEmail}
                onChange={(v) => handleVisibilityChange("showEmail", v)}
              />
              <ToggleSetting
                label="Show Phone Number"
                description="Display your phone number on your profile"
                checked={visibility.showPhone}
                onChange={(v) => handleVisibilityChange("showPhone", v)}
              />
              <ToggleSetting
                label="Show Location"
                description="Display your location on your profile"
                checked={visibility.showLocation}
                onChange={(v) => handleVisibilityChange("showLocation", v)}
              />
              <ToggleSetting
                label="Allow Recruiters to Contact"
                description="Let recruiters reach out to you with opportunities"
                checked={visibility.allowRecruiters}
                onChange={(v) => handleVisibilityChange("allowRecruiters", v)}
              />
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => saveVisibility.mutate(visibility)}
                disabled={saveVisibility.isPending}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: roleColors.primary }}
              >
                {saveVisibility.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
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
                  label="Application Updates"
                  description="Get notified when employers view or respond to your applications"
                  checked={notifications.emailApplications}
                  onChange={(v) =>
                    handleNotificationChange("emailApplications", v)
                  }
                />
                <ToggleSetting
                  label="Interview Invitations"
                  description="Get notified when you're invited for an interview"
                  checked={notifications.emailInterviews}
                  onChange={(v) =>
                    handleNotificationChange("emailInterviews", v)
                  }
                />
                <ToggleSetting
                  label="Messages"
                  description="Get notified when you receive new messages"
                  checked={notifications.emailMessages}
                  onChange={(v) => handleNotificationChange("emailMessages", v)}
                />
                <ToggleSetting
                  label="Marketing & Updates"
                  description="Receive news about new features and opportunities"
                  checked={notifications.emailMarketing}
                  onChange={(v) =>
                    handleNotificationChange("emailMarketing", v)
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
                  label="Application Updates"
                  checked={notifications.pushApplications}
                  onChange={(v) =>
                    handleNotificationChange("pushApplications", v)
                  }
                />
                <ToggleSetting
                  label="Interview Invitations"
                  checked={notifications.pushInterviews}
                  onChange={(v) =>
                    handleNotificationChange("pushInterviews", v)
                  }
                />
                <ToggleSetting
                  label="Messages"
                  checked={notifications.pushMessages}
                  onChange={(v) => handleNotificationChange("pushMessages", v)}
                />
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => saveNotifications.mutate(notifications)}
                disabled={saveNotifications.isPending}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: roleColors.primary }}
              >
                {saveNotifications.isPending && (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                )}
                Save Changes
              </Button>
            </div>
          </SettingsSection>

          {/* Security */}
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

          {/* Account */}
          <SettingsSection
            title="Account"
            description="Manage your account details"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
                <div className="flex items-center gap-3">
                  <User className="w-5 h-5 text-[#B2B2B2]" />
                  <div>
                    <p className="text-[13px] font-medium font-inter-tight text-black">
                      Email Address
                    </p>
                    <p className="text-[12px] font-inter-tight text-[#525866]">
                      your.email@example.com
                    </p>
                  </div>
                </div>
                <Button variant="outline" size="sm">
                  Change
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
                <Button variant="outline" size="sm">
                  Sign Out
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
