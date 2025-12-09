import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';

import styles from './constructor-elements-list.module.css';

export const ConstructorElementsList = ({ ingredients }) => {
  const handleClose = (id) => {
    console.log(id);
  };
  return (
    <ul className={classNames('custom-scroll', styles.constructor_elements_list)}>
      {ingredients?.length > 0 &&
        ingredients?.map((ingredient, index) => (
          <li key={ingredient._id}>
            <ConstructorElement
              key={ingredient._id}
              type={
                index === 0 ? 'top' : index === ingredients.length - 1 ? 'bottom' : null
              }
              handleClose={() => handleClose(ingredient._id)}
              isLocked
              price={ingredient.price}
              text={ingredient.name}
              thumbnail={ingredient.image}
            />
          </li>
        ))}
    </ul>
  );
};
