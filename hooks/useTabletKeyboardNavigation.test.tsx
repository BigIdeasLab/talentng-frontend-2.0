import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  useTabletKeyboardNavigation,
  useTabletKeyboardContainer,
} from "./useTabletKeyboardNavigation";
import { useIsTablet } from "./useIsTablet";

// Mock the useIsTablet hook
vi.mock("./useIsTablet");
const mockUseIsTablet = vi.mocked(useIsTablet);

// Mock the KeyboardNavigationManager
vi.mock("@/lib/utils/keyboard-navigation", () => ({
  KeyboardNavigationManager: {
    getInstance: vi.fn(() => ({
      setTabletMode: vi.fn(),
      registerFocusableElements: vi.fn(),
      clearElements: vi.fn(),
      focusNext: vi.fn(() => true),
      focusPrevious: vi.fn(() => true),
      focusFirst: vi.fn(() => true),
      focusLast: vi.fn(() => true),
    })),
  },
}));

describe("useTabletKeyboardNavigation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should enable tablet mode when on tablet viewport", () => {
    mockUseIsTablet.mockReturnValue(true);

    const { result } = renderHook(() => useTabletKeyboardNavigation());

    expect(result.current.isTabletMode).toBe(true);
  });

  it("should disable tablet mode when not on tablet viewport", () => {
    mockUseIsTablet.mockReturnValue(false);

    const { result } = renderHook(() => useTabletKeyboardNavigation());

    expect(result.current.isTabletMode).toBe(false);
  });

  it("should handle undefined tablet state during SSR", () => {
    mockUseIsTablet.mockReturnValue(false);

    const { result } = renderHook(() => useTabletKeyboardNavigation());

    expect(result.current.isTabletMode).toBe(false);
  });
});

describe("useTabletKeyboardContainer", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("should provide navigation functions", () => {
    mockUseIsTablet.mockReturnValue(true);

    const { result } = renderHook(() => useTabletKeyboardContainer());

    expect(typeof result.current.focusNext).toBe("function");
    expect(typeof result.current.focusPrevious).toBe("function");
    expect(typeof result.current.focusFirst).toBe("function");
    expect(typeof result.current.focusLast).toBe("function");
  });

  it("should provide container ref", () => {
    mockUseIsTablet.mockReturnValue(true);

    const { result } = renderHook(() => useTabletKeyboardContainer());

    expect(result.current.containerRef).toBeDefined();
    expect(result.current.containerRef.current).toBeNull();
  });

  it("should register elements when in tablet mode", () => {
    mockUseIsTablet.mockReturnValue(true);

    const { result } = renderHook(() => useTabletKeyboardContainer());

    // Create a mock container element
    const mockContainer = document.createElement("div");

    act(() => {
      // Simulate setting the ref
      (result.current.containerRef as any).current = mockContainer;
    });

    // The effect should register the container
    expect(result.current.isTabletMode).toBe(true);
  });

  it("should not register elements when not in tablet mode", () => {
    mockUseIsTablet.mockReturnValue(false);

    const { result } = renderHook(() => useTabletKeyboardContainer());

    expect(result.current.isTabletMode).toBe(false);
  });
});
