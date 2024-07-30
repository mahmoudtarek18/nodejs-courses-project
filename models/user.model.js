const mongoose = require("mongoose");

const validator = require("validator");
const userSchema = new mongoose.Schema({
  firstName: {
    type: String,
    required: true,
  },
  lastName: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    unique: true,
    required: true,
    validate: {
      validator: validator.isEmail,
      message: "Invalid email format",
    },
  },
  password: {
    type: String,
    required: true,
  },
  token: String,
  role: {
    type: String,
    enum: ["ADMIN", "USER", "MANAGER"],
    default: "USER",
  },
  avatar: {
    type: String,
    default: "uploads/default.png",
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
