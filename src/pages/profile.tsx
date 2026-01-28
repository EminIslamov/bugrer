import { Button, Input, Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { useForm } from '@hooks/useForm';
import { clearError, getUser, logout, updateUser } from '@services/slices/authSlice';

import type { FC, FormEvent, ReactElement } from 'react';

import styles from './profile.module.css';

type UserFormValues = {
  name?: string;
  email?: string;
  password?: string;
};

export const ProfilePage: FC = (): ReactElement => {
  const { values, handleChange, setValues } = useForm<UserFormValues>({});
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, refreshToken } = useAppSelector((state) => state.auth);

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    // Если есть accessToken, но нет данных пользователя, загружаем их
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

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
      } as never)
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

  const handleLogout = async (): Promise<void> => {
    if (refreshToken) {
      // refreshToken строка в состоянии auth
      // типизируем как never, чтобы не трогать слайс

      await dispatch(logout(refreshToken as never));
      navigate('/login');
    }
  };

  const isFormChanged =
    values.name !== (user?.name || '') ||
    values.email !== (user?.email || '') ||
    values.password !== '';

  return (
    <div className={styles.profile_container}>
      {isLoading ? (
        <Preloader />
      ) : (
        <div className={styles.profile_content}>
          <aside className={styles.sidebar}>
            <nav className={styles.nav}>
              <NavLink
                to="/profile"
                className={({ isActive }) =>
                  `${styles.nav_link} ${isActive ? styles.nav_link_active : ''}`
                }
                end
              >
                <p className="text text_type_main-medium">Профиль</p>
              </NavLink>
              <NavLink
                to="/profile/orders"
                className={({ isActive }) =>
                  `${styles.nav_link} ${isActive ? styles.nav_link_active : ''}`
                }
              >
                <p className="text text_type_main-medium">История заказов</p>
              </NavLink>
              <button type="button" className={styles.nav_link} onClick={handleLogout}>
                <p className="text text_type_main-medium text_color_inactive">Выход</p>
              </button>
            </nav>
            <p
              className={`${styles.hint} text text_type_main-default text_color_inactive mt-20`}
            >
              В этом разделе вы можете изменить свои персональные данные
            </p>
          </aside>

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
                <p className="text text_type_main-default text_color_error mb-6">
                  {error}
                </p>
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
                  <Button
                    type="primary"
                    size="medium"
                    htmlType="submit"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Сохранение...' : 'Сохранить'}
                  </Button>
                </div>
              )}
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
