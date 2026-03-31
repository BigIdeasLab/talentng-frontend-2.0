'use client';

import { ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface VerifiedBadgeProps {
  size?: 'sm' | 'md' | 'lg';
  showTooltip?: boolean;
  className?: string;
}

export function VerifiedBadge({
  size = 'md',
  showTooltip = true,
  className,
}: VerifiedBadgeProps) {
  const sizeConfig = {
    sm: {
      container: 'px-2 py-0.5 text-xs gap-1',
      icon: 'h-3 w-3',
    },
    md: {
      container: 'px-2.5 py-1 text-sm gap-1.5',
      icon: 'h-4 w-4',
    },
    lg: {
      container: 'px-3 py-1.5 text-base gap-2',
      icon: 'h-5 w-5',
    },
  };

  const config = sizeConfig[size];

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-full bg-blue-100 text-blue-700 font-medium',
        config.container,
        className
      )}
      role="status"
      aria-label="Verified business"
      title={showTooltip ? 'This business has been verified by TalentNG' : undefined}
    >
      <ShieldCheck className={cn(config.icon, 'flex-shrink-0')} aria-hidden="true" />
      <span>Verified</span>
    </div>
  );
}
