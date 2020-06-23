const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const HttpError = require('../models/http-error');
const getCoordsForAddress = require('../util/location');
const Place = require('../models/places');
const User = require('../models/user');

async function getPlaces(req, res, next) {
	const title = req.query.title;
	var condition = title
		? { title: { $regex: new RegExp(title), $options: 'i' } }
		: {};

	let places;
	try {
		places = await Place.find(condition, '-creator');
	} catch (err) {
		const error = new HttpError(
			'Could not search the location, please try again later.',
			500
		);
		return next(error);
	}
	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
}

async function getPlaceById(req, res, next) {
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place.',
			500
		);
		return next(error);
	}

	// if can't find -> send to error handling fcn in app.js
	if (!place) {
		const error = new HttpError(
			'Could not find a place for the provided id.',
			404
		);
		return next(error);
	}

	// send JSON data with res.json(). takes any data type & convert to JSON
	res.json({ place: place.toObject({ getters: true }) }); //=> {place} => { place: place}
}

async function getPlacesByUserId(req, res, next) {
	const userId = req.params.uid;

	// an array of all places created by user
	let places;
	try {
		//alternative syntax: userWithPlaces = await User.findById(userId).populate('places');
		places = await Place.find({ creator: userId });
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not find a place.',
			500
		);
		return next(error);
	}

	if (!places || places.length === 0) {
		const error = new HttpError('This user does not have any places.', 404);
		return next(error);
	}

	res.json({
		places: places.map((place) => place.toObject({ getters: true })),
	});
}

// async fnc b/c need to wait for coords to arrive from locationiq
async function createPlace(req, res, next) {
	// npm validation package - make sure location doesn't exist yet/inputs valid
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		// can't use throw with async code
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { title, description, address } = req.body;

	// convert address to coords w/ locationiq
	let coordinates;
	try {
		coordinates = await getCoordsForAddress(address);
	} catch (error) {
		//return = quit
		return next(error);
	}

	const createdPlace = new Place({
		title,
		description,
		address,
		location: coordinates,
		// move image address to ENV file
		// image:
		// 	'https://lh3.googleusercontent.com/YOO_4uEfwsdMTx_Zwfhnmi9FZTBi-5Ny17LGQZ_RcwpD4xexwrA3d1Ci_6bvfhMcfiUzlQ5-YBVbjMUSM0bbyFXFDudkDj4svF6JBWQ4sgaAw2237gAHLm4UOMEKkuyPyfjKyeff3mLb3UbIqezbZn0VcadE-MNZUPf-ZuRMmYBwWLexfUSPTGq6Jg3MSubMoe0cv21UbIaohIsK1hEVvtkeDeVRzwbJu6aKrezjk2vQ7TQZd9DQV6riDmvjuqEMZQddxFNxkfhlcEHQnm9CoJHQJHQ0PyuctB09_mdMy-jRXxVpSXPjYyF1wPLpZjfH3b_d3aTmIkm4POAvQ9PNcyPIUJMmy0yg56AJglvQKQMC7Nx-aNvUHuKQN5h-KPNpcUbBvLkex4iehp1RZIOnU0bFf2KUfCYu-ONolZKrSb2T-W8-f_AD3Ckhv5XM79Wm0njSUeU0DdoB9Pgve3i7HE2M6nlaU_Dl9HFD3XTrORXO7ZaCYRpgwn4hR47AsKhSaz_LapuzhEMGyfWmVkuhEBYdiPWySD0jxRj5hYt1PIhDF3iQ-e2Z335DpCi-_Kmkzamoj03YfZFGwmuEl7NLwYBpk2kP7feXGn7N_WWTL4xwBPKAfsMvUmyymSLWKlEvfsVj2htQDsY8rdEZHO61BhXcrJS_gOvQ_Jo4B-WFBeRvQgJrWcp5WhXqN661JU0=w1382-h976-no?authuser=0',
		creator: req.userData.userId,
	});

	//check if user id exists
	let user;
	try {
		user = await User.findById(req.userData.userId);
	} catch (err) {
		const error = new HttpError(
			'Creating place failed, please try again.',
			500
		);
		return next(error);
	}

	if (!user) {
		const error = new HttpError('Could not find user for provided id.', 404);
		return next(error);
	}

	try {
		const sess = await mongoose.startSession();
		sess.startTransaction();
		//save place to a session w/ specific id created by mongoose
		await createdPlace.save({ session: sess });
		//save place to user
		user.places.push(createdPlace);
		await user.save({ session: sess });
		//if any error in this session/transaction, all changes cancelled
		await sess.commitTransaction();
	} catch (err) {
		//database validation fails or database down
		const error = new HttpError(
			'Creating place failed, please try again.',
			500
		);
		return next(error);
	}

	//201 = sucessfully created something new
	res.status(201).json({ place: createdPlace });
}

async function updatePlace(req, res, next) {
	const errors = validationResult(req);
	if (!errors.isEmpty()) {
		console.log(errors);
		return next(
			new HttpError('Invalid inputs passed, please check your data.', 422)
		);
	}

	const { title, description } = req.body;
	const placeId = req.params.pid;

	let place;
	try {
		place = await Place.findById(placeId);
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not update place.',
			500
		);
		return next(error);
	}

	if (place.creator.toString() !== req.userData.userId) {
		const error = new HttpError('You are not allowed to edit this place.', 401);
		return next(error);
	}

	place.title = title;
	place.description = description;

	try {
		await place.save();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not update place.',
			500
		);
		return next(error);
	}

	res.status(200).json({ place: place.toObject({ getters: true }) });
}

async function deletePlace(req, res, next) {
	const placeId = req.params.pid;

	let place;
	try {
		//populate: will delete place from both places and users collections
		place = await Place.findById(placeId).populate('creator');
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete place.',
			500
		);
		return next(error);
	}

	//check if place id exists
	if (!place) {
		const error = new HttpError('Could not find place for this id.', 404);
		return next(error);
	}

	if (place.creator.id !== req.userData.userId) {
		const error = new HttpError(
			'You are not allowed to delete this place.',
			401
		);
		return next(error);
	}

	try {
		await place.remove();
		//delete only if everything goes through successfully
		const sess = await mongoose.startSession();
		sess.startTransaction();
		//remove place from places collection
		await place.remove({ session: sess });
		//remove place from users collection
		await place.creator.places.pull(place);
		//save new data changes to creator
		await place.creator.save({ session: sess });
		//if any error in this session/transaction, all changes cancelled
		await sess.commitTransaction();
	} catch (err) {
		const error = new HttpError(
			'Something went wrong, could not delete place.',
			500
		);
		return next(error);
	}

	res.status(200).json({ message: 'Deleted place.' });
}

exports.getPlaces = getPlaces;
exports.getPlaceById = getPlaceById;
exports.getPlacesByUserId = getPlacesByUserId;
exports.createPlace = createPlace;
exports.updatePlace = updatePlace;
exports.deletePlace = deletePlace;
