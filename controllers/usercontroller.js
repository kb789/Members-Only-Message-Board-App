const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { body, check, validationResult } = require("express-validator");

exports.index = function (req, res) {
  res.render("views/pages/index", { user: req.user });
};

exports.sign_up_get = (req, res) =>
  res.render("views/pages/sign-up-form", { user: req.user });

exports.sign_up_post = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    let error = ["SORRY, YOUR SIGN UP FAILED:"];
    errors.errors.forEach((err) => {
      error.push(err.msg);
    });
    error.push("PLEASE RETURN TO THE SIGNUP PAGE AND TRY AGAIN");

    res.render("views/pages/sign-up-form", {
      error: error,
    });
  }
  if (req.body.password != req.body.passwordconf) {
    res.render("views/pages/sign-up-form", {
      error: ["Passwords don't match. Please try again."],
    });
  }
  User.findOne({ username: req.body.username }, function (err, results) {
    if (err) {
      return next(err);
    }
    console.log(results);
    if (results !== null) {
      res.render("views/pages/sign-up-form", {
        error: ["Username taken. Please try again."],
      });
    } else {
      bcrypt.hash(req.body.password, 10, (err, hashedPassword) => {
        if (err) {
          return next(err);
        }

        const user = new User({
          firstname: req.body.firstname,
          lastname: req.body.lastname,
          username: req.body.username,
          password: hashedPassword,
        }).save((err) => {
          if (err) {
            return next(err);
          }
        });
        res.render("views/pages/log-in", { user: user });
      });
    }
  });
};

exports.log_in_get = (req, res, next) => {
  res.render("views/pages/log-in", { user: req.user });
};

exports.log_in_post = [
  body("username", "Username required").trim().isLength({ min: 1 }),
  body("password", "Password required").trim().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      console.log(errors);
      //res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});

      res.render("views/pages/log-in", {
        errors: errors.array(),
      });
      return;
    } else {
      const handler = passport.authenticate("local", {
        
        successRedirect: "/",
        failureRedirect: "/log-in",
        failureFlash: true,
      });

      handler(req, res, next);
    }
  },
];

exports.log_out_get = (req, res) => {
  console.log(req.user);
  if (typeof req.user !== "undefined") {
    const update = {
      status: false,
      admin: false,
    };
    const filter = {
      _id: req.user._id,
    };

    User.findOneAndUpdate(filter, update, null, function (err, result) {
      if (err) {
        return err;
      }
    });
  }
  req.logout();

  res.redirect("/");
};
