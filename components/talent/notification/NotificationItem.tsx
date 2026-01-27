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
    <div className="flex gap-4 px-6 py-5 border-b border-gray-100 hover:bg-gray-50 transition-colors">
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-14 h-14 rounded-full flex items-center justify-center text-white font-bold text-lg ${notification.logoColor}`}
      >
        {notification.logo}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-1">
        <p className="text-sm leading-snug">
          <span className="font-semibold text-gray-900">
            {notification.company}
          </span>{" "}
          <span className="font-normal text-gray-700">
            {notification.message}
          </span>
        </p>

        <div className="flex flex-col gap-1 mt-2">
          <div className="flex items-center gap-2">
            {notification.hasAlert && (
              <div className="w-2 h-2 bg-red-600 rounded-full flex-shrink-0"></div>
            )}
            <p className="text-xs text-gray-500">{notification.timestamp}</p>
          </div>
          {notification.hasAction && (
            <a
              href="#"
              className="text-xs text-blue-600 hover:text-blue-700 font-medium inline-flex items-center"
            >
              {notification.actionText} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
