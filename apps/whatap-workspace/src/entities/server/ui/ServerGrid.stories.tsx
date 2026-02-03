import type { Meta, StoryObj } from '@storybook/react';

import type { Server, ServerStatus } from '../model/server.types';
import { ServerGrid } from './ServerGrid';

const meta: Meta<typeof ServerGrid> = {
  title: 'entities/server/ServerGrid',
  component: ServerGrid,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
  argTypes: {
    labelOption: {
      control: 'select',
      options: ['hostname', 'ip', 'status', null],
    },
  },
};

export default meta;
type Story = StoryObj<typeof ServerGrid>;

// Mock 서버 데이터 생성
function generateMockServers(count: number): Server[] {
  const statuses: ServerStatus[] = ['ok', 'warning', 'critical', 'inactive'];
  const osTypes: Array<Server['osType']> = ['Linux', 'Windows', 'AIX', 'HP-UX', 'Solaris'];
  const serverTypes = ['web', 'db', 'app', 'batch'];
  const coresOptions = [2, 4, 8, 16];
  const defaultGroups = ['production', 'staging', 'development'];
  const cloudRegions = ['ap-northeast-2', 'us-west-2', 'eu-west-1'];

  return Array.from({ length: count }, (_, i): Server => {
    const server: Server = {
      oid: i + 1,
      hostname: `${serverTypes[i % 4]}-prod-${String(i + 1).padStart(2, '0')}`,
      ip: `10.0.${Math.floor(i / 256)}.${i % 256}`,
      status: statuses[i % 4] ?? 'ok',
      osType: osTypes[i % 5] ?? 'Linux',
      serverType: serverTypes[i % 4] ?? 'web',
      cores: coresOptions[i % 4] ?? 4,
    };
    const dg = defaultGroups[i % 3];
    if (dg) {
      server.defaultGroup = dg;
    }
    const cr = cloudRegions[i % 3];
    if (cr) {
      server.cloudRegion = cr;
    }
    return server;
  });
}

export const Default: Story = {
  args: {
    servers: generateMockServers(12),
    labelOption: 'hostname',
  },
};

export const Empty: Story = {
  args: {
    servers: [],
    labelOption: 'hostname',
  },
};

export const FewServers: Story = {
  args: {
    servers: generateMockServers(4),
    labelOption: 'hostname',
  },
};

export const ManyServers: Story = {
  args: {
    servers: generateMockServers(50),
    labelOption: 'hostname',
  },
};

export const LabelIP: Story = {
  args: {
    servers: generateMockServers(12),
    labelOption: 'ip',
  },
};

export const LabelStatus: Story = {
  args: {
    servers: generateMockServers(12),
    labelOption: 'status',
  },
};

export const NoLabel: Story = {
  args: {
    servers: generateMockServers(12),
    labelOption: null,
  },
};
