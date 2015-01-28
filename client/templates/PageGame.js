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
		console.log('result', result);
		game.startGame();

		Session.set('game', game);
		Session.set('steps', 0);

		// game.getNumStep() -> mapResolver.getHistoryNum() is a reactive getter
		Tracker.autorun(function() {
			var steps = game ? game.getNumStep() : 0;
			Session.set('steps', steps);
		});

		// bind keyboard events, will move to an input controller
		$('body').off('keyup keydown').on({
			'keyup': function(event) {
				console.log('keyup', event);
				var direction = '';

				switch (event.keyCode) {
					case 37:
						direction = 'Left';
						break;
					case 38:
						direction = 'Up';
						break;
					case 39:
						direction = 'Right';
						break;
					case 40:
						direction = 'Down';
				}

				if (direction && game) {
					game['go' + direction]();
					event.preventDefault();
				}
			},

			'keydown': function(event) {
				if (event.keyCode === 37 ||
					event.keyCode === 38 ||
					event.keyCode === 39 ||
					event.keyCode === 40)
				{
					// prevent overflow body to be scrolled by directional key event
					event.preventDefault();
				}
			}
		});
	});
};

Template.PageGame.helpers({

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