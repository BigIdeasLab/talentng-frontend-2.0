import type { HiringPipelineData } from "@/lib/api/talent";

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
    <div className={`flex flex-col gap-2 ${!isLast ? "pb-2" : ""}`}>
      <div className="flex justify-between items-center">
        <span className="text-[12px] font-inter-tight text-black">{label}</span>
        <span className="text-[12px] font-inter-tight text-[#606060]">
          {count}
        </span>
      </div>
      <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
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

interface HiringPipelineProps {
  data: HiringPipelineData;
}

export function HiringPipeline({ data }: HiringPipelineProps) {
  const maxCount = Math.max(...data.stages.map((s) => s.count), 1);

  const stages = data.stages.map((stage, index) => ({
    label: stage.label,
    count: stage.count,
    progress: (stage.count / maxCount) * 100,
    color: index === 0 ? "#5C30FF" : "#E5E7EB",
  }));

  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg border border-[#E5E6ED] bg-white">
      <div className="flex flex-col gap-2">
        <h2 className="text-[15px] font-bold font-inter-tight">
          Hiring Pipeline
        </h2>
        <p className="text-[12px] text-[#606060] font-inter-tight">
          Applicant journey stages
        </p>
      </div>
      <div className="flex flex-col gap-2">
        {stages.map((stage, index) => (
          <PipelineStage
            key={stage.label}
            {...stage}
            isLast={index === stages.length - 1}
          />
        ))}
      </div>
      <div className="pt-2 border-t border-gray-200">
        <div className="flex justify-between items-center">
          <span className="text-[12px] font-inter-tight text-black">
            Conversion Rate
          </span>
          <span className="text-[15px] font-bold font-inter-tight text-[#5C30FF]">
            {data.conversionRate.toFixed(1)}%
          </span>
        </div>
      </div>
    </div>
  );
}
