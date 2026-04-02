"use client";

import Link from "next/link";
import { ShieldCheck, ArrowRight } from "lucide-react";
import { useVerificationStatus } from "@/hooks/useBusinessVerification";

export function VerificationPromptCard() {
  const { data: verificationStatus, isLoading } = useVerificationStatus();

  // Don't show if loading or if already verified
  if (isLoading || verificationStatus?.status === "approved") {
    return null;
  }

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-amber-50 to-yellow-50 border border-amber-200 overflow-hidden p-4 md:p-6 flex-shrink-0">
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 mt-0.5">
            <ShieldCheck className="h-6 w-6 text-amber-600" />
          </div>
          <div>
            {/* Title */}
            <h2 className="text-black text-[16px] font-inter-tight font-semibold mb-1">
              Verify Your Business
            </h2>

            {/* Description */}
            <p className="text-gray-700 text-[13px] font-inter-tight">
              Get a verified badge and build trust with talent. Verification
              takes 2-3 business days.
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <Link
          href="/profile?tab=verification"
          className="flex h-[44px] px-4 justify-center items-center gap-2 rounded-lg bg-amber-600 hover:bg-amber-700 transition-colors group flex-shrink-0 w-fit"
        >
          <span className="font-inter-tight text-[13px] font-medium text-white">
            Start Verification
          </span>
          <ArrowRight className="w-4 h-4 text-white group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
