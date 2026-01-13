import { Button, Input } from '@krgaa/react-developer-burger-ui-components';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { clearError, getUser, logout, updateUser } from '@services/slices/authSlice';

import styles from './profile.module.css';

export const ProfilePage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [initialName, setInitialName] = useState('');
  const [initialEmail, setInitialEmail] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isLoading, error, refreshToken } = useSelector((state) => state.auth);

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
      const userName = user.name || '';
      const userEmail = user.email || '';
      setName(userName);
      setEmail(userEmail);
      setInitialName(userName);
      setInitialEmail(userEmail);
      setPassword('');
    }
  }, [user]);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Отправляем только измененные данные
    dispatch(updateUser({ name, email, password }));
  };

  const handleCancel = () => {
    // Возвращаем к исходным значениям
    setName(initialName);
    setEmail(initialEmail);
    setPassword('');
    dispatch(clearError());
  };

  const handleLogout = async () => {
    if (refreshToken) {
      await dispatch(logout(refreshToken));
      navigate('/login');
    }
  };

  // Проверяем, были ли изменения
  const hasChanges = name !== initialName || email !== initialEmail || password !== '';

  return (
    <div className={styles.profile_container}>
      <div className={styles.profile_content}>
        <aside className={styles.sidebar}>
          <nav className={styles.nav}>
            <a
              href="/profile"
              className={`${styles.nav_link} ${styles.nav_link_active}`}
            >
              <p className="text text_type_main-medium">Профиль</p>
            </a>
            <a href="/profile/orders" className={styles.nav_link}>
              <p className="text text_type_main-medium">История заказов</p>
            </a>
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
                value={name}
                onChange={(e) => setName(e.target.value)}
                name="name"
                icon="EditIcon"
              />
            </div>

            <div className={`${styles.input_wrapper} mb-6`}>
              <Input
                type="email"
                placeholder="Логин"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                name="email"
                icon="EditIcon"
              />
            </div>

            <div className={`${styles.input_wrapper} mb-6`}>
              <Input
                type="password"
                placeholder="Пароль"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                name="password"
                icon="EditIcon"
              />
            </div>

            {error && (
              <p className="text text_type_main-default text_color_error mb-6">
                {error}
              </p>
            )}

            <div className={styles.buttons}>
              <Button
                type="secondary"
                size="medium"
                htmlType="button"
                onClick={handleCancel}
                disabled={!hasChanges || isLoading}
              >
                Отмена
              </Button>
              <Button
                type="primary"
                size="medium"
                htmlType="submit"
                disabled={!hasChanges || isLoading}
              >
                {isLoading ? 'Сохранение...' : 'Сохранить'}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
