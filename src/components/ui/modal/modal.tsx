import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from './modal-overlay/modal-overlay';

import type {
  FC,
  KeyboardEvent as ReactKeyboardEvent,
  MouseEvent,
  ReactNode,
  ReactElement,
} from 'react';

import styles from './modal.module.css';

type ModalProps = {
  children: ReactNode;
  onClose: () => void;
  title?: string;
};

export const Modal: FC<ModalProps> = ({ children, onClose, title }): ReactElement => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent | ReactKeyboardEvent): void => {
      // DOM listener passes native KeyboardEvent
      if ('key' in e && e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape as EventListener);
    document.body.style.overflow = 'hidden';

    return (): void => {
      document.removeEventListener('keydown', handleEscape as EventListener);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e: MouseEvent<HTMLDivElement>): void => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleCloseClick = (e: MouseEvent<HTMLButtonElement>): void => {
    e.stopPropagation();
    onClose();
  };

  const modalRoot = document.getElementById('modals') ?? document.body;

  return createPortal(
    <ModalOverlay onClose={handleOverlayClick}>
      <div className={styles.modal} data-cy="modal">
        <button
          className={styles.close_button}
          onClick={handleCloseClick}
          type="button"
          aria-label="Закрыть"
          data-cy="modal-close"
        >
          <CloseIcon type="primary" />
        </button>

        {title && (
          <h2
            className={classNames(styles.modal_title, 'p-10 text text_type_main-large')}
          >
            {title}
          </h2>
        )}

        {children}
      </div>
    </ModalOverlay>,
    modalRoot
  );
};
