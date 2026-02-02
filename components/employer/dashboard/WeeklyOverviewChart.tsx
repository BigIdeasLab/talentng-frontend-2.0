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

const data = [
  { day: "Mon", views: 45, applications: 18 },
  { day: "Tue", views: 52, applications: 20 },
  { day: "Wed", views: 38, applications: 15 },
  { day: "Thu", views: 62, applications: 23 },
  { day: "Fri", views: 52, applications: 18 },
  { day: "Sat", views: 35, applications: 12 },
  { day: "Sun", views: 28, applications: 10 },
];

export function WeeklyOverviewChart() {
  return (
    <div className="flex flex-col items-start gap-6 p-6 rounded-xl border border-gray-300 bg-white w-full lg:w-[547px]">
      <div className="flex flex-col items-start gap-1.5 self-stretch">
        <h2 className="font-inter-tight text-2xl font-bold text-black">
          Weekly Overview
        </h2>
        <p className="font-inter-tight text-sm font-normal text-[rgba(0,0,0,0.30)]">
          Applications and profile views this week
        </p>
      </div>

      <div className="w-full h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart
            data={data}
            margin={{ top: 5, right: 5, left: -20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="0" stroke="#F3F4F6" vertical={false} />
            <XAxis
              dataKey="day"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#606060", fontSize: 12, fontFamily: "Inter Tight" }}
            />
            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "#606060", fontSize: 12, fontFamily: "Inter Tight" }}
              domain={[0, 80]}
              ticks={[0, 20, 40, 60, 80]}
            />
            <Tooltip
              contentStyle={{
                background: "white",
                border: "1px solid #E5E7EB",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              labelStyle={{
                fontFamily: "Inter Tight",
                fontSize: "12px",
                fontWeight: "600",
                color: "#000",
              }}
              itemStyle={{
                fontFamily: "Inter Tight",
                fontSize: "12px",
              }}
            />
            <Legend
              iconType="circle"
              wrapperStyle={{
                fontFamily: "Inter Tight",
                fontSize: "12px",
              }}
              formatter={(value) => {
                return value.charAt(0).toUpperCase() + value.slice(1);
              }}
            />
            <Line
              type="monotone"
              dataKey="views"
              stroke="#8B8B8B"
              strokeWidth={2}
              dot={{ fill: "#8B8B8B", r: 4 }}
              activeDot={{ r: 6 }}
            />
            <Line
              type="monotone"
              dataKey="applications"
              stroke="#5C30FF"
              strokeWidth={2}
              dot={{ fill: "#5C30FF", r: 4 }}
              activeDot={{ r: 6 }}
              fill="url(#colorApplications)"
            />
            <defs>
              <linearGradient id="colorApplications" x1="0" y1="0" x2="0" y2="1">
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
