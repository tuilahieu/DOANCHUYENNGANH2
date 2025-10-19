export function checkExtraFields(allowedFields = {}) {
  return (req, res, next) => {
    const extraFields = Object.keys(req.body ?? {}).filter(
      (key) => !allowedFields.includes(key)
    );
    if (extraFields.length > 0) {
      return res.status(400).json({
        status: false,
        message: `Các trường không hợp lệ: ${extraFields.join(", ")}`,
      });
    }
    next();
  };
}
