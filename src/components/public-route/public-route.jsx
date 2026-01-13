import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';

export const PublicRoute = ({ children }) => {
  const { refreshToken, accessToken } = useSelector((state) => state.auth);
  const location = useLocation();

  if (refreshToken && accessToken) {
    const from = location.state?.from?.pathname;
    const publicPaths = ['/login', '/register', '/forgot-password', '/reset-password'];
    const targetPath = from && !publicPaths.includes(from) ? '/' : from || '/';
    return <Navigate to={targetPath} replace />;
  }

  return children;
};

PublicRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
