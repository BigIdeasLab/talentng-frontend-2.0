interface PipelineStageProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function PipelineStage({ label, count, total, color }: PipelineStageProps) {
  const percentage = (count / total) * 100;

  return (
    <div className="flex flex-col items-start gap-2 self-stretch">
      <div className="flex justify-between items-center self-stretch">
        <span className="font-inter-tight text-xs font-normal text-black">
          {label}
        </span>
        <span className="font-inter-tight text-xs font-normal text-[#525866]">
          {count}
        </span>
      </div>
      <div className="w-full h-2 rounded-full bg-gray-200 overflow-hidden">
        <div
          className="h-full rounded-full transition-all duration-300"
          style={{
            width: `${percentage}%`,
            backgroundColor: color,
          }}
        />
      </div>
    </div>
  );
}

export function HiringPipeline() {
  const totalApplicants = 156;

  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg border border-gray-300 bg-white w-full">
      <div className="flex flex-col items-start gap-1 self-stretch flex-shrink-0">
        <h2 className="font-inter-tight text-lg font-bold text-black">
          Hiring Pipeline
        </h2>
        <p className="font-inter-tight text-xs font-normal text-[#525866]">
          Applicant journey stages
        </p>
      </div>

      <div className="flex flex-col items-start gap-3.5 self-stretch">
        <PipelineStage
          label="Applied"
          count={156}
          total={totalApplicants}
          color="#5C30FF"
        />
        <PipelineStage
          label="In Review"
          count={45}
          total={totalApplicants}
          color="#5C30FF"
        />
        <PipelineStage
          label="Interview"
          count={48}
          total={totalApplicants}
          color="#5C30FF"
        />
        <PipelineStage
          label="Hired"
          count={28}
          total={totalApplicants}
          color="#5C30FF"
        />
      </div>

      <div className="flex justify-between items-center self-stretch pt-3 border-t border-gray-200">
        <span className="font-inter-tight text-xs font-medium text-black">
          Conversion Rate
        </span>
        <span className="font-inter-tight text-base font-semibold text-[#5C30FF]">
          15.4%
        </span>
      </div>
    </div>
  );
}
