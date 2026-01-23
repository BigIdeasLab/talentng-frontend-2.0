"use client";

import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  label?: string;
  size?: "sm" | "md" | "lg";
}

export function LoadingSpinner({
  label = "Loading",
  size = "md",
}: LoadingSpinnerProps) {
  const sizeMap = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8",
  };

  return (
    <div className="flex flex-col items-center justify-center gap-2 p-4">
      <Loader2 className={`${sizeMap[size]} animate-spin text-[#5C30FF]`} />
      {label && <p className="text-sm text-gray-500">{label}</p>}
    </div>
  );
}
