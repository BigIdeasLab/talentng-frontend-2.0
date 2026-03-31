import React, { ReactNode } from "react";
import Link from "next/link";
import { mobileOptimizedMemo } from "@/lib/utils/mobile-performance";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface StatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  change?: {
    value: string;
    type: "positive" | "negative";
  };
  gradient: string;
  iconBg: string;
  iconColor: string;
  href?: string;
}

const StatsCard = mobileOptimizedMemo(
  function StatsCard({
    icon,
    value,
    label,
    change,
    gradient,
    iconBg,
    iconColor,
    href,
  }: StatsCardProps) {
    const content = (
      <>
        <div className="flex justify-between items-center">
          <div className="flex flex-col gap-2">
            <h3 className="text-[#525866] text-[11px] font-medium font-inter-tight uppercase tracking-wide">
              {label}
            </h3>
            <p className="text-[20px] md:text-[24px] font-bold font-inter-tight text-[#111827]">
              {value}
            </p>
          </div>
          <div
            className={`w-[36px] h-[36px] md:w-[40px] md:h-[40px] rounded-full ${iconBg} flex items-center justify-center`}
          >
            <div className={iconColor}>{icon}</div>
          </div>
        </div>
        {change && (
          <p className="text-[#525866] text-[11px] font-medium font-inter-tight">
            {change.value}
          </p>
        )}
      </>
    );

    if (href) {
      return (
        <Link
          href={href}
          className={`flex flex-col justify-center gap-3 p-4 rounded-2xl border border-[#E1E4EA] transition-colors ${gradient}`}
          onMouseEnter={(e) => {
            e.currentTarget.style.borderColor = ROLE_COLORS.recruiter.primary;
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = '#E1E4EA';
          }}
        >
          {content}
        </Link>
      );
    }

    return (
      <div
        className={`flex flex-col justify-center gap-3 p-4 rounded-2xl border border-[#E1E4EA] ${gradient}`}
      >
        {content}
      </div>
    );
  },
  (prevProps, nextProps) => {
    // Custom comparison: re-render only if essential props change
    return (
      prevProps.value === nextProps.value &&
      prevProps.label === nextProps.label &&
      prevProps.change?.value === nextProps.change?.value &&
      prevProps.change?.type === nextProps.change?.type &&
      prevProps.href === nextProps.href
    );
  },
);

export { StatsCard };
