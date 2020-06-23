const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const placeSchema = new Schema({
	title: { type: String, required: true },
	description: { type: String, required: true },
	//will be stored somewhere else
	// image: { type: String, required: true },
	address: { type: String, required: true },
	location: {
		lat: { type: Number, required: true },
		lng: { type: Number, required: true },
	},
	//connect to User
	creator: { type: mongoose.Types.ObjectId, required: true, ref: 'User' },
});

module.exports = mongoose.model('Place', placeSchema);
