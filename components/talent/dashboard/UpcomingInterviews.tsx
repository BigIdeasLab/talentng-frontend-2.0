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
    <div className="flex justify-between items-start p-6 rounded-xl border border-dashed border-[#5C30FF] bg-[#F8F5FE]">
      <div className="flex flex-col gap-3.5">
        <h3 className="text-[16px] font-inter-tight text-black">{company}</h3>
        <p className="text-[12px] text-[#606060] font-inter-tight">
          {position}
        </p>
        <div className="flex items-center gap-1.5">
          <Clock className="w-3 h-3 text-[#5C30FF]" />
          <span className="text-[12px] font-medium font-inter-tight text-[#5C30FF]">
            {date}
          </span>
        </div>
      </div>
      <div className="flex items-center justify-center px-2.5 py-1.5 rounded-xl border border-[#E4E7EB] bg-white h-[22px]">
        <span className="text-[12px] font-semibold font-inter-tight text-black">
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
    <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#E5E6ED] bg-white">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#5C30FF]" />
        <h2 className="text-[18px] font-bold font-inter-tight">
          Upcoming Interviews
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {interviews.length === 0 ? (
          <p className="text-[14px] text-[#606060] font-inter-tight text-center py-8">
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
