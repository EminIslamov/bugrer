import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';

import { DraggableIngredient } from './draggable-ingredient/draggable-ingredient';

import type { FC, ReactElement } from 'react';

import type { ConstructorIngredientType, IngredientType } from '@/utils/types';

import styles from './constructor-elements-list.module.css';

type ConstructorElementsListProps = {
  bun: IngredientType | null;
  ingredients: ConstructorIngredientType[];
};

export const ConstructorElementsList: FC<ConstructorElementsListProps> = ({
  bun,
  ingredients,
}): ReactElement => {
  return (
    <ul className={styles.constructor_elements_list}>
      {/* Верхняя булка */}
      {bun && (
        <li className={styles.bun} key={`${bun._id}-top`} data-cy="constructor-bun-top">
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
        <ul
          className={classNames('custom-scroll', styles.scrollable_list)}
          data-cy="constructor-ingredients"
        >
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
        <li
          className={styles.bun}
          key={`${bun._id}-bottom`}
          data-cy="constructor-bun-bottom"
        >
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
