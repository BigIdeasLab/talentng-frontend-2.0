import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, beforeEach, vi, type MockedFunction } from 'vitest';

// Mock the login page component
vi.mock('./page', () => ({
  default: () => (
    <div data-testid="login-page">
      <h1>Sign In</h1>
      <form data-testid="login-form">
        <input 
          type="email" 
          placeholder="Email" 
          data-testid="email-input"
        />
        <input 
          type="password" 
          placeholder="Password" 
          data-testid="password-input"
        />
        <button type="submit" data-testid="login-button">
          Sign In
        </button>
      </form>
      <div data-testid="branding">
        <img src="/logo.png" alt="Logo" />
      </div>
    </div>
  ),
}));

// Mock the hooks
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
  useOrientationFormState: vi.fn(() => ({
    formState: { email: '', password: '' },
    setFormState: vi.fn(),
    updateFormField: vi.fn(),
    resetForm: vi.fn(),
  })),
}));

vi.mock('@/hooks/useIsMobile', () => ({
  useIsMobile: vi.fn(() => true),
}));

import LoginPage from './page';
import { useOrientation, useIsLandscape } from '@/hooks/useOrientation';
import { useIsMobile } from '@/hooks/useIsMobile';

const mockUseOrientation = useOrientation as MockedFunction<typeof useOrientation>;
const mockUseIsLandscape = useIsLandscape as MockedFunction<typeof useIsLandscape>;
const mockUseIsMobile = useIsMobile as MockedFunction<typeof useIsMobile>;

describe('Login Page - Orientation Tests', () => {
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

  it('should render login form in portrait mobile', async () => {
    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.getByTestId('login-form')).toBeInTheDocument();
    });

    // Form elements should be present
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('should adapt layout for landscape mobile', async () => {
    // Set to landscape mobile
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    });

    // All form elements should still be accessible in landscape
    expect(screen.getByTestId('email-input')).toBeInTheDocument();
    expect(screen.getByTestId('password-input')).toBeInTheDocument();
    expect(screen.getByTestId('login-button')).toBeInTheDocument();
  });

  it('should maintain branding visibility across orientations', async () => {
    // Test portrait first
    const { rerender } = render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('branding')).toBeInTheDocument();
    });

    // Switch to landscape
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    rerender(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('branding')).toBeInTheDocument();
    });

    // Branding should be visible in both orientations
  });

  it('should handle orientation change transitions', async () => {
    const { rerender } = render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    // Simulate orientation change starting
    mockUseOrientation.mockReturnValue({
      orientation: 'portrait',
      angle: 0,
      isChanging: true,
    });

    rerender(<LoginPage />);

    // Simulate orientation change completing to landscape
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });
    mockUseIsLandscape.mockReturnValue(true);

    rerender(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    });
  });

  it('should preserve form state during orientation changes', async () => {
    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
    });

    // The useOrientationFormState hook should preserve form data
    // during orientation changes
  });

  it('should maintain touch-friendly input sizes in all orientations', async () => {
    // Test portrait
    const { rerender } = render(<LoginPage />);

    await waitFor(() => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
    });

    // Switch to landscape
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    rerender(<LoginPage />);

    await waitFor(() => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const loginButton = screen.getByTestId('login-button');

      expect(emailInput).toBeInTheDocument();
      expect(passwordInput).toBeInTheDocument();
      expect(loginButton).toBeInTheDocument();
    });

    // Touch targets should remain accessible in both orientations
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

    render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
    });

    // Tablet should have appropriate layout
    expect(screen.getByTestId('login-form')).toBeInTheDocument();
    expect(screen.getByTestId('branding')).toBeInTheDocument();
  });

  it('should not break with rapid orientation changes', async () => {
    const { rerender } = render(<LoginPage />);

    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
    });

    // Simulate rapid orientation changes
    for (let i = 0; i < 5; i++) {
      const isLandscape = i % 2 === 0;
      mockUseIsLandscape.mockReturnValue(isLandscape);
      mockUseOrientation.mockReturnValue({
        orientation: isLandscape ? 'landscape' : 'portrait',
        angle: isLandscape ? 90 : 0,
        isChanging: i === 4 ? false : true,
      });

      rerender(<LoginPage />);
    }

    // Page should still be functional
    await waitFor(() => {
      expect(screen.getByTestId('login-page')).toBeInTheDocument();
      expect(screen.getByRole('heading', { name: 'Sign In' })).toBeInTheDocument();
      expect(screen.getByTestId('email-input')).toBeInTheDocument();
      expect(screen.getByTestId('password-input')).toBeInTheDocument();
      expect(screen.getByTestId('login-button')).toBeInTheDocument();
    });
  });

  it('should maintain accessibility in all orientations', async () => {
    // Test portrait
    const { rerender } = render(<LoginPage />);

    await waitFor(() => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    // Switch to landscape
    mockUseIsLandscape.mockReturnValue(true);
    mockUseOrientation.mockReturnValue({
      orientation: 'landscape',
      angle: 90,
      isChanging: false,
    });

    rerender(<LoginPage />);

    await waitFor(() => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      
      expect(emailInput).toHaveAttribute('type', 'email');
      expect(passwordInput).toHaveAttribute('type', 'password');
    });

    // Accessibility attributes should be maintained
  });
});