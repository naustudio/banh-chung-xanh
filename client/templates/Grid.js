Template.gridMap.rendered = function() {

};

Template.gridMap.helpers({
	squares: function() {
		var game = Session.get('game');
		return game ? game.mapRenderedHTML : [];
	}
});

Template.gridMap.events({

});