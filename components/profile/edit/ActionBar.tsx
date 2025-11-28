import Link from "next/link";
import { Button } from "@/components/ui/button";

interface EditProfileActionBarProps {
  onSave?: () => void;
}

export function EditProfileActionBar({ onSave }: EditProfileActionBarProps) {
  return (
    <div className="h-[56px] border-b border-[#E1E4EA] flex items-center justify-end px-[80px] gap-2 bg-white">
      <Link href="/profile">
        <Button
          variant="outline"
          className="h-[40px] px-[24px] rounded-full border border-[#F5F5F5] bg-[#F5F5F5] text-black hover:bg-[#e5e5e5] font-inter-tight text-[13px] font-normal"
        >
          Discard
        </Button>
      </Link>
      <Button
        onClick={onSave}
        className="h-[40px] px-[24px] rounded-full bg-[#5C30FF] text-white hover:bg-[#4a26cc] font-inter-tight text-[13px] font-normal"
      >
        Save Changes
      </Button>
    </div>
  );
}
