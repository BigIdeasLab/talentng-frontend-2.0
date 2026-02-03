import { Zap, Heart } from "lucide-react";
import type { TopSkill } from "@/lib/api/talent";

interface SkillItemProps {
  name: string;
  percentage: number;
  endorsements: number;
}

function SkillItem({ name, percentage, endorsements }: SkillItemProps) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end justify-between gap-4">
        <span className="text-[16px] font-inter-tight text-black">{name}</span>
        <span className="text-[13px] text-[#606060] font-inter-tight">
          {percentage}%
        </span>
      </div>
      <div className="relative w-full h-2 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full bg-[#5C30FF] transition-all duration-300"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <div className="flex items-center gap-1.5">
        <Heart className="w-3 h-3 text-[#F77171] fill-[#F77171]" />
        <span className="text-[12px] text-[#606060] font-inter-tight">
          {endorsements} endorsement{endorsements !== 1 ? "s" : ""}
        </span>
      </div>
    </div>
  );
}

interface TopSkillsProps {
  skills: TopSkill[];
}

export function TopSkills({ skills }: TopSkillsProps) {
  return (
    <div className="flex flex-col gap-8 p-6 rounded-xl border border-[#B2B2B2]/10 bg-white">
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <Zap className="w-[18px] h-[18px] text-[#E9B305] fill-[#E9B305]" />
          <h2 className="text-[18px] font-semibold font-inter-tight">
            Top Skills
          </h2>
        </div>
        <button className="px-2.5 py-2 rounded-lg border border-gray-200 text-[14px] font-inter-tight text-black hover:bg-gray-50 transition-colors">
          Add Skills
        </button>
      </div>
      {skills.length === 0 ? (
        <p className="text-[14px] text-[#606060] font-inter-tight text-center py-8">
          No skills added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {skills.map((skill) => (
            <SkillItem
              key={skill.id}
              name={skill.name}
              percentage={skill.percentage}
              endorsements={skill.endorsements}
            />
          ))}
        </div>
      )}
    </div>
  );
}
