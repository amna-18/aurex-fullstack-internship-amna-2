import cors from 'cors'
import express from 'express'
import helmet from 'helmet'
import morgan from 'morgan'
import mongoose from 'mongoose'
import { env, isProduction } from './config/env.js'
import { errorHandler } from './middleware/errorHandler.js'
import { notFound } from './middleware/notFound.js'
import taskRoutes from './routes/task.routes.js'

const app = express()

// ----- global middleware (runs for every request, in this order) -----
app.use(helmet()) // sets safe HTTP headers
app.use(
  cors({
    // Allow only the front-end addresses listed in CLIENT_URL (plus tools like Postman, which send no Origin).
    origin: (origin, callback) => callback(null, !origin || env.clientUrls.includes(origin)),
  })
)
app.use(morgan(isProduction ? 'combined' : 'dev')) // request logging
app.use(express.json({ limit: '10kb' })) // parses JSON bodies into req.body

// ----- routes -----
app.get('/', (_req, res) => {
  res.json({ success: true, message: 'Taskly API (Week 3) is running', health: '/api/health' })
})

app.get('/api/health', (_req, res) => {
  const connected = mongoose.connection.readyState === 1
  res.status(connected ? 200 : 503).json({
    success: connected,
    status: connected ? 'ok' : 'database disconnected',
    uptimeSeconds: Math.round(process.uptime()),
  })
})

app.use('/api/tasks', taskRoutes)

// ----- these two must come LAST -----
app.use(notFound)
app.use(errorHandler)

export default app
