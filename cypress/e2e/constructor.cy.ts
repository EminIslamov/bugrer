/// <reference types="cypress" />

const API_URL = 'https://norma.education-services.ru/api';

describe('Constructor page', () => {
  beforeEach(() => {
    cy.intercept('GET', `${API_URL}/ingredients`, { fixture: 'ingredients.json' }).as(
      'getIngredients'
    );
    cy.intercept('POST', `${API_URL}/auth/token`, { fixture: 'auth-tokens.json' }).as(
      'refreshToken'
    );
    cy.intercept('GET', `${API_URL}/auth/user`, { fixture: 'user.json' }).as('getUser');
    cy.intercept('POST', `${API_URL}/orders`, { fixture: 'order.json' }).as(
      'createOrder'
    );

    localStorage.setItem('refreshToken', 'test-refresh-token');
    localStorage.setItem(
      'user',
      JSON.stringify({ email: 'test@test.com', name: 'Test User' })
    );

    cy.visit('/');
    cy.wait('@getIngredients');
  });

  describe('Ingredients loading', () => {
    it('should display ingredients after loading', () => {
      cy.get('[data-cy="ingredient-card"]').should('have.length.greaterThan', 0);
    });

    it('should display ingredient categories', () => {
      cy.contains('Булки').should('exist');
      cy.contains('Соусы').should('exist');
      cy.contains('Начинки').should('exist');
    });
  });

  describe('Drag and drop', () => {
    it('should drag a bun to the constructor', () => {
      const dataTransfer = new DataTransfer();

      cy.get('[data-cy="ingredient-card"][data-ingredient-type="bun"]')
        .first()
        .trigger('dragstart', { dataTransfer });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', { dataTransfer });

      cy.get('[data-cy="constructor-bun-top"]').should('exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('exist');
    });

    it('should drag a main ingredient to the constructor', () => {
      const dataTransfer = new DataTransfer();

      cy.get('[data-cy="ingredient-card"][data-ingredient-type="bun"]')
        .first()
        .trigger('dragstart', { dataTransfer });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', { dataTransfer });

      const dataTransfer2 = new DataTransfer();
      cy.get('[data-cy="ingredient-card"][data-ingredient-type="main"]')
        .first()
        .trigger('dragstart', { dataTransfer: dataTransfer2 });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: dataTransfer2,
      });

      cy.get('[data-cy="constructor-ingredients"]')
        .children()
        .should('have.length.greaterThan', 0);
    });

    it('should drag a sauce to the constructor', () => {
      const dataTransfer = new DataTransfer();

      cy.get('[data-cy="ingredient-card"][data-ingredient-type="sauce"]')
        .first()
        .trigger('dragstart', { dataTransfer });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', { dataTransfer });

      cy.get('[data-cy="constructor-ingredients"]')
        .find('li')
        .should('have.length.greaterThan', 0);
    });
  });

  describe('Ingredient modal', () => {
    it('should open ingredient details modal on click', () => {
      cy.get('[data-cy="ingredient-card"]').first().click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="ingredient-details"]').should('exist');
    });

    it('should display ingredient information in the modal', () => {
      cy.get('[data-cy="ingredient-card"]').first().click();
      cy.get('[data-cy="ingredient-details"]').within(() => {
        cy.contains('Краторная булка N-200i').should('exist');
        cy.contains('Калории,ккал').should('exist');
        cy.contains('Белки, г').should('exist');
        cy.contains('Жиры, г').should('exist');
        cy.contains('Углеводы, г').should('exist');
      });
    });

    it('should close ingredient modal on close button click', () => {
      cy.get('[data-cy="ingredient-card"]').first().click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('should close ingredient modal on overlay click', () => {
      cy.get('[data-cy="ingredient-card"]').first().click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-overlay"]').click({ force: true });
      cy.get('[data-cy="modal"]').should('not.exist');
    });

    it('should close ingredient modal on Escape key', () => {
      cy.get('[data-cy="ingredient-card"]').first().click();
      cy.get('[data-cy="modal"]').should('exist');
      cy.get('body').type('{esc}');
      cy.get('[data-cy="modal"]').should('not.exist');
    });
  });

  describe('Order creation', () => {
    it('should create an order and show order number in modal', () => {
      const bunTransfer = new DataTransfer();
      cy.get('[data-cy="ingredient-card"][data-ingredient-type="bun"]')
        .first()
        .trigger('dragstart', { dataTransfer: bunTransfer });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: bunTransfer,
      });

      const mainTransfer = new DataTransfer();
      cy.get('[data-cy="ingredient-card"][data-ingredient-type="main"]')
        .first()
        .trigger('dragstart', { dataTransfer: mainTransfer });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: mainTransfer,
      });

      cy.wait('@refreshToken');

      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="order-number"]').should('contain', '54321');
    });

    it('should close order modal and clear constructor', () => {
      const bunTransfer = new DataTransfer();
      cy.get('[data-cy="ingredient-card"][data-ingredient-type="bun"]')
        .first()
        .trigger('dragstart', { dataTransfer: bunTransfer });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: bunTransfer,
      });

      const mainTransfer = new DataTransfer();
      cy.get('[data-cy="ingredient-card"][data-ingredient-type="main"]')
        .first()
        .trigger('dragstart', { dataTransfer: mainTransfer });
      cy.get('[data-cy="constructor-drop-zone"]').trigger('drop', {
        dataTransfer: mainTransfer,
      });

      cy.wait('@refreshToken');

      cy.get('[data-cy="order-button"]').click();
      cy.wait('@createOrder');

      cy.get('[data-cy="modal"]').should('exist');
      cy.get('[data-cy="modal-close"]').click();
      cy.get('[data-cy="modal"]').should('not.exist');

      cy.get('[data-cy="constructor-bun-top"]').should('not.exist');
      cy.get('[data-cy="constructor-bun-bottom"]').should('not.exist');
    });

    it('should not allow ordering without a bun', () => {
      cy.get('[data-cy="order-button"]').should('be.disabled');
    });
  });
});
