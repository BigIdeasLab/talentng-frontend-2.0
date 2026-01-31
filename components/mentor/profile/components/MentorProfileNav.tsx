"use client";

interface MentorProfileNavProps {
  activeTab: "overview" | "earning" | "session" | "reviews";
  onTabChange: (tab: "overview" | "earning" | "session" | "reviews") => void;
}

export function MentorProfileNav({
  activeTab,
  onTabChange,
}: MentorProfileNavProps) {
  const tabs = [
    { id: "overview", label: "Overview" },
    { id: "earning", label: "Earning" },
    { id: "session", label: "Session" },
    { id: "reviews", label: "Reviews" },
  ] as const;

  return (
    <div className="w-full min-h-[56px] lg:h-[67px] bg-white border-b border-[#E1E4EA]">
      <div className="flex items-center gap-1 lg:gap-[10px] h-full overflow-x-auto scrollbar-hide">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex px-3 lg:px-5 py-4 lg:py-[22px] justify-center items-center gap-[10px] relative whitespace-nowrap ${
              activeTab === tab.id
                ? "border-b-2 border-black"
                : "border-b-2 border-transparent"
            }`}
          >
            <span
              className={`text-[14px] lg:text-[15px] font-medium font-inter-tight ${
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
