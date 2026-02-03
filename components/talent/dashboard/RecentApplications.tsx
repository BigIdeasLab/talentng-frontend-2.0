import { ArrowUpRight } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import type { RecentApplication, ApplicationStatus } from "@/lib/api/talent";

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
  const statusColors: Record<ApplicationStatus, string> = {
    Interview: "bg-[#F0ECFF] text-[#5C30FF]",
    "In Review": "bg-[#EFF8FF] text-[#2463EB]",
    Hired: "bg-[#EEFDF0] text-[#008B47]",
    Applied: "bg-[#F5F5F5] text-[#606060]",
    Rejected: "bg-[#FEE2E2] text-[#DC2626]",
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
          className={`px-2 py-1 rounded-md text-[11px] font-medium font-inter-tight ${statusColors[status]}`}
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
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-[#E5E6ED] bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-[15px] font-bold font-inter-tight">
          Recent Applications
        </h2>
        <button className="flex items-center gap-1 text-[#5C30FF] text-[12px] font-medium font-inter-tight hover:opacity-80 transition-opacity">
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
