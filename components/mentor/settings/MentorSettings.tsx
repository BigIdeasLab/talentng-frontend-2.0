"use client";

import { useState } from "react";
import { toast } from "sonner";
import { useMutation } from "@tanstack/react-query";
import {
  Loader2,
  Bell,
  Shield,
  DollarSign,
  Clock,
  Eye,
  EyeOff,
  Trash2,
  Mail,
  CreditCard,
  Calendar,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

interface NotificationSettings {
  emailNewRequests: boolean;
  emailSessionReminders: boolean;
  emailMessages: boolean;
  emailEarnings: boolean;
  emailMarketing: boolean;
  pushNewRequests: boolean;
  pushSessionReminders: boolean;
  pushMessages: boolean;
}

interface SessionSettings {
  sessionDuration: number;
  bufferTime: number;
  advanceBookingDays: number;
  cancellationPolicy: string;
  autoAccept: boolean;
}

interface PaymentSettings {
  hourlyRate: number;
  currency: string;
  paymentMethod: string;
}

interface VisibilitySettings {
  profileVisible: boolean;
  showEarnings: boolean;
  showStats: boolean;
}

const defaultNotifications: NotificationSettings = {
  emailNewRequests: true,
  emailSessionReminders: true,
  emailMessages: true,
  emailEarnings: true,
  emailMarketing: false,
  pushNewRequests: true,
  pushSessionReminders: true,
  pushMessages: true,
};

const defaultSession: SessionSettings = {
  sessionDuration: 60,
  bufferTime: 15,
  advanceBookingDays: 7,
  cancellationPolicy: "24hours",
  autoAccept: false,
};

const defaultPayment: PaymentSettings = {
  hourlyRate: 50,
  currency: "USD",
  paymentMethod: "bank",
};

const defaultVisibility: VisibilitySettings = {
  profileVisible: true,
  showEarnings: false,
  showStats: true,
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

export function MentorSettings() {
  const [notifications, setNotifications] =
    useState<NotificationSettings>(defaultNotifications);
  const [session, setSession] = useState<SessionSettings>(defaultSession);
  const [payment, setPayment] = useState<PaymentSettings>(defaultPayment);
  const [visibility, setVisibility] =
    useState<VisibilitySettings>(defaultVisibility);

  const saveNotifications = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Notification settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const saveSession = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Session settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const savePayment = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Payment settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const saveVisibility = useMutation({
    mutationFn: async () => {
      await new Promise((resolve) => setTimeout(resolve, 800));
      return { success: true };
    },
    onSuccess: () => toast.success("Visibility settings saved"),
    onError: () => toast.error("Failed to save settings"),
  });

  const handleNotificationChange = (
    key: keyof NotificationSettings,
    value: boolean,
  ) => {
    setNotifications((prev) => ({ ...prev, [key]: value }));
  };

  const handleSessionChange = (
    key: keyof SessionSettings,
    value: number | string | boolean,
  ) => {
    setSession((prev) => ({ ...prev, [key]: value }));
  };

  const handlePaymentChange = (
    key: keyof PaymentSettings,
    value: number | string,
  ) => {
    setPayment((prev) => ({ ...prev, [key]: value }));
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
            Manage your mentor profile and preferences
          </p>
        </div>

        {/* Profile Visibility */}
        <SettingsSection
          title="Profile Visibility"
          description="Control who can see your profile and information"
        >
          <div className="space-y-1">
            <ToggleSetting
              label="Profile Visibility"
              description="Allow your profile to be discovered by mentees"
              checked={visibility.profileVisible}
              onChange={(v) => handleVisibilityChange("profileVisible", v)}
            />
            <ToggleSetting
              label="Show Statistics"
              description="Display your session count and rating publicly"
              checked={visibility.showStats}
              onChange={(v) => handleVisibilityChange("showStats", v)}
            />
            <ToggleSetting
              label="Show Earnings"
              description="Display your hourly rate on your profile"
              checked={visibility.showEarnings}
              onChange={(v) => handleVisibilityChange("showEarnings", v)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => saveVisibility.mutate()}
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

        {/* Session Settings */}
        <SettingsSection
          title="Session Settings"
          description="Configure your mentoring session preferences"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Session Duration (minutes)
              </Label>
              <Input
                type="number"
                value={session.sessionDuration}
                onChange={(e) =>
                  handleSessionChange(
                    "sessionDuration",
                    parseInt(e.target.value),
                  )
                }
                className="mt-1"
                min={15}
                max={180}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Buffer Time (minutes)
              </Label>
              <Input
                type="number"
                value={session.bufferTime}
                onChange={(e) =>
                  handleSessionChange("bufferTime", parseInt(e.target.value))
                }
                className="mt-1"
                min={0}
                max={60}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Advance Booking (days)
              </Label>
              <Input
                type="number"
                value={session.advanceBookingDays}
                onChange={(e) =>
                  handleSessionChange(
                    "advanceBookingDays",
                    parseInt(e.target.value),
                  )
                }
                className="mt-1"
                min={1}
                max={30}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Cancellation Policy
              </Label>
              <select
                value={session.cancellationPolicy}
                onChange={(e) =>
                  handleSessionChange("cancellationPolicy", e.target.value)
                }
                className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
              >
                <option value="24hours">At least 24 hours before</option>
                <option value="12hours">At least 12 hours before</option>
                <option value="6hours">At least 6 hours before</option>
                <option value="no-policy">No cancellation policy</option>
              </select>
            </div>
          </div>
          <div className="py-3 border-b border-gray-50">
            <ToggleSetting
              label="Auto-Accept Requests"
              description="Automatically accept booking requests"
              checked={session.autoAccept}
              onChange={(v) => handleSessionChange("autoAccept", v)}
            />
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              onClick={() => saveSession.mutate()}
              disabled={saveSession.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {saveSession.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
          </div>
        </SettingsSection>

        {/* Payment Settings */}
        <SettingsSection
          title="Payment Settings"
          description="Manage your payment information and rates"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Hourly Rate
              </Label>
              <Input
                type="number"
                value={payment.hourlyRate}
                onChange={(e) =>
                  handlePaymentChange("hourlyRate", parseInt(e.target.value))
                }
                className="mt-1"
                min={0}
              />
            </div>
            <div>
              <Label className="text-sm font-medium text-gray-700">
                Currency
              </Label>
              <select
                value={payment.currency}
                onChange={(e) =>
                  handlePaymentChange("currency", e.target.value)
                }
                className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
              >
                <option value="USD">USD - US Dollar</option>
                <option value="NGN">NGN - Nigerian Naira</option>
                <option value="EUR">EUR - Euro</option>
                <option value="GBP">GBP - British Pound</option>
              </select>
            </div>
          </div>
          <div className="mb-4">
            <Label className="text-sm font-medium text-gray-700 flex items-center gap-2">
              <CreditCard className="w-4 h-4" />
              Payment Method
            </Label>
            <select
              value={payment.paymentMethod}
              onChange={(e) =>
                handlePaymentChange("paymentMethod", e.target.value)
              }
              className="mt-1 w-full h-10 px-3 rounded-md border border-gray-200 bg-white text-sm"
            >
              <option value="bank">Bank Transfer</option>
              <option value="paypal">PayPal</option>
              <option value="stripe">Stripe</option>
            </select>
          </div>
          <div className="mt-4 flex justify-between items-center">
            <Button
              onClick={() => savePayment.mutate()}
              disabled={savePayment.isPending}
              className="bg-purple-600 hover:bg-purple-700"
            >
              {savePayment.isPending && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              Save Changes
            </Button>
            <Button variant="outline">Update Payment Details</Button>
          </div>
        </SettingsSection>

        {/* Notification Preferences */}
        <SettingsSection
          title="Notification Preferences"
          description="Choose how you want to be notified"
        >
          <div className="mb-4">
            <h3 className="font-medium text-gray-900 mb-3 flex items-center gap-2">
              <Mail className="w-4 h-4" />
              Email Notifications
            </h3>
            <div className="space-y-1 pl-6">
              <ToggleSetting
                label="New Booking Requests"
                description="Get notified when someone wants to book a session"
                checked={notifications.emailNewRequests}
                onChange={(v) =>
                  handleNotificationChange("emailNewRequests", v)
                }
              />
              <ToggleSetting
                label="Session Reminders"
                description="Get reminders before scheduled sessions"
                checked={notifications.emailSessionReminders}
                onChange={(v) =>
                  handleNotificationChange("emailSessionReminders", v)
                }
              />
              <ToggleSetting
                label="Messages"
                description="Get notified when you receive new messages"
                checked={notifications.emailMessages}
                onChange={(v) => handleNotificationChange("emailMessages", v)}
              />
              <ToggleSetting
                label="Earnings Updates"
                description="Get notified about payments and earnings"
                checked={notifications.emailEarnings}
                onChange={(v) => handleNotificationChange("emailEarnings", v)}
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
                label="New Booking Requests"
                checked={notifications.pushNewRequests}
                onChange={(v) => handleNotificationChange("pushNewRequests", v)}
              />
              <ToggleSetting
                label="Session Reminders"
                checked={notifications.pushSessionReminders}
                onChange={(v) =>
                  handleNotificationChange("pushSessionReminders", v)
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
              onClick={() => saveNotifications.mutate()}
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
