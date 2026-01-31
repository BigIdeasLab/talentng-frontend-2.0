"use client";

interface MentorAboutSectionProps {
  bio: string;
  onEditBio?: () => void;
}

export function MentorAboutSection({
  bio,
  onEditBio,
}: MentorAboutSectionProps) {
  return (
    <div className="flex flex-col items-start gap-5 w-full">
      {/* Edit Your Bio Button */}
      <button
        onClick={onEditBio}
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 22 22"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M13.9463 5.48369L15.2312 4.19875C15.9409 3.48909 17.0915 3.48909 17.8011 4.19875C18.5107 4.9084 18.5107 6.05898 17.8011 6.76864L16.5162 8.05359M13.9463 5.48369L6.39856 13.0314C5.44037 13.9896 4.96126 14.4687 4.63503 15.0525C4.30878 15.6363 3.98055 17.0149 3.66669 18.3332C4.98494 18.0193 6.36351 17.691 6.94734 17.3648C7.53116 17.0386 8.01026 16.5595 8.96846 15.6013L16.5162 8.05359M13.9463 5.48369L16.5162 8.05359"
            stroke="#5C30FF"
            strokeWidth="1.375"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          <path
            d="M10.0833 18.3335H15.5833"
            stroke="#5C30FF"
            strokeWidth="1.375"
            strokeLinecap="round"
          />
        </svg>
        <span className="text-[15px] font-normal text-[#5C30FF] font-inter-tight">
          Edit Your Bio
        </span>
      </button>

      {/* About Brown Title */}
      <h2 className="text-[25px] font-semibold text-black font-inter-tight">
        About Brown
      </h2>

      {/* Bio Text */}
      <div className="text-[15px] font-normal text-black font-inter-tight leading-[26px] w-full">
        {bio}
      </div>
    </div>
  );
}
