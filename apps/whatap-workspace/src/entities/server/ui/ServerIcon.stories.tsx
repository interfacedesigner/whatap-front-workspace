import type { Meta, StoryObj } from '@storybook/react';

import type { Server } from '../model/server.types';
import { ServerIcon } from './ServerIcon';

const meta: Meta<typeof ServerIcon> = {
  title: 'entities/server/ServerIcon',
  component: ServerIcon,
  parameters: {
    layout: 'centered',
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
type Story = StoryObj<typeof ServerIcon>;

const baseServer: Server = {
  oid: 1,
  hostname: 'web-prod-01',
  ip: '10.0.1.1',
  status: 'ok',
  osType: 'Linux',
  serverType: 'web',
  cores: 8,
  defaultGroup: 'production',
  cloudRegion: 'ap-northeast-2',
};

export const Default: Story = {
  args: {
    server: baseServer,
    labelOption: 'hostname',
  },
};

export const StatusOk: Story = {
  args: {
    server: { ...baseServer, status: 'ok' },
    labelOption: 'hostname',
  },
};

export const StatusWarning: Story = {
  args: {
    server: { ...baseServer, status: 'warning', hostname: 'db-prod-01' },
    labelOption: 'hostname',
  },
};

export const StatusCritical: Story = {
  args: {
    server: { ...baseServer, status: 'critical', hostname: 'app-prod-01' },
    labelOption: 'hostname',
  },
};

export const StatusInactive: Story = {
  args: {
    server: { ...baseServer, status: 'inactive', hostname: 'batch-dev-01' },
    labelOption: 'hostname',
  },
};

export const LabelIP: Story = {
  args: {
    server: baseServer,
    labelOption: 'ip',
  },
};

export const LabelStatus: Story = {
  args: {
    server: baseServer,
    labelOption: 'status',
  },
};

export const NoLabel: Story = {
  args: {
    server: baseServer,
    labelOption: null,
  },
};

export const AllStatuses: Story = {
  render: () => (
    <div className='flex gap-8'>
      <ServerIcon server={{ ...baseServer, status: 'ok' }} />
      <ServerIcon server={{ ...baseServer, status: 'warning', oid: 2 }} />
      <ServerIcon server={{ ...baseServer, status: 'critical', oid: 3 }} />
      <ServerIcon server={{ ...baseServer, status: 'inactive', oid: 4 }} />
    </div>
  ),
};
