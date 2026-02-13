import { ROLE_COLORS } from "@/lib/theme/role-colors";

interface NotificationsSkeletonProps {
  color?: string;
}

function NotificationItemSkeleton({ color }: { color: string }) {
  return (
    <div className="flex gap-3 px-5 py-4 border-b border-gray-100 animate-pulse">
      <div
        className="flex-shrink-0 w-11 h-11 rounded-full"
        style={{ backgroundColor: color }}
      />
      <div className="flex-1 min-w-0 py-0.5 flex flex-col gap-2">
        <div
          className="h-[12px] rounded w-3/4"
          style={{ backgroundColor: color }}
        />
        <div
          className="h-[12px] rounded w-full"
          style={{ backgroundColor: color }}
        />
        <div
          className="h-[10px] rounded w-[80px] mt-1"
          style={{ backgroundColor: color }}
        />
      </div>
    </div>
  );
}

export function NotificationsSkeleton({
  color = ROLE_COLORS.talent.light,
}: NotificationsSkeletonProps) {
  return (
    <div className="flex-1 overflow-y-auto">
      {Array.from({ length: 6 }).map((_, i) => (
        <NotificationItemSkeleton key={i} color={color} />
      ))}
    </div>
  );
}

export function TalentNotificationsSkeleton() {
  return <NotificationsSkeleton color={ROLE_COLORS.talent.light} />;
}

export function EmployerNotificationsSkeleton() {
  return <NotificationsSkeleton color={ROLE_COLORS.recruiter.light} />;
}

export function MentorNotificationsSkeleton() {
  return <NotificationsSkeleton color={ROLE_COLORS.mentor.light} />;
}
