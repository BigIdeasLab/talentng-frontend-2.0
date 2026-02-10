import { Video, Calendar } from "lucide-react";

export function MentorHeroSection() {
  return (
    <div className="relative overflow-hidden rounded-[20px] bg-gradient-to-br from-[#8463FF] via-[#5C30FF] to-[#4F3C99] p-5 md:p-[45px_20px]">
      {/* Decorative stars */}
      <div className="pointer-events-none absolute inset-0">
        <svg
          className="absolute left-[500px] top-[49px] fill-[#A890FF]"
          width="171"
          height="171"
          viewBox="0 0 171 171"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M85.5 0L93.9641 77.0359L171 85.5L93.9641 93.9641L85.5 171L77.0359 93.9641L0 85.5L77.0359 77.0359L85.5 0Z" />
        </svg>
        <svg
          className="absolute left-[616px] top-[-21px] fill-[#A890FF]/60"
          width="110"
          height="110"
          viewBox="0 0 110 110"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M55 0L60.4447 49.5553L110 55L60.4447 60.4447L55 110L49.5553 60.4447L0 55L49.5553 49.5553L55 0Z" />
        </svg>
        <svg
          className="absolute left-[670px] top-[145px] fill-[#A890FF]/45"
          width="107"
          height="107"
          viewBox="0 0 107 107"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M53.5 0L58.7962 48.2038L107 53.5L58.7962 58.7962L53.5 107L48.2038 58.7962L0 53.5L48.2038 48.2038L53.5 0Z" />
        </svg>
        <svg
          className="absolute left-[347px] top-[175px] fill-[#A890FF]/70"
          width="107"
          height="107"
          viewBox="0 0 107 107"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M53.5 0L58.7962 48.2038L107 53.5L58.7962 58.7962L53.5 107L48.2038 58.7962L0 53.5L48.2038 48.2038L53.5 0Z" />
        </svg>
        <svg
          className="absolute left-[389px] top-[38px] fill-[#A890FF]/45"
          width="73"
          height="73"
          viewBox="0 0 73 73"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M36.5 0L40.1133 32.8867L73 36.5L40.1133 40.1133L36.5 73L32.8867 40.1133L0 36.5L32.8867 32.8867L36.5 0Z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 flex flex-col gap-2">
        <p className="font-inter-tight text-[13px] font-normal leading-5 text-white/80">
          Good Morning!
        </p>
        <h1 className="font-inter-tight text-2xl font-medium leading-[37.769px] text-white">
          Welcome back, David
        </h1>
        <p className="max-w-[478px] font-inter-tight text-base leading-5 text-white">
          You have{" "}
          <span className="font-bold text-[#0E1729]">3 sessions</span>{" "}
          scheduled this week for you. Keep inspiring the next generation of
          talent!
        </p>

        {/* Action Buttons */}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          <button className="flex h-10 items-center justify-center gap-2.5 rounded-[10px] bg-white px-[15px]">
            <Video className="h-4 w-4 stroke-[#5C30FF]" strokeWidth={1.6} />
            <span className="font-inter-tight text-sm font-normal leading-[26px] text-[#5C30FF]">
              Start Session
            </span>
          </button>
          <button className="flex h-10 items-center justify-center gap-2.5 rounded-[10px] bg-[#EAE5FF] px-[15px]">
            <Calendar className="h-4 w-4 stroke-[#5C30FF]" strokeWidth={1.6} />
            <span className="font-inter-tight text-sm font-normal leading-[26px] text-[#5C30FF]">
              View Scedule
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
