/**
 * Centralized exports for all optimized dynamic components.
 * These components use Next.js dynamic imports for optimal bundle splitting.
 */

// Dynamic import utilities
export * from "@/lib/utils/dynamic-imports";

// Lazy components (already implemented)
export * from "@/components/lazy/LazyCharts";
export * from "@/components/lazy/LazyModals";
export * from "@/components/lazy/LazyPages";
export * from "@/components/lazy/LazyBelowFold";
