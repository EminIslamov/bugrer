import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';

import {
  getOrderIngredientCounts,
  getOrderStatusText,
  getOrderTotal,
} from '@/utils/order';

import type { FC, ReactElement } from 'react';

import type { IngredientType, Order } from '@/utils/types';

import styles from './order-info.module.css';

type OrderInfoProps = {
  order: Order;
  ingredientsById: Map<string, IngredientType>;
  showStatus?: boolean;
};

export const OrderInfo: FC<OrderInfoProps> = ({
  order,
  ingredientsById,
  showStatus = true,
}): ReactElement => {
  const ingredients = getOrderIngredientCounts(order, ingredientsById);
  const total = getOrderTotal(order, ingredientsById);
  const statusText = getOrderStatusText(order.status);
  const orderNumber = `#${String(order.number).padStart(6, '0')}`;

  return (
    <div className={styles.order_info}>
      <div className={styles.order_header}>
        <p className={`text text_type_digits-default ${styles.order_number}`}>
          {orderNumber}
        </p>
        <p className={`text text_type_main-medium ${styles.order_name}`}>
          {order.name || 'Заказ'}
        </p>
        {showStatus && (
          <p
            className={`text text_type_main-default ${styles.order_status} ${
              order.status === 'done' ? styles.order_status_done : ''
            }`}
          >
            {statusText}
          </p>
        )}
      </div>

      <div>
        <p className="text text_type_main-medium mb-4">Состав:</p>
        <div className={styles.ingredients_list}>
          {ingredients.map(({ ingredient, count }) => (
            <div key={ingredient._id} className={styles.ingredient_row}>
              <div className={styles.ingredient_info}>
                <div className={styles.ingredient_image_wrapper}>
                  <img
                    src={ingredient.image_mobile ?? ingredient.image}
                    alt={ingredient.name}
                    className={styles.ingredient_image}
                  />
                </div>
                <p className="text text_type_main-default">{ingredient.name}</p>
              </div>
              <p className={`text text_type_digits-default ${styles.ingredient_price}`}>
                {count} x {ingredient.price} <CurrencyIcon type="primary" />
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.order_footer}>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </p>
        <p className={`text text_type_digits-default ${styles.order_total}`}>
          {total} <CurrencyIcon type="primary" />
        </p>
      </div>
    </div>
  );
};
