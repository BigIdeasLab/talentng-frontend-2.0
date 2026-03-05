"use client";

interface AboutTabProps {
  fullName?: string;
  bio?: string | null;
  headline?: string;
  category?: string;
  location?: string;
  availability?: string[];
  phoneNumber?: string;
  experience?: Array<{
    id: string;
    company: string;
    position: string;
    startDate: string;
    endDate: string;
    description: string;
    isCurrently: boolean;
    location: string;
  }>;
  education?: Array<{
    id: string;
    school: string;
    degree: string;
    field: string;
    startDate: string;
    endDate: string;
    description: string;
  }>;
}

export function AboutTab({
  fullName = "User",
  bio,
  headline = "—",
  category = "—",
  location = "—",
  availability = [],
  phoneNumber,
  experience = [],
  education = [],
}: AboutTabProps) {
  return (
    <div className="flex flex-col gap-7 p-3 md:p-4 lg:p-5 w-full max-w-[700px]">
      {/* About Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black font-inter-tight">
          About {fullName}
        </h2>
        <div className="flex flex-col gap-3 text-[13px] font-normal text-black font-inter-tight leading-[22px]">
          {bio ? (
            bio
              .split("\n")
              .map((paragraph, index) => <p key={index}>{paragraph}</p>)
          ) : (
            <p className="text-black/50 italic">No bio added yet.</p>
          )}
        </div>
      </div>

      {/* Professional Details Section */}
      <div className="flex flex-col gap-4">
        <h2 className="text-lg font-semibold text-black font-inter-tight">
          Professional Details
        </h2>
        <div className="flex flex-col gap-2">
          {/* Headline */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Headline
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              {headline}
            </div>
          </div>

          {/* Category */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Category
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              {category}
            </div>
          </div>

          {/* Location */}
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              Location
            </div>
            <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
              {location}
            </div>
          </div>

          {/* Availability */}
          {availability.length > 0 && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
              <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                Availability
              </div>
              <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px] text-right">
                {availability.join(", ")}
              </div>
            </div>
          )}

          {/* Phone Number */}
          {phoneNumber && (
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 sm:gap-3 px-3 py-2.5 rounded-[8px] border border-[#E1E4EA]">
              <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                Phone Number
              </div>
              <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px]">
                {phoneNumber}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Work Experience Section */}
      {experience.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-black font-inter-tight">
            Work Experience
          </h2>
          <div className="flex flex-col gap-4">
            {experience.map((exp) => (
              <div
                key={exp.id}
                className="flex flex-col gap-2 px-3 py-3 rounded-[8px] border border-[#E1E4EA]"
              >
                <div className="text-[14px] font-semibold text-black font-inter-tight">
                  {exp.position}
                </div>
                <div className="text-[13px] font-normal text-black/70 font-inter-tight">
                  {exp.company}
                  {exp.location && ` • ${exp.location}`}
                </div>
                <div className="text-[12px] font-normal text-black/50 font-inter-tight">
                  {exp.startDate} - {exp.isCurrently ? "Present" : exp.endDate}
                </div>
                {exp.description && (
                  <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px] mt-1">
                    {exp.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Education Section */}
      {education.length > 0 && (
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-semibold text-black font-inter-tight">
            Education
          </h2>
          <div className="flex flex-col gap-4">
            {education.map((edu) => (
              <div
                key={edu.id}
                className="flex flex-col gap-2 px-3 py-3 rounded-[8px] border border-[#E1E4EA]"
              >
                <div className="text-[14px] font-semibold text-black font-inter-tight">
                  {edu.degree} in {edu.field}
                </div>
                <div className="text-[13px] font-normal text-black/70 font-inter-tight">
                  {edu.school}
                </div>
                <div className="text-[12px] font-normal text-black/50 font-inter-tight">
                  {edu.startDate} - {edu.endDate}
                </div>
                {edu.description && (
                  <div className="text-[13px] font-normal text-black font-inter-tight leading-[22px] mt-1">
                    {edu.description}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
