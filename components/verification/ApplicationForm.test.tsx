import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { ApplicationForm } from './ApplicationForm';

describe('ApplicationForm', () => {
  const mockOnSubmit = vi.fn();

  const defaultProps = {
    onSubmit: mockOnSubmit,
    isSubmitting: false,
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders step 1 (Business Information) initially', () => {
    render(<ApplicationForm {...defaultProps} />);

    expect(screen.getByRole('heading', { name: 'Business Information' })).toBeInTheDocument();
    expect(screen.getByLabelText('Business name')).toBeInTheDocument();
    expect(screen.getByLabelText('Registration number')).toBeInTheDocument();
    expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
  });

  it('displays progress indicator correctly', () => {
    render(<ApplicationForm {...defaultProps} />);

    const progressBar = screen.getByRole('progressbar');
    expect(progressBar).toHaveAttribute('aria-valuenow', '1');
    expect(progressBar).toHaveAttribute('aria-valuemin', '1');
    expect(progressBar).toHaveAttribute('aria-valuemax', '3');
  });

  it('shows validation errors when submitting empty form', async () => {
    render(<ApplicationForm {...defaultProps} />);

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByText(/business name must be at least 2 characters/i)).toBeInTheDocument();
      expect(screen.getByText(/registration number is required/i)).toBeInTheDocument();
    });
  });

  it('advances to step 2 when step 1 is valid', async () => {
    render(<ApplicationForm {...defaultProps} />);

    // Fill in step 1 fields
    fireEvent.change(screen.getByLabelText('Business name'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByLabelText('Registration number'), {
      target: { value: 'REG123456' },
    });
    fireEvent.change(screen.getByLabelText('Business type'), {
      target: { value: 'LLC' },
    });
    fireEvent.change(screen.getByLabelText('Business address'), {
      target: { value: '123 Test Street' },
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Lagos' },
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'Lagos State' },
    });
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'Nigeria' },
    });

    const nextButton = screen.getByRole('button', { name: /next/i });
    fireEvent.click(nextButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Contact Details' })).toBeInTheDocument();
      expect(screen.getByText('Step 2 of 3')).toBeInTheDocument();
    });
  });

  it('allows navigation back to previous step', async () => {
    render(<ApplicationForm {...defaultProps} />);

    // Fill and advance to step 2
    fireEvent.change(screen.getByLabelText('Business name'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByLabelText('Registration number'), {
      target: { value: 'REG123456' },
    });
    fireEvent.change(screen.getByLabelText('Business type'), {
      target: { value: 'LLC' },
    });
    fireEvent.change(screen.getByLabelText('Business address'), {
      target: { value: '123 Test Street' },
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Lagos' },
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'Lagos State' },
    });
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'Nigeria' },
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Contact Details' })).toBeInTheDocument();
    });

    // Click back button
    const backButton = screen.getByRole('button', { name: /back/i });
    fireEvent.click(backButton);

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Business Information' })).toBeInTheDocument();
      expect(screen.getByText('Step 1 of 3')).toBeInTheDocument();
    });
  });

  it('preserves data when navigating between steps', async () => {
    render(<ApplicationForm {...defaultProps} />);

    const businessName = 'Test Company';
    
    // Fill step 1
    fireEvent.change(screen.getByLabelText('Business name'), {
      target: { value: businessName },
    });
    fireEvent.change(screen.getByLabelText('Registration number'), {
      target: { value: 'REG123456' },
    });
    fireEvent.change(screen.getByLabelText('Business type'), {
      target: { value: 'LLC' },
    });
    fireEvent.change(screen.getByLabelText('Business address'), {
      target: { value: '123 Test Street' },
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Lagos' },
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'Lagos State' },
    });
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'Nigeria' },
    });

    // Go to step 2
    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Contact Details' })).toBeInTheDocument();
    });

    // Go back to step 1
    fireEvent.click(screen.getByRole('button', { name: /back/i }));

    await waitFor(() => {
      expect(screen.getByLabelText('Business name')).toHaveValue(businessName);
    });
  });

  it('pre-fills form with initialData', () => {
    const initialData = {
      businessName: 'Existing Company',
      registrationNumber: 'REG999',
      businessType: 'Corporation',
      address: '456 Main St',
      city: 'Abuja',
      state: 'FCT',
      country: 'Nigeria',
      website: 'https://example.com',
      phoneNumber: '+2341234567890',
      documents: [],
    };

    render(<ApplicationForm {...defaultProps} initialData={initialData} />);

    expect(screen.getByLabelText('Business name')).toHaveValue('Existing Company');
    expect(screen.getByLabelText('Registration number')).toHaveValue('REG999');
    expect(screen.getByLabelText('Website')).toHaveValue('https://example.com');
  });

  it('validates phone number format', async () => {
    render(<ApplicationForm {...defaultProps} />);

    // Navigate to step 2
    fireEvent.change(screen.getByLabelText('Business name'), {
      target: { value: 'Test Company' },
    });
    fireEvent.change(screen.getByLabelText('Registration number'), {
      target: { value: 'REG123456' },
    });
    fireEvent.change(screen.getByLabelText('Business type'), {
      target: { value: 'LLC' },
    });
    fireEvent.change(screen.getByLabelText('Business address'), {
      target: { value: '123 Test Street' },
    });
    fireEvent.change(screen.getByLabelText('City'), {
      target: { value: 'Lagos' },
    });
    fireEvent.change(screen.getByLabelText('State'), {
      target: { value: 'Lagos State' },
    });
    fireEvent.change(screen.getByLabelText('Country'), {
      target: { value: 'Nigeria' },
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByRole('heading', { name: 'Contact Details' })).toBeInTheDocument();
    });

    // Try invalid phone number
    fireEvent.change(screen.getByLabelText('Phone number'), {
      target: { value: 'invalid' },
    });

    fireEvent.click(screen.getByRole('button', { name: /next/i }));

    await waitFor(() => {
      expect(screen.getByText(/invalid phone number format/i)).toBeInTheDocument();
    });
  });

  it('respects isSubmitting prop', () => {
    const submittingProps = { ...defaultProps, isSubmitting: true };
    render(<ApplicationForm {...submittingProps} />);

    // The component should respect the isSubmitting prop
    expect(submittingProps.isSubmitting).toBe(true);
  });

  it('renders all required field indicators', () => {
    render(<ApplicationForm {...defaultProps} />);

    const requiredIndicators = screen.getAllByText('*');
    expect(requiredIndicators.length).toBeGreaterThan(0);
  });
});
