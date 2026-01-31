"use client";

interface BackgroundField {
  label: string;
  values: string[];
}

interface MentorBackgroundSectionProps {
  expertise?: string[];
  discipline?: string;
  industries?: string[];
  languages?: string[];
}

export function MentorBackgroundSection({
  expertise = [],
  discipline = "",
  industries = [],
  languages = [],
}: MentorBackgroundSectionProps) {
  const fields: BackgroundField[] = [
    {
      label: "Expertise",
      values: expertise,
    },
    {
      label: "Discipline",
      values: discipline ? [discipline] : [],
    },
    {
      label: "Industries",
      values: industries,
    },
    {
      label: "Language",
      values: languages,
    },
  ];

  return (
    <div className="flex flex-col items-start gap-4 w-full">
      {/* Background Title */}
      <h2 className="text-[17px] lg:text-[20px] font-semibold text-black font-inter-tight">
        Background
      </h2>

      {/* Background Fields */}
      <div className="flex flex-col items-start gap-2 w-full">
        {fields.map(
          (field, index) =>
            field.values.length > 0 && (
              <div
                key={index}
                className="flex flex-col lg:flex-row w-full px-2.5 py-2 gap-2 lg:justify-between lg:items-center rounded-lg border border-[#E1E4EA] bg-white overflow-hidden"
              >
                {/* Label */}
                <span className="text-[13px] lg:text-[13px] font-normal text-black font-inter-tight leading-[22px] flex-shrink-0">
                  {field.label}
                </span>

                {/* Tags */}
                <div className="flex justify-start lg:justify-end items-center gap-1.5 flex-wrap">
                  {field.values.map((value, idx) => (
                    <div
                      key={idx}
                      className="px-2.5 py-0.5 rounded bg-[#F5F5F5]"
                    >
                      <span className="text-[11px] lg:text-[12px] font-normal text-black font-inter-tight leading-[22px]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ),
        )}
      </div>
    </div>
  );
}
