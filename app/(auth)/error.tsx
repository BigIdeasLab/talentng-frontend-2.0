"use client";

import { ErrorState } from "@/components/ui/error-state";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AuthError({ error, reset }: ErrorProps) {
  return (
    <ErrorState
      title="Authentication Error"
      description="Something went wrong during authentication. Please try again."
      onRetry={reset}
    />
  );
}
