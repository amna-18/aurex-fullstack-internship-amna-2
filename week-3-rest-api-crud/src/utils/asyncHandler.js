// Express 4 does not catch errors thrown inside async functions.
// This wrapper forwards any rejected promise to next(), i.e. to the error handler.
export const asyncHandler = (handler) => (req, res, next) =>
  Promise.resolve(handler(req, res, next)).catch(next)
