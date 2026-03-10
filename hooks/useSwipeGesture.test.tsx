import { renderHook, act } from "@testing-library/react";
import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
import { useSwipeGesture } from "./useSwipeGesture";

// Mock touch events
const createTouchEvent = (
  type: string,
  touches: Array<{ clientX: number; clientY: number }>,
) => {
  const event = new TouchEvent(type, {
    touches: touches.map(
      (touch) =>
        ({
          clientX: touch.clientX,
          clientY: touch.clientY,
        }) as Touch,
    ),
    bubbles: true,
    cancelable: true,
  });
  return event;
};

describe("useSwipeGesture", () => {
  let mockElement: HTMLElement;

  beforeEach(() => {
    mockElement = document.createElement("div");
    document.body.appendChild(mockElement);
    vi.useFakeTimers();
  });

  afterEach(() => {
    document.body.removeChild(mockElement);
    vi.useRealTimers();
  });

  it("should detect horizontal left swipe", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipe,
        direction: "horizontal",
        threshold: 100,
      }),
    );

    // Set up the element reference
    act(() => {
      result.current.ref.current = mockElement;
    });

    // Simulate touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 200, clientY: 100 }]),
      );
    });

    // Simulate touch move (swipe left)
    act(() => {
      result.current.onTouchMove(
        createTouchEvent("touchmove", [{ clientX: 50, clientY: 100 }]),
      );
    });

    // Simulate touch end
    act(() => {
      result.current.onTouchEnd(createTouchEvent("touchend", []));
    });

    expect(onSwipe).toHaveBeenCalledWith("left");
  });

  it("should detect horizontal right swipe", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipe,
        direction: "horizontal",
        threshold: 100,
      }),
    );

    act(() => {
      result.current.ref.current = mockElement;
    });

    // Touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 50, clientY: 100 }]),
      );
    });

    // Touch move (swipe right)
    act(() => {
      result.current.onTouchMove(
        createTouchEvent("touchmove", [{ clientX: 200, clientY: 100 }]),
      );
    });

    // Touch end
    act(() => {
      result.current.onTouchEnd(createTouchEvent("touchend", []));
    });

    expect(onSwipe).toHaveBeenCalledWith("right");
  });

  it("should detect vertical down swipe", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipe,
        direction: "vertical",
        threshold: 100,
      }),
    );

    act(() => {
      result.current.ref.current = mockElement;
    });

    // Touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 100, clientY: 50 }]),
      );
    });

    // Touch move (swipe down)
    act(() => {
      result.current.onTouchMove(
        createTouchEvent("touchmove", [{ clientX: 100, clientY: 200 }]),
      );
    });

    // Touch end
    act(() => {
      result.current.onTouchEnd(createTouchEvent("touchend", []));
    });

    expect(onSwipe).toHaveBeenCalledWith("down");
  });

  it("should call onSwipeMove during swipe", () => {
    const onSwipeMove = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeMove,
        direction: "horizontal",
        threshold: 100,
      }),
    );

    act(() => {
      result.current.ref.current = mockElement;
    });

    // Touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 100, clientY: 100 }]),
      );
    });

    // Touch move
    act(() => {
      result.current.onTouchMove(
        createTouchEvent("touchmove", [{ clientX: 150, clientY: 100 }]),
      );
    });

    expect(onSwipeMove).toHaveBeenCalledWith(50, 0, 0.5);
  });

  it("should not trigger swipe when below threshold", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipe,
        direction: "horizontal",
        threshold: 100,
        velocityThreshold: 1.0, // Set high velocity threshold to prevent velocity-based triggering
      }),
    );

    act(() => {
      result.current.ref.current = mockElement;
    });

    // Touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 100, clientY: 100 }]),
      );
    });

    // Advance time to ensure low velocity
    act(() => {
      vi.advanceTimersByTime(200);
    });

    // Touch move (small distance)
    act(() => {
      result.current.onTouchMove(
        createTouchEvent("touchmove", [{ clientX: 130, clientY: 100 }]),
      );
    });

    // Touch end
    act(() => {
      result.current.onTouchEnd(createTouchEvent("touchend", []));
    });

    expect(onSwipe).not.toHaveBeenCalled();
  });

  it("should trigger swipe with high velocity even below threshold", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipe,
        direction: "horizontal",
        threshold: 100,
        velocityThreshold: 0.5,
      }),
    );

    act(() => {
      result.current.ref.current = mockElement;
    });

    // Touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 100, clientY: 100 }]),
      );
    });

    // Advance time slightly to simulate fast swipe
    act(() => {
      vi.advanceTimersByTime(50);
    });

    // Touch move (small distance but fast)
    act(() => {
      result.current.onTouchMove(
        createTouchEvent("touchmove", [{ clientX: 150, clientY: 100 }]),
      );
    });

    // Touch end
    act(() => {
      result.current.onTouchEnd(createTouchEvent("touchend", []));
    });

    expect(onSwipe).toHaveBeenCalledWith("right");
  });

  it("should not respond when disabled", () => {
    const onSwipe = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipe,
        direction: "horizontal",
        threshold: 100,
        enabled: false,
      }),
    );

    act(() => {
      result.current.ref.current = mockElement;
    });

    // Touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 100, clientY: 100 }]),
      );
    });

    // Touch move
    act(() => {
      result.current.onTouchMove(
        createTouchEvent("touchmove", [{ clientX: 250, clientY: 100 }]),
      );
    });

    // Touch end
    act(() => {
      result.current.onTouchEnd(createTouchEvent("touchend", []));
    });

    expect(onSwipe).not.toHaveBeenCalled();
  });

  it("should call onSwipeStart and onSwipeEnd", () => {
    const onSwipeStart = vi.fn();
    const onSwipeEnd = vi.fn();
    const { result } = renderHook(() =>
      useSwipeGesture({
        onSwipeStart,
        onSwipeEnd,
        direction: "horizontal",
      }),
    );

    act(() => {
      result.current.ref.current = mockElement;
    });

    // Touch start
    act(() => {
      result.current.onTouchStart(
        createTouchEvent("touchstart", [{ clientX: 100, clientY: 100 }]),
      );
    });

    expect(onSwipeStart).toHaveBeenCalled();

    // Touch end
    act(() => {
      result.current.onTouchEnd(createTouchEvent("touchend", []));
    });

    expect(onSwipeEnd).toHaveBeenCalled();
  });
});
