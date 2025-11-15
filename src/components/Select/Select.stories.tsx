import type { Meta, StoryObj } from '@storybook/react-vite';
import { useState } from 'react';
import { SelectOption } from '@/components';
import { Select, type SelectProps } from './Select';

const meta: Meta<typeof Select> = {
  title: 'UI-Kit/Select',
  component: Select, // важно: сам компонент
  parameters: {
    layout: 'centered',
  },
  argTypes: {
    isMulti: {
      control: { type: 'boolean' },
    },
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  // @ts-expect-error
  args: {
    placeholder: 'Выберете опцию',
  },
  render: (args: SelectProps) => {
    const [value, setValue] = useState<any>();

    const options: SelectOption[] = new Array(10).fill(1).map((it, i) => ({
      value: String(it + i),
      label: `Option ${it + i}`,
    }));

    return (
      <div style={{ minWidth: 300 }}>
        <Select {...args} value={value} onChange={setValue} options={options} />
      </div>
    );
  },
};
