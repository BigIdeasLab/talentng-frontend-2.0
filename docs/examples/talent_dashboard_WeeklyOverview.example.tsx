import { WeeklyOverview } from "./WeeklyOverview";
import type { WeeklyOverviewData } from "@/lib/api/talent";

export default function WeeklyOverviewExample() {
  const sampleData: WeeklyOverviewData[] = [
    { day: "Mon", applications: 8, views: 45 },
    { day: "Tue", applications: 12, views: 52 },
    { day: "Wed", applications: 10, views: 48 },
    { day: "Thu", applications: 15, views: 60 },
    { day: "Fri", applications: 11, views: 50 },
    { day: "Sat", applications: 5, views: 30 },
    { day: "Sun", applications: 3, views: 25 },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Weekly Overview (Talent) - Responsive Design
        </h1>
        <p className="text-gray-600 mb-6">
          This chart adapts to different screen sizes:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
          <li>
            Mobile (&lt; 768px): Height 300px with smaller font sizes (10px)
          </li>
          <li>Desktop (≥ 768px): Height 400px with standard font sizes</li>
          <li>Custom legend positioned above chart with responsive layout</li>
          <li>Legend stacks vertically on mobile, horizontal on desktop</li>
          <li>Touch-friendly tooltips for mobile interaction</li>
          <li>Responsive container scales to full width</li>
        </ul>
      </div>

      <div className="max-w-4xl">
        <WeeklyOverview data={sampleData} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Empty State</h2>
        <WeeklyOverview data={[]} />
      </div>
    </div>
  );
}
