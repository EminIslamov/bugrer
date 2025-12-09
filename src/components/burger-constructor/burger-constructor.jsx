import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import { useState } from 'react';

import { ConstructorElementsList } from './constructor-elements-list/constructor-elements-list';
import { OrderDetailsModal } from './order-details-modal/order-details-modal';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = ({ ingredients }) => {
  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);
  const [orderNumber, setOrderNumber] = useState(null);

  const handleOrderClick = () => {
    // Генерируем случайный номер заказа (в будущем здесь будет API вызов)
    const generatedOrderNumber = Math.floor(Math.random() * 1000000)
      .toString()
      .padStart(6, '0');
    setOrderNumber(generatedOrderNumber);
    setIsOrderModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalVisible(false);
  };

  return (
    <>
      <section className={styles.burger_constructor}>
        <ConstructorElementsList ingredients={ingredients} />

        <div className={styles.create_order}>
          <div className={styles.create_order_price}>
            <p className="text text_type_digits-medium">1250</p>
            <CurrencyIcon type="primary" />
          </div>

          <Button type="primary" size="large" onClick={handleOrderClick}>
            Оформить заказ
          </Button>
        </div>
      </section>

      {isOrderModalVisible && orderNumber && (
        <OrderDetailsModal orderNumber={orderNumber} onClose={handleCloseModal} />
      )}
    </>
  );
};
