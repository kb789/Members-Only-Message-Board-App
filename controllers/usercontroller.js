const User = require("../models/user");
const passport = require("passport");
const bcrypt = require("bcryptjs");

exports.index = function (req, res) {
  res.render("views/pages/index", { user: req.user });
};

exports.sign_up_get = (req, res) => res.render("views/pages/sign-up-form");

exports.sign_up_post = (req, res, next) => {
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
    res.render("views/pages/index", { user: req.user });
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
  req.logout();
  res.redirect("/");
};
