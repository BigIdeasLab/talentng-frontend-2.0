import { Eye, Briefcase, Bookmark, Target } from "lucide-react";
import Link from "next/link";
import type { TalentDashboardStats } from "@/lib/api/talent";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { cardHover } from "@/lib/theme/effects";

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle: string;
  icon: React.ReactNode;
  trend?: {
    value: string;
    isPositive: boolean;
  };
  gradient?: string;
  gradientStyle?: React.CSSProperties;
  iconBg: string;
  iconColor?: string;
  iconColorStyle?: React.CSSProperties;
  trendColor?: string;
  href?: string;
}

function StatCard({
  title,
  value,
  subtitle,
  icon,
  trend,
  gradient,
  gradientStyle,
  iconBg,
  iconColor,
  iconColorStyle,
  trendColor,
  href,
}: StatCardProps) {
  const content = (
    <>
      <div className="flex justify-between items-center">
        <div className="flex flex-col gap-2">
          <h3 className="text-[#606060] text-[12px] font-medium font-inter-tight">
            {title}
          </h3>
          <p className="text-[20px] font-bold font-inter-tight group-hover:text-blue-600 transition-colors">
            {value}
          </p>
        </div>
        <div
          className={`w-[40px] h-[40px] rounded-full ${iconBg} flex items-center justify-center group-hover:scale-110 transition-transform`}
        >
          <div className={iconColor} style={iconColorStyle}>
            {icon}
          </div>
        </div>
      </div>
      {trend ? (
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
      ) : (
        <p className="text-[#606060] text-[11px] font-medium font-inter-tight">
          {subtitle}
        </p>
      )}
    </>
  );

  if (href) {
    return (
      <Link
        href={href}
        className={`flex flex-col justify-center gap-3 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] ${cardHover} ${gradient ?? ""} group transition-all`}
        style={gradientStyle}
      >
        {content}
      </Link>
    );
  }

  return (
    <div
      className={`flex flex-col justify-center gap-3 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] ${cardHover} ${gradient ?? ""}`}
      style={gradientStyle}
    >
      {content}
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
      icon: <Eye className="w-5 h-5" />,
      trend: stats.profileViews.trend,
      gradient: "bg-gradient-to-br from-[#F59E0B]/8 to-white",
      iconBg: "bg-[#FEF3C7]",
      iconColor: "text-[#D97706]",
      trendColor: stats.profileViews.trend.isPositive
        ? "text-[#1AA148]"
        : "text-[#E63C23]",
      href: "/profile",
    },
    {
      title: "Applications",
      value: stats.applications.value.toString(),
      subtitle: `${stats.applications.inReview} in review`,
      icon: <Briefcase className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-[#008B47]/8 to-white",
      iconBg: "bg-[#D1FAE5]",
      iconColor: "text-[#008B47]",
      href: "/my-applications",
    },
    {
      title: "Times Hired",
      value: stats.timesHired.value.toString(),
      subtitle: `${stats.timesHired.savedOpportunities} saved opportunities`,
      icon: <Bookmark className="w-5 h-5" />,
      gradientStyle: {
        background: `linear-gradient(to bottom right, ${ROLE_COLORS.talent.dark}14, white)`,
      },
      iconBg: "bg-[#DBE9FE]",
      iconColorStyle: { color: ROLE_COLORS.talent.dark },
      href: "/profile?tab=opportunities",
    },
    {
      title: "Profile Score",
      value: stats.profileScore.value.toString(),
      subtitle: `+${stats.profileScore.pointsToComplete} to complete`,
      icon: <Target className="w-5 h-5" />,
      gradient: "bg-gradient-to-br from-[#FFEDD5] to-white",
      iconBg: "bg-[#FFEDD5]",
      iconColor: "text-[#EA580B]",
      trendColor: "text-[#EA580B]",
      href: "/profile",
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
