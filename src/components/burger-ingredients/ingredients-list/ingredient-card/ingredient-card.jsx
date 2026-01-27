import { Counter, CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import { useMemo } from 'react';
import { useDrag } from 'react-dnd';
import { useSelector } from 'react-redux';
import { useLocation, useNavigate } from 'react-router-dom';

import { IngredientType } from '@/utils/types';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient }) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Получаем данные из конструктора для подсчёта количества
  const { bun, ingredients: constructorIngredients } = useSelector(
    (state) => state.burgerConstructor
  );

  // Подсчитываем количество данного ингредиента в конструкторе
  const count = useMemo(() => {
    if (ingredient.type === 'bun') {
      // Булка считается как 2 (верх и низ)
      return bun && bun._id === ingredient._id ? 2 : 0;
    }
    return constructorIngredients.filter((item) => item._id === ingredient._id).length;
  }, [bun, constructorIngredients, ingredient._id, ingredient.type]);

  // Настройка drag
  const [{ isDragging }, dragRef] = useDrag({
    type: 'ingredient',
    item: { ingredient },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
    }),
  });

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

IngredientCard.propTypes = {
  ingredient: IngredientType.isRequired,
};

export default IngredientCard;
