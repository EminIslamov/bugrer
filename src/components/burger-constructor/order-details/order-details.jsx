import classNames from 'classnames';
import PropTypes from 'prop-types';

import CheckMarkIcon from '@img/check-mark.svg';

import styles from './order-details.module.css';

export const OrderDetails = ({ orderNumber }) => {
  return (
    <div className={classNames(styles.order_details_content, 'pt-30 pb-30')}>
      <div
        className={classNames(styles.order_number, 'text text_type_digits-large mb-2')}
      >
        {orderNumber}
      </div>
      <p className={classNames(styles.order_label, 'text text_type_main-medium mb-15')}>
        идентификатор заказа
      </p>

      <div className={styles.checkmark_container}>
        <div>
          <img src={CheckMarkIcon} alt="check mark" />
        </div>
      </div>

      <p className={classNames(styles.order_status, 'text text_type_main-default mb-2')}>
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
  );
};

OrderDetails.propTypes = {
  orderNumber: PropTypes.string.isRequired,
};
