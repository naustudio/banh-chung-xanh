// Bootstrap the app when server start here
/*global Assets, Settings, InitialSettings*/
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
				map = JSON.parse(Assets.getText(myJSON.maps[mapNumber].src));
				return map;
			}
		}
	});
});
