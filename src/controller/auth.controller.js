import i18n from "../config/i18n.config";
import { tokenTypes } from "../config/types";
import logger from "../config/winston";
import {
  sendForgetPasswordEmail,
  sendVerificationEmail,
} from "../services/mail.service";
import { generateAccessTokens, generateAuthTokens, verifyToken } from "../services/token.service";
import ApiError from "../utils/ApiError";

const httpStatus = require("http-status");
const { Users, Token } = require("../db/models");

export const register = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = new Users({ email, password });
    await user.save();
    // Send Mail On Registration
    await sendVerificationEmail(user);
    res.status(httpStatus.CREATED).send({
      statusCode: httpStatus.CREATED,
      status: "Success",
      user,
      message: i18n.__("auth.registration.success"),
    });
  } catch (error) {
    logger.error("auth:register", error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).send({
      statusCode: httpStatus.INTERNAL_SERVER_ERROR,
      status: "Error",
      message: i18n.__("error.message"),
    });
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await Users.findOne({ email });
    if (!user || !(await user.isPasswordMatch(password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, i18n.__("auth.login.failed"));
    }
    if (!user?.emailVerifyAt) {
      await sendVerificationEmail(user);
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        i18n.__("auth.login.notVerified")
      );
    }
    const token = await generateAuthTokens(user);
    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      status: "Success",
      user,
      token,
      message: i18n.__("auth.login.success"),
    });
  } catch (error) {
    next(error);
  }
};

export const resendEmailVerificationMail = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await Users.findOne({ email });
    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        i18n.__("auth.verification.sendMailFailed")
      );
    }
    await sendVerificationEmail(user);
    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      status: "Success",
      message: i18n.__("auth.verification.sendMail"),
    });
  } catch (error) {
    next(error);
  }
};

export const forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.query;
    const user = await Users.findOne({ email });
    if (!user) {
      throw new ApiError(
        httpStatus.UNAUTHORIZED,
        i18n.__("auth.forgetPassword.sendMailFailed")
      );
    }
    await sendForgetPasswordEmail(user);
    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      status: "Success",
      message: i18n.__("auth.forgetPassword.sendMail"),
    });
  } catch (error) {
    next(error);
  }
};
// const logout = async (req, res) => {
//   await authService.logout(req.body.refreshToken);
//   res.status(httpStatus.NO_CONTENT).send();
// };

export const refreshTokens = async (req, res) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user) {
      throw new Error();
    }
    const accessToken = await generateAccessTokens(user);
    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      status: "Success",
      user,
      accessToken,
    });
  } catch (error) {
    throw new ApiError(httpStatus.UNAUTHORIZED, 'Please authenticate');
  }
};

export const resetPassword = async (req, res, next) => {
  try {
    const resetPasswordTokenDoc = await verifyToken(
      req.body.token,
      tokenTypes.RESET_PASSWORD
    );
    const user = await Users.findById(resetPasswordTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    user.password = newPassword;
    await user.save();
    await Token.deleteMany({ user: user.id, type: tokenTypes.RESET_PASSWORD });
    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      status: "Success",
      message: i18n.__("auth.resetPassword.success"),
    });
  } catch (error) {
    next(
      new ApiError(
        httpStatus.UNAUTHORIZED,
        i18n.__("auth.resetPassword.failed")
      )
    );
  }
};

export const changePassword = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user || !(await user.isPasswordMatch(req.body.password))) {
      throw new ApiError(httpStatus.UNAUTHORIZED, i18n.__("auth.changePassword.incorrectOldPass"));
    }
    user.password = req.body.newPassword;
    await user.save();
    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      status: "Success",
      message: i18n.__("auth.resetPassword.success"),
    });
  } catch (error) {
    next(error);
  }
};

export const verifyEmail = async (req, res, next) => {
  try {
    const verifyEmailTokenDoc = await verifyToken(
      req.body.token,
      tokenTypes.VERIFY_EMAIL
    );
    const user = await Users.findById(verifyEmailTokenDoc.user);
    if (!user) {
      throw new Error();
    }
    await Token.deleteMany({ user: user.id, type: tokenTypes.VERIFY_EMAIL });
    user.emailVerifyAt = new Date();
    await user.save();
    res.status(httpStatus.OK).send({
      statusCode: httpStatus.OK,
      status: "Success",
      user,
      message: i18n.__("auth.verification.success"),
    });
  } catch (error) {
    return next(
      new ApiError(httpStatus.UNAUTHORIZED, i18n.__("auth.verification.failed"))
    );
  }
  res.status(httpStatus.NO_CONTENT).send();
};
