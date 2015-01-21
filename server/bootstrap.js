// Bootstrap the app when server start here

Meteor.startup(function() {
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
