import type { Meta, StoryObj } from '@storybook/react-vite';
import { useCallback, useMemo } from 'react';
import { Table, TableProps } from './Table';
import { usePagination } from './hooks';
import { TableColumnType } from './types';

const meta: Meta<typeof Table> = {
  title: 'UI-Kit/Table',
  component: Table, // важно: сам компонент
  parameters: {
    layout: 'padded',
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
  { id: 3, name: 'Sidor', age: 30 },
  { id: 4, name: 'Katya', age: 22 },
  { id: 5, name: 'Masha', age: 28 },
  { id: 6, name: 'Oleg', age: 35 },
  { id: 7, name: 'Dima', age: 40 },
  { id: 8, name: 'Sveta', age: 19 },
  { id: 9, name: 'Vasya', age: 33 },
  { id: 10, name: 'Lena', age: 27 },
  { id: 11, name: 'Igor', age: 31 },
  { id: 12, name: 'Anna', age: 24 },
  { id: 13, name: 'Boris', age: 45 },
  { id: 14, name: 'Zhenya', age: 26 },
  { id: 15, name: 'Rita', age: 23 },
  { id: 16, name: 'Grisha', age: 38 },
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

export const WithPagination: Story = {
  args: {},
  render: (args: TableProps<TestData>) => {
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

    const pagination = usePagination({
      totalItems: data.length,
      initialPageSize: 5,
    });

    const paginatedData = useMemo(() => {
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      return data.slice(start, end);
    }, [pagination.page, pagination.pageSize]);

    return (
      <Table
        {...args}
        columns={columns}
        data={paginatedData}
        rowKey={rowKey}
        pagination={pagination}
      />
    );
  },
};

export const Responsive: Story = {
  args: {},
  render: (args: TableProps<TestData>) => {
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

    const pagination = usePagination({
      totalItems: data.length,
      initialPageSize: 5,
    });

    const paginatedData = useMemo(() => {
      const start = (pagination.page - 1) * pagination.pageSize;
      const end = start + pagination.pageSize;
      return data.slice(start, end);
    }, [pagination.page, pagination.pageSize]);

    return (
      <div style={{ width: '400px', border: '1px solid gray' }}>
        <Table
          {...args}
          columns={columns}
          data={paginatedData}
          rowKey={rowKey}
          pagination={pagination}
        />
      </div>
    );
  },
};
