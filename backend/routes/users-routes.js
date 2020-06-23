const express = require('express');
const { check } = require('express-validator');

const usersControllers = require('../controllers/users-controller');

const router = express.Router();

// don't repeat filter path from app.js
// important note: router order MATTERS! this route will take any input in same format as id

router.get('/', usersControllers.getUsers);

router.post(
	'/signup',
	[
		check('name').not().isEmpty(),
		check('email').normalizeEmail().isEmail(),
		check('password').isLength({ min: 7 }),
	],
	usersControllers.signupUser
);

router.post('/login', usersControllers.loginUser);

module.exports = router;
