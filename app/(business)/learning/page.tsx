"use client";

import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const chartData = [
  { month: "Jan", applications: 120, interviews: 45, hired: 12 },
  { month: "Feb", applications: 180, interviews: 65, hired: 18 },
  { month: "Mar", applications: 150, interviews: 55, hired: 15 },
  { month: "Apr", applications: 220, interviews: 85, hired: 22 },
  { month: "May", applications: 200, interviews: 75, hired: 20 },
  { month: "Jun", applications: 250, interviews: 95, hired: 28 },
];

const StatCard = ({
  label,
  value,
  change,
}: {
  label: string;
  value: string | number;
  change?: string;
}) => (
  <div className="bg-white rounded-lg shadow p-6">
    <p className="text-gray-600 text-sm font-medium">{label}</p>
    <p className="text-3xl font-bold mt-2">{value}</p>
    {change && <p className="text-green-600 text-sm mt-2">{change}</p>}
  </div>
);

export default function DashboardPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">404</h1>
        <p className="text-xl text-gray-600 mb-4">NOT IMPLEMENTED YET</p>
        <Link
          href="/profile"
          className="text-blue-500 hover:text-blue-700 underline"
        >
          GO TO PROFILE PAGE
        </Link>
      </div>
    </div>
  );
}
