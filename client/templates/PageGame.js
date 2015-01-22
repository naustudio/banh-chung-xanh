Template.PageGame.rendered = function() {
	console.log('===page render');
	Meteor.call('map', 0, function(error, result) {
		//we parse the game and init the game
		Session.set('game', new window.chungapp.Game());
	});
};

Template.PageGame.helpers({
	mapData: function() {
		console.log(Session.get('map'));
		return Session.get('map');
	}
});

Template.PageGame.events({

});