import type { Meta, StoryObj } from '@storybook/react';
import { Provider } from 'jotai';

import { ServerInventoryMapPage } from './ServerInventoryMapPage';

const meta: Meta<typeof ServerInventoryMapPage> = {
  title: 'widgets/server-inventory-map/ServerInventoryMapPage',
  component: ServerInventoryMapPage,
  tags: ['autodocs'],
  parameters: {
    layout: 'padded',
  },
  decorators: [
    (Story) => (
      <Provider>
        <div className='max-w-6xl mx-auto'>
          <Story />
        </div>
      </Provider>
    ),
  ],
};

export default meta;
type Story = StoryObj<typeof ServerInventoryMapPage>;

/** 기본 페이지 뷰 */
export const Default: Story = {
  args: {},
};

/** 커스텀 클래스 적용 */
export const WithCustomClass: Story = {
  args: {
    className: 'p-4 bg-muted/30 rounded-lg',
  },
};
