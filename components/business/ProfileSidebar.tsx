"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutGrid,
  Telescope,
  Briefcase,
  GraduationCap,
  BookOpen,
  Headphones,
  Settings,
  ChevronDown,
} from "lucide-react";

const navigationItems = [
  { icon: LayoutGrid, label: "Dashboard", href: "/dashboard" },
  { icon: Telescope, label: "Discover Talent", href: "/discover" },
  { icon: Briefcase, label: "Opportuities", href: "/opportunities" },
  { icon: GraduationCap, label: "Mentorship", href: "/mentorship" },
  { icon: BookOpen, label: "Learning", href: "/learning" },
];

const otherItems = [
  { icon: Headphones, label: "Support", href: "/support" },
  { icon: Settings, label: "Settings", href: "/settings" },
];

export function ProfileSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-[271px] h-screen bg-white border-r border-[#E1E4EA] flex flex-col">
      <div className="p-[15px_30px]">
        <Link href="/" className="flex items-center gap-2.5">
          <Image
            src="/placeholder.svg"
            alt="TalentNG"
            width={45}
            height={34}
            className="rounded-[2.679px] shadow-[0.602px_0.602px_19.111px_0_rgba(0,0,0,0.25)]"
          />
          <span className="text-lg font-medium text-black font-[Inter_Tight]">
            TalentNG
          </span>
        </Link>
      </div>

      <div className="flex-1 px-5 py-2.5">
        <div className="space-y-3">
          <div className="rounded-lg bg-[#F5F5F5] p-[15px_10px]">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-orange-400 to-orange-600" />
                <div>
                  <div className="text-[15px] text-black font-[Inter_Tight]">
                    Akanbi David
                  </div>
                  <div className="text-[13px] text-black/30 font-[Inter_Tight]">
                    Independent Talent
                  </div>
                </div>
              </div>
              <ChevronDown className="w-4 h-4 text-black" />
            </div>
          </div>

          <nav className="space-y-2">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-white" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#525866]" strokeWidth={1.25} />
                  <span className="text-sm text-[#525866] font-[Inter_Tight]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-[473px] space-y-2.5">
          <div className="px-3 h-5 flex items-center">
            <span className="text-xs font-medium text-black/30 font-[Inter_Tight]">
              OTHERS
            </span>
          </div>

          <nav className="space-y-2">
            {otherItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-colors ${
                    isActive ? "bg-white" : "bg-white hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-5 h-5 text-[#525866]" strokeWidth={1.25} />
                  <span className="text-sm text-[#525866] font-[Inter_Tight]">
                    {item.label}
                  </span>
                </Link>
              );
            })}
          </nav>
        </div>
      </div>
    </aside>
  );
}
