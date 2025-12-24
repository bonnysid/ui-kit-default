import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useMemo } from 'react';
import { Table, TableProps } from './Table';
import { TableColumnType } from './types';

const meta: Meta<typeof Table> = {
  title: 'UI-Kit/Table',
  component: Table, // важно: сам компонент
  parameters: {
    layout: 'centered',
  },
  argTypes: {},
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

type TestData = {
  id: number;
  name: string;
  age: number;
};

const data: TestData[] = [
  { id: 1, name: 'Ivan', age: 20 },
  { id: 2, name: 'Petya', age: 25 },
];

export const Primary: Story = {
  args: {},
  render: (args: TableProps<unknown>) => {
    const rowKey = useCallback((it: TestData) => String(it.id), []);

    const columns = useMemo<TableColumnType<TestData>[]>(() => {
      return [
        {
          key: 'id',
        },
        {
          key: 'name',
        },
        {
          key: 'age',
        },
      ];
    }, []);

    return <Table columns={columns} data={data} rowKey={rowKey} />;
  },
};
