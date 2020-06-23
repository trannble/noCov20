const uniqueValidator = require('mongoose-unique-validator');
const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const userSchema = new Schema({
	name: { type: String, required: true },
	//unique = speed up querying process (email is used very often), creates internal index
	email: { type: String, required: true, unique: true },
	password: { type: String, required: true, minlength: 7 },
	image: { type: String, required: true }, //url
	places: [{ type: mongoose.Types.ObjectId, required: true, ref: 'Place' }],
});

userSchema.plugin(uniqueValidator);

module.exports = mongoose.model('User', userSchema);
