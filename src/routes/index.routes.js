const express = require("express");
const api = express.Router();

api.use("/auth", require("./auth.routes"));

module.exports = api;
