Cypress.Commands.add('GET', (url: string, failOnStatusCode: boolean = true, log = true) => {
    cy
        .request({
            url: Cypress.env().api.url + url,
            method: 'GET',

            headers: {
                'x-api-key': Cypress.env().api.apiKey
            },

            failOnStatusCode: failOnStatusCode,
            log: log
        
        }).then($resp => { return cy.wrap($resp, {log: log}) })
})
