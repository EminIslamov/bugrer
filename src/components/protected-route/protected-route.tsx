import { Navigate, useLocation } from 'react-router-dom';

import { useAppSelector } from '@/hooks/redux-hooks';
import { selectIsLoggedIn } from '@services/slices/authSlice';

import type { FC, ReactElement, ReactNode } from 'react';

type ProtectedRouteProps = {
  children: ReactNode;
  anonymous?: boolean;
};

export const ProtectedRoute: FC<ProtectedRouteProps> = ({
  children,
  anonymous = false,
}): ReactElement | null => {
  const { refreshToken, isLoading, isRestoringSession } = useAppSelector(
    (state) => state.auth
  );
  const isLoggedIn = useAppSelector(selectIsLoggedIn as never) as boolean;
  const location = useLocation();
  const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];

  // Предотвращаем редирект на логин при перезагрузке страницы во время восстановления сессии
  if (isRestoringSession || (isLoading && refreshToken && !isLoggedIn)) {
    return null;
  }

  if (anonymous && isLoggedIn) {
    // Приоритет: sessionStorage > location.state > главная страница
    const savedPath = sessionStorage.getItem('redirectAfterLogin');
    const fromState = location.state?.from?.pathname;

    let targetPath = '/';

    if (savedPath && !publicPaths.includes(savedPath)) {
      targetPath = savedPath;
      sessionStorage.removeItem('redirectAfterLogin'); // Очищаем только если используем
    } else if (fromState && !publicPaths.includes(fromState)) {
      targetPath = fromState;
    }

    return <Navigate to={targetPath} replace />;
  }

  if (!anonymous && !refreshToken) {
    // Сохраняем целевой маршрут в sessionStorage для надежности
    // Это работает даже при прямом переходе по URL после перезагрузки
    sessionStorage.setItem('redirectAfterLogin', location.pathname + location.search);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
