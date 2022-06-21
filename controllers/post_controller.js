const Post = require("../models/post");
const User = require("../models/user");
const passport = require("passport");
const { body, validationResult } = require("express-validator");

exports.get_new_post = (req, res) =>
  res.render("views/pages/post_form", { user: req.user, errors: [] });

exports.add_new_post = [
  body("message", "Text required").trim().isLength({ min: 1 }).escape(),
  body("title", "Title required").trim().isLength({ min: 1 }).escape(),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      console.log(errors);
      //res.render('genre_form', { title: 'Create Genre', genre: genre, errors: errors.array()});

      res.render("views/pages/post_form", {
        user: req.user,
        errors: errors.array(),
      });
      return;
    } else {
      const user = new Post({
        title: req.body.title,
        text: req.body.message,
        user: req.user.username,
      }).save((err) => {
        if (err) {
          return next(err);
        }
        res.redirect("/");
      });
    }
  },
];
exports.post_list = function (req, res) {
  Post.find({}, "")
    .sort({ timestamp: 1 })
    .exec(function (err, list_posts) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }
      //Successful, so render
      res.render("views/pages/post_list", {
        post_list: list_posts,
        user: req.user,
      });
    });
};

exports.get_join = function (req, res) {
  res.render("views/pages/join", { user: req.user, errors: [] });
};

exports.post_join = function (req, res) {
  const secret = process.env.SECRET;

  if (secret === req.body.secret) {
    const update = {
      status: true,
    };
    const filter = {
      _id: req.user._id,
    };

    User.findOneAndUpdate(filter, update, null, function (err, result) {
      if (err) {
        return err;
      }
    });
  } else {
    console.log("didn't work");
    res.render("views/pages/join", {
      user: req.user,
      errors: ["Password failed. Please try again."],
    });
  }
  res.redirect("/");
};

exports.get_admin = function (req, res) {
  res.render("views/pages/admin", { user: req.user, errors: [] });
};

exports.post_admin = function (req, res) {
  const admin_secret = process.env.ADMIN_SECRET;

  if (admin_secret === req.body.admin) {
    const update = {
      status: true,
      admin: true,
    };
    const filter = {
      _id: req.user._id,
    };

    User.findOneAndUpdate(filter, update, null, function (err, result) {
      if (err) {
        return err;
      }
    });
  } else {
    console.log("didn't work");
    res.render("views/pages/admin", {
      user: req.user,
      errors: ["Password failed. Please try again."],
    });
  }
  res.redirect("/");
};

exports.delete_post = function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, results) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    return res.redirect("/");
  });
};
