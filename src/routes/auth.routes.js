const express = require("express");
const validate = require("../middleware/validation");
const {
  loginSchema,
  registrationSchema,
  verifyEmailSchema,
  resetPasswordSchema,
  changePasswordSchema,
} = require("../validations/auth.validation");
const {
  register,
  verifyEmail,
  login,
  resendEmailVerificationMail,
  forgotPassword,
  resetPassword,
  changePassword,
  refreshTokens,
} = require("../controller/auth.controller");
const { ensureAuth } = require("../middleware/auth");
const api = express.Router();

api.get("/refresh", ensureAuth("User", "Admin"), refreshTokens);
api.post("/login", validate(loginSchema), login);
api.post("/registration", validate(registrationSchema), register);
api.post("/verify-email", validate(verifyEmailSchema), verifyEmail);
api.get("/resend-email-verification-mail", resendEmailVerificationMail);
api.get("/forget-password", forgotPassword);
api.post("/reset-password", validate(resetPasswordSchema), resetPassword);
api.post(
  "/change-password",
  ensureAuth("User", "Admin"),
  validate(changePasswordSchema),
  changePassword
);

module.exports = api;
