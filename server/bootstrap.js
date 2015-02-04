// Bootstrap the app when server start here
/*global Assets, Settings, InitialSettings*/
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
				var gameScores = user.gameScores;
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
		}

	});

	// Users collection
	Meteor.users.allow({
		insert: function(userID/*, document*/) {
			console.log('=== inserted' + userID);
			return true;
		},
		update: function(userID/*, document*/) {
			console.log('=== updated' + userID);
			return true;
		},
		remove: function(userID/*, document*/) {
			console.log('=== removed' + userID);
			return true;
		}
	});

	Meteor.setInterval(function() {
		var remainingDate = _calculateRemainingDate();
		Settings.setItem('remainingDate', remainingDate);
	}, 10000);

});
