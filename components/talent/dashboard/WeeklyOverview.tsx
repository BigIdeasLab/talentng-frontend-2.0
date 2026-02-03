"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

const chartData = [
  { day: "Mon", applications: 18, views: 45 },
  { day: "Tue", applications: 20, views: 52 },
  { day: "Wed", applications: 15, views: 38 },
  { day: "Thu", applications: 24, views: 48 },
  { day: "Fri", applications: 22, views: 62 },
  { day: "Sat", applications: 10, views: 35 },
  { day: "Sun", applications: 8, views: 28 },
];

const chartConfig = {
  applications: {
    label: "Applications",
    color: "#5C30FF",
  },
  views: {
    label: "Views",
    color: "#606060",
  },
} satisfies ChartConfig;

export function WeeklyOverview() {
  return (
    <div className="flex flex-col gap-8 p-6 md:p-8 rounded-xl border border-[#E5E6ED] bg-white">
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div className="flex flex-col gap-3">
          <h2 className="text-[18px] font-bold font-inter-tight">
            Weekly Overview
          </h2>
          <p className="text-[14px] text-[#606060] font-inter-tight">
            Applications and profile views this week
          </p>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#5C30FF]"></div>
            <span className="text-[14px] text-[#606060] font-inter-tight">
              Applications
            </span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-[#B5B9BE]"></div>
            <span className="text-[14px] text-[#606060] font-inter-tight">
              Views
            </span>
          </div>
        </div>
      </div>
      <div className="w-full h-[240px]">
        <ChartContainer config={chartConfig} className="w-full h-full">
          <AreaChart
            data={chartData}
            margin={{
              top: 10,
              right: 10,
              left: -20,
              bottom: 0,
            }}
          >
            <defs>
              <linearGradient id="fillApplications" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#5C30FF" stopOpacity={0.3} />
                <stop offset="95%" stopColor="#5C30FF" stopOpacity={0.05} />
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
              tickMargin={8}
              tick={{ fill: "#606060", fontSize: 12 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tick={{ fill: "#606060", fontSize: 12 }}
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
              stroke="#5C30FF"
              strokeWidth={2}
            />
          </AreaChart>
        </ChartContainer>
      </div>
    </div>
  );
}
