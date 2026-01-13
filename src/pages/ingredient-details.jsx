import { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';

import { IngredientsDetails } from '@components/burger-ingredients/ingredients-list/ingredients-details/ingredients-details';

import styles from './ingredient-details.module.css';

export const IngredientDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { items: ingredients, isLoading } = useSelector((state) => state.ingredients);

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
