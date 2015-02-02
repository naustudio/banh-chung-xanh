// Bootstrap the app when server start here
/*global Assets, Settings, InitialSettings*/
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

	Meteor.setInterval(function () {
		var remainingDate = _calculateRemainingDate();
		Settings.setItem('remainingDate', remainingDate);
	}, 10000);

});
