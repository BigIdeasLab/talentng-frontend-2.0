import type { FilterState } from "@/components/DiscoverTalent";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

export function filterTalents(
  talents: TalentData[],
  filters: FilterState,
  searchQuery?: string,
): TalentData[] {
  const searchLower = searchQuery?.toLowerCase();

  return talents.filter((talent) => {
    // Search filter
    if (searchLower) {
      const searchableFields = [
        talent.name,
        talent.role,
        talent.location,
        ...talent.skills,
      ]
        .filter(Boolean)
        .map((f) => String(f).toLowerCase());

      if (!searchableFields.some((field) => field.includes(searchLower))) {
        return false;
      }
    }

    // Skills filter
    if (filters.skills.length > 0) {
      const talentSkills = talent.skills.map((s) => s.toLowerCase());
      if (
        !filters.skills.some((skill) =>
          talentSkills.some((ts) => ts.includes(skill.toLowerCase())),
        )
      ) {
        return false;
      }
    }

    // Location filter
    if (
      filters.location &&
      !talent.location.toLowerCase().includes(filters.location.toLowerCase())
    ) {
      return false;
    }

    // Availability filter (would need to be added to TalentData)
    // if (
    //   filters.availability !== "All" &&
    //   talent.availability?.toLowerCase() !==
    //     filters.availability.toLowerCase()
    // ) {
    //   return false;
    // }

    // Experience level filter (would need to be added to TalentData)
    // if (filters.experienceLevel) {
    //   // Implementation depends on adding experience level to TalentData
    // }

    return true;
  });
}
