const express = require('express');
const { body } = require('express-validator');

const User = require('../models/user');
const authController = require('../controllers/auth');

const router = express.Router();

router.put(
  '/signup',
  [
    body('email')
      .isEmail()
      .withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        console.log('ayo');
        return User.findOne({ email: value })
          .then((userDoc) => {
            if (userDoc) {
              return Promise.reject('Email-address already exissts');
            }
          })
          .catch((err) => {
            if (!err.statusCode) {
              err.statusCode = 422;
            }
            next(err);
          });
      })
      .normalizeEmail(),
    body('password').trim().isLength({
      min: 5,
    }),
    body('name').trim().not().isEmpty(),
  ],
  authController.signup
);

module.exports = router;
