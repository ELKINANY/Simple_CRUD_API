const errorMiddleware = (err, req, res, next) => {
  const statusCode = err.statusCode || 500;

  res.status(statusCode).json({
    status: 'error',
    statusCode,
    error: err.message || 'Internal Server Error',
    stack: err.stack,
  });
}

module.exports = errorMiddleware;