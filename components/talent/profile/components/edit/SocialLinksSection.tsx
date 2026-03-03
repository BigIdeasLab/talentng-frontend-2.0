import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { Button } from "@/components/ui/button";
import { Plus, X as XIcon } from "lucide-react";

interface SocialData {
  twitter: string;
  instagram: string;
  linkedin: string;
  website: string;
  customLinks?: { name: string; url: string }[];
}

interface SocialLinksSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  socialData: SocialData;
  onInputChange: (platform: string, value: string) => void;
  onCustomLinksChange?: (links: { name: string; url: string }[]) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onNext: () => void;
  errors?: Record<number, { name?: string; url?: string }>;
}

const socialPlatforms = [
  {
    name: "X",
    key: "twitter",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M2 14L7.03227 8.96773M7.03227 8.96773L2 2H5.33333L8.96773 7.03227M7.03227 8.96773L10.6667 14H14L8.96773 7.03227M14 2L8.96773 7.03227"
          stroke="#525866"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Instagram",
    key: "instagram",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M1.66602 8.00033C1.66602 5.01477 1.66602 3.52199 2.59351 2.59449C3.52101 1.66699 5.01379 1.66699 7.99935 1.66699C10.9849 1.66699 12.4777 1.66699 13.4052 2.59449C14.3327 3.52199 14.3327 5.01477 14.3327 8.00033C14.3327 10.9859 14.3327 12.4787 13.4052 13.4062C12.4777 14.3337 10.9849 14.3337 7.99935 14.3337C5.01379 14.3337 3.52101 14.3337 2.59351 13.4062C1.66602 12.4787 1.66602 10.9859 1.66602 8.00033Z"
          stroke="#525866"
          strokeLinejoin="round"
        />
        <path
          d="M11 8C11 9.65687 9.65687 11 8 11C6.34315 11 5 9.65687 5 8C5 6.34315 6.34315 5 8 5C9.65687 5 11 6.34315 11 8Z"
          stroke="#525866"
        />
        <path
          d="M11.672 4.33301H11.666"
          stroke="#525866"
          strokeWidth="1.33333"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "LinkedIn",
    key: "linkedin",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <path
          d="M3.00065 6.33301H2.66732C2.03878 6.33301 1.72451 6.33301 1.52924 6.52827C1.33398 6.72354 1.33398 7.03781 1.33398 7.66634V13.333C1.33398 13.9615 1.33398 14.2758 1.52924 14.4711C1.72451 14.6663 2.03878 14.6663 2.66732 14.6663H3.00065C3.62919 14.6663 3.94346 14.6663 4.13872 14.4711C4.33398 14.2758 4.33398 13.9615 4.33398 13.333V7.66634C4.33398 7.03781 4.33398 6.72354 4.13872 6.52827C3.94346 6.33301 3.62919 6.33301 3.00065 6.33301Z"
          stroke="#525866"
        />
        <path
          d="M4.33398 2.83301C4.33398 3.66143 3.66241 4.33301 2.83398 4.33301C2.00556 4.33301 1.33398 3.66143 1.33398 2.83301C1.33398 2.00458 2.00556 1.33301 2.83398 1.33301C3.66241 1.33301 4.33398 2.00458 4.33398 2.83301Z"
          stroke="#525866"
        />
        <path
          d="M8.21798 6.33301H7.66732C7.03878 6.33301 6.72452 6.33301 6.52924 6.52827C6.33398 6.72354 6.33398 7.03781 6.33398 7.66634V13.333C6.33398 13.9615 6.33398 14.2758 6.52924 14.4711C6.72452 14.6663 7.03878 14.6663 7.66732 14.6663H8.00065C8.62918 14.6663 8.94345 14.6663 9.13872 14.4711C9.33398 14.2758 9.33398 13.9615 9.33398 13.333L9.33405 10.9997C9.33405 9.89521 9.68605 8.99974 10.7259 8.99974C11.2458 8.99974 11.6673 9.44747 11.6673 9.99974V12.9997C11.6673 13.6283 11.6673 13.9425 11.8626 14.1378C12.0578 14.3331 12.3721 14.3331 13.0007 14.3331H13.3331C13.9615 14.3331 14.2757 14.3331 14.471 14.1379C14.6663 13.9427 14.6663 13.6285 14.6665 13.0001L14.6674 9.33314C14.6674 7.67634 13.0916 6.33317 11.5319 6.33317C10.6439 6.33317 9.85178 6.76841 9.33405 7.44901C9.33398 7.02894 9.33398 6.81894 9.24278 6.66301C9.18498 6.56425 9.10272 6.48203 9.00398 6.42425C8.84805 6.33301 8.63805 6.33301 8.21798 6.33301Z"
          stroke="#525866"
          strokeLinejoin="round"
        />
      </svg>
    ),
  },
  {
    name: "Website",
    key: "website",
    icon: (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.5" stroke="#525866" />
        <path d="M1.5 8H14.5" stroke="#525866" strokeLinecap="round" />
        <path
          d="M8 1.5C9.65685 3.15685 10.6569 5.48568 10.6569 8C10.6569 10.5143 9.65685 12.8432 8 14.5C6.34315 12.8432 5.34315 10.5143 5.34315 8C5.34315 5.48568 6.34315 3.15685 8 1.5Z"
          stroke="#525866"
        />
      </svg>
    ),
  },
];

export function SocialLinksSection({
  isOpen,
  onToggle,
  socialData,
  onInputChange,
  onCustomLinksChange,
  sectionRef,
  onNext,
  errors,
}: SocialLinksSectionProps) {
  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader title="Social Links" isOpen={isOpen} onToggle={onToggle} />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {socialPlatforms.map((platform) => (
              <div key={platform.key} className="flex flex-col gap-[10px]">
                <label className="text-[13px] font-normal text-black font-inter-tight">
                  {platform.name}
                </label>
                <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                  {platform.icon}
                  <input
                    type="text"
                    placeholder="Paste Link Here"
                    value={
                      socialData[
                        platform.key as keyof Omit<SocialData, "customLinks">
                      ]
                    }
                    onChange={(e) =>
                      onInputChange(platform.key, e.target.value)
                    }
                    className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                  />
                </div>
              </div>
            ))}

            {/* Custom Links */}
            {(socialData.customLinks || []).map((link, index) => (
              <div key={index} className="flex flex-col gap-[10px]">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col w-full">
                    <input
                      type="text"
                      placeholder="Link Name (e.g. Behance)"
                      value={link.name}
                      onChange={(e) => {
                        const updated = [...(socialData.customLinks || [])];
                        updated[index] = {
                          ...updated[index],
                          name: e.target.value,
                        };
                        onCustomLinksChange?.(updated);
                      }}
                      className="text-[13px] font-normal text-black font-inter-tight bg-transparent border-none focus:outline-none placeholder:text-black/30 w-full"
                    />
                    {errors?.[index]?.name && (
                      <span className="text-[11px] text-red-500 font-inter-tight mt-[-6px] mb-[2px]">
                        {errors[index].name}
                      </span>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      const updated = (socialData.customLinks || []).filter(
                        (_, i) => i !== index,
                      );
                      onCustomLinksChange?.(updated);
                    }}
                    className="text-[#525866] hover:text-red-500 transition-colors"
                  >
                    <XIcon className="w-4 h-4" />
                  </button>
                </div>
                <div className="flex flex-col gap-[4px]">
                  <div className="px-[12px] py-[18px] flex items-center gap-[10px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px]">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                      <path
                        d="M6.66699 8.66699C6.95329 9.04972 7.31856 9.36642 7.73803 9.59559C8.15751 9.82476 8.62133 9.96105 9.09804 9.99512C9.57475 10.0292 10.0533 9.96029 10.501 9.79319C10.9488 9.62609 11.3555 9.36474 11.6937 9.02699L13.6937 7.02699C14.3009 6.3981 14.6369 5.55606 14.6293 4.68099C14.6216 3.80592 14.2709 2.96966 13.6527 2.35148C13.0345 1.73331 12.1983 1.38257 11.3232 1.37492C10.4481 1.36727 9.60607 1.7033 8.97699 2.31033L7.83366 3.44699"
                        stroke="#525866"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9.33347 7.33347C9.04717 6.95074 8.6819 6.63403 8.26243 6.40487C7.84295 6.1757 7.37913 6.0394 6.90242 6.00534C6.42571 5.97127 5.94716 6.04017 5.49943 6.20727C5.05169 6.37437 4.64497 6.63572 4.3068 6.97347L2.3068 8.97347C1.69977 9.60236 1.36374 10.4444 1.37139 11.3195C1.37904 12.1945 1.72977 13.0308 2.34795 13.649C2.96613 14.2671 3.80239 14.6179 4.67746 14.6255C5.55253 14.6332 6.39457 14.2971 7.02347 13.6901L8.16014 12.5535"
                        stroke="#525866"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <input
                      type="text"
                      placeholder="Paste Link Here"
                      value={link.url}
                      onChange={(e) => {
                        const updated = [...(socialData.customLinks || [])];
                        updated[index] = {
                          ...updated[index],
                          url: e.target.value,
                        };
                        onCustomLinksChange?.(updated);
                      }}
                      className="flex-1 text-[13px] font-normal font-inter-tight placeholder:text-black/30 border-0 focus:outline-none bg-transparent"
                    />
                  </div>
                  {errors?.[index]?.url && (
                    <span className="text-[11px] text-red-500 font-inter-tight px-1">
                      {errors[index].url}
                    </span>
                  )}
                </div>
              </div>
            ))}

            {/* Add Link Button */}
            <button
              type="button"
              onClick={() => {
                const updated = [
                  ...(socialData.customLinks || []),
                  { name: "", url: "" },
                ];
                onCustomLinksChange?.(updated);
              }}
              className="flex items-center gap-2 text-[13px] font-normal text-[#5C30FF] font-inter-tight hover:opacity-80 transition-opacity"
            >
              <Plus className="w-4 h-4" />
              Add Link
            </button>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={onNext}
                className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal"
              >
                Save
              </Button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}
