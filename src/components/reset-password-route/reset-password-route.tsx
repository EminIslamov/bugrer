import { Navigate } from 'react-router-dom';

import type { FC, ReactNode } from 'react';

type ResetPasswordRouteProps = {
  children: ReactNode;
};

export const ResetPasswordRoute: FC<ResetPasswordRouteProps> = ({ children }) => {
  const hasVisitedForgotPassword = sessionStorage.getItem('hasVisitedForgotPassword');

  if (!hasVisitedForgotPassword) {
    return <Navigate to="/forgot-password" replace />;
  }

  return <>{children}</>;
};
