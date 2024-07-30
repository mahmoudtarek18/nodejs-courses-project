const { validationResult } = require("express-validator");
const Course = require("../models/course.model");

const { SUCCESS, ERROR, FAIL } = require("../utils/httpStatusText");
const asyncWrapper = require("../middleware/asyncWrapper");
const appError = require("../utils/appError");

const getCourses = asyncWrapper(async (req, res) => {
  const { limit: queryLimit, page } = req.query;

  const limit = queryLimit || 2;
  const skip = (page - 1) * limit;
  const courses = await Course.find(
    {},
    {
      __v: false,
    }
  )
    .limit(limit)
    .skip(skip);
  res.json({ status: SUCCESS, data: { courses } });
});

const getCourse = asyncWrapper(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);

  if (!course) {
    const error = appError.create("Course not found", 404, FAIL);
    return next(error);
  }
  return res.json({ status: SUCCESS, data: { course } });
});

const createCourse = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = appError.create(errors.array(), 400, FAIL);
    return next(error);
  }

  const newCourse = new Course(req.body);
  await newCourse.save();
  res.status(201).json({
    status: SUCCESS,
    data: { course: newCourse },
  });
});

const updateCourse = asyncWrapper(async (req, res) => {
  const updatedCourse = await Course.updateOne(
    { _id: req.params.courseId },
    { $set: { ...req.body } }
  );

  if (!updatedCourse) {
    const error = appError.create("Course Not Found", 400, FAIL);
    return next(error);
  }
  return res.status(200).json({
    status: SUCCESS,
    data: { course: updatedCourse },
  });
});

const deleteCourse = asyncWrapper(async (req, res) => {
  await Course.deleteOne({ _id: req.params.courseId });
  return res.json({ status: SUCCESS, data: null });
});

module.exports = {
  getCourses,
  getCourse,
  createCourse,
  updateCourse,
  deleteCourse,
};
