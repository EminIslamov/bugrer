import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { useDispatch, useSelector } from 'react-redux';

import { AppHeader } from '@components/app-header/app-header';
import { BurgerConstructor } from '@components/burger-constructor/burger-constructor';
import { BurgerIngredients } from '@components/burger-ingredients/burger-ingredients';
import { fetchIngredients } from '@services/slices/ingredientsSlice';

import styles from './app.module.css';

export const App = () => {
  const dispatch = useDispatch();
  const {
    items: ingredients,
    isLoading,
    error,
  } = useSelector((state) => state.ingredients);

  useEffect(() => {
    dispatch(fetchIngredients());
  }, [dispatch]);

  if (error) {
    return <p className="text text_type_main-medium">Ошибка загрузки: {error}</p>;
  }

  return (
    <>
      {isLoading && <Preloader />}
      {!isLoading && (
        <DndProvider backend={HTML5Backend}>
          <div className={styles.app}>
            <AppHeader />
            <h1 className={`${styles.title} text text_type_main-large mt-10 mb-5 pl-5`}>
              Соберите бургер
            </h1>
            <main className={`${styles.main} pl-5 pr-5`}>
              <BurgerIngredients ingredients={ingredients} />
              <BurgerConstructor />
            </main>
          </div>
        </DndProvider>
      )}
    </>
  );
};
