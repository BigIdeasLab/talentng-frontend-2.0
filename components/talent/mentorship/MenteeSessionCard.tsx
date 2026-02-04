import { Clock, X, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface Mentor {
  id: string;
  name: string;
  avatar?: string;
  title?: string;
}

export type MenteeSessionStatus = "pending" | "upcoming" | "completed" | "cancelled";

interface MenteeSessionCardProps {
  id: string;
  mentor: Mentor;
  topic: string;
  message?: string;
  date: string;
  duration: string;
  location: string;
  status?: MenteeSessionStatus;
  onCancel?: (id: string) => void;
  onJoin?: (id: string) => void;
}

export function MenteeSessionCard({
  id,
  mentor,
  topic,
  message,
  date,
  duration,
  location,
  status = "pending",
  onCancel,
  onJoin,
}: MenteeSessionCardProps) {
  const statusConfig = {
    pending: { label: "Pending", bg: "bg-[#FEF3C7]", text: "text-[#D97706]" },
    upcoming: { label: "Upcoming", bg: "bg-[#EEF4FF]", text: "text-[#3B82F6]" },
    completed: {
      label: "Completed",
      bg: "bg-[#ECFDF3]",
      text: "text-[#10B981]",
    },
    cancelled: {
      label: "Cancelled",
      bg: "bg-[#FEF2F2]",
      text: "text-[#EF4444]",
    },
  };

  const mentorInitials = mentor.name
    .split(" ")
    .map((n) => n[0])
    .join("");

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-[#E1E4EA] bg-white p-4">
      <div className="flex flex-col gap-4">
        {/* Header - Mentor Info and Status */}
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-center gap-3">
            {/* Avatar */}
            {mentor.avatar ? (
              <div className="relative h-10 w-10 flex-shrink-0 overflow-hidden rounded-full">
                <Image
                  src={mentor.avatar}
                  alt={mentor.name}
                  fill
                  className="object-cover"
                />
              </div>
            ) : (
              <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-[#F5F3FF]">
                <span className="font-inter-tight text-[14px] font-semibold text-[#5C30FF]">
                  {mentorInitials}
                </span>
              </div>
            )}
            {/* Mentor Info */}
            <div>
              <h3 className="font-inter-tight text-[15px] font-semibold text-black">
                {mentor.name}
              </h3>
              {mentor.title && (
                <p className="font-inter-tight text-[13px] text-[#525866]">
                  {mentor.title}
                </p>
              )}
            </div>
          </div>
          {/* Status Badge */}
          <span
            className={`flex-shrink-0 rounded-full px-2.5 py-1 font-inter-tight text-[11px] font-medium ${statusConfig[status].bg} ${statusConfig[status].text}`}
          >
            {statusConfig[status].label}
          </span>
        </div>

        {/* Topic */}
        <div className="flex items-start gap-3.5">
          <div className="h-auto min-h-[40px] w-1 flex-shrink-0 self-stretch rounded-[48px] bg-[#5C30FF]" />
          <div className="flex flex-1 flex-col gap-2">
            <span className="font-inter-tight text-[12px] font-medium text-[#99A0AE]">
              Topic
            </span>
            <p className="font-inter-tight text-[14px] font-medium text-black">
              {topic}
            </p>
            {message && (
              <p className="font-inter-tight text-[13px] leading-relaxed text-[#525866] line-clamp-2">
                {message}
              </p>
            )}
          </div>
        </div>

        {/* Session Details */}
        <div className="flex flex-wrap items-center gap-4 text-[13px] text-[#525866]">
          <div className="flex items-center gap-1.5">
            <Calendar className="h-4 w-4" strokeWidth={1.5} />
            <span>{date}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Clock className="h-4 w-4" strokeWidth={1.5} />
            <span>{duration}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="h-4 w-4" strokeWidth={1.5} />
            <span>{location}</span>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="h-px w-full bg-[#E1E4EA]" />

      {/* Bottom Section - Actions */}
      <div className="flex items-center justify-end">
        <div className="flex items-center gap-2">
          {status === "pending" && (
            <span className="font-inter-tight text-[12px] text-[#D97706]">
              Waiting for mentor confirmation
            </span>
          )}
          {status === "upcoming" && (
            <>
              <Button
                onClick={() => onJoin?.(id)}
                className="flex items-center gap-2 rounded-[30px] bg-[#5C30FF] px-4 py-2 hover:bg-[#4A26CC]"
              >
                <span className="font-inter-tight text-[13px] font-normal text-white">
                  Join Session
                </span>
              </Button>
              <Button
                variant="outline"
                onClick={() => onCancel?.(id)}
                className="flex items-center gap-2 rounded-[30px] border-[#E1E4EA] bg-white px-4 py-2 hover:border-[#EF4444] hover:bg-[#FEF2F2] hover:text-[#EF4444]"
              >
                <X className="h-4 w-4" strokeWidth={1.375} />
                <span className="font-inter-tight text-[13px] font-normal">
                  Cancel
                </span>
              </Button>
            </>
          )}
          {status === "completed" && (
            <span className="font-inter-tight text-[12px] text-[#10B981]">
              Session completed
            </span>
          )}
          {status === "cancelled" && (
            <span className="font-inter-tight text-[12px] text-[#EF4444]">
              Session cancelled
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
