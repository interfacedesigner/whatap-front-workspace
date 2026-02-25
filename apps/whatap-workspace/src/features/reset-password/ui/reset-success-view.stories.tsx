import type { Meta, StoryObj } from '@storybook/react';
import { fn } from '@storybook/test';

import { ResetSuccessView } from './reset-success-view';

const meta: Meta<typeof ResetSuccessView> = {
  title: 'Features/ResetPassword/ResetSuccessView',
  component: ResetSuccessView,
  parameters: {
    layout: 'centered',
  },
  args: {
    onSignIn: fn(),
  },
};

export default meta;
type Story = StoryObj<typeof ResetSuccessView>;

export const Default: Story = {};
