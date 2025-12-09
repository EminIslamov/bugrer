import { ConstructorElement } from '@krgaa/react-developer-burger-ui-components';
import classNames from 'classnames';
import PropTypes from 'prop-types';

import styles from './constructor-elements-list.module.css';

export const ConstructorElementsList = ({ ingredients }) => {
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

const ingredientShape = PropTypes.shape({
  _id: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  type: PropTypes.oneOf(['bun', 'main', 'sauce']).isRequired,
  proteins: PropTypes.number.isRequired,
  fat: PropTypes.number.isRequired,
  carbohydrates: PropTypes.number.isRequired,
  calories: PropTypes.number.isRequired,
  price: PropTypes.number.isRequired,
  image: PropTypes.string.isRequired,
  image_mobile: PropTypes.string,
  image_large: PropTypes.string,
  __v: PropTypes.number,
});

ConstructorElementsList.propTypes = {
  ingredients: PropTypes.arrayOf(ingredientShape).isRequired,
};
