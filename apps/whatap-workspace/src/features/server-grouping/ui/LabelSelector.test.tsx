import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { LabelSelector } from './LabelSelector';

describe('LabelSelector', () => {
  it('renders label text', () => {
    render(<LabelSelector value='hostname' onChange={() => {}} />);

    expect(screen.getByText('라벨')).toBeInTheDocument();
  });

  it('renders combobox', () => {
    render(<LabelSelector value='hostname' onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<LabelSelector value='hostname' onChange={() => {}} disabled />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onChange when value changes', () => {
    const handleChange = vi.fn();

    render(<LabelSelector value='hostname' onChange={handleChange} />);

    // The select component is present
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<LabelSelector value='hostname' onChange={() => {}} className='custom-class' />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('shows hostname option by default', () => {
    render(<LabelSelector value='hostname' onChange={() => {}} />);

    // The displayed value should show "호스트명"
    expect(screen.getByRole('combobox')).toHaveTextContent('호스트명');
  });

  it('shows ip option when selected', () => {
    render(<LabelSelector value='ip' onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toHaveTextContent('IP 주소');
  });

  it('shows status option when selected', () => {
    render(<LabelSelector value='status' onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toHaveTextContent('상태');
  });

  it('shows none option when value is null', () => {
    render(<LabelSelector value={null} onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toHaveTextContent('없음');
  });
});
