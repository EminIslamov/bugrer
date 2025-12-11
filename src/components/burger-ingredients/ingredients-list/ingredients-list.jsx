import classNames from 'classnames';
import PropTypes from 'prop-types';

import { IngredientType } from '@/utils/types';

import { IngredientCard } from './ingredient-card/ingredient-card';

import styles from './ingredients-list.module.css';

export const IngredientsList = ({ buns, mains, sauces }) => {
  return (
    <div className={classNames('custom-scroll', styles.ingredients_list_container)}>
      <div className="mb-10">
        <h2 className="pt-10 pb-6">Булки</h2>
        <ul className={styles.ingredients_list}>
          {buns.map((bun) => (
            <li key={bun._id}>
              <IngredientCard ingredient={bun} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="pb-6">Соусы</h2>
        <ul className={styles.ingredients_list}>
          {sauces.map((sauce) => (
            <li key={sauce._id}>
              <IngredientCard ingredient={sauce} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="pb-6">Начинки</h2>
        <ul className={styles.ingredients_list}>
          {mains.map((main) => (
            <li key={main._id}>
              <IngredientCard ingredient={main} />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

IngredientsList.propTypes = {
  buns: PropTypes.arrayOf(IngredientType).isRequired,
  mains: PropTypes.arrayOf(IngredientType).isRequired,
  sauces: PropTypes.arrayOf(IngredientType).isRequired,
};
