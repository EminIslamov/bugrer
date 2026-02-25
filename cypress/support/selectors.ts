export const SELECTORS = {
  ingredientCard: '[data-cy="ingredient-card"]',
  bunCard: '[data-cy="ingredient-card"][data-ingredient-type="bun"]',
  mainCard: '[data-cy="ingredient-card"][data-ingredient-type="main"]',
  sauceCard: '[data-cy="ingredient-card"][data-ingredient-type="sauce"]',
  constructorDropZone: '[data-cy="constructor-drop-zone"]',
  constructorBunTop: '[data-cy="constructor-bun-top"]',
  constructorBunBottom: '[data-cy="constructor-bun-bottom"]',
  constructorIngredients: '[data-cy="constructor-ingredients"]',
  modal: '[data-cy="modal"]',
  modalClose: '[data-cy="modal-close"]',
  modalOverlay: '[data-cy="modal-overlay"]',
  ingredientDetails: '[data-cy="ingredient-details"]',
  orderButton: '[data-cy="order-button"]',
  orderNumber: '[data-cy="order-number"]',
} as const;

export type IngredientType = 'bun' | 'main' | 'sauce';

export const INGREDIENT_SELECTORS: Record<IngredientType, string> = {
  bun: SELECTORS.bunCard,
  main: SELECTORS.mainCard,
  sauce: SELECTORS.sauceCard,
};
