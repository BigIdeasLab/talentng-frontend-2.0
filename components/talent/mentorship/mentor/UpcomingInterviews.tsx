import { Calendar, Clock, Play, ArrowUpRight } from "lucide-react";

interface Interview {
  id: string;
  initials: string;
  name: string;
  type: string;
  date: string;
  time: string;
  duration: string;
}

function InterviewCard({ initials, name, type, date, time, duration }: Interview) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl border border-[#E4E7EB] bg-white p-3">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-[#DDD6FE] bg-[#8D50F2]">
          <span className="font-inter-tight text-base font-semibold leading-normal text-white">
            {initials}
          </span>
        </div>
        <div className="flex flex-col gap-2.5">
          <div className="flex flex-col gap-3">
            <h3 className="font-inter-tight text-base font-bold leading-normal text-black">
              {name}
            </h3>
            <p className="font-inter-tight text-[13px] font-normal leading-5 text-[#606060]">
              {type}
            </p>
          </div>
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Calendar className="h-3.5 w-3.5 stroke-[#606060]" strokeWidth={1.25} />
              <span className="font-inter-tight text-xs font-normal leading-5 text-[#606060]">
                {date}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3.5 w-3.5 stroke-[#606060]" strokeWidth={1.25} />
              <span className="font-inter-tight text-xs font-normal leading-5 text-[#606060]">
                {time}
              </span>
            </div>
            <div className="flex h-[22px] items-center justify-center gap-2.5 rounded-full bg-[#F4F4F6] px-2.5">
              <span className="font-inter-tight text-xs font-semibold leading-5 text-black">
                {duration}
              </span>
            </div>
          </div>
        </div>
      </div>
      <button className="flex h-9 items-center justify-center gap-2.5 rounded-xl bg-[#5C30FF] px-[15px]">
        <Play className="h-4 w-4 fill-white stroke-white" strokeWidth={1.6} />
        <span className="font-inter-tight text-sm font-normal leading-[26px] text-white">
          Join
        </span>
      </button>
    </div>
  );
}

export function UpcomingInterviews() {
  const interviews: Interview[] = [
    {
      id: "1",
      initials: "AO",
      name: "Adaeze Okonkwo",
      type: "Portfolio Review",
      date: "Today",
      time: "2:00 PM",
      duration: "30 min",
    },
    {
      id: "2",
      initials: "CN",
      name: "Chidi Nnamdi",
      type: "React Hook Deep Dive",
      date: "Tomorrow",
      time: "10:00 AM",
      duration: "30 min",
    },
    {
      id: "3",
      initials: "FA",
      name: "Fatima Ahmed",
      type: "Interview Prep",
      date: "Feb 16",
      time: "4:00 PM",
      duration: "30 min",
    },
  ];

  return (
    <div className="flex flex-col gap-[30px] rounded-xl border border-[#E4E7EB] bg-white p-8 shadow-[0_4px_4px_0_rgba(178,178,178,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Calendar className="h-5 w-5 stroke-[#5C30FF]" strokeWidth={2} />
          <h2 className="font-inter-tight text-lg font-bold leading-normal text-black">
            Upcoming Interviews
          </h2>
        </div>
        <button className="flex items-center gap-2">
          <span className="font-inter-tight text-sm font-normal leading-normal text-black">
            View All
          </span>
          <ArrowUpRight className="h-[18px] w-[18px] stroke-black" strokeWidth={1.6} />
        </button>
      </div>

      <div className="flex flex-col gap-[18px]">
        {interviews.map((interview) => (
          <InterviewCard key={interview.id} {...interview} />
        ))}
      </div>
    </div>
  );
}
