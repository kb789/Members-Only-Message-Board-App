const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const { check, validationResult } = require('express-validator');

exports.index = function (req, res) {
  res.render("views/pages/index", { user: req.user });
};

exports.sign_up_get = (req, res) =>
  res.render("views/pages/sign-up-form", { user: req.user });

exports.sign_up_post = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }

  User.findOne({ username: req.body.username }, function (err, results) {
    if (err) {
      return next(err);
    }
    console.log(results);
    if (results !== null) {
      console.log("username taken");
      res.render("views/pages/sign-up-form", { duplicate: true });
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

exports.log_in_post = (req, res, next) => {
  const handler = passport.authenticate("local", {
    successRedirect: "/", // redirect to the secure profile section
    failureRedirect: "/", // redirect back to the signup page if there is an error
  });
  handler(req, res, next);
};

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
