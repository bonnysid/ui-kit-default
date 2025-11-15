import type { Meta, StoryObj } from '@storybook/react-vite';
import { useRef } from 'react';
import { Button, ButtonVariants } from '@/components';
import { useOpenState } from '@/hooks';
import { Modal } from './Modal';

const meta = {
  title: 'UI-Kit/Modal',
  component: Modal,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof Modal>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {
  args: {} as any,
  render: (props) => {
    const modalOpenState = useOpenState();

    return (
      <div>
        <Button text="Открыть" onClick={modalOpenState.open} />

        {modalOpenState.isOpen && (
          <Modal
            {...props}
            onClose={modalOpenState.close}
            header="Заголовок"
            footer={
              <>
                <Button
                  text="Отмена"
                  onClick={modalOpenState.close}
                  variant={ButtonVariants.SECONDARY}
                  isFullWidth
                />
                <Button text="Сохранить" onClick={modalOpenState.close} isFullWidth />
              </>
            }
          >
            Контент
          </Modal>
        )}
      </div>
    );
  },
};
