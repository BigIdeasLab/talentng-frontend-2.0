import { ReactNode } from "react";

interface StatsCardProps {
  icon: ReactNode;
  value: string | number;
  label: string;
  change?: {
    value: string;
    type: "positive" | "negative";
  };
}

export function StatsCard({ icon, value, label, change }: StatsCardProps) {
  return (
    <div className="flex flex-col justify-center items-start gap-2.5 p-4 rounded-lg border border-gray-300 bg-white shadow-sm w-full md:min-w-[220px]">
      <div className="flex justify-between items-center self-stretch">
        <div className="flex w-8 h-8 p-2 justify-center items-center rounded-lg bg-[#F2ECFD]">
          {icon}
        </div>
        {change && (
          <div
            className={`flex h-4.5 px-2 py-0 justify-center items-center gap-2 rounded-2xl ${
              change.type === "positive" ? "bg-[#EAF8F3]" : "bg-[#FFEBEC]"
            }`}
          >
            <span
              className={`font-inter-tight text-[11px] font-medium ${
                change.type === "positive"
                  ? "text-[#1AA148]"
                  : "text-[#EE4343]"
              }`}
            >
              {change.value}
            </span>
          </div>
        )}
      </div>
      <div className="flex flex-col items-start gap-2.5 w-full">
        <div className="font-inter-tight text-2xl font-bold text-black">
          {value}
        </div>
        <div className="font-inter-tight text-[11px] font-medium text-[#606060]">
          {label}
        </div>
      </div>
    </div>
  );
}
