import { Video, Calendar } from "lucide-react";

interface MentorHeroSectionProps {
  name: string;
  greeting: string;
  sessionsThisWeek: number;
  message: string;
}

export function MentorHeroSection({
  name,
  greeting,
  sessionsThisWeek,
  message,
}: MentorHeroSectionProps) {
  return (
    <div className="relative w-full rounded-2xl bg-gradient-to-br from-[#8463FF]/90 to-[#8463FF] overflow-hidden p-4 md:p-6 flex-shrink-0">
      <svg
        className="absolute right-[10%] top-[-5%] opacity-100"
        width="56"
        height="56"
        viewBox="0 0 70 70"
        fill="none"
      >
        <path
          d="M35 -1.5L42.232 37.768L80.5 45L42.232 52.232L35 90.5L27.768 52.232L-10.5 45L27.768 37.768L35 -1.5Z"
          fill="#A890FF"
        />
      </svg>
      <svg
        className="absolute right-[4%] bottom-[20%] opacity-45"
        width="43"
        height="43"
        viewBox="0 0 54 54"
        fill="none"
      >
        <path
          d="M27 0L32.296 21.704L54 27L32.296 32.296L27 54L21.704 32.296L0 27L21.704 21.704L27 0Z"
          fill="#A890FF"
        />
      </svg>
      <svg
        className="absolute left-[35%] bottom-[10%] opacity-70"
        width="43"
        height="43"
        viewBox="0 0 54 54"
        fill="none"
      >
        <path
          d="M27 0L32.296 21.704L54 27L32.296 32.296L27 54L21.704 32.296L0 27L21.704 21.704L27 0Z"
          fill="#A890FF"
        />
      </svg>
      <svg
        className="absolute left-[37%] top-[5%] opacity-45"
        width="26"
        height="26"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 0L19.113 12.887L32 16L19.113 19.113L16 32L12.887 19.113L0 16L12.887 12.887L16 0Z"
          fill="#A890FF"
        />
      </svg>

      <div className="relative z-10">
        <p className="text-[#E1E4EA]/80 text-[11px] font-inter-tight mb-2">
          {greeting}!
        </p>
        <h1 className="text-white text-[18px] font-inter-tight font-bold mb-3">
          Welcome back, {name}
        </h1>
        <p className="text-white text-[11px] font-inter-tight mb-3">
          You have{" "}
          <span className="font-bold">
            {sessionsThisWeek} session{sessionsThisWeek !== 1 ? "s" : ""}
          </span>{" "}
          scheduled this week. {message}
        </p>
        <div className="flex flex-wrap items-center gap-2">
          <button className="flex h-[30px] items-center justify-center gap-1.5 rounded-lg bg-white px-3">
            <Video className="h-3.5 w-3.5 text-[#5C30FF]" strokeWidth={1.6} />
            <span className="text-[11px] font-inter-tight text-[#5C30FF]">
              Start Session
            </span>
          </button>
          <button className="flex h-[30px] items-center justify-center gap-1.5 rounded-lg bg-[#EAE5FF] px-3">
            <Calendar className="h-3.5 w-3.5 text-[#5C30FF]" strokeWidth={1.6} />
            <span className="text-[11px] font-inter-tight text-[#5C30FF]">
              View Schedule
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
