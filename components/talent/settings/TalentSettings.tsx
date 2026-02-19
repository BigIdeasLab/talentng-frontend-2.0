"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  Eye,
  EyeOff,
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
    <div className="bg-white rounded-xl border border-gray-100 p-6 mb-6">
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-900">{title}</h2>
        <p className="text-sm text-gray-500 mt-1">{description}</p>
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
    <div className="flex items-center justify-between py-3 border-b border-gray-50 last:border-0">
      <div>
        <p className="font-medium text-gray-900">{label}</p>
        {description && <p className="text-sm text-gray-500">{description}</p>}
      </div>
      <Switch checked={checked} onCheckedChange={onChange} />
    </div>
  );
}

export function TalentSettings() {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your account settings and preferences
          </p>
        </div>

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
              className="bg-purple-600 hover:bg-purple-700"
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
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Notifications
            </h3>
            <div className="space-y-1 pl-6">
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
                onChange={(v) => handleNotificationChange("emailInterviews", v)}
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
                onChange={(v) => handleNotificationChange("emailMarketing", v)}
              />
            </div>
          </div>

          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Push Notifications
            </h3>
            <div className="space-y-1 pl-6">
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
                onChange={(v) => handleNotificationChange("pushInterviews", v)}
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
              className="bg-purple-600 hover:bg-purple-700"
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
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
              className="bg-purple-600 hover:bg-purple-700"
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
            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <User className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">Email Address</p>
                  <p className="text-sm text-gray-500">
                    your.email@example.com
                  </p>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Change
              </Button>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-50">
              <div className="flex items-center gap-3">
                <LogOut className="w-5 h-5 text-gray-400" />
                <div>
                  <p className="font-medium text-gray-900">
                    Sign out from all devices
                  </p>
                  <p className="text-sm text-gray-500">
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
                  <p className="font-medium text-red-600">Delete Account</p>
                  <p className="text-sm text-gray-500">
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
  );
}
