import Link from "next/link";
import { painPoints } from "@/lib/data/landing";

export function ProblemSection() {
  return (
    <section className="bg-white py-20 md:py-28">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-8">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl md:text-[44px] font-bold leading-[1.1] text-black">
            The Nigerian Talent Ecosystem Is{" "}
            <span className="text-[#E8465A]">Fragmented</span>
          </h2>
          <p className="mt-4 text-base sm:text-lg text-[#525866] max-w-md mx-auto">
            Today&rsquo;s landscape makes it hard for talent, recruiters, and
            mentors to connect efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
          {painPoints.map((point) => (
            <div
              key={point.title}
              className="flex flex-col items-center text-center gap-4"
            >
              <div
                className={`w-14 h-14 rounded-2xl flex items-center justify-center ${point.iconBg}`}
              >
                {point.icon}
              </div>
              <div>
                <h3 className="text-lg font-semibold text-black mb-2">
                  {point.title}
                </h3>
                <p className="text-[#525866] text-sm sm:text-base leading-relaxed">
                  {point.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-lg sm:text-xl text-black font-medium mb-6">
            Talent.ng brings everything together in one place.
          </p>
          <Link
            href="/signup"
            className="inline-flex items-center px-6 py-3 rounded-full bg-[#5C30FF] text-white text-base font-medium hover:bg-[#4a26d4] transition-colors"
          >
            Get Started for Free
          </Link>
        </div>
      </div>
    </section>
  );
}
