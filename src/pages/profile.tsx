import { Preloader } from '@krgaa/react-developer-burger-ui-components';
import { useEffect } from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '@/hooks/redux-hooks';
import { getUser, logout } from '@services/slices/authSlice';

import type { FC, ReactElement } from 'react';

import styles from './profile.module.css';

export const ProfilePage: FC = (): ReactElement => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { user, isLoading, refreshToken } = useAppSelector((state) => state.auth);

  // Загружаем данные пользователя при монтировании компонента
  useEffect(() => {
    // Если есть accessToken, но нет данных пользователя, загружаем их
    if (!user) {
      dispatch(getUser());
    }
  }, [dispatch, user]);

  const handleLogout = async (): Promise<void> => {
    if (refreshToken) {
      // refreshToken строка в состоянии auth
      // типизируем как never, чтобы не трогать слайс

      await dispatch(logout(refreshToken));
      navigate('/login');
    }
  };

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

          <Outlet />
        </div>
      )}
    </div>
  );
};
