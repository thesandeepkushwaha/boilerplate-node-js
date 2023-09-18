const bcrypt = require("bcrypt");

function generateSalt(callback) {
  // do not change the salt, it should always be 10
  bcrypt.genSalt(10, callback);
}
function hashPassword(password) {
  return new Promise((resolve, reject) => {
    generateSalt(async function (err, salt) {
      if (err) {
        reject(err.message);
      } else {
        try {
          let hash = await bcrypt.hash(password, salt);
          resolve(hash);
        } catch (error) {
          reject(error.message);
        }
      }
    });
  });
}

function comparePassword(password, dbpassword, callback = undefined) {
  return bcrypt.compare(password, dbpassword, callback);
}

module.exports = {
  comparePassword,
  hashPassword,
};
