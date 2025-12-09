import classNames from 'classnames';
import PropTypes from 'prop-types';

import { Modal } from '@/components/ui/modal/modal';
import CheckMarkIcon from '@img/check-mark.svg';

import styles from './order-details-modal.module.css';

export const OrderDetailsModal = ({ orderNumber, onClose }) => {
  return (
    <Modal onClose={onClose}>
      <div className={classNames(styles.order_modal_content, 'pt-30 pb-30')}>
        <button
          className={styles.close_button}
          onClick={onClose}
          type="button"
          aria-label="Закрыть"
        >
          ×
        </button>
        <div
          className={classNames(styles.order_number, 'text text_type_digits-large mb-2')}
        >
          {orderNumber}
        </div>
        <p
          className={classNames(styles.order_label, 'text text_type_main-medium mb-15')}
        >
          идентификатор заказа
        </p>

        <div className={styles.checkmark_container}>
          <div>
            <img src={CheckMarkIcon} alt="" />
          </div>
        </div>

        <p
          className={classNames(styles.order_status, 'text text_type_main-default mb-2')}
        >
          Ваш заказ начали готовить
        </p>
        <p
          className={classNames(
            styles.order_hint,
            'text text_type_main-default text_color_inactive'
          )}
        >
          Дождитесь готовности на орбитальной станции
        </p>
      </div>
    </Modal>
  );
};

OrderDetailsModal.propTypes = {
  orderNumber: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};
