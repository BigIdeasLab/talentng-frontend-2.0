import { render } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import { HideOnDesktop } from './HideOnDesktop';

describe('HideOnDesktop', () => {
  it('renders children with correct visibility classes', () => {
    const { container } = render(
      <HideOnDesktop>
        <div data-testid="content">Test content</div>
      </HideOnDesktop>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('block', 'lg:hidden');
  });

  it('applies custom className', () => {
    const { container } = render(
      <HideOnDesktop className="custom-class">
        <div>Test content</div>
      </HideOnDesktop>
    );

    const wrapper = container.firstChild as HTMLElement;
    expect(wrapper).toHaveClass('block', 'lg:hidden', 'custom-class');
  });

  it('renders children content', () => {
    const { getByTestId } = render(
      <HideOnDesktop>
        <div data-testid="content">Test content</div>
      </HideOnDesktop>
    );

    expect(getByTestId('content')).toBeInTheDocument();
    expect(getByTestId('content')).toHaveTextContent('Test content');
  });
});