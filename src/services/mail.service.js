import i18n from "../config/i18n.config";
import Mail from "../utils/mail/mail";
import {
  generateForgetPasswordToken,
  generateVerifyEmailToken,
} from "./token.service";

export const sendVerificationEmail = async (user) => {
  const verifyEmailToken = await generateVerifyEmailToken(user);

  const verifyLink =
    process.env.FRONTEND_BASE_URI + "/verify-mail?token=" + verifyEmailToken;
  const emailData = {
    to: user.email,
    subject: i18n.__("mail.subject.registration"),
  };
  const replacements = { firstName: user.firstName, verifyLink };
  const htmlFileName = "verifyEmail.template.html";
  return await Mail(emailData, replacements, htmlFileName);
};

export const sendForgetPasswordEmail = async (user) => {
  const token = await generateForgetPasswordToken(user);

  const resetLink =
    process.env.FRONTEND_BASE_URI + "/reset-password?token=" + token;
  const emailData = {
    to: user.email,
    subject: i18n.__("mail.subject.forgetPassword"),
  };
  const replacements = { firstName: user.firstName, resetLink };
  const htmlFileName = "forgetPassword.template.html";
  return await Mail(emailData, replacements, htmlFileName);
};
