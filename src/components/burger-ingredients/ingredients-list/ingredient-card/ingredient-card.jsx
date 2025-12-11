import { CurrencyIcon } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import { useState } from 'react';

import { Modal } from '@/components/ui/modal/modal';
import { IngredientType } from '@/utils/types';

import { IngredientsDetails } from '../ingredients-details/ingredients-details';

import styles from './ingredient-card.module.css';

export const IngredientCard = ({ ingredient }) => {
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
          <img src={ingredient.image} alt={ingredient.name} />
        </div>

        <div className={classNames(styles.ingredient_price, 'mb-2')}>
          <p className="text text_type_digits-default mr-2">{ingredient.price}</p>
          <CurrencyIcon type="primary" />
        </div>

        <div className={styles.ingredient_name}>{ingredient.name}</div>
      </div>

      {ingredientModalVisible && (
        <Modal onClose={handleClose} title="Детали ингредиента">
          <IngredientsDetails ingredient={ingredient} />
        </Modal>
      )}
    </>
  );
};

IngredientCard.propTypes = {
  ingredient: IngredientType.isRequired,
};

export default IngredientCard;
