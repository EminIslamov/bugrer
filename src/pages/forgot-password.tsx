import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { useForm } from '@hooks/useForm';
import { clearError, requestPasswordReset } from '@services/slices/authSlice';

import type { FC, FormEvent, ReactElement } from 'react';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage: FC = (): ReactElement => {
  const { values, handleChange } = useForm({ email: '' });
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoading, error, passwordResetSuccess } = useAppSelector(
    (state) => state.auth
  );

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  useEffect(() => {
    // Устанавливаем флаг, что пользователь был на странице forgot-password
    sessionStorage.setItem('hasVisitedForgotPassword', 'true');
  }, []);

  useEffect(() => {
    if (passwordResetSuccess) {
      navigate('/reset-password');
    }
  }, [passwordResetSuccess, navigate]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(requestPasswordReset(values.email as never));
  };

  return (
    <div className={styles.forgot_password_container}>
      <form className={styles.forgot_password_form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="email"
            placeholder="Укажите e-mail"
            value={values.email}
            onChange={handleChange}
            name="email"
            disabled={isLoading}
          />
        </div>

        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}

        <div className="mb-20">
          <Button
            type="primary"
            size="medium"
            htmlType="submit"
            disabled={isLoading || !values.email}
          >
            {isLoading ? 'Отправка...' : 'Восстановить'}
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
