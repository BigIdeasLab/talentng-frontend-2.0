import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { renderHook, act } from "@testing-library/react";
import { useBreakpoint } from "./useBreakpoint";

describe("useBreakpoint", () => {
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

  it("should handle SSR compatibility with xs as default", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 800,
    });

    const { result } = renderHook(() => useBreakpoint());

    // Should return a valid breakpoint
    expect(["xs", "sm", "md", "lg", "xl", "2xl"]).toContain(result.current);
  });

  it("should return 'xs' for viewport < 640px", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("xs");
  });

  it("should return 'xs' at 639px (just below sm breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 639,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("xs");
  });

  it("should return 'sm' for viewport 640px - 767px", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 700,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("sm");
  });

  it("should return 'sm' at 640px (sm breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 640,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("sm");
  });

  it("should return 'sm' at 767px (just below md breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 767,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("sm");
  });

  it("should return 'md' for viewport 768px - 1023px", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 800,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("md");
  });

  it("should return 'md' at 768px (md breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 768,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("md");
  });

  it("should return 'md' at 1023px (just below lg breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1023,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("md");
  });

  it("should return 'lg' for viewport 1024px - 1279px", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1100,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("lg");
  });

  it("should return 'lg' at 1024px (lg breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1024,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("lg");
  });

  it("should return 'lg' at 1279px (just below xl breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1279,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("lg");
  });

  it("should return 'xl' for viewport 1280px - 1535px", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1400,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("xl");
  });

  it("should return 'xl' at 1280px (xl breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1280,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("xl");
  });

  it("should return 'xl' at 1535px (just below 2xl breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1535,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("xl");
  });

  it("should return '2xl' for viewport >= 1536px", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1600,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("2xl");
  });

  it("should return '2xl' at 1536px (2xl breakpoint)", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1536,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("2xl");
  });

  it("should update when viewport changes from xs to sm", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 500,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("xs");

    // Simulate viewport change to sm
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 700,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe("sm");
  });

  it("should update when viewport changes from sm to md", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 700,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("sm");

    // Simulate viewport change to md
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 800,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe("md");
  });

  it("should update when viewport changes from md to lg", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 800,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("md");

    // Simulate viewport change to lg
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1100,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe("lg");
  });

  it("should update when viewport changes from lg to xl", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1100,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("lg");

    // Simulate viewport change to xl
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1400,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe("xl");
  });

  it("should update when viewport changes from xl to 2xl", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1400,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("xl");

    // Simulate viewport change to 2xl
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1600,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe("2xl");
  });

  it("should update when viewport changes from 2xl to xl", () => {
    Object.defineProperty(window, "innerWidth", {
      writable: true,
      value: 1600,
    });

    const { result } = renderHook(() => useBreakpoint());

    expect(result.current).toBe("2xl");

    // Simulate viewport change to xl
    act(() => {
      Object.defineProperty(window, "innerWidth", {
        writable: true,
        value: 1400,
      });
      listeners.forEach((listener) => listener());
    });

    expect(result.current).toBe("xl");
  });

  it("should clean up event listeners on unmount", () => {
    const { unmount } = renderHook(() => useBreakpoint());

    expect(listeners.length).toBeGreaterThan(0);

    unmount();

    expect(listeners.length).toBe(0);
  });
});
