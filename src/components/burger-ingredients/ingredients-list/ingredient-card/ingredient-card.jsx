import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import { useState } from 'react';

import { IngredientsDetailModal } from '../ingredients-detail-modal/ingredients-detail-modal';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({
  image,
  name,
  price,
  imageLarge,
  calories,
  proteins,
  fat,
  carbohydrates,
}) => {
  const [ingredientModalVisible, setIngredientModalVisible] = useState(false);

  const handleClick = () => {
    setIngredientModalVisible(true);
  };

  const handleClose = () => {
    setIngredientModalVisible(false);
  };

  return (
    <>
      <div
        className={styles.ingredient_card}
        onClick={handleClick}
        role="button"
        tabIndex={0}
      >
        <div className={styles.ingredient_image}>
          <img src={image} alt={name} />
        </div>

        <div className={classNames(styles.ingredient_price, 'mb-2')}>
          <p className="text text_type_digits-default mr-2">{price}</p>
          <CurrencyIcon type="primary" />
        </div>

        <div className={styles.ingredient_name}>{name}</div>
      </div>

      {ingredientModalVisible && (
        <IngredientsDetailModal
          imageLarge={imageLarge}
          name={name}
          calories={calories}
          proteins={proteins}
          fat={fat}
          carbohydrates={carbohydrates}
          onClose={handleClose}
          visible={ingredientModalVisible}
        />
      )}
    </>
  );
};

export default IngredientCard;
