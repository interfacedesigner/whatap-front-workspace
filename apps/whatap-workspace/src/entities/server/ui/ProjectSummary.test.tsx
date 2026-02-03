import { render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import type { ProjectSummary as ProjectSummaryType } from '../model/server.types';
import { ProjectSummary } from './ProjectSummary';

const mockSummary: ProjectSummaryType = {
  total: 50,
  active: 47,
  totalCore: 320,
  byOS: [
    { label: 'Linux', active: 28, total: 30, totalCore: 200 },
    { label: 'Windows', active: 12, total: 12, totalCore: 64 },
    { label: 'AIX', active: 4, total: 4, totalCore: 32 },
  ],
};

describe('ProjectSummary', () => {
  it('renders total server count', () => {
    render(<ProjectSummary summary={mockSummary} />);

    expect(screen.getByText('Total')).toBeInTheDocument();
    expect(screen.getByText('50')).toBeInTheDocument();
  });

  it('renders main metric labels', () => {
    render(<ProjectSummary summary={mockSummary} />);

    // Main metrics area contains Active label
    expect(screen.getAllByText('Active').length).toBeGreaterThanOrEqual(1);
    expect(screen.getByText('47')).toBeInTheDocument();
  });

  it('renders total core count', () => {
    render(<ProjectSummary summary={mockSummary} />);

    expect(screen.getByText('Total Core')).toBeInTheDocument();
    expect(screen.getByText('320')).toBeInTheDocument();
  });

  it('renders OS breakdown section', () => {
    render(<ProjectSummary summary={mockSummary} />);

    expect(screen.getByText('OS별 현황')).toBeInTheDocument();
    expect(screen.getByText('Linux')).toBeInTheDocument();
    expect(screen.getByText('Windows')).toBeInTheDocument();
    expect(screen.getByText('AIX')).toBeInTheDocument();
  });

  it('shows OS active/total counts', () => {
    render(<ProjectSummary summary={mockSummary} />);

    // Linux: active 28, total 30
    expect(screen.getByText('28')).toBeInTheDocument();
    expect(screen.getByText('/30')).toBeInTheDocument();
  });

  it('shows inactive count when there are inactive servers', () => {
    render(<ProjectSummary summary={mockSummary} />);

    // Linux has 2 inactive servers (30 - 28)
    expect(screen.getAllByText('Inactive').length).toBeGreaterThanOrEqual(1);
  });

  it('does not show inactive count when all servers are active', () => {
    const allActiveSummary: ProjectSummaryType = {
      total: 12,
      active: 12,
      totalCore: 64,
      byOS: [{ label: 'Windows', active: 12, total: 12, totalCore: 64 }],
    };

    render(<ProjectSummary summary={allActiveSummary} />);

    // Windows has no inactive servers
    const inactiveLabels = screen.queryAllByText('Inactive');
    expect(inactiveLabels).toHaveLength(0);
  });

  it('renders OS icons', () => {
    render(<ProjectSummary summary={mockSummary} />);

    // Check for emoji icons
    expect(screen.getByRole('img', { name: 'Linux' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'Windows' })).toBeInTheDocument();
    expect(screen.getByRole('img', { name: 'AIX' })).toBeInTheDocument();
  });

  it('applies custom className', () => {
    const { container } = render(<ProjectSummary summary={mockSummary} className='custom-class' />);

    expect(container.firstChild).toHaveClass('custom-class');
  });

  it('highlights active count when less than total', () => {
    render(<ProjectSummary summary={mockSummary} />);

    // 47 active out of 50 should be highlighted
    const activeValue = screen.getByText('47');
    expect(activeValue).toHaveClass('text-yellow-500');
  });
});
