import { HttpError } from '../utils/HttpError.js'

// Runs when no route matched the request.
export function notFound(req, _res, next) {
  next(new HttpError(404, `Route not found: ${req.method} ${req.originalUrl}`))
}
