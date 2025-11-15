import type { Meta, StoryObj } from '@storybook/react-vite';

import { Loader } from './Loader';

const meta = {
  title: 'UI-Kit/Loader',
  component: Loader,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ['spinner', 'spinner-progress', 'spinner-filled'],
      control: { type: 'select' },
    },
  },
  args: {
    type: 'spinner',
    size: 60,
  },
} satisfies Meta<typeof Loader>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
