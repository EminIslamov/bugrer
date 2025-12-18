import PropTypes from 'prop-types';

export const RefType = PropTypes.shape({
  current: PropTypes.instanceOf(Element),
});

// Базовые поля ингредиента для переиспользования
export const ingredientFields = {
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
};

// Тип ингредиента из API
export const IngredientType = PropTypes.shape(ingredientFields);

// Тип ингредиента в конструкторе (с uniqueId)
export const ConstructorIngredientType = PropTypes.shape({
  ...ingredientFields,
  uniqueId: PropTypes.string.isRequired,
});
