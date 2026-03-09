import React from "react";
import { ResponsiveGrid } from "./ResponsiveGrid";

/**
 * Example usage of ResponsiveGrid component
 */
export default function ResponsiveGridExample() {
  // Sample card component
  const Card = ({ title, description }: { title: string; description: string }) => (
    <div className="border border-[#E1E4EA] rounded-lg p-4 bg-white">
      <h3 className="font-inter-tight text-[14px] font-semibold text-black mb-2">
        {title}
      </h3>
      <p className="font-inter-tight text-[12px] text-[#525866]">
        {description}
      </p>
    </div>
  );

  return (
    <div className="p-6 space-y-8 bg-gray-50 min-h-screen">
      <div className="max-w-7xl mx-auto space-y-8">
        <h1 className="text-2xl font-bold text-black">
          ResponsiveGrid Examples
        </h1>

        {/* 3-column grid (default) */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">
            3-Column Grid (Default)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Single column on mobile, 2 columns on tablet, 3 columns on desktop
          </p>
          <ResponsiveGrid>
            <Card title="Card 1" description="This is a sample card in a 3-column grid" />
            <Card title="Card 2" description="Resize your browser to see responsive behavior" />
            <Card title="Card 3" description="Grid adapts to different screen sizes" />
            <Card title="Card 4" description="Mobile: 1 column" />
            <Card title="Card 5" description="Tablet: 2 columns" />
            <Card title="Card 6" description="Desktop: 3 columns" />
          </ResponsiveGrid>
        </div>

        {/* 4-column grid */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">
            4-Column Grid
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Single column on mobile, 2 columns on tablet, 4 columns on desktop
          </p>
          <ResponsiveGrid columns={4}>
            <Card title="Card 1" description="4-column layout on large screens" />
            <Card title="Card 2" description="Perfect for product grids" />
            <Card title="Card 3" description="Or image galleries" />
            <Card title="Card 4" description="Maintains responsiveness" />
            <Card title="Card 5" description="Mobile: 1 column" />
            <Card title="Card 6" description="Tablet: 2 columns" />
            <Card title="Card 7" description="Desktop: 4 columns" />
            <Card title="Card 8" description="Extra large: 4 columns" />
          </ResponsiveGrid>
        </div>

        {/* Custom gap spacing */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">
            Custom Gap Spacing (gap-2)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Smaller gap between grid items
          </p>
          <ResponsiveGrid gap={2}>
            <Card title="Card 1" description="Tighter spacing" />
            <Card title="Card 2" description="gap-2 (0.5rem)" />
            <Card title="Card 3" description="More compact layout" />
          </ResponsiveGrid>
        </div>

        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">
            Large Gap Spacing (gap-8)
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Larger gap between grid items
          </p>
          <ResponsiveGrid gap={8}>
            <Card title="Card 1" description="More breathing room" />
            <Card title="Card 2" description="gap-8 (2rem)" />
            <Card title="Card 3" description="Spacious layout" />
          </ResponsiveGrid>
        </div>

        {/* Custom className */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">
            With Custom Styling
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Grid with custom background and padding
          </p>
          <ResponsiveGrid className="bg-blue-50 p-6 rounded-lg">
            <Card title="Card 1" description="Custom container styling" />
            <Card title="Card 2" description="Background color applied" />
            <Card title="Card 3" description="Padding around grid" />
          </ResponsiveGrid>
        </div>

        {/* Different content types */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">
            Mixed Content Types
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            Grid can contain any type of content
          </p>
          <ResponsiveGrid columns={4}>
            <div className="bg-red-100 p-4 rounded-lg">
              <div className="text-red-800 font-semibold">Red Card</div>
            </div>
            <div className="bg-blue-100 p-4 rounded-lg">
              <div className="text-blue-800 font-semibold">Blue Card</div>
            </div>
            <div className="bg-green-100 p-4 rounded-lg">
              <div className="text-green-800 font-semibold">Green Card</div>
            </div>
            <div className="bg-yellow-100 p-4 rounded-lg">
              <div className="text-yellow-800 font-semibold">Yellow Card</div>
            </div>
          </ResponsiveGrid>
        </div>

        {/* Real-world example: Talent cards */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-black">
            Real-World Example: Talent Cards
          </h2>
          <p className="text-sm text-gray-600 mb-4">
            How ResponsiveGrid would be used for talent profiles
          </p>
          <ResponsiveGrid>
            {[
              { name: "John Doe", role: "Frontend Developer", location: "New York" },
              { name: "Jane Smith", role: "UI/UX Designer", location: "San Francisco" },
              { name: "Bob Johnson", role: "Backend Developer", location: "Austin" },
              { name: "Alice Williams", role: "Product Manager", location: "Seattle" },
              { name: "Charlie Brown", role: "DevOps Engineer", location: "Boston" },
              { name: "Diana Prince", role: "Data Scientist", location: "Chicago" },
            ].map((talent, idx) => (
              <div
                key={idx}
                className="border border-[#E1E4EA] rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-lg font-semibold text-gray-600">
                      {talent.name.charAt(0)}
                    </span>
                  </div>
                  <div>
                    <div className="font-inter-tight text-[14px] font-semibold text-black">
                      {talent.name}
                    </div>
                    <div className="font-inter-tight text-[12px] text-[#525866]">
                      {talent.role}
                    </div>
                  </div>
                </div>
                <div className="font-inter-tight text-[11px] text-[#525866]">
                  📍 {talent.location}
                </div>
              </div>
            ))}
          </ResponsiveGrid>
        </div>

        {/* Responsive behavior info */}
        <div className="mt-8 p-4 bg-blue-50 rounded-lg">
          <h3 className="font-bold mb-2">Responsive Behavior:</h3>
          <ul className="list-disc list-inside space-y-1 text-sm">
            <li>
              <strong>Mobile (&lt; 768px):</strong> Single column layout (grid-cols-1)
            </li>
            <li>
              <strong>Tablet (768px - 1023px):</strong> Two column layout (md:grid-cols-2)
            </li>
            <li>
              <strong>Desktop (≥ 1024px):</strong> Three or four columns based on columns prop
              (lg:grid-cols-3 or lg:grid-cols-4)
            </li>
            <li>
              <strong>Gap:</strong> Consistent spacing across all breakpoints (configurable: 2, 3, 4, 6, or 8)
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
