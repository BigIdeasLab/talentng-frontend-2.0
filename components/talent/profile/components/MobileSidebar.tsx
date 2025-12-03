"use client";

import { useState } from "react";
import { Menu } from "lucide-react";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
  SheetClose,
} from "@/components/ui/sheet";
import { TalentSidebar as Sidebar } from "@/components/layouts/sidebars/TalentSidebar";

interface MobileSidebarProps {
  activeItem?: string;
  onItemSelect?: (item: string) => void;
}

export function MobileSidebar({
  activeItem,
  onItemSelect,
}: MobileSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const handleItemSelect = (item: string) => {
    onItemSelect?.(item);
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className="md:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors">
          <Menu className="w-6 h-6 text-black" />
        </button>
      </SheetTrigger>
      <SheetContent side="left" className="p-0 w-[271px]">
        <div className="h-full overflow-y-auto">
          <Sidebar
            activeItem={activeItem}
            onItemSelect={handleItemSelect}
            onMobileClose={() => setIsOpen(false)}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
}
