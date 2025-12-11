/**
 * ENVIRONMENT CONFIGURATION LOADER
 * ---------------------------------------------------------
 * This module loads environment-specific configuration
 * based on the ENV variable provided at runtime.
 *
 * Supported environments:
 * - test
 * - staging
 * - prod
 *
 * Configuration files are stored in:
 *   /playwright/configs/<env>.json
 *
 * Responsibilities:
 * - Determine the active environment (ENV variable or default: test)
 * - Load corresponding JSON configuration file
 * - Validate that the file exists
 * - Expose typed configuration objects for:
 *     - baseUrl
 *     - login credentials
 *     - API configuration
 */

import * as fs from 'fs'
import * as path from 'path'

/**
 * Determine active environment name.
 * Defaults to "test" if ENV is not provided.
 */
const ENV_NAME = process.env.ENV || 'test'

/**
 * Full path to the matching environment configuration JSON file.
 */
const filePath = path.join(__dirname, 'configs', `${ENV_NAME}.json`)

/**
 * Ensure the environment file exists.
 * Throwing an error helps fail fast during test startup.
 */
if (!fs.existsSync(filePath)) {
    throw new Error(`ENV file not found: ${filePath}`)
}

/**
 * Parse configuration JSON from disk.
 * The file contains:
 * {
 *   "baseUrl": "...",
 *   "env": {
 *      "login": { "username": "...", "password": "..." },
 *      "api": { ... }
 *   }
 * }
 */
export const ENV = JSON.parse(fs.readFileSync(filePath, 'utf8'))

/**
 * Exported configuration fields:
 * - baseUrl → used by Playwright as default test base URL
 * - login → default test user credentials
 * - api → API configuration for optional backend tests
 */
export const baseUrl = ENV.baseUrl
export const login = ENV.env.login
export const api = ENV.env.api
