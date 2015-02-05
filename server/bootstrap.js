// Bootstrap the app when server start here
/*global Assets, Settings, InitialSettings, Accounts */
var _calculateRemainingDate = function() {
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

		getRemainingDate: function() {
			return _calculateRemainingDate();
		},

		getDonatedAmount: function() {
			var amount = Settings.getItem('donatedAmount');
			amount = amount ? amount : 0;
			return amount;
		},
		updateDonationTotal: function() {
			var mapConfig = JSON.parse(Assets.getText('maps/maps-config.json'));
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
								sumOfDonation += ( parseInt(gameScores[i].count,10) * value );
								//console.log(gameScores[i].count,Settings.findOne({key: mapConfig.mapsDonation[level.toString()]}));
							}
						}
					}
				}
				Settings.setItem('donatedAmount', sumOfDonation);
			});
			return sumOfDonation;
		},
		userDonates : function(mapId) {
			var mapConfig = JSON.parse(Assets.getText('maps/maps-config.json'));
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
			return value;
		},
		arrayMappingDonation: function() {
			//var arrayDonation = [];
			var mapConfig = JSON.parse(Assets.getText('maps/maps-config.json'));
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
		userDonatesAmount : function(money) {
			var donatedAmount = Settings.getItem('donatedAmount');
			Settings.setItem('donatedAmount', donatedAmount + money);
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

	Meteor.setInterval(function() {
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
