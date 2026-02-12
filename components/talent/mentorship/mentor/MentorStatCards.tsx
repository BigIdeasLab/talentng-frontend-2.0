import { Users, Video } from "lucide-react";
import type { MentorDashboardFullStats } from "@/lib/api/mentorship";

interface StatCardProps {
  title: string;
  value: string;
  trend: {
    value: string;
    isPositive: boolean;
  };
  icon: React.ReactNode;
  gradient: string;
  iconBg: string;
  iconColor: string;
  trendColor: string;
}

function StatCard({
  title,
  value,
  trend,
  icon,
  gradient,
  iconBg,
  iconColor,
  trendColor,
}: StatCardProps) {
  return (
    <div
      className={`flex flex-col justify-center gap-3 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] ${gradient}`}
    >
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-[#606060] text-[12px] font-medium font-inter-tight">
            {title}
          </h3>
          <p className="text-[20px] font-bold font-inter-tight">{value}</p>
        </div>
        <div
          className={`w-[40px] h-[40px] rounded-full ${iconBg} flex items-center justify-center`}
        >
          <div className={iconColor}>{icon}</div>
        </div>
      </div>
      <div className="flex items-center gap-1">
        <svg
          width="10"
          height="8"
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
          className={`text-[11px] font-medium font-inter-tight ${trendColor}`}
        >
          {trend.value}
        </span>
      </div>
    </div>
  );
}

function formatCurrency(amount: number, currency: string): string {
  const symbol =
    currency === "NGN"
      ? "₦"
      : currency === "USD"
        ? "$"
        : currency === "EUR"
          ? "€"
          : currency === "GBP"
            ? "£"
            : currency;
  if (amount >= 1000000) {
    return `${symbol}${(amount / 1000000).toFixed(1)}M`;
  }
  if (amount >= 1000) {
    return `${symbol}${(amount / 1000).toFixed(0)}K`;
  }
  return `${symbol}${amount}`;
}

interface MentorStatCardsProps {
  stats: MentorDashboardFullStats;
}

export function MentorStatCards({ stats }: MentorStatCardsProps) {
  const statItems: StatCardProps[] = [
    {
      title: "Total Mentee",
      value: stats.totalMentees.value.toString(),
      trend: stats.totalMentees.trend,
      icon: <Users className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-[#F59E0B]/8 to-white",
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
      trendColor: stats.totalMentees.trend.isPositive
        ? "text-[#1AA148]"
        : "text-[#E63C23]",
    },
    {
      title: "Sessions Done",
      value: stats.sessionsDone.value.toString(),
      trend: stats.sessionsDone.trend,
      icon: <Video className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-[#008B47]/8 to-white",
      iconBg: "bg-[#D1FAE5]",
      iconColor: "text-[#008B47]",
      trendColor: stats.sessionsDone.trend.isPositive
        ? "text-[#8B5CF6]"
        : "text-[#E63C23]",
    },
    {
      title: "Total Earnings",
      value: formatCurrency(
        stats.totalEarnings.value,
        stats.totalEarnings.currency,
      ),
      trend: stats.totalEarnings.trend,
      icon: <Video className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-[#2463EB]/8 to-white",
      iconBg: "bg-[#DBE9FE]",
      iconColor: "text-[#2463EB]",
      trendColor: stats.totalEarnings.trend.isPositive
        ? "text-[#D97707]"
        : "text-[#E63C23]",
    },
    {
      title: "Avg Rating",
      value: stats.averageRating.value.toFixed(1),
      trend: stats.averageRating.trend,
      icon: (
        <svg
          className="w-5 h-5"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8541 3.50033C12.769 3.34858 12.645 3.22223 12.4949 3.13429C12.3448 3.04635 12.174 3 12.0001 3C11.8261 3 11.6553 3.04635 11.5052 3.13429C11.3551 3.22223 11.2311 3.34858 11.1461 3.50033C10.9461 3.86433 10.7537 4.233 10.5691 4.60633C9.98725 5.78729 9.4926 7.00921 9.08905 8.26233C8.95005 8.69333 8.53805 8.99233 8.06605 9.00533C6.63527 9.04294 5.20915 9.18499 3.79905 9.43033C3.02505 9.56633 2.73405 10.4483 3.28405 10.9863C3.40939 11.1097 3.53605 11.2313 3.66405 11.3513C4.62112 12.2552 5.63304 13.0991 6.69405 13.8783C7.06105 14.1473 7.21205 14.6083 7.07205 15.0303C6.53875 16.6334 6.15707 18.2829 5.93205 19.9573C5.83205 20.7123 6.64005 21.2453 7.34205 20.8853C8.73409 20.1716 10.0652 19.3448 11.3221 18.4133C11.5189 18.2696 11.7563 18.1922 12.0001 18.1922C12.2438 18.1922 12.4812 18.2696 12.6781 18.4133C13.9346 19.3452 15.2658 20.172 16.6581 20.8853C17.3591 21.2453 18.1681 20.7123 18.0681 19.9573C18.0294 19.674 17.9871 19.3923 17.9411 19.1123C17.71 17.7274 17.3713 16.3626 16.9281 15.0303C16.7881 14.6083 16.9381 14.1473 17.3061 13.8783C18.5098 12.9963 19.6493 12.0299 20.7161 10.9863C21.2661 10.4483 20.9761 9.56633 20.2011 9.43033C18.7912 9.18356 17.3649 9.0415 15.9341 9.00533C15.7078 9.00173 15.4882 8.92845 15.3051 8.79549C15.1221 8.66253 14.9845 8.47635 14.9111 8.26233C14.3798 6.613 13.6909 5.01765 12.8541 3.50033Z"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      gradient: "bg-gradient-to-br from-[#CCFBF1] to-white",
      iconBg: "bg-[#CCFBF1]",
      iconColor: "text-[#0D9488]",
      trendColor: stats.averageRating.trend.isPositive
        ? "text-[#0D9488]"
        : "text-[#E63C23]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 flex-shrink-0">
      {statItems.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
