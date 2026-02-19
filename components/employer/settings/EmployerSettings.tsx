"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  Bell,
  Shield,
  Building2,
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

export function EmployerSettings() {
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
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
          <p className="text-gray-500 mt-1">
            Manage your company and account settings
          </p>
        </div>

        {/* Company Settings */}
        <SettingsSection
          title="Company Information"
          description="Basic information about your company"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label
                htmlFor="company-name"
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
              className="bg-purple-600 hover:bg-purple-700"
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
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Notifications
            </h3>
            <div className="space-y-1 pl-6">
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
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Push Notifications
            </h3>
            <div className="space-y-1 pl-6">
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
              className="bg-purple-600 hover:bg-purple-700"
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Team Management</h3>
            <p className="text-sm text-gray-500 mb-4">
              Invite team members to collaborate on hiring
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite Team Member
            </Button>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500 text-center">
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
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <CreditCard className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="font-medium text-gray-900 mb-2">Billing Settings</h3>
            <p className="text-sm text-gray-500 mb-4">
              Manage your subscription plan and payment methods
            </p>
            <Button className="bg-purple-600 hover:bg-purple-700">
              Manage Subscription
            </Button>
          </div>
          <div className="mt-6 border-t border-gray-100 pt-6">
            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Current Plan</p>
                <p className="text-sm text-gray-500">Free Plan</p>
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
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
                className="text-sm font-medium text-gray-700"
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
            <Button className="bg-purple-600 hover:bg-purple-700">
              <Shield className="w-4 h-4 mr-2" />
              Change Password
            </Button>
          </div>
        </SettingsSection>

        {/* Account */}
        <SettingsSection title="Account" description="Manage your account">
          <div className="flex items-center justify-between py-3 border-b border-gray-50">
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
        </SettingsSection>
      </div>
    </div>
  );
}
