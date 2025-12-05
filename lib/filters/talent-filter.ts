import type { FilterState } from "@/components/DiscoverTalent";
import type { TalentData } from "@/app/(business)/discover-talent/server-data";

/**
 * Filter talents based on search query and filter state
 * Search fields: fullName, headline, skills, location
 */
export function filterTalents(
  talents: TalentData[],
  filters: FilterState,
  searchQuery?: string,
): TalentData[] {
  const searchLower = searchQuery?.toLowerCase();

  return talents.filter((talent) => {
    // Search filter - searches: fullName, headline, skills, location
    if (searchLower) {
      const searchableFields = [
        talent.fullName,
        talent.headline,
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

    return true;
  });
}
