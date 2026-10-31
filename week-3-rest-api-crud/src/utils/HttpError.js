// An Error that carries an HTTP status code, e.g. throw new HttpError(404, 'Task not found').
// The central error handler turns it into a clean JSON response.
export class HttpError extends Error {
  constructor(statusCode, message) {
    super(message)
    this.name = 'HttpError'
    this.statusCode = statusCode
  }
}
