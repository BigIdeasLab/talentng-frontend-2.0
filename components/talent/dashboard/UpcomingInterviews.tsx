import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import type { UpcomingInterview } from "@/lib/api/talent";

interface InterviewCardProps {
  company: string;
  position: string;
  date: string;
  time: string;
}

function InterviewCard({ company, position, date, time }: InterviewCardProps) {
  return (
    <div className="flex justify-between items-start p-4 rounded-lg border border-dashed border-[#2463EB] bg-[#EFF6FF]">
      <div className="flex flex-col gap-2.5">
        <h3 className="text-[13px] font-inter-tight text-black">{company}</h3>
        <p className="text-[11px] text-[#606060] font-inter-tight">
          {position}
        </p>
        <div className="flex items-center gap-1">
          <Clock className="w-2.5 h-2.5 text-[#2463EB]" />
          <span className="text-[11px] font-medium font-inter-tight text-[#2463EB]">
            {date}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center px-2 py-1 rounded-lg border border-[#E4E7EB] bg-white h-[18px]">
        <span className="text-[11px] font-semibold font-inter-tight text-black">
          {time}
        </span>
      </div>
    </div>
  );
}

interface UpcomingInterviewsProps {
  interviews: UpcomingInterview[];
}

export function UpcomingInterviews({ interviews }: UpcomingInterviewsProps) {
  return (
    <div className="flex flex-col gap-4 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white">
      <div className="flex items-center gap-1.5">
        <Calendar className="w-4 h-4 text-[#2463EB]" />
        <h2 className="text-[15px] font-bold font-inter-tight">
          Upcoming Interviews
        </h2>
      </div>
      <div className="flex flex-col gap-3">
        {interviews.length === 0 ? (
          <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
            No upcoming interviews
          </p>
        ) : (
          interviews.map((interview) => {
            const scheduledDate = new Date(interview.scheduledAt);
            return (
              <InterviewCard
                key={interview.id}
                company={interview.company}
                position={interview.position}
                date={format(scheduledDate, "MMM d, yyyy")}
                time={format(scheduledDate, "h:mm a")}
              />
            );
          })
        )}
      </div>
    </div>
  );
}
