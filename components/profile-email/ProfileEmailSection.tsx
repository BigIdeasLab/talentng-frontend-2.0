"use client";

import { useState, useEffect } from "react";
import { Mail, Check, Clock, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { StatusIndicator } from "./StatusIndicator";
import { VerificationModal } from "./VerificationModal";
import type { ProfileEmailSectionProps, EmailStatus } from "./types";

export function ProfileEmailSection({
  role,
  currentEmail,
  emailVerified,
  emailUpdatedAt,
  mainAccountEmail,
  onEmailUpdate,
  onVerifyEmail,
  onResendCode,
  isLoading = false,
  rateLimitedUntil,
  roleColors,
  isInitialLoading = false,
}: ProfileEmailSectionProps) {
  const [emailInput, setEmailInput] = useState(currentEmail || "");

  useEffect(() => {
    setEmailInput(currentEmail || "");
  }, [currentEmail]);
  const [showVerificationModal, setShowVerificationModal] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Determine email status
  const getEmailStatus = (): EmailStatus => {
    if (rateLimitedUntil && new Date(rateLimitedUntil) > new Date()) {
      return 'rate-limited';
    }
    if (!currentEmail) {
      return 'main-email';
    }
    if (!emailVerified) {
      return 'pending';
    }
    return 'verified';
  };

  const status = getEmailStatus();
  const isRateLimited = status === 'rate-limited';
  const needsVerification = currentEmail && !emailVerified;

  const handleEmailUpdate = async () => {
    if (!emailInput.trim() || emailInput === currentEmail) return;
    
    setIsUpdating(true);
    try {
      await onEmailUpdate(emailInput.trim());
      setShowVerificationModal(true);
    } catch (error) {
      // Error handling is done by parent component via toast
    } finally {
      setIsUpdating(false);
    }
  };

  const handleVerification = async (code: string) => {
    try {
      await onVerifyEmail(code);
      setShowVerificationModal(false);
    } catch (error) {
      // Error handling is done by parent component
      throw error; // Re-throw to let modal handle it
    }
  };

  const handleResendCode = async () => {
    try {
      await onResendCode();
    } catch (error) {
      // Error handling is done by parent component
      throw error;
    }
  };

  const getDisplayEmail = () => {
    if (currentEmail && emailVerified) {
      return currentEmail;
    }
    return mainAccountEmail;
  };

  const getRoleDisplayName = () => {
    return role.charAt(0).toUpperCase() + role.slice(1);
  };

  // Show skeleton loading state while initial data is being fetched
  if (isInitialLoading) {
    return (
      <div className="border border-[#E1E4EA] rounded-[16px] bg-white px-4 md:px-6 py-4 md:py-5">
        <div className="mb-5">
          <div className="h-5 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
          <div className="h-4 w-full max-w-md bg-gray-100 rounded animate-pulse"></div>
        </div>

        <div className="space-y-4">
          {/* Current Status Skeleton */}
          <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
            <div className="flex-1">
              <div className="h-4 w-56 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-3 w-40 bg-gray-100 rounded animate-pulse"></div>
            </div>
            <div className="h-6 w-24 bg-gray-200 rounded-full animate-pulse"></div>
          </div>

          {/* Email Input Skeleton */}
          <div className="space-y-3">
            <div>
              <div className="h-3 w-48 bg-gray-200 rounded animate-pulse mb-2"></div>
              <div className="h-10 w-full bg-gray-100 rounded-lg animate-pulse"></div>
            </div>

            {/* Button Skeleton */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
              <div className="h-11 w-full sm:w-32 bg-gray-200 rounded-lg animate-pulse"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="border border-[#E1E4EA] rounded-[16px] bg-white px-4 md:px-6 py-4 md:py-5">
      <div className="mb-5">
        <h2 className="text-[15px] font-medium font-inter-tight text-black flex items-center gap-2">
          <Mail className="w-4 h-4" />
          {getRoleDisplayName()} Profile Email
        </h2>
        <p className="text-[13px] font-inter-tight text-[#525866] mt-1">
          Set a custom email address for {role} notifications. If not set, notifications will be sent to your main account email.
        </p>
      </div>

      <div className="space-y-4">
        {/* Current Status */}
        <div className="flex items-center justify-between py-3 border-b border-[#E1E4EA]">
          <div>
            <p className="text-[13px] font-medium font-inter-tight text-black">
              Current Email for {getRoleDisplayName()} Notifications
            </p>
            <p className="text-[12px] font-inter-tight text-[#525866]">
              {getDisplayEmail()}
            </p>
          </div>
          <StatusIndicator 
            status={status} 
            nextUpdateTime={rateLimitedUntil} 
          />
        </div>

        {/* Email Input */}
        <div className="space-y-3">
          <div>
            <Label 
              htmlFor={`${role}-email`}
              className="text-[12px] font-medium font-inter-tight text-[#525866]"
            >
              Custom {getRoleDisplayName()} Email (Optional)
            </Label>
            <Input
              id={`${role}-email`}
              type="email"
              value={emailInput}
              onChange={(e) => setEmailInput(e.target.value)}
              className="mt-1"
              placeholder={`Enter email for ${role} notifications`}
              disabled={isRateLimited || isLoading}
            />
            {isRateLimited && (
              <p className="text-[11px] text-amber-600 mt-1 flex items-center gap-1">
                <Clock className="w-3 h-3" />
                You can update this email again on {new Date(rateLimitedUntil!).toLocaleDateString()}
              </p>
            )}
          </div>

          {/* Verification Notice */}
          {needsVerification && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
              <div className="flex items-start gap-2">
                <AlertCircle className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
                <div>
                  <p className="text-[12px] font-medium text-amber-800">
                    Email verification required
                  </p>
                  <p className="text-[11px] text-amber-700 mt-1">
                    Your custom email needs to be verified before it can receive notifications.
                  </p>
                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-2 h-7 text-[11px] border-amber-300 text-amber-700 hover:bg-amber-100"
                    onClick={() => setShowVerificationModal(true)}
                  >
                    Verify Now
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-3">
            <Button
              onClick={handleEmailUpdate}
              disabled={
                isUpdating || 
                isLoading || 
                isRateLimited || 
                !emailInput.trim() || 
                emailInput === currentEmail
              }
              className="text-white active:opacity-90 hover:opacity-90 min-h-[44px] flex-1 sm:flex-none"
              style={{ backgroundColor: roleColors.primary }}
            >
              {isUpdating && (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              )}
              {currentEmail ? 'Update Email' : 'Set Custom Email'}
            </Button>

            {currentEmail && (
              <Button
                variant="outline"
                onClick={() => {
                  setEmailInput("");
                  handleEmailUpdate();
                }}
                disabled={isUpdating || isLoading || isRateLimited}
                className="min-h-[44px] flex-1 sm:flex-none"
              >
                Use Main Account Email
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* Verification Modal */}
      <VerificationModal
        isOpen={showVerificationModal}
        onClose={() => setShowVerificationModal(false)}
        onVerify={handleVerification}
        onResendCode={handleResendCode}
        email={currentEmail || emailInput}
        isLoading={isLoading}
      />
    </div>
  );
}