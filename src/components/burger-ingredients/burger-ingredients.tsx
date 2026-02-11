import { useMemo, useRef, useState } from 'react';

import { useAppSelector } from '@/hooks/redux-hooks';

import { IngredientsList } from './ingredients-list/ingredients-list';
import { IngredientsNavbar } from './ingredients-navbar/ingredients-navbar';

import type { FC, ReactElement } from 'react';

import type { IngredientType, RefType } from '@/utils/types';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients: FC = (): ReactElement => {
  const [activeTab, setActiveTab] = useState<'bun' | 'sauce' | 'main'>('bun');
  const { items: ingredients } = useAppSelector((state) => state.ingredients);

  const bunsRef: RefType<HTMLDivElement> = useRef(null);
  const saucesRef: RefType<HTMLDivElement> = useRef(null);
  const mainsRef: RefType<HTMLDivElement> = useRef(null);
  const containerRef: RefType<HTMLDivElement> = useRef(null);

  // Мемоизированная фильтрация ингредиентов
  const { buns, sauces, mains } = useMemo(() => {
    const result: {
      buns: IngredientType[];
      sauces: IngredientType[];
      mains: IngredientType[];
    } = { buns: [], sauces: [], mains: [] };

    if (ingredients?.length > 0) {
      for (const ingredient of ingredients) {
        if (ingredient.type === 'bun') {
          result.buns.push(ingredient);
        } else if (ingredient.type === 'main') {
          result.mains.push(ingredient);
        } else if (ingredient.type === 'sauce') {
          result.sauces.push(ingredient);
        }
      }
    }
    return result;
  }, [ingredients]);

  // Обработчик скролла для определения активного таба
  const handleScroll = (): void => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;

    const sections: { id: 'bun' | 'sauce' | 'main'; ref: RefType<HTMLDivElement> }[] = [
      { id: 'bun', ref: bunsRef },
      { id: 'sauce', ref: saucesRef },
      { id: 'main', ref: mainsRef },
    ];

    // Находим секцию, заголовок которой ближе всего к верху контейнера
    let closestSection: 'bun' | 'sauce' | 'main' = 'bun';
    let minDistance = Infinity;

    for (const section of sections) {
      if (section.ref.current) {
        const sectionTop = section.ref.current.getBoundingClientRect().top;
        const distance = Math.abs(sectionTop - containerTop);

        if (distance < minDistance) {
          minDistance = distance;
          closestSection = section.id;
        }
      }
    }

    setActiveTab(closestSection);
  };

  // Обработчик клика по табу для прокрутки к секции
  const handleTabClick = (tab: 'bun' | 'sauce' | 'main'): void => {
    const refs: Record<'bun' | 'sauce' | 'main', RefType<HTMLDivElement>> = {
      bun: bunsRef,
      sauce: saucesRef,
      main: mainsRef,
    };

    refs[tab]?.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className={styles.burger_ingredients}>
      <IngredientsNavbar activeTab={activeTab} onTabClick={handleTabClick} />
      {ingredients?.length > 0 && (
        <IngredientsList
          buns={buns}
          mains={mains}
          sauces={sauces}
          bunsRef={bunsRef}
          saucesRef={saucesRef}
          mainsRef={mainsRef}
          containerRef={containerRef}
          onScroll={handleScroll}
        />
      )}
    </section>
  );
};
