import { useLocation } from 'react-router-dom';

import { Home } from '@components/home/home';
import { IngredientModal } from '@components/ingredient-modal/ingredient-modal';
import { IngredientDetailsPage } from '@pages/ingredient-details';

export const IngredientContainer = () => {
  const location = useLocation();
  const background = location.state?.background;

  if (background) {
    return (
      <>
        <Home />
        <IngredientModal />
      </>
    );
  }

  return <IngredientDetailsPage />;
};
