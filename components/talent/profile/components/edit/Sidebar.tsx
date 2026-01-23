import { cn } from "@/lib/utils";

interface SidebarProps {
  expandedSection: string;
  onToggleSection: (section: string) => void;
}

const sections = [
  { id: "personal", label: "Personal Details" },
  { id: "professional", label: "Professional Details" },
  { id: "experience", label: "Work Experience" },
  { id: "education", label: "Education" },
  { id: "portfolio", label: "Portfolio" },
  { id: "social", label: "Social Links" },
];

export function EditProfileSidebar({
  expandedSection,
  onToggleSection,
}: SidebarProps) {
  return (
    <div className="w-[250px] flex flex-col items-start gap-[35px] px-5 pt-[20px] border-r border-[#E1E4EA]">
      <h1 className="text-[20px] font-semibold text-black font-inter-tight">
        Edit Profile
      </h1>

      <div className="flex flex-col items-start gap-[22px] w-full">
        {sections.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => onToggleSection(id)}
            className={cn(
              "text-[14px] font-normal font-inter-tight transition-colors",
              expandedSection === id ? "text-[#5C30FF]" : "text-[#525866]",
              id === "personal" && "font-medium",
            )}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
