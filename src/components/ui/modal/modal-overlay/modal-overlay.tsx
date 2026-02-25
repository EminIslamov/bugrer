import type { FC, MouseEventHandler, ReactNode, ReactElement } from 'react';

import styles from './modal-overlay.module.css';

type ModalOverlayProps = {
  onClose: MouseEventHandler<HTMLDivElement>;
  children: ReactNode;
};

export const ModalOverlay: FC<ModalOverlayProps> = ({
  onClose,
  children,
}): ReactElement => {
  return (
    <div className={styles.overlay} onClick={onClose} data-cy="modal-overlay">
      {children}
    </div>
  );
};

export default ModalOverlay;
