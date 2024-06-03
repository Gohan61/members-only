const User = require("../models/user");
const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");
const user = require("../models/user");

exports.home_get = asyncHandler(async (req, res, next) => {
  const allMessages = await Message.find({}).exec();
  let userDB = undefined;
  if (req.user) {
    userDB = await User.findById(req.user.id, "membership_status").exec();
  }

  res.render("index", {
    title: "Welcome to Private",
    user: req.user,
    messages: allMessages,
    userMembership: userDB ? userDB.membership_status : undefined,
  });
});

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
            membership_status: false,
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

exports.user_membership_get = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).exec();

  if (user === null) {
    const err = new Error("User not found");
    err.status = 404;
    return next(err);
  } else {
    res.render("membership");
  }
});

exports.user_membership_post = [
  body("secretPassword").trim().escape(),

  asyncHandler(async (req, res, next) => {
    const user = await User.findById(req.params.id).exec();

    const passwordInput = req.body.secretPassword;

    if (user === null || passwordInput !== "elite") {
      const err = new Error("User not found");
      err.status = 404;
      return next(err);
    } else {
      await User.findByIdAndUpdate(req.params.id, { membership_status: true });
      res.redirect("/");
    }
  }),
];

exports.user_createMessage_get = (req, res, next) => {
  res.render("createMessage");
};

exports.user_createMessage_post = [
  body("title").trim().isLength({ min: 2 }).escape(),
  body("timestamp").trim().escape(),
  body("message").trim().isLength({ min: 5 }).escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    // const user = await User.findById(req.params.id)

    const message = new Message({
      title: req.body.title,
      timestamp: req.body.timestamp,
      text: req.body.message,
      userID: req.params.id,
    });

    if (!errors.isEmpty()) {
      res.render("createMessage", {
        errors: errors.array(),
        message: message,
      });
    } else {
      await message.save();
      res.redirect(message.url);
    }
  }),
];

exports.logout_get = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    res.redirect("/");
  });
};
