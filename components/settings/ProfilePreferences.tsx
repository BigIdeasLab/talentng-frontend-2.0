import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProfileSettings } from "@/lib/types/settings";
import { useToast } from "@/hooks/use-toast";
import { updateProfilePreferences } from "@/lib/api/settings";

interface ProfilePreferencesProps {
  settings: ProfileSettings;
}

export default function ProfilePreferences({ settings = {} as ProfileSettings }: ProfilePreferencesProps) {
  const { toast } = useToast();
  const [formData, setFormData] = useState(settings ?? { visibility: 'private', location: '', preferredRole: '', availability: '' });
  const [loading, setLoading] = useState(false);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSwitchChange = (value: boolean) => {
    setFormData((prev) => ({ ...prev, visibility: value ? "public" : "private" }));
  };

  const handleSaveChanges = async () => {
    setLoading(true);
    try {
      await updateProfilePreferences(formData);
      toast({ title: "Success", description: "Profile preferences updated." });
    } catch (error) {
      toast({ title: "Error", description: "Failed to update profile preferences." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-medium text-black mb-2">
            Profile Preferences
          </h2>
          <p className="text-gray-500">Setup your profile for this workspace</p>
        </div>
        <Button variant="outline" className="rounded-3xl border-gray-200" onClick={handleSaveChanges} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {/* Profile Visibility */}
      <div className="max-w-lg space-y-6">
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-black">
            Profile Visibility
          </span>
          <Switch
            checked={formData.visibility === "public"}
            onCheckedChange={handleSwitchChange}
          />
        </div>

        {/* Form Fields */}
        <div className="space-y-6">
          <Input
            placeholder="Location (for job suggestions)"
            name="location"
            value={formData.location}
            onChange={handleInputChange}
            className="h-12 rounded-3xl border-gray-300 text-gray-600"
          />

          <Select value={formData.preferredRole} onValueChange={(value) => handleSelectChange("preferredRole", value)}>
            <SelectTrigger className="h-12 rounded-3xl border-gray-300 text-gray-600">
              <SelectValue placeholder="Preferred Role" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Software Engineer">Software Engineer</SelectItem>
              <SelectItem value="Frontend Developer">Frontend Developer</SelectItem>
              <SelectItem value="Backend Developer">Backend Developer</SelectItem>
              <SelectItem value="Full Stack Developer">Full Stack Developer</SelectItem>
              <SelectItem value="Mobile Developer">Mobile Developer</SelectItem>
              <SelectItem value="DevOps Engineer">DevOps Engineer</SelectItem>
            </SelectContent>
          </Select>

          <Select value={formData.availability} onValueChange={(value) => handleSelectChange("availability", value)}>
            <SelectTrigger className="h-12 rounded-3xl border-gray-300 text-gray-600">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="full-time">Full-time</SelectItem>
              <SelectItem value="part-time">Part-time</SelectItem>
              <SelectItem value="contract">Contract</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <Button className="w-full rounded-3xl bg-black text-white hover:bg-gray-800" onClick={handleSaveChanges} disabled={loading}>
          {loading ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </div>
  );
}