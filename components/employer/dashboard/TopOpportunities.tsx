import { Briefcase, Users, Eye } from "lucide-react";

interface OpportunityItemProps {
  title: string;
  applicants: number;
  views: number;
  status: "active";
}

function OpportunityItem({
  title,
  applicants,
  views,
  status,
}: OpportunityItemProps) {
  return (
    <div className="flex h-auto md:h-[62px] px-3 py-4 md:py-0 justify-between items-center self-stretch rounded-xl bg-[#FCFCFD]">
      <div className="flex items-center gap-4">
        <div className="flex w-8 h-8 p-1.5 justify-center items-center rounded-xl bg-[#F2ECFD] flex-shrink-0">
          <Briefcase className="w-4 h-4 text-[#5C30FF]" strokeWidth={1.6} />
        </div>
        <div className="flex flex-col items-start gap-2.5">
          <h3 className="font-inter-tight text-base font-normal text-black">
            {title}
          </h3>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <Users className="w-3 h-3 text-[#606060]" strokeWidth={1.25} />
              <span className="font-inter-tight text-xs font-normal text-[#606060] whitespace-nowrap">
                {applicants} applicants
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Eye className="w-3 h-3 text-[#606060]" strokeWidth={1.25} />
              <span className="font-inter-tight text-xs font-normal text-[#606060] whitespace-nowrap">
                {views} views
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="flex h-5.5 px-2.5 py-0 justify-center items-center gap-2.5 rounded-xl bg-[#E8F6F0] flex-shrink-0">
        <span className="font-inter-tight text-xs font-medium text-[#049769] leading-5">
          Active
        </span>
      </div>
    </div>
  );
}

export function TopOpportunities() {
  const opportunities = [
    { title: "Mobile  App Designer", applicants: 45, views: 320 },
    { title: "UI/UX Intern", applicants: 32, views: 215 },
    { title: "Mobile  App Designer", applicants: 18, views: 152 },
  ];

  return (
    <div className="flex flex-col items-start gap-6 p-6 rounded-xl border border-gray-300 bg-white w-full">
      <div className="flex justify-between items-center self-stretch">
        <div className="flex flex-col items-start gap-1.5">
          <h2 className="font-inter-tight text-2xl font-bold text-black">
            Top Opportunities
          </h2>
          <p className="font-inter-tight text-sm font-normal text-[#525866]">
            Your most active job listings
          </p>
        </div>
        <button className="font-inter-tight text-sm font-normal text-[#5C30FF] hover:underline">
          View All
        </button>
      </div>

      <div className="flex flex-col items-start gap-3 self-stretch">
        {opportunities.map((opportunity, index) => (
          <OpportunityItem
            key={index}
            title={opportunity.title}
            applicants={opportunity.applicants}
            views={opportunity.views}
            status="active"
          />
        ))}
      </div>
    </div>
  );
}
