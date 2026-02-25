/// <reference types="cypress" />

import { SELECTORS, INGREDIENT_SELECTORS, type IngredientType } from './selectors';

declare global {
  // eslint-disable-next-line @typescript-eslint/no-namespace
  namespace Cypress {
    // eslint-disable-next-line @typescript-eslint/consistent-type-definitions
    interface Chainable {
      dragIngredient(type: IngredientType): Chainable<void>;
      setupConstructor(): Chainable<void>;
      openIngredientModal(): Chainable<void>;
    }
  }
}

Cypress.Commands.add('dragIngredient', (type: IngredientType) => {
  const dataTransfer = new DataTransfer();

  cy.get(INGREDIENT_SELECTORS[type]).first().trigger('dragstart', { dataTransfer });

  cy.get('@dropZone').trigger('drop', { dataTransfer });
});

Cypress.Commands.add('setupConstructor', () => {
  cy.dragIngredient('bun');
  cy.dragIngredient('main');
});

Cypress.Commands.add('openIngredientModal', () => {
  cy.get(SELECTORS.ingredientCard).first().click();
  cy.get(SELECTORS.modal).should('exist');
});
