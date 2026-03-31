import Link from "next/link";
import {
  Users,
  Briefcase,
  CheckCircle,
  UserCheck,
  ShieldCheck,
} from "lucide-react";

interface ActionButtonProps {
  icon: React.ReactNode;
  label: string;
  href: string;
  variant?: "default" | "success";
}

function ActionButton({
  icon,
  label,
  href,
  variant = "default",
}: ActionButtonProps) {
  const isSuccess = variant === "success";

  return (
    <Link
      href={href}
      className={`flex h-8 px-3.5 flex-col justify-center items-start gap-2 rounded-lg border transition-colors ${
        isSuccess
          ? "border-[#0D9F5C] bg-[#0D9F5C] hover:bg-[#0B8A4F]"
          : "border-[#E1E4EA] bg-white hover:bg-gray-50"
      }`}
    >
      <div className="flex items-center gap-1">
        {icon}
        <span
          className={`font-inter-tight text-[12px] font-normal ${
            isSuccess ? "text-white" : "text-[#525866]"
          }`}
        >
          {label}
        </span>
      </div>
    </Link>
  );
}

export function QuickActions() {
  return (
    <div className="flex flex-col md:flex-row w-full px-5 py-4 md:py-5 justify-between items-start md:items-center gap-3 rounded-2xl border border-[#E1E4EA] bg-[#FFFDF5] flex-shrink-0">
      <div className="flex flex-col items-start gap-1.5 md:gap-0.5 w-full md:w-auto">
        <div className="flex items-center gap-1.5">
          <UserCheck className="w-4 h-4 text-[#E9B305]" strokeWidth={2} />
          <h2 className="text-[16px] font-bold font-inter-tight text-[#111827]">
            Quick Actions
          </h2>
        </div>
        <p className="text-[13px] text-[#525866] font-inter-tight">
          Jump into common tasks to keep your hiring pipelines moving
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
        <ActionButton
          icon={
            <Users className="w-3.5 h-3.5 text-[#525866]" strokeWidth={1.24} />
          }
          label="View Applicants"
          href="/applicants"
        />
        <ActionButton
          icon={
            <Briefcase
              className="w-3.5 h-3.5 text-[#525866]"
              strokeWidth={1.6}
            />
          }
          label="Post Opportunity"
          href="/opportunities/post"
        />
        <ActionButton
          icon={
            <CheckCircle
              className="w-3.5 h-3.5 text-[#606060]"
              strokeWidth={1.6}
            />
          }
          label="Hired Talents"
          href="/applicants/hired-talents"
        />
        <ActionButton
          icon={
            <ShieldCheck className="w-3.5 h-3.5 text-white" strokeWidth={1.6} />
          }
          label="Get Verified"
          href="/verification"
          variant="success"
        />
      </div>
    </div>
  );
}
