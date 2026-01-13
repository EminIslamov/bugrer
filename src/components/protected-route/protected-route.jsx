import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export const ProtectedRouteElement = ({ children }) => {
  const { refreshToken, accessToken, isLoading, isRestoringSession } = useSelector(
    (state) => state.auth
  );
  const location = useLocation();

  // Предотвращаем редирект на логин при перезагрузке страницы во время восстановления сессии
  if (isRestoringSession || (isLoading && refreshToken && !accessToken)) {
    return null;
  }

  if (!refreshToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Токен будет обновлен автоматически в App.jsx, показываем children
  // Если refreshToken невалиден, обновление завершится с ошибкой и очистит refreshToken
  return children;
};

ProtectedRouteElement.propTypes = {
  children: PropTypes.node.isRequired,
};
