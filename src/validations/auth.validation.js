const yup = require("yup");
const { Users } = require("../db/models");

yup.addMethod(yup.string, "emailInUse", function (errorMessage) {
  return this.test(`email-in-use`, errorMessage, async function (email) {
    const { path, createError } = this;
    const exist = await Users.isEmailTaken(email);
    return !exist || createError({ path, message: errorMessage });
  });
});

export const loginSchema = yup.object().shape({
  email: yup
    .string()
    .email("auth.validation.email.valid")
    .required("auth.validation.email.required"),
  password: yup
    .string()
    .min(8, "auth.validation.password.min")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character"
    )
    .required("auth.validation.password.required"),
});

export const registrationSchema = yup.object().shape({
  email: yup
    .string()
    .email("auth.validation.email.valid")
    .required("auth.validation.email.required")
    .emailInUse("auth.validation.email.emailInUse"),
  password: yup
    .string()
    .min(8, "auth.validation.password.min")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "auth.validation.password.matches"
    )
    .required("auth.validation.password.required"),
});

export const verifyEmailSchema = yup.object().shape({
  token: yup
    .string("auth.validation.token.valid")
    .required("auth.validation.token.required"),
});

export const resetPasswordSchema = yup.object().shape({
  token: yup
    .string("auth.validation.token.valid")
    .required("auth.validation.token.required"),
  password: yup
    .string()
    .min(8, "auth.validation.password.min")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "auth.validation.password.matches"
    )
    .required("auth.validation.password.required"),
});

export const changePasswordSchema = yup.object().shape({
  oldPassword: yup
    .string()
    .min(8, "auth.validation.password.min")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "auth.validation.password.matches"
    )
    .required("auth.validation.password.required"),
  password: yup
    .string()
    .min(8, "auth.validation.password.min")
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      "auth.validation.password.matches"
    )
    .required("auth.validation.password.required"),
});
