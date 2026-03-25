"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Modal } from "@/components/ui/modal";
import { XCircle } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  confirmationText: string;
  confirmText?: string;
  cancelText?: string;
  isLoading?: boolean;
}

export function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmationText,
  confirmText = "Delete",
  cancelText = "Cancel",
  isLoading = false,
}: DeleteConfirmationModalProps) {
  const [inputValue, setInputValue] = useState("");

  const handleClose = () => {
    setInputValue("");
    onClose();
  };

  const handleConfirm = () => {
    if (inputValue === confirmationText) {
      onConfirm();
      setInputValue("");
    }
  };

  const isConfirmDisabled = inputValue !== confirmationText || isLoading;

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="sm">
      <div className="flex flex-col items-center text-center">
        {/* Icon */}
        <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-[#FEF2F2]">
          <XCircle className="h-6 w-6 text-[#EF4444]" />
        </div>

        {/* Title */}
        <h3 className="mb-2 font-inter-tight text-[16px] font-semibold text-black">
          {title}
        </h3>

        {/* Description */}
        <p className="mb-4 font-inter-tight text-[14px] text-[#525866]">
          {description}
        </p>

        {/* Confirmation Input */}
        <div className="w-full mb-6">
          <Label className="text-left block mb-2 font-inter-tight text-[12px] font-medium text-[#525866]">
            Type{" "}
            <span className="font-mono bg-gray-100 px-1 rounded">
              {confirmationText}
            </span>{" "}
            to confirm:
          </Label>
          <Input
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            placeholder={confirmationText}
            className="w-full"
            disabled={isLoading}
          />
        </div>

        {/* Actions */}
        <div className="flex w-full gap-3">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isLoading}
            className="flex-1 rounded-[30px] border-[#E1E4EA] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-[#525866] hover:bg-[#F5F5F5]"
          >
            {cancelText}
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isConfirmDisabled}
            className="flex-1 rounded-[30px] px-4 py-2.5 font-inter-tight text-[13px] font-normal text-white bg-[#EF4444] hover:bg-[#DC2626] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? "Deleting..." : confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  );
}
