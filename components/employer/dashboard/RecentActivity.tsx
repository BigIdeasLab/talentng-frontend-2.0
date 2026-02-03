import { Users, Eye, CheckCircle, Calendar } from "lucide-react";

interface ActivityItemProps {
  name: string;
  action: string;
  position: string;
  timeAgo: string;
  type: "application" | "view" | "hired" | "interview";
}

function ActivityItem({
  name,
  action,
  position,
  timeAgo,
  type,
}: ActivityItemProps) {
  const iconConfig = {
    application: {
      icon: Users,
      bgColor: "bg-[#F1F2FF]",
      iconColor: "text-[#5C30FF]",
    },
    view: {
      icon: Eye,
      bgColor: "bg-[#FFF4E6]",
      iconColor: "text-[#F59E0C]",
    },
    hired: {
      icon: CheckCircle,
      bgColor: "bg-[#E8F6F0]",
      iconColor: "text-[#15BA80]",
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
        <p className="font-inter-tight text-xs font-normal text-[#5C30FF] self-stretch break-words">
          <span className="font-bold text-[#181B25]">{name} </span>
          <span className="text-[#525866]">{action}</span>
          <span className="font-medium text-[#5C30FF]"> </span>
          <span className="text-[#5C30FF]">{position}</span>
        </p>
        <span className="font-inter-tight text-[11px] font-normal text-[#525866]">
          {timeAgo}
        </span>
      </div>
    </div>
  );
}

export function RecentActivity() {
  const activities = [
    {
      name: "Oluwatobi Adeymi",
      action: "accepted the",
      position: "Mobile App postion",
      timeAgo: "2 hours ago",
      type: "application" as const,
    },
    {
      name: "Oluwatobi Adeymi",
      action: "accepted the",
      position: "Mobile App postion",
      timeAgo: "2 hours ago",
      type: "view" as const,
    },
    {
      name: "Yetunde Taylor",
      action: "accepted was hired as",
      position: "Interaction Designer",
      timeAgo: "2 hours ago",
      type: "hired" as const,
    },
    {
      name: "Sophia Silas",
      action: "scheduled interview for",
      position: "Web Designer",
      timeAgo: "2 hours ago",
      type: "interview" as const,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-4 p-4 rounded-lg border border-gray-300 bg-white w-full">
      <h2 className="font-inter-tight text-lg font-bold text-black flex-shrink-0">
        Recent Activity
      </h2>

      <div className="flex flex-col items-start gap-3 self-stretch">
        {activities.map((activity, index) => (
          <ActivityItem
            key={index}
            name={activity.name}
            action={activity.action}
            position={activity.position}
            timeAgo={activity.timeAgo}
            type={activity.type}
          />
        ))}
      </div>
    </div>
  );
}
