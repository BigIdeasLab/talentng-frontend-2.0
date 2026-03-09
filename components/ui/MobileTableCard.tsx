"use client";

import React from "react";
import { MoreVertical } from "lucide-react";
import { cn } from "@/lib/utils";
import { TOUCH_TARGET } from "@/lib/constants/touch-targets";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

/**
 * Field definition for MobileTableCard
 */
export interface CardField {
  /** Unique key for the field */
  key: string;
  /** Display label for the field */
  label: string;
  /** Value to display */
  value: React.ReactNode;
  /** Optional className for the field container */
  className?: string;
}

/**
 * Action definition for card actions
 */
export interface CardAction {
  /** Unique key for the action */
  key: string;
  /** Display label for the action */
  label: string;
  /** Click handler for the action */
  onClick: () => void;
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Optional className for styling */
  className?: string;
}

export interface MobileTableCardProps {
  /** Array of fields to display as labeled key-value pairs */
  fields: CardField[];
  /** Optional array of actions for the dropdown menu */
  actions?: CardAction[];
  /** Optional row number to display */
  rowNumber?: number;
  /** Optional className for the card container */
  className?: string;
  /** Optional custom header content */
  header?: React.ReactNode;
  /** Optional custom footer content (replaces actions dropdown) */
  footer?: React.ReactNode;
}

/**
 * MobileTableCard - A mobile-optimized card component for displaying table data
 * 
 * Features:
 * - Displays table data as labeled key-value pairs
 * - Includes action dropdown menu at card bottom
 * - Touch-friendly tap targets (44x44px minimum)
 * - Card styling with proper spacing and borders
 * - Flexible field layout (2-column grid by default)
 * 
 * Requirements: 4.1, 4.5, 4.6, 18.1
 */
export function MobileTableCard({
  fields,
  actions = [],
  rowNumber,
  className,
  header,
  footer,
}: MobileTableCardProps) {
  return (
    <div
      className={cn(
        "border border-[#E1E4EA] rounded-[16px] p-4",
        className
      )}
    >
      <div className="space-y-3">
        {/* Optional header */}
        {header && <div>{header}</div>}

        {/* Row number if provided */}
        {rowNumber !== undefined && (
          <div className="font-inter-tight text-[13px] font-medium text-black">
            #{rowNumber}
          </div>
        )}

        {/* Data fields in 2-column grid */}
        <div className="grid grid-cols-2 gap-3">
          {fields.map((field) => (
            <div key={field.key} className={field.className}>
              <div className="font-inter-tight text-[11px] text-[#525866] mb-1">
                {field.label}
              </div>
              <div className="font-inter-tight text-[12px] text-black">
                {field.value || "-"}
              </div>
            </div>
          ))}
        </div>

        {/* Optional footer or actions dropdown */}
        {footer ? (
          <div className="pt-2 border-t border-[#E1E4EA]">{footer}</div>
        ) : actions.length > 0 ? (
          <div className="pt-2 border-t border-[#E1E4EA]">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors font-inter-tight text-[13px] font-medium text-black"
                  style={{
                    minHeight: `${TOUCH_TARGET.minSize}px`,
                  }}
                >
                  <span>Actions</span>
                  <MoreVertical className="w-4 h-4" />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                {actions.map((action) => (
                  <DropdownMenuItem
                    key={action.key}
                    onClick={action.onClick}
                    className={cn(
                      "cursor-pointer font-inter-tight text-[13px]",
                      action.className
                    )}
                    style={{
                      minHeight: `${TOUCH_TARGET.minSize}px`,
                    }}
                  >
                    {action.icon && (
                      <span className="mr-2">{action.icon}</span>
                    )}
                    {action.label}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : null}
      </div>
    </div>
  );
}
