import type { Meta, StoryObj } from '@storybook/react-vite';

import { fn } from 'storybook/test';
import { ICON_TYPE_NAMES } from '@/components';
import { Button, ButtonSizes, ButtonVariants } from './Button';

const meta = {
  title: 'UI-Kit/Button',
  component: Button,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: Object.values(ButtonVariants),
      control: { type: 'select' },
    },
    size: {
      options: Object.values(ButtonSizes),
      control: { type: 'select' },
    },
    prefix: {
      options: ICON_TYPE_NAMES,
      control: { type: 'select' },
    },
    suffix: {
      options: ICON_TYPE_NAMES,
      control: { type: 'select' },
    },
    type: {
      control: 'text',
    },
  },
  args: { onClick: fn() },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    variant: ButtonVariants.PRIMARY,
    text: 'Button',
  },
};

export const Secondary: Story = {
  args: {
    variant: ButtonVariants.SECONDARY,
    text: 'Button',
  },
};

export const Tertiary: Story = {
  args: {
    variant: ButtonVariants.TERTIARY,
    text: 'Button',
  },
};

export const Quaternary: Story = {
  args: {
    variant: ButtonVariants.QUATERNARY,
    text: 'Button',
  },
};
