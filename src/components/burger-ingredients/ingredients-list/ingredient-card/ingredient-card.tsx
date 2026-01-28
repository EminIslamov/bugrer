import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import { useMemo, useRef, type FC, type ReactElement } from 'react';
import { useDrag } from 'react-dnd';
import { useLocation, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/hooks/redux-hooks';

import type { IngredientType } from '@/utils/types';

import styles from './ingredient-card.module.css';

type IngredientCardProps = {
  ingredient: IngredientType;
};

export const IngredientCard: FC<IngredientCardProps> = ({
  ingredient,
}): ReactElement => {
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем данные из конструктора для подсчёта количества
  const { bun, ingredients: constructorIngredients } = useAppSelector(
    (state) => state.burgerConstructor
  );

  // Подсчитываем количество данного ингредиента в конструкторе
  const count = useMemo(() => {
    if (ingredient.type === 'bun') {
      // Булка считается как 2 (верх и низ)
      const typedBun = bun as IngredientType | null;
      if (typedBun !== null) {
        return typedBun._id === ingredient._id ? 2 : 0;
      }
      return 0;
    }
    return constructorIngredients.filter(
      (item: IngredientType) => '_id' in item && item._id === ingredient._id
    ).length;
  }, [bun, constructorIngredients, ingredient._id, ingredient.type]);

  // Настройка drag
  const [{ isDragging }, drag] = useDrag({
    type: 'ingredient',
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

  const dragRef = useRef<HTMLDivElement>(null);
  drag(dragRef);

  return (
    <>
      <div
        ref={dragRef}
        className={classNames(styles.ingredient_card, {
          [styles.dragging]: isDragging,
        })}
        onClick={() => {
          // Если мы на главной странице, открываем модальное окно и меняем URL
          if (location.pathname === '/') {
            navigate(`/ingredients/${ingredient._id}`, {
              state: { background: location },
            });
          } else {
            // Если мы не на главной, просто переходим на страницу
            navigate(`/ingredients/${ingredient._id}`);
          }
        }}
        role="button"
        tabIndex={0}
        style={{ opacity: isDragging ? 0.5 : 1 }}
      >
        {count > 0 && <Counter count={count} size="default" />}

        <div className={styles.ingredient_image}>
          <img src={ingredient.image} alt={ingredient.name} />
        </div>

        <div className={classNames(styles.ingredient_price, 'mb-2')}>
          <p className="text text_type_digits-default mr-2">{ingredient.price}</p>
          <CurrencyIcon type="primary" />
        </div>

        <div className={styles.ingredient_name}>{ingredient.name}</div>
      </div>
    </>
  );
};

export default IngredientCard;
