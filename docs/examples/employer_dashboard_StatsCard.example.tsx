import { StatsCard } from "./StatsCard";
import { Users, Briefcase, TrendingUp, Clock } from "lucide-react";

export default function StatsCardExample() {
  return (
    <div className="p-8 space-y-8">
      <div>
        <h2 className="text-2xl font-bold mb-4">Responsive Stat Cards</h2>
        <p className="text-gray-600 mb-6">
          Stat cards adapt to different screen sizes:
        </p>
        <ul className="list-disc list-inside text-gray-600 mb-6 space-y-2">
          <li>
            <strong>Mobile ({"<"}768px):</strong> Single column layout, smaller
            icons (36px), smaller value text (20px), change indicators visible
          </li>
          <li>
            <strong>Tablet (768px-1023px):</strong> Two column layout, larger
            icons (40px), larger value text (24px), change indicators hidden
          </li>
          <li>
            <strong>Desktop (≥1024px):</strong> Four column layout, larger icons
            (40px), larger value text (24px), change indicators visible
          </li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          icon={<Users className="w-5 h-5" strokeWidth={1.6} />}
          value={245}
          label="Total Applicants"
          gradient="bg-gradient-to-br from-[#F59E0B]/8 to-white"
          iconBg="bg-[#FEF3C7]"
          iconColor="text-[#D97706]"
          href="/applicants"
          change={{
            value: "+12%",
            type: "positive",
          }}
        />
        <StatsCard
          icon={<Briefcase className="w-5 h-5" strokeWidth={1.6} />}
          value={18}
          label="Active Opportunities"
          gradient="bg-gradient-to-br from-[#008B47]/8 to-white"
          iconBg="bg-[#D1FAE5]"
          iconColor="text-[#008B47]"
          href="/opportunities"
          change={{
            value: "+3",
            type: "positive",
          }}
        />
        <StatsCard
          icon={<TrendingUp className="w-5 h-5" strokeWidth={2} />}
          value={42}
          label="Hired This Month"
          gradient="bg-gradient-to-br from-[#2463EB]/8 to-white"
          iconBg="bg-[#DBE9FE]"
          iconColor="text-[#2463EB]"
          href="/applicants/hired-talents"
          change={{
            value: "+8%",
            type: "positive",
          }}
        />
        <StatsCard
          icon={<Clock className="w-5 h-5" strokeWidth={1.6} />}
          value={15}
          label="Pending Reviews"
          gradient="bg-gradient-to-br from-[#FCE7F3] to-white"
          iconBg="bg-[#FCE7F3]"
          iconColor="text-[#DB2777]"
          href="/applicants"
          change={{
            value: "-2",
            type: "negative",
          }}
        />
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg">
        <h3 className="font-semibold mb-2">Responsive Features:</h3>
        <ul className="list-disc list-inside text-sm space-y-1">
          <li>Value text scales from 20px to 24px on medium screens</li>
          <li>Icon size scales from 36px to 40px on medium screens</li>
          <li>
            Change indicators are hidden on tablet (md) but visible on mobile
            and desktop
          </li>
          <li>Grid layout adapts: 1 column → 2 columns → 4 columns</li>
          <li>All cards are clickable links with hover effects</li>
        </ul>
      </div>
    </div>
  );
}
