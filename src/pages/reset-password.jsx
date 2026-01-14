import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useRef, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { useForm } from '@hooks/useForm';
import {
  clearError,
  clearPasswordResetSuccess,
  resetPassword,
} from '@services/slices/authSlice';

import styles from './reset-password.module.css';

export const ResetPasswordPage = () => {
  const { values, handleChange } = useForm({ password: '', token: '' });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, passwordResetSuccess } = useSelector((state) => state.auth);
  const hasClearedInitialFlag = useRef(false);
  const hasSubmittedReset = useRef(false);

  // Сбрасываем флаг при первом монтировании, чтобы избежать редиректа при входе на страницу
  useEffect(() => {
    if (!hasClearedInitialFlag.current) {
      dispatch(clearError());
      dispatch(clearPasswordResetSuccess());
      hasClearedInitialFlag.current = true;
    }
    // Сбрасываем флаг отправки при размонтировании
    return () => {
      hasSubmittedReset.current = false;
    };
  }, [dispatch]);

  // Редирект только после успешного сброса пароля (когда passwordResetSuccess становится true после submit)
  useEffect(() => {
    // Редиректим только если:
    // 1. Флаг passwordResetSuccess = true
    // 2. Мы уже сбросили начальный флаг (т.е. были на странице)
    // 3. Мы уже отправили форму сброса пароля
    if (
      passwordResetSuccess &&
      hasClearedInitialFlag.current &&
      hasSubmittedReset.current
    ) {
      sessionStorage.removeItem('hasVisitedForgotPassword');
      const timer = setTimeout(() => {
        navigate('/login');
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [passwordResetSuccess, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    hasSubmittedReset.current = true;
    dispatch(resetPassword({ password: values.password, token: values.token }));
  };

  return (
    <div className={styles.reset_password_container}>
      <form className={styles.reset_password_form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Введите новый пароль"
            value={values.password}
            onChange={handleChange}
            name="password"
            icon={showPassword ? 'HideIcon' : 'ShowIcon'}
            onIconClick={() => setShowPassword(!showPassword)}
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="text"
            placeholder="Введите код из письма"
            value={values.token}
            onChange={handleChange}
            name="token"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}

        {passwordResetSuccess && (
          <p className="text text_type_main-default text_color_success mb-6">
            Пароль успешно изменён
          </p>
        )}

        <div className="mb-20">
          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={isLoading || !values.password || !values.token}
          >
            {isLoading ? 'Сохранение...' : 'Сохранить'}
          </Button>
        </div>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Вспомнили пароль?{' '}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
