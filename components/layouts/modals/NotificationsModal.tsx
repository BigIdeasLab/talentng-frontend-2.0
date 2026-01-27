"use client";

import { X } from "lucide-react";
import { useProfile } from "@/hooks/useProfile";
import { TalentNotifications } from "@/components/talent/notification/TalentNotifications";
import { EmployerNotifications } from "@/components/employer/notification/EmployerNotifications";
import { MentorNotifications } from "@/components/mentor/notification/MentorNotifications";

interface NotificationsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationsModal({
  isOpen,
  onClose,
}: NotificationsModalProps) {
  const { activeRole } = useProfile();

  if (!isOpen) return null;

  const renderNotifications = () => {
    switch (activeRole) {
      case "recruiter":
        return <EmployerNotifications />;
      case "mentor":
        return <MentorNotifications />;
      case "talent":
      default:
        return <TalentNotifications />;
    }
  };

  return (
    <div className="fixed left-[250px] top-0 bottom-0 w-[350px] z-50">
      <div className="bg-white w-full h-full flex flex-col overflow-hidden shadow-lg">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 flex-shrink-0">
          <h2 className="text-[17px] font-semibold text-gray-900">
            Notifications
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors flex-shrink-0"
          >
            <X size={20} strokeWidth={1.5} />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-hidden">{renderNotifications()}</div>
      </div>
    </div>
  );
}
