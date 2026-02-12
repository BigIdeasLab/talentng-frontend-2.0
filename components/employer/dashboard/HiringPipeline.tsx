interface PipelineStageProps {
  label: string;
  count: number;
  total: number;
  color: string;
}

function PipelineStage({ label, count, total, color }: PipelineStageProps) {
  const percentage = total > 0 ? (count / total) * 100 : 0;

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

interface HiringPipelineData {
  applied: number;
  shortlisted: number;
  invited: number;
  rejected: number;
  hired: number;
}

interface HiringPipelineProps {
  data?: HiringPipelineData;
}

export function HiringPipeline({ data }: HiringPipelineProps) {
  const totalApplicants = data?.applied ?? 0;
  const conversionRate =
    totalApplicants > 0
      ? (((data?.hired ?? 0) / totalApplicants) * 100).toFixed(1)
      : "0.0";

  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white w-full">
      <div className="flex flex-col items-start gap-1 self-stretch flex-shrink-0">
        <h2 className="text-[15px] font-bold font-inter-tight">
          Hiring Pipeline
        </h2>
        <p className="text-[12px] text-[#606060] font-inter-tight">
          Applicant journey stages
        </p>
      </div>

      <div className="flex flex-col items-start gap-3.5 self-stretch">
        <PipelineStage
          label="Applied"
          count={data?.applied ?? 0}
          total={totalApplicants}
          color="#0D9F5C"
        />
        <PipelineStage
          label="Shortlisted"
          count={data?.shortlisted ?? 0}
          total={totalApplicants}
          color="#E5E7EB"
        />
        <PipelineStage
          label="Invited"
          count={data?.invited ?? 0}
          total={totalApplicants}
          color="#E5E7EB"
        />
        <PipelineStage
          label="Hired"
          count={data?.hired ?? 0}
          total={totalApplicants}
          color="#E5E7EB"
        />
      </div>

      <div className="flex justify-between items-center self-stretch pt-3 border-t border-gray-200">
        <span className="text-[12px] font-inter-tight text-black">
          Conversion Rate
        </span>
        <span className="text-[15px] font-bold font-inter-tight text-[#0D9F5C]">
          {conversionRate}%
        </span>
      </div>
    </div>
  );
}
