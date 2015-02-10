// Bootstrap the app when server start here
/*global Assets, Settings, InitialSettings, Accounts, Sponsors */
var _calculateRemainingDate = function() {
	var endDate = Settings.getItem('endDate');
	var currentServerDate = new Date();
	var remainingDate = (endDate.valueOf() - currentServerDate.valueOf())/(1000*60*60*24);
	remainingDate = Math.ceil(remainingDate);
	remainingDate = Math.max(remainingDate, 0);
	return remainingDate;
};

Meteor.startup(function() {
	Meteor.mapConfig = JSON.parse(Assets.getText('maps/maps-config.json'));

	Meteor.isAdmin = function (userId) {
		var adminUser = Meteor.adminUser;

		if (!adminUser) {
			adminUser = Meteor.users.findOne({"emails": {$elemMatch: {address:"adminbcx@naustud.io"}}});
		}
		Meteor.adminUser = adminUser;

		return Meteor.adminUser && Meteor.adminUser._id === userId;
	};

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
			var myJSON = Meteor.mapConfig;
			if (myJSON && myJSON.maps && myJSON.maps[mapNumber].src) {
				var mapLevel = myJSON.maps[mapNumber].mapLevel;
				map = JSON.parse(Assets.getText(myJSON.maps[mapNumber].src));

				return {
					'map' : map,
					'mapLevel' : mapLevel
				};
			}
		},

		getRemainingDate: function() {
			return _calculateRemainingDate();
		},

		getDonatedAmount: function() {
			var amount = Settings.getItem('donatedAmount');
			amount = amount ? amount : 0;
			return amount;
		},

		updateDonationTotal: function() {
			var mapConfig = Meteor.mapConfig;
			var sumOfDonation = 0;
			//console.log(Settings.find({}).fetch());
			Meteor.users.find({}).forEach( function(user) {
				var gameScores = user.gameScores ? user.gameScores : [];
				var level = 0;
				var value = 0;
				var valueObj = null;
				var i = 0;
				var j = 0;
				for (i = 0; i < gameScores.length; i++) {
					for (j = 1; j < mapConfig.maps.length; j++) {
						if ( mapConfig.maps[j].index.toString() === gameScores[i].mapIndex.toString() ) {
							level = mapConfig.maps[j].mapLevel;
							if (level) {
								valueObj = Settings.findOne({key: mapConfig.mapsDonation[level.toString()]});
								value = parseInt(valueObj.value,10);
								sumOfDonation += value;
								//console.log(gameScores[i].count,Settings.findOne({key: mapConfig.mapsDonation[level.toString()]}));
							}
						}
					}
				}
			});
			Settings.setItem('donatedAmount', sumOfDonation);
			return sumOfDonation;
		},

		userDonates : function(mapId) {
			if (!Meteor.userId()) {
				return 0;
			}
			var mapConfig = Meteor.mapConfig;
			var i = 0;
			var level = 0;
			var value = 0;
			var valueObj = null;
			var updateStatus = false;

			for (i = 1; i < mapConfig.maps.length; i++) {
				if ( parseInt(mapId, 10) === mapConfig.maps[i].index ) {
					updateStatus = true;
					level = mapConfig.maps[i].mapLevel;
					valueObj = Settings.findOne({key: mapConfig.mapsDonation[level.toString()]});
					value = parseInt(valueObj.value,10);
				}
			}
			Meteor.call('increaseDonatesAmount', value);
			return value;
		},

		arrayMappingDonation: function() {
			//var arrayDonation = [];
			var mapConfig = Meteor.mapConfig;
			var i = 0;
			var level = 0;
			var value = 0;
			var valueObj = null;
			var tempItemDonation = {};
			for (i = 1; i < mapConfig.maps.length; i++) {
				level = mapConfig.maps[i].mapLevel;
				valueObj = Settings.findOne({key: mapConfig.mapsDonation[level.toString()]});
				value = parseInt(valueObj.value,10);
				tempItemDonation[mapConfig.maps[i].index.toString()] = value;
				//arrayDonation.push(tempItemDonation);
			}
			return tempItemDonation;
		},

		increaseDonatesAmount : function(money) {
			var donatedAmount = Settings.getItem('donatedAmount');
			Settings.setItem('donatedAmount', donatedAmount + money);
		},

		updateUserScore: function(mapId, result) {
			if (!Meteor.user()) {
				return false;
			}
			Meteor.users.update({
				_id: Meteor.userId(),
				'gameScores': {
					$elemMatch: {
						mapIndex: mapId
					}
				}
			}, {
				$set: {
					'gameScores.$.elapsedTime': result.elapsedTime,
					'gameScores.$.usedSteps': result.usedSteps,
					'gameScores.$.count': result.count,
					'gameScores.$.updatedAt': result.updatedAt
				}
			});

			return result;
		}
	});

	/*
		Set up security for all of collection that we need to protect from anonymous access
	*/
	// Users collection
	Meteor.users.allow({
		insert: function(/*userID, document*/) {
			//TODO we need to check if permitted to perform this operation.
			return false;
		},
		update: function(userID/*, document*/) {
			//TODO we need to check if permitted to perform this operation.
			console.log('=== update' + userID);

			return !!Meteor.user();
		},
		remove: function(userID/*, document*/) {
			//TODO we need to check if permitted to perform this operation.
			console.log('=== removed' + userID);
			return false;
		}
	});

	Settings.allow({
		insert: function (userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.adminId && userId === Meteor.adminId;
		},
		update: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.adminId && userId === Meteor.adminId;
		},
		remove: function (userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.adminId && userId === Meteor.adminId;
		}
	});

	Settings.allow({
		insert: function (userId) {
			//TODO we need to check if permitted to perform this operation.
			// console.log('=== insert' + userID);
			return Meteor.isAdmin(userId);
		},
		update: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
		remove: function (userId) {
			//TODO we need to check if permitted to perform this operation.
			// console.log('=== removed' + userID);
			return Meteor.isAdmin(userId);
		}
	});

	Sponsors.allow({
		insert: function (userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
		update: function(userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		},
		remove: function (userId) {
			//TODO we need to check if permitted to perform this operation.
			return Meteor.isAdmin(userId);
		}
	});

	Meteor.setInterval(function() {
		var remainingDate = _calculateRemainingDate();
		Settings.setItem('remainingDate', remainingDate);
	}, 10000);

	//Capture account events
	Accounts.onCreateUser(function(options, user) {
		var profile = options.profile || {};

		var usedPasswordService = !!(options.password);

		if (usedPasswordService) {
			profile.name = options.username || profile.name;
		}

		user.lastAccess = new Date().valueOf();

		user.profile = profile;

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

	Meteor.call('updateDonationTotal');
});
