import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, vi } from "vitest";
import {
  useOrientation,
  useIsLandscape,
  useIsPortrait,
} from "./useOrientation";

// Mock screen.orientation API
const mockScreenOrientation = {
  angle: 0,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

// Mock window properties
const mockWindow = {
  screen: {
    orientation: mockScreenOrientation,
  },
  innerWidth: 375,
  innerHeight: 667,
  orientation: 0,
  addEventListener: vi.fn(),
  removeEventListener: vi.fn(),
};

describe("useOrientation", () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset window mock
    Object.defineProperty(window, "screen", {
      value: mockWindow.screen,
      writable: true,
    });
    Object.defineProperty(window, "innerWidth", {
      value: mockWindow.innerWidth,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: mockWindow.innerHeight,
      writable: true,
    });
    Object.defineProperty(window, "orientation", {
      value: mockWindow.orientation,
      writable: true,
    });
  });

  it("should return initial portrait orientation", () => {
    const { result } = renderHook(() => useOrientation());

    expect(result.current.orientation).toBe("portrait");
    expect(result.current.angle).toBe(0);
    expect(result.current.isChanging).toBe(false);
  });

  it("should detect landscape orientation when angle is 90 degrees", () => {
    mockScreenOrientation.angle = 90;

    const { result } = renderHook(() => useOrientation());

    expect(result.current.orientation).toBe("landscape");
    expect(result.current.angle).toBe(90);
  });

  it("should detect landscape orientation when angle is 270 degrees", () => {
    mockScreenOrientation.angle = 270;

    const { result } = renderHook(() => useOrientation());

    expect(result.current.orientation).toBe("landscape");
    expect(result.current.angle).toBe(270);
  });

  it("should fall back to window dimensions when screen.orientation is not available", () => {
    // Remove screen.orientation
    Object.defineProperty(window, "screen", {
      value: {},
      writable: true,
    });

    // Set landscape dimensions
    Object.defineProperty(window, "innerWidth", {
      value: 667,
      writable: true,
    });
    Object.defineProperty(window, "innerHeight", {
      value: 375,
      writable: true,
    });

    const { result } = renderHook(() => useOrientation());

    expect(result.current.orientation).toBe("landscape");
  });

  it("should add event listeners on mount", () => {
    renderHook(() => useOrientation());

    expect(mockScreenOrientation.addEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should remove event listeners on unmount", () => {
    const { unmount } = renderHook(() => useOrientation());

    unmount();

    expect(mockScreenOrientation.removeEventListener).toHaveBeenCalledWith(
      "change",
      expect.any(Function),
    );
  });

  it("should fall back to window events when screen.orientation is not available", () => {
    // Remove screen.orientation
    Object.defineProperty(window, "screen", {
      value: {},
      writable: true,
    });

    const addEventListenerSpy = vi.spyOn(window, "addEventListener");
    const removeEventListenerSpy = vi.spyOn(window, "removeEventListener");

    const { unmount } = renderHook(() => useOrientation());

    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "orientationchange",
      expect.any(Function),
    );
    expect(addEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    unmount();

    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "orientationchange",
      expect.any(Function),
    );
    expect(removeEventListenerSpy).toHaveBeenCalledWith(
      "resize",
      expect.any(Function),
    );

    addEventListenerSpy.mockRestore();
    removeEventListenerSpy.mockRestore();
  });
});

describe("useIsLandscape", () => {
  beforeEach(() => {
    // Reset mock state
    mockScreenOrientation.angle = 0;
    Object.defineProperty(window, "screen", {
      value: { orientation: mockScreenOrientation },
      writable: true,
    });
  });

  it("should return true when in landscape orientation", () => {
    // Set landscape angle before rendering
    mockScreenOrientation.angle = 90;

    const { result } = renderHook(() => useIsLandscape());

    expect(result.current).toBe(true);
  });

  it("should return false when in portrait orientation", () => {
    // Set portrait angle before rendering
    mockScreenOrientation.angle = 0;

    const { result } = renderHook(() => useIsLandscape());

    expect(result.current).toBe(false);
  });
});

describe("useIsPortrait", () => {
  beforeEach(() => {
    // Reset mock state
    mockScreenOrientation.angle = 0;
    Object.defineProperty(window, "screen", {
      value: { orientation: mockScreenOrientation },
      writable: true,
    });
  });

  it("should return true when in portrait orientation", () => {
    // Set portrait angle before rendering
    mockScreenOrientation.angle = 0;

    const { result } = renderHook(() => useIsPortrait());

    expect(result.current).toBe(true);
  });

  it("should return false when in landscape orientation", () => {
    // Set landscape angle before rendering
    mockScreenOrientation.angle = 90;

    const { result } = renderHook(() => useIsPortrait());

    expect(result.current).toBe(false);
  });
});
