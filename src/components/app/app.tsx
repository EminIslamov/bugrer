import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef } from 'react';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { BrowserRouter } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { AppRouter } from '@/routes/app-router';
import { AppHeader } from '@components/app-header/app-header';
import { refreshToken, getUser } from '@services/slices/authSlice';
import { fetchIngredients } from '@services/slices/ingredientsSlice';

import type { FC, ReactElement } from 'react';

import styles from './app.module.css';

export const App: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.ingredients);
  const {
    refreshToken: storedRefreshToken,
    accessToken,
    isLoading: authLoading,
    isRestoringSession,
  } = useAppSelector((state) => state.auth);
  const hasTriedRestore = useRef(false);
  const hasTriedGetUser = useRef(false);

  // Восстановление сессии при загрузке приложения (только один раз)
  useEffect(() => {
    // Если есть refreshToken, но нет accessToken, обновляем токен
    // Это происходит при перезагрузке страницы, когда accessToken теряется (он в памяти)
    if (!hasTriedRestore.current && storedRefreshToken && !accessToken && !authLoading) {
      hasTriedRestore.current = true;
      dispatch(refreshToken(storedRefreshToken as never));
    }
  }, [dispatch, storedRefreshToken, accessToken, authLoading]);

  // После успешного обновления токена получаем данные пользователя
  useEffect(() => {
    // Если токен обновлен (есть accessToken) и сессия восстановлена, получаем данные пользователя
    // Это происходит после успешного refreshToken при перезагрузке страницы
    if (
      !hasTriedGetUser.current &&
      accessToken &&
      !authLoading &&
      !isRestoringSession &&
      storedRefreshToken
    ) {
      hasTriedGetUser.current = true;
      dispatch(getUser());
    }
  }, [dispatch, accessToken, authLoading, isRestoringSession, storedRefreshToken]);

  // Сбрасываем флаг при разлогине, чтобы при следующем логине можно было получить пользователя
  useEffect(() => {
    if (!storedRefreshToken) {
      hasTriedGetUser.current = false;
      hasTriedRestore.current = false;
    }
  }, [storedRefreshToken]);

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
        <BrowserRouter>
          <DndProvider backend={HTML5Backend}>
            <div className={styles.app}>
              <AppHeader />
              <AppRouter />
            </div>
          </DndProvider>
        </BrowserRouter>
      )}
    </>
  );
};
