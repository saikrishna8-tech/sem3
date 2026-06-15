export const sendSuccess = (res, statusCode, data, message = undefined) => {
  const payload = { success: true };
  if (message) payload.message = message;
  if (data !== undefined) {
    if (typeof data === 'object' && !Array.isArray(data) && data !== null) {
      Object.assign(payload, data);
    } else {
      payload.data = data;
    }
  }
  return res.status(statusCode).json(payload);
};

export const sendError = (res, statusCode, message, errors = []) => {
  return res.status(statusCode).json({
    success: false,
    message,
    ...(errors.length > 0 ? { errors } : {}),
  });
};
