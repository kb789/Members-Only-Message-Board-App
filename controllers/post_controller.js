const Post = require("../models/post");
const User = require("../models/user");
const passport = require("passport");

exports.get_new_post = (req, res) =>
  res.render("views/pages/post_form", { user: req.user });

exports.add_new_post = (req, res, next) => {
  console.log(req.user);
  const user = new Post({
    title: req.body.title,
    text: req.body.message,
    user: req.user.username,
  }).save((err) => {
    if (err) {
      return next(err);
    }
    res.render("views/pages/index", { user: req.user });
  });
};

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
  res.render("views/pages/join", { user: req.user });
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
  }
  res.redirect("/");
};

exports.get_admin = function (req, res) {
  res.render("views/pages/admin", { user: req.user });
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