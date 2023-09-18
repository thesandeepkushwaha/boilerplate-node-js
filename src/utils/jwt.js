const moment = require('moment');
import jwt from "jsonwebtoken";

export function parseJwt(token) {
  return JSON.parse(Buffer.from(token.split(".")[1], "base64").toString());
}

// Function to Create Token
export const generateToken = (userId, expires, type, secret = process.env.JWT_SECRET) => {
  const payload = {
    sub: userId,
    iat: moment().unix(),
    exp: expires.unix(),
    type,
  };
  return jwt.sign(payload, secret);
};

// Function To Decode Token
export function decodeToken(token, secret = process.env.JWT_SECRET) {
  return jwt.verify(token, secret);
}
