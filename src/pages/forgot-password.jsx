import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';

import { clearError, requestPasswordReset } from '@services/slices/authSlice';

import styles from './forgot-password.module.css';

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { isLoading, error, passwordResetSuccess } = useSelector((state) => state.auth);

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

  const handleSubmit = (e) => {
    e.preventDefault();
    dispatch(requestPasswordReset(email));
  };

  return (
    <div className={styles.forgot_password_container}>
      <form className={styles.forgot_password_form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Восстановление пароля</h1>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="email"
            placeholder="Укажите e-mail"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
            disabled={isLoading || !email}
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
