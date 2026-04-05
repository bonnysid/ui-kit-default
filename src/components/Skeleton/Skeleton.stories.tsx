import type { Meta, StoryObj } from '@storybook/react-vite';
import { Skeleton, SkeletonVariants } from './Skeleton';

const meta = {
  title: 'UI-Kit/Skeleton',
  component: Skeleton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      options: Object.values(SkeletonVariants),
      control: { type: 'select' },
    },
    width: { control: 'text' },
    height: { control: 'text' },
    borderRadius: { control: 'text' },
    isAnimated: { control: 'boolean' },
  },
  args: {
    width: 200,
    height: 20,
    variant: SkeletonVariants.RECTANGLE,
    isAnimated: true,
  },
} satisfies Meta<typeof Skeleton>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Rectangle: Story = {
  args: {
    width: 300,
    height: 20,
    variant: SkeletonVariants.RECTANGLE,
  },
};

export const Circle: Story = {
  args: {
    width: 50,
    height: 50,
    variant: SkeletonVariants.CIRCLE,
  },
};

export const WithChildren: Story = {
  args: {
    width: 'fit-content',
    height: 'fit-content',
    children: <div style={{ padding: '20px', visibility: 'hidden' }}>Скрытый контент для задания размера</div>,
  },
};
