import { Calendar, Clock } from "lucide-react";

interface InterviewProps {
  company: string;
  position: string;
  date: string;
  time: string;
}

function InterviewCard({ company, position, date, time }: InterviewProps) {
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

export function UpcomingInterviews() {
  const interviews = [
    {
      company: "Chowdeck",
      position: "UI/UX Designer",
      date: "Jan 28, 2026",
      time: "2:00 PM",
    },
    {
      company: "Flutterwave",
      position: "Product Designer",
      date: "Jan 28, 2026",
      time: "11:00 AM",
    },
  ];

  return (
    <div className="flex flex-col gap-6 p-6 rounded-xl border border-[#E5E6ED] bg-white">
      <div className="flex items-center gap-2">
        <Calendar className="w-5 h-5 text-[#5C30FF]" />
        <h2 className="text-[18px] font-bold font-inter-tight">
          Upcoming Interviews
        </h2>
      </div>
      <div className="flex flex-col gap-4">
        {interviews.map((interview, index) => (
          <InterviewCard key={index} {...interview} />
        ))}
      </div>
    </div>
  );
}
