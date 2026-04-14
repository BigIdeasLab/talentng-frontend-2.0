import { useState } from "react";
import { SwipeableNotificationItem } from "./SwipeableNotificationItem";

export default function SwipeableNotificationItemExample() {
  const [notifications, setNotifications] = useState([
    {
      id: "1",
      title: "New Application",
      message: "John Doe applied for Senior Developer position",
      time: "2 minutes ago",
      unread: true,
    },
    {
      id: "2",
      title: "Interview Scheduled",
      message: "Interview with Sarah Smith scheduled for tomorrow",
      time: "1 hour ago",
      unread: false,
    },
    {
      id: "3",
      title: "Profile Updated",
      message: "Your profile has been successfully updated",
      time: "3 hours ago",
      unread: false,
    },
  ]);

  const handleDismiss = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
      <div className="p-4 border-b">
        <h2 className="text-lg font-semibold">Swipeable Notifications</h2>
        <p className="text-sm text-gray-600">Swipe left or right to dismiss</p>
      </div>

      <div className="divide-y">
        {notifications.map((notification) => (
          <SwipeableNotificationItem
            key={notification.id}
            onDismiss={() => handleDismiss(notification.id)}
          >
            <div className="flex items-start gap-3 p-4">
              {notification.unread && (
                <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0 mt-2" />
              )}
              <div className="flex-1 min-w-0">
                <p className="text-sm break-words">
                  <span
                    className={
                      notification.unread ? "font-semibold" : "font-medium"
                    }
                  >
                    {notification.title}
                  </span>{" "}
                  <span className="text-gray-600">{notification.message}</span>
                </p>
                <p className="text-xs text-gray-500 mt-1 truncate">
                  {notification.time}
                </p>
              </div>
            </div>
          </SwipeableNotificationItem>
        ))}
      </div>

      {notifications.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          <p>All notifications dismissed!</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-2 text-blue-600 hover:text-blue-700"
          >
            Reload to reset
          </button>
        </div>
      )}
    </div>
  );
}
