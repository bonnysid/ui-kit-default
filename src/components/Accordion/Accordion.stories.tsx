import type { Meta, StoryObj } from '@storybook/react-vite';
import { Accordion, AccordionProps } from './Accordion';

const meta: Meta<typeof Accordion> = {
  title: 'UI-Kit/Accordion',
  component: Accordion,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
};
export default meta;

type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {
    header: 'Accordion',
  },
  render: (args: AccordionProps) => {
    return (
      <Accordion {...args}>
        <ul>
          <li>Test 1</li>
          <li>Test 2</li>
          <li>Test 3</li>
        </ul>
      </Accordion>
    );
  },
};
