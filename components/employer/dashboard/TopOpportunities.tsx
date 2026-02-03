import { Briefcase, Users } from "lucide-react";

interface OpportunityItemProps {
  title: string;
  applicants: number;
  status: "active" | "closed" | "draft";
}

const statusConfig = {
  active: { bg: "bg-[#E8F6F0]", text: "text-[#049769]", label: "Active" },
  closed: { bg: "bg-[#FFEBEC]", text: "text-[#EE4343]", label: "Closed" },
  draft: { bg: "bg-[#F3F4F6]", text: "text-[#606060]", label: "Draft" },
};

function OpportunityItem({ title, applicants, status }: OpportunityItemProps) {
  const config = statusConfig[status];

  return (
    <div className="flex h-auto md:h-[50px] px-2.5 py-3 md:py-0 justify-between items-center self-stretch rounded-lg bg-[#FCFCFD]">
      <div className="flex items-center gap-3">
        <div className="flex w-7 h-7 p-1 justify-center items-center rounded-lg bg-[#F2ECFD] flex-shrink-0">
          <Briefcase className="w-3.5 h-3.5 text-[#5C30FF]" strokeWidth={1.6} />
        </div>
        <div className="flex flex-col items-start gap-1.5">
          <h3 className="font-inter-tight text-[13px] font-normal text-black">
            {title}
          </h3>
          <div className="flex items-center gap-1">
            <Users className="w-2.5 h-2.5 text-[#606060]" strokeWidth={1.25} />
            <span className="font-inter-tight text-[11px] font-normal text-[#606060] whitespace-nowrap">
              {applicants} applicants
            </span>
          </div>
        </div>
      </div>
      <div
        className={`flex h-4.5 px-2 py-0 justify-center items-center gap-2 rounded-lg ${config.bg} flex-shrink-0`}
      >
        <span
          className={`font-inter-tight text-[11px] font-medium ${config.text} leading-4`}
        >
          {config.label}
        </span>
      </div>
    </div>
  );
}

interface TopOpportunityData {
  id: string;
  title: string;
  applicants: number;
  status: "active" | "closed" | "draft";
}

interface TopOpportunitiesProps {
  data?: TopOpportunityData[];
}

export function TopOpportunities({ data }: TopOpportunitiesProps) {
  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg border border-gray-300 bg-white w-full">
      <div className="flex justify-between items-center self-stretch flex-shrink-0">
        <div className="flex flex-col items-start gap-1">
          <h2 className="font-inter-tight text-lg font-bold text-black">
            Top Opportunities
          </h2>
          <p className="font-inter-tight text-xs font-normal text-[#525866]">
            Your most active job listings
          </p>
        </div>
        <button className="font-inter-tight text-xs font-normal text-[#5C30FF] hover:underline">
          View All
        </button>
      </div>

      <div className="flex flex-col items-start gap-2 self-stretch">
        {(data ?? []).map((opportunity) => (
          <OpportunityItem
            key={opportunity.id}
            title={opportunity.title}
            applicants={opportunity.applicants}
            status={opportunity.status}
          />
        ))}
      </div>
    </div>
  );
}
