import type { Meta, StoryObj } from '@storybook/react-vite';
import { Icon } from './Icon';
import { ICON_TYPE_NAMES } from './types';

const meta = {
  title: 'UI-Kit/Icon',
  component: Icon,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    type: {
      options: ICON_TYPE_NAMES,
      control: { type: 'select' },
    },
  },
  args: {
    type: 'edit',
    size: 60,
    style: { color: 'var(--color-icon-primary)' },
  },
} satisfies Meta<typeof Icon>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};
