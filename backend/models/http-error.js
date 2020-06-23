// creating a blueprint for error javascript object
class HttpError extends Error {
	// inherits from built in Error class

	// runs everytime new object created from class
	constructor(message, errorCode) {
		super(message); //Add a "message" property
		this.code = errorCode; // Adds a "code" property
	}
}

module.exports = HttpError;
