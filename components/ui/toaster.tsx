"use client";

import { useToast } from "@/hooks";
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
} from "@/components/ui/toast";
import { cn } from "@/lib/utils";
import { CheckCircle2, AlertCircle, Info, LucideIcon } from "lucide-react";

const variantIcons: Record<string, LucideIcon> = {
  default: Info,
  success: CheckCircle2,
  destructive: AlertCircle,
};

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({
        id,
        title,
        description,
        action,
        variant,
        ...props
      }) {
        const Icon = variantIcons[variant || "default"] || Info;
        const iconColor =
          variant === "success"
            ? "text-emerald-500"
            : variant === "destructive"
              ? "text-red-500"
              : "text-[#5C30FF]";

        return (
          <Toast key={id} variant={variant} {...props}>
            <div className="flex gap-4">
              <div className={cn("mt-0.5 shrink-0", iconColor)}>
                <Icon className="h-5 w-5" />
              </div>
              <div className="grid gap-1">
                {title && <ToastTitle>{title}</ToastTitle>}
                {description && (
                  <ToastDescription>{description}</ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
