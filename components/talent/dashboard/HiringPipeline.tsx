interface PipelineStageProps {
  label: string;
  count: number;
  progress: number;
  color: string;
  isLast?: boolean;
}

function PipelineStage({
  label,
  count,
  progress,
  color,
  isLast,
}: PipelineStageProps) {
  return (
    <div className={`flex flex-col gap-3 ${!isLast ? "pb-3" : ""}`}>
      <div className="flex justify-between items-center">
        <span className="text-[14px] font-inter-tight text-black">
          {label}
        </span>
        <span className="text-[14px] font-inter-tight text-[#606060]">
          {count}
        </span>
      </div>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export function HiringPipeline() {
  const stages = [
    { label: "Applied", count: 156, progress: 100, color: "#5C30FF" },
    { label: "In Review", count: 45, progress: 29, color: "#E5E7EB" },
    { label: "Interview", count: 48, progress: 31, color: "#E5E7EB" },
    { label: "Hired", count: 28, progress: 18, color: "#E5E7EB" },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#E5E6ED] bg-white">
      <div className="flex flex-col gap-3">
        <h2 className="text-[18px] font-bold font-inter-tight">
          Hiring Pipeline
        </h2>
        <p className="text-[14px] text-[#606060] font-inter-tight">
          Applicant journey stages
        </p>
      </div>
      <div className="flex flex-col gap-3">
        {stages.map((stage, index) => (
          <PipelineStage
            key={stage.label}
            {...stage}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>
      <div className="pt-3 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-[14px] font-inter-tight text-black">
            Conversion Rate
          </span>
          <span className="text-[18px] font-bold font-inter-tight text-[#5C30FF]">
            15.4%
          </span>
        </div>
      </div>
    </div>
  );
}
