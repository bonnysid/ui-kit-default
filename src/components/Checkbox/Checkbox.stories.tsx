import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { Checkbox, type CheckboxProps } from './Checkbox';

const meta: Meta<typeof Checkbox> = {
  title: 'UI-Kit/Checkbox',
  component: Checkbox, // важно: сам компонент
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    caption: 'Чекбокс',
  },
  render: (args: CheckboxProps) => {
    const [value, setValue] = useState(false);
    return <Checkbox {...args} value={value} onChangeValue={setValue} />;
  },
};
