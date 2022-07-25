const Post = require('../models/post');
const User = require('../models/user');
const passport = require('passport');
const { body, validationResult } = require('express-validator');
const axios = require('axios');
const { response } = require('express');

exports.get_new_post = (req, res) =>
  res.render('views/pages/post_form', { user: req.user, errors: [] });

exports.add_new_post = [
  body('message', 'Text required').trim().isLength({ min: 1 }),
  body('title', 'Title required').trim().isLength({ min: 1 }),
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      console.log(errors);

      res.render('views/pages/post_form', {
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
        res.redirect('/');
      });
    }
  },
];
exports.post_list = function (req, res) {
  Post.find({}, '')
    .sort({ timestamp: 1 })
    .exec(function (err, list_posts) {
      if (err) {
        return res.status(400).json({
          success: false,
          error: err,
        });
      }

      res.render('views/pages/post_list', {
        post_list: list_posts,
        user: req.user,
      });
    });
};

exports.get_join = function (req, res) {
  res.render('views/pages/join', { user: req.user, errors: [] });
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
    return res.render('views/pages/join', {
      user: req.user,
      errors: ['Password failed. Please try again.'],
    });
  }
  res.redirect('/join');
};

exports.get_admin = function (req, res) {
  res.render('views/pages/admin', { user: req.user, errors: [] });
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
    return res.render('views/pages/admin', {
      user: req.user,
      errors: ['Password failed. Please try again.'],
    });
  }
  res.redirect('/admin');
};

exports.delete_post = function (req, res) {
  Post.findByIdAndRemove(req.params.id, function (err, results) {
    if (err) {
      return res.status(400).json({
        success: false,
        error: err,
      });
    }
    return res.redirect('/');
  });
};

exports.get_quiz = function (req, res, next) {
  axios
    .get('https://opentdb.com/api.php?amount=1&difficulty=easy&type=boolean')
    .then((response) => {
      const category = response.data.results[0].category;
      const question = response.data.results[0].question
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
      const correct_answer = response.data.results[0].correct_answer;
      const incorrect_answer = response.data.results[0].incorrect_answers[0];
      res.render('views/pages/quiz', {
        user: req.user,
        errors: [],
        category: category,
        question: question,
        correct_answer: correct_answer,
        password: '$%hardtoguess',
      });
    })
    .catch((error) => {
      console.log(error);
    });
};

exports.get_quiz_admin = function (req, res, next) {
  axios
    .get('https://opentdb.com/api.php?amount=1&difficulty=medium&type=boolean')
    .then((response) => {
      const category = response.data.results[0].category;
      const question = response.data.results[0].question
        .replace(/&quot;/g, '"')
        .replace(/&#039;/g, "'");
      const correct_answer = response.data.results[0].correct_answer;
      const incorrect_answer = response.data.results[0].incorrect_answers[0];
      res.render('views/pages/quiz_admin', {
        user: req.user,
        errors: [],
        category: category,
        question: question,
        correct_answer: correct_answer,
        password: '$%reallyhardtoguess',
      });
    })
    .catch((error) => {
      console.log(error);
    });
};
