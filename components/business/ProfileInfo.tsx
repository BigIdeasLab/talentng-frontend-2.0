"use client";

import {
  MapPin,
  Briefcase,
  DollarSign,
  Pencil,
  Linkedin,
  Instagram,
  Send,
  ExternalLink,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const skills = [
  "Website Design",
  "Mobile App Design",
  "Ui/Ux Design",
  "Interface Design",
];

const stack = [
  {
    name: "Figma",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/0a2c660d363dc6dd7201ee36e9ceeddd1f726bdd?width=40",
  },
  {
    name: "Rive",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/f8c5a221d6ec444ba0283931e0cc6e5bbb3502f6?width=40",
  },
  {
    name: "Webflow",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/315e778f2753675e0adddf444221a4bf2e5b1275?width=40",
  },
  {
    name: "Lottie",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/04c6a4c6cfe4544abfa760fd941de9a7af534b65?width=40",
  },
  {
    name: "Framer",
    icon: "https://api.builder.io/api/v1/image/assets/TEMP/77cd743c9e6b1f0fc14e22925b550692f6e2fbdc?width=40",
  },
];

const socialLinks = [
  { icon: Send, label: "Telegram", href: "#" },
  { icon: () => <XIcon />, label: "X", href: "#" },
  { icon: Instagram, label: "Instagram", href: "#" },
  { icon: Linkedin, label: "LinkendIn", href: "#" },
];

function XIcon() {
  return (
    <svg
      width="22"
      height="22"
      viewBox="0 0 22 22"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="w-[22px] h-[22px]"
    >
      <path
        d="M2.75 19.25L9.66937 12.3306M9.66937 12.3306L2.75 2.75H7.33333L12.3306 9.66937M9.66937 12.3306L14.6667 19.25H19.25L12.3306 9.66937M19.25 2.75L12.3306 9.66937"
        stroke="#525866"
        strokeWidth="1.375"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function ProfileInfo() {
  return (
    <div className="w-[333px] bg-white border-r border-[#E1E4EA] p-[35px_20px] overflow-y-auto h-screen">
      <div className="space-y-[25px]">
        <div className="space-y-7">
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="w-[110px] h-[110px] rounded-full bg-gradient-to-br from-orange-400 to-orange-600 ring-2 ring-[#E63C23]/20" />
              <div className="absolute -top-1 -right-1 bg-[#E63C23] text-white text-[10px] font-[Inter_Tight] px-2 py-1 rounded-full">
                25%
              </div>
            </div>

            <div className="mt-7 w-60 space-y-[15px]">
              <h1 className="text-[19px] font-medium text-black text-center font-[Inter_Tight]">
                Akanbi David
              </h1>
              <p className="text-[17px] font-light text-black/30 text-center font-[Inter_Tight]">
                Product & Interaction Designer
              </p>
            </div>

            <div className="mt-[15px] w-full space-y-[15px]">
              <div className="flex items-center gap-2">
                <MapPin
                  className="w-[22px] h-[22px] text-[#525866]"
                  strokeWidth={1.375}
                />
                <span className="text-[15px] text-black font-[Inter_Tight]">
                  Lagos, Nigeria
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase
                  className="w-[22px] h-[22px] text-[#525866]"
                  strokeWidth={1.25}
                />
                <span className="text-[15px] text-black font-[Inter_Tight]">
                  Ui/Ux Designer
                </span>
              </div>

              <div className="flex items-center gap-2">
                <Briefcase
                  className="w-[22px] h-[22px] text-[#525866]"
                  strokeWidth={1.25}
                />
                <span className="text-[15px] text-black font-[Inter_Tight]">
                  5x Hired
                </span>
              </div>

              <div className="flex items-center gap-2">
                <DollarSign
                  className="w-[22px] h-[22px] text-[#525866]"
                  strokeWidth={1.375}
                />
                <span className="text-[15px] text-black font-[Inter_Tight]">
                  $20,000 Earned
                </span>
              </div>
            </div>
          </div>

          <button className="w-full py-[15px] px-[79px] bg-[#181B25] border border-[#181B25] rounded-[50px] flex items-center justify-center gap-2 hover:bg-[#181B25]/90 transition-colors">
            <Pencil className="w-6 h-6 text-white" strokeWidth={1.5} />
            <span className="text-lg text-white font-[Aeonik_TRIAL]">
              Edit Profile
            </span>
          </button>
        </div>

        <div className="space-y-[35px]">
          <div className="space-y-5">
            <h2 className="text-[15px] text-black/30 font-[Inter_Tight]">
              Skills
            </h2>
            <div className="flex flex-wrap gap-[5px]">
              {skills.map((skill) => (
                <div
                  key={skill}
                  className="px-[13px] py-3 bg-[#F5F5F5] rounded-[30px]"
                >
                  <span className="text-sm text-black font-[Inter_Tight] leading-[105%]">
                    {skill}
                  </span>
                </div>
              ))}
              <div className="px-[13px] py-2.5 bg-[#F5F5F5] rounded-[30px] h-[34px] flex items-center">
                <span className="text-sm text-black font-[Inter_Tight] leading-[105%]">
                  +6
                </span>
              </div>
            </div>
          </div>

          <div className="space-y-5">
            <h2 className="text-[15px] text-black/30 font-[Inter_Tight]">
              Stack
            </h2>
            <div className="flex flex-wrap gap-[5px]">
              {stack.map((item) => (
                <div
                  key={item.name}
                  className="px-[13px] py-2.5 bg-[#F5F5F5] rounded-[30px] flex items-center gap-[7px]"
                >
                  <div
                    className="w-5 h-5 rounded-full bg-cover bg-center"
                    style={{ backgroundImage: `url(${item.icon})` }}
                  />
                  <span className="text-sm text-black font-[Inter_Tight] leading-[105%]">
                    {item.name}
                  </span>
                </div>
              ))}
              <div className="px-[13px] py-2.5 bg-[#F5F5F5] rounded-[30px] h-10 flex items-center">
                <span className="text-sm text-black font-[Inter_Tight] leading-[105%]">
                  +6
                </span>
              </div>
            </div>
          </div>

          <div className="h-[164px] space-y-5">
            <h2 className="text-[15px] text-black/30 font-[Inter_Tight]">
              Social Links
            </h2>
            <div className="space-y-[15px]">
              {socialLinks.map((link) => {
                const Icon = link.icon;
                return (
                  <div
                    key={link.label}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <Icon className="w-[22px] h-[22px] text-[#525866]" />
                      <span className="text-[15px] text-black font-[Inter_Tight]">
                        {link.label}
                      </span>
                    </div>
                    <ExternalLink
                      className="w-[22px] h-[22px] text-[#525866]"
                      strokeWidth={1.375}
                    />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
