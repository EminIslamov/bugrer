import {
  CurrencyIcon,
  FormattedDate,
} from '@krgaa/react-developer-burger-ui-components';

import { getOrderIngredients, getOrderStatusText, getOrderTotal } from '@/utils/order';

import type { FC, ReactElement } from 'react';

import type { IngredientType, Order } from '@/utils/types';

import styles from './order-card.module.css';

type OrderCardProps = {
  order: Order;
  ingredientsById: Map<string, IngredientType>;
  showStatus?: boolean;
};

export const OrderCard: FC<OrderCardProps> = ({
  order,
  ingredientsById,
  showStatus = false,
}): ReactElement => {
  const orderIngredients = getOrderIngredients(order, ingredientsById);
  const visibleIngredients = orderIngredients.slice(0, 6);
  const hiddenIngredientsCount = Math.max(orderIngredients.length - 6, 0);
  const total = getOrderTotal(order, ingredientsById);
  const statusText = getOrderStatusText(order.status);

  return (
    <div className={styles.order_card}>
      <div className={styles.order_header}>
        <p className="text text_type_digits-default">#{order.number}</p>
        <p className="text text_type_main-default text_color_inactive">
          <FormattedDate date={new Date(order.createdAt)} />
        </p>
      </div>
      <p className="text text_type_main-medium">{order.name || 'Заказ'}</p>
      {showStatus && (
        <p
          className={`text text_type_main-default ${
            order.status === 'done' ? styles.order_status_done : ''
          }`}
        >
          {statusText}
        </p>
      )}
      <div className={styles.order_footer}>
        <div className={styles.ingredients_list}>
          {visibleIngredients.map((ingredient, index) => {
            const isLastVisible =
              index === visibleIngredients.length - 1 && hiddenIngredientsCount > 0;

            return (
              <div
                key={`${ingredient._id}-${index}`}
                className={styles.ingredient_item}
                style={{ zIndex: visibleIngredients.length - index }}
              >
                <img
                  src={ingredient.image_mobile ?? ingredient.image}
                  alt={ingredient.name}
                  className={styles.ingredient_image}
                />
                {isLastVisible && (
                  <div className={styles.ingredient_more}>
                    <span className="text text_type_main-default">
                      +{hiddenIngredientsCount}
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>
        <div className="text text_type_digits-default">
          {total} <CurrencyIcon type="primary" />
        </div>
      </div>
    </div>
  );
};
