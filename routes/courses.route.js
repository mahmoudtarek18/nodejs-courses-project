const express = require("express");
const { body } = require("express-validator");
const allowedTo = require("../middleware/allowedTo");
const router = express.Router();

const {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
} = require("../controllers/courses.controller");
const verifyToken = require("../middleware/verifyToken");

router
  .route("/")
  .get(getCourses)
  .post(
    [
      body("title")
        .notEmpty()
        .withMessage("title is required")
        .isLength({ min: 3 })
        .withMessage("at least 3 chars"),
      body("price")
        .notEmpty()
        .withMessage("price is required")
        .isFloat({ gt: 10 })
        .withMessage("should be greater than 10"),
    ],
    createCourse
  );

router
  .route("/:courseId")
  .get(getCourse)
  .patch(updateCourse)
  .delete(verifyToken, allowedTo("ADMIN", "MANAGER"), deleteCourse);

module.exports = router;
