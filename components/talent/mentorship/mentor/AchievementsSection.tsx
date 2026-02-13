import { Award } from "lucide-react";
import type {
  MentorAchievement,
  MentorAchievementKey,
} from "@/lib/api/mentorship";
import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface AchievementCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  bgColor: string;
  iconBg: string;
  iconBgColor?: string;
  isLocked?: boolean;
}

function AchievementCard({
  title,
  description,
  icon,
  bgColor,
  iconBg,
  iconBgColor,
  isLocked,
}: AchievementCardProps) {
  return (
    <div
      className={`flex items-center gap-2.5 p-2.5 pr-3 rounded-lg ${bgColor} ${isLocked ? "opacity-50" : ""}`}
    >
      <div
        className={`w-8 h-8 rounded-full ${iconBg} flex items-center justify-center flex-shrink-0`}
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
  MentorAchievementKey,
  {
    icon: React.ReactNode;
    iconLocked: React.ReactNode;
    bgColor: string;
    iconBg: string;
    iconBgColor?: string;
  }
> = {
  top_mentor: {
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 13.7503C14.5438 13.7503 17.4166 10.8775 17.4166 7.33366C17.4166 3.78983 14.5438 0.916992 11 0.916992C7.45615 0.916992 4.58331 3.78983 4.58331 7.33366C4.58331 10.8775 7.45615 13.7503 11 13.7503Z"
          stroke="#F6BC3F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.52585 12.7328L6.41669 21.0836L11 18.3336L15.5834 21.0836L14.4742 12.7236"
          stroke="#F6BC3F"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconLocked: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 13.7503C14.5438 13.7503 17.4166 10.8775 17.4166 7.33366C17.4166 3.78983 14.5438 0.916992 11 0.916992C7.45615 0.916992 4.58331 3.78983 4.58331 7.33366C4.58331 10.8775 7.45615 13.7503 11 13.7503Z"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M7.52585 12.7328L6.41669 21.0836L11 18.3336L15.5834 21.0836L14.4742 12.7236"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bgColor: "bg-[#FEF8DE]",
    iconBg: "bg-[#F6BC3F]",
  },
  "100_mentees": {
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5834 19.25V17.4167C15.5834 16.4442 15.197 15.5116 14.5094 14.8239C13.8218 14.1363 12.8891 13.75 11.9167 13.75H4.58335C3.61089 13.75 2.67826 14.1363 1.99063 14.8239C1.303 15.5116 0.916687 16.4442 0.916687 17.4167V19.25"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.24998 10.0833C10.275 10.0833 11.9166 8.44171 11.9166 6.41667C11.9166 4.39162 10.275 2.75 8.24998 2.75C6.22494 2.75 4.58331 4.39162 4.58331 6.41667C4.58331 8.44171 6.22494 10.0833 8.24998 10.0833Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.0833 19.25V17.4166C21.0827 16.6042 20.8123 15.815 20.3146 15.1729C19.8168 14.5308 19.1199 14.0722 18.3333 13.8691"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6667 2.86914C15.4554 3.07108 16.1545 3.52978 16.6537 4.17293C17.1529 4.81607 17.4239 5.60707 17.4239 6.42122C17.4239 7.23538 17.1529 8.02638 16.6537 8.66952C16.1545 9.31266 15.4554 9.77136 14.6667 9.97331"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconLocked: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15.5834 19.25V17.4167C15.5834 16.4442 15.197 15.5116 14.5094 14.8239C13.8218 14.1363 12.8891 13.75 11.9167 13.75H4.58335C3.61089 13.75 2.67826 14.1363 1.99063 14.8239C1.303 15.5116 0.916687 16.4442 0.916687 17.4167V19.25"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M8.24998 10.0833C10.275 10.0833 11.9166 8.44171 11.9166 6.41667C11.9166 4.39162 10.275 2.75 8.24998 2.75C6.22494 2.75 4.58331 4.39162 4.58331 6.41667C4.58331 8.44171 6.22494 10.0833 8.24998 10.0833Z"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M21.0833 19.25V17.4166C21.0827 16.6042 20.8123 15.815 20.3146 15.1729C19.8168 14.5308 19.1199 14.0722 18.3333 13.8691"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M14.6667 2.86914C15.4554 3.07108 16.1545 3.52978 16.6537 4.17293C17.1529 4.81607 17.4239 5.60707 17.4239 6.42122C17.4239 7.23538 17.1529 8.02638 16.6537 8.66952C16.1545 9.31266 15.4554 9.77136 14.6667 9.97331"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bgColor: "bg-[#EFF8FF]",
    iconBg: "bg-[#3B81F6]",
  },
  rising_star: {
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7828 3.20864C11.7048 3.06953 11.5912 2.95371 11.4536 2.8731C11.316 2.79249 11.1594 2.75 10.9999 2.75C10.8405 2.75 10.6839 2.79249 10.5463 2.8731C10.4087 2.95371 10.2951 3.06953 10.2171 3.20864C10.0338 3.5423 9.85748 3.88025 9.6882 4.22247C9.15488 5.30501 8.70144 6.42511 8.33153 7.5738C8.20411 7.96889 7.82645 8.24297 7.39378 8.25489C6.08223 8.28936 4.77495 8.41957 3.48236 8.64447C2.77286 8.76914 2.50611 9.57764 3.01028 10.0708C3.12517 10.1839 3.24128 10.2954 3.35861 10.4054C4.23592 11.2339 5.16352 12.0075 6.13611 12.7218C6.47253 12.9684 6.61095 13.391 6.48261 13.7778C5.99375 15.2473 5.64388 16.7594 5.43761 18.2942C5.34595 18.9863 6.08661 19.4749 6.73011 19.1449C8.00615 18.4906 9.22636 17.7327 10.3784 16.8789C10.5589 16.7472 10.7765 16.6762 10.9999 16.6762C11.2234 16.6762 11.441 16.7472 11.6214 16.8789C12.7733 17.7331 13.9935 18.491 15.2698 19.1449C15.9124 19.4749 16.6539 18.9863 16.5623 18.2942C16.5268 18.0345 16.488 17.7763 16.4459 17.5196C16.2341 16.2501 15.9236 14.999 15.5173 13.7778C15.3889 13.391 15.5264 12.9684 15.8638 12.7218C16.9672 11.9133 18.0118 11.0274 18.9896 10.0708C19.4938 9.57764 19.2279 8.76914 18.5175 8.64447C17.2251 8.41826 15.9177 8.28804 14.6061 8.25489C14.3987 8.25159 14.1974 8.18442 14.0296 8.06253C13.8618 7.94065 13.7357 7.76999 13.6684 7.5738C13.1813 6.06192 12.5499 4.59951 11.7828 3.20864Z"
          stroke="white"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconLocked: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11.7828 3.20864C11.7048 3.06953 11.5912 2.95371 11.4536 2.8731C11.316 2.79249 11.1594 2.75 10.9999 2.75C10.8405 2.75 10.6839 2.79249 10.5463 2.8731C10.4087 2.95371 10.2951 3.06953 10.2171 3.20864C10.0338 3.5423 9.85748 3.88025 9.6882 4.22247C9.15488 5.30501 8.70144 6.42511 8.33153 7.5738C8.20411 7.96889 7.82645 8.24297 7.39378 8.25489C6.08223 8.28936 4.77495 8.41957 3.48236 8.64447C2.77286 8.76914 2.50611 9.57764 3.01028 10.0708C3.12517 10.1839 3.24128 10.2954 3.35861 10.4054C4.23592 11.2339 5.16352 12.0075 6.13611 12.7218C6.47253 12.9684 6.61095 13.391 6.48261 13.7778C5.99375 15.2473 5.64388 16.7594 5.43761 18.2942C5.34595 18.9863 6.08661 19.4749 6.73011 19.1449C8.00615 18.4906 9.22636 17.7327 10.3784 16.8789C10.5589 16.7472 10.7765 16.6762 10.9999 16.6762C11.2234 16.6762 11.441 16.7472 11.6214 16.8789C12.7733 17.7331 13.9935 18.491 15.2698 19.1449C15.9124 19.4749 16.6539 18.9863 16.5623 18.2942C16.5268 18.0345 16.488 17.7763 16.4459 17.5196C16.2341 16.2501 15.9236 14.999 15.5173 13.7778C15.3889 13.391 15.5264 12.9684 15.8638 12.7218C16.9672 11.9133 18.0118 11.0274 18.9896 10.0708C19.4938 9.57764 19.2279 8.76914 18.5175 8.64447C17.2251 8.41826 15.9177 8.28804 14.6061 8.25489C14.3987 8.25159 14.1974 8.18442 14.0296 8.06253C13.8618 7.94065 13.7357 7.76999 13.6684 7.5738C13.1813 6.06192 12.5499 4.59951 11.7828 3.20864Z"
          stroke="#B5B8BE"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bgColor: "bg-[#FCE7F3]",
    iconBg: "",
    iconBgColor: ROLE_COLORS.mentor.dark,
  },
  fast_growing: {
    icon: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 20.1663C16.0627 20.1663 20.1667 16.0623 20.1667 10.9997C20.1667 5.93706 16.0627 1.83301 11 1.83301C5.93743 1.83301 1.83337 5.93706 1.83337 10.9997C1.83337 16.0623 5.93743 20.1663 11 20.1663Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 16.5C14.0376 16.5 16.5 14.0376 16.5 11C16.5 7.96243 14.0376 5.5 11 5.5C7.96243 5.5 5.5 7.96243 5.5 11C5.5 14.0376 7.96243 16.5 11 16.5Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 12.8337C12.0125 12.8337 12.8333 12.0128 12.8333 11.0003C12.8333 9.9878 12.0125 9.16699 11 9.16699C9.98744 9.16699 9.16663 9.9878 9.16663 11.0003C9.16663 12.0128 9.98744 12.8337 11 12.8337Z"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    iconLocked: (
      <svg
        className="w-4 h-4"
        viewBox="0 0 22 22"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M11 20.1663C16.0627 20.1663 20.1667 16.0623 20.1667 10.9997C20.1667 5.93706 16.0627 1.83301 11 1.83301C5.93743 1.83301 1.83337 5.93706 1.83337 10.9997C1.83337 16.0623 5.93743 20.1663 11 20.1663Z"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 16.5C14.0376 16.5 16.5 14.0376 16.5 11C16.5 7.96243 14.0376 5.5 11 5.5C7.96243 5.5 5.5 7.96243 5.5 11C5.5 14.0376 7.96243 16.5 11 16.5Z"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M11 12.8337C12.0125 12.8337 12.8333 12.0128 12.8333 11.0003C12.8333 9.9878 12.0125 9.16699 11 9.16699C9.98744 9.16699 9.16663 9.9878 9.16663 11.0003C9.16663 12.0128 9.98744 12.8337 11 12.8337Z"
          stroke="#B5B8BE"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
    bgColor: "bg-[#EEFDF0]",
    iconBg: "bg-[#008B47]",
  },
};

interface AchievementsSectionProps {
  achievements: MentorAchievement[];
}

export function AchievementsSection({
  achievements,
}: AchievementsSectionProps) {
  return (
    <div className="flex flex-col gap-5 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-[#FFFDF5] flex-shrink-0">
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
                iconBg={achievement.isLocked ? "bg-transparent" : config.iconBg}
                iconBgColor={achievement.isLocked ? undefined : config.iconBgColor}
                isLocked={achievement.isLocked}
              />
            );
          })}
        </div>
      )}
    </div>
  );
}
