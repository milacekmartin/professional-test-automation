declare namespace Cypress {

    interface Chainable {

        login(): any
        
        getByDataTest(locator: string): any
        validateSchema(schema: any, resp: any): any

        /** api */
            GET(url: string, failOnStatusCode?: boolean, log?: boolean): any
            POST(url: string, body: any, failOnStatusCode?: boolean, contentType?: string, encoding?: any): any

    }

}
