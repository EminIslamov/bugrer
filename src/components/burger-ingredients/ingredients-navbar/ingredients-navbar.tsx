import { Tab } from '@krgaa/react-developer-burger-ui-components';

import type { FC, ReactElement } from 'react';

import styles from './ingredients-navbar.module.css';

type IngredientsNavbarProps = {
  activeTab: 'bun' | 'sauce' | 'main';
  onTabClick: (tab: 'bun' | 'sauce' | 'main') => void;
};

export const IngredientsNavbar: FC<IngredientsNavbarProps> = ({
  activeTab,
  onTabClick,
}): ReactElement => {
  return (
    <nav>
      <ul className={styles.menu}>
        <Tab value="bun" active={activeTab === 'bun'} onClick={() => onTabClick('bun')}>
          Булки
        </Tab>
        <Tab
          value="sauce"
          active={activeTab === 'sauce'}
          onClick={() => onTabClick('sauce')}
        >
          Соусы
        </Tab>
        <Tab
          value="main"
          active={activeTab === 'main'}
          onClick={() => onTabClick('main')}
        >
          Начинки
        </Tab>
      </ul>
    </nav>
  );
};
