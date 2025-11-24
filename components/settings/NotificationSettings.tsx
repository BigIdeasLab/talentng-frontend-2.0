import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import { NotificationSettings as NotificationSettingsType } from "@/lib/types/settings";
import { useToast } from "@/hooks/use-toast";
import { updateNotificationSettings } from "@/lib/api/settings";
import { useDebounce } from "@/hooks/use-debounce";

interface NotificationSettingsProps {
  settings: NotificationSettingsType;
}

export default function NotificationSettings({ settings = {} as NotificationSettingsType }: NotificationSettingsProps) {
  const { toast } = useToast();
  const [notificationSettings, setNotificationSettings] = useState(
    settings ?? { email: false, inApp: false, push: false }
  );
  const [loading, setLoading] = useState(false);

  const debouncedSettings = useDebounce(notificationSettings, 500);

  useEffect(() => {
    const updateSettings = async () => {
      setLoading(true);
      try {
        await updateNotificationSettings(debouncedSettings);
        toast({ title: "Success", description: "Notification settings updated." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to update notification settings." });
      } finally {
        setLoading(false);
      }
    };

    if (JSON.stringify(debouncedSettings) !== JSON.stringify(settings)) {
      updateSettings();
    }
  }, [debouncedSettings, settings, toast]);

  const handleSwitchChange = (name: keyof NotificationSettingsType, value: boolean) => {
    setNotificationSettings((prev) => ({ ...prev, [name]: value }));
  };


  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-medium text-black mb-2">Notifications</h2>
        <p className="text-gray-500">Setup your profile for this workspace</p>
      </div>

      {/* Notification Options */}
      <div className="max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-black">
            Email Notifications
          </span>
          <Switch
            checked={notificationSettings.email}
            onCheckedChange={(value) => handleSwitchChange("email", value)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-black">
            In-App Notifications
          </span>
          <Switch
            checked={notificationSettings.inApp}
            onCheckedChange={(value) => handleSwitchChange("inApp", value)}
            disabled={loading}
          />
        </div>

        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-black">
            Push Notifications
          </span>
          <Switch
            checked={notificationSettings.push}
            onCheckedChange={(value) => handleSwitchChange("push", value)}
            disabled={loading}
          />
        </div>
      </div>
    </div>
  );
}