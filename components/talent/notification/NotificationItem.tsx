"use client";

import { X } from "lucide-react";

export interface Notification {
  id: string;
  company: string;
  logo: string;
  logoColor: string;
  message: string;
  timestamp: string;
  hasAction?: boolean;
  actionText?: string;
  hasAlert?: boolean;
}

interface NotificationItemProps {
  notification: Notification;
}

export function NotificationItem({ notification }: NotificationItemProps) {
  return (
    <div className="flex gap-4 px-6 py-4 border-b border-gray-200 hover:bg-gray-50">
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-sm ${notification.logoColor}`}
      >
        {notification.logo}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-gray-900">
          {notification.company}{" "}
          <span className="font-normal text-gray-700">
            {notification.message}
          </span>
        </p>

        {notification.hasAction ? (
          <div className="flex items-center gap-2 mt-2">
            {notification.hasAlert && (
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            )}
            <p className="text-xs text-gray-500">{notification.timestamp}</p>
            <a
              href="#"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium"
            >
              {notification.actionText} →
            </a>
          </div>
        ) : (
          <div className="flex items-center gap-2 mt-2">
            {notification.hasAlert && (
              <div className="w-2 h-2 bg-red-600 rounded-full"></div>
            )}
            <p className="text-xs text-gray-500">{notification.timestamp}</p>
          </div>
        )}
      </div>
    </div>
  );
}
