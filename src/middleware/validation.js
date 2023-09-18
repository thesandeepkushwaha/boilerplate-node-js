const i18n = require("../config/i18n.config");

const validate = (schema) => async (req, res, next) => {
  try {
    await schema.validate(req.body, { abortEarly: false });
    next();
  } catch (err) {
    const errors = {};
    err.inner.forEach((error) => {
      errors[error.path] = i18n.__(error.message);
    });

    res
      .status(403)
      .json({ statusCode: 403, status: err.name, message: "Validation Error", error: errors });
  }
};

module.exports = validate;
