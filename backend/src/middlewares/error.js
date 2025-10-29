export function notFound (req, res, next) {
  res.status(404)
  next(new Error(`Not Found - ${req.originalUrl}`))
}

// eslint-disable-next-line no-unused-vars
export function errorHandler (err, req, res, next) {
  const status = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500
  res.status(status).json({ message: err.message || 'Server error' })
}
