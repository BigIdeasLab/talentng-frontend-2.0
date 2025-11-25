import { useState, useEffect } from "react";
import { Switch } from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { SecuritySettings } from "@/lib/types/settings";
import { useToast } from "@/hooks/use-toast";
import { setTwoFactor } from "@/lib/api/settings";
import { useDebounce } from "@/hooks/use-debounce";

interface PrivacySecurityProps {
  settings: SecuritySettings;
}

export default function PrivacySecurity({ settings = {} as SecuritySettings }: PrivacySecurityProps) {
  const { toast } = useToast();
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(settings.twoFactorEnabled ?? false);
  const [loading, setLoading] = useState(false);

  const debouncedTwoFactor = useDebounce(twoFactorEnabled, 500);

  useEffect(() => {
    const updateTwoFactor = async () => {
      setLoading(true);
      try {
        await setTwoFactor(debouncedTwoFactor);
        toast({ title: "Success", description: "Two-factor authentication settings updated." });
      } catch (error) {
        toast({ title: "Error", description: "Failed to update two-factor authentication settings." });
      } finally {
        setLoading(false);
      }
    };

    if (debouncedTwoFactor !== settings.twoFactorEnabled) {
      updateTwoFactor();
    }
  }, [debouncedTwoFactor, settings.twoFactorEnabled, toast]);

  const loginActivity = [
    {
      signedIn: "9 minutes ago",
      platform: "Web",
      ipAddress: "178.328.10.35",
      action: "Sign out",
    },
    {
      signedIn: "2 hours ago",
      platform: "Mobile",
      ipAddress: "185.44.77.69",
      action: "Sign out",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-medium text-black mb-2">
          Privacy & Security
        </h2>
        <p className="text-gray-500">Setup your profile for this workspace</p>
      </div>

      {/* Two-Factor Authentication */}
      <div className="max-w-lg">
        <div className="flex items-center justify-between">
          <span className="text-xl font-medium text-black">
            Two-Factor Authentication
          </span>
          <Switch 
            checked={twoFactorEnabled}
            onCheckedChange={setTwoFactorEnabled} 
            disabled={loading}
          />
        </div>
      </div>

      {/* Login Activity - Not yet functional */}
      <div className="space-y-4">
        <div>
          <h3 className="text-2xl font-medium text-black mb-2">
            Login Activity
          </h3>
          <p className="text-gray-500">
            These sessions are currently signed in to your account
          </p>
        </div>

        <div className="rounded-3xl border border-gray-200 overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-white border-gray-200">
                <TableHead className="text-gray-600 font-medium">
                  Signed In
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Platform
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  IP Address
                </TableHead>
                <TableHead className="text-gray-600 font-medium">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loginActivity.map((session, index) => (
                <TableRow
                  key={index}
                  className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                >
                  <TableCell className="text-gray-600">
                    {session.signedIn}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {session.platform}
                  </TableCell>
                  <TableCell className="text-gray-600">
                    {session.ipAddress}
                  </TableCell>
                  <TableCell>
                    <button className="text-green-600 underline hover:no-underline">
                      {session.action}
                    </button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}