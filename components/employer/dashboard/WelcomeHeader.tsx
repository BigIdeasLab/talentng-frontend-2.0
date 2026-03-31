import Link from "next/link";
import { ArrowRight, ShieldCheck } from "lucide-react";
import { HideOnMobile } from "@/components/ui/HideOnMobile";
import { useVerificationStatus } from "@/hooks/useBusinessVerification";

interface WelcomeHeaderProps {
  companyName: string;
  totalApplicants: number;
  pendingReviews: number;
}

export function WelcomeHeader({
  companyName,
  totalApplicants,
  pendingReviews,
}: WelcomeHeaderProps) {
  const { data: verificationStatus } = useVerificationStatus();
  const isVerified = verificationStatus?.status === "approved";

  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#0D9F5C]/90 to-[#0D9F5C] overflow-hidden p-4 md:p-6 flex-shrink-0">
      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          {/* Greeting */}
          <p className="text-white/80 text-[11px] font-inter-tight mb-2">
            Good morning!
          </p>

          {/* Title */}
          <h1 className="text-white text-[18px] font-inter-tight font-bold mb-2 flex items-center gap-2">
            Welcome back, {companyName}
            {isVerified && (
              <Link
                href="/verification"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-[11px] font-medium text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Verified
              </Link>
            )}
            {!isVerified && (
              <Link
                href="/verification"
                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-white/20 hover:bg-white/30 transition-colors text-[11px] font-medium text-white"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                Get Verified
              </Link>
            )}
          </h1>

          {/* Description */}
          <p className="text-white text-[13px] font-inter-tight">
            You have {totalApplicants} applicants in your pipeline. {pendingReviews} pending review{pendingReviews !== 1 ? "s" : ""} awaiting your attention.
          </p>
        </div>

        {/* View Applicants Button */}
        <Link
          href="/applicants"
          className="flex h-[44px] px-4 justify-center items-center gap-2 rounded-lg bg-white hover:bg-gray-100 transition-colors group flex-shrink-0 w-fit"
        >
          <span className="font-inter-tight text-xs font-medium text-[#0D9F5C]">
            View Applicants
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0D9F5C] group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>
    </div>
  );
}
