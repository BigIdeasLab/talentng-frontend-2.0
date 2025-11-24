"use client";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  HelpCircle,
} from "lucide-react";
import AccountSettings from "@/components/settings/AccountSettings";
import ProfilePreferences from "@/components/settings/ProfilePreferences";
import NotificationSettings from "@/components/settings/NotificationSettings";
import PrivacySecurity from "@/components/settings/PrivacySecurity";
import HelpSupport from "@/components/settings/HelpSupport";
import { getUserSettings } from "@/lib/api/settings";
import { UserSettings } from "@/lib/types/settings";
import { Skeleton } from "@/components/ui/skeleton";

type SettingsTab =
  | "account"
  | "profile"
  | "notifications"
  | "security"
  | "help";

export default function Settings() {
  const [activeTab, setActiveTab] = useState<SettingsTab>("account");
  const [settings, setSettings] = useState<UserSettings | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const userSettings = await getUserSettings();
        setSettings(userSettings);
      } catch (err) {
        setError("Failed to fetch settings.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const navigationTabs = [
    {
      id: "account" as const,
      label: "Account Settings",
      icon: <SettingsIcon className="w-4.5 h-4.5" />,
    },
    {
      id: "profile" as const,
      label: "Profile & Preferences",
      icon: <User className="w-4.5 h-4.5" />,
    },
    {
      id: "notifications" as const,
      label: "Notifications",
      icon: <Bell className="w-4.5 h-4.5" />,
    },
    {
      id: "security" as const,
      label: "Privacy & Security",
      icon: <Shield className="w-4.5 h-4.5" />,
    },
    {
      id: "help" as const,
      label: "Help & Support",
      icon: <HelpCircle className="w-4.5 h-4.5" />,
    },
  ];

  const renderContent = () => {
    if (loading) {
      return <Skeleton className="h-[400px] w-full" />;
    }

    if (error) {
      return <div className="text-red-500">{error}</div>;
    }

    if (settings) {
      switch (activeTab) {
        case "account":
          return <AccountSettings settings={settings.account} />;
        case "profile":
          return <ProfilePreferences settings={settings.profile} />;
        case "notifications":
          return <NotificationSettings settings={settings.notifications} />;
        case "security":
          return <PrivacySecurity settings={settings.security} />;
        case "help":
          return <HelpSupport />;
        default:
          return null;
      }
    }

    return null;
  };

  return (
    <div className="flex-1 p-8 max-w-7xl mx-auto w-full">
      {/* Settings Navigation */}
      <div className="flex items-center gap-2 p-3 bg-gray-50 rounded-3xl border border-gray-100 mb-8">
        {navigationTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={cn(
              "flex items-center gap-1.5 px-2 py-2 rounded-xl text-sm font-medium transition-colors",
              activeTab === tab.id
                ? "bg-white text-black shadow-sm"
                : "text-gray-600 hover:text-black",
            )}
          >
            {tab.icon}
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Settings Content */}
      <div className="bg-white rounded-3xl border border-gray-100 p-8">
        {renderContent()}
      </div>
    </div>
  );
}
