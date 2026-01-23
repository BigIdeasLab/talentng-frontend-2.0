"use client";

import { AlertCircle } from "lucide-react";

interface FormErrorMessageProps {
  error?: string | null;
}

export function FormErrorMessage({ error }: FormErrorMessageProps) {
  if (!error) return null;

  return (
    <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
      <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
      <p className="text-sm text-red-800">{error}</p>
    </div>
  );
}
