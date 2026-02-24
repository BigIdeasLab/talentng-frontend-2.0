"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

export function MentorshipHeader() {
  return (
    <div className="relative w-full rounded-[16px] bg-[#8463FF] overflow-hidden">
      {/* Decorative stars background */}
      <div className="absolute inset-0 overflow-hidden">
        {/* Large centered star */}
        <svg
          className="absolute left-1/2 top-[22px] -translate-x-1/2"
          width="171"
          height="171"
          viewBox="0 0 171 171"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M85.5 0L93.9641 77.0359L171 85.5L93.9641 93.9641L85.5 171L77.0359 93.9641L0 85.5L77.0359 77.0359L85.5 0Z"
            fill="#A890FF"
          />
        </svg>

        {/* Top right star */}
        <svg
          className="absolute right-[100px] -top-[48px] hidden md:block"
          width="110"
          height="110"
          viewBox="0 0 110 110"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M55 0L60.4447 49.5553L110 55L60.4447 60.4447L55 110L49.5553 60.4447L0 55L49.5553 49.5553L55 0Z"
            fill="#A890FF"
            fillOpacity="0.6"
          />
        </svg>

        {/* Bottom right star */}
        <svg
          className="absolute right-[46px] bottom-[42px] hidden md:block"
          width="107"
          height="107"
          viewBox="0 0 107 107"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M53.5 0L58.7962 48.2038L107 53.5L58.7962 58.7962L53.5 107L48.2038 58.7962L0 53.5L48.2038 48.2038L53.5 0Z"
            fill="#A890FF"
            fillOpacity="0.45"
          />
        </svg>

        {/* Bottom left star */}
        <svg
          className="absolute left-[347px] bottom-[-43px] hidden md:block"
          width="107"
          height="107"
          viewBox="0 0 107 107"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M53.5 0L58.7962 48.2038L107 53.5L58.7962 58.7962L53.5 107L48.2038 58.7962L0 53.5L48.2038 48.2038L53.5 0Z"
            fill="#A890FF"
            fillOpacity="0.7"
          />
        </svg>

        {/* Small top left star */}
        <svg
          className="absolute left-[389px] top-[11px] hidden md:block"
          width="73"
          height="73"
          viewBox="0 0 73 73"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M36.5 0L40.1133 32.8867L73 36.5L40.1133 40.1133L36.5 73L32.8867 40.1133L0 36.5L32.8867 32.8867L36.5 0Z"
            fill="#A890FF"
            fillOpacity="0.45"
          />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 px-4 py-4 md:px-6 md:py-5 flex flex-col gap-3 md:gap-3">
        {/* Tagline */}
        <p className="text-white/80 font-inter-tight text-[12px] md:text-[13px] font-normal leading-4">
          Real mentors. Real guidance.
        </p>

        {/* Main Heading */}
        <h1 className="text-white font-inter-tight text-xl md:text-[30px] font-medium leading-tight md:leading-[30px] capitalize max-w-[430px]">
          Get Mentorship That Moves Your Career Forward.
        </h1>

        {/* CTA Button */}
        <Link
          href="/mentorship#mentors"
          className="inline-flex items-center gap-1 px-3 py-2.5 rounded-full bg-[#181B25] text-white font-inter-tight text-[12px] font-medium w-fit hover:bg-[#252831] transition-colors"
        >
          Get Started
          <ArrowRight className="w-4 h-4" strokeWidth={1.125} />
        </Link>
      </div>
    </div>
  );
}
