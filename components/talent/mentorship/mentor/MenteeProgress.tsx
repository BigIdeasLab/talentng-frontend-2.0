import { Target, ArrowUpRight } from "lucide-react";
import type { MentorMenteeProgress } from "@/lib/api/mentorship";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface ProgressBarProps {
  initials: string;
  name: string;
  course: string;
  progress: number;
}

function ProgressBar({ initials, name, course, progress }: ProgressBarProps) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-full bg-[#0C9F86] flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-medium font-inter-tight text-white">
              {initials}
            </span>
          </div>
          <div className="flex flex-col gap-0.5">
            <p className="text-[12px] font-medium font-inter-tight text-black">
              {name}
            </p>
            <p className="text-[11px] text-[#606060] font-inter-tight">
              {course}
            </p>
          </div>
        </div>
        <span className="text-[12px] font-semibold font-inter-tight text-[#008B47]">
          {progress}%
        </span>
      </div>
      <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
          style={{
            width: `${progress}%`,
            backgroundColor: ROLE_COLORS.mentor.dark,
          }}
        />
      </div>
    </div>
  );
}

interface MenteeProgressProps {
  mentees: MentorMenteeProgress[];
}

export function MenteeProgress({ mentees }: MenteeProgressProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Target className="w-4 h-4 text-[#11B981]" />
          <h2 className="text-[15px] font-bold font-inter-tight">
            Mentee Progress
          </h2>
        </div>
        <button
          className="flex items-center gap-1 text-[12px] font-medium font-inter-tight hover:opacity-80 transition-opacity"
          style={{ color: ROLE_COLORS.mentor.dark }}
        >
          View All
          <ArrowUpRight className="w-3.5 h-3.5" />
        </button>
      </div>
      <div className="flex flex-col gap-3">
        {mentees.length === 0 ? (
          <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
            No mentee data available
          </p>
        ) : (
          mentees.map((mentee) => (
            <ProgressBar
              key={mentee.id}
              initials={mentee.initials}
              name={mentee.name}
              course={mentee.course}
              progress={mentee.progress}
            />
          ))
        )}
      </div>
    </div>
  );
}
