import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { Button } from "@/components/ui/button";

interface PortfolioSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  resumeUrl: string;
  onResumeChange: (url: string) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onNext: () => void;
}

export function PortfolioSection({
  isOpen,
  onToggle,
  resumeUrl,
  onResumeChange,
  sectionRef,
  onNext,
}: PortfolioSectionProps) {
  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader title="Portfolio" isOpen={isOpen} onToggle={onToggle} />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            <div className="flex flex-col gap-[10px]">
              <label className="text-[13px] font-normal text-black font-inter-tight">
                Resume / CV URL
              </label>
              <input
                type="url"
                value={resumeUrl}
                onChange={(e) => onResumeChange(e.target.value)}
                placeholder="https://example.com/resume.pdf"
                className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
              />
            </div>

            <div className="p-[12px] bg-[#F0F7FF] border border-[#ADD8F7] rounded-[8px]">
              <p className="text-[12px] font-normal text-black/70 font-inter-tight">
                Portfolio items can be added from your gallery or external
                links. You can showcase your best work, projects, and designs
                here.
              </p>
            </div>

            <Button className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal">
              + Add Portfolio Item
            </Button>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={onNext}
                className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}
