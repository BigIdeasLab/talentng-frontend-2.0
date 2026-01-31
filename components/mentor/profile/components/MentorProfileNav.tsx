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
    <div className="w-full h-[67px] bg-white border-b border-[#E1E4EA]">
      <div className="flex items-center gap-[10px] h-full">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className={`flex px-5 py-[22px] justify-center items-center gap-[10px] relative ${
              activeTab === tab.id
                ? "border-b-2 border-black"
                : "border-b-2 border-transparent"
            }`}
          >
            <span
              className={`text-[15px] font-medium font-inter-tight ${
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
