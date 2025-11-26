'use client';

import React from 'react';
import { Button } from '@/components/ui/button';
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
} from 'recharts';

const chartData = [
  { month: 'Jan', applications: 120, interviews: 45, hired: 12 },
  { month: 'Feb', applications: 180, interviews: 65, hired: 18 },
  { month: 'Mar', applications: 150, interviews: 55, hired: 15 },
  { month: 'Apr', applications: 220, interviews: 85, hired: 22 },
  { month: 'May', applications: 200, interviews: 75, hired: 20 },
  { month: 'Jun', applications: 250, interviews: 95, hired: 28 },
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Welcome back! Here's your performance overview.</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard label="Total Applications" value="1,320" change="↑ 12% from last month" />
          <StatCard label="Interviews Scheduled" value="420" change="↑ 8% from last month" />
          <StatCard label="Candidates Hired" value="115" change="↑ 15% from last month" />
          <StatCard label="Completion Rate" value="87.5%" change="↑ 3% from last month" />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Line Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Application Trend</h2>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="applications"
                  stroke="#3b82f6"
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6' }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>

          {/* Bar Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Hiring Pipeline</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="interviews" fill="#10b981" />
                <Bar dataKey="hired" fill="#8b5cf6" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-white rounded-lg shadow p-6 mb-8">
          <h2 className="text-xl font-bold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[
              { title: 'New application from John Doe', time: '2 hours ago' },
              { title: 'Interview scheduled with Jane Smith', time: '4 hours ago' },
              { title: 'Candidate offer accepted', time: '1 day ago' },
              { title: 'New job posting published', time: '2 days ago' },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between py-3 border-b last:border-b-0"
              >
                <div>
                  <p className="text-gray-900 font-medium">{item.title}</p>
                  <p className="text-gray-500 text-sm">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <Button className="bg-blue-600 hover:bg-blue-700">View All Applications</Button>
          <Button variant="outline">Download Report</Button>
        </div>
      </div>
    </div>
  );
}
