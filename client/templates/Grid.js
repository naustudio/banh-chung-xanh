Template.gridMap.rendered = function() {

};

Template.gridMap.helpers({
	squares: function() {
		var game = Session.get('game');
		return game ? game.mapRenderedHTML : [];
	},
	isHidden: function() {
		var isHidden = 'hidden';
		return isHidden;
	}
});

Template.gridMap.events({

});