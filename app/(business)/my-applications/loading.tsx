import { MyApplicationsSkeleton } from "@/components/talent/applications";

export default function Loading() {
  return (
    <div className="h-screen overflow-x-hidden bg-white flex flex-col">
      <div className="w-full px-[25px] pt-[19px] pb-[16px] border-b border-[#E1E4EA] flex-shrink-0">
        <div className="h-4 w-40 bg-gray-200 rounded animate-pulse mb-[19px]" />
        <div className="flex items-center gap-1 mb-[19px]">
          <div className="h-10 w-44 bg-gray-200 rounded-[8px] animate-pulse" />
          <div className="h-10 w-44 bg-gray-200 rounded-[8px] animate-pulse" />
        </div>
        <div className="h-10 w-full max-w-[585px] bg-gray-200 rounded-[8px] animate-pulse mb-[19px]" />
        <div className="flex items-center gap-[8px]">
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-pulse" />
          <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
        </div>
      </div>
      <div className="flex-1 overflow-hidden">
        <div className="h-full overflow-y-auto p-4 md:p-6">
          <MyApplicationsSkeleton type="jobs" />
        </div>
      </div>
    </div>
  );
}
