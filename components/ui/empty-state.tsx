"use client";

import Image from "next/image";
import { LucideIcon } from "lucide-react";
import { Button } from "./button";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
}: EmptyStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-7 py-12 min-h-[320px]">
      {/* Icon or Illustration */}
      {Icon ? (
        <Icon className="w-16 h-16 text-gray-300" />
      ) : (
        <Image
          src="https://api.builder.io/api/v1/image/assets/TEMP/5b68bbcc9e62784e98d154af2628e5ba9b8066c3?width=432"
          alt="Empty state"
          width={160}
          height={160}
          className="w-40 h-40"
          unoptimized
        />
      )}

      {/* Content */}
      <div className="flex flex-col items-center gap-3 max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          {title}
        </h3>
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </div>

      {/* Action Button */}
      {action && (
        <Button onClick={action.onClick} variant="default" size="sm">
          {action.label}
        </Button>
      )}
    </div>
  );
}
