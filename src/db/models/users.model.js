const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const { toJSON, paginate } = require("./plugins");
const { hashPassword, comparePassword } = require("../../utils/password-hashing");
const userSchema = new Schema({
  firstName: {
    type: String,
    required: false,
    default: "User",
  },
  lastName: {
    type: String,
    required: false,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  emailVerifyAt: {
    type: Date,
    required: false,
    private: true,
  },
  password: {
    type: String,
    required: true,
    private: true,
  },
  otp: {
    type: String,
    required: false,
  },
  stripeCustomerId: {
    type: String,
    required: false,
  },
  userRole: {
    type: String,
    default: "User",
    enum: ["User", "Admin"],
  },
  userType: {
    type: String,
    enum: ["User", "Admin"],
    default: "User",
  },
  fcmTokens: [
    {
      type: String,
      required: false,
      private: true,
    },
  ],
  status: {
    type: String,
    default: "Active",
  },
  lastUpdateAt: {
    type: Date,
    default: Date.now,
  },
  lastUpdateBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  createdBy: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: false,
  },
  deletedAt: {
    type: Date,
    required: false,
  },
});

// add plugin that converts mongoose to json
userSchema.plugin(toJSON);
userSchema.plugin(paginate);

/**
 * Check if email is taken
 * @param {string} email - The user's email
 * @param {ObjectId} [excludeUserId] - The id of the user to be excluded
 * @returns {Promise<boolean>}
 */
userSchema.statics.isEmailTaken = async function (email, excludeUserId) {
  const user = await this.findOne({ email, _id: { $ne: excludeUserId } });
  return !!user;
};

/**
 * Check if password matches the user's password
 * @param {string} password
 * @returns {Promise<boolean>}
 */
userSchema.methods.isPasswordMatch = async function (password) {
  const user = this;
  return comparePassword(password, user.password);
};

userSchema.pre("save", async function (next) {
  const user = this;
  if (user.isModified("password")) {
    user.password = await hashPassword(user.password);
  }
  next();
});

module.exports = mongoose.model("Users", userSchema);
