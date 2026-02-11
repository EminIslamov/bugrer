import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useMemo } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import { useAppSelector } from '@/hooks/redux-hooks';
import { buildIngredientsMap } from '@/utils/order';

import { OrderInfo } from '../order-info/order-info';

import type { FC, ReactElement } from 'react';

export const OrderDetails: FC = (): ReactElement => {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const isProfile = location.pathname.startsWith('/profile/orders');
  const ordersState = useAppSelector((state) =>
    isProfile ? state.profileOrders : state.feed
  );
  const ingredients = useAppSelector((state) => state.ingredients.items);

  const order = useMemo(() => {
    if (!id) return undefined;
    const orderNumber = Number(id);
    return (
      ordersState.orders.find(
        (item) => item.number === orderNumber || item._id === id
      ) ?? undefined
    );
  }, [ordersState.orders, id]);

  if (!order) {
    if (ordersState.orders.length === 0) {
      return <Preloader />;
    }
    return (
      <p className="text text_type_main-medium text_color_inactive">Заказ не найден</p>
    );
  }

  const ingredientsById = buildIngredientsMap(ingredients);

  return <OrderInfo order={order} ingredientsById={ingredientsById} />;
};
