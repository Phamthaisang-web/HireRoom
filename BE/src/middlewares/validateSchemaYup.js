const validateSchemaYup = (schema) => async (req, res, next) => {
  try {
    const validatedData = await schema.validate(req.body, {
      abortEarly: false, // lấy tất cả lỗi
      stripUnknown: true,
    });

    req.body = validatedData;
    next();
  } catch (error) {
    
    const errors = error.inner && error.inner.length > 0
      ? error.inner.map(err => err.message)
      : [error.message];

    return res.status(400).json({
      message: "Dữ liệu không hợp lệ",
      status: 400,
      errors,
    });
  }
};

module.exports = validateSchemaYup;