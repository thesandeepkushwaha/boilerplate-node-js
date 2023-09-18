import express from "express";
import * as bodyParser from "body-parser";
import morgan from "morgan";
import * as path from "path";
const cors = require("cors");
import logger from "./config/winston";
import { authLimiter } from "./middleware/rateLimiter";
import { errorConverter, errorHandler } from "./middleware/error";
require("dotenv").config();
const i18n = require("./config/i18n.config");
const { transporter } = require("./config/nodemailer.config");
const app = express();

/* Cors middelware */
app.use(cors());

/* system out middelware */
app.use(morgan("dev"));

/* express middelware for body requests */
app.use(
  bodyParser.json({
    limit: "50mb",
  })
);

app.use(express.urlencoded({ extended: false }));

app.set("etag", false);

/* Express middelware */
app.use((req, res, next) => {
  res.header("Cache-Control", "private, no-cache, no-store, must-revalidate");
  res.header("Expires", "-1");
  res.header("Pragma", "no-cache");
  next();
});

// Set the locale for the request based on a cookie, query parameter, or any other method
app.use((req, res, next) => {
  const locale = req.cookies?.locale || "en"; // You can adjust this based on your setup
  i18n.setLocale(locale);
  next();
});

app.use("/api/public", express.static(path.join(__dirname, "../public")));

// limit repeated failed requests to auth endpoints
if (process.argv.indexOf("--prod") == -1) {
  app.use("/api/v1/auth", authLimiter);
}

/* Routes*/
// Set Global Variable
app.use("/api/v1", require("./routes/index.routes"));

app.get("/*", (req, res) => {
  res.status(404).send("We couldn't find the endpoint you were looking for!");
});

// Check Node Mailer Config
transporter
  .verify()
  .then(() => logger.info("Connected to email server"))
  .catch((err) => {
    logger.warn(
      "Unable to connect to email server. Make sure you have configured the SMTP options in .env"
    );
  });

/* Error handler (next) */
// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app;
