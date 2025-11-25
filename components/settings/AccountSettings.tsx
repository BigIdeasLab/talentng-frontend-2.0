import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Edit } from "lucide-react";
import { AccountSettings as AccountSettingsType } from "@/lib/types/settings";
import { useToast } from "@/hooks/use-toast";
import { useState } from "react";
import { updateAccountInfo, changePassword, deleteAccount } from "@/lib/api/settings";

interface AccountSettingsProps {
  settings: AccountSettingsType;
}

export default function AccountSettings({ settings = {} as AccountSettingsType }: AccountSettingsProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings ?? { fullName: '', email: '', phoneNumber: '' });
  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await updateAccountInfo(formData);
      toast({ title: "Success", description: "Account information updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update account information." });
    } finally {
      setLoading(false);
    }
  };

  const handleChangePassword = async () => {
    setLoading(true);
    try {
      await changePassword(passwordData);
      toast({ title: "Success", description: "Password changed successfully." });
      setPasswordData({ currentPassword: "", newPassword: "" });
    } catch (error) {
      toast({ title: "Error", description: "Failed to change password." });
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm("Are you sure you want to delete your account? This action is irreversible.")) {
      setLoading(true);
      try {
        await deleteAccount();
        toast({ title: "Success", description: "Account deleted successfully." });
        // Handle logout and redirect here
      } catch (error) {
        toast({ title: "Error", description: "Failed to delete account." });
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-black mb-2">Basic Info</h2>
          <p className="text-gray-500">Setup your profile for this workspace</p>
        </div>
        <div className="flex items-center gap-4">
          <Button variant="outline" className="rounded-3xl border-gray-200" onClick={handleSaveChanges} disabled={loading}>
            {loading ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      </div>

      {/* Form Fields */}
      <div className="max-w-lg space-y-6">
        <div>
          <Input
            placeholder="Full Name"
            name="fullName"
            value={formData.fullName}
            onChange={handleInputChange}
            className="h-12 rounded-3xl border-gray-300 text-gray-600"
          />
        </div>
        <div>
          <Input
            placeholder="Email"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            className="h-12 rounded-3xl border-gray-300 text-gray-600"
          />
        </div>
        <div>
          <Input
            placeholder="Phone Number"
            type="tel"
            name="phoneNumber"
            value={formData.phoneNumber}
            onChange={handleInputChange}
            className="h-12 rounded-3xl border-gray-300 text-gray-600"
          />
        </div>
        <div>
          <Input
            placeholder="Current Password"
            type="password"
            name="currentPassword"
            value={passwordData.currentPassword}
            onChange={handlePasswordChange}
            className="h-12 rounded-3xl border-gray-300 text-gray-600"
          />
        </div>
        <div>
          <Input
            placeholder="New Password"
            type="password"
            name="newPassword"
            value={passwordData.newPassword}
            onChange={handlePasswordChange}
            className="h-12 rounded-3xl border-gray-300 text-gray-600"
          />
        </div>
        <Button onClick={handleChangePassword} disabled={loading}>
          {loading ? "Changing..." : "Change Password"}
        </Button>
      </div>

      {/* Delete Account */}
      <div className="pt-6 space-y-6">
        <Button
          variant="outline"
          className="text-red-500 border-gray-100 rounded-2xl"
          onClick={handleDeleteAccount}
          disabled={loading}
        >
          {loading ? "Deleting..." : "Delete account"}
        </Button>
      </div>
    </div>
  );
}