import { ReactNode } from "react";

interface FormSectionComponentProps {
  title: string;
  isExpanded: boolean;
  onToggle: () => void;
  children: ReactNode;
  forwardedRef?: React.Ref<HTMLDivElement>;
}

export function FormSectionComponent({
  title,
  isExpanded,
  onToggle,
  children,
  forwardedRef,
}: FormSectionComponentProps) {
  return (
    <div ref={forwardedRef} className="border border-gray-300 rounded-[16px] overflow-hidden">
      <button
        onClick={onToggle}
        className="w-full px-5 py-4 bg-gray-50 flex items-center justify-between hover:bg-gray-100 transition-colors"
      >
        <span className="font-medium text-black text-[14px]">{title}</span>
        <svg
          className={`w-5 h-5 text-gray-600 transition-transform ${
            isExpanded ? "rotate-180" : ""
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 14l-7 7m0 0l-7-7m7 7V3"
          />
        </svg>
      </button>
      {isExpanded && (
        <>
          <div className="h-[1px] bg-gray-300" />
          <div className="p-5">{children}</div>
        </>
      )}
    </div>
  );
}
