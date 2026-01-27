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
    <div className="flex gap-3 px-5 py-4 border-b border-gray-100 hover:bg-gray-50 transition-colors flex-shrink-0">
      {/* Avatar */}
      <div
        className={`flex-shrink-0 w-11 h-11 rounded-full flex items-center justify-center text-white font-bold text-[13px] ${notification.logoColor}`}
      >
        {notification.logo}
      </div>

      {/* Content */}
      <div className="flex-1 min-w-0 py-0.5">
        <p className="text-[12px] leading-snug">
          <span className="font-semibold text-gray-900">
            {notification.company}
          </span>{" "}
          <span className="font-normal text-gray-700">
            {notification.message}
          </span>
        </p>

        <div className="flex flex-col gap-0.5 mt-1.5">
          <div className="flex items-center gap-1.5">
            {notification.hasAlert && (
              <div className="w-1.5 h-1.5 bg-red-600 rounded-full flex-shrink-0"></div>
            )}
            <p className="text-[10px] text-gray-500">{notification.timestamp}</p>
          </div>
          {notification.hasAction && (
            <a
              href="#"
              className="text-[10px] text-blue-600 hover:text-blue-700 font-medium inline-flex items-center gap-0.5"
            >
              {notification.actionText} →
            </a>
          )}
        </div>
      </div>
    </div>
  );
}
