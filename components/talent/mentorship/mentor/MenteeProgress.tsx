import { Target, ArrowUpRight } from "lucide-react";

interface MenteeProgressItem {
  initials: string;
  name: string;
  course: string;
  progress: number;
  bgColor: string;
}

function ProgressBar({ initials, name, course, progress, bgColor }: MenteeProgressItem) {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full ${bgColor}`}
          >
            <span className="font-inter-tight text-[13px] font-medium leading-normal text-white">
              {initials}
            </span>
          </div>
          <div className="flex flex-col gap-2">
            <p className="font-inter-tight text-xs font-medium leading-normal text-black">
              {name}
            </p>
            <p className="font-inter-tight text-xs font-normal leading-5 text-[#606060]">
              {course}
            </p>
          </div>
        </div>
        <span className="font-inter-tight text-sm font-semibold leading-5 text-[#008B47]">
          {progress}%
        </span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-xl bg-[#F4F4F6]">
        <div
          className="h-full rounded-xl bg-[#5C30FF]"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export function MenteeProgress() {
  const mentees: MenteeProgressItem[] = [
    {
      initials: "AO",
      name: "Adaeze Okonkwo",
      course: "UI Design Fundamentals",
      progress: 85,
      bgColor: "bg-[#0C9F86]",
    },
    {
      initials: "CN",
      name: "Chidi N.",
      course: "React Development",
      progress: 62,
      bgColor: "bg-[#0C9F86]",
    },
    {
      initials: "FA",
      name: "Fatima A.",
      course: "Career Transition",
      progress: 95,
      bgColor: "bg-[#0C9F86]",
    },
    {
      initials: "EK",
      name: "Emmanuel K.",
      course: "Product Strategy",
      progress: 44,
      bgColor: "bg-[#0C9F86]",
    },
  ];

  return (
    <div className="flex flex-col gap-[30px] rounded-xl border border-[#E4E7EB] bg-white p-8 shadow-[0_4px_4px_0_rgba(178,178,178,0.1)]">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Target className="h-5 w-5 stroke-[#11B981]" strokeWidth={2} />
          <h2 className="font-inter-tight text-lg font-bold leading-normal text-black">
            Mentee Progress
          </h2>
        </div>
        <button className="flex items-center gap-2">
          <span className="font-inter-tight text-sm font-normal leading-normal text-black">
            View All
          </span>
          <ArrowUpRight className="h-[18px] w-[18px] stroke-black" strokeWidth={1.6} />
        </button>
      </div>

      <div className="flex flex-col gap-4">
        {mentees.map((mentee, index) => (
          <ProgressBar key={index} {...mentee} />
        ))}
      </div>
    </div>
  );
}
