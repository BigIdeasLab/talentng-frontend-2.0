import Link from "next/link";
import { Target, ArrowUpRight } from "lucide-react";
import type { MentorMenteeProgress } from "@/lib/api/mentorship";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface ProgressBarProps {
  id: string;
  initials: string;
  name: string;
  imageUrl: string | null;
  course: string;
  progress: number;
}

function ProgressBar({
  id,
  initials,
  name,
  imageUrl,
  course,
  progress,
}: ProgressBarProps) {
  return (
    <Link
      href="/sessions"
      className="flex flex-col gap-2 group hover:bg-gray-50 p-2 rounded-lg transition-colors"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          {imageUrl ? (
            <img
              src={imageUrl}
              alt={name}
              className="w-7 h-7 rounded-full object-cover flex-shrink-0"
            />
          ) : (
            <div className="w-7 h-7 rounded-full bg-[#0C9F86] flex items-center justify-center flex-shrink-0">
              <span className="text-[10px] font-medium font-inter-tight text-white">
                {initials}
              </span>
            </div>
          )}
          <div className="flex flex-col gap-0.5">
            <p className="text-[12px] font-medium font-inter-tight text-black group-hover:text-[#0C9F86] transition-colors">
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
    </Link>
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
        <Link
          href="/applications"
          className="flex items-center gap-1 text-[12px] font-medium font-inter-tight hover:opacity-80 transition-opacity"
          style={{ color: ROLE_COLORS.mentor.dark }}
        >
          View All
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
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
              id={mentee.id}
              initials={mentee.initials}
              name={mentee.name}
              imageUrl={mentee.profileImageUrl}
              course={mentee.course}
              progress={mentee.progress}
            />
          ))
        )}
      </div>
    </div>
  );
}
