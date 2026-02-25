import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { NewPasswordForm } from './new-password-form';

const meta: Meta<typeof NewPasswordForm> = {
  title: 'Features/ResetPassword/NewPasswordForm',
  component: NewPasswordForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSubmit: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof NewPasswordForm>;

export const Default: Story = {};

export const Loading: Story = {
  args: {
    isLoading: true,
  },
};
