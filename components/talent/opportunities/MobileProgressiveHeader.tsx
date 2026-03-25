"use client";

import { ReactNode, useRef, forwardRef, useImperativeHandle } from "react";

interface MobileProgressiveHeaderProps {
  header: ReactNode;
  tabs: ReactNode;
  children: ReactNode;
}

export interface MobileProgressiveHeaderRef {
  scrollToTop: () => void;
}

export const MobileProgressiveHeader = forwardRef<
  MobileProgressiveHeaderRef,
  MobileProgressiveHeaderProps
>(function MobileProgressiveHeader({ header, tabs, children }, ref) {
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  useImperativeHandle(ref, () => ({
    scrollToTop: () => {
      if (scrollContainerRef.current) {
        scrollContainerRef.current.scrollTo({ top: 0, behavior: "smooth" });
      }
    },
  }));

  return (
    <div
      ref={scrollContainerRef}
      className="h-full overflow-y-auto scrollbar-styled"
    >
      {/* Header that scrolls normally */}
      <div className="w-full bg-white">{header}</div>

      {/* Tabs that stick to top after scrolling */}
      <div className="sticky top-0 z-10 bg-white border-b border-[#E1E4EA]">
        {tabs}
      </div>

      {/* Content */}
      <div className="min-h-full">{children}</div>
    </div>
  );
});
