import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import type { Server, ServerGroup } from '../model/server.types';
import { ServerGroupPanel } from './ServerGroupPanel';

const meta: Meta<typeof ServerGroupPanel> = {
  title: 'entities/server/ServerGroupPanel',
  component: ServerGroupPanel,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ServerGroupPanel>;

// Mock 서버 생성
function createMockServers(count: number, status: 'ok' | 'warning' | 'critical' | 'inactive' = 'ok'): Server[] {
  return Array.from(
    { length: count },
    (_, i): Server => ({
      oid: i + 1,
      hostname: `server-${String(i + 1).padStart(2, '0')}`,
      ip: `10.0.1.${i + 1}`,
      status,
      osType: 'Linux',
      serverType: 'web',
      cores: 4,
    }),
  );
}

// Mock 그룹 생성
const mockGroup: ServerGroup = {
  key: 'serverType',
  name: 'web',
  servers: [...createMockServers(5, 'ok'), ...createMockServers(2, 'warning'), ...createMockServers(1, 'critical')],
  groups: [],
  summary: {
    total: 8,
    active: 8,
    warning: 2,
    critical: 1,
    warningEventCount: 2,
    criticalEventCount: 1,
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
      servers: createMockServers(5, 'ok'),
      groups: [],
      summary: { total: 5, active: 5, warning: 0, critical: 0, warningEventCount: 0, criticalEventCount: 0 },
    },
    {
      key: 'OSType',
      name: 'Windows',
      servers: [...createMockServers(2, 'ok'), ...createMockServers(1, 'warning')],
      groups: [],
      summary: { total: 3, active: 3, warning: 1, critical: 0, warningEventCount: 1, criticalEventCount: 0 },
    },
  ],
  summary: {
    total: 8,
    active: 8,
    warning: 1,
    critical: 0,
    warningEventCount: 1,
    criticalEventCount: 0,
  },
};

export const Collapsed: Story = {
  args: {
    group: mockGroup,
    isExpanded: false,
    onToggle: () => {},
    labelOption: 'hostname',
  },
};

export const Expanded: Story = {
  args: {
    group: mockGroup,
    isExpanded: true,
    onToggle: () => {},
    labelOption: 'hostname',
  },
};

export const WithSubGroups: Story = {
  args: {
    group: mockGroupWithSubGroups,
    isExpanded: true,
    onToggle: () => {},
    labelOption: 'hostname',
  },
};

export const WithCriticalStatus: Story = {
  args: {
    group: {
      ...mockGroup,
      summary: { ...mockGroup.summary, critical: 3, criticalEventCount: 3 },
    },
    isExpanded: false,
    onToggle: () => {},
    labelOption: 'hostname',
  },
};

// Interactive story
function InteractivePanel() {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className='w-full max-w-2xl'>
      <ServerGroupPanel
        group={mockGroup}
        isExpanded={expanded}
        onToggle={() => setExpanded(!expanded)}
        labelOption='hostname'
      />
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractivePanel />,
};
