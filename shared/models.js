/* © 2014 NauStud.io
 * @author Thanh Tran
 */
/*global Model:true, Sponsor:true, User:true*/
/**
 * Prototype for new model object
 * These models are for data validation only,
 * they are not meant to be extended with method
 * @class
 */
Model = function(data) {
	this.set(data);
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

	set: function(data) {
		var value;
		for (var prop in data) {
			value = data[prop];
			if (typeof value !== 'function') {
				this[prop] = value;
			}
		}
		this.validate();
	},

	validate: function() {
		// The validator property is expected
		// it is done automatically if use Model.extend()
		var validator = this.constructor.validator;
		if (!this.checkType(validator, OBJECT)) {
			throw new Error('No validator object set at this model constructor');
		}

		for (var prop in this) {
			if (this.hasOwnProperty(prop)) {
				if (this.checkType(this[prop], validator[prop])) {
					continue;
				} else {
					// incorrect data or not existed
					throw new Error('Data type for \'' + prop + '\' is mismatched or not existed');
				}
			}
		}

		// check for missing fields
		for (prop in validator) {
			if (this[prop] === undefined) {
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
 * @param {Object} validator The validator object
 * @param {Object} proto The prototype object, should contain functions only
 * @return {Function} Class constructor
 */
Model.extend = function(validator, proto) {
	var ModelClass = function() {
		Model.apply(this, arguments);
	};

	ModelClass.validator = validator;
	ModelClass.prototype = _.extend(Object.create(this.prototype), proto || {});
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
	entryDate: DATE
});

/**
 * User / Player object model
 * @class
 */
User = Model.extend({
	name: STRING,
	avatar: STRING,
	duration: NUMBER,
	maxRound: NUMBER, // we'll use this property to calculate the amount pledged to donate
	lastAccess: DATE
});
