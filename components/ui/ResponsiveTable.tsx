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
import { useBreakpoint } from "@/hooks/useBreakpoint";

/**
 * Column definition for ResponsiveTable
 */
export interface ColumnDef<T> {
  /** Unique key for the column */
  key: string;
  /** Display label for the column header */
  label: string;
  /** Whether this column is essential (shown on tablet) */
  essential?: boolean;
  /** Custom render function for the cell content */
  render?: (item: T, index: number) => React.ReactNode;
  /** Accessor function to get the value from the item */
  accessor?: (item: T) => string | number | React.ReactNode;
  /** CSS class for the column */
  className?: string;
  /** CSS class for the header */
  headerClassName?: string;
}

/**
 * Action definition for row actions
 */
export interface RowAction<T> {
  /** Unique key for the action */
  key: string;
  /** Display label for the action */
  label: string;
  /** Click handler for the action */
  onClick: (item: T) => void;
  /** Optional icon component */
  icon?: React.ReactNode;
  /** Optional className for styling */
  className?: string;
}

export interface ResponsiveTableProps<T> {
  /** Array of data items to display */
  data: T[];
  /** Column definitions */
  columns: ColumnDef<T>[];
  /** Optional custom mobile card renderer */
  mobileCardRenderer?: (item: T, index: number) => React.ReactNode;
  /** Optional row actions */
  actions?: RowAction<T>[];
  /** Optional empty state message */
  emptyMessage?: string;
  /** Optional className for the table container */
  className?: string;
  /** Optional key extractor function */
  keyExtractor?: (item: T, index: number) => string;
  /** Show row numbers */
  showRowNumbers?: boolean;
}

/**
 * ResponsiveTable - A responsive table component that adapts to different viewport sizes
 * 
 * Responsive behavior:
 * - Desktop (≥ 1024px): Traditional table with all columns
 * - Tablet (768px - 1023px): Horizontal scrolling with essential columns only
 * - Mobile (< 768px): Card-based layout with table headers as labels
 * 
 * Features:
 * - Dropdown menu for row actions on mobile
 * - Custom mobile card renderer via prop
 * - Touch-friendly tap targets (44x44px minimum)
 * - Flexible column configuration
 * 
 * Requirements: 4.1, 4.2, 4.3, 4.4, 4.5, 4.6
 */
export function ResponsiveTable<T>({
  data,
  columns,
  mobileCardRenderer,
  actions = [],
  emptyMessage = "No data found",
  className,
  keyExtractor,
  showRowNumbers = false,
}: ResponsiveTableProps<T>) {
  const breakpoint = useBreakpoint();
  const isMobile = breakpoint === "xs" || breakpoint === "sm";
  const isTablet = breakpoint === "md";

  // Filter columns based on breakpoint
  const visibleColumns = React.useMemo(() => {
    if (isMobile) {
      // On mobile, we don't show the table, we show cards
      return columns;
    }
    if (isTablet) {
      // On tablet, show only essential columns
      return columns.filter((col) => col.essential !== false);
    }
    // On desktop, show all columns
    return columns;
  }, [columns, isMobile, isTablet]);

  // Default key extractor
  const getKey = (item: T, index: number): string => {
    if (keyExtractor) {
      return keyExtractor(item, index);
    }
    // Try to use 'id' property if it exists
    if (item && typeof item === "object" && "id" in item) {
      return String((item as any).id);
    }
    return String(index);
  };

  // Render cell content
  const renderCell = (column: ColumnDef<T>, item: T, index: number) => {
    if (column.render) {
      return column.render(item, index);
    }
    if (column.accessor) {
      return column.accessor(item);
    }
    // Try to access the property directly
    if (item && typeof item === "object" && column.key in item) {
      return String((item as any)[column.key]);
    }
    return "-";
  };

  // Mobile Card View
  if (isMobile) {
    return (
      <div className={cn("space-y-3", className)}>
        {data.length === 0 ? (
          <div className="px-3 py-9 text-center border border-[#E1E4EA] rounded-[16px]">
            <p className="font-inter-tight text-[13px] text-gray-500">
              {emptyMessage}
            </p>
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={getKey(item, index)}
              className="border border-[#E1E4EA] rounded-[16px] p-4"
            >
              {mobileCardRenderer ? (
                mobileCardRenderer(item, index)
              ) : (
                <div className="space-y-3">
                  {/* Row number if enabled */}
                  {showRowNumbers && (
                    <div className="font-inter-tight text-[13px] font-medium text-black">
                      #{index + 1}
                    </div>
                  )}

                  {/* Data fields */}
                  <div className="grid grid-cols-2 gap-3">
                    {columns.map((column) => (
                      <div key={column.key}>
                        <div className="font-inter-tight text-[11px] text-[#525866] mb-1">
                          {column.label}
                        </div>
                        <div className="font-inter-tight text-[12px] text-black">
                          {renderCell(column, item, index)}
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Actions dropdown */}
                  {actions.length > 0 && (
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
                              onClick={() => action.onClick(item)}
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
                  )}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    );
  }

  // Tablet and Desktop Table View
  return (
    <div
      className={cn(
        "border border-[#E1E4EA] rounded-[16px] overflow-hidden",
        isTablet && "overflow-x-auto",
        className
      )}
    >
      {/* Table Header */}
      <div className="px-3 py-4 border-b border-[#E1E4EA] bg-gray-50/50">
        <div
          className={cn(
            "grid gap-3 items-center",
            isTablet && "min-w-max"
          )}
          style={{
            gridTemplateColumns: `${showRowNumbers ? "50px " : ""}${visibleColumns
              .map(() => "minmax(100px, 1fr)")
              .join(" ")}${actions.length > 0 ? " 120px" : ""}`,
          }}
        >
          {showRowNumbers && (
            <div className="font-inter-tight text-[13px] font-medium text-[#525866]">
              S/N
            </div>
          )}
          {visibleColumns.map((column) => (
            <div
              key={column.key}
              className={cn(
                "font-inter-tight text-[13px] font-medium text-[#525866]",
                column.headerClassName
              )}
            >
              {column.label}
            </div>
          ))}
          {actions.length > 0 && (
            <div className="font-inter-tight text-[13px] font-medium text-[#525866] text-right">
              Actions
            </div>
          )}
        </div>
      </div>

      {/* Table Body */}
      <div className="divide-y divide-[#E1E4EA]">
        {data.length === 0 ? (
          <div className="px-3 py-9 text-center">
            <p className="font-inter-tight text-[13px] text-gray-500">
              {emptyMessage}
            </p>
          </div>
        ) : (
          data.map((item, index) => (
            <div
              key={getKey(item, index)}
              className="px-3 py-4 hover:bg-gray-50/50 transition-colors"
            >
              <div
                className={cn(
                  "grid gap-3 items-center",
                  isTablet && "min-w-max"
                )}
                style={{
                  gridTemplateColumns: `${showRowNumbers ? "50px " : ""}${visibleColumns
                    .map(() => "minmax(100px, 1fr)")
                    .join(" ")}${actions.length > 0 ? " 120px" : ""}`,
                }}
              >
                {showRowNumbers && (
                  <div className="font-inter-tight text-[13px] font-normal text-black">
                    {index + 1}.
                  </div>
                )}
                {visibleColumns.map((column) => (
                  <div
                    key={column.key}
                    className={cn(
                      "font-inter-tight text-[13px] font-normal text-black",
                      column.className
                    )}
                  >
                    {renderCell(column, item, index)}
                  </div>
                ))}
                {actions.length > 0 && (
                  <div className="flex items-center justify-end gap-2">
                    {actions.map((action) => (
                      <button
                        key={action.key}
                        onClick={() => action.onClick(item)}
                        className={cn(
                          "px-3 py-1.5 rounded-full font-inter-tight text-[12px] font-medium transition-colors whitespace-nowrap",
                          action.className ||
                            "bg-[#181B25] text-white hover:bg-[#2a2d35]"
                        )}
                        style={{
                          minHeight: `${TOUCH_TARGET.minSize}px`,
                        }}
                      >
                        {action.icon && (
                          <span className="mr-1">{action.icon}</span>
                        )}
                        {action.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
