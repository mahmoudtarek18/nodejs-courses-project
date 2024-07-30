const User = require("../models/user.model");

const { SUCCESS, FAIL } = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");
const bcrypt = require("bcryptjs");
const generateJWT = require("../utils/generateJWT");

const getAllUsers = asyncWrapper(async (req, res) => {
  const { limit: queryLimit, page } = req.query;

  const limit = queryLimit || 2;
  const skip = (page - 1) * limit;
  const users = await User.find(
    {},
    {
      __v: false,
      password: false,
    }
  )
    .limit(limit)
    .skip(skip);

  res.json({ status: SUCCESS, data: { users } });
});

const register = asyncWrapper(async (req, res, next) => {
  const { firstName, lastName, email, password, role } = req.body;

  await User.deleteMany();
  const oldUser = await User.findOne({ email: email });

  if (oldUser) {
    const error = appError.create("User already exist", 400, FAIL);
    return next(error);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    firstName,
    lastName,
    email,
    password: hashedPassword,
    role,
    avatar: req.file.filename,
  });

  const token = await generateJWT({ email, id: newUser._id, role });
  newUser.token = token;

  await newUser.save();

  return res.status(201).json({ status: SUCCESS, data: { user: newUser } });
});

const login = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  if (!email && !password) {
    const error = appError.create("Email and password are required", 400, FAIL);
    return next(error);
  }

  const user = await User.findOne({ email });

  if (!user) {
    const error = appError.create("USER NOT FOUND", 401, FAIL);
    return next(error);
  }
  const matchedPassword = await bcrypt.compare(password, user.password);

  if (matchedPassword && user) {
    const token = await generateJWT({ email, id: user._id, role: user.role });
    res.json({ status: SUCCESS, data: { token } });
  } else {
    const error = appError.create("Invalid password", 401, FAIL);
    return next(error);
  }
});

module.exports = {
  getAllUsers,
  register,
  login,
};
