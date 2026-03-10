import { Button } from "@/components/ui/button";

interface EditProfileActionBarProps {
  onSave?: () => void;
  isLoading?: boolean;
  hasUnsavedChanges?: boolean;
  onDiscard?: () => void;
}

export function EditProfileActionBar({
  onSave,
  isLoading,
  hasUnsavedChanges,
  onDiscard,
}: EditProfileActionBarProps) {
  return (
    <div className="h-[56px] border-b border-[#E1E4EA] flex items-center justify-end px-4 lg:px-[80px] gap-2 bg-white">
      <Button
        variant="outline"
        disabled={isLoading}
        onClick={onDiscard}
        className="h-[44px] min-h-[44px] px-[24px] rounded-full border border-[#F5F5F5] bg-[#F5F5F5] text-black hover:bg-[#e5e5e5] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-normal"
      >
        Discard
      </Button>
      <Button
        onClick={onSave}
        disabled={isLoading || !hasUnsavedChanges}
        className="h-[44px] min-h-[44px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] disabled:opacity-50 disabled:cursor-not-allowed font-inter-tight text-[13px] font-normal"
      >
        {isLoading ? "Saving..." : "Save Changes"}
      </Button>
    </div>
  );
}
