import React from "react";
import { Notification } from "@/lib/types/notification";
import { formatDistanceToNow } from "date-fns";
import { markNotificationAsRead } from "@/lib/api";

interface NotificationPanelProps {
  open: boolean;
  onClose: () => void;
  notifications: Notification[];
  loading: boolean;
  error: string | null;
  refetch: () => void;
}

export default function NotificationPanel({
  open,
  onClose,
  notifications,
  loading,
  error,
  refetch,
}: NotificationPanelProps) {
  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      refetch();
    } catch (err) {
      // Handle error appropriately
      console.error("Failed to mark notification as read.");
    }
  };

  return (
    <div
      className={`fixed inset-0 z-50 transition-opacity duration-300 ${open ? "opacity-100 visible" : "opacity-0 invisible pointer-events-none"}`}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Notification panel sliding from right */}
      <div
        className={`absolute right-0 top-0 h-full w-[370px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <h2 className="text-sm font-semibold text-black font-geist">
              Notification
            </h2>
            <button
              onClick={onClose}
              className="w-4 h-4 flex items-center justify-center text-gray-500 hover:text-gray-700"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 16 16"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g clipPath="url(#clip0_notification_close)">
                  <path
                    d="M7.99992 1.33301C11.6819 1.33301 14.6666 4.31767 14.6666 7.99967C14.6666 11.6817 11.6819 14.6663 7.99992 14.6663C4.31792 14.6663 1.33325 11.6817 1.33325 7.99967C1.33325 4.31767 4.31792 1.33301 7.99992 1.33301ZM6.58592 5.64234C6.46622 5.5215 6.30487 5.45099 6.13489 5.44522C5.9649 5.43945 5.79914 5.49887 5.67153 5.61132C5.54392 5.72376 5.46412 5.88073 5.44845 6.05009C5.43278 6.21945 5.48244 6.38839 5.58725 6.52234L5.64325 6.58567L7.05658 7.99901L5.64325 9.41367C5.52242 9.53337 5.4519 9.69472 5.44613 9.86471C5.44036 10.0347 5.49978 10.2005 5.61223 10.3281C5.72467 10.4557 5.88164 10.5355 6.051 10.5511C6.22036 10.5668 6.3893 10.5172 6.52325 10.4123L6.58592 10.357L7.99992 8.94234L9.41392 10.357C9.53361 10.4778 9.69496 10.5484 9.86495 10.5541C10.0349 10.5599 10.2007 10.5005 10.3283 10.388C10.4559 10.2756 10.5357 10.1186 10.5514 9.94926C10.5671 9.7799 10.5174 9.61095 10.4126 9.47701L10.3573 9.41367L8.94258 7.99967L10.3573 6.58567C10.4781 6.46598 10.5486 6.30463 10.5544 6.13464C10.5601 5.96466 10.5007 5.7989 10.3883 5.67129C10.2758 5.54368 10.1189 5.46387 9.9495 5.44821C9.78014 5.43254 9.6112 5.48219 9.47725 5.58701L9.41392 5.64234L7.99992 7.05701L6.58592 5.64234Z"
                    fill="#667085"
                  />
                </g>
                <defs>
                  <clipPath id="clip0_notification_close">
                    <rect width="16" height="16" fill="white" />
                  </clipPath>
                </defs>
              </svg>
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 p-6">
            {loading && <p>Loading...</p>}
            {error && <p>{error}</p>}
            {!loading && !error && (
              <div className="space-y-6">
                <div className="text-sm text-gray-500 font-geist">Today</div>
                <div className="space-y-6">
                  {notifications.map((notification) => (
                    <div
                      key={notification.id}
                      className="flex items-start justify-between"
                      onClick={() => handleMarkAsRead(notification.id)}
                    >
                      <div className="flex items-start gap-2">
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <g clipPath="url(#clip0_mail_send)">
                            <path
                              d="M19.9999 4C20.5303 4 21.039 4.21071 21.4141 4.58579C21.7892 4.96086 21.9999 5.46957 21.9999 6V18C21.9999 18.5304 21.7892 19.0391 21.4141 19.4142C21.039 19.7893 20.5303 20 19.9999 20H3.99987C3.46944 20 2.96073 19.7893 2.58565 19.4142C2.21058 19.0391 1.99987 18.5304 1.99987 18V17H3.99987V18H19.9999V7.423L13.0649 14.358C12.7836 14.6392 12.4021 14.7972 12.0044 14.7972C11.6066 14.7972 11.2252 14.6392 10.9439 14.358L3.99987 7.414V8H1.99987V6C1.99987 5.46957 2.21058 4.96086 2.58565 4.58579C2.96073 4.21071 3.46944 4 3.99987 4H19.9999ZM5.99987 13C6.25475 13.0003 6.4999 13.0979 6.68524 13.2728C6.87057 13.4478 6.9821 13.687 6.99704 13.9414C7.01198 14.1958 6.92919 14.4464 6.7656 14.6418C6.60201 14.8373 6.36996 14.9629 6.11687 14.993L5.99987 15H0.999869C0.744989 14.9997 0.499836 14.9021 0.3145 14.7272C0.129164 14.5522 0.0176337 14.313 0.0026966 14.0586C-0.0122405 13.8042 0.0705432 13.5536 0.234134 13.3582C0.397724 13.1627 0.629773 13.0371 0.882869 13.007L0.999869 13H5.99987ZM4.99987 10C5.26509 10 5.51944 10.1054 5.70698 10.2929C5.89451 10.4804 5.99987 10.7348 5.99987 11C5.99987 11.2652 5.89451 11.5196 5.70698 11.7071C5.51944 11.8946 5.26509 12 4.99987 12H1.99987C1.73465 12 1.4803 11.8946 1.29276 11.7071C1.10523 11.5196 0.999869 11.2652 0.999869 11C0.999869 10.7348 1.10523 10.4804 1.29276 10.2929C1.4803 10.1054 1.73465 10 1.99987 10H4.99987Z"
                              fill="#667085"
                            />
                          </g>
                          <defs>
                            <clipPath id="clip0_mail_send">
                              <rect width="24" height="24" fill="white" />
                            </clipPath>
                          </defs>
                        </svg>
                        <div className="flex flex-col gap-2">
                          <div className="text-sm font-semibold text-black font-geist">
                            {notification.payload.title}
                          </div>
                          <div className="text-sm text-gray-500 font-geist">
                            {notification.payload.message}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-1">
                        <span className="text-xs text-gray-500 font-geist">
                          {formatDistanceToNow(new Date(notification.createdAt), {
                            addSuffix: true,
                          })}
                        </span>
                        {!notification.readAt && (
                          <div className="w-1.5 h-1.5 rounded-full bg-blue-500"></div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Divider at bottom (as shown in Figma) */}
          <div className="border-t border-gray-100"></div>
        </div>
      </div>
    </div>
  );
}
