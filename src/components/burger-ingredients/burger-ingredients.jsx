import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import { IngredientsList } from './ingredients-list/ingredients-list';
import { IngredientsNavbar } from './ingredients-navbar/ingredients-navbar';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const [buns, setBuns] = useState([]);
  const [mains, setMains] = useState([]);
  const [sauces, setSauces] = useState([]);

  useEffect(() => {
    if (ingredients?.length > 0) {
      const newBuns = [];
      const newMains = [];
      const newSauces = [];
      for (const ingredient of ingredients) {
        if (ingredient.type === 'bun') {
          newBuns.push(ingredient);
        } else if (ingredient.type === 'main') {
          newMains.push(ingredient);
        } else if (ingredient.type === 'sauce') {
          newSauces.push(ingredient);
        }
      }
      if (newBuns.length > 0) {
        setBuns(newBuns);
      } else {
        setBuns([]);
      }
      if (newMains.length > 0) {
        setMains(newMains);
      } else {
        setMains([]);
      }
      if (newSauces.length > 0) {
        setSauces(newSauces);
      } else {
        setSauces([]);
      }
    }
  }, [ingredients]);

  return (
    <section className={styles.burger_ingredients}>
      <IngredientsNavbar />
      {ingredients?.length > 0 && (
        <IngredientsList buns={buns} mains={mains} sauces={sauces} />
      )}
    </section>
  );
};

const ingredientShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['bun', 'main', 'sauce']).isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string,
  image_large: PropTypes.string,
  __v: PropTypes.number,
});

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientShape).isRequired,
};
