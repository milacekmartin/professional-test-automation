Cypress.Commands.add('POST', (url: string, body: any, failOnStatusCode: boolean = true, contentType: string = 'application/json', encoding: any = 'utf8') => {
    cy
        .request({
            url: Cypress.env().api.url + url,
            method: 'POST',
            
            encoding: encoding,
            headers: { 
                'Content-Type': contentType,
                'x-api-key': Cypress.env().api.apiKey
            },

            failOnStatusCode: failOnStatusCode,
            body: body
    
        }).then($resp => { return cy.wrap($resp) })
})
