import { renderHook } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import { useIsTouchDevice } from "./useIsTouchDevice";

// Mock matchMedia
const mockMatchMedia = (matches: boolean) => {
  const mockMediaQuery = {
    matches,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  };
  
  Object.defineProperty(window, "matchMedia", {
    writable: true,
    value: vi.fn().mockImplementation(() => mockMediaQuery),
  });
  
  return mockMediaQuery;
};

describe("useIsTouchDevice", () => {
  beforeEach(() => {
    // Reset any previous mocks
    vi.clearAllMocks();
  });

  it("should return true for touch devices", async () => {
    mockMatchMedia(true);
    const { result, rerender } = renderHook(() => useIsTouchDevice());
    
    // Wait for useEffect to run
    rerender();
    
    expect(result.current).toBe(true);
  });

  it("should return false for non-touch devices", async () => {
    mockMatchMedia(false);
    const { result, rerender } = renderHook(() => useIsTouchDevice());
    
    // Wait for useEffect to run
    rerender();
    
    expect(result.current).toBe(false);
  });

  it("should set up media query listener", () => {
    const mockMediaQuery = mockMatchMedia(false);
    renderHook(() => useIsTouchDevice());
    
    expect(window.matchMedia).toHaveBeenCalledWith("(hover: none)");
    expect(mockMediaQuery.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should clean up media query listener on unmount", () => {
    const mockMediaQuery = mockMatchMedia(false);
    const { unmount } = renderHook(() => useIsTouchDevice());
    
    unmount();
    
    expect(mockMediaQuery.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function)
    );
  });

  it("should handle media query changes", () => {
    const mockMediaQuery = mockMatchMedia(false);
    const { result, rerender } = renderHook(() => useIsTouchDevice());
    
    // Initial state
    rerender();
    expect(result.current).toBe(false);
    
    // Simulate media query change
    const changeHandler = mockMediaQuery.addEventListener.mock.calls[0][1];
    changeHandler({ matches: true });
    
    rerender();
    expect(result.current).toBe(true);
  });
});