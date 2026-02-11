import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

import { useAppDispatch } from '@/hooks/redux-hooks';
import { OrderDetails } from '@components/order-details/order-details';
import { feedWsClose, feedWsInit } from '@services/slices/feedSlice';
import {
  profileOrdersWsClose,
  profileOrdersWsInit,
} from '@services/slices/profileOrdersSlice';

import type { FC, ReactElement } from 'react';

import styles from './order-details.module.css';

export const OrderDetailsPage: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const background = location.state?.background;
  const isProfile = location.pathname.startsWith('/profile/orders');
  useEffect(() => {
    if (background) return;

    dispatch(isProfile ? profileOrdersWsInit() : feedWsInit());

    return (): void => {
      dispatch(isProfile ? profileOrdersWsClose() : feedWsClose());
    };
  }, [background, dispatch, isProfile]);

  return (
    <div className={styles.order_page}>
      <OrderDetails />
    </div>
  );
};
