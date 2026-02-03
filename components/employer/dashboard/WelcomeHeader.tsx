import { ArrowRight } from "lucide-react";

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
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#0D9F5C]/90 to-[#0D9F5C] overflow-hidden p-4 md:p-6 flex-shrink-0">
      {/* Decorative Stars */}
      <svg
        className="absolute right-[10%] top-[-5%] opacity-100"
        width="56"
        height="56"
        viewBox="0 0 70 70"
        fill="none"
      >
        <path
          d="M35 -1.5L42.232 37.768L80.5 45L42.232 52.232L35 90.5L27.768 52.232L-10.5 45L27.768 37.768L35 -1.5Z"
          fill="#34D399"
        />
      </svg>
      <svg
        className="absolute right-[4%] bottom-[20%] opacity-45"
        width="43"
        height="43"
        viewBox="0 0 54 54"
        fill="none"
      >
        <path
          d="M27 0L32.296 21.704L54 27L32.296 32.296L27 54L21.704 32.296L0 27L21.704 21.704L27 0Z"
          fill="#34D399"
        />
      </svg>
      <svg
        className="absolute left-[35%] bottom-[10%] opacity-70"
        width="43"
        height="43"
        viewBox="0 0 54 54"
        fill="none"
      >
        <path
          d="M27 0L32.296 21.704L54 27L32.296 32.296L27 54L21.704 32.296L0 27L21.704 21.704L27 0Z"
          fill="#34D399"
        />
      </svg>
      <svg
        className="absolute left-[37%] top-[5%] opacity-45"
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 0L19.113 12.887L32 16L19.113 19.113L16 32L12.887 19.113L0 16L12.887 12.887L16 0Z"
          fill="#34D399"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p className="text-[#E1E4EA]/80 text-[11px] font-inter-tight mb-2">
            Good Morning!
          </p>
          <h1 className="text-white text-[18px] font-inter-tight font-bold mb-3">
            Welcome back, {companyName}
          </h1>
          <p className="text-white text-[11px] font-inter-tight">
            You have{" "}
            <span className="font-bold">{totalApplicants} applicants</span> in
            your pipeline.{" "}
            <span className="font-bold">
              {pendingReviews} pending review{pendingReviews !== 1 ? "s" : ""}
            </span>{" "}
            awaiting your attention.
          </p>
        </div>
        <button className="flex h-[38px] px-4 justify-center items-center gap-1 rounded-lg bg-white hover:bg-gray-100 transition-colors group flex-shrink-0 w-fit">
          <span className="font-inter-tight text-xs font-medium text-[#0D9F5C]">
            Review Applicants
          </span>
          <ArrowRight className="w-3.5 h-3.5 text-[#0D9F5C] group-hover:translate-x-0.5 transition-transform" />
        </button>
      </div>
    </div>
  );
}
