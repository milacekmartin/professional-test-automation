import * as helpers from '@helpers'
import * as utils from '@utils'

/**
 * 
 * E2E scenario:
 * 
 * 1. Sign in application
 * 2. Check product list
 * 3. Add all available products to a cart
 * 4. Checkout a cart
 * 5. Finish an order
 * 
 */

describe('FE test — Shopping flow (add → checkout → order complete)', { pageLoadTimeout: 5000 }, () => {

    let items: any

    before(() => { cy.login() })

    beforeEach(() => {
        cy.allure().epic('🛒 Shopping & Checkout')
        cy.allure().feature('End-to-end purchase flow')
        cy.allure().owner('Martin Miláček')
        cy.allure().label('framework', 'Cypress')
        cy.allure().label('layer', 'UI (E2E)')
        cy.allure().label('target', 'saucedemo.com')
        cy.allure().tms('PTA-E2E-001', 'https://github.com/milacekmartin/professional-test-automation/tree/main/cypress')
    })

    it('check product list', () => {
        cy.allure().severity('normal')
        cy.allure().story('Product catalog is rendered correctly')
        cy.allure().description('Verifies that 6 products are listed with name, description, price ($-prefixed) and "Add to cart" button.')
        cy
            .getByDataTest(helpers.commons.inventory.item)
            .then(($: any) => {
                Cypress._.forEach($, ($item: any) => {
                    cy
                        .wrap($item)
                        
                        .find(helpers.commons.inventory.img + ' > a')
                        .should('have.attr', 'href', '#')

                    cy
                        .wrap($item)
                        .within(() => {
                            cy
                                .getByDataTest(helpers.commons.inventory.description)
                                .should('exist')
                                .within(() => {
                                    Cypress._.forEach([
                                        helpers.commons.inventory.desc,
                                        helpers.commons.inventory.price,
                                        
                                    ], $el => {
                                        cy
                                            .getByDataTest($el)
                                            .should('exist')
                                    })

                                    cy
                                        .getByDataTest(helpers.commons.inventory.price)
                                        .should('contain.text', '$')

                                    cy
                                        .get('button')
                                        .should('have.text', 'Add to cart')
                                })
                        })
                })
            })
    })

    it('can add all available products to a cart', () => {
        cy.allure().severity('critical')
        cy.allure().story('Add to cart')
        cy.allure().description('Adds every visible product via "Add to cart" button, verifies the cart badge count matches, then opens the cart and checks each line item.')
        cy
            .getByDataTest(helpers.commons.inventory.item)
            .then(($: any) => {
                items = $

                Cypress._.forEach($, ($item: any) => {
                    cy
                        .wrap($item)
                        .find('button')
                        .as('button')

                        .click()

                    cy
                        .get('@button')
                        .should('have.text', 'Remove')
                })

                cy
                    .get(helpers.commons.cart.container)
                    .within(() => {
                        cy
                            .getByDataTest(helpers.commons.cart.badge)
                            .should('contain.text', $.length)
                    })

                    .click()

                cy
                    .url()
                    .should('contain', helpers.commons.url.cart)

                Cypress._.forEach([
                    helpers.commons.cart.list,

                    helpers.commons.button.continueShopping,
                    helpers.commons.button.checkout

                ], $element => {
                    cy
                        .getByDataTest($element)
                        .should('exist')
                })

                cy
                    .getByDataTest(helpers.commons.inventory.item)
                    .should('have.length', $.length)
                    .then(($list: any) => {
                        Cypress._.forEach($, ($item: any, index: number) => {
                            cy
                                .wrap($item)
                                .invoke('text')
                                .then($text => {
                                    cy
                                        .wrap($list)
                                        .eq(index)
                                        .should('contain.text', $text)
                                })
                        })
                    })
            })
        
    })

    it('can checkout a cart', () => {
        cy.allure().severity('critical')
        cy.allure().story('Checkout — step one')
        cy.allure().description('Clicks Checkout on the cart, verifies URL navigates to step-one and Cancel + Continue buttons are both visible.')
        cy
            .getByDataTest(helpers.commons.button.checkout)
            .click()

        cy
            .url()
            .should('contain', helpers.commons.url.one)

        Cypress._.forEach([
            helpers.commons.button.cancel,
            helpers.commons.button.continue

        ], $item => {
            cy
                .getByDataTest($item)
                .should('exist')
        })
    })

    it('can finish an order', () => {
        cy.allure().severity('blocker')
        cy.allure().story('Checkout — finish order')
        cy.allure().description('Fills personal info (first/last name + postal code), validates step-two totals (subtotal + 8% tax = total) against each product price, clicks Finish, and asserts "Thank you for your order!" confirmation.')
        let total = 0.0

        cy
            .getByDataTest(helpers.commons.info.firstname)
            .type(utils.generateRandomString())

        cy
            .getByDataTest(helpers.commons.info.lastname)
            .type(utils.generateRandomString())

        cy
            .getByDataTest(helpers.commons.info.psc)
            .type(utils.generateRandomNumber(5))

        cy
            .getByDataTest(helpers.commons.button.continue)
            .click()

        cy
            .url()
            .should('contain', helpers.commons.url.two)

        Cypress._.forEach([
            helpers.commons.button.cancel,
            helpers.commons.button.finish

        ], $item => {
            cy
                .getByDataTest($item)
                .should('exist')
        })

        cy
            .getByDataTest(helpers.commons.inventory.item)
            .should('have.length', items.length)
            .then(($list: any) => {
                Cypress._.forEach(items, ($item: any, index: number) => {
                    cy
                        .wrap($item)
                        .invoke('text')
                        .then($text => {
                            cy
                                .wrap($list)
                                .eq(index)
                                .should('contain.text', $text.replace('Remove', ''))
                        })
                })

                Cypress._.forEach($list, ($item: any) => {
                    cy
                        .wrap($item)
                        .within(() => {
                            cy
                                .getByDataTest(helpers.commons.inventory.price)
                                .invoke('text')
                                .then($text => {
                                    const price = Number($text.replace('$', ''))
                                    total += price
                                })
                        })
                
                })
            
            }).then(() => {
                const tax = Math.round(((total * 0.08) + Number.EPSILON) * 100) / 100

                cy
                    .getByDataTest(helpers.commons.cart.price.subtotal)
                    .should('contain.text', total.toString())

                cy
                    .getByDataTest(helpers.commons.cart.price.tax)
                    .should('contain.text', tax.toString())

                cy
                    .getByDataTest(helpers.commons.cart.price.total)
                    .should('contain.text', (total + tax).toString())
            })

        cy
            .getByDataTest(helpers.commons.button.finish)
            .click()

        cy
            .url()
            .should('contain', helpers.commons.url.complete)

        cy
            .getByDataTest(helpers.commons.complete.container)
            .should('exist')
            .within(() => {
                Cypress._.forEach([
                    helpers.commons.complete.img,
                    helpers.commons.complete.header,
                    helpers.commons.button.back
                
                ], $item => {
                    cy
                        .getByDataTest($item)
                        .should('exist')
                })

                cy
                    .getByDataTest(helpers.commons.complete.header)
                    .should('contain.text', 'Thank you for your order!')
            })
    })

})
