/// <reference types="cypress" />

/**
 * DEMO · Intentional bug
 * Demonstrates what a test failure looks like in the report.
 * The assertion is deliberately wrong — counting 42 products on a page with 6.
 */
describe('Demo · Intentional bug', () => {
  it('finds a regression (expected-to-fail demo)', () => {
    cy.visit('/');
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.url().should('include', '/inventory.html');
    // BUG: SauceDemo shows 6 items; we assert 42 on purpose so the report
    // shows a clear "product defect found" red test.
    cy.get('.inventory_item').should('have.length', 42);
  });
});
