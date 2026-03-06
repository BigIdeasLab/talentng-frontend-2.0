"use client";

import { ErrorState } from "@/components/ui/error-state";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function BusinessError({ error, reset }: ErrorProps) {
  return (
    <ErrorState
      message="Something went wrong. Please try again."
      onRetry={reset}
    />
  );
}
