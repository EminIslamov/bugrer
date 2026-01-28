import { useNavigate, useParams, useLocation } from 'react-router-dom';

import { Modal } from '@/components/ui/modal/modal';
import { useAppSelector } from '@/hooks/redux-hooks';
import { IngredientsDetails } from '@components/burger-ingredients/ingredients-list/ingredients-details/ingredients-details';

import type { FC, ReactElement } from 'react';

import type { IngredientType } from '@/utils/types';

export const IngredientModal: FC = (): ReactElement | null => {
  const navigate = useNavigate();
  const location = useLocation();
  const { id } = useParams<{ id: string }>();
  const ingredients = useAppSelector(
    (state) => state.ingredients.items
  ) as IngredientType[];

  const ingredient = ingredients.find((item) => item._id === id);

  const handleClose = (): void => {
    const background = location.state?.background;

    if (background) {
      navigate(background.pathname, { replace: true });
      return;
    }

    navigate('/', { replace: true });
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
