import type { Meta, StoryObj } from '@storybook/react';

import type { ProjectSummary as ProjectSummaryType } from '../model/server.types';
import { ProjectSummary } from './ProjectSummary';

const meta: Meta<typeof ProjectSummary> = {
  title: 'entities/server/ProjectSummary',
  component: ProjectSummary,
  parameters: {
    layout: 'padded',
  },
  tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof ProjectSummary>;

const defaultSummary: ProjectSummaryType = {
  total: 50,
  active: 47,
  totalCore: 320,
  byOS: [
    { label: 'Linux', active: 28, total: 30, totalCore: 200 },
    { label: 'Windows', active: 12, total: 12, totalCore: 64 },
    { label: 'AIX', active: 4, total: 4, totalCore: 32 },
    { label: 'HP-UX', active: 2, total: 2, totalCore: 16 },
    { label: 'Solaris', active: 1, total: 2, totalCore: 8 },
  ],
};

export const Default: Story = {
  args: {
    summary: defaultSummary,
  },
};

export const AllActive: Story = {
  args: {
    summary: {
      total: 50,
      active: 50,
      totalCore: 320,
      byOS: [
        { label: 'Linux', active: 30, total: 30, totalCore: 200 },
        { label: 'Windows', active: 12, total: 12, totalCore: 64 },
        { label: 'AIX', active: 4, total: 4, totalCore: 32 },
        { label: 'HP-UX', active: 2, total: 2, totalCore: 16 },
        { label: 'Solaris', active: 2, total: 2, totalCore: 8 },
      ],
    },
  },
};

export const ManyInactive: Story = {
  args: {
    summary: {
      total: 50,
      active: 30,
      totalCore: 320,
      byOS: [
        { label: 'Linux', active: 20, total: 30, totalCore: 200 },
        { label: 'Windows', active: 5, total: 12, totalCore: 64 },
        { label: 'AIX', active: 3, total: 4, totalCore: 32 },
        { label: 'HP-UX', active: 1, total: 2, totalCore: 16 },
        { label: 'Solaris', active: 1, total: 2, totalCore: 8 },
      ],
    },
  },
};

export const SingleOS: Story = {
  args: {
    summary: {
      total: 20,
      active: 18,
      totalCore: 160,
      byOS: [{ label: 'Linux', active: 18, total: 20, totalCore: 160 }],
    },
  },
};

export const LargeScale: Story = {
  args: {
    summary: {
      total: 1000,
      active: 985,
      totalCore: 8000,
      byOS: [
        { label: 'Linux', active: 600, total: 610, totalCore: 4800 },
        { label: 'Windows', active: 250, total: 255, totalCore: 2000 },
        { label: 'AIX', active: 80, total: 80, totalCore: 640 },
        { label: 'HP-UX', active: 35, total: 35, totalCore: 360 },
        { label: 'Solaris', active: 20, total: 20, totalCore: 200 },
      ],
    },
  },
};
