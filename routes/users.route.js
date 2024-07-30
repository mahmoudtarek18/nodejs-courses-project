const express = require("express");
const multer = require("multer");

const diskStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },
  filename: function (req, file, cb) {
    const extension = file.mimetype.split("/")[1];
    cb(null, `user-${Date.now()}.${extension}`);
  },
});

const upload = multer({
  storage: diskStorage,
  fileFilter: (req, file, cb) => {
    const imageType = file.mimetype.split("/")[0];

    if (imageType === "image") {
      return cb(null, true);
    } else {
      return cb(appError.create("this is not a valid image type", 400), false);
    }
  },
});

const {
  getAllUsers,
  login,
  register,
} = require("../controllers/users.controller");
const verifyToken = require("../middleware/verifyToken");
const appError = require("../utils/appError");

const router = express.Router();

router.route("/").get(verifyToken, getAllUsers);

router.route("/login").post(login);

router.route("/register").post(upload.single("avatar"), register);

module.exports = router;
