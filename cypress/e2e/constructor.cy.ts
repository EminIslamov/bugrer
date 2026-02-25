/// <reference types="cypress" />

import { SELECTORS } from '../support/selectors';

describe('Constructor page', () => {
  beforeEach(() => {
    cy.intercept('GET', 'api/ingredients', { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', 'api/auth/token', { fixture: 'auth-tokens.json' }).as(
      'refreshToken'
    );
    cy.intercept('GET', 'api/auth/user', { fixture: 'user.json' });
    cy.intercept('POST', 'api/orders', { fixture: 'order.json' }).as('createOrder');

    localStorage.setItem('refreshToken', 'test-refresh-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'test@test.com', name: 'Test User' })
    );

    cy.visit('/');
    cy.wait('@getIngredients');

    cy.get(SELECTORS.ingredientCard).as('ingredientCards');
    cy.get(SELECTORS.constructorDropZone).as('dropZone');
    cy.get(SELECTORS.constructorIngredients).as('constructorIngredients');
    cy.get(SELECTORS.orderButton).as('orderButton');
  });

  describe('Ingredients loading', () => {
    it('should display ingredients after loading', () => {
      cy.get('@ingredientCards').should('have.length.greaterThan', 0);
    });

    it('should display ingredient categories', () => {
      cy.contains('Булки').should('exist');
      cy.contains('Соусы').should('exist');
      cy.contains('Начинки').should('exist');
    });
  });

  describe('Drag and drop', () => {
    it('should drag a bun to the constructor', () => {
      cy.dragIngredient('bun');

      cy.get(SELECTORS.constructorBunTop).should('exist');
      cy.get(SELECTORS.constructorBunBottom).should('exist');
    });

    it('should drag a main ingredient to the constructor', () => {
      cy.dragIngredient('bun');
      cy.dragIngredient('main');

      cy.get('@constructorIngredients').children().should('have.length.greaterThan', 0);
    });

    it('should drag a sauce to the constructor', () => {
      cy.dragIngredient('sauce');

      cy.get('@constructorIngredients').find('li').should('have.length.greaterThan', 0);
    });
  });

  describe('Ingredient modal', () => {
    it('should open ingredient details modal on click', () => {
      cy.openIngredientModal();
      cy.get(SELECTORS.ingredientDetails).should('exist');
    });

    it('should display ingredient information in the modal', () => {
      cy.get('@ingredientCards').first().click();

      cy.get(SELECTORS.ingredientDetails).within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Калории,ккал').should('exist');
        cy.contains('Белки, г').should('exist');
        cy.contains('Жиры, г').should('exist');
        cy.contains('Углеводы, г').should('exist');
      });
    });

    it('should close ingredient modal on close button click', () => {
      cy.openIngredientModal();
      cy.get(SELECTORS.modalClose).click();
      cy.get(SELECTORS.modal).should('not.exist');
    });

    it('should close ingredient modal on overlay click', () => {
      cy.openIngredientModal();
      cy.get(SELECTORS.modalOverlay).click({ force: true });
      cy.get(SELECTORS.modal).should('not.exist');
    });

    it('should close ingredient modal on Escape key', () => {
      cy.openIngredientModal();
      cy.get('body').type('{esc}');
      cy.get(SELECTORS.modal).should('not.exist');
    });
  });

  describe('Order creation', () => {
    it('should create an order and show order number in modal', () => {
      cy.setupConstructor();
      cy.wait('@refreshToken');

      cy.get('@orderButton').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.modal).should('exist');
      cy.get(SELECTORS.orderNumber).should('contain', '54321');
    });

    it('should close order modal and clear constructor', () => {
      cy.setupConstructor();
      cy.wait('@refreshToken');

      cy.get('@orderButton').click();
      cy.wait('@createOrder');

      cy.get(SELECTORS.modal).should('exist');
      cy.get(SELECTORS.modalClose).click();
      cy.get(SELECTORS.modal).should('not.exist');

      cy.get(SELECTORS.constructorBunTop).should('not.exist');
      cy.get(SELECTORS.constructorBunBottom).should('not.exist');
    });

    it('should not allow ordering without a bun', () => {
      cy.get('@orderButton').should('be.disabled');
    });
  });
});
