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
    <div className="flex w-full h-full min-h-[407px] flex-col items-center justify-center gap-[40px] py-[40px]">
      {/* Illustration */}
      <Image
        src="https://api.builder.io/api/v1/image/assets/TEMP/5b68bbcc9e62784e98d154af2628e5ba9b8066c3?width=432"
        alt="Empty state illustration"
        width={216}
        height={216}
        className="w-[216px] h-[216px]"
        unoptimized
      />

      {/* Info Container */}
      <div className="flex flex-col items-center gap-[16px] max-w-[360px] w-full">
        {/* Title */}
        <h3 className="text-[20px] font-medium leading-normal font-inter-tight text-black text-center">
          {title}
        </h3>

        {/* Description */}
        <p className="w-full text-[16px] font-light leading-normal font-inter-tight text-[rgba(0,0,0,0.30)] text-center">
          {description}
        </p>
      </div>

      {/* CTA Button */}
      <button
        onClick={onButtonClick}
        className="flex h-[49px] px-[24px] py-[18px] justify-center items-center gap-[10px] rounded-[50px] border border-[#5C30FF] bg-[#5C30FF] hover:bg-[#4a24d6] transition-colors"
      >
        <Plus className="w-[21px] h-[21px]" color="white" strokeWidth={2} />
        <span className="text-[18px] font-normal leading-normal font-inter-tight text-white">
          {buttonText}
        </span>
      </button>
    </div>
  );
}
