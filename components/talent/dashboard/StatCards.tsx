import { Eye, Briefcase, CheckCircle, Target } from "lucide-react";
import type { TalentDashboardStats } from "@/lib/api/talent";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient: string;
  iconBg: string;
  iconColor: string;
  trendColor?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient,
  iconBg,
  iconColor,
  trendColor,
}: StatCardProps) {
  return (
    <div
      className={`flex flex-col justify-center gap-4 p-6 rounded-xl border border-gray-200 shadow-sm ${gradient}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-3">
          <h3 className="text-[#606060] text-[14px] font-medium font-inter-tight">
            {title}
          </h3>
          <p className="text-[26px] font-bold font-inter-tight">{value}</p>
        </div>
        <div
          className={`w-[50px] h-[50px] rounded-full ${iconBg} flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      {trend ? (
        <div className="flex items-center gap-1">
          <svg
            width="12"
            height="10"
            viewBox="0 0 12 10"
            fill="none"
            className="flex-shrink-0"
          >
            <path
              d="M11.5 3L6.75 7.75L4.25 5.25L0.5 9"
              stroke={trend.isPositive ? "#1AA148" : "#E63C23"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M8.5 3H11.5V6"
              stroke={trend.isPositive ? "#1AA148" : "#E63C23"}
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          <span
            className={`text-[12px] font-medium font-inter-tight ${trendColor}`}
          >
            {trend.value}
          </span>
        </div>
      ) : (
        <p className="text-[#606060] text-[12px] font-medium font-inter-tight">
          {subtitle}
        </p>
      )}
    </div>
  );
}

function formatCurrency(amount: number): string {
  if (amount >= 1000000) {
    return `₦${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `₦${(amount / 1000).toFixed(0)}K`;
  }
  return `₦${amount}`;
}

interface StatCardsProps {
  stats: TalentDashboardStats;
}

export function StatCards({ stats }: StatCardsProps) {
  const statItems = [
    {
      title: "Profile Views",
      value: stats.profileViews.value.toString(),
      subtitle: "",
      icon: <Eye className="w-6 h-6" />,
      trend: stats.profileViews.trend,
      gradient: "bg-gradient-to-br from-[#2463EB]/8 to-white",
      iconBg: "bg-[#DBE9FE]",
      iconColor: "text-[#2463EB]",
      trendColor: stats.profileViews.trend.isPositive
        ? "text-[#1AA148]"
        : "text-[#E63C23]",
    },
    {
      title: "Applications",
      value: stats.applications.value.toString(),
      subtitle: `${stats.applications.inReview} in review`,
      icon: <Briefcase className="w-6 h-6" />,
      gradient: "bg-gradient-to-br from-[#7C3BED]/8 to-white",
      iconBg: "bg-[#F3ECFE]",
      iconColor: "text-[#7C3BED]",
    },
    {
      title: "Times Hired",
      value: stats.timesHired.value.toString(),
      subtitle: `${formatCurrency(stats.timesHired.totalEarned)} earned`,
      icon: <CheckCircle className="w-6 h-6" />,
      gradient: "bg-gradient-to-br from-[#008B47]/8 to-white",
      iconBg: "bg-[#D1FAE5]",
      iconColor: "text-[#008B47]",
    },
    {
      title: "Profile Score",
      value: stats.profileScore.value.toString(),
      subtitle: `+${stats.profileScore.pointsToComplete} to complete`,
      icon: <Target className="w-6 h-6" />,
      gradient: "bg-gradient-to-br from-[#FFEDD5] to-white",
      iconBg: "bg-[#FFEDD5]",
      iconColor: "text-[#EA580B]",
      trendColor: "text-[#E63C23]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {statItems.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
