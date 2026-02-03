"use client";

interface AboutTabProps {
  companyName?: string;
  bio?: string | null;
  industry?: string;
  companySize?: string;
  companyStage?: string;
  operatingModel?: string;
}

export function AboutTab({
  companyName = "Company Name",
  bio,
  industry = "—",
  companySize = "—",
  companyStage = "—",
  operatingModel = "—",
}: AboutTabProps) {
  return (
    <div className="flex flex-col gap-7 p-3 md:p-4 lg:p-5 w-full max-w-[700px]">
      {/* About Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black font-inter-tight">
          About {companyName}
        </h2>
        <div className="flex flex-col gap-3 text-[13px] font-normal text-black font-inter-tight leading-[22px]">
          {bio ? (
            bio
              .split("\n")
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p className="text-black/50 italic">
              No company description added yet.
            </p>
          )}
        </div>
      </div>

      {/* Company Details Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black font-inter-tight">
          Company Details
        </h2>
        <div className="flex flex-col gap-2">
          {/* Industry */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Industry
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              {industry}
            </div>
          </div>

          {/* Company Size */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Company Size
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              {companySize}
            </div>
          </div>

          {/* Company Stage */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Company Stage
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              {companyStage}
            </div>
          </div>

          {/* Operating Model */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Operating Model
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              {operatingModel}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
