interface SkillTagProps {
  skill: string;
  onRemove: () => void;
}

export function SkillTag({ skill, onRemove }: SkillTagProps) {
  return (
    <div className="flex items-center gap-2 px-[10px] py-[8px] rounded-full bg-[#F5F5F5]">
      <span className="text-[11px] font-normal text-black font-inter-tight leading-[105%]">
        {skill}
      </span>
      <button
        onClick={onRemove}
        className="hover:opacity-70 transition-opacity"
      >
        <svg
          width="13"
          height="13"
          viewBox="0 0 13 13"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M9.75 3.25L3.25044 9.74957M9.74957 9.75L3.25 3.25046"
            stroke="#606060"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>
    </div>
  );
}
