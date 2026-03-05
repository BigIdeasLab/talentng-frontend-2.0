"use client";

interface MentorAboutSectionProps {
  bio: string;
  mentorName?: string;
  onEditBio?: () => void;
}

export function MentorAboutSection({
  bio,
  mentorName = "Mentor",
  onEditBio,
}: MentorAboutSectionProps) {
  return (
    <div className="flex flex-col items-start gap-4 w-full">
      {/* About Title */}
      <h2 className="text-[17px] lg:text-[20px] font-semibold text-black font-inter-tight">
        About {mentorName}
      </h2>

      {/* Bio Text */}
      <div className="text-[12px] lg:text-[13px] font-normal text-black font-inter-tight leading-[20px] lg:leading-[22px] w-full whitespace-pre-line">
        {bio}
      </div>
    </div>
  );
}
