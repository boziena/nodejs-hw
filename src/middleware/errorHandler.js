export const ctrlWrapper = (ctrl) => {
  return async (req, res, next) => {
    try {
      await ctrl(req, res, next);
    } catch (e) {
      next(e);
    }
  };
};

export const errorHandler = (err, req, res, next) => {
  const { status = 500, message = 'Internal Server Error' } = err;
  res.status(status).json({
    status,
    message,
    data: err.data || null,
  });
};
