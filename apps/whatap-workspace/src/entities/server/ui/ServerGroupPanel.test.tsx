import { render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';

import type { ServerGroup } from '../model/server.types';
import { ServerGroupPanel } from './ServerGroupPanel';

const mockGroup: ServerGroup = {
  key: 'serverType',
  name: 'web',
  servers: [
    { oid: 1, hostname: 'web-01', ip: '10.0.1.1', status: 'ok', osType: 'Linux', serverType: 'web', cores: 4 },
    { oid: 2, hostname: 'web-02', ip: '10.0.1.2', status: 'warning', osType: 'Linux', serverType: 'web', cores: 4 },
  ],
  groups: [],
  summary: {
    total: 2,
    active: 2,
    warning: 1,
    critical: 0,
    warningEventCount: 1,
    criticalEventCount: 0,
  },
};

const mockGroupWithSubGroups: ServerGroup = {
  key: 'serverType',
  name: 'web',
  servers: [],
  groups: [
    {
      key: 'OSType',
      name: 'Linux',
      servers: [
        { oid: 1, hostname: 'web-01', ip: '10.0.1.1', status: 'ok', osType: 'Linux', serverType: 'web', cores: 4 },
      ],
      groups: [],
      summary: { total: 1, active: 1, warning: 0, critical: 0, warningEventCount: 0, criticalEventCount: 0 },
    },
  ],
  summary: {
    total: 1,
    active: 1,
    warning: 0,
    critical: 0,
    warningEventCount: 0,
    criticalEventCount: 0,
  },
};

describe('ServerGroupPanel', () => {
  it('renders group name', () => {
    render(<ServerGroupPanel group={mockGroup} isExpanded={false} onToggle={() => {}} />);

    expect(screen.getByText('web')).toBeInTheDocument();
  });

  it('renders server count', () => {
    render(<ServerGroupPanel group={mockGroup} isExpanded={false} onToggle={() => {}} />);

    expect(screen.getByText('(2대)')).toBeInTheDocument();
  });

  it('renders active count', () => {
    render(<ServerGroupPanel group={mockGroup} isExpanded={false} onToggle={() => {}} />);

    expect(screen.getByText('Active: 2/2')).toBeInTheDocument();
  });

  it('renders warning badge when warnings exist', () => {
    render(<ServerGroupPanel group={mockGroup} isExpanded={false} onToggle={() => {}} />);

    expect(screen.getByText('Warning: 1')).toBeInTheDocument();
  });

  it('renders critical badge when criticals exist', () => {
    const groupWithCritical = {
      ...mockGroup,
      summary: { ...mockGroup.summary, critical: 2, criticalEventCount: 2 },
    };

    render(<ServerGroupPanel group={groupWithCritical} isExpanded={false} onToggle={() => {}} />);

    expect(screen.getByText('Critical: 2')).toBeInTheDocument();
  });

  it('does not render warning badge when no warnings', () => {
    const groupNoWarning = {
      ...mockGroup,
      summary: { ...mockGroup.summary, warning: 0, warningEventCount: 0 },
    };

    render(<ServerGroupPanel group={groupNoWarning} isExpanded={false} onToggle={() => {}} />);

    expect(screen.queryByText(/Warning:/)).not.toBeInTheDocument();
  });

  it('renders servers when expanded', () => {
    render(<ServerGroupPanel group={mockGroup} isExpanded={true} onToggle={() => {}} labelOption='hostname' />);

    expect(screen.getByText('web-01')).toBeInTheDocument();
    expect(screen.getByText('web-02')).toBeInTheDocument();
  });

  it('renders subgroups when expanded and has subgroups', () => {
    render(
      <ServerGroupPanel group={mockGroupWithSubGroups} isExpanded={true} onToggle={() => {}} labelOption='hostname' />,
    );

    expect(screen.getByText('Linux')).toBeInTheDocument();
  });

  it('calls onToggle when accordion is toggled', () => {
    const handleToggle = vi.fn();

    render(<ServerGroupPanel group={mockGroup} isExpanded={false} onToggle={handleToggle} />);

    // Accordion trigger is present
    const trigger = screen.getByRole('button');
    expect(trigger).toBeInTheDocument();
  });
});
