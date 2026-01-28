import { Button, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import { useCallback, useMemo } from 'react';
import { useDrop } from 'react-dnd';
import { useNavigate, useLocation } from 'react-router-dom';

import { Modal } from '@/components/ui/modal/modal';
import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { useModal } from '@hooks/useModal';
import { selectIsLoggedIn } from '@services/slices/authSlice';
import {
  addIngredient,
  clearConstructor,
  setBun,
} from '@services/slices/burgerConstructorSlice';
import { clearOrder, createOrder } from '@services/slices/orderSlice';

import { ConstructorElementsList } from './constructor-elements-list/constructor-elements-list';
import { OrderDetails } from './order-details/order-details';

import type { FC, ReactElement } from 'react';

import type { ConstructorIngredientType, IngredientType } from '@/utils/types';

import styles from './burger-constructor.module.css';

type DragItem = {
  ingredient: IngredientType;
};

export const BurgerConstructor: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { bun, ingredients } = useAppSelector((state) => state.burgerConstructor) as {
    bun: IngredientType | null;
    ingredients: ConstructorIngredientType[];
  };
  const {
    order,
    isLoading: isOrderLoading,
    error: orderError,
  } = useAppSelector(
    (state) =>
      state.order as {
        order: { order?: { number?: number } } | null;
        isLoading: boolean;
        error: string | null;
      }
  );
  const isLoggedIn = useAppSelector(selectIsLoggedIn as never) as boolean;

  const { isModalOpen, openModal, closeModal } = useModal();

  // Расчёт общей стоимости
  const totalPrice = useMemo(() => {
    const bunPrice = bun ? bun.price * 2 : 0; // Две булки: верх и низ
    const ingredientsPrice = ingredients.reduce((sum, item) => sum + item.price, 0);
    return bunPrice + ingredientsPrice;
  }, [bun, ingredients]);

  const [{ isHover }, dropRef] = useDrop<
    DragItem,
    void,
    {
      isHover: boolean;
    }
  >({
    accept: 'ingredient',
    drop: (item) => {
      const { ingredient } = item;
      if (ingredient.type === 'bun') {
        dispatch(setBun(ingredient));
      } else {
        // Добавляем уникальный id для возможности удаления конкретного элемента
        dispatch(
          addIngredient({
            ...(ingredient as IngredientType),
            uniqueId: crypto.randomUUID(),
          })
        );
      }
    },
    collect: (monitor) => ({
      isHover: monitor.isOver(),
    }),
  });

  const handleOrderClick = (): void => {
    if (!bun) return;

    // Проверяем авторизацию перед отправкой заказа
    if (!isLoggedIn) {
      // Сохраняем текущий путь в sessionStorage для надежности
      sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
      navigate('/login', { state: { from: location } });
      return;
    }

    // Собираем ID всех ингредиентов: булка (верх) + начинки + булка (низ)
    const ingredientIds: string[] = [
      bun._id,
      ...ingredients.map((item) => item._id),
      bun._id,
    ];

    dispatch(createOrder(ingredientIds as never));
    openModal();
  };

  const handleCloseModal = useCallback(() => {
    closeModal();
    // Очищаем заказ и конструктор после закрытия модалки
    if (order) {
      dispatch(clearOrder());
      dispatch(clearConstructor());
    }
  }, [closeModal, dispatch, order]);

  return (
    <>
      <section
        ref={dropRef as never}
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

      {isModalOpen && (
        <Modal onClose={handleCloseModal}>
          <OrderDetails
            orderNumber={order?.order?.number}
            isLoading={isOrderLoading}
            error={orderError as string | null}
          />
        </Modal>
      )}
    </>
  );
};
