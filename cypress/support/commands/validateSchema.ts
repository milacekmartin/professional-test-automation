Cypress.Commands.add('validateSchema', (schema: any, resp: any) => {
    if (schema.required) {
        schema.required.forEach((field: string) => {
            if (!(field in resp)) {
                throw new Error(`Missing required field: ${field}`)
            }
        })
    }
    
    const expectedFields = ['id', 'name', 'job', 'createdAt']
    expectedFields.forEach(field => {
        if (typeof resp[field] !== 'string') {
            throw new Error(`Field ${field} should be string, got ${typeof resp[field]}`)
        }
    })
    
    return true
})
