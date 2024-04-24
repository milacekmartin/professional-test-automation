import 'allure-cypress/commands'

import './commands/login'
import './commands/getByDataTest'
import './commands/validateSchema'

import './api/GET'
import './api/POST'

Cypress.on('uncaught:exception', (error, runnable) => { return false })
