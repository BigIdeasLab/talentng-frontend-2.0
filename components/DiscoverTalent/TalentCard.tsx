"use client";

import { useRouter } from "next/navigation";
import Image from "next/image";
import { MapPin, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

interface TalentCardProps {
  talent: TalentData;
}

export function TalentCard({ talent }: TalentCardProps) {
  const router = useRouter();

  const handleViewProfile = () => {
    router.push(`/discover-talent/${talent.userId}`);
  };

  const GALLERY_COUNT = 4;
  const PLACEHOLDER = "/galleryplaceholder.jpg";
  const realImages = talent.gallery.filter(Boolean);
  const galleryImages =
    realImages.length >= GALLERY_COUNT
      ? realImages
      : [
          ...realImages,
          ...Array(GALLERY_COUNT - realImages.length).fill(PLACEHOLDER),
        ];

  return (
    <div className="p-[12px_10px] flex flex-col gap-[8px] border border-[#E1E4EA] rounded-[16px] bg-white transition-all active:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] hover:shadow-[0_4px_20px_0_rgba(0,0,0,0.05)] cursor-pointer group">
      {/* Header */}
      <div className="flex flex-col gap-[16px]">
        <div className="flex flex-col gap-[5px]">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-[8px]">
              <Image
                src={talent.avatar || "/default.png"}
                alt={talent.fullName}
                width={34}
                height={34}
                className="w-[34px] h-[34px] rounded-full object-cover flex-shrink-0"
                sizes="34px"
                unoptimized
              />
              <div className="flex flex-col gap-[2px]">
                <h3 className="text-[14px] font-semibold text-black font-inter-tight group-active:text-black/60 group-hover:text-black/60 transition-colors line-clamp-1">
                  {talent.fullName}
                </h3>
                <p className="text-[12px] font-normal text-black/40 font-inter-tight line-clamp-1">
                  {talent.headline}
                </p>
              </div>
            </div>
            <Button
              onClick={handleViewProfile}
              className="h-auto min-h-[44px] px-[8px] py-[12px] rounded-full bg-[#181B25] active:bg-[#2a2f3a] hover:bg-[#2a2f3a] border border-[#181B25] flex-shrink-0"
            >
              <span className="text-[11px] font-normal text-white font-inter-tight w-[60px]">
                View Profile
              </span>
            </Button>
          </div>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-[18px] text-[12px]">
          <div className="flex items-center gap-[5px] flex-shrink-0">
            <MapPin
              className="w-[15px] h-[15px] text-[#525866]"
              strokeWidth={1.5}
            />
            <span className="font-normal text-[#525866] font-inter-tight leading-[16px]">
              {talent.location}
            </span>
          </div>
          {talent.timesHired > 0 && (
            <div className="flex items-center gap-[5px] flex-shrink-0">
              <Briefcase
                className="w-[15px] h-[15px] text-[#525866]"
                strokeWidth={1.5}
              />
              <span className="font-normal text-[#525866] font-inter-tight leading-[16px]">
                {talent.timesHired}X Hired
              </span>
            </div>
          )}
          {talent.availability && talent.availability.length > 0 && (
            <div className="flex items-center gap-[5px] flex-shrink-0">
              <div className="w-[6px] h-[6px] rounded-full bg-green-500" />
              <span className="font-normal text-[#525866] font-inter-tight leading-[16px]">
                {talent.availability.join(", ")}
              </span>
            </div>
          )}
          {talent.category && (
            <span className="font-normal text-[#525866] font-inter-tight leading-[16px]">
              {talent.category}
            </span>
          )}
        </div>

        {/* Gallery */}
        <div className="flex items-center gap-[7px] overflow-x-auto scrollbar-hidden">
          {galleryImages.map((img, idx) => (
            <Image
              key={idx}
              src={img}
              alt={`Gallery ${idx + 1}`}
              width={147}
              height={147}
              className="h-[147px] w-[147px] object-cover rounded flex-shrink-0"
              sizes="(max-width: 768px) 120px, (max-width: 1024px) 140px, 147px"
              loading="lazy"
              unoptimized
            />
          ))}
        </div>

        {/* Skills & Stack */}
        <div className="flex flex-col gap-[8px]">
          {talent.stack.length > 0 && (
            <div className="flex flex-wrap gap-[4px] items-center">
              {talent.stack.slice(0, 3).map((item, idx) => (
                <div
                  key={idx}
                  className="px-[11px] py-[9px] flex justify-center items-center rounded-full bg-[#EEF2FF] border border-[#E0E7FF]"
                >
                  <span className="text-[11px] font-medium text-[#4338CA] font-inter-tight leading-[105%]">
                    {item}
                  </span>
                </div>
              ))}
              {talent.stack.length > 3 && (
                <span className="text-[11px] text-black/30 font-medium">
                  +{talent.stack.length - 3}
                </span>
              )}
            </div>
          )}

          <div className="flex flex-wrap gap-[4px] items-center">
            {talent.skills.slice(0, 4).map((skill, idx) => (
              <div
                key={idx}
                className="px-[11px] py-[9px] flex justify-center items-center rounded-full bg-[#F5F5F5]"
              >
                <span className="text-[11px] font-normal text-black font-inter-tight leading-[105%]">
                  {skill}
                </span>
              </div>
            ))}
            {talent.skills.length > 4 && (
              <span className="text-[11px] text-black/30 font-medium">
                +{talent.skills.length - 4}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
