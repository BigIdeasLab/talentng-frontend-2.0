/**
 * Rate Limit Notification Component
 * Shows user-friendly rate limiting messages with countdown timers
 */

import React, { useState, useEffect } from 'react';
import { AlertTriangle, Clock, Shield } from 'lucide-react';
import { cn } from '@/lib/utils';
import { 
  parseRateLimitError, 
  getRateLimitMessage, 
  createRateLimitCountdown,
  formatWaitTime,
  type RateLimitInfo 
} from '@/lib/utils/rate-limit-handler';

interface RateLimitNotificationProps {
  error: any;
  onRetryEnabled?: () => void;
  className?: string;
}

export function RateLimitNotification({ 
  error, 
  onRetryEnabled, 
  className 
}: RateLimitNotificationProps) {
  const [rateLimitInfo, setRateLimitInfo] = useState<RateLimitInfo>(() => 
    parseRateLimitError(error)
  );
  const [remainingTime, setRemainingTime] = useState<number | null>(null);
  const [formattedTime, setFormattedTime] = useState<string>('');

  useEffect(() => {
    const info = parseRateLimitError(error);
    setRateLimitInfo(info);

    if (info.isRateLimited && info.waitTime) {
      setRemainingTime(info.waitTime);
      
      const cleanup = createRateLimitCountdown(
        info.waitTime,
        (remaining, formatted) => {
          setRemainingTime(remaining);
          setFormattedTime(formatted);
        },
        () => {
          setRemainingTime(0);
          setFormattedTime('');
          onRetryEnabled?.();
        }
      );

      return cleanup;
    }
  }, [error, onRetryEnabled]);

  if (!rateLimitInfo.isRateLimited) {
    return null;
  }

  const getIcon = () => {
    switch (rateLimitInfo.type) {
      case 'account_lockout':
        return <Shield className="h-5 w-5 text-red-500" />;
      case 'throttler':
        return <Clock className="h-5 w-5 text-blue-500" />;
      default:
        return <AlertTriangle className="h-5 w-5 text-orange-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (rateLimitInfo.type) {
      case 'account_lockout':
        return 'bg-red-50 border-red-200';
      case 'throttler':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-orange-50 border-orange-200';
    }
  };

  const getTextColor = () => {
    switch (rateLimitInfo.type) {
      case 'account_lockout':
        return 'text-red-800';
      case 'throttler':
        return 'text-blue-800';
      default:
        return 'text-orange-800';
    }
  };

  return (
    <div className={cn(
      'rounded-lg border p-4 flex items-start gap-3',
      getBackgroundColor(),
      className
    )}>
      {getIcon()}
      
      <div className="flex-1 min-w-0">
        <div className={cn('font-medium text-sm', getTextColor())}>
          {rateLimitInfo.type === 'account_lockout' && 'Account Temporarily Locked'}
          {rateLimitInfo.type === 'throttler' && 'Rate Limit Exceeded'}
          {rateLimitInfo.type === 'unknown' && 'Request Limit Reached'}
        </div>
        
        <div className={cn('text-sm mt-1', getTextColor())}>
          {remainingTime && remainingTime > 0 ? (
            <>
              {getRateLimitMessage(rateLimitInfo).replace(
                formatWaitTime(rateLimitInfo.waitTime || 0),
                formattedTime
              )}
            </>
          ) : (
            rateLimitInfo.message
          )}
        </div>

        {remainingTime && remainingTime > 0 && (
          <div className="mt-2 flex items-center gap-2">
            <Clock className="h-4 w-4" />
            <span className="text-sm font-mono">
              {formattedTime} remaining
            </span>
          </div>
        )}

        {rateLimitInfo.type === 'account_lockout' && (
          <div className={cn('text-xs mt-2', getTextColor())}>
            <strong>Security Notice:</strong> Your account has been temporarily locked 
            to protect against unauthorized access attempts.
          </div>
        )}
      </div>
    </div>
  );
}

/**
 * Hook for handling rate limit errors in forms
 */
export function useRateLimitHandler() {
  const [rateLimitError, setRateLimitError] = useState<any>(null);
  const [isRateLimited, setIsRateLimited] = useState(false);

  const handleError = (error: any) => {
    const rateLimitInfo = parseRateLimitError(error);
    
    if (rateLimitInfo.isRateLimited) {
      setRateLimitError(error);
      setIsRateLimited(true);
      return true; // Indicates this was a rate limit error
    }
    
    return false; // Not a rate limit error
  };

  const clearRateLimit = () => {
    setRateLimitError(null);
    setIsRateLimited(false);
  };

  return {
    rateLimitError,
    isRateLimited,
    handleError,
    clearRateLimit
  };
}