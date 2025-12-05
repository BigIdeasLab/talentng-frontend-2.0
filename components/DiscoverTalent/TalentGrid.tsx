"use client";

import { TalentCard } from "./TalentCard";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

interface TalentGridProps {
  talents: TalentData[];
}

export function TalentGrid({ talents }: TalentGridProps) {
  return (
    <div className="flex-1 overflow-y-auto scrollbar-styled px-[25px] py-[16px]">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-[7px] pb-8">
        {talents.map((talent) => (
          <TalentCard key={talent.id} talent={talent} />
        ))}
      </div>
    </div>
  );
}
