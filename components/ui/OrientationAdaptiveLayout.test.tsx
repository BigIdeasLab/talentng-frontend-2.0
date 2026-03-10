import { render, screen } from '@testing-library/react';
import { vi, describe, it, expect, beforeEach, type MockedFunction } from 'vitest';
import { 
  OrientationAdaptiveLayout, 
  OrientationAdaptiveGrid, 
  OrientationAdaptiveModal 
} from './OrientationAdaptiveLayout';

// Mock the hooks
vi.mock('@/hooks/useOrientation', () => ({
  useIsLandscape: vi.fn(() => false),
  useOrientation: vi.fn(() => ({
    orientation: 'portrait',
    angle: 0,
    isChanging: false,
  })),
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => true),
}));

import { useIsLandscape, useOrientation } from '@/hooks/useOrientation';
import { useIsMobile } from '@/hooks/useIsMobile';

const mockUseIsLandscape = useIsLandscape as MockedFunction<typeof useIsLandscape>;
const mockUseOrientation = useOrientation as MockedFunction<typeof useOrientation>;
const mockUseIsMobile = useIsMobile as MockedFunction<typeof useIsMobile>;

describe('OrientationAdaptiveLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to mobile portrait
    mockUseIsLandscape.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: false,
    });
  });

  it('should render children', () => {
    render(
      <OrientationAdaptiveLayout>
        <div>Test content</div>
      </OrientationAdaptiveLayout>
    );

    expect(screen.getByText('Test content')).toBeInTheDocument();
  });

  it('should apply portrait classes in portrait orientation', () => {
    render(
      <OrientationAdaptiveLayout 
        portraitClassName="portrait-class"
        data-testid="layout"
      >
        <div>Content</div>
      </OrientationAdaptiveLayout>
    );

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveClass('portrait-class');
    expect(layout).toHaveClass('portrait-mobile-single-column');
  });

  it('should apply landscape classes in landscape orientation', () => {
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    render(
      <OrientationAdaptiveLayout 
        landscapeClassName="landscape-class"
        mobileLandscapeClassName="mobile-landscape-class"
        data-testid="layout"
      >
        <div>Content</div>
      </OrientationAdaptiveLayout>
    );

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveClass('landscape-class');
    expect(layout).toHaveClass('mobile-landscape-class');
    expect(layout).toHaveClass('mobile-landscape-tablet-layout');
  });

  it('should apply transition classes when orientation is changing', () => {
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: true,
    });

    render(
      <OrientationAdaptiveLayout data-testid="layout">
        <div>Content</div>
      </OrientationAdaptiveLayout>
    );

    const layout = screen.getByTestId('layout');
    expect(layout).toHaveClass('transition-all');
    expect(layout).toHaveClass('duration-300');
    expect(layout).toHaveClass('ease-in-out');
  });

  it('should disable mobile landscape tablet behavior when specified', () => {
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    render(
      <OrientationAdaptiveLayout 
        enableMobileLandscapeTabletBehavior={false}
        data-testid="layout"
      >
        <div>Content</div>
      </OrientationAdaptiveLayout>
    );

    const layout = screen.getByTestId('layout');
    expect(layout).not.toHaveClass('mobile-landscape-tablet-layout');
  });
});

describe('OrientationAdaptiveGrid', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIsLandscape.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);
  });

  it('should render with default portrait mobile columns', () => {
    render(
      <OrientationAdaptiveGrid data-testid="grid">
        <div>Item 1</div>
        <div>Item 2</div>
      </OrientationAdaptiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid');
    expect(grid).toHaveClass('grid-cols-1');
    expect(grid).toHaveClass('gap-4');
  });

  it('should use landscape mobile columns in landscape orientation', () => {
    mockUseIsLandscape.mockReturnValue(true);

    render(
      <OrientationAdaptiveGrid 
        landscapeMobileCols={3}
        data-testid="grid"
      >
        <div>Item 1</div>
        <div>Item 2</div>
      </OrientationAdaptiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('grid-cols-3');
  });

  it('should apply responsive classes for larger screens', () => {
    render(
      <OrientationAdaptiveGrid 
        tabletCols={2}
        desktopCols={4}
        data-testid="grid"
      >
        <div>Item 1</div>
      </OrientationAdaptiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('md:grid-cols-2');
    expect(grid).toHaveClass('lg:grid-cols-4');
  });

  it('should apply custom className', () => {
    render(
      <OrientationAdaptiveGrid 
        className="custom-class"
        data-testid="grid"
      >
        <div>Item 1</div>
      </OrientationAdaptiveGrid>
    );

    const grid = screen.getByTestId('grid');
    expect(grid).toHaveClass('custom-class');
  });
});

describe('OrientationAdaptiveModal', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseIsLandscape.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);
  });

  it('should render children', () => {
    render(
      <OrientationAdaptiveModal>
        <div>Modal content</div>
      </OrientationAdaptiveModal>
    );

    expect(screen.getByText('Modal content')).toBeInTheDocument();
  });

  it('should apply portrait mobile modal classes', () => {
    render(
      <OrientationAdaptiveModal data-testid="modal">
        <div>Content</div>
      </OrientationAdaptiveModal>
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('portrait-mobile-modal');
  });

  it('should apply landscape mobile modal classes', () => {
    mockUseIsLandscape.mockReturnValue(true);

    render(
      <OrientationAdaptiveModal data-testid="modal">
        <div>Content</div>
      </OrientationAdaptiveModal>
    );

    const modal = screen.getByTestId('modal');
    expect(modal).toHaveClass('mobile-landscape-modal');
  });

  it('should not apply full screen classes when disabled', () => {
    render(
      <OrientationAdaptiveModal 
        fullScreenPortrait={false}
        data-testid="modal"
      >
        <div>Content</div>
      </OrientationAdaptiveModal>
    );

    const modal = screen.getByTestId('modal');
    expect(modal).not.toHaveClass('portrait-mobile-modal');
  });

  it('should not apply tablet sizing in landscape when disabled', () => {
    mockUseIsLandscape.mockReturnValue(true);

    render(
      <OrientationAdaptiveModal 
        tabletSizingLandscape={false}
        data-testid="modal"
      >
        <div>Content</div>
      </OrientationAdaptiveModal>
    );

    const modal = screen.getByTestId('modal');
    expect(modal).not.toHaveClass('mobile-landscape-modal');
  });
});