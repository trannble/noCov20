//validate incoming request for token to access certain routes
//token is stored in header

const jwt = require('jsonwebtoken');

const HttpError = require('../models/http-error');

module.exports = (req, res, next) => {
	if (req.method === 'OPTIONS') {
		return next();
	}
	try {
		const token = req.headers.authorization.split(' ')[1]; //Authorization: 'Bearer TOKEN'
		if (!token) {
			throw new Error('Authentication failed');
		}
		//verify token
		const decodedToken = jwt.verify(token, process.env.JWT_KEY);
		//add userId to request
		req.userData = { userId: decodedToken.userId };
		next();
	} catch (err) {
		const error = new HttpError('Authentication failed!', 403);
		return next(error);
	}
};
