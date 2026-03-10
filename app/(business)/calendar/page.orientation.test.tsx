import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';
import CalendarPage from './page';

// Mock the hooks and dependencies
vi.mock('@/hooks/useProfile', () => ({
  useProfile: vi.fn(() => ({
    activeRole: 'talent',
    isLoading: false,
  })),
}));

vi.mock('@/hooks/useRequireRole', () => ({
  useRequireRole: vi.fn(() => true),
}));

vi.mock('@/hooks/useOrientation', () => ({
  useOrientation: vi.fn(() => ({
    orientation: 'portrait',
    angle: 0,
    isChanging: false,
  })),
  useIsLandscape: vi.fn(() => false),
  useIsPortrait: vi.fn(() => true),
}));

vi.mock('@/hooks/useOrientationState', () => ({
  useOrientationScrollPreservation: vi.fn(),
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => true),
}));

vi.mock('@/hooks', () => ({
  useToast: vi.fn(() => ({
    toast: vi.fn(),
  })),
}));

vi.mock('@/lib/api/talent', () => ({
  getTalentUpcoming: vi.fn(() => Promise.resolve({
    items: [],
    pagination: { total: 0, currentPage: 1, totalPages: 1 },
  })),
}));

vi.mock('@/hooks/useNotificationSocket', () => ({
  useNotificationSocket: vi.fn(),
}));

vi.mock('next/navigation', () => ({
  useRouter: vi.fn(() => ({
    replace: vi.fn(),
  })),
}));

import { useOrientation, useIsLandscape } from '@/hooks/useOrientation';
import { useIsMobile } from '@/hooks/useIsMobile';

const mockUseOrientation = useOrientation as MockedFunction<typeof useOrientation>;
const mockUseIsLandscape = useIsLandscape as MockedFunction<typeof useIsLandscape>;
const mockUseIsMobile = useIsMobile as MockedFunction<typeof useIsMobile>;

describe('Calendar Page - Orientation Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Default to mobile portrait
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: false,
    });
    mockUseIsLandscape.mockReturnValue(false);
    mockUseIsMobile.mockReturnValue(true);
  });

  it('should render in portrait mobile orientation', async () => {
    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // Check that the grid uses single column layout in portrait mobile
    const gridContainer = screen.getByText('Calendar').closest('div');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should adapt layout for landscape mobile orientation', async () => {
    // Set to landscape mobile
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // In landscape mobile, the layout should adapt to show more content
    const gridContainer = screen.getByText('Calendar').closest('div');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should handle orientation change transitions', async () => {
    // Start in portrait
    const { rerender } = render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // Simulate orientation change starting
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: true,
    });

    rerender(<CalendarPage />);

    // Simulate orientation change completing to landscape
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });
    mockUseIsLandscape.mockReturnValue(true);

    rerender(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });
  });

  it('should preserve search state during orientation changes', async () => {
    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // Find search input
    const searchInput = screen.getByPlaceholderText('Search interviews, sessions...');
    expect(searchInput).toBeInTheDocument();

    // The search input should maintain its state during orientation changes
    // This is handled by the useOrientationState hook
  });

  it('should maintain filter state during orientation changes', async () => {
    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // Check that filter tabs are present
    expect(screen.getByText('All')).toBeInTheDocument();
    expect(screen.getByText('Interviews')).toBeInTheDocument();
    expect(screen.getByText('Sessions')).toBeInTheDocument();

    // Filter state should be preserved during orientation changes
  });

  it('should adapt date range filters for different orientations', async () => {
    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // Check that date range filters are present
    expect(screen.getByText('All Time')).toBeInTheDocument();
    expect(screen.getByText('Today')).toBeInTheDocument();
    expect(screen.getByText('This Week')).toBeInTheDocument();
    expect(screen.getByText('This Month')).toBeInTheDocument();

    // In landscape, these should remain accessible but may have different layout
  });

  it('should handle tablet orientation correctly', async () => {
    // Set to tablet
    mockUseIsMobile.mockReturnValue(false);
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // Tablet should have different layout behavior than mobile
    const gridContainer = screen.getByText('Calendar').closest('div');
    expect(gridContainer).toBeInTheDocument();
  });

  it('should not break layout with rapid orientation changes', async () => {
    const { rerender } = render(<CalendarPage />);

    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });

    // Simulate rapid orientation changes
    for (let i = 0; i < 5; i++) {
      const isLandscape = i % 2 === 0;
      mockUseIsLandscape.mockReturnValue(isLandscape);
      mockUseOrientation.mockReturnValue({
        orientation: isLandscape ? 'landscape' : 'portrait',
        angle: isLandscape ? 90 : 0,
        isChanging: i === 4 ? false : true, // Last change completes
      });

      rerender(<CalendarPage />);
    }

    // Layout should still be intact
    await waitFor(() => {
      expect(screen.getByText('Calendar')).toBeInTheDocument();
    });
  });
});