import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

import { selectIsLoggedIn } from '@services/slices/authSlice';

/**
 * Универсальный компонент для защиты маршрутов
 * @param {Object} props
 * @param {React.ReactNode} props.children
 * @param {boolean} props.anonymous - Если true, маршрут доступен только для неавторизованных пользователей
 */
export const ProtectedRoute = ({ children, anonymous = false }) => {
  const { refreshToken, isLoading, isRestoringSession } = useSelector(
    (state) => state.auth
  );
  const isLoggedIn = useSelector(selectIsLoggedIn);
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

  return children;
};

ProtectedRoute.propTypes = {
  children: PropTypes.node.isRequired,
  anonymous: PropTypes.bool,
};
