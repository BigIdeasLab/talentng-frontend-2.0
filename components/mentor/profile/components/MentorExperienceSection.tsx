"use client";

interface ExperienceItem {
  id?: string;
  role?: string;
  title?: string;
  company?: string;
  duration?: string;
  startDate?: string;
  endDate?: string;
  description?: string;
}

interface MentorExperienceSectionProps {
  experience: ExperienceItem[];
}

export function MentorExperienceSection({ experience }: MentorExperienceSectionProps) {
  if (!experience || experience.length === 0) {
    return (
      <div className="flex flex-col gap-[12px]">
        <h2 className="text-[16px] font-semibold text-black font-inter-tight">
          Experience
        </h2>
        <p className="text-[13px] text-[rgba(0,0,0,0.40)] font-inter-tight">
          No experience added yet.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-[12px]">
      <h2 className="text-[16px] font-semibold text-black font-inter-tight">
        Experience
      </h2>
      <div className="space-y-[16px]">
        {experience.map((exp, idx) => (
          <div
            key={exp.id || `exp-${idx}`}
            className="flex flex-col gap-[6px]"
          >
            <p className="text-[14px] font-medium text-black font-inter-tight">
              {exp.role || exp.title || "Untitled Role"}
            </p>
            {exp.company && (
              <p className="text-[13px] text-gray-600 font-inter-tight">
                {exp.company}
              </p>
            )}
            {(exp.duration || exp.startDate) && (
              <p className="text-[12px] text-gray-500 font-inter-tight">
                {exp.duration || `${exp.startDate}${exp.endDate ? ` - ${exp.endDate}` : " - Present"}`}
              </p>
            )}
            {exp.description && (
              <p className="text-[13px] text-gray-600 font-inter-tight mt-1">
                {exp.description}
              </p>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
