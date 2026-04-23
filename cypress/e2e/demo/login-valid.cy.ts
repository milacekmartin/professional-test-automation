/// <reference types="cypress" />

/**
 * DEMO · Login — valid credentials
 * Maps to landing-page checkbox "login_valid".
 */
describe('Demo · Login — valid', () => {
  it('standard_user logs in and lands on the inventory page', () => {
    cy.visit('/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
    cy.get('.inventory_item').should('have.length', 6);
  });
});
