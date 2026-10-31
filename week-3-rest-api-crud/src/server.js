// The first import loads and validates the .env file - keep it first.
import { env } from './config/env.js'
import { connectDB } from './config/db.js'
import app from './app.js'

async function start() {
  try {
    await connectDB(env.mongoUri)
    app.listen(env.port, () => {
      console.log(`Server running in ${env.nodeEnv} mode on port ${env.port}`)
    })
  } catch (error) {
    console.error('Could not start the server:', error.message)
    process.exit(1)
  }
}

start()

process.on('unhandledRejection', (reason) => {
  console.error('Unhandled promise rejection:', reason)
  process.exit(1)
})
