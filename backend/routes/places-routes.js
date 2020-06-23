const express = require('express');
const { check } = require('express-validator');

const placesControllers = require('../controllers/places-controller');
const checkAuth = require('../middleware/check-auth');

const router = express.Router();

//these routes are open to everyone
// old is '/'
router.get('/', placesControllers.getPlaces);

router.get('/:pid', placesControllers.getPlaceById);

router.get('/user/:uid', placesControllers.getPlacesByUserId);

//request w/o valid token stops here
router.use(checkAuth);

router.post(
	'/',
	[
		check('title').not().isEmpty(),
		check('description').isLength({ min: 5 }),
		check('address').not().isEmpty(),
	],
	placesControllers.createPlace
);

router.patch(
	'/:pid',
	[check('title').not().isEmpty(), check('description').isLength({ min: 5 })],
	placesControllers.updatePlace
);

router.delete('/:pid', placesControllers.deletePlace);

// later add another for location name or address & search bar

module.exports = router;
