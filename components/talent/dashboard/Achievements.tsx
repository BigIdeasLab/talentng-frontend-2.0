import { Award, Star, CheckCircle, Users } from "lucide-react";
import type { Achievement, AchievementKey } from "@/lib/api/talent";

interface AchievementCardProps {
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
}: AchievementCardProps) {
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

const achievementConfig: Record<
  AchievementKey,
  {
    icon: React.ReactNode;
    iconLocked: React.ReactNode;
    bgColor: string;
    iconBg: string;
  }
> = {
  rising_star: {
    icon: <Star className="w-5 h-5 text-white" />,
    iconLocked: <Star className="w-5 h-5 text-[#B5B8BE]" />,
    bgColor: "bg-[#FEF8DE]",
    iconBg: "bg-[#F6BC3F]",
  },
  first_hire: {
    icon: <CheckCircle className="w-5 h-5 text-white" />,
    iconLocked: <CheckCircle className="w-5 h-5 text-[#B5B8BE]" />,
    bgColor: "bg-[#EEFDF0]",
    iconBg: "bg-[#008B47]",
  },
  team_player: {
    icon: <Users className="w-5 h-5 text-white" />,
    iconLocked: <Users className="w-5 h-5 text-[#B5B8BE]" />,
    bgColor: "bg-[#F0ECFF]",
    iconBg: "bg-[#5C30FF]",
  },
  top_earner: {
    icon: <Award className="w-[18px] h-[18px] text-white" />,
    iconLocked: <Award className="w-[18px] h-[18px] text-[#B5B8BE]" />,
    bgColor: "bg-[#FCFCFB]",
    iconBg: "bg-[#F6BC3F]",
  },
};

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-xl border border-[#FFFDF5] bg-[#FFFDF5]">
      <div className="flex items-center gap-2">
        <Award className="w-[18px] h-[18px] text-[#F59E0B]" />
        <h2 className="text-[18px] font-semibold font-inter-tight">
          Achievements
        </h2>
      </div>
      {achievements.length === 0 ? (
        <p className="text-[14px] text-[#606060] font-inter-tight text-center py-8">
          No achievements yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {achievements.map((achievement) => {
            const config = achievementConfig[achievement.key];
            return (
              <AchievementCard
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                icon={achievement.isLocked ? config.iconLocked : config.icon}
                bgColor={achievement.isLocked ? "bg-[#FCFCFB]" : config.bgColor}
                iconBg={achievement.isLocked ? "bg-transparent" : config.iconBg}
                isLocked={achievement.isLocked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
