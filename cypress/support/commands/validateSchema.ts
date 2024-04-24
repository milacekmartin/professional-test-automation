Cypress.Commands.add('validateSchema', (schema: any, resp: any) => {
    let validator = require('is-my-json-valid')

    const validate = validator(schema)
    return validate(resp)
})
