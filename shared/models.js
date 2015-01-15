/* © 2014 NauStud.io
 * @author Thanh Tran
 */
/*global Model:true, Sponsor:true, Player:true*/
/**
 * Prototype for new model object
 * These models are for data validation only,
 * they are not meant to be extended with method
 * @class
 */
Model = function(data) {
	this.validate(data);
};

/**
 * List of possible data type can be used to checked against
 */
var STRING = Model.STRING = 'String';
var NUMBER = Model.NUMBER = 'Number';
var ARRAY = Model.ARRAY = 'String'; /* jshint ignore:line */
var BOOLEAN = Model.BOOLEAN = 'Boolean'; /* jshint ignore:line */
var DATE = Model.DATE = 'Date';
var OBJECT = Model.OBJECT = 'Object'; /* jshint ignore:line */

Model.prototype = {
	constructor: Model,

	validate: function(obj) {
		// The validator object is set to the class constructor to avoid being saved to DB
		// it is done automatically if use Model.extend()
		var validator = this.constructor.validator;
		if (!this.checkType(validator, OBJECT)) {
			throw new Error('No validator object set at this model constructor');
		}

		for (var prop in obj) {
			if (this.checkType(obj[prop], validator[prop])) {
				// correct data
				this[prop] = obj[prop];
				continue;
			} else {
				// incorrect data or not existed
				throw new Error('Data type for \'' + prop + '\' is mismatched or not existed');
			}
		}

		// check for missing fields
		for (prop in validator) {
			if (obj[prop] === undefined) {
				console.warn('\'' + prop + '\' is missing when setting data for model of', validator);
			}
		}

		return this;
	},

	checkType: function(obj, type) {
		return (Object.prototype.toString.call(obj) === '[object ' + type + ']');
	}
};

/**
 * Very simple and naive class extend sugar
 * @return {[type]} [description]
 * @param {Object} validator The validator object
 */
Model.extend = function(validator) {
	var ModelClass = function() {
		Model.apply(this, arguments);
	};

	ModelClass.validator = validator;
	ModelClass.prototype = Object.create(this.prototype);
	ModelClass.prototype.constructor = ModelClass;
	return ModelClass;
};

/**
 * Sponsor object model
 * @class
 */
Sponsor = Model.extend({
	name: STRING,
	amount: NUMBER,
	date: DATE,
	entryDate: DATE,
	test: BOOLEAN
});

/**
 * Player object model
 * @class
 */
Player = Model.extend({
	name: STRING,
	avatar: STRING,
	duration: NUMBER,
	maxRound: NUMBER, // we'll use this property to calculate the amount pledged to donate
	lastAccess: DATE
});
