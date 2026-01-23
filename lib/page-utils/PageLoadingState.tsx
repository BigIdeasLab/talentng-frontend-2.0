/**
 * Reusable loading state component for pages
 * Consistent spinner and loading UI across all pages
 */

import { Spinner } from "@/components/ui/spinner";

export interface PageLoadingStateProps {
  /** Optional loading message to display */
  message?: string;

  /** Optional custom className for the container */
  className?: string;
}

/**
 * Page-level loading state component
 * Use when a page is fetching initial data
 */
export function PageLoadingState({
  message = "Loading...",
  className = "min-h-screen",
}: PageLoadingStateProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <Spinner size="lg" className="text-blue-600" />
        {message && (
          <p className="text-sm text-gray-600 animate-pulse">{message}</p>
        )}
      </div>
    </div>
  );
}
