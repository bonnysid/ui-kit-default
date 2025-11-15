import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Textarea, type TextareaProps } from './Textarea';

const meta: Meta<typeof Textarea> = {
  title: 'UI-Kit/Textarea',
  component: Textarea, // важно: сам компонент
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
  render: (args: TextareaProps) => {
    const [value, setValue] = useState('');
    return <Textarea {...args} value={value} onChangeValue={setValue} />;
  },
};
