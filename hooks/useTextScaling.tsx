"use client";

import React, { useEffect, useState } from "react";

/**
 * Text scaling levels
 */
export type TextScaleLevel = "normal" | "large" | "larger" | "largest";

/**
 * Text scaling configuration
 */
interface TextScalingConfig {
  level: TextScaleLevel;
  scale: number;
}

const TEXT_SCALING_LEVELS: Record<TextScaleLevel, number> = {
  normal: 1,
  large: 1.25,
  larger: 1.5,
  largest: 2,
};

/**
 * Hook for managing text scaling preferences
 */
export function useTextScaling() {
  const [textScale, setTextScale] = useState<TextScaleLevel>("normal");
  const [isSupported, setIsSupported] = useState(false);

  useEffect(() => {
    // Check if browser supports text scaling detection
    const supportsTextScaling = "CSS" in window && "supports" in window.CSS;
    setIsSupported(supportsTextScaling);

    // Load saved text scaling preference
    const savedScale = localStorage.getItem("text-scale") as TextScaleLevel;
    if (savedScale && savedScale in TEXT_SCALING_LEVELS) {
      setTextScale(savedScale);
    }

    // Apply text scaling to document
    applyTextScaling(savedScale || "normal");
  }, []);

  const applyTextScaling = (level: TextScaleLevel) => {
    const scale = TEXT_SCALING_LEVELS[level];
    const root = document.documentElement;

    // Apply CSS custom property for text scaling
    root.style.setProperty("--text-scale", scale.toString());

    // Apply scaling to specific elements
    const scalableElements = document.querySelectorAll(
      ".text-scalable, .text-scalable-small, .text-scalable-large",
    );
    scalableElements.forEach((element) => {
      const htmlElement = element as HTMLElement;
      const currentFontSize = window.getComputedStyle(htmlElement).fontSize;
      const baseFontSize = parseFloat(currentFontSize);
      htmlElement.style.fontSize = `${baseFontSize * scale}px`;
    });
  };

  const setTextScaleLevel = (level: TextScaleLevel) => {
    setTextScale(level);
    localStorage.setItem("text-scale", level);
    applyTextScaling(level);
  };

  const resetTextScale = () => {
    setTextScaleLevel("normal");
  };

  return {
    textScale,
    setTextScaleLevel,
    resetTextScale,
    isSupported,
    scaleValue: TEXT_SCALING_LEVELS[textScale],
  };
}

/**
 * Component for text scaling controls
 */
interface TextScalingControlsProps {
  className?: string;
}

export const TextScalingControls: React.FC<TextScalingControlsProps> = ({
  className,
}) => {
  const { textScale, setTextScaleLevel, resetTextScale } = useTextScaling();

  return (
    <div
      className={className}
      role="group"
      aria-labelledby="text-scaling-label"
    >
      <label
        id="text-scaling-label"
        className="block text-sm font-medium text-gray-700 mb-2"
      >
        Text Size
      </label>
      <div className="flex flex-wrap gap-2">
        {Object.entries(TEXT_SCALING_LEVELS).map(([level, scale]) => (
          <button
            key={level}
            onClick={() => setTextScaleLevel(level as TextScaleLevel)}
            className={`px-3 py-2 text-sm rounded-md border min-h-[44px] ${
              textScale === level
                ? "bg-blue-600 text-white border-blue-600"
                : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
            }`}
            aria-pressed={textScale === level}
            aria-describedby={`text-scale-${level}-desc`}
          >
            {level === "normal"
              ? "Normal"
              : level === "large"
                ? "Large"
                : level === "larger"
                  ? "Larger"
                  : "Largest"}
            <span className="sr-only">({Math.round(scale * 100)}% size)</span>
          </button>
        ))}
      </div>
      <button
        onClick={resetTextScale}
        className="mt-2 text-sm text-blue-600 hover:text-blue-800 underline min-h-[44px] px-2"
      >
        Reset to default
      </button>

      {/* Hidden descriptions for screen readers */}
      <div className="sr-only">
        <div id="text-scale-normal-desc">Normal text size (100%)</div>
        <div id="text-scale-large-desc">Large text size (125%)</div>
        <div id="text-scale-larger-desc">Larger text size (150%)</div>
        <div id="text-scale-largest-desc">Largest text size (200%)</div>
      </div>
    </div>
  );
};

/**
 * Higher-order component for text scaling support
 */
export function withTextScaling<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
) {
  return React.forwardRef<any, T>((props, ref) => {
    const { scaleValue } = useTextScaling();

    return (
      <div style={{ "--text-scale": scaleValue } as React.CSSProperties}>
        <Component {...(props as T)} ref={ref as any} />
      </div>
    );
  });
}

/**
 * CSS-in-JS styles for text scaling
 */
export const textScalingStyles = {
  scalable: {
    fontSize: "calc(1rem * var(--text-scale, 1))",
    lineHeight: 1.5,
  },
  scalableSmall: {
    fontSize: "calc(0.875rem * var(--text-scale, 1))",
    lineHeight: 1.4,
  },
  scalableLarge: {
    fontSize: "calc(1.125rem * var(--text-scale, 1))",
    lineHeight: 1.6,
  },
} as const;
