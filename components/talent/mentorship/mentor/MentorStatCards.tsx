import { Users, Video, Star, TrendingUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  trend: string;
  icon: React.ReactNode;
  bgColor: string;
  accentColor: string;
  textColor: string;
  trendColor: string;
}

function StatCard({
  title,
  value,
  trend,
  icon,
  bgColor,
  accentColor,
  textColor,
  trendColor,
}: StatCardProps) {
  return (
    <div
      className={`relative h-[129px] overflow-hidden rounded-xl border border-[#E5E7EB] ${bgColor} shadow-[0_4px_4px_0_rgba(0,0,0,0.05)]`}
    >
      <div className="relative z-10 flex h-full items-center justify-between px-[25px] py-7">
        <div className="flex flex-col gap-3.5">
          <div className="flex flex-col gap-3">
            <p
              className={`font-inter-tight text-sm font-medium leading-normal ${textColor}`}
            >
              {title}
            </p>
            <p
              className={`font-inter-tight text-[26px] font-bold leading-normal ${textColor.replace("text-", "text-").replace(/\d+/, (m) => String(Number(m) + 300))}`}
            >
              {value}
            </p>
          </div>
          <div className="flex items-center gap-1">
            <TrendingUp
              className={`h-3 w-3 ${trendColor.replace("text-", "stroke-")}`}
            />
            <span
              className={`font-inter-tight text-xs font-medium leading-normal ${trendColor}`}
            >
              {trend}
            </span>
          </div>
        </div>
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-[10px] ${accentColor}`}
        >
          {icon}
        </div>
      </div>
      <div
        className={`absolute -right-5 -top-5 h-20 w-20 rounded-full ${bgColor.replace("bg-", "bg-").replace(/F8/, "E0")} opacity-90`}
      />
    </div>
  );
}

export function MentorStatCards() {
  const stats = [
    {
      title: "Total Mentee",
      value: "48",
      trend: "+8 this month",
      icon: <Users className="h-6 w-6 stroke-white" strokeWidth={2} />,
      bgColor: "bg-[#EEFDF8]",
      accentColor: "bg-[#11B981]",
      textColor: "text-[#069668]",
      trendColor: "text-[#069668]",
    },
    {
      title: "Sessions Done",
      value: "127",
      trend: "32 this month",
      icon: <Video className="h-6 w-6 stroke-white" strokeWidth={2} />,
      bgColor: "bg-[#F8F5FF]",
      accentColor: "bg-[#8B5CF6]",
      textColor: "text-[#8B5CF6]",
      trendColor: "text-[#8B5CF6]",
    },
    {
      title: "Total Earnings",
      value: "₦2.4M",
      trend: "+₦384K this month",
      icon: <Video className="h-6 w-6 stroke-white" strokeWidth={2} />,
      bgColor: "bg-[#FFF9EB]",
      accentColor: "bg-[#F59E0B]",
      textColor: "text-[#DB7B13]",
      trendColor: "text-[#D97707]",
    },
    {
      title: "Avg Rating",
      value: "4.9",
      trend: "98 reviews",
      icon: (
        <svg
          className="h-6 w-6"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M12.8541 3.50033C12.769 3.34858 12.645 3.22223 12.4949 3.13429C12.3448 3.04635 12.174 3 12.0001 3C11.8261 3 11.6553 3.04635 11.5052 3.13429C11.3551 3.22223 11.2311 3.34858 11.1461 3.50033C10.9461 3.86433 10.7537 4.233 10.5691 4.60633C9.98725 5.78729 9.4926 7.00921 9.08905 8.26233C8.95005 8.69333 8.53805 8.99233 8.06605 9.00533C6.63527 9.04294 5.20915 9.18499 3.79905 9.43033C3.02505 9.56633 2.73405 10.4483 3.28405 10.9863C3.40939 11.1097 3.53605 11.2313 3.66405 11.3513C4.62112 12.2552 5.63304 13.0991 6.69405 13.8783C7.06105 14.1473 7.21205 14.6083 7.07205 15.0303C6.53875 16.6334 6.15707 18.2829 5.93205 19.9573C5.83205 20.7123 6.64005 21.2453 7.34205 20.8853C8.73409 20.1716 10.0652 19.3448 11.3221 18.4133C11.5189 18.2696 11.7563 18.1922 12.0001 18.1922C12.2438 18.1922 12.4812 18.2696 12.6781 18.4133C13.9346 19.3452 15.2658 20.172 16.6581 20.8853C17.3591 21.2453 18.1681 20.7123 18.0681 19.9573C18.0294 19.674 17.9871 19.3923 17.9411 19.1123C17.71 17.7274 17.3713 16.3626 16.9281 15.0303C16.7881 14.6083 16.9381 14.1473 17.3061 13.8783C18.5098 12.9963 19.6493 12.0299 20.7161 10.9863C21.2661 10.4483 20.9761 9.56633 20.2011 9.43033C18.7912 9.18356 17.3649 9.0415 15.9341 9.00533C15.7078 9.00173 15.4882 8.92845 15.3051 8.79549C15.1221 8.66253 14.9845 8.47635 14.9111 8.26233C14.3798 6.613 13.6909 5.01765 12.8541 3.50033Z"
            stroke="white"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      ),
      bgColor: "bg-[#EDFAFF]",
      accentColor: "bg-[#3B81F6]",
      textColor: "text-[#2463EB]",
      trendColor: "text-[#2463EB]",
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <StatCard key={index} {...stat} />
      ))}
    </div>
  );
}
