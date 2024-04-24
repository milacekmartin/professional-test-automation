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

describe('FE test', { pageLoadTimeout: 5000 }, () => {

    let items: any

    before(() => { cy.login() })

    it('check product list', () => {
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
