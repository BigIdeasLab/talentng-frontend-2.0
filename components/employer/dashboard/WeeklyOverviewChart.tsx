"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

interface WeeklyOverviewData {
  day: string;
  applications: number;
  interviews: number;
}

interface WeeklyOverviewChartProps {
  data?: WeeklyOverviewData[];
}

export function WeeklyOverviewChart({ data }: WeeklyOverviewChartProps) {
  const chartData =
    data?.map((item) => ({
      day: item.day,
      applications: item.applications,
      interviews: item.interviews,
    })) ?? [];

  const maxValue =
    data?.reduce(
      (max, item) => Math.max(max, item.applications, item.interviews),
      0,
    ) ?? 0;

  const yAxisMax =
    maxValue > 0 ? Math.max(Math.ceil(maxValue / 5) * 5, 12) : 80;
  const yAxisTicks = [
    0,
    Math.round(yAxisMax / 4),
    Math.round(yAxisMax / 2),
    Math.round((3 * yAxisMax) / 4),
    yAxisMax,
  ];

  console.log(
    "WeeklyOverviewChart - data:",
    data,
    "maxValue:",
    maxValue,
    "yAxisMax:",
    yAxisMax,
  );

  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white w-full">
      <div className="flex flex-col items-start gap-1 self-stretch flex-shrink-0">
        <h2 className="text-[15px] font-bold font-inter-tight">
          Weekly Overview
        </h2>
        <p className="text-[12px] text-[#606060] font-inter-tight">
          Applications and profile views this week
        </p>
      </div>

      <div className="w-full h-[230px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={chartData}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid
              strokeDasharray="0"
              stroke="#F3F4F6"
              vertical={false}
            />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#606060",
                fontSize: 11,
                fontFamily: "Inter Tight",
              }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{
                fill: "#606060",
                fontSize: 11,
                fontFamily: "Inter Tight",
              }}
              domain={[0, yAxisMax]}
              ticks={yAxisTicks}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "6px",
                padding: "6px 10px",
              }}
              labelStyle={{
                fontFamily: "Inter Tight",
                fontSize: "11px",
                fontWeight: "600",
                color: "#000",
              }}
              itemStyle={{
                fontFamily: "Inter Tight",
                fontSize: "11px",
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontFamily: "Inter Tight",
                fontSize: "11px",
              }}
              formatter={(value) => {
                return value.charAt(0).toUpperCase() + value.slice(1);
              }}
            />
            <Line
              type="monotone"
              dataKey="interviews"
              stroke="#8B8B8B"
              strokeWidth={1.5}
              dot={{ fill: "#8B8B8B", r: 3 }}
              activeDot={{ r: 5 }}
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#0D9F5C"
              strokeWidth={1.5}
              dot={{ fill: "#0D9F5C", r: 3 }}
              activeDot={{ r: 5 }}
              fill="url(#colorApplications)"
            />
            <defs>
              <linearGradient
                id="colorApplications"
                x1="0"
                y1="0"
                x2="0"
                y2="1"
              >
                <stop offset="5%" stopColor="#0D9F5C" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#0D9F5C" stopOpacity={0} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
