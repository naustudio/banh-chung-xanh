var game = null;

Template.PageGame.rendered = function() {
	Meteor.call('map', 0, function(error, result) {
		//we parse the game and init the game
		game = new window.chungapp.Game();
		game.setMapData(result.data);

		Session.set('game', game);
	});
};

Template.PageGame.helpers({
	userStep: function() {
		return game ? game.getNumStep() : 0;
	}
});

Template.PageGame.events({
	'click .control-top' : function(event) {
		console.log('==move top');
		//var game = Session.get('game');
		game.goUp();
	},

	'click .control-left' : function(event) {
		console.log('==move left');
		//var game = Session.get('game');
		game.goLeft();
	},

	'click .control-right' : function(event) {
		console.log('==move right');
		//var game = Session.get('game');
		game.goRight();
	},

	'click .control-bottom' : function(event) {
		console.log('==move bottom');
		//var game = Session.get('game');
		game.goDown();
	},

	'click .play-again .icon-arrow' : function(event) {
		console.log('==restart');
		//var game = Session.get('game');
		game.restart();
	},

	'click .icon-foot' : function(event) {
		console.log('==undo');
		//var game = Session.get('game');
		game.restart();
	}
});