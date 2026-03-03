# Technical Detail: Opportunity Data Consolidation

This document provides a comprehensive log of the architectural and data-level changes made to the "Opportunities" module to consolidate redundant fields.

## 1. Objective
To refine the `Opportunity` model by merging `employmentType` and `workType` into a single, standardized `type` field. This eliminates data overlap (e.g., distinguishing between a "Full-time" job and a "Remote" job in a single category) and simplifies the API surfacing for the frontend.

---

## 2. Schema Changes (`prisma/schema.prisma`)

### Enum Expansion
The `OpportunityType` enum was expanded from a generic `Job/Internship/Volunteer` structure to a comprehensive list of job natures.

**Updated Enum:**
```prisma
enum OpportunityType {
  FullTime
  PartTime
  Contract
  Internship
  Volunteer
  Freelance
  Remote
  Hybrid
  OnSite
}
```

### Model Cleanup
The following fields were **removed** from the `Opportunity` model:
- `employmentType` (@map("employment_type"))
- `workType` (@map("work_type"))

The `type` field now serves as the single source of truth for the nature of the opportunity.

---

## 3. Data Migration Logic
All existing 100+ database records were migrated using the following priority logic:

1. **Remote Priority**: If the legacy `workType` was "Remote" OR the `location` contained "Remote", the new `type` was set to `Remote`.
2. **Hybrid Priority**: If the legacy `workType` was "Hybrid", the new `type` was set to `Hybrid`.
3. **Employment Mapping**:
    - "Full Time" / "Full-time" → `FullTime`
    - "Part Time" / "Part-time" → `PartTime`
    - "Contract" → `Contract`
    - "Freelance" → `Freelance`
4. **Fallback**: If no specific mapping matched, the original `type` (`Volunteer`, `Internship`) was preserved.

---

## 4. Codebase Refactors

### Data Transfer Objects (DTOs)
The following files were updated to remove deprecated properties:
- `src/modules/opportunity/dto/create-opportunity.dto.ts`
- `src/modules/opportunity/dto/update-opportunity.dto.ts`
- `src/modules/opportunity/dto/get-opportunities.dto.ts` (Filters)

### Opportunity Service (`opportunity.service.ts`)
- **Queries**: Removed `employmentType` and `workType` from all Prisma `select` and `where` objects.
- **Search Logic**: Refined the `getOpportunities` method to filter solely by the new `type` enum.
- **Similar Opportunities**: Updated the "find similar" logic to match based on the unified `type` instead of separate nature/mode fields.

### Seeding Service (`seeding.service.ts`)
- Updated the JSON-to-Database mapper to correctly interpret the standardized types from the updated `opportunities.json`.

---

## 5. Global Data Updates
The seed file `src/public/opportunities.json` was bulk-edited to:
1. Remove all `"employmentType"` keys.
2. Remove all `"workMode"` / `"workType"` keys.
3. Standardize the `"type"` key for every entry (e.g., changing `"type": "Job"` to `"type": "FullTime"` or `"type": "Remote"` based on the record details).

---

## 6. API Compatibility Impact
- **Search**: Clients must now use `?type=FullTime` instead of `?employmentType=Full-time`.
- **Filtering**: The `workMode` filter is deprecated and merged into `type`.

> [!SUCCESS]
> **Status:** Completed & Verified.
> **Database:** Synced via `npx prisma db push`.
> **Prisma Client:** Regenerated.
