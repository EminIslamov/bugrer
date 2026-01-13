import PropTypes from 'prop-types';
import { Navigate } from 'react-router-dom';

export const ResetPasswordRoute = ({ children }) => {
  const hasVisitedForgotPassword = sessionStorage.getItem('hasVisitedForgotPassword');

  if (!hasVisitedForgotPassword) {
    return <Navigate to="/forgot-password" replace />;
  }

  return children;
};

ResetPasswordRoute.propTypes = {
  children: PropTypes.node.isRequired,
};
