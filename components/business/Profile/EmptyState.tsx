"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

interface EmptyStateProps {
  title: string;
  description: string;
  buttonText: string;
  onButtonClick?: () => void;
}

export function EmptyState({
  title,
  description,
  buttonText,
  onButtonClick,
}: EmptyStateProps) {
  return (
    <div className="flex w-full h-full min-h-[320px] flex-col items-center justify-center gap-[28px] py-[30px]">
      {/* Illustration */}
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/5b68bbcc9e62784e98d154af2628e5ba9b8066c3?width=432"
        alt="Empty state illustration"
        width={184}
        height={184}
        className="w-[184px] h-[184px]"
        unoptimized
      />

      {/* Info Container */}
      <div className="flex flex-col items-center gap-[12px] max-w-[305px] w-full">
        {/* Title */}
        <h3 className="text-[17px] font-medium leading-normal font-inter-tight text-black text-center">
          {title}
        </h3>

        {/* Description */}
        <p className="w-full text-[13px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)] text-center">
          {description}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onButtonClick}
        className="flex h-[40px] px-[20px] py-[14px] justify-center items-center gap-[8px] rounded-[40px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a24d6] transition-colors"
      >
        <Plus className="w-[18px] h-[18px]" color="white" strokeWidth={2} />
        <span className="text-[15px] font-normal leading-normal font-inter-tight text-white">
          {buttonText}
        </span>
      </button>
    </div>
  );
}
