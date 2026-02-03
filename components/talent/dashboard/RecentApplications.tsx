import { ArrowUpRight } from "lucide-react";

interface ApplicationProps {
  title: string;
  company: string;
  timeAgo: string;
  status: "Interview" | "In Review" | "Hired";
  logo?: string;
}

function ApplicationItem({
  title,
  company,
  timeAgo,
  status,
  logo,
}: ApplicationProps) {
  const statusColors = {
    Interview: "bg-[#F0ECFF] text-[#5C30FF]",
    "In Review": "bg-[#EFF8FF] text-[#2463EB]",
    Hired: "bg-[#EEFDF0] text-[#008B47]",
  };

  return (
    <div className="flex items-center justify-between gap-4 p-4 rounded-xl bg-[#FCFCFD]">
      <div className="flex items-center gap-4 flex-1">
        <div className="w-12 h-12 rounded-xl bg-[#002224] flex-shrink-0" />
        <div className="flex flex-col gap-2 flex-1 min-w-0">
          <h3 className="text-[16px] font-inter-tight text-black truncate">
            {title}
          </h3>
          <p className="text-[12px] text-[#606060] font-inter-tight">
            {company}
          </p>
        </div>
      </div>
      <div className="flex items-center gap-3 flex-shrink-0">
        <span className="text-[12px] text-[#606060] font-inter-tight hidden sm:block">
          {timeAgo}
        </span>
        <span
          className={`px-3 py-1.5 rounded-lg text-[12px] font-medium font-inter-tight ${statusColors[status]}`}
        >
          {status}
        </span>
      </div>
    </div>
  );
}

export function RecentApplications() {
  const applications = [
    {
      title: "UI/UX Designer",
      company: "Chowdeck",
      timeAgo: "2 days ago",
      status: "Interview" as const,
    },
    {
      title: "Product Designer",
      company: "Spotify",
      timeAgo: "3 days ago",
      status: "In Review" as const,
    },
    {
      title: "Senior Designer",
      company: "Paystack",
      timeAgo: "1 week ago",
      status: "Hired" as const,
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#E5E6ED] bg-white">
      <div className="flex justify-between items-center">
        <h2 className="text-[18px] font-bold font-inter-tight">
          Recent Applications
        </h2>
        <button className="flex items-center gap-1 text-[#5C30FF] text-[14px] font-medium font-inter-tight hover:opacity-80 transition-opacity">
          View All
          <ArrowUpRight className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-col gap-4">
        {applications.map((app, index) => (
          <ApplicationItem key={index} {...app} />
        ))}
      </div>
    </div>
  );
}
