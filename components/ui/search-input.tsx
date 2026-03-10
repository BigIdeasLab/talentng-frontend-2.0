"use client";

import React, { useState, useRef, useCallback, useEffect } from "react";
import { Search, X } from "lucide-react";

/**
 * Props for the SearchInput component
 */
export interface SearchInputProps {
  // Search behavior
  /** Callback invoked after debounce delay when search value changes */
  onSearch: (query: string) => void;
  /** Placeholder text displayed when input is empty. Defaults to "Search..." */
  placeholder?: string;
  /** Debounce delay in milliseconds. Defaults to 300ms */
  debounceDelay?: number;

  // Controlled mode
  /** Current search value (controlled mode) */
  value?: string;
  /** Callback invoked immediately on every input change (controlled mode) */
  onChange?: (value: string) => void;

  // Uncontrolled mode
  /** Initial value for uncontrolled mode */
  defaultValue?: string;

  // Visual state
  /** Whether search is in progress (shows loading spinner) */
  isLoading?: boolean;
  /** Error message or error state */
  error?: string;

  // Accessibility
  /** Accessible label for the input. Defaults to "Search" */
  ariaLabel?: string;
  /** ID of element that describes the input */
  ariaDescribedBy?: string;

  // Customization
  /** Maximum input length */
  maxLength?: number;
  /** Whether the input is disabled */
  disabled?: boolean;
  /** Additional CSS classes for the container */
  className?: string;

  // Callbacks
  /** Callback invoked when clear button is clicked */
  onClear?: () => void;
  /** Callback invoked when search handler throws an error */
  onError?: (error: Error) => void;
  /** Callback invoked when input receives focus */
  onFocus?: () => void;
  /** Callback invoked when input loses focus */
  onBlur?: () => void;
}

/**
 * Unified search input component with consistent design, debouncing, loading states,
 * clear button, keyboard shortcuts, and full accessibility compliance.
 *
 * Supports both controlled and uncontrolled modes:
 * - Controlled: Provide `value` and `onChange` props
 * - Uncontrolled: Provide `defaultValue` or neither
 *
 * @example
 * // Controlled mode
 * <SearchInput
 *   value={searchQuery}
 *   onChange={setSearchQuery}
 *   onSearch={handleSearch}
 *   placeholder="Search opportunities..."
 * />
 *
 * @example
 * // Uncontrolled mode with debouncing
 * <SearchInput
 *   onSearch={handleSearch}
 *   placeholder="Search talents..."
 *   debounceDelay={300}
 * />
 */
export const SearchInput = React.memo<SearchInputProps>(
  ({
    onSearch,
    placeholder = "Search...",
    debounceDelay = 300,
    value,
    onChange,
    defaultValue = "",
    isLoading = false,
    error,
    ariaLabel = "Search",
    ariaDescribedBy,
    maxLength,
    disabled = false,
    className = "",
    onClear,
    onError,
    onFocus,
    onBlur,
  }) => {
    // Detect controlled vs uncontrolled mode
    const isControlled = value !== undefined;

    // Internal state for uncontrolled mode
    const [internalValue, setInternalValue] = useState(defaultValue);

    // Internal loading state for debounce period
    const [isDebouncing, setIsDebouncing] = useState(false);

    // Current value based on mode
    const currentValue = isControlled ? value : internalValue;

    // Debounce timer reference
    const debounceTimerRef = useRef<NodeJS.Timeout>();

    // Validate and sanitize debounceDelay
    const validatedDebounceDelay =
      typeof debounceDelay === "number" && debounceDelay >= 0
        ? debounceDelay
        : 300;

    // Warn in development if both value and defaultValue are provided
    useEffect(() => {
      if (
        process.env.NODE_ENV === "development" &&
        value !== undefined &&
        defaultValue !== ""
      ) {
        console.warn(
          "SearchInput: Both 'value' and 'defaultValue' props provided. Using 'value' (controlled mode).",
        );
      }
    }, [value, defaultValue]);

    // Cleanup timer on unmount
    useEffect(() => {
      return () => {
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }
      };
    }, []);

    // Debounced search function
    const debouncedSearch = useCallback(
      (query: string) => {
        // Clear previous timer
        if (debounceTimerRef.current) {
          clearTimeout(debounceTimerRef.current);
        }

        // Show loading spinner during debounce
        setIsDebouncing(true);

        // Set new timer
        debounceTimerRef.current = setTimeout(() => {
          try {
            onSearch(query);
          } catch (err) {
            if (onError) {
              onError(err as Error);
            }
            if (process.env.NODE_ENV === "development") {
              console.error("SearchInput: Search handler error:", err);
            }
          } finally {
            // Hide loading spinner after search completes
            setIsDebouncing(false);
          }
        }, validatedDebounceDelay);
      },
      [onSearch, validatedDebounceDelay, onError],
    );

    // Handle input change
    const handleInputChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = e.target.value;

        // Update internal state if uncontrolled
        if (!isControlled) {
          setInternalValue(newValue);
        }

        // Invoke onChange callback if provided (controlled mode)
        if (onChange) {
          onChange(newValue);
        }

        // Trigger debounced search
        debouncedSearch(newValue);
      },
      [isControlled, onChange, debouncedSearch],
    );

    // Handle clear button click
    const handleClear = useCallback(() => {
      const emptyValue = "";

      // Clear any pending debounce
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
      setIsDebouncing(false);

      // Update internal state if uncontrolled
      if (!isControlled) {
        setInternalValue(emptyValue);
      }

      // Invoke onChange callback if provided
      if (onChange) {
        onChange(emptyValue);
      }

      // Invoke onSearch immediately (no debounce)
      onSearch(emptyValue);

      // Invoke onClear callback if provided
      if (onClear) {
        onClear();
      }
    }, [isControlled, onChange, onSearch, onClear]);

    // Handle keyboard shortcuts
    const handleKeyDown = useCallback(
      (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Escape" && currentValue) {
          e.preventDefault();
          handleClear();
        }
      },
      [currentValue, handleClear],
    );

    // Determine if we should show loading spinner
    const showLoading = isLoading || isDebouncing;

    // Determine if clear button should be visible
    const showClearButton = currentValue.length > 0 && !showLoading;

    // Container classes with error state
    const containerClasses = `
      flex items-center gap-2
      h-[44px] px-3 py-[7px]
      border rounded-lg
      ${error ? "border-red-500 bg-red-50" : "border-[#E1E4EA] bg-transparent"}
      transition-colors duration-150
      ${className}
    `.trim();

    // Input classes
    const inputClasses = `
      flex-1
      text-[13px] font-normal font-inter-tight
      text-black
      placeholder:text-black/30
      border-0 outline-none bg-transparent
      disabled:cursor-not-allowed disabled:opacity-50
    `.trim();

    return (
      <div>
        <div className={containerClasses}>
          {/* Search icon or loading spinner */}
          {showLoading ? (
            <div
              className="w-[15px] h-[15px] border-2 border-[#B2B2B2] border-t-transparent rounded-full animate-spin flex-shrink-0"
              aria-hidden="true"
            />
          ) : (
            <Search
              className="w-[15px] h-[15px] text-[#B2B2B2] flex-shrink-0"
              aria-hidden="true"
            />
          )}

          {/* Input element */}
          <input
            type="text"
            value={currentValue}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={onFocus}
            onBlur={onBlur}
            placeholder={placeholder}
            disabled={disabled}
            maxLength={maxLength}
            aria-label={ariaLabel}
            aria-describedby={ariaDescribedBy}
            aria-busy={showLoading}
            className={inputClasses}
          />

          {/* Clear button */}
          {showClearButton && (
            <button
              type="button"
              onClick={handleClear}
              aria-label="Clear search"
              className="flex-shrink-0 text-[#B2B2B2] active:text-black hover:text-black transition-colors duration-150 min-w-[44px] min-h-[44px] flex items-center justify-center"
            >
              <X className="w-[15px] h-[15px]" />
            </button>
          )}
        </div>

        {/* Error message */}
        {error && typeof error === "string" && (
          <p
            className="mt-1 text-xs text-red-600"
            id={ariaDescribedBy}
            role="alert"
          >
            {error}
          </p>
        )}
      </div>
    );
  },
);

SearchInput.displayName = "SearchInput";
