import type { GroupOptionKey } from '@/entities/server';
import type { Meta, StoryObj } from '@storybook/react';
import { useState } from 'react';

import { GroupSelector } from './GroupSelector';

const meta: Meta<typeof GroupSelector> = {
  title: 'features/server-grouping/GroupSelector',
  component: GroupSelector,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof GroupSelector>;

export const Default: Story = {
  args: {
    label: '1차 그룹',
    value: null,
    onChange: () => {},
  },
};

export const WithValue: Story = {
  args: {
    label: '1차 그룹',
    value: 'serverType',
    onChange: () => {},
  },
};

export const Disabled: Story = {
  args: {
    label: '2차 그룹',
    value: null,
    onChange: () => {},
    disabled: true,
  },
};

export const WithExcludedValue: Story = {
  args: {
    label: '2차 그룹',
    value: null,
    onChange: () => {},
    excludeValues: ['serverType'],
  },
};

// Interactive story
function InteractiveGroupSelectors() {
  const [first, setFirst] = useState<GroupOptionKey | null>(null);
  const [second, setSecond] = useState<GroupOptionKey | null>(null);

  return (
    <div className='flex flex-col gap-4'>
      <GroupSelector
        label='1차 그룹'
        value={first}
        onChange={(v) => {
          setFirst(v);
          if (!v) {
            setSecond(null);
          }
        }}
      />
      <GroupSelector label='2차 그룹' value={second} onChange={setSecond} excludeValues={[first]} disabled={!first} />
      <div className='text-sm text-muted-foreground mt-4'>
        <div>1차: {first ?? '없음'}</div>
        <div>2차: {second ?? '없음'}</div>
      </div>
    </div>
  );
}

export const Interactive: Story = {
  render: () => <InteractiveGroupSelectors />,
};
