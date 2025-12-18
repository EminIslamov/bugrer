import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import { ConstructorIngredientType, IngredientType } from '@/utils/types';

import { DraggableIngredient } from './draggable-ingredient/draggable-ingredient';

import styles from './constructor-elements-list.module.css';

export const ConstructorElementsList = ({ bun, ingredients }) => {
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
          {ingredients.length > 0 ? (
            ingredients.map((ingredient, index) => (
              <DraggableIngredient
                key={ingredient.uniqueId}
                ingredient={ingredient}
                index={index}
              />
            ))
          ) : (
            <li className={styles.empty_message}>
              <p className="text text_type_main-default text_color_inactive">
                Перетащите ингредиенты сюда
              </p>
            </li>
          )}
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

      {!bun && (
        <li className={styles.bun_placeholder}>
          <p className="text text_type_main-default text_color_inactive">
            Выберите булку
          </p>
        </li>
      )}
    </ul>
  );
};

ConstructorElementsList.propTypes = {
  bun: IngredientType,
  ingredients: PropTypes.arrayOf(ConstructorIngredientType).isRequired,
};

ConstructorElementsList.defaultProps = {
  bun: null,
};
