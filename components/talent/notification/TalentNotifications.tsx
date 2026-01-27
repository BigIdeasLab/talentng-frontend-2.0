"use client";

import { NotificationItem, type Notification } from "./NotificationItem";

const mockNotifications: Notification[] = [
  {
    id: "1",
    company: "Chowdeck",
    logo: "🍔",
    logoColor: "bg-yellow-500",
    message: 'wants to hire you as "Mobile App Designer"',
    timestamp: "30 Minutes Ago",
    hasAction: true,
    actionText: "Click to view and respond to offer",
    hasAlert: true,
  },
  {
    id: "2",
    company: "Spotify",
    logo: "🎵",
    logoColor: "bg-green-500",
    message: 'recently viewed your application. "Front-End Developer"',
    timestamp: "15 Minutes Ago",
    hasAction: false,
    hasAlert: true,
  },
  {
    id: "3",
    company: "Webflow",
    logo: "W",
    logoColor: "bg-blue-600",
    message: 'recently viewed your application. "GSAP Specialist"',
    timestamp: "15 Minutes Ago",
    hasAction: false,
    hasAlert: true,
  },
  {
    id: "4",
    company: "Jumia Nigeria",
    logo: "J",
    logoColor: "bg-orange-500",
    message:
      'just filled the position you applied for. "Senior Product Designer"',
    timestamp: "35 Minutes Ago",
    hasAction: false,
    hasAlert: false,
  },
  {
    id: "5",
    company: "Paystack",
    logo: "P",
    logoColor: "bg-blue-900",
    message: 'recently viewed your application. "Interaction Designer"',
    timestamp: "30 Minutes Ago",
    hasAction: false,
    hasAlert: false,
  },
  {
    id: "6",
    company: "Favro",
    logo: "F",
    logoColor: "bg-purple-600",
    message: 'recently viewed your application. "Product Designer"',
    timestamp: "10 Minutes Ago",
    hasAction: false,
    hasAlert: false,
  },
  {
    id: "7",
    company: "Taup",
    logo: "T",
    logoColor: "bg-pink-400",
    message: 'has hired you as a "Data Scientist"',
    timestamp: "Just Now",
    hasAction: false,
    hasAlert: false,
  },
  {
    id: "8",
    company: "Frontx",
    logo: "F",
    logoColor: "bg-gray-900",
    message: 'recently viewed your application. "Web Developer"',
    timestamp: "25 Minutes Ago",
    hasAction: false,
    hasAlert: false,
  },
  {
    id: "9",
    company: "Lottie",
    logo: "L",
    logoColor: "bg-teal-500",
    message: 'recently viewed your application. "UI Animator"',
    timestamp: "20 Minutes Ago",
    hasAction: false,
    hasAlert: false,
  },
];

export function TalentNotifications() {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-styled">
      {mockNotifications.map((notification) => (
        <NotificationItem key={notification.id} notification={notification} />
      ))}
    </div>
  );
}
