"use client";

import { ROLE_COLORS } from "@/lib/theme/role-colors";

// ---------------------------------------------------------------------------
// Primitive skeleton block
// ---------------------------------------------------------------------------
function Sk({
  className,
  color,
}: {
  className?: string;
  color: string;
}) {
  return (
    <div
      className={`animate-pulse rounded ${className ?? ""}`}
      style={{ backgroundColor: color }}
    />
  );
}

// ---------------------------------------------------------------------------
// Shared sub-components
// ---------------------------------------------------------------------------

/** Sidebar skeleton — left panel with title + nav links */
function SidebarSkeleton({
  color,
  sections,
}: {
  color: string;
  sections: number;
}) {
  return (
    <div className="w-[250px] flex-shrink-0 flex flex-col items-start gap-[35px] px-5 pt-[20px] border-r border-[#E1E4EA]">
      {/* "Edit Profile" title */}
      <Sk className="h-[22px] w-[100px]" color={color} />
      {/* Nav items */}
      <div className="flex flex-col items-start gap-[22px] w-full">
        {Array.from({ length: sections }).map((_, i) => (
          <Sk key={i} className={`h-[14px] ${i === 0 ? "w-[130px]" : "w-[110px]"}`} color={color} />
        ))}
      </div>
    </div>
  );
}

/** Top action bar skeleton — discard + save buttons */
function ActionBarSkeleton({ color }: { color: string }) {
  return (
    <div className="h-[56px] border-b border-[#E1E4EA] flex items-center justify-end px-[80px] gap-2 bg-white flex-shrink-0">
      <Sk className="h-[40px] w-[80px] rounded-full" color={color} />
      <Sk className="h-[40px] w-[120px] rounded-full" color={color} />
    </div>
  );
}

/** A collapsed accordion section placeholder */
function AccordionSectionSkeleton({
  color,
  expanded = false,
  fieldCount = 0,
}: {
  color: string;
  expanded?: boolean;
  fieldCount?: number;
}) {
  return (
    <div className="border border-[#E1E4EA] rounded-[16px] bg-white overflow-hidden">
      {/* Section header */}
      <div className="px-5 py-4 flex items-center justify-between">
        <Sk className="h-[14px] w-[140px]" color={color} />
        <Sk className="h-[14px] w-[14px] rounded-full" color={color} />
      </div>

      {/* Expanded content */}
      {expanded && fieldCount > 0 && (
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {/* Avatar / image ring placeholder */}
            <div className="relative" style={{ width: 110, height: 110 }}>
              <Sk className="w-[110px] h-[110px] rounded-full" color={color} />
            </div>

            {/* Input fields */}
            {Array.from({ length: fieldCount }).map((_, i) => (
              <div key={i} className="flex flex-col gap-[10px]">
                <Sk className="h-[13px] w-[80px]" color={color} />
                <Sk className="h-[48px] w-full rounded-[8px]" color={color} />
              </div>
            ))}

            {/* Next / Save button */}
            <div className="flex justify-end">
              <Sk className="h-[44px] w-[100px] rounded-full" color={color} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// TalentEditProfileSkeleton
// 5 sections: personal (expanded), professional, experience, education, social
// ---------------------------------------------------------------------------
export function TalentEditProfileSkeleton() {
  const color = ROLE_COLORS.talent.light;
  return (
    <div className="flex h-screen bg-white">
      <SidebarSkeleton color={color} sections={5} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ActionBarSkeleton color={color} />

        <div className="flex-1 overflow-y-auto px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            {/* Personal — expanded with avatar + fields */}
            <AccordionSectionSkeleton
              color={color}
              expanded
              fieldCount={3}
            />
            {/* Professional */}
            <AccordionSectionSkeleton color={color} />
            {/* Work Experience */}
            <AccordionSectionSkeleton color={color} />
            {/* Education */}
            <AccordionSectionSkeleton color={color} />
            {/* Social Links */}
            <AccordionSectionSkeleton color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EmployerEditProfileSkeleton
// 3 sections: personal (expanded), company details, social links
// ---------------------------------------------------------------------------
export function EmployerEditProfileSkeleton() {
  const color = ROLE_COLORS.recruiter.light;
  return (
    <div className="flex h-screen bg-white">
      <SidebarSkeleton color={color} sections={3} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ActionBarSkeleton color={color} />

        <div className="flex-1 overflow-y-auto px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            <AccordionSectionSkeleton
              color={color}
              expanded
              fieldCount={3}
            />
            <AccordionSectionSkeleton color={color} />
            <AccordionSectionSkeleton color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// MentorEditProfileSkeleton
// 3 sections: personal (expanded), professional, social links
// ---------------------------------------------------------------------------
export function MentorEditProfileSkeleton() {
  const color = ROLE_COLORS.mentor.light;
  return (
    <div className="flex h-screen bg-white">
      <SidebarSkeleton color={color} sections={3} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <ActionBarSkeleton color={color} />

        <div className="flex-1 overflow-y-auto px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            <AccordionSectionSkeleton
              color={color}
              expanded
              fieldCount={3}
            />
            <AccordionSectionSkeleton color={color} />
            <AccordionSectionSkeleton color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// EditOpportunityFormSkeleton
// Sidebar with 4 sections + action bar + 4 accordion cards
// ---------------------------------------------------------------------------
function OpportunitySidebarSkeleton({ color }: { color: string }) {
  return (
    <div className="w-[250px] flex-shrink-0 border-r border-[#E1E4EA] p-6 flex flex-col gap-[22px]">
      <Sk className="h-[14px] w-[60px]" color={color} />
      <div className="flex flex-col gap-[22px]">
        {["w-[70px]", "w-[90px]", "w-[100px]", "w-[130px]"].map((w, i) => (
          <Sk key={i} className={`h-[14px] ${w}`} color={color} />
        ))}
      </div>
    </div>
  );
}

function OpportunityActionBarSkeleton({ color }: { color: string }) {
  return (
    <div className="px-[80px] py-4 border-b border-[#E1E4EA] flex items-center justify-between flex-shrink-0">
      <Sk className="h-[17px] w-[140px]" color={color} />
      <div className="flex items-center gap-3">
        <Sk className="h-[36px] w-[80px] rounded-full" color={color} />
        <Sk className="h-[36px] w-[120px] rounded-full" color={color} />
      </div>
    </div>
  );
}

function OpportunityAccordionSkeleton({
  color,
  expanded = false,
  fieldCount = 0,
}: {
  color: string;
  expanded?: boolean;
  fieldCount?: number;
}) {
  return (
    <div className="border border-gray-300 rounded-[16px] overflow-hidden">
      {/* Header */}
      <div className="px-5 py-4 bg-gray-50 flex items-center justify-between">
        <Sk className="h-[14px] w-[120px]" color={color} />
        <Sk className="h-[14px] w-[14px] rounded-full" color={color} />
      </div>

      {expanded && fieldCount > 0 && (
        <>
          <div className="h-[1px] bg-gray-300" />
          <div className="p-5 flex flex-col gap-5">
            {Array.from({ length: fieldCount }).map((_, i) => (
              <div key={i} className="flex flex-col gap-2">
                <Sk className="h-[14px] w-[80px]" color={color} />
                <Sk className="h-[48px] w-full rounded-[10px]" color={color} />
              </div>
            ))}
            {/* Next button */}
            <div className="flex justify-end">
              <Sk className="h-[40px] w-[80px] rounded-full" color={color} />
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export function EditOpportunityFormSkeleton() {
  const color = ROLE_COLORS.recruiter.light;
  return (
    <div className="flex h-screen bg-white">
      <OpportunitySidebarSkeleton color={color} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <OpportunityActionBarSkeleton color={color} />

        <div className="flex-1 overflow-y-auto px-[80px] pt-[25px] pb-6">
          <div className="max-w-[700px] mx-auto flex flex-col gap-[12px]">
            <OpportunityAccordionSkeleton
              color={color}
              expanded
              fieldCount={4}
            />
            <OpportunityAccordionSkeleton color={color} />
            <OpportunityAccordionSkeleton color={color} />
            <OpportunityAccordionSkeleton color={color} />
          </div>
        </div>
      </div>
    </div>
  );
}
