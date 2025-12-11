import { CloseIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { useEffect } from 'react';
import { createPortal } from 'react-dom';

import { ModalOverlay } from './modal-overlay/modal-overlay';

import styles from './modal.module.css';

export const Modal = ({ children, onClose, title }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && onClose) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    document.body.style.overflow = 'hidden';

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === e.currentTarget && onClose) {
      onClose();
    }
  };

  const handleCloseClick = (e) => {
    e.stopPropagation();
    if (onClose) {
      onClose();
    }
  };

  return createPortal(
    <ModalOverlay onClose={handleOverlayClick}>
      <div className={styles.modal}>
        <button
          className={styles.close_button}
          onClick={handleCloseClick}
          type="button"
          aria-label="Закрыть"
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
    document.getElementById('modals')
  );
};

Modal.propTypes = {
  children: PropTypes.node.isRequired,
  onClose: PropTypes.func.isRequired,
  title: PropTypes.string,
};
