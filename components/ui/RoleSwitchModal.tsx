"use client";

import React, { useState } from "react";
import { Modal } from "./modal";
import { Button } from "./button";
import { switchRole } from "@/lib/api/auth-service";
import { Loader2, ShieldAlert } from "lucide-react";
import { useToast } from "@/hooks";

interface RoleSwitchModalProps {
  isOpen: boolean;
  onClose: () => void;
  requiredRole: "talent" | "recruiter" | "mentor";
  onSwitchSuccess?: () => void;
}

export function RoleSwitchModal({
  isOpen,
  onClose,
  requiredRole,
  onSwitchSuccess,
}: RoleSwitchModalProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);

  if (!isOpen || !requiredRole) return null;

  const handleSwitch = async () => {
    setIsLoading(true);
    try {
      await switchRole(requiredRole);
      toast({
        title: "Role switched",
        description: `You are now active as a ${requiredRole}`,
      });

      if (onSwitchSuccess) {
        onSwitchSuccess();
      } else {
        // Reload is often the cleanest way to reset all state across the app
        window.location.reload();
      }
      onClose();
    } catch (error: any) {
      toast({
        title: "Switch failed",
        description: error.message || "Could not switch role",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Role Authorization Required"
      size="sm"
    >
      <div className="flex flex-col items-center gap-4 py-4 text-center">
        <div className="w-12 h-12 rounded-full bg-amber-100 flex items-center justify-center">
          <ShieldAlert className="w-6 h-6 text-amber-600" />
        </div>
        <div className="px-2">
          <p className="text-sm text-gray-700">
            This action requires you to be active as a{" "}
            <strong>{requiredRole}</strong>.
          </p>
          <p className="text-[13px] text-gray-500 mt-2">
            Would you like to switch your active role now?
          </p>
        </div>
        <div className="flex flex-col w-full gap-2 mt-4">
          <Button
            onClick={handleSwitch}
            disabled={isLoading}
            className="w-full bg-[#5C30FF] hover:bg-[#4a26cc] text-white border-0"
          >
            {isLoading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            Switch to{" "}
            {requiredRole.charAt(0).toUpperCase() + requiredRole.slice(1)}
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            disabled={isLoading}
            className="w-full text-[#525866]"
          >
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
}
