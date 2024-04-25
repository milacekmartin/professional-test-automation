import * as utils from '@utils'

import { userSchema } from '../../fixtures/users'

describe('BE test', () => {

    /**
     * 
     * Test Case #1 - GET - List Users
     * 
     * 1. Send a proper Request.
     * 2. Assert received data in Response:
     *      a) "total"
     *      b) "last_name" for the first and for the second User in "data"
     * 3. Count number of received users in "data" and compare it to the received value "total".
     * 4. Create assertions for possible data types present in the response.
     * 
     */

    it('Test Case 1 - GET - List Users', () => {
        let total = 0
        let grandTotal = 0

        let data = []

        cy
            /* 1. Send a proper Request. */
                .GET('/api/users').its('body').then(($: any) => {
                    grandTotal = $.total

                    for(let i = 1; i <= $.total_pages; i++) {
                        cy
                            .GET('/api/users?page=' + i).its('body').then(($body: any) => {
                                total += $body.data.length
                                Cypress._.forEach($body.data, $item => { data.push($item) })

                                /* 2.b) "last_name" for the first and for the second User in "data" */
                                    if($body.data[0] && $body.data[1]){ expect($body.data[0].last_name).not.to.eq($body.data[1].last_name) }

                                /* 4. Create assertions for possible data types present in the response. */
                                    Cypress._.forEach([
                                        $body.page,
                                        $body.per_page,
                                        $body.total,
                                        $body.total_pages
                                    
                                    ], $$ => { expect($$).to.be.a('number') })
                            })
                    }
                
                }).then(() => {
                    /* 2.a) "total" */
                        expect(total).to.eq(grandTotal)
                    
                    /* 3. Count number of received users in "data" and compare it to the received value "total". */
                        expect(data.length).to.eq(grandTotal)
                })
    })

    /**
     * 
     * Test Case #2 – POST – Create
     * 
     * 1. Send proper request.
     * 2. In received Response assert:
     *      a) HTTP code
     *      b) ID and timestamp of createdAt
     * 3. Assert whether Response time was less than a variable (e.g. limit = 150 ms)
     * 4. Create the assert to verify the response schema.
     * 
     */

    it('Test Case 2 - POST - Create', () => {
        const name = utils.generateRandomString()
        const job = utils.generateRandomString()

        cy
            /* 1. Send a proper Request. */
                .POST('/api/users', {
                    name: name, 
                    job: job
                
                }).then(($: { 
                    status: number 
                    duration: number 
                    
                    body: { 
                        name: string 
                        job: string 
                        id: string 
                        createdAt: string | number | Date 
                    } 
                
                }) => {
                    /* 2.a) HTTP code */
                        expect($.status).to.eq(201)

                    /* 3. Assert whether Response time was less than a variable (e.g. limit = 500 ms) */
                        expect($.duration).to.be.lte(500)
                    
                    expect($.body.name).to.eq(name)
                    expect($.body.job).to.eq(job)

                    expect($.body.id).to.be.a('string')
                    expect($.body.id).to.have.length.gte(1)

                    /* 2.b) ID and timestamp of createdAt */
                        expect(new Date($.body.createdAt)).to.be.instanceOf(Date)

                    cy
                        /* 4. Create the assert to verify the response schema. */
                            .validateSchema(userSchema, $.body).then((valid: boolean) => {
                                expect(valid).to.be.true
                            })
                })
    })

})
