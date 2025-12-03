interface StackTool {
  name: string;
  icon: string;
}

interface StackTagProps {
  tool: StackTool;
  onRemove: () => void;
}

export function StackTag({ tool, onRemove }: StackTagProps) {
  return (
    <div className="flex items-center gap-2 px-[10px] py-[7px] rounded-full bg-[#F5F5F5]">
      <div className="flex items-center gap-[5px]">
        <div className="w-4 h-4 rounded-full bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center text-xs">
          {tool.icon}
        </div>
        <span className="text-[11px] font-normal text-black font-inter-tight leading-[105%]">
          {tool.name}
        </span>
      </div>
      <button onClick={onRemove} className="hover:opacity-70 transition-opacity">
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
