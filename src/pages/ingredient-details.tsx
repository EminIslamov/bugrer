import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

import { useAppSelector } from '@/hooks/redux-hooks';
import { IngredientsDetails } from '@components/burger-ingredients/ingredients-list/ingredients-details/ingredients-details';

import type { FC, ReactElement } from 'react';

import type { IngredientType } from '@/utils/types';

import styles from './ingredient-details.module.css';

type RouteParams = {
  id: string;
};

export const IngredientDetailsPage: FC = (): ReactElement | null => {
  const { id } = useParams<RouteParams>();
  const navigate = useNavigate();
  const { items: ingredients, isLoading } = useAppSelector(
    (state) => state.ingredients
  ) as {
    items: IngredientType[];
    isLoading: boolean;
  };

  // Находим ингредиент по ID
  const ingredient = ingredients.find((item) => item._id === id);

  // Если ингредиенты загружены, но ингредиент не найден, редиректим на главную
  useEffect(() => {
    if (!isLoading && ingredients.length > 0 && !ingredient) {
      navigate('/', { replace: true });
    }
  }, [isLoading, ingredients, ingredient, navigate]);

  // Показываем загрузку или ничего, пока ингредиенты загружаются
  if (isLoading || !ingredient) {
    return null;
  }

  return (
    <div className={styles.ingredient_details_page}>
      <h1 className="text text_type_main-large mt-30 mb-5">Детали ингредиента</h1>
      <div className={styles.ingredient_details_content}>
        <IngredientsDetails ingredient={ingredient} />
      </div>
    </div>
  );
};
