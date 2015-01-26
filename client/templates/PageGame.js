/* © 2014 nau.com
 * @author Phuong Vo
 */
var game = null;

Template.PageGame.rendered = function() {
	var mapId = Router.current().params.mapId;
	Meteor.call('map', mapId, function(error, result) {
		//we parse the game and init the game
		game = new window.chungapp.Game();
		game.setJSONMapData(result);
		game.startGame();

		Session.set('game', game);
	});
};

Template.PageGame.helpers({
	userStep: function() {
		return game ? game.getNumStep() : 0;
	},

	mapId: function() {
		return Router.current().params.mapId;
	}
});

Template.PageGame.events({
	'click .control-top' : function(/*event*/) {
		console.log('==move top');
		//var game = Session.get('game');
		game.goUp();
	},

	'click .control-left' : function(/*event*/) {
		console.log('==move left');
		//var game = Session.get('game');
		game.goLeft();
	},

	'click .control-right' : function(/*event*/) {
		console.log('==move right');
		//var game = Session.get('game');
		game.goRight();
	},

	'click .control-bottom' : function(/*event*/) {
		console.log('==move bottom');
		//var game = Session.get('game');
		game.goDown();
	},

	'click .icon-arrow' : function(/*event*/) {
		console.log('==restart');
		//var game = Session.get('game');
		game.restart();
	},

	'click .icon-back' : function(/*event*/) {
		console.log('==undo');
		//var game = Session.get('game');
		game.undo();
	}
});