const connectToDb = require("../db");
const { Users } = require("../db/models");
require("dotenv").config();

const usersData = [
  new Users({
    firstName: "Admin",
    lastName: "User",
    email: "admin@admin.com",
    emailVerifyAt: new Date(),
    password: "12345678",
    userRole: "Admin",
    userType: "Admin",
    lastUpdateAt: new Date(),
    createdAt: new Date(),
  }),
];

(async () => {
  //connect mongoose
  await connectToDb();

  //save your data. this is an async operation
  //after you make sure you seeded all the products, disconnect automatically
  for (let i = 0; i < usersData.length; i++) {
    try {
      await usersData[i].save();
    } catch (error) {
      console.log(error);
    }
  }
  process.exit(1);
})();
