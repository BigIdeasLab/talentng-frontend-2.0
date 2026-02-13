import { Zap, Heart } from "lucide-react";
import type { TopSkill } from "@/lib/api/talent";
import { ROLE_COLORS } from "@/lib/theme/role-colors";
import { cardHover } from "@/lib/theme/effects";

interface SkillItemProps {
  name: string;
  percentage: number;
  endorsements: number;
}

function SkillItem({ name, percentage, endorsements }: SkillItemProps) {
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-end justify-between gap-3">
        <span className="text-[13px] font-inter-tight text-black">{name}</span>
        <span className="text-[11px] text-[#606060] font-inter-tight">
          {percentage}%
        </span>
      </div>
      <div className="relative w-full h-1.5 bg-gray-200 rounded-full overflow-hidden">
        <div
          className="absolute left-0 top-0 h-full rounded-full transition-all duration-300"
          style={{ width: `${percentage}%`, backgroundColor: ROLE_COLORS.talent.dark }}
        />
      </div>
      <div className="flex items-center gap-1">
        <Heart className="w-2.5 h-2.5 text-[#F77171] fill-[#F77171]" />
        <span className="text-[11px] text-[#606060] font-inter-tight">
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
    <div className={`flex flex-col gap-5 p-4 rounded-lg shadow-[0_0_10px_rgba(0,0,0,0.11)] bg-white flex-shrink-0 ${cardHover}`}>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-[#E9B305] fill-[#E9B305]" />
          <h2 className="text-[15px] font-semibold font-inter-tight">
            Top Skills
          </h2>
        </div>
        <button className="px-2 py-1.5 rounded-md border border-gray-200 text-[12px] font-inter-tight text-black hover:bg-gray-50 transition-colors">
          Add Skills
        </button>
      </div>
      {skills.length === 0 ? (
        <p className="text-[12px] text-[#606060] font-inter-tight text-center py-6">
          No skills added yet
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
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
