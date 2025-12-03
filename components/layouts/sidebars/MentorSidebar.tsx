"use client";

import { useState, useMemo } from "react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useCurrentProfile } from "@/hooks/useProfileData";
import { useProfile } from "@/hooks/useProfile";
import { ProfileSwitcher } from "../ProfileSwitcher";

interface SidebarProps {
  activeItem?: string;
  onItemSelect?: (item: string) => void;
}

interface MenuItem {
  id: string;
  label: string;
  icon: React.ReactNode;
  badge?: number;
  href?: string;
}

const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.75 7.29167V5.625C8.75 4.25522 8.75 3.57032 8.37167 3.10934C8.30242 3.02496 8.22504 2.94757 8.14066 2.87832C7.67968 2.5 6.99478 2.5 5.625 2.5C4.25522 2.5 3.57032 2.5 3.10934 2.87832C3.02496 2.94757 2.94757 3.02496 2.87832 3.10934C2.5 3.57032 2.5 4.25522 2.5 5.625V7.29167C2.5 8.66142 2.5 9.34633 2.87832 9.80733C2.94757 9.89175 3.02496 9.96908 3.10934 10.0383C3.57032 10.4167 4.25522 10.4167 5.625 10.4167C6.99478 10.4167 7.67968 10.4167 8.14066 10.0383C8.22504 9.96908 8.30242 9.89175 8.37167 9.80733C8.75 9.34633 8.75 8.66142 8.75 7.29167Z" stroke="#525866" strokeWidth="1.25" strokeLinejoin="round"/>
    <path d="M6.45833 12.9165H4.79167C4.21018 12.9165 3.91944 12.9165 3.68286 12.9883C3.15019 13.1498 2.73335 13.5667 2.57177 14.0993C2.5 14.3359 2.5 14.6267 2.5 15.2082C2.5 15.7897 2.5 16.0804 2.57177 16.317C2.73335 16.8497 3.15019 17.2665 3.68286 17.4281C3.91944 17.4998 4.21018 17.4998 4.79167 17.4998H6.45833C7.03982 17.4998 7.33056 17.4998 7.56714 17.4281C8.09981 17.2665 8.51667 16.8497 8.67825 16.317C8.75 16.0804 8.75 15.7897 8.75 15.2082C8.75 14.6267 8.75 14.3359 8.67825 14.0993C8.51667 13.5667 8.09981 13.1498 7.56714 12.9883C7.33056 12.9165 7.03982 12.9165 6.45833 12.9165Z" stroke="#525866" strokeWidth="1.25" strokeLinejoin="round"/>
    <path d="M17.5 14.3752V12.7085C17.5 11.3387 17.5 10.6538 17.1217 10.1928C17.0524 10.1084 16.9751 10.0311 16.8907 9.96183C16.4297 9.5835 15.7447 9.5835 14.375 9.5835C13.0052 9.5835 12.3203 9.5835 11.8593 9.96183C11.7749 10.0311 11.6976 10.1084 11.6283 10.1928C11.25 10.6538 11.25 11.3387 11.25 12.7085V14.3752C11.25 15.7449 11.25 16.4298 11.6283 16.8908C11.6976 16.9752 11.7749 17.0526 11.8593 17.1218C12.3203 17.5002 13.0052 17.5002 14.375 17.5002C15.7447 17.5002 16.4297 17.5002 16.8907 17.1218C16.9751 17.0526 17.0524 16.9752 17.1217 16.8908C17.5 16.4298 17.5 15.7449 17.5 14.3752Z" stroke="#525866" strokeWidth="1.25" strokeLinejoin="round"/>
    <path d="M15.2083 2.5H13.5417C12.9602 2.5 12.6694 2.5 12.4328 2.57177C11.9002 2.73335 11.4833 3.15019 11.3217 3.68286C11.25 3.91944 11.25 4.21018 11.25 4.79167C11.25 5.37315 11.25 5.66389 11.3217 5.90048C11.4833 6.43314 11.9002 6.84998 12.4328 7.01157C12.6694 7.08333 12.9602 7.08333 13.5417 7.08333H15.2083C15.7898 7.08333 16.0806 7.08333 16.3172 7.01157C16.8498 6.84998 17.2667 6.43314 17.4283 5.90048C17.5 5.66389 17.5 5.37315 17.5 4.79167C17.5 4.21018 17.5 3.91944 17.4283 3.68286C17.2667 3.15019 16.8498 2.73335 16.3172 2.57177C16.0806 2.5 15.7898 2.5 15.2083 2.5Z" stroke="#525866" strokeWidth="1.25" strokeLinejoin="round"/>
  </svg>
);

const StudentCardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M11.6667 2.9165C14.8093 2.9165 16.3808 2.9165 17.357 3.95384C18.3333 4.99116 18.3333 6.66072 18.3333 9.99984C18.3333 13.3389 18.3333 15.0085 17.357 16.0458C16.3808 17.0832 14.8093 17.0832 11.6667 17.0832H8.33334C5.19064 17.0832 3.6193 17.0832 2.64298 16.0458C1.66667 15.0085 1.66667 13.3389 1.66667 9.99984C1.66667 6.66072 1.66667 4.99116 2.64298 3.95384C3.6193 2.9165 5.19064 2.9165 8.33334 2.9165H11.6667Z" stroke="#525866" strokeWidth="1.25" strokeLinejoin="round"/>
    <path d="M4.16667 12.9167C5.50721 11.1356 8.62826 11.0384 10 12.9167M8.54084 8.54181C8.54084 9.34723 7.88794 10.0001 7.08252 10.0001C6.27711 10.0001 5.62419 9.34723 5.62419 8.54181C5.62419 7.73641 6.27711 7.0835 7.08252 7.0835C7.88794 7.0835 8.54084 7.73641 8.54084 8.54181Z" stroke="#525866" strokeWidth="1.25" strokeLinecap="round"/>
    <path d="M12.5 7.9165H15.8333" stroke="#525866" strokeWidth="1.25" strokeLinecap="round"/>
    <path d="M12.5 11.25H14.1667" stroke="#525866" strokeWidth="1.25" strokeLinecap="round"/>
  </svg>
);

const FileIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M6.66667 14.1665H13.3333" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M6.66667 10.8335H10" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M10.8333 2.08317V2.49984C10.8333 4.85686 10.8333 6.03537 11.5656 6.7676C12.2978 7.49984 13.4763 7.49984 15.8333 7.49984H16.25M16.6667 8.88059V11.6665C16.6667 14.8092 16.6667 16.3806 15.6903 17.3568C14.7141 18.3332 13.1427 18.3332 9.99999 18.3332C6.85729 18.3332 5.28595 18.3332 4.30964 17.3568C3.33333 16.3806 3.33333 14.8092 3.33333 11.6665V7.8797C3.33333 5.17552 3.33333 3.82343 4.07172 2.90761C4.22089 2.7226 4.38942 2.55407 4.57444 2.4049C5.49025 1.6665 6.84234 1.6665 9.54649 1.6665C10.1345 1.6665 10.4284 1.6665 10.6977 1.76151C10.7537 1.78127 10.8085 1.804 10.8621 1.82963C11.1197 1.9528 11.3275 2.16067 11.7432 2.5764L15.6903 6.52353C16.1721 7.00525 16.4129 7.2461 16.5398 7.55239C16.6667 7.85867 16.6667 8.1993 16.6667 8.88059Z" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const NotificationIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M12.9167 15C12.9167 16.6108 11.6108 17.9167 10 17.9167C8.38916 17.9167 7.08333 16.6108 7.08333 15" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M16.0259 15.0002H3.97406C3.15996 15.0002 2.5 14.3402 2.5 13.5261C2.5 13.1352 2.6553 12.7602 2.93174 12.4837L3.43443 11.9811C3.90327 11.5122 4.16667 10.8763 4.16667 10.2133V7.91683C4.16667 4.69517 6.77834 2.0835 10 2.0835C13.2217 2.0835 15.8333 4.69516 15.8333 7.91683V10.2133C15.8333 10.8763 16.0967 11.5122 16.5656 11.9811L17.0682 12.4837C17.3447 12.7602 17.5 13.1352 17.5 13.5261C17.5 14.3402 16.84 15.0002 16.0259 15.0002Z" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const WorkIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.66667 11.6668C1.66667 9.32608 1.66667 8.15567 2.22844 7.31493C2.47164 6.95096 2.78414 6.63846 3.14811 6.39526C3.98885 5.8335 5.15924 5.8335 7.5 5.8335H12.5C14.8408 5.8335 16.0112 5.8335 16.8519 6.39526C17.2158 6.63846 17.5283 6.95096 17.7716 7.31493C18.3333 8.15567 18.3333 9.32608 18.3333 11.6668C18.3333 14.0076 18.3333 15.178 17.7716 16.0187C17.5283 16.3827 17.2158 16.6952 16.8519 16.9384C16.0112 17.5002 14.8408 17.5002 12.5 17.5002H7.5C5.15924 17.5002 3.98885 17.5002 3.14811 16.9384C2.78414 16.6952 2.47164 16.3827 2.22844 16.0187C1.66667 15.178 1.66667 14.0076 1.66667 11.6668Z" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M13.3333 5.83333C13.3333 4.26198 13.3333 3.47631 12.8452 2.98816C12.357 2.5 11.5713 2.5 10 2.5C8.42867 2.5 7.64298 2.5 7.15483 2.98816C6.66667 3.47631 6.66667 4.26198 6.66667 5.83333" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5 9.1665L5.54331 9.33484C8.40425 10.2215 11.5957 10.2215 14.4567 9.33484L15 9.1665M10 9.99984V11.6665" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SupportIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M14.1667 11.5037C14.1667 11.2157 14.1667 11.0717 14.21 10.9433C14.336 10.5703 14.6682 10.4257 15.0009 10.2741C15.375 10.1037 15.562 10.0185 15.7473 10.0035C15.9578 9.98649 16.1685 10.0318 16.3483 10.1327C16.5868 10.2665 16.753 10.5207 16.9233 10.7275C17.7093 11.6823 18.1024 12.1598 18.2463 12.6863C18.3623 13.1112 18.3623 13.5555 18.2463 13.9803C18.0365 14.7482 17.3738 15.392 16.8832 15.9878C16.6323 16.2926 16.5068 16.445 16.3483 16.5339C16.1685 16.6348 15.9578 16.6802 15.7473 16.6632C15.562 16.6482 15.375 16.563 15.0009 16.3926C14.6682 16.241 14.336 16.0963 14.21 15.7233C14.1667 15.595 14.1667 15.451 14.1667 15.1629V11.5037Z" stroke="#525866" strokeWidth="1.25"/>
    <path d="M7.91667 17.5C9.06726 18.6111 10.9328 18.6111 12.0833 17.5" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
    <path d="M5.83334 11.5037C5.83334 11.1411 5.82316 10.8151 5.52993 10.5601C5.42328 10.4674 5.28188 10.403 4.9991 10.2741C4.62501 10.1038 4.43797 10.0186 4.25264 10.0036C3.6966 9.95864 3.39744 10.3381 3.07678 10.7276C2.29063 11.6824 1.89756 12.1598 1.75372 12.6863C1.63766 13.1111 1.63766 13.5555 1.75372 13.9803C1.96351 14.7482 2.62627 15.3918 3.11685 15.9876C3.42608 16.3632 3.72148 16.706 4.25264 16.663C4.43797 16.648 4.62501 16.5628 4.9991 16.3924C5.28188 16.2636 5.42328 16.1992 5.52993 16.1065C5.82316 15.8515 5.83334 15.5256 5.83334 15.1628V11.5037Z" stroke="#525866" strokeWidth="1.25"/>
    <path d="M1.66667 13.3332V9.99984C1.66667 5.39746 5.39763 1.6665 10 1.6665C14.6023 1.6665 18.3333 5.39746 18.3333 9.99984L18.3334 13.3332" stroke="#525866" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M17.7646 5.95132L17.3532 5.23749C17.0422 4.69763 16.8867 4.42771 16.622 4.32006C16.3573 4.21243 16.058 4.29736 15.4594 4.46723L14.4426 4.75365C14.0604 4.84178 13.6594 4.79178 13.3105 4.61249L13.0297 4.45051C12.7305 4.25886 12.5003 3.97627 12.3729 3.64411L12.0947 2.81296C11.9117 2.26295 11.8202 1.98794 11.6023 1.83064C11.3846 1.67334 11.0952 1.67334 10.5166 1.67334H9.58758C9.00899 1.67334 8.71966 1.67334 8.50183 1.83064C8.28404 1.98794 8.19254 2.26295 8.00957 2.81296L7.73127 3.64411C7.60387 3.97627 7.3737 4.25886 7.07447 4.45051L6.79373 4.61249C6.44478 4.79178 6.04382 4.84178 5.66164 4.75365L4.64479 4.46723C4.04617 4.29736 3.74687 4.21243 3.48222 4.32006C3.21757 4.42771 3.06204 4.69763 2.75095 5.23749L2.33964 5.95132C2.04804 6.45736 1.90224 6.71039 1.93054 6.97974C1.95884 7.24909 2.15402 7.46615 2.54438 7.90026L3.40358 8.86083C3.61358 9.12667 3.76267 9.59 3.76267 10.0066C3.76267 10.4233 3.61363 10.8865 3.4036 11.1524L2.54438 12.113C2.15402 12.5472 1.95884 12.7642 1.93054 13.0336C1.90224 13.3029 2.04804 13.5559 2.33964 14.0619L2.75094 14.7757C3.06202 15.3156 3.21757 15.5856 3.48222 15.6932C3.74687 15.8008 4.04618 15.7159 4.6448 15.546L5.66161 15.2596C6.04385 15.1714 6.44489 15.2215 6.79389 15.4008L7.07458 15.5628C7.3738 15.7545 7.60386 16.037 7.73124 16.3692L8.00957 17.2004C8.19254 17.7504 8.28404 18.0254 8.50183 18.1827C8.71966 18.34 9.00899 18.34 9.58758 18.34H10.5166C11.0952 18.34 11.3846 18.34 11.6023 18.1827C11.8202 18.0254 11.9117 17.7504 12.0947 17.2004L12.373 16.3692C12.5003 16.037 12.7304 15.7545 13.0297 15.5628L13.3103 15.4008C13.6593 15.2215 14.0603 15.1714 14.4426 15.2596L15.4594 15.546C16.058 15.7159 16.3573 15.8008 16.622 15.6932C16.8867 15.5856 17.0422 15.3156 17.3532 14.7757L17.7646 14.0619C18.0562 13.5559 18.2019 13.3029 18.1737 13.0336C18.1453 12.7642 17.9502 12.5472 17.5598 12.113L16.7006 11.1524C16.4906 10.8865 16.3415 10.4233 16.3415 10.0066C16.3415 9.59 16.4907 9.12667 16.7006 8.86083L17.5598 7.90026C17.9502 7.46615 18.1453 7.24909 18.1737 6.97974C18.2019 6.71039 18.0562 6.45736 17.7646 5.95132Z" stroke="#525866" strokeWidth="1.25" strokeLinecap="round"/>
    <path d="M12.9329 10.0002C12.9329 11.611 11.6271 12.9168 10.0163 12.9168C8.40542 12.9168 7.09961 11.611 7.09961 10.0002C7.09961 8.38933 8.40542 7.0835 10.0163 7.0835C11.6271 7.0835 12.9329 8.38933 12.9329 10.0002Z" stroke="#525866" strokeWidth="1.25"/>
  </svg>
);

const menuItems: MenuItem[] = [
  {
    id: "dashboard",
    label: "Dashboard",
    icon: <DashboardIcon />,
    href: "/dashboard",
  },
  {
    id: "mentorship",
    label: "Mentorship",
    icon: <StudentCardIcon />,
    href: "/mentorship",
  },
  {
    id: "session-management",
    label: "Session Management",
    icon: <FileIcon />,
    href: "/sessions",
  },
  {
    id: "notification",
    label: "Notification",
    icon: <NotificationIcon />,
    badge: 3,
    href: "/notifications",
  },
  {
    id: "opportunities",
    label: "Opportuities",
    icon: <WorkIcon />,
    href: "/opportunities",
  },
];

const otherItems: Omit<MenuItem, "badge">[] = [
  { id: "support", label: "Support", icon: <SupportIcon /> },
  { id: "settings", label: "Settings", icon: <SettingsIcon />, href: "/settings" },
];

export function MentorSidebar({
  activeItem = "dashboard",
  onItemSelect,
}: SidebarProps) {
  const pathname = usePathname();
  const { initialProfileRaw } = useProfile();
  const { data: liveProfileData } = useCurrentProfile();

  const profile = useMemo(() => {
    if (liveProfileData) return liveProfileData;
    return initialProfileRaw;
  }, [liveProfileData, initialProfileRaw]);

  return (
    <aside className="flex w-[271px] flex-col bg-white border-r border-[#E1E4EA] h-screen">
      {/* Logo Section */}
      <div className="px-[30px] py-[15px]">
        <div className="flex items-center gap-[10px]">
          <img
            src="https://api.builder.io/api/v1/image/assets/TEMP/f6838e60fd1de6b7148b2370f51f6b0c9c23136e?width=90"
            alt="TalentNG Logo"
            className="w-[45px] h-[34px] rounded-[2.679px] shadow-sm"
          />
          <span className="font-medium text-[18px] leading-[20px] text-black font-['Inter_Tight']">
            TalentNG
          </span>
        </div>
      </div>

      {/* Content Container */}
      <div className="flex-1 px-[20px] py-[10px] flex flex-col gap-[477px] overflow-y-auto">
        <div className="flex flex-col gap-[12px]">
          {/* Profile Switcher */}
          <ProfileSwitcher profile={profile} userRole="Mentor" />

          {/* Main Navigation */}
          <div className="flex flex-col gap-[8px]">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              const MenuComponent = item.href ? Link : "button";
              return (
                <MenuComponent
                  key={item.id}
                  href={item.href || "#"}
                  onClick={() => onItemSelect?.(item.id)}
                  className={cn(
                    "flex items-center gap-[8px] px-[12px] py-[8px] rounded-lg transition-colors relative",
                    isActive ? "bg-white" : "bg-white hover:bg-[#FAFAFA]"
                  )}
                >
                  {item.icon}
                  <span className="text-[14px] leading-[20px] text-[#525866] font-['Inter_Tight'] flex-1">
                    {item.label}
                  </span>
                  {item.badge !== undefined && item.badge > 0 && (
                    <div className="flex items-center justify-center w-[20px] h-[20px] rounded-full bg-[#E63C23]">
                      <span className="text-[13px] font-semibold text-white font-['Inter_Tight']">
                        {item.badge}
                      </span>
                    </div>
                  )}
                </MenuComponent>
              );
            })}
          </div>
        </div>

        {/* Others Section */}
        <div className="flex flex-col gap-[10px]">
          <div className="px-[12px]">
            <span className="text-[12px] leading-[20px] font-medium text-[rgba(0,0,0,0.30)] font-['Inter_Tight']">
              OTHERS
            </span>
          </div>
          <div className="flex flex-col gap-[8px]">
            {otherItems.map((item) => {
              const isActive = pathname === item.href;
              const MenuComponent = item.href ? Link : "button";
              return (
                <MenuComponent
                  key={item.id}
                  href={item.href || "#"}
                  onClick={() => onItemSelect?.(item.id)}
                  className={cn(
                    "flex items-center gap-[8px] px-[12px] py-[8px] rounded-lg transition-colors",
                    isActive ? "bg-white" : "bg-white hover:bg-[#FAFAFA]"
                  )}
                >
                  {item.icon}
                  <span className="text-[14px] leading-[20px] text-[#525866] font-['Inter_Tight']">
                    {item.label}
                  </span>
                </MenuComponent>
              );
            })}
          </div>
        </div>
      </div>
    </aside>
  );
}
