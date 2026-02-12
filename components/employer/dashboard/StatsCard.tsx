import { ReactNode } from "react";

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
}

export function StatsCard({
  icon,
  value,
  label,
  change,
  gradient,
  iconBg,
  iconColor,
}: StatsCardProps) {
  return (
    <div
      className={`flex flex-col justify-center gap-3 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] ${gradient}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-[#606060] text-[12px] font-medium font-inter-tight">
            {label}
          </h3>
          <p className="text-[20px] font-bold font-inter-tight">{value}</p>
        </div>
        <div
          className={`w-[40px] h-[40px] rounded-full ${iconBg} flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      {change && (
        <div className="flex items-center gap-1">
          <svg
            width="10"
            height="8"
            viewBox="0 0 12 10"
            fill="none"
            className="flex-shrink-0"
          >
            <path
              d="M11.5 3L6.75 7.75L4.25 5.25L0.5 9"
              stroke={change.type === "positive" ? "#1AA148" : "#E63C23"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 3H11.5V6"
              stroke={change.type === "positive" ? "#1AA148" : "#E63C23"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-[11px] font-medium font-inter-tight ${
              change.type === "positive" ? "text-[#1AA148]" : "text-[#E63C23]"
            }`}
          >
            {change.value}
          </span>
        </div>
      )}
    </div>
  );
}
