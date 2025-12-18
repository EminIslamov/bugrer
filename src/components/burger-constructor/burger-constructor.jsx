import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import { useMemo, useState } from 'react';
import { useDrop } from 'react-dnd';
import { useDispatch, useSelector } from 'react-redux';

import { Modal } from '@/components/ui/modal/modal';
import {
  addIngredient,
  clearConstructor,
  setBun,
} from '@services/slices/burgerConstructorSlice';
import { clearOrder, createOrder } from '@services/slices/orderSlice';

import { ConstructorElementsList } from './constructor-elements-list/constructor-elements-list';
import { OrderDetails } from './order-details/order-details';

import styles from './burger-constructor.module.css';

export const BurgerConstructor = () => {
  const dispatch = useDispatch();
  const { bun, ingredients } = useSelector((state) => state.burgerConstructor);
  const {
    order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useSelector((state) => state.order);

  const [isOrderModalVisible, setIsOrderModalVisible] = useState(false);

  // Расчёт общей стоимости
  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0; // Две булки: верх и низ
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const [{ isHover }, dropRef] = useDrop({
    accept: 'ingredient',
    drop: (item) => {
      const { ingredient } = item;
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        // Добавляем уникальный id для возможности удаления конкретного элемента
        dispatch(addIngredient({ ...ingredient, uniqueId: crypto.randomUUID() }));
      }
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  });

  const handleOrderClick = () => {
    if (!bun) return;

    // Собираем ID всех ингредиентов: булка (верх) + начинки + булка (низ)
    const ingredientIds = [bun._id, ...ingredients.map((item) => item._id), bun._id];

    dispatch(createOrder(ingredientIds));
    setIsOrderModalVisible(true);
  };

  const handleCloseModal = () => {
    setIsOrderModalVisible(false);
    // Очищаем заказ и конструктор после закрытия модалки
    if (order) {
      dispatch(clearOrder());
      dispatch(clearConstructor());
    }
  };

  return (
    <>
      <section
        ref={dropRef}
        className={classNames(styles.burger_constructor, {
          [styles.hover]: isHover,
        })}
      >
        <ConstructorElementsList bun={bun} ingredients={ingredients} />

        <div className={styles.create_order}>
          <div className={styles.create_order_price}>
            <p className="text text_type_digits-medium">{totalPrice}</p>
            <CurrencyIcon type="primary" />
          </div>

          <Button
            type="primary"
            size="large"
            onClick={handleOrderClick}
            htmlType="button"
            disabled={!bun || isOrderLoading}
          >
            {isOrderLoading ? 'Оформление...' : 'Оформить заказ'}
          </Button>
        </div>
      </section>

      {isOrderModalVisible && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails
            orderNumber={order?.order?.number}
            isLoading={isOrderLoading}
            error={orderError}
          />
        </Modal>
      )}
    </>
  );
};
