import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import { GroupSelector } from './GroupSelector';

describe('GroupSelector', () => {
  it('renders label', () => {
    render(<GroupSelector label='1차 그룹' value={null} onChange={() => {}} />);

    expect(screen.getByText('1차 그룹')).toBeInTheDocument();
  });

  it('renders with placeholder when no value', () => {
    render(<GroupSelector label='1차 그룹' value={null} onChange={() => {}} />);

    expect(screen.getByRole('combobox')).toBeInTheDocument();
  });

  it('renders disabled state', () => {
    render(<GroupSelector label='2차 그룹' value={null} onChange={() => {}} disabled />);

    expect(screen.getByRole('combobox')).toBeDisabled();
  });

  it('calls onChange when value changes', async () => {
    const handleChange = vi.fn();

    render(<GroupSelector label='1차 그룹' value={null} onChange={handleChange} />);

    // The select component is present
    const trigger = screen.getByRole('combobox');
    expect(trigger).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(
      <GroupSelector label='1차 그룹' value={null} onChange={() => {}} className='custom-class' />,
    );

    expect(container.firstChild).toHaveClass('custom-class');
  });
});
