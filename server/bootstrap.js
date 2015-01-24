// Bootstrap the app when server start here
/*global Assets, Settings*/
Meteor.startup(function() {
	if (Settings.find().count() === 0) {
		var defaultSettings = [
			{
				key: 'totalAmount',
				value: 50000000
			},
			{
				key: 'endDate',
				// note: it's GMT time
				value: new Date('2015-02-24T7:00:00.000Z')
			}
		];

		_.each(defaultSettings, function(item) {
			Settings.insert(item);
		});

	}

	Meteor.methods({
		map : function(mapNumber) {
			var map;
			if (mapNumber === undefined) {
				mapNumber = 0;
			}
			var myJSON = JSON.parse(Assets.getText('maps/maps-config.json'));
			if (myJSON && myJSON.maps && myJSON.maps[mapNumber].src) {
				map = JSON.parse(Assets.getText(myJSON.maps[mapNumber].src));
				return map;
			}
		}
	});
});
