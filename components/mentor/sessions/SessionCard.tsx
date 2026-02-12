import { Clock, X, CheckCircle, Calendar, MapPin } from "lucide-react";

interface Mentee {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
  company?: string;
}

export type SessionStatus =
  | "upcoming"
  | "in_progress"
  | "pending_completion"
  | "disputed"
  | "completed"
  | "cancelled";

interface SessionCardProps {
  id: string;
  mentee: Mentee;
  topic: string;
  message?: string;
  date: string;
  duration: string;
  location: string;
  endTime?: string;
  status?: SessionStatus;
  onReschedule?: (id: string) => void;
  onCancel?: (id: string) => void;
  onComplete?: (id: string) => void;
  onConfirmCompletion?: (id: string) => void;
  onDispute?: (id: string) => void;
}

const statusConfig = {
  upcoming: { label: "Upcoming", bg: "#EEF4FF", text: "#3B82F6" },
  in_progress: { label: "In Progress", bg: "#FEF3C7", text: "#D97706" },
  pending_completion: {
    label: "Pending Completion",
    bg: "#FFF7ED",
    text: "#EA580C",
  },
  disputed: { label: "Disputed", bg: "#FEF2F2", text: "#DC2626" },
  completed: { label: "Completed", bg: "#ECFDF3", text: "#10B981" },
  cancelled: { label: "Cancelled", bg: "#FEF2F2", text: "#EF4444" },
};

export function SessionCard({
  id,
  mentee,
  topic,
  message,
  date,
  duration,
  location,
  endTime,
  status = "upcoming",
  onReschedule,
  onCancel,
  onComplete,
}: SessionCardProps) {
  const isSessionEnded = endTime ? new Date() > new Date(endTime) : false;
  const config = statusConfig[status];

  const menteeInitials = mentee.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex flex-col border border-[#E1E4EA] rounded-[16px] bg-white hover:shadow-md transition-shadow">
      {/* Card Content */}
      <div className="flex flex-col gap-3.5 px-4 pt-4 pb-3">
        {/* Header - Avatar + Info + Status Badge */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-2">
            {mentee.avatar ? (
              <img
                src={mentee.avatar}
                alt={mentee.name}
                className="w-8 h-8 rounded-full object-cover flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-[#FDF2F8] flex items-center justify-center flex-shrink-0">
                <span className="text-[12px] font-semibold font-inter-tight text-[#E91E8C]">
                  {menteeInitials}
                </span>
              </div>
            )}
            <div className="flex flex-col gap-1">
              <span className="text-[13px] font-medium font-inter-tight text-black">
                {mentee.name}
              </span>
              {(mentee.title || mentee.company) && (
                <span className="text-[12px] font-light font-inter-tight text-[#525866]">
                  {mentee.title}
                  {mentee.title && mentee.company && " at "}
                  {mentee.company}
                </span>
              )}
            </div>
          </div>

          {/* Status Badge */}
          <div
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-md flex-shrink-0"
            style={{ backgroundColor: config.bg }}
          >
            <div
              className="w-1.5 h-1.5 rounded-full"
              style={{ backgroundColor: config.text }}
            />
            <span
              className="text-[11px] font-normal font-inter-tight"
              style={{ color: config.text }}
            >
              {config.label}
            </span>
          </div>
        </div>

        {/* Topic */}
        <div className="text-[15px] font-medium font-inter-tight text-black">
          {topic}
        </div>

        {/* Message */}
        {message && (
          <p className="text-[13px] font-normal font-inter-tight text-[#525866] leading-relaxed line-clamp-2">
            {message}
          </p>
        )}

        {/* Details as pills */}
        <div className="flex items-start content-start gap-x-1 gap-y-1.5 flex-wrap">
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <Calendar className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {date}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <Clock className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {duration}
            </span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-2 rounded-[24px] bg-[#F5F5F5]">
            <MapPin className="w-3 h-3 text-[#525866]" />
            <span className="text-[12px] font-normal font-inter-tight text-black leading-[12.6px]">
              {location}
            </span>
          </div>
        </div>
      </div>

      {/* Footer - Actions */}
      <div className="flex items-center justify-end px-4 py-2.5 border-t border-[#E1E4EA]">
        <div className="flex items-center gap-1">
          {status === "upcoming" && (
            <>
              <button
                onClick={() => onReschedule?.(id)}
                className="flex items-center gap-1 px-4 py-2 h-8 bg-[#181B25] hover:bg-[#2a2d39] rounded-[40px] transition-colors"
              >
                <Clock className="w-4 h-4 text-white" />
                <span className="text-[12px] font-medium font-inter-tight text-white">
                  Reschedule
                </span>
              </button>
              <button
                onClick={() => onCancel?.(id)}
                className="flex items-center gap-1 px-4 py-2 h-8 border border-[#E1E4EA] rounded-[40px] hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-[12px] font-medium font-inter-tight">
                  Cancel
                </span>
              </button>
            </>
          )}
          {status === "in_progress" && (
            <>
              {isSessionEnded && (
                <button
                  onClick={() => onComplete?.(id)}
                  className="flex items-center gap-1 px-4 py-2 h-8 bg-[#E91E8C] hover:bg-[#D1187D] rounded-[40px] transition-colors"
                >
                  <CheckCircle className="w-4 h-4 text-white" />
                  <span className="text-[12px] font-medium font-inter-tight text-white">
                    Complete
                  </span>
                </button>
              )}
              {!isSessionEnded && (
                <span className="text-[12px] font-inter-tight text-[#D97706]">
                  Session in progress
                </span>
              )}
              <button
                onClick={() => onReschedule?.(id)}
                className="flex items-center gap-1 px-4 py-2 h-8 bg-[#181B25] hover:bg-[#2a2d39] rounded-[40px] transition-colors"
              >
                <Clock className="w-4 h-4 text-white" />
                <span className="text-[12px] font-medium font-inter-tight text-white">
                  Reschedule
                </span>
              </button>
              <button
                onClick={() => onCancel?.(id)}
                className="flex items-center gap-1 px-4 py-2 h-8 border border-[#E1E4EA] rounded-[40px] hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444] transition-colors"
              >
                <X className="w-4 h-4" />
                <span className="text-[12px] font-medium font-inter-tight">
                  Cancel
                </span>
              </button>
            </>
          )}
          {status === "pending_completion" && (
            <span className="text-[12px] font-inter-tight text-[#EA580C]">
              Waiting for mentee confirmation
            </span>
          )}
          {status === "disputed" && (
            <span className="text-[12px] font-inter-tight text-[#DC2626]">
              Session disputed by mentee
            </span>
          )}
          {status === "completed" && (
            <span className="text-[12px] font-inter-tight text-[#10B981]">
              Session completed
            </span>
          )}
          {status === "cancelled" && (
            <span className="text-[12px] font-inter-tight text-[#EF4444]">
              Session cancelled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
