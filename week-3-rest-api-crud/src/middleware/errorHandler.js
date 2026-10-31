import { isProduction } from '../config/env.js'

// The single place where every error becomes a JSON response.
// Express recognises it as an error handler because it has FOUR parameters.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, _req, res, _next) {
  let status = err.statusCode || err.status || 500
  let message = err.message || 'Something went wrong'
  let errors

  if (err.name === 'ValidationError') {
    // Mongoose schema validation failed
    status = 400
    errors = Object.values(err.errors).map((item) => item.message)
    message = errors.join(', ')
  } else if (err.name === 'CastError') {
    status = 400
    message = `Invalid value for "${err.path}"`
  } else if (err.code === 11000) {
    // duplicate value in a unique field
    status = 409
    const field = Object.keys(err.keyValue || {})[0] || 'value'
    message = `That ${field} is already in use`
  } else if (err.type === 'entity.parse.failed') {
    status = 400
    message = 'Request body is not valid JSON'
  } else if (err.type === 'entity.too.large') {
    status = 413
    message = 'Request body is too large'
  }

  if (status >= 500) {
    console.error(err)
    if (isProduction) message = 'Internal server error' // never leak internals in production
  }

  res.status(status).json({
    success: false,
    message,
    ...(errors && { errors }),
    ...(!isProduction && status >= 500 && { stack: err.stack }),
  })
}
