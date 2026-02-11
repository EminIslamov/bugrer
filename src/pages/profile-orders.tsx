import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { buildIngredientsMap } from '@/utils/order';
import { OrderCard } from '@components/order-card/order-card';
import {
  profileOrdersWsClose,
  profileOrdersWsInit,
} from '@services/slices/profileOrdersSlice';

import type { FC, ReactElement } from 'react';

import type { Order } from '@/utils/types';

import styles from './profile-orders.module.css';

export const ProfileOrdersPage: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { orders } = useAppSelector((state) => state.profileOrders);
  const ingredients = useAppSelector((state) => state.ingredients.items);

  useEffect(() => {
    dispatch(profileOrdersWsInit());
    return (): void => {
      dispatch(profileOrdersWsClose());
    };
  }, [dispatch]);

  const ingredientsById = useMemo(() => buildIngredientsMap(ingredients), [ingredients]);
  const sortedOrders = useMemo(
    () => [...orders].sort((a, b) => Date.parse(b.updatedAt) - Date.parse(a.updatedAt)),
    [orders]
  );

  return (
    <div className={styles.orders_container}>
      {sortedOrders.map((order: Order) => (
        <Link
          key={order._id}
          to={`/profile/orders/${order.number}`}
          state={{ background: location }}
          className={styles.order_link}
        >
          <OrderCard order={order} ingredientsById={ingredientsById} showStatus />
        </Link>
      ))}
    </div>
  );
};
