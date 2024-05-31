const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.user_sign_up_get = (req, res, next) => {
  res.render("signup");
};

exports.user_sign_up_post = [
  body("firstName", "Your first name must be at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("lastName", "Your last name must be at least 2 characters")
    .trim()
    .isLength({ min: 2 })
    .escape(),
  body("username", "Username must be at least 5 characters")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("password", "Password must be at least 10 characters")
    .trim()
    .isLength({ min: 10 })
    .escape(),
  body("confirmPassword").escape((value, { req }) => {
    return value === req.body.password;
  }),

  asyncHandler(async (req, res, next) => {
    try {
      bcrypt.hash(req.body.password, 10, async (err, hashedPassword) => {
        if (err) {
          throw new Error("Error");
        } else {
          const user = new User({
            first_name: req.body.firstName,
            last_name: req.body.lastName,
            username: req.body.username,
            membership_status: true,
            password: hashedPassword,
          });
          const result = await user.save();
          res.redirect("/");
        }
      });
    } catch (err) {
      return next(err);
    }
  }),
];

exports.user_sign_in_get = (req, res, next) => {
  res.render("signin");
};

exports.user_sign_in_post = [
  body("userName", "Username must be at least 5 characters")
    .trim()
    .isLength({ min: 5 })
    .escape(),
  body("password", "Password must be at least 10 characters")
    .trim()
    .isLength({ min: 10 })
    .escape(),

  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/",
  }),
];
