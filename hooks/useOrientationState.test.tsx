import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, beforeEach, afterEach, vi, type MockedFunction } from 'vitest';
import { useOrientationState, useOrientationScrollPreservation, useOrientationFormState } from './useOrientationState';

// Mock the useOrientation hook
vi.mock('./useOrientation', () => ({
  useOrientation: vi.fn(() => ({
    orientation: 'portrait',
    angle: 0,
    isChanging: false,
  })),
}));

import { useOrientation } from './useOrientation';

const mockUseOrientation = useOrientation as MockedFunction<typeof useOrientation>;

describe('useOrientationState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should return initial state', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useOrientationState(initialState));

    expect(result.current[0]).toEqual(initialState);
  });

  it('should preserve state during orientation change', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => useOrientationState(initialState));

    // Update state
    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });

    // Simulate orientation change starting
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: true,
    });

    const { result: result2 } = renderHook(() => useOrientationState(initialState));

    // Update state during orientation change
    act(() => {
      result2.current[1]({ count: 10 });
    });

    // Simulate orientation change ending
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    const { result: result3 } = renderHook(() => useOrientationState(initialState));

    // Fast-forward timers to trigger state restoration
    act(() => {
      vi.advanceTimersByTime(300);
    });

    // State should be preserved from before the orientation change
    expect(result3.current[0]).toEqual(initialState);
  });

  it('should not preserve state when preserveOnChange is false', () => {
    const initialState = { count: 0 };
    const { result } = renderHook(() => 
      useOrientationState(initialState, { preserveOnChange: false })
    );

    // Update state
    act(() => {
      result.current[1]({ count: 5 });
    });

    expect(result.current[0]).toEqual({ count: 5 });

    // Simulate orientation change - state should not be preserved
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: true,
    });

    // State should remain as is
    expect(result.current[0]).toEqual({ count: 5 });
  });
});

describe('useOrientationScrollPreservation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.useFakeTimers();
    
    // Mock window scroll methods
    Object.defineProperty(window, 'scrollX', { value: 0, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 0, writable: true });
    window.scrollTo = vi.fn();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('should preserve and restore window scroll position', () => {
    // Set initial scroll position
    Object.defineProperty(window, 'scrollX', { value: 100, writable: true });
    Object.defineProperty(window, 'scrollY', { value: 200, writable: true });

    // Start with orientation not changing
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: false,
    });

    const { rerender } = renderHook(() => useOrientationScrollPreservation());

    // Simulate orientation change starting
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: true,
    });

    rerender();

    // Simulate orientation change ending
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    rerender();

    // Fast-forward timers to trigger scroll restoration
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(window.scrollTo).toHaveBeenCalledWith(100, 200);
  });

  it('should preserve and restore element scroll position', () => {
    const mockElement = {
      scrollLeft: 50,
      scrollTop: 75,
    } as HTMLElement;

    const elementRef = { current: mockElement };

    // Start with orientation not changing
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: false,
    });

    const { rerender } = renderHook(() => useOrientationScrollPreservation(elementRef));

    // Simulate orientation change starting
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: true,
    });

    rerender();

    // Simulate orientation change ending
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    rerender();

    // Fast-forward timers to trigger scroll restoration
    act(() => {
      vi.advanceTimersByTime(100);
    });

    expect(mockElement.scrollLeft).toBe(50);
    expect(mockElement.scrollTop).toBe(75);
  });
});

describe('useOrientationFormState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return initial form state and update functions', () => {
    const initialFormState = { name: '', email: '' };
    const { result } = renderHook(() => useOrientationFormState(initialFormState));

    expect(result.current.formState).toEqual(initialFormState);
    expect(typeof result.current.setFormState).toBe('function');
    expect(typeof result.current.updateFormField).toBe('function');
    expect(typeof result.current.resetForm).toBe('function');
  });

  it('should update form field', () => {
    const initialFormState = { name: '', email: '' };
    const { result } = renderHook(() => useOrientationFormState(initialFormState));

    act(() => {
      result.current.updateFormField('name', 'John Doe');
    });

    expect(result.current.formState).toEqual({ name: 'John Doe', email: '' });
  });

  it('should reset form to initial state', () => {
    const initialFormState = { name: '', email: '' };
    const { result } = renderHook(() => useOrientationFormState(initialFormState));

    // Update form
    act(() => {
      result.current.updateFormField('name', 'John Doe');
      result.current.updateFormField('email', 'john@example.com');
    });

    expect(result.current.formState).toEqual({ name: 'John Doe', email: 'john@example.com' });

    // Reset form
    act(() => {
      result.current.resetForm();
    });

    expect(result.current.formState).toEqual(initialFormState);
  });
});