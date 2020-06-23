const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const placesRoutes = require('./routes/places-routes');
const usersRoutes = require('./routes/users-routes');
const HttpError = require('./models/http-error');

const app = express();

// will parse received json -> js objects
app.use(bodyParser.json());

app.use((req, res, next) => {
	//set header on response for CORS (browser security) errors
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader(
		'Access-Control-Allow-Headers',
		'Origin, X-Requested-With, Content-Type, Accept, Authorization'
	);
	res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, DELETE');
	next();
});

// filters to only foward routes that matches and/or start with '/api/places'
app.use('/api/places', placesRoutes);

app.use('/api/users', usersRoutes);

// if request doesn't match any other
app.use((req, res, next) => {
	const error = new HttpError('Could not find this route.', 404);
	throw error;
});

// middleware fnc applied to every request since not specified (for error handling)
// this fcn will execute if any previous throws error
app.use((error, req, res, next) => {
	//check if response has been sent
	if (res.headerSent) {
		return next(error);
	}
	// set status code or 500 default if none
	res.status(error.code || 500);
	res.json({ message: error.message || 'An unknown error occurred!' });
});

mongoose
	.connect(
		`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.ogbpj.mongodb.net/${process.env.DB_NAME}?retryWrites=true&w=majority`,
		{ useNewUrlParser: true, useUnifiedTopology: true }
	)
	// if successful
	.then(() => {
		app.listen(process.env.PORT || 5000);
	})
	// catch error
	.catch((err) => {
		console.log(err);
	});
mongoose.set('useCreateIndex', true);
