import { FC, ReactNode } from 'react';
import { Button, ButtonSizes, ButtonVariants, Portal } from '@/components';
import { bindStyles } from '@/utils';
import styles from './Modal.module.scss';

export type ModalSharedProps = {
  onClose: () => void;
};

export type ModalProps = ModalSharedProps & {
  header?: ReactNode;
  children?: ReactNode;
  footer?: ReactNode;
};

const cx = bindStyles(styles);

export const Modal: FC<ModalProps> = ({ onClose, footer, header, children }) => {
  return (
    <Portal id="modal-root">
      <div className={cx('modal-wrapper')}>
        <div className={cx('overlay')} onClick={onClose}></div>

        <div className={cx('modal')}>
          <div className={cx('header')}>
            {header}

            <Button
              className={cx('close-button')}
              prefix="close"
              size={ButtonSizes.SMALL}
              variant={ButtonVariants.TERTIARY}
              onClick={onClose}
            />
          </div>

          <div className={cx('content')}>{children}</div>

          {footer && <div className={cx('footer')}>{footer}</div>}
        </div>
      </div>
    </Portal>
  );
};
