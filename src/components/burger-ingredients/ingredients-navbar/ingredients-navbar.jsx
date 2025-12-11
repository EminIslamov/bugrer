import { Tab } from '@krgaa/react-developer-burger-ui-components';

import styles from './ingredients-navbar.module.css';

export const IngredientsNavbar = () => {
  return (
    <nav>
      <ul className={styles.menu}>
        <Tab
          value="bun"
          active={true}
          onClick={() => {
            /* TODO */
          }}
        >
          Булки
        </Tab>
        <Tab
          value="main"
          active={false}
          onClick={() => {
            /* TODO */
          }}
        >
          Начинки
        </Tab>
        <Tab
          value="sauce"
          active={false}
          onClick={() => {
            /* TODO */
          }}
        >
          Соусы
        </Tab>
      </ul>
    </nav>
  );
};
