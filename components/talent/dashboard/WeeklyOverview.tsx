"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { cardHover } from "@/lib/theme/effects";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { WeeklyOverviewData } from "@/lib/api/talent";

const chartConfig = {
  applications: {
    label: "Applications",
    color: ROLE_COLORS.talent.dark,
  },
  views: {
    label: "Views",
    color: "#606060",
  },
} satisfies ChartConfig;

interface WeeklyOverviewProps {
  data: WeeklyOverviewData[];
}

export function WeeklyOverview({ data }: WeeklyOverviewProps) {
  return (
    <div className={`flex flex-col gap-5 p-4 md:p-6 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white ${cardHover}`}>
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
        <div className="flex flex-col gap-2">
          <h2 className="text-[15px] font-bold font-inter-tight">
            Weekly Overview
          </h2>
          <p className="text-[12px] text-[#606060] font-inter-tight">
            Applications and profile views this week
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: ROLE_COLORS.talent.dark }}></div>
            <span className="text-[12px] text-[#606060] font-inter-tight">
              Applications
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#B5B9BE]"></div>
            <span className="text-[12px] text-[#606060] font-inter-tight">
              Views
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[180px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart
            data={data}
            margin={{
              top: 8,
              right: 8,
              left: -24,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={ROLE_COLORS.talent.dark} stopOpacity={0.3} />
                <stop offset="95%" stopColor={ROLE_COLORS.talent.dark} stopOpacity={0.05} />
              </linearGradient>
              <linearGradient id="fillViews" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#606060" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#606060" stopOpacity={0.05} />
              </linearGradient>
            </defs>
            <CartesianGrid
              strokeDasharray="0"
              vertical={false}
              stroke="#E5E7EB"
            />
            <XAxis
              dataKey="day"
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fill: "#606060", fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={6}
              tick={{ fill: "#606060", fontSize: 11 }}
            />
            <ChartTooltip
              cursor={false}
              content={<ChartTooltipContent indicator="line" />}
            />
            <Area
              dataKey="views"
              type="monotone"
              fill="url(#fillViews)"
              fillOpacity={1}
              stroke="#606060"
              strokeWidth={2}
            />
            <Area
              dataKey="applications"
              type="monotone"
              fill="url(#fillApplications)"
              fillOpacity={1}
              stroke={ROLE_COLORS.talent.dark}
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
