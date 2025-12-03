import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { EditableItem } from "./EditableItem";
import { Button } from "@/components/ui/button";

export interface Education {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  description: string;
}

interface EducationSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  education: Education[];
  editingIndex: number | null;
  onEditingChange: (index: number | null) => void;
  onUpdate: (index: number, field: string, value: string) => void;
  onAdd: () => void;
  sectionRef: (el: HTMLDivElement | null) => void;
}

export function EducationSection({
  isOpen,
  onToggle,
  education,
  editingIndex,
  onEditingChange,
  onUpdate,
  onAdd,
  sectionRef,
}: EducationSectionProps) {
  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader title="Education" isOpen={isOpen} onToggle={onToggle} />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {education.map((edu, index) => (
              <EditableItem
                key={edu.id || index}
                index={index}
                isEditing={editingIndex === index}
                onEdit={() => onEditingChange(index)}
                onDone={() => onEditingChange(null)}
                title={edu.degree}
                subtitle={edu.school}
                metadata={[
                  edu.field,
                  edu.startDate && edu.endDate
                    ? `${edu.startDate} - ${edu.endDate}`
                    : edu.startDate
                      ? `From ${edu.startDate}`
                      : "No dates set",
                ]}
                editingContent={
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        School/University
                      </label>
                      <input
                        type="text"
                        value={edu.school}
                        onChange={(e) =>
                          onUpdate(index, "school", e.target.value)
                        }
                        placeholder="e.g., University of Lagos"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Degree
                      </label>
                      <input
                        type="text"
                        value={edu.degree}
                        onChange={(e) =>
                          onUpdate(index, "degree", e.target.value)
                        }
                        placeholder="e.g., Bachelor, Master"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Field of Study
                      </label>
                      <input
                        type="text"
                        value={edu.field}
                        onChange={(e) =>
                          onUpdate(index, "field", e.target.value)
                        }
                        placeholder="e.g., Computer Science"
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
                          value={edu.startDate}
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
                          value={edu.endDate}
                          onChange={(e) =>
                            onUpdate(index, "endDate", e.target.value)
                          }
                          className="h-[48px] px-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Description
                      </label>
                      <textarea
                        value={edu.description}
                        onChange={(e) =>
                          onUpdate(index, "description", e.target.value)
                        }
                        placeholder="Additional details about your studies"
                        className="min-h-[80px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
                      />
                    </div>
                  </div>
                }
                summaryContent={null}
              />
            ))}

            <Button
              onClick={onAdd}
              className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal"
            >
              + Add Education
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
