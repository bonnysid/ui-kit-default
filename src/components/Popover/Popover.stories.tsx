import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { Button } from '@/components';
import { useOpenState } from '@/hooks';
import { Popover } from './Popover';

const PLACEMENTS = [
  'top', 'top-start', 'top-end',
  'right', 'right-start', 'right-end',
  'bottom', 'bottom-start', 'bottom-end',
  'left', 'left-start', 'left-end',
] as const;

const meta = {
  title: 'UI-Kit/Popover',
  component: Popover,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    placement: {
      options: PLACEMENTS,
      control: { type: 'select' },
    },
  },
} satisfies Meta<typeof Popover>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {} as any,
  render: (props) => {
    const popoverOpenState = useOpenState();
    const ref = useRef<HTMLButtonElement | null>(null);

    return (
      <div>
        <Button ref={ref} type="button" onClick={popoverOpenState.toggle}>
          Click me
        </Button>

        {popoverOpenState.isOpen && (
          <Popover {...props} referenceRef={ref} onClose={popoverOpenState.close}>
            <div
              style={{
                background: 'var(--color-bg-primary)',
                padding: 16,
                borderRadius: 8,
                width: 100,
              }}
            >
              test
            </div>
          </Popover>
        )}
      </div>
    );
  },
};
