const HttpError = require('../models/http-error');
const { validationResult } = require('express-validator');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

//add google auth

async function getUsers(req, res, next) {
	/* get back everything but password. can also write:
	const users = User.find({}, 'email name'); */
	let users;
	try {
		users = await User.find({}, '-password');
	} catch (err) {
		const error = new HttpError(
			'Fetching users failed, please try again later.',
			500
		);
		return next(error);
	}
	res.json({ users: users.map((user) => user.toObject({ getters: true })) });
}

async function signupUser(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { name, email, password } = req.body;

	//check if email exist
	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		return next(error);
	}

	if (existingUser) {
		const error = new HttpError(
			'User exists already, please login instead.',
			422
		);
		return next(error);
	}

	let hashedPassword;
	try {
		hashedPassword = await bcrypt.hash(password, 12);
	} catch (err) {
		const error = new HttpError(
			'Could not create user, please try again.',
			500
		);
		return next(error);
	}

	const createdUser = new User({
		name,
		email,
		image:
			'https://lh3.googleusercontent.com/ybN9VduDqj-M-QQgT26DB20xbbgfwO_lGiqoLD25rfF1Pt_dnu8gB4wmSbKKEr6sRZ_xIAfxVrj_gRHh3JMOtWVgPAGlVHQwnE0zyTl_Nr2RM2swVHwDOEYKgRMxsw3rugsrqR3thOLH9w855mg1Zgd6Oy2ZqV97g3-BeiV_Id7sBtn1lRSIh5plnsWKQ0hJRCzWnbrs9hJWwrB_ytUPnbEgsfqdZ420z3h84_TIWOr3LB8-Y7CDUGQLe0gEKVv7kbdG69ErB9RO3XsJb3_prEqrVZfmnsZvpBFLEShGK0Zdl6p-B548-QgNM3TLnBJ2PF0EPPQCAEJssmy9y608CaW3lIi3HXemPQfdvTn_u75y96SYrllqbM9HZfTuhEsEULgd74B1RKjttCvftwmKVq6gPkvdMyg7p57hcvP_QYrDZT8moJOs8DRyFgROeMrUV0xUTiLiO6VcYRFEyD5jff3cmXGw-IzYJjkPHP1xrLVyDjOlugFlK5CFKBn65IvsHSXyazD29ynmRzCHWUNDqeokvphZUNV0dljD0TNp928QuKWA8tf3Ub0Dtm5fT3dqpfgJp6yrbaQ4-mXYGnPK09hHWidOOAXh79FEgI2GTb0RXJGwqNXPCthy0wMU-Nknd_qk6aRgKpXucdET1G3Mnbi76sPNN4qtUmAmTD1swzpRkcYTeYreumcVtMeJD6I=w709-h710-no?authuser=0',
		password: hashedPassword,
		places: [],
	});

	try {
		await createdUser.save();
	} catch (err) {
		const error = new HttpError('Signing up failed, please try again.', 500);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: createdUser.id, email: createdUser.email },
			//encode in env
			process.env.JWT_KEY,
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		return next(error);
	}

	//getters removed ._ in front of id in mongoDB
	res.status(201).json({
		user: createdUser.toObject({
			userId: createdUser.id,
			email: createdUser.email,
			token: token,
		}),
	});
}

async function loginUser(req, res, next) {
	const { email, password } = req.body;

	let existingUser;
	try {
		existingUser = await User.findOne({ email: email });
	} catch (err) {
		const error = new HttpError(
			'Signing up failed, please try again later.',
			500
		);
		return next(error);
	}

	if (!existingUser) {
		const error = new HttpError('Invalid credentials, please try again.', 403);
		return next(error);
	}

	let isValidPassword = false;
	try {
		isValidPassword = await bcrypt.compare(password, existingUser.password);
	} catch (err) {
		const error = new HttpError(
			'Could not log you in, please check your credentials and try again.',
			500
		);
		return next(error);
	}

	if (!isValidPassword) {
		const error = new HttpError('Invalid credentials, please try again.', 403);
		return next(error);
	}

	let token;
	try {
		token = jwt.sign(
			{ userId: existingUser.id, email: existingUser.email },
			//encode in env
			process.env.JWT_KEY,
			{ expiresIn: '1h' }
		);
	} catch (err) {
		const error = new HttpError(
			'Logging in failed, please try again later.',
			500
		);
		return next(error);
	}

	res.json({
		userId: existingUser.id,
		email: existingUser.email,
		token: token, //add route protection (only if request have authenticated tokens attached)
	});
}

exports.getUsers = getUsers;
exports.loginUser = loginUser;
exports.signupUser = signupUser;
