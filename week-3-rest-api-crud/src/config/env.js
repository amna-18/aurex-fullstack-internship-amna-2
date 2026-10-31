import dotenv from 'dotenv'

// Reads the ".env" file into process.env. This file is imported first by server.js,
// so every other file can safely use the validated values exported below.
dotenv.config()

const required = ['MONGODB_URI']
const missing = required.filter((name) => !process.env[name])

if (missing.length > 0) {
  console.error(`Missing required environment variable(s): ${missing.join(', ')}`)
  console.error('Copy .env.example to .env and fill in the values.')
  process.exit(1)
}

export const env = {
  port: Number(process.env.PORT) || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI,
  clientUrls: (process.env.CLIENT_URL || 'http://localhost:5173')
    .split(',')
    .map((url) => url.trim())
    .filter(Boolean),
}

export const isProduction = env.nodeEnv === 'production'
