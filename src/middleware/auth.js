import { tokenTypes } from "../config/types";
import { verifyToken } from "../services/token.service";
const { Users } = require("../db/models");

export const ensureAuth = (...role) => {
  return async function (req, res, next) {
    if (!req.headers.authorization && role.includes("Guest")) {
      return next();
    }
    if (!req.headers.authorization) {
      return res.status(403).send({
        status: "error",
        message: "The request does not have an Authentication header.",
      });
    }

    // Remove Bearer from string
    const token = req.headers.authorization.replace(/^Bearer\s+/, "");

    try {
      var payload = await verifyToken(token, tokenTypes.REFRESH);
    } catch (ex) {
      return res
        .status(401)
        .send({ status: "error", message: "Invalid Token" });
    }

    Users.findById(payload.user)
      .then((user) => {
        if (!user) {
          return res
            .status(404)
            .send({ status: "error", message: "Invalid User" });
        }

        if (
          !role.includes(user.userRole) &&
          user.userRole !== "Admin" &&
          !role.includes("Guest")
        ) {
          return res
            .status(403)
            .send({ status: "error", message: "Access Denied!!" });
        }
        req.user = user;
        return next();
      })
      .catch((err) => {
        res
          .status(404)
          .send({ status: "error", message: "Server Error", result: err });
      });
  };
};
