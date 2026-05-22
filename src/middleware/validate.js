const { AppError } = require('../lib/errors');

function validate(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body,
      query: req.query,
      params: req.params,
    });

    if (!result.success) {
      const message = result.error.errors.map((e) => e.message).join(', ');
      return next(new AppError(message, 400, 'VALIDATION_ERROR'));
    }

    req.validated = result.data;
    next();
  };
}

function requireInternalKey(req, _res, next) {
  const key = req.headers['x-internal-key'];
  if (!process.env.INTERNAL_API_KEY || key !== process.env.INTERNAL_API_KEY) {
    return next(new AppError('Forbidden', 403, 'FORBIDDEN'));
  }
  next();
}

module.exports = { validate, requireInternalKey };
