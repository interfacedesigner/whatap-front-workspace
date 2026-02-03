import type { IconLabelOption } from '@/entities/server';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { LabelSelector } from './LabelSelector';

const meta: Meta<typeof LabelSelector> = {
  title: 'features/server-grouping/LabelSelector',
  component: LabelSelector,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    value: {
      control: 'select',
      options: ['hostname', 'ip', 'status', null],
    },
    disabled: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof LabelSelector>;

/** 기본 상태 (hostname 선택) */
export const Default: Story = {
  args: {
    value: 'hostname',
    onChange: () => {},
  },
};

/** IP 선택 */
export const IpSelected: Story = {
  args: {
    value: 'ip',
    onChange: () => {},
  },
};

/** Status 선택 */
export const StatusSelected: Story = {
  args: {
    value: 'status',
    onChange: () => {},
  },
};

/** 라벨 없음 */
export const NoLabel: Story = {
  args: {
    value: null,
    onChange: () => {},
  },
};

/** 비활성화 상태 */
export const Disabled: Story = {
  args: {
    value: 'hostname',
    onChange: () => {},
    disabled: true,
  },
};

/** 인터랙티브 예제 */
export const Interactive: Story = {
  render: function Interactive() {
    const [value, setValue] = useState<IconLabelOption>('hostname');

    return (
      <div className='space-y-4'>
        <LabelSelector value={value} onChange={setValue} />
        <div className='text-sm text-muted-foreground'>
          선택된 값: <code>{value === null ? 'null' : value}</code>
        </div>
      </div>
    );
  },
};
