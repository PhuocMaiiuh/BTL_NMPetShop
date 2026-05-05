/**
 * Global error-handling middleware.
 * Must be registered AFTER all routes (app.use(errorHandler)).
 */
const errorHandler = (err, req, res, next) => {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`, err.message);

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors).map(e => e.message);
    return res.status(400).json({ error: 'Dữ liệu không hợp lệ', details: messages });
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    return res.status(409).json({ error: 'Dữ liệu đã tồn tại (duplicate key)' });
  }

  // Mongoose cast error (e.g. invalid ObjectId)
  if (err.name === 'CastError') {
    return res.status(400).json({ error: `Giá trị không hợp lệ cho trường ${err.path}` });
  }

  // Default 500
  res.status(err.status || 500).json({
    error: err.message || 'Lỗi server nội bộ',
  });
};

module.exports = errorHandler;
