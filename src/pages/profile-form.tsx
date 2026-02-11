import { Button, Input, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { useForm } from '@hooks/useForm';
import { clearError, updateUser } from '@services/slices/authSlice';

import type { FC, FormEvent, ReactElement } from 'react';

import styles from './profile.module.css';

type UserFormValues = {
  name?: string;
  email?: string;
  password?: string;
};

export const ProfileFormPage: FC = (): ReactElement => {
  const { values, handleChange, setValues } = useForm<UserFormValues>({});
  const dispatch = useAppDispatch();
  const { user, isLoading, error } = useAppSelector((state) => state.auth);

  // Заполняем форму данными пользователя
  useEffect(() => {
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
  }, [user, setValues]);

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    // Отправляем только измененные данные
    dispatch(
      updateUser({
        name: values.name ?? '',
        email: values.email ?? '',
        password: values.password ?? '',
      })
    );
  };

  const handleCancel = (): void => {
    // Возвращаем к исходным значениям
    if (user) {
      setValues({
        name: user.name || '',
        email: user.email || '',
        password: '',
      });
    }
    dispatch(clearError());
  };

  const isFormChanged =
    values.name !== (user?.name || '') ||
    values.email !== (user?.email || '') ||
    values.password !== '';

  return isLoading ? (
    <Preloader />
  ) : (
    <div className={styles.form_container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="text"
            placeholder="Имя"
            value={values.name || ''}
            onChange={handleChange}
            name="name"
            icon="EditIcon"
          />
        </div>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="email"
            placeholder="Логин"
            value={values.email || ''}
            onChange={handleChange}
            name="email"
            icon="EditIcon"
          />
        </div>

        <div className={`${styles.input_wrapper} mb-6`}>
          <Input
            type="password"
            placeholder="Пароль"
            value={values.password || ''}
            onChange={handleChange}
            name="password"
            icon="EditIcon"
            autoComplete="new-password"
          />
        </div>

        {error && (
          <p className="text text_type_main-default text_color_error mb-6">{error}</p>
        )}

        {isFormChanged && (
          <div className={styles.buttons}>
            <Button
              type="secondary"
              size="medium"
              htmlType="button"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Отмена
            </Button>
            <Button type="primary" size="medium" htmlType="submit" disabled={isLoading}>
              {isLoading ? 'Сохранение...' : 'Сохранить'}
            </Button>
          </div>
        )}
      </form>
    </div>
  );
};
