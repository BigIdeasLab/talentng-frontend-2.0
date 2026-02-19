"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  Bell,
  Shield,
  Users,
  CreditCard,
  Trash2,
  UserPlus,
  Mail,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface NotificationSettings {
  emailNewApplications: boolean;
  emailMessages: boolean;
  emailMarketing: boolean;
  pushNewApplications: boolean;
  pushMessages: boolean;
}

interface CompanySettings {
  companyName: string;
  website: string;
  description: string;
  industry: string;
  size: string;
}

const defaultNotifications: NotificationSettings = {
  emailNewApplications: true,
  emailMessages: true,
  emailMarketing: false,
  pushNewApplications: true,
  pushMessages: true,
};

const defaultCompany: CompanySettings = {
  companyName: "",
  website: "",
  description: "",
  industry: "",
  size: "",
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

export function EmployerSettings() {
  const roleColors = ROLE_COLORS.recruiter;
  const [notifications, setNotifications] =
    useState<NotificationSettings>(defaultNotifications);
  const [company, setCompany] = useState<CompanySettings>(defaultCompany);

  const saveNotifications = useMutation({
    mutationFn: async (data: NotificationSettings) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Notification settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const saveCompany = useMutation({
    mutationFn: async (data: CompanySettings) => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Company settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean,
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleCompanyChange = (key: keyof CompanySettings, value: string) => {
    setCompany((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="h-screen bg-white flex flex-col">
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <h1 className="text-[16px] font-medium font-inter-tight text-black leading-[16px]">
          Settings
        </h1>
        <p className="text-[13px] font-inter-tight text-[#525866] mt-2">
          Manage your company and account settings
        </p>
      </div>

      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6 space-y-6">
          {/* Company Settings */}
          <SettingsSection
            title="Company Information"
            description="Basic information about your company"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label
                  htmlFor="company-name"
                  className="text-[12px] font-medium font-inter-tight text-[#525866]"
                >
                  Company Name
                </Label>
                <Input
                  id="company-name"
                  value={company.companyName}
                  onChange={(e) =>
                    handleCompanyChange("companyName", e.target.value)
                  }
                  className="mt-1"
                  placeholder="Your Company Name"
                />
              </div>
              <div>
                <Label
                  htmlFor="website"
                  className="text-[12px] font-medium font-inter-tight text-[#525866]"
                >
                  Website
                </Label>
                <Input
                  id="website"
                  value={company.website}
                  onChange={(e) => handleCompanyChange("website", e.target.value)}
                  className="mt-1"
                  placeholder="https://yourcompany.com"
                />
              </div>
              <div>
                <Label
                  htmlFor="industry"
                  className="text-[12px] font-medium font-inter-tight text-[#525866]"
                >
                  Industry
                </Label>
                <Input
                  id="industry"
                  value={company.industry}
                  onChange={(e) =>
                    handleCompanyChange("industry", e.target.value)
                  }
                  className="mt-1"
                  placeholder="Technology, Healthcare, etc."
                />
              </div>
              <div>
                <Label
                  htmlFor="size"
                  className="text-[12px] font-medium font-inter-tight text-[#525866]"
                >
                  Company Size
                </Label>
                <Input
                  id="size"
                  value={company.size}
                  onChange={(e) => handleCompanyChange("size", e.target.value)}
                  className="mt-1"
                  placeholder="1-10, 11-50, 51-200, etc."
                />
              </div>
              <div className="md:col-span-2">
                <Label
                  htmlFor="description"
                  className="text-[12px] font-medium font-inter-tight text-[#525866]"
                >
                  Company Description
                </Label>
                <Textarea
                  id="description"
                  value={company.description}
                  onChange={(e) =>
                    handleCompanyChange("description", e.target.value)
                  }
                  className="mt-1"
                  rows={4}
                  placeholder="Tell us about your company..."
                />
              </div>
            </div>
            <div className="mt-4 flex justify-end">
              <Button
                onClick={() => saveCompany.mutate(company)}
                disabled={saveCompany.isPending}
                className="text-white hover:opacity-90"
                style={{ backgroundColor: roleColors.primary }}
              >
                {saveCompany.isPending && (
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
                  label="New Applications"
                  description="Get notified when candidates apply to your opportunities"
                  checked={notifications.emailNewApplications}
                  onChange={(v) =>
                    handleNotificationChange("emailNewApplications", v)
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
                  description="Receive news about new features and tips"
                  checked={notifications.emailMarketing}
                  onChange={(v) => handleNotificationChange("emailMarketing", v)}
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
                    handleNotificationChange("pushNewApplications", v)
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

          {/* Team Management */}
          <SettingsSection
            title="Team Management"
            description="Manage your team members and their access"
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-[#B2B2B2]" />
              </div>
              <h3 className="text-[14px] font-medium font-inter-tight text-black mb-2">
                Team Management
              </h3>
              <p className="text-[13px] font-inter-tight text-[#525866] mb-4">
                Invite team members to collaborate on hiring
              </p>
              <Button
                className="text-white hover:opacity-90"
                style={{ backgroundColor: roleColors.primary }}
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Invite Team Member
              </Button>
            </div>
            <div className="mt-6 border-t border-[#E1E4EA] pt-6">
              <p className="text-[12px] font-inter-tight text-[#525866] text-center">
                No team members yet
              </p>
            </div>
          </SettingsSection>

          {/* Billing */}
          <SettingsSection
            title="Billing & Payments"
            description="Manage your subscription and payment methods"
          >
            <div className="text-center py-8">
              <div className="w-16 h-16 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                <CreditCard className="w-8 h-8 text-[#B2B2B2]" />
              </div>
              <h3 className="text-[14px] font-medium font-inter-tight text-black mb-2">
                Billing Settings
              </h3>
              <p className="text-[13px] font-inter-tight text-[#525866] mb-4">
                Manage your subscription plan and payment methods
              </p>
              <Button
                className="text-white hover:opacity-90"
                style={{ backgroundColor: roleColors.primary }}
              >
                Manage Subscription
              </Button>
            </div>
            <div className="mt-6 border-t border-[#E1E4EA] pt-6">
              <div className="flex items-center justify-between py-3">
                <div>
                  <p className="text-[13px] font-medium font-inter-tight text-black">
                    Current Plan
                  </p>
                  <p className="text-[12px] font-inter-tight text-[#525866]">
                    Free Plan
                  </p>
                </div>
                <Button variant="outline" size="sm">
                  Upgrade
                </Button>
              </div>
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
                  className="mt-1"
                  placeholder="Confirm new password"
                />
              </div>
              <Button
                className="text-white hover:opacity-90"
                style={{ backgroundColor: roleColors.primary }}
              >
                <Shield className="w-4 h-4 mr-2" />
                Change Password
              </Button>
            </div>
          </SettingsSection>

          {/* Account */}
          <SettingsSection title="Account" description="Manage your account">
            <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
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
          </SettingsSection>
        </div>
      </div>
    </div>
  );
}
