import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: string;
  isOpen: boolean;
  onToggle: () => void;
}

export function SectionHeader({
  title,
  isOpen,
  onToggle,
}: SectionHeaderProps) {
  return (
    <button
      onClick={onToggle}
      className="w-full flex items-center justify-between px-[16px] py-[14px]"
    >
      <h2 className="text-[14px] font-medium text-black font-inter-tight">
        {title}
      </h2>
      <ChevronDown
        className={cn(
          "w-5 h-5 text-[#B2B2B2] transition-transform",
          isOpen && "rotate-180",
        )}
      />
    </button>
  );
}
