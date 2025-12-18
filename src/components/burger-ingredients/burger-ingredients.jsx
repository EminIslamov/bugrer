import PropTypes from 'prop-types';
import { useMemo, useRef, useState } from 'react';

import { IngredientType } from '@/utils/types';

import { IngredientsList } from './ingredients-list/ingredients-list';
import { IngredientsNavbar } from './ingredients-navbar/ingredients-navbar';

import styles from './burger-ingredients.module.css';

export const BurgerIngredients = ({ ingredients }) => {
  const [activeTab, setActiveTab] = useState('bun');

  const bunsRef = useRef(null);
  const saucesRef = useRef(null);
  const mainsRef = useRef(null);
  const containerRef = useRef(null);

  // Мемоизированная фильтрация ингредиентов
  const { buns, sauces, mains } = useMemo(() => {
    const result = { buns: [], sauces: [], mains: [] };
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
  const handleScroll = () => {
    if (!containerRef.current) return;

    const containerTop = containerRef.current.getBoundingClientRect().top;

    const sections = [
      { id: 'bun', ref: bunsRef },
      { id: 'sauce', ref: saucesRef },
      { id: 'main', ref: mainsRef },
    ];

    // Находим секцию, заголовок которой ближе всего к верху контейнера
    let closestSection = 'bun';
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
  const handleTabClick = (tab) => {
    const refs = {
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

BurgerIngredients.propTypes = {
  ingredients: PropTypes.arrayOf(IngredientType).isRequired,
};
