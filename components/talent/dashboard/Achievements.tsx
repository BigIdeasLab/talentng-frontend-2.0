import { Award, Star, Bookmark, Users, CheckCircle } from "lucide-react";
import type { Achievement, AchievementKey } from "@/lib/api/talent";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { cardHover } from "@/lib/theme/effects";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor?: string;
  bgColorStyle?: string;
  iconBg?: string;
  iconBgColor?: string;
  isLocked?: boolean;
}

function AchievementCard({
  title,
  description,
  icon,
  bgColor,
  bgColorStyle,
  iconBg,
  iconBgColor,
  isLocked,
}: AchievementCardProps) {
  return (
    <div
      className={`flex items-center gap-2.5 p-2.5 pr-3 rounded-lg ${bgColor ?? ""} ${isLocked ? "opacity-50" : ""}`}
      style={bgColorStyle ? { backgroundColor: bgColorStyle } : undefined}
    >
      <div
        className={`w-8 h-8 rounded-full ${iconBg ?? ""} flex items-center justify-center flex-shrink-0`}
        style={iconBgColor ? { backgroundColor: iconBgColor } : undefined}
      >
        {icon}
      </div>
      <div className="flex flex-col gap-0.5 flex-1">
        <h3
          className={`text-[12px] font-medium font-inter-tight leading-4 ${isLocked ? "text-[#B5B9BE]" : "text-black"}`}
        >
          {title}
        </h3>
        <p
          className={`text-[10px] font-inter-tight leading-normal ${isLocked ? "text-[#B5B9BE]" : "text-[#525866]"}`}
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
    bgColor?: string;
    bgColorStyle?: string;
    iconBg?: string;
    iconBgColor?: string;
  }
> = {
  rising_star: {
    icon: <Star className="w-4 h-4 text-white" />,
    iconLocked: <Star className="w-4 h-4 text-[#B5B8BE]" />,
    bgColor: "bg-[#FEF8DE]",
    iconBg: "bg-[#F6BC3F]",
  },
  first_hire: {
    icon: <CheckCircle className="w-4 h-4 text-white" />,
    iconLocked: <CheckCircle className="w-4 h-4 text-[#B5B8BE]" />,
    bgColor: "bg-[#EEFDF0]",
    iconBg: "bg-[#008B47]",
  },
  team_player: {
    icon: <Users className="w-4 h-4 text-white" />,
    iconLocked: <Users className="w-4 h-4 text-[#B5B8BE]" />,
    bgColorStyle: ROLE_COLORS.talent.light,
    iconBgColor: ROLE_COLORS.talent.dark,
  },
  top_collector: {
    icon: <Bookmark className="w-3.5 h-3.5 text-white" />,
    iconLocked: <Bookmark className="w-3.5 h-3.5 text-[#B5B8BE]" />,
    bgColor: "bg-[#FCFCFB]",
    iconBg: "bg-[#F6BC3F]",
  },
};

interface AchievementsProps {
  achievements: Achievement[];
}

export function Achievements({ achievements }: AchievementsProps) {
  return (
    <div
      className={`flex flex-col gap-5 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-[#FFFDF5] flex-shrink-0 ${cardHover}`}
    >
      <div className="flex items-center gap-1.5">
        <Award className="w-4 h-4 text-[#F59E0B]" />
        <h2 className="text-[15px] font-semibold font-inter-tight">
          Achievements
        </h2>
      </div>
      {achievements.length === 0 ? (
        <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
          No achievements yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {achievements.map((achievement) => {
            const config = achievementConfig[achievement.key];
            return (
              <AchievementCard
                key={achievement.id}
                title={achievement.title}
                description={achievement.description}
                icon={achievement.isLocked ? config.iconLocked : config.icon}
                bgColor={achievement.isLocked ? "bg-[#FCFCFB]" : config.bgColor}
                bgColorStyle={
                  achievement.isLocked ? undefined : config.bgColorStyle
                }
                iconBg={achievement.isLocked ? "bg-transparent" : config.iconBg}
                iconBgColor={
                  achievement.isLocked ? undefined : config.iconBgColor
                }
                isLocked={achievement.isLocked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
