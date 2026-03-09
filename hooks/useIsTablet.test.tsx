import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useIsTablet } from "./useIsTablet";

describe("useIsTablet", () => {
  let matchMediaMock: any;
  let listeners: Array<() => void> = [];

  beforeEach(() => {
    listeners = [];
    matchMediaMock = vi.fn((query: string) => ({
      matches: false,
      media: query,
      addEventListener: vi.fn((event: string, listener: () => void) => {
        listeners.push(listener);
      }),
      removeEventListener: vi.fn((event: string, listener: () => void) => {
        listeners = listeners.filter((l) => l !== listener);
      }),
    }));
    Object.defineProperty(window, "matchMedia", {
      writable: true,
      value: matchMediaMock,
    });
  });

  afterEach(() => {
    listeners = [];
  });

  it("should handle SSR compatibility with undefined initial state", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 800,
    });

    const { result } = renderHook(() => useIsTablet());

    // After effect runs in test environment, should detect tablet viewport
    // In actual SSR, the initial state would be undefined, then update on client
    expect(typeof result.current).toBe("boolean");
  });

  it("should return true when viewport is within tablet range (768px - 1023px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 800,
    });

    const { result } = renderHook(() => useIsTablet());

    // After effect runs, should detect tablet viewport
    expect(result.current).toBe(true);
  });

  it("should return true at minimum tablet breakpoint (768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(true);
  });

  it("should return true at maximum tablet breakpoint (1023px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1023,
    });

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(true);
  });

  it("should return false when viewport is below tablet range (< 768px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    });

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(false);
  });

  it("should return false when viewport is above tablet range (>= 1024px)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(false);
  });

  it("should update when viewport changes from mobile to tablet", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(false);

    // Simulate viewport change to tablet
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 800,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(true);
  });

  it("should update when viewport changes from tablet to desktop", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 800,
    });

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(true);

    // Simulate viewport change to desktop
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1200,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(false);
  });

  it("should update when viewport changes from desktop to tablet", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1200,
    });

    const { result } = renderHook(() => useIsTablet());

    expect(result.current).toBe(false);

    // Simulate viewport change to tablet
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 900,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe(true);
  });

  it("should clean up event listener on unmount", () => {
    const { unmount } = renderHook(() => useIsTablet());

    expect(listeners.length).toBeGreaterThan(0);

    unmount();

    expect(listeners.length).toBe(0);
  });
});
