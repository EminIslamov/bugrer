import { useSelector } from 'react-redux';
import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { Modal } from '@/components/ui/modal/modal';
import { IngredientsDetails } from '@components/burger-ingredients/ingredients-list/ingredients-details/ingredients-details';

export const IngredientModal = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams();
  const { items: ingredients } = useSelector((state) => state.ingredients);

  const ingredient = ingredients.find((item) => item._id === id);

  const handleClose = () => {
    const background = location.state?.background;
    navigate(background.pathname, { replace: true });
  };

  if (!ingredient) {
    return null;
  }

  return (
    <Modal onClose={handleClose} title="Детали ингредиента">
      <IngredientsDetails ingredient={ingredient} />
    </Modal>
  );
};
