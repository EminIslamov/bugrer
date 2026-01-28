import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';

import CheckMarkIcon from '@img/check-mark.svg';

import type { FC, ReactElement } from 'react';

import styles from './order-details.module.css';

type OrderDetailsProps = {
  orderNumber: number | null | undefined;
  isLoading?: boolean;
  error?: string | null;
};

export const OrderDetails: FC<OrderDetailsProps> = ({
  orderNumber,
  isLoading = false,
  error = null,
}): ReactElement => {
  if (isLoading) {
    return (
      <div className={classNames(styles.order_details_content, 'pt-30 pb-30')}>
        <Preloader />
        <p className="text text_type_main-medium mt-10">Оформляем заказ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={classNames(styles.order_details_content, 'pt-30 pb-30')}>
        <p className="text text_type_main-medium text_color_error">
          Ошибка при оформлении заказа
        </p>
        <p className="text text_type_main-default text_color_inactive mt-4">{error}</p>
      </div>
    );
  }

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
