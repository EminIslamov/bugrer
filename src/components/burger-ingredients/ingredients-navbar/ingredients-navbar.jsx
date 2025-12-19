import { Tab } from '@krgaa/react-developer-burger-ui-components';
import PropTypes from 'prop-types';

import styles from './ingredients-navbar.module.css';

export const IngredientsNavbar = ({ activeTab, onTabClick }) => {
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

IngredientsNavbar.propTypes = {
  activeTab: PropTypes.oneOf(['bun', 'sauce', 'main']).isRequired,
  onTabClick: PropTypes.func.isRequired,
};
