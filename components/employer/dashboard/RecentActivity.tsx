import { Users, Calendar } from "lucide-react";

interface ActivityItemProps {
  message: string;
  timeAgo: string;
  type: "application" | "interview";
}

function ActivityItem({ message, timeAgo, type }: ActivityItemProps) {
  const iconConfig = {
    application: {
      icon: Users,
      bgColor: "bg-[#F1F2FF]",
      iconColor: "text-[#5C30FF]",
    },
    interview: {
      icon: Calendar,
      bgColor: "bg-[#E6F2FF]",
      iconColor: "text-[#3D82F6]",
    },
  };

  const config = iconConfig[type];
  const Icon = config.icon;

  return (
    <div className="flex items-start gap-2.5 self-stretch pb-3 border-b border-gray-200 last:border-0 last:pb-0">
      <div
        className={`flex w-6 h-6 p-1 justify-center items-center rounded-full ${config.bgColor} flex-shrink-0`}
      >
        <Icon className={`w-3.5 h-3.5 ${config.iconColor}`} strokeWidth={2} />
      </div>
      <div className="flex flex-col items-start gap-1.5 flex-1 min-w-0">
        <p className="font-inter-tight text-xs font-normal text-[#525866] self-stretch break-words">
          {message}
        </p>
        <span className="font-inter-tight text-[11px] font-normal text-[#525866]">
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

interface RecentActivityData {
  id: string;
  type: "application" | "interview";
  message: string;
  timestamp: string;
}

interface RecentActivityProps {
  data?: RecentActivityData[];
}

function formatTimeAgo(timestamp: string): string {
  const now = new Date();
  const date = new Date(timestamp);
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMins / 60);
  const diffDays = Math.floor(diffHours / 24);

  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? "s" : ""} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
  return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
}

export function RecentActivity({ data }: RecentActivityProps) {
  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg border border-gray-300 bg-white w-full">
      <h2 className="font-inter-tight text-lg font-bold text-black flex-shrink-0">
        Recent Activity
      </h2>

      <div className="flex flex-col items-start gap-3 self-stretch">
        {(data ?? []).map((activity) => (
          <ActivityItem
            key={activity.id}
            message={activity.message}
            timeAgo={formatTimeAgo(activity.timestamp)}
            type={activity.type}
          />
        ))}
      </div>
    </div>
  );
}
