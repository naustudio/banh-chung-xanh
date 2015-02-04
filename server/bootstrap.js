// Bootstrap the app when server start here
/*global Assets, Settings, InitialSettings, Accounts */
var _calculateRemainingDate = function () {
	var endDate = Settings.getItem('endDate');
	var currentServerDate = new Date();
	var remainingDate = (endDate.valueOf() - currentServerDate.valueOf())/(1000*60*60*24);
	remainingDate = Math.ceil(remainingDate);
	remainingDate = Math.max(remainingDate, 0);
	return remainingDate;
};

Meteor.startup(function() {

	InitialSettings.forEach(function(item) {
		if (Settings.findOne({key: item.key}) === undefined) {
			// insert settings that are not available in the collection yet
			console.log('Setting item', item.key, 'not set. Adding to DB');
			Settings.insert(item);
		}
	}, this);

	Meteor.methods({
		map : function(mapNumber) {
			var map;
			if (mapNumber === undefined) {
				mapNumber = 0;
			}
			var myJSON = JSON.parse(Assets.getText('maps/maps-config.json'));
			if (myJSON && myJSON.maps && myJSON.maps[mapNumber].src) {
				var mapLevel = myJSON.maps[mapNumber].mapLevel;
				map = JSON.parse(Assets.getText(myJSON.maps[mapNumber].src));

				return {
					'map' : map,
					'mapLevel' : mapLevel
				};
			}
		},

		getRemainingDate: function () {
			return _calculateRemainingDate();
		},

		getDonatedAmount: function () {
			var amount = Settings.getItem('donatedAmount');
			amount = amount ? amount : 0;
			return amount;
		}

	});

	// Users collection
	Meteor.users.allow({
		insert: function(/*userID, document*/) {
			//TODO we need to check if permitted to perform this operation.
			return false;
		},
		update: function(userID/*, document*/) {
			//TODO we need to check if permitted to perform this operation.
			console.log('=== removed' + userID);

			return Meteor.userId() && Meteor.userId() === userID;
		},
		remove: function(userID/*, document*/) {
			//TODO we need to check if permitted to perform this operation.
			console.log('=== removed' + userID);
			return false;
		}
	});

	Meteor.setInterval(function () {
		var remainingDate = _calculateRemainingDate();
		Settings.setItem('remainingDate', remainingDate);
	}, 10000);

	//Capture account events
	Accounts.onCreateUser(function(options, user) {
		var profile = options.profile = user.profile || {};

		profile.name = user.username || profile.name;
		user.lastAccess = new Date().valueOf();

		if (options.profile) {
			user.profile = options.profile;
		}

		return user;
	});

	Accounts.onLogin(function(options) {
		Meteor.users.update({
			_id: options.user._id
		}, {
			$set: {
				lastAccess: new Date().valueOf()
			}
		});
	});
});
