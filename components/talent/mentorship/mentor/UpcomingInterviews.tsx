import { Calendar, Clock } from "lucide-react";
import Link from "next/link";
import type { MentorUpcomingSession } from "@/lib/api/mentorship";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface SessionCardProps {
  id: string;
  name: string;
  initials: string;
  imageUrl: string | null;
  topic: string;
  date: string;
  time: string;
  duration: string;
}

function SessionCard({
  id,
  name,
  initials,
  imageUrl,
  topic,
  date,
  time,
  duration,
}: SessionCardProps) {
  return (
    <Link
      href="/sessions"
      className="flex justify-between items-start p-4 rounded-lg border border-dashed hover:bg-[#FDF2F8] transition-colors group"
      style={{
        borderColor: ROLE_COLORS.mentor.dark,
        backgroundColor: ROLE_COLORS.mentor.light,
      }}
    >
      <div className="flex items-start gap-3">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={name}
            className="w-8 h-8 rounded-full object-cover flex-shrink-0"
          />
        ) : (
          <div className="w-8 h-8 rounded-full bg-[#DB2777]/20 flex items-center justify-center flex-shrink-0">
            <span className="text-[10px] font-medium font-inter-tight text-[#DB2777]">
              {initials}
            </span>
          </div>
        )}
        <div className="flex flex-col gap-2.5">
          <h3 className="text-[13px] font-medium font-inter-tight text-black group-hover:text-[#DB2777] transition-colors">
            {name}
          </h3>
          <p className="text-[11px] text-[#606060] font-inter-tight">{topic}</p>
          <div className="flex items-center gap-1">
            <Clock
              className="w-2.5 h-2.5"
              style={{ color: ROLE_COLORS.mentor.dark }}
            />
            <span
              className="text-[11px] font-medium font-inter-tight"
              style={{ color: ROLE_COLORS.mentor.dark }}
            >
              {date} · {time}
            </span>
          </div>
        </div>
      </div>
      <div className="flex items-center justify-center px-2 py-1 rounded-lg border border-[#E4E7EB] bg-white h-[18px]">
        <span className="text-[11px] font-semibold font-inter-tight text-black">
          {duration}
        </span>
      </div>
    </Link>
  );
}

interface UpcomingInterviewsProps {
  sessions: MentorUpcomingSession[];
}

export function UpcomingInterviews({ sessions }: UpcomingInterviewsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white">
      <div className="flex items-center gap-1.5">
        <Calendar
          className="w-4 h-4"
          style={{ color: ROLE_COLORS.mentor.dark }}
        />
        <h2 className="text-[15px] font-bold font-inter-tight">
          Upcoming Sessions
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {sessions.length === 0 ? (
          <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
            No upcoming sessions
          </p>
        ) : (
          sessions.map((session) => (
            <SessionCard
              key={session.id}
              id={session.id}
              name={session.menteeName}
              initials={session.menteeInitials}
              imageUrl={session.menteeProfileImageUrl}
              topic={session.topic}
              date={session.scheduledDate}
              time={session.scheduledTime}
              duration={session.duration}
            />
          ))
        )}
      </div>
    </div>
  );
}
