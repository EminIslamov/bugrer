import { useLocation, useNavigate } from 'react-router-dom';

import { OrderDetails } from '@components/order-details/order-details';
import { Modal } from '@components/ui/modal/modal';

import type { FC, ReactElement } from 'react';

export const OrderModal: FC = (): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClose = (): void => {
    const background = location.state?.background;

    if (background) {
      navigate(background.pathname, { replace: true });
      return;
    }

    navigate('/', { replace: true });
  };

  return (
    <Modal onClose={handleClose}>
      <OrderDetails />
    </Modal>
  );
};
