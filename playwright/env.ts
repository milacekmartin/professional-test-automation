import * as fs from 'fs'
import * as path from 'path'

const ENV_NAME = process.env.ENV || 'test'
const filePath = path.join(__dirname, 'configs', `${ENV_NAME}.json`)

if (!fs.existsSync(filePath)) throw new Error(`ENV file not found: ${filePath}`)

export const ENV = JSON.parse(fs.readFileSync(filePath, 'utf8'))

export const baseUrl = ENV.baseUrl
export const login = ENV.env.login
export const api = ENV.env.api
