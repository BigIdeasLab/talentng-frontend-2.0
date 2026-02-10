export function HiringPipeline() {
  const stages = [
    { label: "Applied", count: 156, color: "bg-[#5C30FF]", percentage: 100 },
    { label: "In Review", count: 45, color: "bg-[#5C30FF]", percentage: 29 },
    { label: "Interview", count: 48, color: "bg-[#5C30FF]", percentage: 31 },
    { label: "Hired", count: 28, color: "bg-[#5C30FF]", percentage: 18 },
  ];

  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E6ED] bg-white p-8">
      <div className="flex flex-col gap-5">
        <h2 className="font-inter-tight text-lg font-bold leading-normal text-black">
          Hiring Pipeline
        </h2>
        <p className="font-inter-tight text-sm font-normal leading-normal text-[#606060]">
          Applicant journey stages
        </p>
      </div>

      <div className="flex flex-col gap-4">
        {stages.map((stage, index) => (
          <div key={index} className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="font-inter-tight text-sm font-normal leading-normal text-black">
                {stage.label}
              </span>
              <span className="font-inter-tight text-sm font-normal leading-normal text-[#606060]">
                {stage.count}
              </span>
            </div>
            <div className="h-2 w-full overflow-hidden rounded-full bg-[#F4F4F6]">
              <div
                className={`h-full rounded-full ${stage.color}`}
                style={{ width: `${stage.percentage}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[#E5E7EB] pt-4">
        <span className="font-inter-tight text-sm font-normal leading-normal text-black">
          Conversion Rate
        </span>
        <span className="font-inter-tight text-sm font-semibold leading-5 text-[#5C30FF]">
          15.4%
        </span>
      </div>
    </div>
  );
}
