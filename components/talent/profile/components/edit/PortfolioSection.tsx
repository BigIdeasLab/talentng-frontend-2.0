import { SmoothCollapse } from "@/components/SmoothCollapse";
import { SectionHeader } from "./SectionHeader";
import { EditableItem } from "./EditableItem";
import { Button } from "@/components/ui/button";

interface PortfolioItem {
  id: string;
  title: string;
  description: string;
  url: string;
  image: string;
  technologies: string[];
}

interface PortfolioSectionProps {
  isOpen: boolean;
  onToggle: () => void;
  portfolioItems: PortfolioItem[];
  editingIndex: number | null;
  onEditingChange: (index: number | null) => void;
  onAddPortfolioItem?: () => void;
  onUpdatePortfolioItem?: (index: number, field: string, value: string) => void;
  onRemovePortfolioItem?: (index: number) => void;
  sectionRef: (el: HTMLDivElement | null) => void;
  onNext: () => void;
}

export function PortfolioSection({
  isOpen,
  onToggle,
  portfolioItems,
  editingIndex,
  onEditingChange,
  onAddPortfolioItem,
  onUpdatePortfolioItem,
  onRemovePortfolioItem,
  sectionRef,
  onNext,
}: PortfolioSectionProps) {
  return (
    <div
      ref={sectionRef}
      className="border border-[#E1E4EA] rounded-[16px] bg-white"
    >
      <SectionHeader title="Portfolio" isOpen={isOpen} onToggle={onToggle} />

      <SmoothCollapse isOpen={isOpen}>
        <>
          <div className="h-[1px] bg-[#E1E4EA]" />
          <div className="px-[16px] py-[18px] flex flex-col gap-[16px]">
            {/* Portfolio Items List */}
            {portfolioItems.map((item, index) => (
              <EditableItem
                key={item.id || index}
                index={index}
                isEditing={editingIndex === index}
                onEdit={() => onEditingChange(index)}
                onDone={() => onEditingChange(null)}
                title={item.title || "Untitled Project"}
                subtitle={item.url}
                metadata={[item.description]}
                editingContent={
                  <div className="flex flex-col gap-[16px]">
                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Title
                      </label>
                      <input
                        type="text"
                        value={item.title}
                        onChange={(e) =>
                          onUpdatePortfolioItem?.(index, "title", e.target.value)
                        }
                        placeholder="Project title"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Description
                      </label>
                      <textarea
                        value={item.description}
                        onChange={(e) =>
                          onUpdatePortfolioItem?.(
                            index,
                            "description",
                            e.target.value,
                          )
                        }
                        placeholder="Project description"
                        className="min-h-[80px] px-[12px] py-[12px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent resize-none"
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Project URL
                      </label>
                      <input
                        type="url"
                        value={item.url}
                        onChange={(e) =>
                          onUpdatePortfolioItem?.(index, "url", e.target.value)
                        }
                        placeholder="https://example.com"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    <div className="flex flex-col gap-[10px]">
                      <label className="text-[13px] font-normal text-black font-inter-tight">
                        Image URL
                      </label>
                      <input
                        type="url"
                        value={item.image}
                        onChange={(e) =>
                          onUpdatePortfolioItem?.(
                            index,
                            "image",
                            e.target.value,
                          )
                        }
                        placeholder="https://example.com/image.jpg"
                        className="px-[12px] py-[18px] border border-[#ADD8F7] bg-[#F0F7FF] rounded-[8px] text-[13px] font-normal text-black font-inter-tight focus:outline-none focus:ring-2 focus:ring-[#5C30FF] focus:border-transparent"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        onClick={() => onRemovePortfolioItem?.(index)}
                        className="text-[12px] font-normal text-red-500 hover:text-red-700 transition-colors"
                      >
                        Remove Item
                      </button>
                    </div>
                  </div>
                }
                summaryContent={null}
              />
            ))}

            <div className="p-[12px] bg-[#F0F7FF] border border-[#ADD8F7] rounded-[8px]">
              <p className="text-[12px] font-normal text-black/70 font-inter-tight">
                Portfolio items can be added from your gallery or external
                links. You can showcase your best work, projects, and designs
                here.
              </p>
            </div>

            <Button
              onClick={() => {
                onAddPortfolioItem?.();
                onEditingChange?.(portfolioItems.length);
              }}
              className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal"
            >
              + Add Portfolio Item
            </Button>

            <div className="flex justify-end">
              <Button
                type="button"
                onClick={onNext}
                className="h-[44px] px-[32px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[13px] font-normal"
              >
                Next
              </Button>
            </div>
          </div>
        </>
      </SmoothCollapse>
    </div>
  );
}
