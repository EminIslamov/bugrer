import classNames from 'classnames';

import { IngredientCard } from './ingredient-card/ingredient-card';

import type { FC, ReactElement, UIEventHandler } from 'react';

import type { IngredientType, RefType } from '@/utils/types';

import styles from './ingredients-list.module.css';

type IngredientsListProps = {
  buns: IngredientType[];
  mains: IngredientType[];
  sauces: IngredientType[];
  bunsRef: RefType<HTMLDivElement>;
  saucesRef: RefType<HTMLDivElement>;
  mainsRef: RefType<HTMLDivElement>;
  containerRef: RefType<HTMLDivElement>;
  onScroll: UIEventHandler<HTMLDivElement>;
};

export const IngredientsList: FC<IngredientsListProps> = ({
  buns,
  mains,
  sauces,
  bunsRef,
  saucesRef,
  mainsRef,
  containerRef,
  onScroll,
}): ReactElement => {
  return (
    <div
      ref={containerRef as never}
      className={classNames('custom-scroll', styles.ingredients_list_container)}
      onScroll={onScroll}
    >
      <div className="mb-10" ref={bunsRef as never}>
        <h2 className="pt-10 pb-6">Булки</h2>
        <ul className={styles.ingredients_list}>
          {buns.map((bun) => (
            <li key={bun._id}>
              <IngredientCard ingredient={bun} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10" ref={saucesRef as never}>
        <h2 className="pb-6">Соусы</h2>
        <ul className={styles.ingredients_list}>
          {sauces.map((sauce) => (
            <li key={sauce._id}>
              <IngredientCard ingredient={sauce} />
            </li>
          ))}
        </ul>
      </div>

      <div className="mb-10" ref={mainsRef as never}>
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
