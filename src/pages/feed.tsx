import { useEffect, useMemo } from 'react';
import { Link, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { buildIngredientsMap } from '@/utils/order';
import { OrderCard } from '@components/order-card/order-card';
import { feedWsClose, feedWsInit } from '@services/slices/feedSlice';

import type { FC, ReactElement } from 'react';

import type { Order } from '@/utils/types';

import styles from './feed.module.css';

const chunkBySize = <T,>(items: T[], size: number): T[][] => {
  const chunks: T[][] = [];
  for (let i = 0; i < items.length; i += size) {
    chunks.push(items.slice(i, i + size));
  }
  return chunks;
};

export const FeedPage: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { orders, total, totalToday } = useAppSelector((state) => state.feed);
  const ingredients = useAppSelector((state) => state.ingredients.items);

  useEffect(() => {
    dispatch(feedWsInit());
    return (): void => {
      dispatch(feedWsClose());
    };
  }, [dispatch]);

  const ingredientsById = useMemo(() => buildIngredientsMap(ingredients), [ingredients]);

  const doneOrders = useMemo(
    () => orders.filter((order) => order.status === 'done'),
    [orders]
  );
  const pendingOrders = useMemo(
    () => orders.filter((order) => order.status !== 'done'),
    [orders]
  );

  const doneChunks = useMemo(() => chunkBySize(doneOrders, 10), [doneOrders]);
  const pendingChunks = useMemo(() => chunkBySize(pendingOrders, 10), [pendingOrders]);

  return (
    <div className={styles.feed_container}>
      <section className={styles.orders_column}>
        <h1 className="text text_type_main-large">Лента заказов</h1>
        <div className={styles.orders_list}>
          {orders.map((order: Order) => (
            <Link
              key={order._id}
              to={`/feed/${order.number}`}
              state={{ background: location }}
              className={styles.order_link}
            >
              <OrderCard order={order} ingredientsById={ingredientsById} />
            </Link>
          ))}
        </div>
      </section>

      <aside className={styles.stats_column}>
        <div className={styles.status_groups}>
          <div className={styles.status_group}>
            <p className="text text_type_main-medium">Готовы:</p>
            <div className={styles.status_columns}>
              {doneChunks.map((chunk, index) => (
                <div key={`done-${index}`} className={styles.status_column}>
                  {chunk.map((order) => (
                    <p
                      key={order._id}
                      className={`text text_type_digits-default ${styles.status_done}`}
                    >
                      {order.number}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className={styles.status_group}>
            <p className="text text_type_main-medium">В работе:</p>
            <div className={styles.status_columns}>
              {pendingChunks.map((chunk, index) => (
                <div key={`pending-${index}`} className={styles.status_column}>
                  {chunk.map((order) => (
                    <p key={order._id} className="text text_type_digits-default">
                      {order.number}
                    </p>
                  ))}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div>
          <p className="text text_type_main-medium">Выполнено за все время:</p>
          <p className="text text_type_digits-large">{total}</p>
        </div>

        <div>
          <p className="text text_type_main-medium">Выполнено за сегодня:</p>
          <p className="text text_type_digits-large">{totalToday}</p>
        </div>
      </aside>
    </div>
  );
};
