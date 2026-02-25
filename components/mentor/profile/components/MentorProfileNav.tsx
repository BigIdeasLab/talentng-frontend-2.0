"use client";

interface MentorProfileNavProps {
  activeTab: "overview" | "session" | "reviews";
  onTabChange: (tab: "overview" | "session" | "reviews") => void;
}

export function MentorProfileNav({
  activeTab,
  onTabChange,
}: MentorProfileNavProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    // TODO: Re-enable when real data is available
    // { id: "session", label: "Session" },
    // { id: "reviews", label: "Reviews" },
  ] as const;

  return (
    <div className="w-full min-h-[46px] lg:h-[54px] bg-white border-b border-[#E1E4EA] flex-shrink-0">
      <div className="flex items-center gap-1 lg:gap-2 h-full overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex px-2.5 lg:px-4 py-3 lg:py-4 justify-center items-center gap-2 relative whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-black"
                : "border-b-2 border-transparent"
            }`}
          >
            <span
              className={`text-[12px] lg:text-[13px] font-medium font-inter-tight ${
                activeTab === tab.id ? "text-black" : "text-[rgba(0,0,0,0.30)]"
              }`}
            >
              {tab.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
