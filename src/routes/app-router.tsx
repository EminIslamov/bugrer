import { Route, Routes, useLocation } from 'react-router-dom';

import { Home } from '@components/home/home';
import { IngredientModal } from '@components/ingredient-modal/ingredient-modal';
import { OrderModal } from '@components/order-modal/order-modal';
import { ProtectedRoute } from '@components/protected-route/protected-route';
import { ResetPasswordRoute } from '@components/reset-password-route/reset-password-route';
import { FeedPage } from '@pages/feed';
import { ForgotPasswordPage } from '@pages/forgot-password';
import { IngredientDetailsPage } from '@pages/ingredient-details';
import { LoginPage } from '@pages/login';
import { NotFoundPage } from '@pages/not-found';
import { OrderDetailsPage } from '@pages/order-details';
import { ProfilePage } from '@pages/profile';
import { ProfileFormPage } from '@pages/profile-form';
import { ProfileOrdersPage } from '@pages/profile-orders';
import { RegisterPage } from '@pages/register';
import { ResetPasswordPage } from '@pages/reset-password';

import type { FC, ReactElement } from 'react';

export const AppRouter: FC = (): ReactElement => {
  const location = useLocation();
  // Получаем background из location.state, если он был передан
  const background = location.state?.background;

  return (
    <>
      {/* Основные маршруты - если есть background, рендерим маршрут из background, иначе текущий */}
      <Routes location={background || location}>
        <Route path="/" element={<Home />} />
        <Route path="/feed" element={<FeedPage />} />
        <Route path="/feed/:id" element={<OrderDetailsPage />} />
        <Route path="/ingredients/:id" element={<IngredientDetailsPage />} />
        <Route
          path="/login"
          element={
            <ProtectedRoute anonymous={true}>
              <LoginPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/register"
          element={
            <ProtectedRoute anonymous={true}>
              <RegisterPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/forgot-password"
          element={
            <ProtectedRoute anonymous={true}>
              <ForgotPasswordPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/reset-password"
          element={
            <ProtectedRoute anonymous={true}>
              <ResetPasswordRoute>
                <ResetPasswordPage />
              </ResetPasswordRoute>
            </ProtectedRoute>
          }
        />
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <ProfilePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<ProfileFormPage />} />
          <Route path="orders" element={<ProfileOrdersPage />} />
          <Route path="orders/:id" element={<OrderDetailsPage />} />
        </Route>
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      {/* Если есть background, показываем модальное окно поверх основного контента */}
      {background && (
        <Routes>
          <Route path="/ingredients/:id" element={<IngredientModal />} />
          <Route path="/feed/:id" element={<OrderModal />} />
          <Route path="/profile/orders/:id" element={<OrderModal />} />
        </Routes>
      )}
    </>
  );
};
