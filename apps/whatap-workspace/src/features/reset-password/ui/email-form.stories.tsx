import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { EmailForm } from './email-form';

const meta: Meta<typeof EmailForm> = {
  title: 'Features/ResetPassword/EmailForm',
  component: EmailForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof EmailForm>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
