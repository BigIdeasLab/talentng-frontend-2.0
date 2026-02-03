import { Award, Star, CheckCircle, Users } from "lucide-react";

interface AchievementProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  isLocked?: boolean;
}

function AchievementCard({
  title,
  description,
  icon,
  bgColor,
  iconBg,
  isLocked,
}: AchievementProps) {
  return (
    <div
      className={`flex items-center gap-3 p-3 pr-4 rounded-xl ${bgColor} ${isLocked ? "opacity-50" : ""}`}
    >
      <div
        className={`w-10 h-10 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-1 flex-1">
        <h3
          className={`text-[14px] font-medium font-inter-tight leading-5 ${isLocked ? "text-[#B5B9BE]" : "text-black"}`}
        >
          {title}
        </h3>
        <p
          className={`text-[11px] font-inter-tight leading-normal ${isLocked ? "text-[#B5B9BE]" : "text-[#525866]"}`}
        >
          {description}
        </p>
      </div>
    </div>
  );
}

export function Achievements() {
  const achievements = [
    {
      title: "Rising Star",
      description: "First 100 profile views",
      icon: <Star className="w-5 h-5 text-white" />,
      bgColor: "bg-[#FEF8DE]",
      iconBg: "bg-[#F6BC3F]",
    },
    {
      title: "First Hire",
      description: "Got hired for the first time",
      icon: <CheckCircle className="w-5 h-5 text-white" />,
      bgColor: "bg-[#EEFDF0]",
      iconBg: "bg-[#008B47]",
    },
    {
      title: "Team Player",
      description: "Completed 3 projects",
      icon: <Users className="w-5 h-5 text-white" />,
      bgColor: "bg-[#F0ECFF]",
      iconBg: "bg-[#5C30FF]",
    },
    {
      title: "Top Earner",
      description: "Earn ₦5M total",
      icon: <Award className="w-[18px] h-[18px] text-[#B5B8BE]" />,
      bgColor: "bg-[#FCFCFB]",
      iconBg: "bg-transparent",
      isLocked: true,
    },
  ];

  return (
    <div className="flex flex-col gap-8 p-6 rounded-xl border border-[#FFFDF5] bg-[#FFFDF5]">
      <div className="flex items-center gap-2">
        <Award className="w-[18px] h-[18px] text-[#F59E0B]" />
        <h2 className="text-[18px] font-semibold font-inter-tight">
          Achievements
        </h2>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {achievements.map((achievement, index) => (
          <AchievementCard key={index} {...achievement} />
        ))}
      </div>
    </div>
  );
}
