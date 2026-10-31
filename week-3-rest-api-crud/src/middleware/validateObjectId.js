import { HttpError } from '../utils/HttpError.js'

// A MongoDB ObjectId is exactly 24 hexadecimal characters.
// Checking it here gives a clear 400 instead of a confusing database error.
export function validateObjectId(req, _res, next) {
  if (!/^[0-9a-fA-F]{24}$/.test(req.params.id)) {
    return next(new HttpError(400, 'Invalid task id'))
  }
  next()
}
