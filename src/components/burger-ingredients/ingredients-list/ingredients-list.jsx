import classNames from 'classnames';

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
              <IngredientCard
                image={bun.image}
                imageLarge={bun.image_large}
                name={bun.name}
                price={bun.price}
                calories={bun.calories}
                proteins={bun.proteins}
                fat={bun.fat}
                carbohydrates={bun.carbohydrates}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="pb-6">Соусы</h2>
        <ul className={styles.ingredients_list}>
          {sauces.map((sauce) => (
            <li key={sauce._id}>
              <IngredientCard
                image={sauce.image}
                imageLarge={sauce.image_large}
                name={sauce.name}
                price={sauce.price}
                calories={sauce.calories}
                proteins={sauce.proteins}
                fat={sauce.fat}
                carbohydrates={sauce.carbohydrates}
              />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10">
        <h2 className="pb-6">Начинки</h2>
        <ul className={styles.ingredients_list}>
          {mains.map((main) => (
            <li key={main._id}>
              <IngredientCard
                image={main.image}
                imageLarge={main.image_large}
                name={main.name}
                price={main.price}
                calories={main.calories}
                proteins={main.proteins}
                fat={main.fat}
                carbohydrates={main.carbohydrates}
              />
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};
