"use client";

import { Button } from "@/components/ui/button";
import { Modal } from "@/components/ui/modal";
import { AlertTriangle, CheckCircle, XCircle } from "lucide-react";

type ConfirmationType = "default" | "success" | "danger";

interface ConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  type?: ConfirmationType;
  isLoading?: boolean;
  confirmColor?: string;
}

const typeConfig = {
  default: {
    icon: AlertTriangle,
    iconBg: "bg-[#FFF4E5]",
    iconColor: "text-[#F59E0B]",
    confirmBg: "bg-[#5C30FF] hover:bg-[#4A26CC]",
  },
  success: {
    icon: CheckCircle,
    iconBg: "bg-[#ECFDF3]",
    iconColor: "text-[#10B981]",
    confirmBg: "bg-[#10B981] hover:bg-[#059669]",
  },
  danger: {
    icon: XCircle,
    iconBg: "bg-[#FEF2F2]",
    iconColor: "text-[#EF4444]",
    confirmBg: "bg-[#EF4444] hover:bg-[#DC2626]",
  },
};

export function ConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmText = "Confirm",
  cancelText = "Cancel",
  type = "default",
  isLoading = false,
  confirmColor,
}: ConfirmationModalProps) {
  const config = typeConfig[type];
  const Icon = config.icon;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="sm">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div
          className={`mb-4 flex h-12 w-12 items-center justify-center rounded-full ${config.iconBg}`}
        >
          <Icon className={`h-6 w-6 ${config.iconColor}`} />
        </div>

        {/* Title */}
        <h3 className="mb-2 font-inter-tight text-[16px] font-semibold text-black">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-6 font-inter-tight text-[14px] text-[#525866]">
          {description}
        </p>

        {/* Actions */}
        <div className="flex w-full gap-3">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isLoading}
            className="flex-1 rounded-[30px] border-[#E1E4EA] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-[#525866] hover:bg-[#F5F5F5]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className={`flex-1 rounded-[30px] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-white ${confirmColor ? "hover:opacity-80" : config.confirmBg}`}
            style={confirmColor ? { backgroundColor: confirmColor } : undefined}
          >
            {isLoading ? "Loading..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
