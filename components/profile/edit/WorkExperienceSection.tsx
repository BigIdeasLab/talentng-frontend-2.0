import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { EditableItem } from "./EditableItem";
import { Button } from "@/components/ui/button";

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  description: string;
  isCurrently: boolean;
}

interface WorkExperienceSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  experiences: Experience[];
  editingIndex: number | null;
  onEditingChange: (index: number | null) => void;
  onUpdate: (index: number, field: string, value: string | boolean) => void;
  onAdd: () => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}

export function WorkExperienceSection({
  isOpen,
  onToggle,
  experiences,
  editingIndex,
  onEditingChange,
  onUpdate,
  onAdd,
  sectionRef,
}: WorkExperienceSectionProps) {
  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader
        title="Work Experience"
        isOpen={isOpen}
        onToggle={onToggle}
      />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {experiences.map((exp, index) => (
              <EditableItem
                key={exp.id || index}
                index={index}
                isEditing={editingIndex === index}
                onEdit={() => onEditingChange(index)}
                onDone={() => onEditingChange(null)}
                title={exp.position}
                subtitle={exp.company}
                metadata={[
                  exp.startDate && exp.endDate
                    ? `${exp.startDate} - ${exp.endDate}`
                    : exp.startDate
                      ? `From ${exp.startDate}`
                      : "No dates set",
                ]}
                editingContent={
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Position
                      </label>
                      <input
                        type="text"
                        value={exp.position}
                        onChange={(e) =>
                          onUpdate(index, "position", e.target.value)
                        }
                        placeholder="e.g., Senior UI/UX Designer"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Company
                      </label>
                      <input
                        type="text"
                        value={exp.company}
                        onChange={(e) =>
                          onUpdate(index, "company", e.target.value)
                        }
                        placeholder="Company name"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    <div className="flex gap-[10px]">
                      <div className="flex-1 flex flex-col gap-[10px]">
                        <label className="text-[13px] font-normal text-black font-inter-tight">
                          Start Date
                        </label>
                        <input
                          type="date"
                          value={exp.startDate}
                          onChange={(e) =>
                            onUpdate(index, "startDate", e.target.value)
                          }
                          className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        />
                      </div>
                      <div className="flex-1 flex flex-col gap-[10px]">
                        <label className="text-[13px] font-normal text-black font-inter-tight">
                          End Date
                        </label>
                        <input
                          type="date"
                          value={exp.endDate}
                          onChange={(e) =>
                            onUpdate(index, "endDate", e.target.value)
                          }
                          disabled={exp.isCurrently}
                          className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent disabled:opacity-50"
                        />
                      </div>
                    </div>

                    <div className="flex items-center gap-[10px]">
                      <input
                        type="checkbox"
                        checked={exp.isCurrently}
                        onChange={(e) =>
                          onUpdate(index, "isCurrently", e.target.checked)
                        }
                        className="w-4 h-4 rounded border border-[#ADD8F7]"
                      />
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        I currently work here
                      </label>
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Description
                      </label>
                      <textarea
                        value={exp.description}
                        onChange={(e) =>
                          onUpdate(index, "description", e.target.value)
                        }
                        placeholder="Describe your responsibilities and achievements"
                        className="min-h-[80px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                }
                summaryContent={
                  <p className="text-[12px] font-normal text-[#898989] font-inter-tight">
                    {exp.description.substring(0, 100)}
                    {exp.description.length > 100 ? "..." : ""}
                  </p>
                }
              />
            ))}

            <Button
              onClick={onAdd}
              className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal"
            >
              + Add Experience
            </Button>

            <div className="flex justify-end">
              <Button className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal">
                Next
              </Button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}
