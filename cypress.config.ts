const { defineConfig } = require('cypress')
const { allureCypress } = require("allure-cypress/reporter")

const path = require('path')
const fs = require('fs-extra')

function getConfByFile(file: any){
    const pathToConfFile = path.resolve('cypress/configs', file + '.json')

    return fs.readJson(pathToConfFile)
}

module.exports = defineConfig({

    viewportWidth: 1600,
    viewportHeight: 900,

    chromeWebSecurity: false,

    e2e: {
        testIsolation: false,
        experimentalRunAllSpecs: true,

        setupNodeEvents(on, config) {
            const file = config.env.configFile || 'test'

            allureCypress(on, {
                resultsDir: "./allure-results"
            })

            return getConfByFile(file)
        }
    }

})
