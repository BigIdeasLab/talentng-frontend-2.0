export function WelcomeHeader({ name }: { name: string }) {
  return (
    <div className="relative w-full rounded-[20px] bg-gradient-to-br from-[#8463FF]/90 to-[#8463FF] overflow-hidden p-5 md:p-8">
      {/* Decorative Stars */}
      <svg
        className="absolute right-[10%] top-[-5%] opacity-100"
        width="70"
        height="70"
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
        width="54"
        height="54"
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
        width="54"
        height="54"
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
        width="32"
        height="32"
        viewBox="0 0 32 32"
        fill="none"
      >
        <path
          d="M16 0L19.113 12.887L32 16L19.113 19.113L16 32L12.887 19.113L0 16L12.887 12.887L16 0Z"
          fill="#A890FF"
        />
      </svg>

      {/* Content */}
      <div className="relative z-10">
        <p className="text-[#E1E4EA]/80 text-[13px] font-inter-tight mb-3">
          Good Morning!
        </p>
        <h1 className="text-white text-[24px] font-inter-tight font-bold mb-4">
          Welcome back, {name}
        </h1>
        <p className="text-white text-[12px] font-inter-tight">
          You have{" "}
          <span className="font-bold">3 new opportunities</span> waiting for
          you. Your profile views increased by{" "}
          <span className="font-bold block sm:inline mt-1 sm:mt-0">
            23%
          </span>{" "}
          this week!
        </p>
      </div>
    </div>
  );
}
