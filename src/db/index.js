const Mongoose = require("mongoose");

const getDbUrl = () => {
  const isDevEnv = process.argv.indexOf("--prod") == -1;
  if (isDevEnv) {
    console.log("Connecting to local database");
    return process.env.MONGODB_URL_LOCAL;
    // return config.URL;
  } else {
    console.log("Connecting to production database");
    return process.env.MONGODB_URL_PRODUCTION;
  }
};

/*
 *Description: Create Mongoose connection to DB
 *Returns: Connection
 *Parameters: String(db)
 */
const connectToDb = async () => {
  try {
    const dbURL = getDbUrl();
    let conn = await Mongoose.connect(dbURL);
    console.log("Connected to mongod");
    return conn;
  } catch (err) {
    console.log("Error", err);
    console.error("Could not connect to MongoDB");
    process.exit();
  }
};

module.exports = connectToDb;
