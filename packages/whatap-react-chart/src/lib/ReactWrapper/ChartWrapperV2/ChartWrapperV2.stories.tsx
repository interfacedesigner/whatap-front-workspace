import { Meta, StoryObj } from '@storybook/react-vite';

import ChartWrapperV2 from './ChartWrapperV2';

const meta: Meta<typeof ChartWrapperV2> = {
  title: 'ChartWrapperV2',
  component: ChartWrapperV2,
};

export default meta;

type Story = StoryObj<typeof ChartWrapperV2>;
export const Default: Story = {
  render: () => <ChartWrapperV2 type='LineChartV2' />,
};
