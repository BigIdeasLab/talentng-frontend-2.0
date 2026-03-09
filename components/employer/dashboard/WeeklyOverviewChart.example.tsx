import { WeeklyOverviewChart } from "./WeeklyOverviewChart";

export default function WeeklyOverviewChartExample() {
  const sampleData = [
    { day: "Mon", applications: 12, interviews: 5 },
    { day: "Tue", applications: 18, interviews: 8 },
    { day: "Wed", applications: 15, interviews: 6 },
    { day: "Thu", applications: 22, interviews: 10 },
    { day: "Fri", applications: 19, interviews: 7 },
    { day: "Sat", applications: 8, interviews: 3 },
    { day: "Sun", applications: 5, interviews: 2 },
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-50">
      <div>
        <h1 className="text-2xl font-bold mb-4">
          Weekly Overview Chart - Responsive Design
        </h1>
        <p className="text-gray-600 mb-6">
          This chart adapts to different screen sizes:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
          <li>Mobile (&lt; 768px): Height 300px with smaller font sizes (10px)</li>
          <li>Desktop (≥ 768px): Height 400px with standard font sizes</li>
          <li>Legend positioned below chart for better mobile readability</li>
          <li>Touch-friendly tooltips for mobile interaction</li>
          <li>Responsive container scales to full width</li>
        </ul>
      </div>

      <div className="max-w-4xl">
        <WeeklyOverviewChart data={sampleData} />
      </div>

      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Empty State</h2>
        <WeeklyOverviewChart />
      </div>
    </div>
  );
}
