import { useState, useCallback, useRef } from "react";
import { format, addDays } from "date-fns";
import { getMentorBookingSlots } from "@/lib/api/mentorship";

interface AvailabilityDay {
  date: string;
  day: string;
  fullDate: string;
  slots: { startTime: string; endTime: string }[];
}

interface AvailabilityCache {
  [mentorId: string]: {
    data: AvailabilityDay[];
    timestamp: number;
    isLoading: boolean;
  };
}

const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useAvailabilityPrefetch() {
  const [cache, setCache] = useState<AvailabilityCache>({});
  const prefetchTimeouts = useRef<{ [mentorId: string]: NodeJS.Timeout }>({});

  const prefetchAvailability = useCallback(async (mentorId: string) => {
    if (!mentorId) return;

    const now = Date.now();
    const cached = cache[mentorId];

    // Return cached data if it's fresh and not loading
    if (cached && (now - cached.timestamp) < CACHE_DURATION && !cached.isLoading) {
      return cached.data;
    }

    // Don't start new request if already loading
    if (cached?.isLoading) {
      return cached.data;
    }

    // Mark as loading
    setCache(prev => ({
      ...prev,
      [mentorId]: {
        data: cached?.data || [],
        timestamp: cached?.timestamp || now,
        isLoading: true,
      }
    }));

    try {
      const startDate = format(new Date(), "yyyy-MM-dd");
      const endDate = format(addDays(new Date(), 14), "yyyy-MM-dd");

      const data = await getMentorBookingSlots(mentorId, {
        startDate,
        endDate,
      });

      const raw = data as unknown as Record<string, unknown>;
      const flatSlots = (
        (raw?.slots ?? raw?.availableSlots ?? []) as {
          date: string;
          startTime: string;
          endTime: string;
        }[]
      ).filter((s) => s.date);

      const todayStr = format(new Date(), "yyyy-MM-dd");
      const currentTime = new Date();

      // Filter to only include future slots
      const futureSlots = flatSlots.filter((s) => {
        if (s.date < todayStr) {
          return false;
        }
        if (s.date === todayStr) {
          const slotTime = new Date(`${s.date}T${s.startTime}`);
          return slotTime > currentTime;
        }
        return true;
      });

      const grouped = new Map<
        string,
        { startTime: string; endTime: string }[]
      >();
      for (const slot of futureSlots) {
        const existing = grouped.get(slot.date) || [];
        existing.push({ startTime: slot.startTime, endTime: slot.endTime });
        grouped.set(slot.date, existing);
      }

      const transformed: AvailabilityDay[] = Array.from(
        grouped.entries(),
      ).map(([dateStr, slots]) => ({
        date: format(new Date(dateStr + "T00:00:00"), "MMM dd"),
        day: format(new Date(dateStr + "T00:00:00"), "EEE"),
        fullDate: dateStr,
        slots,
      }));

      setCache(prev => ({
        ...prev,
        [mentorId]: {
          data: transformed,
          timestamp: now,
          isLoading: false,
        }
      }));

      return transformed;
    } catch (error) {
      console.error("Error prefetching availability:", error);
      setCache(prev => ({
        ...prev,
        [mentorId]: {
          data: cached?.data || [],
          timestamp: cached?.timestamp || now,
          isLoading: false,
        }
      }));
      return cached?.data || [];
    }
  }, [cache]);

  const schedulePreload = useCallback((mentorId: string, delay = 300) => {
    if (!mentorId) return;

    // Clear existing timeout
    if (prefetchTimeouts.current[mentorId]) {
      clearTimeout(prefetchTimeouts.current[mentorId]);
    }

    // Schedule prefetch
    prefetchTimeouts.current[mentorId] = setTimeout(() => {
      prefetchAvailability(mentorId);
      delete prefetchTimeouts.current[mentorId];
    }, delay);
  }, [prefetchAvailability]);

  const cancelPreload = useCallback((mentorId: string) => {
    if (prefetchTimeouts.current[mentorId]) {
      clearTimeout(prefetchTimeouts.current[mentorId]);
      delete prefetchTimeouts.current[mentorId];
    }
  }, []);

  const getCachedAvailability = useCallback((mentorId: string) => {
    const cached = cache[mentorId];
    if (!cached) return null;

    const now = Date.now();
    const isExpired = (now - cached.timestamp) > CACHE_DURATION;
    
    return {
      data: cached.data,
      isLoading: cached.isLoading,
      isExpired,
      isEmpty: cached.data.length === 0 && !cached.isLoading,
    };
  }, [cache]);

  return {
    prefetchAvailability,
    schedulePreload,
    cancelPreload,
    getCachedAvailability,
  };
}