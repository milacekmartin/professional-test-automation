/// <reference types="cypress" />

describe('Demo · Login — negative', () => {
  beforeEach(() => cy.visit('/'));

  it('locked_out_user is rejected', () => {
    cy.get('#user-name').type('locked_out_user');
    cy.get('#password').type('secret_sauce');
    cy.get('#login-button').click();
    cy.get('[data-test="error"]').should('contain.text', 'Sorry, this user has been locked out');
    cy.url().should('not.include', '/inventory.html');
  });

  it('wrong password is rejected', () => {
    cy.get('#user-name').type('standard_user');
    cy.get('#password').type('WRONG');
    cy.get('#login-button').click();
    cy.get('[data-test="error"]').should('contain.text', 'Username and password do not match');
  });

  it('empty username shows error', () => {
    cy.get('#login-button').click();
    cy.get('[data-test="error"]').should('contain.text', 'Username is required');
  });
});
