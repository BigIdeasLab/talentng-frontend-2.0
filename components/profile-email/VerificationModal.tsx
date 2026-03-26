"use client";

import { useState, useRef, useEffect } from "react";
import { X, Mail, Loader2, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { VerificationModalProps } from "./types";

export function VerificationModal({
  isOpen,
  onClose,
  onVerify,
  onResendCode,
  email,
  isLoading = false,
  error,
}: VerificationModalProps) {
  const [code, setCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Reset state when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCode("");
      setIsVerifying(false);
      setIsResending(false);
      // Focus first input after a short delay
      setTimeout(() => {
        inputRefs.current[0]?.focus();
      }, 100);
    }
  }, [isOpen]);

  // Resend cooldown timer
  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleCodeChange = (index: number, value: string) => {
    // Only allow digits
    if (!/^\d*$/.test(value)) return;

    const newCode = code.split("");
    newCode[index] = value;
    const updatedCode = newCode.join("");

    setCode(updatedCode);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, 6);
    setCode(pastedData);

    // Focus the next empty input or the last one
    const nextIndex = Math.min(pastedData.length, 5);
    inputRefs.current[nextIndex]?.focus();
  };

  const handleVerify = async () => {
    if (code.length !== 6) return;

    setIsVerifying(true);
    try {
      await onVerify(code);
      // Modal will be closed by parent component on success
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsVerifying(false);
    }
  };

  const handleResend = async () => {
    setIsResending(true);
    try {
      await onResendCode();
      setResendCooldown(60); // 60 second cooldown
    } catch (error) {
      // Error is handled by parent component
    } finally {
      setIsResending(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-[16px] w-full max-w-md mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-[#E1E4EA]">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center">
              <Mail className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-[15px] font-medium font-inter-tight text-black">
                Verify Email Address
              </h2>
              <p className="text-[12px] font-inter-tight text-[#525866]">
                Enter the 6-digit code sent to your email
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="h-8 w-8 p-0"
            disabled={isVerifying || isLoading}
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          <div className="text-center">
            <p className="text-[13px] text-[#525866]">
              We sent a verification code to
            </p>
            <p className="text-[13px] font-medium text-black mt-1">{email}</p>
          </div>

          {/* Code Input */}
          <div className="space-y-3">
            <div className="flex gap-2 justify-center">
              {Array.from({ length: 6 }).map((_, index) => (
                <Input
                  key={index}
                  ref={(el) => {
                    inputRefs.current[index] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={code[index] || ""}
                  onChange={(e) => handleCodeChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  onPaste={handlePaste}
                  className="w-12 h-12 text-center text-lg font-medium"
                  disabled={isVerifying || isLoading}
                />
              ))}
            </div>

            {error && (
              <div className="text-center">
                <p className="text-[12px] text-red-600">{error}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              onClick={handleVerify}
              disabled={code.length !== 6 || isVerifying || isLoading}
              className="w-full min-h-[44px] bg-blue-600 text-white hover:bg-blue-700"
            >
              {isVerifying && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
              Verify Email
            </Button>

            <div className="text-center">
              <p className="text-[12px] text-[#525866] mb-2">
                Didn't receive the code?
              </p>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResend}
                disabled={isResending || resendCooldown > 0 || isLoading}
                className="text-[12px] text-blue-600 hover:text-blue-700 h-auto p-1"
              >
                {isResending ? (
                  <>
                    <Loader2 className="w-3 h-3 mr-1 animate-spin" />
                    Sending...
                  </>
                ) : resendCooldown > 0 ? (
                  `Resend in ${resendCooldown}s`
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 mr-1" />
                    Resend Code
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
