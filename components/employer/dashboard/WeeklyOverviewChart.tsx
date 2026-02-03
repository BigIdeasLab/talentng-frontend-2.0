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
  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg border border-gray-300 bg-white w-full">
      <div className="flex flex-col items-start gap-1 self-stretch flex-shrink-0">
        <h2 className="font-inter-tight text-lg font-bold text-black">
          Weekly Overview
        </h2>
        <p className="font-inter-tight text-xs font-normal text-[rgba(0,0,0,0.30)]">
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
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
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
              stroke="#5C30FF"
              strokeWidth={1.5}
              dot={{ fill: "#5C30FF", r: 3 }}
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
                <stop offset="5%" stopColor="#5C30FF" stopOpacity={0.1} />
                <stop offset="95%" stopColor="#5C30FF" stopOpacity={0} />
              </linearGradient>
            </defs>
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
