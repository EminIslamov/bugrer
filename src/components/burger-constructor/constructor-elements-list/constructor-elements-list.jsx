import {
  ConstructorElement,
  DragIcon,
} from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { IngredientType } from '@/utils/types';

import styles from './constructor-elements-list.module.css';

export const ConstructorElementsList = ({ ingredients }) => {
  // Находим булку
  const bun = ingredients?.find((ingredient) => ingredient.type === 'bun');

  // Находим остальные ингредиенты (main и sauce)
  const otherIngredients =
    ingredients?.filter((ingredient) => ingredient.type !== 'bun') || [];

  return (
    <ul className={styles.constructor_elements_list}>
      {/* Верхняя булка */}
      {bun && (
        <li className={styles.bun} key={`${bun._id}-top`}>
          <ConstructorElement
            type="top"
            isLocked
            price={bun.price}
            text={`${bun.name}\n(верх)`}
            thumbnail={bun.image}
          />
        </li>
      )}

      {/* Остальные ингредиенты - скроллируемая область */}
      <li className={styles.scrollable_container}>
        <ul className={classNames('custom-scroll', styles.scrollable_list)}>
          {otherIngredients.map((ingredient, index) => (
            <li key={`${ingredient._id}-${index}`}>
              <DragIcon type="primary" />
              <span className={styles.constructor_element}>
                <ConstructorElement
                  price={ingredient.price}
                  text={ingredient.name}
                  thumbnail={ingredient.image}
                />
              </span>
            </li>
          ))}
        </ul>
      </li>

      {/* Нижняя булка */}
      {bun && (
        <li className={styles.bun} key={`${bun._id}-bottom`}>
          <ConstructorElement
            type="bottom"
            isLocked
            price={bun.price}
            text={`${bun.name}\n(низ)`}
            thumbnail={bun.image}
          />
        </li>
      )}
    </ul>
  );
};

ConstructorElementsList.propTypes = {
  ingredients: PropTypes.arrayOf(IngredientType).isRequired,
};
