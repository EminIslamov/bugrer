import classNames from 'classnames';

import type { FC, ReactElement } from 'react';

import type { IngredientType } from '@/utils/types';

import styles from './ingredients-details.module.css';

type IngredientsDetailsProps = {
  ingredient: IngredientType;
};

export const IngredientsDetails: FC<IngredientsDetailsProps> = ({
  ingredient,
}): ReactElement => {
  return (
    <div className="pb-15" data-cy="ingredient-details">
      <div className={styles.ingredient_detail_content}>
        <img src={ingredient.image_large} alt={ingredient.name} />

        <p className="text text_type_main-medium">{ingredient.name}</p>

        <div
          className={classNames(
            styles.cpfc_details,
            'text text_type_main-default text_color_inactive '
          )}
        >
          <div className={styles.cpfc_details_item}>
            <p>Калории,ккал</p>
            <p>{ingredient.calories}</p>
          </div>

          <div className={styles.cpfc_details_item}>
            <p>Белки, г</p>
            <p>{ingredient.proteins}</p>
          </div>

          <div className={styles.cpfc_details_item}>
            <p>Жиры, г</p>
            <p>{ingredient.fat}</p>
          </div>

          <div className={styles.cpfc_details_item}>
            <p>Углеводы, г</p>
            <p>{ingredient.carbohydrates}</p>
          </div>
        </div>
      </div>
    </div>
  );
};
