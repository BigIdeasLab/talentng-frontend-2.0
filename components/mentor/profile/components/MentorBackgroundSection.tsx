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
    <div className="flex flex-col items-start gap-5 w-full">
      {/* Background Title */}
      <h2 className="text-[25px] font-semibold text-black font-inter-tight">
        Background
      </h2>

      {/* Background Fields */}
      <div className="flex flex-col items-start gap-[10px] w-full">
        {fields.map(
          (field, index) =>
            field.values.length > 0 && (
              <div
                key={index}
                className="flex w-full px-3 py-[11px] justify-between items-center rounded-[10px] border border-[#E1E4EA] bg-white overflow-hidden"
              >
                {/* Label */}
                <span className="text-[16px] font-normal text-black font-inter-tight leading-[26px]">
                  {field.label}
                </span>

                {/* Tags */}
                <div className="flex justify-end items-center gap-[6px] flex-wrap">
                  {field.values.map((value, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1 rounded-[5px] bg-[#F5F5F5]"
                    >
                      <span className="text-[14px] font-normal text-black font-inter-tight leading-[26px]">
                        {value}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )
        )}
      </div>
    </div>
  );
}
