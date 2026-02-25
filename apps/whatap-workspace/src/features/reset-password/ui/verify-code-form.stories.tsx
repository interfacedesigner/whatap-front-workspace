import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { VerifyCodeForm } from './verify-code-form';

const meta: Meta<typeof VerifyCodeForm> = {
  title: 'Features/ResetPassword/VerifyCodeForm',
  component: VerifyCodeForm,
  parameters: {
    layout: 'centered',
  },
  args: {
    maskedEmail: 'yu***@company.com',
    onVerify: fn(),
    onResend: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof VerifyCodeForm>;

export const Default: Story = {};

export const Verifying: Story = {
  args: {
    isVerifying: true,
  },
};

export const WithError: Story = {
  args: {
    error: 'Invalid code. Please try again.',
  },
};

export const Expired: Story = {
  args: {
    isExpired: true,
  },
};
