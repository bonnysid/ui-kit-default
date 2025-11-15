import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Input, type InputProps } from './Input';

const meta: Meta<typeof Input> = {
  title: 'UI-Kit/Input',
  component: Input, // важно: сам компонент
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    placeholder: 'Введите текст',
  },
  render: (args: InputProps) => {
    const [value, setValue] = useState('');
    return <Input {...args} value={value} onChangeValue={setValue} />;
  },
};
