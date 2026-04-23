/// <reference types="cypress" />

describe('Demo · Checkout — negative (missing fields)', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.contains('.inventory_item', 'Sauce Labs Backpack')
      .find('button.btn_inventory').click();
    cy.get('.shopping_cart_link').click();
    cy.get('#checkout').click();
    cy.url().should('include', '/checkout-step-one.html');
  });

  it('missing last name is rejected', () => {
    cy.get('#first-name').type('Martin');
    cy.get('#postal-code').type('84104');
    cy.get('#continue').click();
    cy.get('[data-test="error"]').should('contain.text', 'Last Name is required');
  });

  it('missing zip code is rejected', () => {
    cy.get('#first-name').type('Martin');
    cy.get('#last-name').type('Milacek');
    cy.get('#continue').click();
    cy.get('[data-test="error"]').should('contain.text', 'Postal Code is required');
  });
});
