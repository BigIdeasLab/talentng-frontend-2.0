"use client";

import { useEffect } from "react";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface SuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  description?: string;
  accentColor?: string;
  /** Optional CTA button label. If omitted, only "Done" button is shown. */
  ctaLabel?: string;
  onCta?: () => void;
  /** Auto-close after `autoCloseDuration` ms. 0 disables auto-close. Default: 0 */
  autoCloseDuration?: number;
}

export function SuccessModal({
  isOpen,
  onClose,
  title,
  description,
  accentColor = ROLE_COLORS.talent.primary,
  ctaLabel,
  onCta,
  autoCloseDuration = 0,
}: SuccessModalProps) {
  useEffect(() => {
    if (!isOpen || !autoCloseDuration) return;
    const timer = setTimeout(onClose, autoCloseDuration);
    return () => clearTimeout(timer);
  }, [isOpen, autoCloseDuration, onClose]);

  if (!isOpen) return null;

  const lightBg = `${accentColor}18`;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Modal Card */}
      <div
        className="relative bg-white rounded-[20px] w-full max-w-[380px] mx-4 shadow-[0_8px_40px_0_rgba(0,0,0,0.18)] flex flex-col items-center text-center px-8 py-10 gap-5"
        style={{
          animation: "successModalIn 0.25s cubic-bezier(0.22,1,0.36,1) both",
        }}
      >
        {/* Animated checkmark ring */}
        <div
          className="flex items-center justify-center rounded-full"
          style={{
            width: 80,
            height: 80,
            backgroundColor: lightBg,
          }}
        >
          {/* Outer ring pulse */}
          <div
            className="absolute rounded-full opacity-30"
            style={{
              width: 80,
              height: 80,
              backgroundColor: accentColor,
              animation: "successPulse 1.8s ease-out infinite",
            }}
          />
          {/* Inner check circle */}
          <div
            className="relative flex items-center justify-center rounded-full"
            style={{
              width: 56,
              height: 56,
              backgroundColor: accentColor,
            }}
          >
            <svg
              width="28"
              height="28"
              viewBox="0 0 28 28"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              style={{ animation: "successCheck 0.4s 0.15s ease both" }}
            >
              <path
                d="M5.25 14L10.5 19.25L22.75 8.75"
                stroke="white"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
        </div>

        {/* Text */}
        <div className="flex flex-col gap-2">
          <h2 className="font-inter-tight text-[18px] font-semibold text-black leading-tight">
            {title}
          </h2>
          {description && (
            <p className="font-inter-tight text-[13px] font-normal text-[#525866] leading-[155%]">
              {description}
            </p>
          )}
        </div>

        {/* Actions */}
        <div className={`flex w-full gap-3 mt-1 ${ctaLabel ? "flex-col" : ""}`}>
          {ctaLabel && onCta && (
            <button
              onClick={() => {
                onCta();
                onClose();
              }}
              className="w-full py-3 rounded-[30px] font-inter-tight text-[13px] font-medium text-white hover:opacity-80 transition-opacity"
              style={{ backgroundColor: accentColor }}
            >
              {ctaLabel}
            </button>
          )}
          <button
            onClick={onClose}
            className="w-full py-3 rounded-[30px] font-inter-tight text-[13px] font-normal text-[#525866] border border-[#E1E4EA] hover:bg-[#F5F5F5] transition-colors"
          >
            Done
          </button>
        </div>
      </div>

      <style jsx global>{`
        @keyframes successModalIn {
          from {
            opacity: 0;
            transform: scale(0.92) translateY(12px);
          }
          to {
            opacity: 1;
            transform: scale(1) translateY(0);
          }
        }
        @keyframes successPulse {
          0% {
            transform: scale(0.95);
            opacity: 0.35;
          }
          60% {
            transform: scale(1.25);
            opacity: 0.1;
          }
          100% {
            transform: scale(0.95);
            opacity: 0.35;
          }
        }
        @keyframes successCheck {
          from {
            opacity: 0;
            stroke-dashoffset: 40;
          }
          to {
            opacity: 1;
            stroke-dashoffset: 0;
          }
        }
      `}</style>
    </div>
  );
}
