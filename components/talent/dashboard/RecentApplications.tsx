import { ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { RecentApplication, ApplicationStatus } from "@/lib/api/talent";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { cardHover } from "@/lib/theme/effects";

interface ApplicationItemProps {
  title: string;
  company: string;
  timeAgo: string;
  status: ApplicationStatus;
  companyLogo?: string | null;
}

function ApplicationItem({
  title,
  company,
  timeAgo,
  status,
  companyLogo,
}: ApplicationItemProps) {
  const statusStyles: Record<ApplicationStatus, { className: string; style?: React.CSSProperties }> = {
    Interview: { className: "", style: { backgroundColor: ROLE_COLORS.talent.light, color: ROLE_COLORS.talent.dark } },
    "In Review": { className: "bg-[#EFF8FF]", style: { color: ROLE_COLORS.talent.dark } },
    Hired: { className: "bg-[#EEFDF0] text-[#008B47]" },
    Applied: { className: "bg-[#F5F5F5] text-[#606060]" },
    Rejected: { className: "bg-[#FEE2E2] text-[#DC2626]" },
  };

  return (
    <div className="flex items-center justify-between gap-3 p-3 rounded-lg bg-[#FCFCFD]">
      <div className="flex items-center gap-3 flex-1">
        <div className="w-10 h-10 rounded-lg bg-[#002224] flex-shrink-0 overflow-hidden">
          {companyLogo && (
            <img
              src={companyLogo}
              alt={company}
              className="w-full h-full object-cover"
            />
          )}
        </div>
        <div className="flex flex-col gap-1.5 flex-1 min-w-0">
          <h3 className="text-[13px] font-inter-tight text-black truncate">
            {title}
          </h3>
          <p className="text-[11px] text-[#606060] font-inter-tight">
            {company}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2 flex-shrink-0">
        <span className="text-[11px] text-[#606060] font-inter-tight hidden sm:block">
          {timeAgo}
        </span>
        <span
          className={`px-2 py-1 rounded-md text-[11px] font-medium font-inter-tight ${statusStyles[status].className}`}
          style={statusStyles[status].style}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

interface RecentApplicationsProps {
  applications: RecentApplication[];
}

export function RecentApplications({ applications }: RecentApplicationsProps) {
  return (
    <div className={`flex flex-col gap-4 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white ${cardHover}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] font-bold font-inter-tight">
          Recent Applications
        </h2>
        <button className="flex items-center gap-1 text-[12px] font-medium font-inter-tight hover:opacity-80 transition-opacity" style={{ color: ROLE_COLORS.talent.dark }}>
          View All
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {applications.length === 0 ? (
          <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
            No applications yet
          </p>
        ) : (
          applications.map((app) => (
            <ApplicationItem
              key={app.id}
              title={app.title}
              company={app.company}
              timeAgo={formatDistanceToNow(new Date(app.appliedAt), {
                addSuffix: true,
              })}
              status={app.status}
              companyLogo={app.companyLogo}
            />
          ))
        )}
      </div>
    </div>
  );
}
