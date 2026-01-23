"use client";

import { AlertCircle } from "lucide-react";
import { Button } from "./button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  showDetails?: boolean;
}

export function ErrorState({
  title = "Something went wrong",
  description = "Please try again or contact support if the problem persists.",
  onRetry,
  showDetails = false,
}: ErrorStateProps) {
  return (
    <div className="flex w-full flex-col items-center justify-center gap-7 py-12 min-h-screen bg-gray-50">
      {/* Icon */}
      <AlertCircle className="w-16 h-16 text-red-400" />

      {/* Content */}
      <div className="flex flex-col items-center gap-3 max-w-sm">
        <h3 className="text-lg font-semibold text-gray-900 text-center">
          {title}
        </h3>
        <p className="text-sm text-gray-500 text-center">{description}</p>
      </div>

      {/* Action Button */}
      {onRetry && (
        <Button onClick={onRetry} variant="default" size="sm">
          Try again
        </Button>
      )}

      {/* Support Link */}
      <a
        href="/support"
        className="text-sm text-blue-600 hover:text-blue-700 underline"
      >
        Contact support
      </a>
    </div>
  );
}
