/* © 2014 nau.com
 * @author Phuong Vo
 */
/**/
var game = null;

var mappingGameDonation = null;
Meteor.call('arrayMappingDonation', function(err, mapping) {
	mappingGameDonation = mapping;
});

var completeGame = function(result) {
	//var mapLevel = Session.get('mapLevel');
	setTimeout(function() {
		$('.modal-congratulation').modal('show');
	}, 400);
	console.log('win result ' + result);
	var mapId = result.mapIndex;

	//user already loggin
	var user = Meteor.user();
	if (user) {
		Meteor.users.updateUserData(user._id, result, mapId);
	} else {
		Session.set('temporaryUserData', result);
		if (mappingGameDonation) {
			Session.set('userLastPoint', mappingGameDonation[mapId.toString()]);
		}
	}
};

Template.PageGame.helpers({
	rendered: function() {
		//
		Session.set('showGame', true);
		//
		var mapId = Router.current().params.mapId;
		//

		if (parseInt(mapId, 10) >= 10) {
			Session.set('nextMapId', 1);
		} else {
			Session.set('nextMapId', parseInt(mapId, 10) + 1);
		}
		//
		Meteor.call('map', mapId, function(error, result) {
			//we parse the game and init the game
			game = new window.chungapp.Game();
			game.setJSONMapData(result.map, mapId);
			var mapLevel = result.mapLevel;
			Session.set('mapLevel', mapLevel);
			setTimeout(function() {
				Session.set('mapRendered', true);
			}, 1000);

			// console.log('result', result);
			Meteor.call('startGame', mapId);
			game.startGame();

			Session.set('game', game);
			Session.set('steps', 0);

			// game.getNumStep() -> mapResolver.getHistoryNum() is a reactive getter
			Tracker.autorun(function() {
				var steps = game ? game.getNumStep() : 0;
				Session.set('steps', steps);
			});

			// bind keyboard events, will move to an input controller
			$('body')
				.off('keyup keydown')
				.on({
					keydown: function(event) {
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
							var result = game['go' + direction]();
							if (result !== null) {
								completeGame(result);
							}
							event.preventDefault();
						}
					},
				});
		});
		return '';
	},
});

Template.PageGame.events({
	'click .control-top': function(/*event*/) {
		console.log('==move top');
		var result = game.goUp();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .control-left': function(/*event*/) {
		console.log('==move left');
		var result = game.goLeft();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .control-right': function(/*event*/) {
		console.log('==move right');
		var result = game.goRight();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .control-bottom': function(/*event*/) {
		console.log('==move bottom');
		var result = game.goDown();
		if (result !== null) {
			completeGame(result);
		}
	},

	'click .icon-reset': function(/*event*/) {
		console.log('==restart');
		game.restart();
	},

	'click .icon-back': function(/*event*/) {
		console.log('==undo');
		game.undo();
	},
});
