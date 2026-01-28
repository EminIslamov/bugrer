import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { useForm } from '@hooks/useForm';
import { clearError, register } from '@services/slices/authSlice';

import type { FC, FormEvent, ReactElement } from 'react';

import styles from './register.module.css';

export const RegisterPage: FC = (): ReactElement => {
  const { values, handleChange } = useForm({
    name: '',
    email: '',
    password: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.auth);

  useEffect(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    dispatch(
      register({
        email: values.email,
        password: values.password,
        name: values.name,
      } as never)
    );
  };

  return (
    <div className={styles.register_container}>
      <form className={styles.register_form} onSubmit={handleSubmit}>
        <h1 className="text text_type_main-medium mb-6">Регистрация</h1>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="text"
            placeholder="Имя"
            value={values.name}
            onChange={handleChange}
            name="name"
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="email"
            placeholder="E-mail"
            value={values.email}
            onChange={handleChange}
            name="email"
            disabled={isLoading}
          />
        </div>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type={showPassword ? 'text' : 'password'}
            placeholder="Пароль"
            value={values.password}
            onChange={handleChange}
            name="password"
            icon={showPassword ? 'HideIcon' : 'ShowIcon'}
            onIconClick={() => setShowPassword(!showPassword)}
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
            disabled={isLoading || !values.name || !values.email || !values.password}
          >
            {isLoading ? 'Регистрация...' : 'Зарегистрироваться'}
          </Button>
        </div>

        <div className={styles.links}>
          <p className="text text_type_main-default text_color_inactive">
            Уже зарегистрированы?{' '}
            <Link to="/login" className={styles.link}>
              Войти
            </Link>
          </p>
        </div>
      </form>
    </div>
  );
};
