import { render, screen, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import React from 'react';
import {
  mobileOptimizedMemo,
  useMobileOptimizedMemo,
  useMobileOptimizedCallback,
  MobileLazyRender,
  shallowEqual,
  arrayEqual,
  performanceMonitor,
} from './mobile-performance';

// Mock useIsMobile hook
vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: () => true,
}));

describe('mobile-performance utilities', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('mobileOptimizedMemo', () => {
    it('should memoize component correctly', () => {
      const TestComponent = vi.fn(({ value }: { value: number }) => (
        <div>{value}</div>
      ));

      const MemoizedComponent = mobileOptimizedMemo(TestComponent);

      const { rerender } = render(<MemoizedComponent value={1} />);
      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Re-render with same props - should not call component again
      rerender(<MemoizedComponent value={1} />);
      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Re-render with different props - should call component again
      rerender(<MemoizedComponent value={2} />);
      expect(TestComponent).toHaveBeenCalledTimes(2);
    });

    it('should use custom comparison function', () => {
      const TestComponent = vi.fn(({ obj }: { obj: { id: number; name: string } }) => (
        <div>{obj.name}</div>
      ));

      const MemoizedComponent = mobileOptimizedMemo(
        TestComponent,
        (prevProps, nextProps) => prevProps.obj.id === nextProps.obj.id
      );

      const { rerender } = render(<MemoizedComponent obj={{ id: 1, name: 'test' }} />);
      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Re-render with same id but different name - should not re-render
      rerender(<MemoizedComponent obj={{ id: 1, name: 'different' }} />);
      expect(TestComponent).toHaveBeenCalledTimes(1);

      // Re-render with different id - should re-render
      rerender(<MemoizedComponent obj={{ id: 2, name: 'test' }} />);
      expect(TestComponent).toHaveBeenCalledTimes(2);
    });
  });

  describe('useMobileOptimizedMemo', () => {
    it('should memoize values correctly', () => {
      const factory = vi.fn(() => ({ computed: 'value' }));
      
      function TestComponent({ dep }: { dep: number }) {
        const memoized = useMobileOptimizedMemo(() => factory(), [dep]);
        return <div>{memoized.computed}</div>;
      }

      const { rerender } = render(<TestComponent dep={1} />);
      expect(factory).toHaveBeenCalledTimes(1);

      // Re-render with same dep - should not call factory again
      rerender(<TestComponent dep={1} />);
      expect(factory).toHaveBeenCalledTimes(1);

      // Re-render with different dep - should call factory again
      rerender(<TestComponent dep={2} />);
      expect(factory).toHaveBeenCalledTimes(2);
    });

    it('should use mobile deps when specified', () => {
      const factory = vi.fn(() => ({ computed: 'value' }));
      
      function TestComponent({ dep1, dep2 }: { dep1: number; dep2: number }) {
        const memoized = useMobileOptimizedMemo(
          () => factory(),
          [dep1, dep2],
          {
            simplifyOnMobile: true,
            mobileDeps: [dep1], // Only dep1 matters on mobile
          }
        );
        return <div>{memoized.computed}</div>;
      }

      const { rerender } = render(<TestComponent dep1={1} dep2={1} />);
      expect(factory).toHaveBeenCalledTimes(1);

      // Re-render with same dep1 but different dep2 - should not call factory (mobile)
      rerender(<TestComponent dep1={1} dep2={2} />);
      expect(factory).toHaveBeenCalledTimes(1);

      // Re-render with different dep1 - should call factory
      rerender(<TestComponent dep1={2} dep2={2} />);
      expect(factory).toHaveBeenCalledTimes(2);
    });
  });

  describe('useMobileOptimizedCallback', () => {
    it('should memoize callbacks correctly', () => {
      const callback = vi.fn();
      
      function TestComponent({ dep }: { dep: number }) {
        const memoizedCallback = useMobileOptimizedCallback(() => callback(), [dep]);
        React.useEffect(() => {
          memoizedCallback();
        }, [memoizedCallback]);
        return <div>test</div>;
      }

      const { rerender } = render(<TestComponent dep={1} />);
      expect(callback).toHaveBeenCalledTimes(1);

      // Re-render with same dep - callback should be the same reference
      rerender(<TestComponent dep={1} />);
      expect(callback).toHaveBeenCalledTimes(1);

      // Re-render with different dep - should create new callback
      rerender(<TestComponent dep={2} />);
      expect(callback).toHaveBeenCalledTimes(2);
    });
  });

  describe('MobileLazyRender', () => {
    beforeEach(() => {
      vi.useFakeTimers();
    });

    afterEach(() => {
      vi.useRealTimers();
    });

    it('should render fallback initially on mobile', () => {
      render(
        <MobileLazyRender fallback={<div>Loading...</div>} mobileDelay={100}>
          <div>Content</div>
        </MobileLazyRender>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();
      expect(screen.queryByText('Content')).not.toBeInTheDocument();
    });

    it('should render content after delay on mobile', async () => {
      render(
        <MobileLazyRender fallback={<div>Loading...</div>} mobileDelay={100}>
          <div>Content</div>
        </MobileLazyRender>
      );

      expect(screen.getByText('Loading...')).toBeInTheDocument();

      // Fast-forward time
      act(() => {
        vi.advanceTimersByTime(100);
      });

      expect(screen.getByText('Content')).toBeInTheDocument();
      expect(screen.queryByText('Loading...')).not.toBeInTheDocument();
    });
  });

  describe('utility functions', () => {
    describe('shallowEqual', () => {
      it('should return true for equal objects', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { a: 1, b: 2 };
        expect(shallowEqual(obj1, obj2)).toBe(true);
      });

      it('should return false for different objects', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { a: 1, b: 3 };
        expect(shallowEqual(obj1, obj2)).toBe(false);
      });

      it('should return false for objects with different keys', () => {
        const obj1 = { a: 1, b: 2 };
        const obj2 = { a: 1, c: 2 };
        expect(shallowEqual(obj1, obj2)).toBe(false);
      });
    });

    describe('arrayEqual', () => {
      it('should return true for equal arrays', () => {
        expect(arrayEqual([1, 2, 3], [1, 2, 3])).toBe(true);
      });

      it('should return false for different arrays', () => {
        expect(arrayEqual([1, 2, 3], [1, 2, 4])).toBe(false);
      });

      it('should return false for arrays with different lengths', () => {
        expect(arrayEqual([1, 2], [1, 2, 3])).toBe(false);
      });
    });
  });

  describe('performanceMonitor', () => {
    beforeEach(() => {
      // Mock performance API
      global.performance = {
        mark: vi.fn(),
        measure: vi.fn(),
        getEntriesByName: vi.fn(() => [{ duration: 10 }]),
        clearMarks: vi.fn(),
        clearMeasures: vi.fn(),
      } as any;
    });

    it('should mark performance points', () => {
      performanceMonitor.mark('test');
      expect(performance.mark).toHaveBeenCalledWith('test-start');
    });

    it('should measure performance', () => {
      performanceMonitor.measure('test');
      expect(performance.mark).toHaveBeenCalledWith('test-end');
      expect(performance.measure).toHaveBeenCalledWith('test', 'test-start', 'test-end');
    });

    it('should clear performance data', () => {
      performanceMonitor.clear();
      expect(performance.clearMarks).toHaveBeenCalled();
      expect(performance.clearMeasures).toHaveBeenCalled();
    });
  });
});