export function WeeklyOverview() {
  return (
    <div className="flex flex-col gap-4 rounded-xl border border-[#E5E6ED] bg-white p-8">
      <div className="flex flex-col gap-[30px]">
        <div className="flex items-center justify-between">
          <div className="flex flex-col gap-3">
            <h2 className="font-inter-tight text-lg font-bold leading-normal text-black">
              Weekly Overview
            </h2>
            <p className="font-inter-tight text-sm font-normal leading-normal text-[#606060]">
              Applications and profile views this week
            </p>
          </div>
          <div className="flex items-center gap-5">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#5C30FF]" />
              <span className="font-inter-tight text-sm font-normal leading-normal text-[#606060]">
                Applications
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-[#D4D5DA]" />
              <span className="font-inter-tight text-sm font-normal leading-normal text-[#606060]">
                Views
              </span>
            </div>
          </div>
        </div>

        {/* Chart placeholder - In a real implementation, you'd use a charting library */}
        <div className="relative h-60 w-full">
          {/* Simple chart visualization */}
          <div className="flex h-full items-end justify-between gap-4 border-b border-l border-[#E5E7EB] px-4 pb-4">
            {/* Week days with bars */}
            {[
              { day: "Mon", views: 50, apps: 12 },
              { day: "Tue", views: 55, apps: 18 },
              { day: "Wed", views: 38, apps: 15 },
              { day: "Thu", views: 45, apps: 20 },
              { day: "Fri", views: 25, apps: 22 },
              { day: "Sat", views: 20, apps: 18 },
              { day: "Sun", views: 18, apps: 15 },
            ].map((item, i) => (
              <div key={i} className="flex flex-1 flex-col items-center gap-2">
                <div className="relative h-40 w-full">
                  {/* Views bar */}
                  <div
                    className="absolute bottom-0 w-full rounded-t bg-[#D4D5DA]"
                    style={{ height: `${(item.views / 80) * 100}%` }}
                  />
                  {/* Applications bar */}
                  <div
                    className="absolute bottom-0 w-full rounded-t bg-[#5C30FF]"
                    style={{ height: `${(item.apps / 80) * 100}%` }}
                  />
                </div>
                <span className="text-xs text-[#606060]">{item.day}</span>
              </div>
            ))}
          </div>

          {/* Hover tooltip for Wednesday */}
          <div className="absolute left-[35%] top-16 rounded-lg border border-[#E5E7EB] bg-white px-3 py-2 shadow-lg">
            <p className="font-inter-tight text-xs font-medium text-black">
              Wed
            </p>
            <div className="mt-1 flex flex-col gap-1">
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#D4D5DA]" />
                <span className="text-xs text-[#606060]">Views: 38</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="h-2 w-2 rounded-full bg-[#5C30FF]" />
                <span className="text-xs text-[#606060]">Applications: 15</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
