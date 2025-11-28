import { SmoothCollapse } from "@/components/SmoothCollapse";
import { Button } from "@/components/ui/button";

export interface EditableItemProps {
  index: number;
  isEditing: boolean;
  onEdit: () => void;
  onDone: () => void;
  title: string;
  subtitle?: string;
  metadata?: string[];
  editingContent: React.ReactNode;
  summaryContent: React.ReactNode;
}

export function EditableItem({
  isEditing,
  onEdit,
  onDone,
  title,
  subtitle,
  metadata,
  editingContent,
  summaryContent,
}: EditableItemProps) {
  return (
    <div className="pb-[16px] border-b border-[#E1E4EA] last:border-0 last:pb-0">
      <SmoothCollapse isOpen={isEditing}>
        <div className="flex flex-col gap-[16px] px-[16px] py-[16px]">
          {editingContent}

          {/* Done Button */}
          <div className="flex justify-end gap-[10px]">
            <Button
              onClick={onDone}
              className="h-[40px] px-[24px] rounded-full bg-[#181B25] text-white hover:bg-[#2a2f3a] font-inter-tight text-[12px] font-normal"
            >
              Done
            </Button>
          </div>
        </div>
      </SmoothCollapse>

      {!isEditing && (
        // SUMMARY VIEW
        <div className="flex items-start justify-between gap-[16px]">
          <div className="flex-1 flex flex-col gap-[8px]">
            <h3 className="text-[14px] font-semibold text-black font-inter-tight">
              {title}
            </h3>
            {subtitle && (
              <p className="text-[13px] font-normal text-[#525866] font-inter-tight">
                {subtitle}
              </p>
            )}
            {metadata?.map((item, idx) => (
              <p
                key={idx}
                className="text-[12px] font-normal text-[#898989] font-inter-tight"
              >
                {item}
              </p>
            ))}
            {summaryContent}
          </div>
          <Button
            onClick={onEdit}
            className="h-[36px] px-[16px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[12px] font-normal"
          >
            Edit
          </Button>
        </div>
      )}
    </div>
  );
}
