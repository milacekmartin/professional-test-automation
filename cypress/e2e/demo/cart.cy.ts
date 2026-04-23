/// <reference types="cypress" />

describe('Demo · Cart + checkout — positive', () => {
  beforeEach(() => {
    cy.visit('/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
  });

  it('adds Sauce Labs Backpack to cart', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack')
      .find('button.btn_inventory').click();
    cy.get('.shopping_cart_badge').should('have.text', '1');
  });

  it('completes a full checkout', () => {
    cy.contains('.inventory_item', 'Sauce Labs Backpack')
      .find('button.btn_inventory').click();
    cy.get('.shopping_cart_link').click();
    cy.url().should('include', '/cart.html');
    cy.get('#checkout').click();
    cy.get('#first-name').type('Martin');
    cy.get('#last-name').type('Milacek');
    cy.get('#postal-code').type('84104');
    cy.get('#continue').click();
    cy.url().should('include', '/checkout-step-two.html');
    cy.get('#finish').click();
    cy.url().should('include', '/checkout-complete.html');
    cy.get('.complete-header').should('contain.text', 'Thank you for your order');
  });
});
