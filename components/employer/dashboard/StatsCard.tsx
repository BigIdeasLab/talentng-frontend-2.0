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
    <div className="flex flex-col justify-center items-start gap-3.5 p-6 rounded-xl border border-gray-300 bg-white shadow-sm w-full md:min-w-[268px]">
      <div className="flex justify-between items-center self-stretch">
        <div className="flex w-10 h-10 p-2.5 justify-center items-center rounded-xl bg-[#F2ECFD]">
          {icon}
        </div>
        {change && (
          <div
            className={`flex h-5.5 px-2.5 py-0 justify-center items-center gap-2.5 rounded-[20px] ${
              change.type === "positive" ? "bg-[#EAF8F3]" : "bg-[#FFEBEC]"
            }`}
          >
            <span
              className={`font-inter-tight text-xs font-medium ${
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
      <div className="flex flex-col items-start gap-4 w-full">
        <div className="font-inter-tight text-3xl font-bold text-black">
          {value}
        </div>
        <div className="font-inter-tight text-xs font-medium text-[#606060]">
          {label}
        </div>
      </div>
    </div>
  );
}
