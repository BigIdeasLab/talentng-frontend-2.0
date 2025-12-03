import { Bookmark, Check } from "lucide-react";
import { ApplicationStatusBanner } from "./application-status-banner";

type OpportunityType = "internship" | "job-listing" | "volunteer" | "part-time";
type ApplicationStatus = "awaiting-review" | "hired" | "not-hired";

interface Opportunity {
  id: string;
  posterName: string;
  posterAvatar?: string;
  date: string;
  type: OpportunityType;
  title: string;
  skills: string[];
  rate: string;
  showActions: boolean;
  applicationStatus?: ApplicationStatus;
}

const typeConfig = {
  internship: {
    label: "Internship",
    bgColor: "rgba(0, 139, 71, 0.09)",
    textColor: "#008B47",
    dotColor: "#008B47",
  },
  "job-listing": {
    label: "Job Listing",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
  volunteer: {
    label: "Volunteer",
    bgColor: "rgba(246, 188, 63, 0.10)",
    textColor: "#D99400",
    dotColor: "#D99400",
  },
  "part-time": {
    label: "Part-time",
    bgColor: "rgba(92, 48, 255, 0.10)",
    textColor: "#5C30FF",
    dotColor: "#5C30FF",
  },
};

interface OpportunityCardProps {
  opportunity: Opportunity;
}

export function OpportunityCard({ opportunity }: OpportunityCardProps) {
  const config = typeConfig[opportunity.type];
  const hasApplicationStatus = !!opportunity.applicationStatus;

  return (
    <div className="relative">
      <div
        className={`flex flex-col items-center gap-4 pt-3 border border-[#E1E4EA] ${hasApplicationStatus ? "rounded-t-[16px] border-b-0" : "rounded-[16px]"} bg-white hover:shadow-md transition-shadow`}
      >
        {/* Card Content */}
        <div className="flex flex-col items-start gap-3.5 w-full px-2.5 md:px-5">
          {/* Header Section */}
          <div className="flex flex-col items-start gap-1.5 w-full">
            {/* Profile and Type Badge */}
            <div className="flex items-center justify-between w-full">
              {/* Profile */}
              <div className="flex items-center gap-2">
                {opportunity.posterAvatar ? (
                  <div
                    className="w-8 h-8 rounded-full bg-cover bg-center flex-shrink-0"
                    style={{
                      backgroundImage: `url(${opportunity.posterAvatar})`,
                    }}
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-orange-400 to-orange-500 flex-shrink-0" />
                )}
                <div className="flex flex-col items-start gap-1.5">
                  <div className="text-[13px] font-medium font-inter-tight text-black text-center">
                    {opportunity.posterName}
                  </div>
                  <div className="text-[12px] font-light font-inter-tight text-[#525866]">
                    {opportunity.date}
                  </div>
                </div>
              </div>

              {/* Type Badge */}
              <div
                className="flex items-center gap-1.5 px-2.5 py-2 rounded-md"
                style={{ backgroundColor: config.bgColor }}
              >
                <div
                  className="w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: config.dotColor }}
                />
                <span
                  className="text-[11px] font-normal font-inter-tight text-center"
                  style={{ color: config.textColor }}
                >
                  {config.label}
                </span>
              </div>
            </div>
          </div>

          {/* Job Title */}
          <div className="text-[15px] font-medium font-inter-tight text-black text-center">
            {opportunity.title}
          </div>

          {/* Skills */}
          <div className="flex flex-col items-start gap-2.5 w-full">
            <div className="flex items-start content-start gap-x-1 gap-y-1.5 flex-wrap w-full min-h-[28px]">
              {opportunity.skills.map((skill, index) => (
                <div
                  key={index}
                  className="flex items-center justify-center gap-2 px-3 py-2 rounded-[24px] bg-[#F5F5F5]"
                >
                  <span className="text-[12px] font-normal font-inter-tight text-black text-center leading-[12.6px]">
                    {skill}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer Section */}
        <div className="flex flex-col items-start gap-2 w-full px-2.5 border-t border-[#E1E4EA]">
          <div className="flex items-center justify-between w-full py-2.5">
            {opportunity.showActions ? (
              <>
                {/* Rate */}
                <div className="text-[15px] font-medium font-inter-tight text-black">
                  {opportunity.rate}
                </div>

                {/* Actions */}
                <div className="flex items-center justify-end gap-1">
                  {/* Save Button */}
                  <button className="flex items-center gap-1 px-4 py-2 h-8 bg-[#181B25] rounded-[40px] hover:bg-[#2a2d39] transition-colors">
                    <Bookmark className="w-4 h-4 text-white" />
                    <span className="text-[12px] font-medium font-inter-tight text-white text-center">
                      Save
                    </span>
                  </button>

                  {/* Apply Button */}
                  <button className="flex items-center gap-1 px-4 py-2 h-8 bg-[#5C30FF] border-[0.822px] border-[#5C30FF] rounded-[40px] hover:bg-[#4a26cc] transition-colors">
                    <Check className="w-4 h-4 text-white" />
                    <span className="text-[12px] font-medium font-inter-tight text-white text-center">
                      Apply
                    </span>
                  </button>
                </div>
              </>
            ) : (
              /* Learn More Button for Volunteer */
              <div className="flex items-center justify-end w-full h-8">
                <button className="flex items-center gap-1 px-4 py-2 h-8 bg-[#5C30FF] border-[0.822px] border-[#5C30FF] rounded-[40px] hover:bg-[#4a26cc] transition-colors">
                  <span className="text-[12px] font-medium font-inter-tight text-white text-center">
                    Learn More
                  </span>
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
      {hasApplicationStatus && opportunity.applicationStatus && (
        <ApplicationStatusBanner status={opportunity.applicationStatus} />
      )}
    </div>
  );
}
